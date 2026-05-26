import { Pool } from 'pg';

function bboxCenter(topology) {
  const [sx, sy] = topology.transform.scale;
  const [tx, ty] = topology.transform.translate;
  let minLon = Number.POSITIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  for (const arc of topology.arcs) {
    let x = 0;
    let y = 0;
    for (const [dx, dy] of arc) {
      x += dx;
      y += dy;
      const lon = x * sx + tx;
      const lat = y * sy + ty;
      minLon = Math.min(minLon, lon);
      minLat = Math.min(minLat, lat);
      maxLon = Math.max(maxLon, lon);
      maxLat = Math.max(maxLat, lat);
    }
  }

  return {
    lon: Number(((minLon + maxLon) / 2).toFixed(6)),
    lat: Number(((minLat + maxLat) / 2).toFixed(6)),
  };
}

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function municipalityUf(municipality) {
  return (
    municipality.microrregiao?.mesorregiao?.UF ??
    municipality['regiao-imediata']?.['regiao-intermediaria']?.UF
  );
}

const CAPITALS = new Set([
  'Rio Branco', 'Maceió', 'Macapá', 'Manaus', 'Salvador', 'Fortaleza', 'Brasília',
  'Vitória', 'Goiânia', 'São Luís', 'Cuiabá', 'Campo Grande', 'Belo Horizonte',
  'Belém', 'João Pessoa', 'Curitiba', 'Recife', 'Teresina', 'Rio de Janeiro',
  'Natal', 'Porto Velho', 'Boa Vista', 'Porto Alegre', 'Florianópolis', 'São Paulo',
  'Aracaju', 'Palmas',
]);

async function fetchMunicipalities() {
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome');
  if (!response.ok) throw new Error(`Failed to fetch IBGE municipalities: ${response.status}`);
  return response.json();
}

async function fetchTopology(id) {
  const response = await fetch(`https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${id}?formato=application/json`);
  if (!response.ok) throw new Error(`Failed to fetch IBGE malha for ${id}: ${response.status}`);
  return response.json();
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const current = cursor;
      cursor += 1;
      results[current] = await mapper(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL env var required');

  const pool = new Pool({ connectionString: url, max: 8 });

  try {
    const municipalities = await fetchMunicipalities();
    const valid = municipalities.filter((m) => municipalityUf(m) != null);
    console.log(`Processing ${valid.length} municipalities (${municipalities.length - valid.length} skipped — no UF data)...`);

    let seeded = 0;
    let failed = 0;

    await mapWithConcurrency(valid, 8, async (municipality) => {
      try {
        const uf = municipalityUf(municipality);
        const topology = await fetchTopology(municipality.id);
        const { lon, lat } = bboxCenter(topology);
        const slug = slugify(municipality.nome);
        const isCapital = CAPITALS.has(municipality.nome);

        await pool.query(
          `INSERT INTO seo.city (id, uf, name, slug, capital, populacao, lat, lon)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO UPDATE SET
             uf        = EXCLUDED.uf,
             name      = EXCLUDED.name,
             slug      = EXCLUDED.slug,
             capital   = EXCLUDED.capital,
             populacao = EXCLUDED.populacao,
             lat       = EXCLUDED.lat,
             lon       = EXCLUDED.lon,
             updated_at = now()`,
          [municipality.id, uf.sigla, municipality.nome, slug, isCapital, 0, lat, lon]
        );

        seeded += 1;
        if (seeded % 100 === 0) {
          console.log(`  ${seeded}/${valid.length} seeded...`);
        }
      } catch (error) {
        failed += 1;
        console.error(`  failed: ${municipality.nome} (${municipality.id}) — ${error.message}`);
      }
    });

    await pool.query(`INSERT INTO seo.schema_migrations (version) VALUES ('V004') ON CONFLICT DO NOTHING`);

    console.log(`City seed complete. ${seeded} seeded, ${failed} failed.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

import { Pool } from 'pg';
import { CITY_SEEDS } from './city-seed-data.mjs';

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

async function main() {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL env var required');

  const pool = new Pool({ connectionString: url, max: 1 });

  try {
    const municipalities = await fetchMunicipalities();
    const byNameUf = new Map(
      municipalities.map((m) => {
        const uf = m.microrregiao?.mesorregiao?.UF?.sigla ?? m['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla;
        if (!uf) {
          throw new Error(`Missing UF for municipality ${m.nome}`);
        }
        return [`${uf}:${m.nome}`, m];
      })
    );

    for (const seed of CITY_SEEDS) {
      const municipality = byNameUf.get(`${seed.uf.toUpperCase()}:${seed.city}`);
      if (!municipality) {
        throw new Error(`Municipality not found in IBGE API: ${seed.uf.toUpperCase()} / ${seed.city}`);
      }

      const topology = await fetchTopology(municipality.id);
      const { lon, lat } = bboxCenter(topology);

      await pool.query(
        `
          INSERT INTO seo.city (
            id, uf, name, slug, capital, populacao, pib_per_capita, renda_media,
            lat, lon, meso_id, micro_id, rm_id, ibge_updated_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, NULL, NULL,
            $7, $8, NULL, NULL, NULL, NULL
          )
          ON CONFLICT (id) DO UPDATE SET
            uf = EXCLUDED.uf,
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            capital = EXCLUDED.capital,
            populacao = EXCLUDED.populacao,
            lat = EXCLUDED.lat,
            lon = EXCLUDED.lon,
            updated_at = now()
        `,
        [
          municipality.id,
          seed.uf.toUpperCase(),
          municipality.nome,
          seed.slug,
          seed.isCapital,
          seed.population,
          lat,
          lon,
        ]
      );

      console.log(`seeded ${seed.city} (${municipality.id})`);
    }

    console.log('City seed complete.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

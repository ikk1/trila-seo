import { writeFile } from 'fs/promises';
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

async function main() {
  const municipalities = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome').then((r) => r.json());
  const byNameUf = new Map(
    municipalities.map((m) => {
      const uf = m.microrregiao?.mesorregiao?.UF?.sigla ?? m['regiao-imediata']?.['regiao-intermediaria']?.UF?.sigla;
      if (!uf) {
        throw new Error(`Missing UF for municipality ${m.nome}`);
      }
      return [`${uf}:${m.nome}`, m];
    })
  );

  const rows = [];
  for (const seed of CITY_SEEDS) {
    const municipality = byNameUf.get(`${seed.uf.toUpperCase()}:${seed.city}`);
    if (!municipality) throw new Error(`Missing IBGE municipality for ${seed.uf}/${seed.city}`);
    const topology = await fetch(
      `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${municipality.id}?formato=application/json`
    ).then((r) => r.json());
    const { lon, lat } = bboxCenter(topology);
    rows.push(
      `  (${municipality.id}, '${seed.uf.toUpperCase()}', '${municipality.nome.replace(/'/g, "''")}', '${seed.slug}', ${seed.isCapital ? 'true' : 'false'}, ${seed.population}, ${lat.toFixed(6)}, ${lon.toFixed(6)})`
    );
  }

  const sql = `-- migrations/V004__seo_seed_cities.sql\nINSERT INTO seo.city (id, uf, name, slug, capital, populacao, lat, lon) VALUES\n${rows.join(',\n')}\nON CONFLICT (id) DO UPDATE SET\n  uf = EXCLUDED.uf,\n  name = EXCLUDED.name,\n  slug = EXCLUDED.slug,\n  capital = EXCLUDED.capital,\n  populacao = EXCLUDED.populacao,\n  lat = EXCLUDED.lat,\n  lon = EXCLUDED.lon,\n  updated_at = now();\n\nINSERT INTO seo.schema_migrations (version) VALUES ('V004') ON CONFLICT DO NOTHING;\n`;

  await writeFile(new URL('../migrations/V004__seo_seed_cities.sql', import.meta.url), sql, 'utf8');
  console.log('Wrote migrations/V004__seo_seed_cities.sql');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

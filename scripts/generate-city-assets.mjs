import { writeFile } from 'fs/promises';

const OUTPUT_LIMIT = 100;
const REGION_LABELS = {
  N: 'Norte',
  NE: 'Nordeste',
  CO: 'Centro-Oeste',
  SE: 'Sudeste',
  S: 'Sul',
};

function slugify(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatPopulationLabel(population) {
  if (population >= 1_000_000) {
    return `cerca de ${(population / 1_000_000).toFixed(1).replace('.', ',')} milhão${population >= 2_000_000 ? 'es' : ''} de habitantes`;
  }
  return `cerca de ${new Intl.NumberFormat('pt-BR').format(population)} habitantes`;
}

function buildMarketNote(rank, capital, population) {
  if (capital && population >= 1_000_000) {
    return 'Capital com mercado forte, operação urbana intensa e boa aderência a rotinas mais estruturadas.';
  }
  if (capital) {
    return 'Capital com relevância regional e oportunidade clara para posicionamento local.';
  }
  if (rank <= 20) {
    return 'Mercado grande e competitivo, com espaço para SEO local e operação previsível.';
  }
  if (rank <= 50) {
    return 'Cidade relevante para expansão regional com foco em agenda, recorrência e produtividade.';
  }
  return 'Mercado em crescimento com potencial para páginas locais de aquisição e validação orgânica.';
}

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
  if (!response.ok) throw new Error(`Failed to fetch municipalities: ${response.status}`);
  return response.json();
}

async function fetchPopulations() {
  const response = await fetch('https://apisidra.ibge.gov.br/values/t/4714/n6/all/v/93/p/2022?formato=json');
  if (!response.ok) throw new Error(`Failed to fetch populations: ${response.status}`);
  return response.json();
}

async function fetchTopology(id) {
  const response = await fetch(`https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${id}?formato=application/json`);
  if (!response.ok) throw new Error(`Failed to fetch topology for ${id}: ${response.status}`);
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

function municipalityUf(municipality) {
  return (
    municipality.microrregiao?.mesorregiao?.UF ??
    municipality['regiao-imediata']?.['regiao-intermediaria']?.UF
  );
}

function municipalityRegionCode(municipality) {
  return municipalityUf(municipality)?.regiao?.sigla;
}

function cityTs(entries) {
  return `export interface CityEntry {
  uf: string;
  city: string;
  slug: string;
  region: string;
  population: number;
  populationLabel: string;
  isCapital: boolean;
  marketNote: string;
}

export const CITIES: CityEntry[] = [
${entries
  .map(
    (entry) => `  {
    uf: '${entry.uf}',
    city: ${JSON.stringify(entry.city)},
    slug: '${entry.slug}',
    region: ${JSON.stringify(entry.region)},
    population: ${entry.population},
    populationLabel: ${JSON.stringify(entry.populationLabel)},
    isCapital: ${entry.isCapital ? 'true' : 'false'},
    marketNote: ${JSON.stringify(entry.marketNote)},
  }`
  )
  .join(',\n')}
];

export function getCityEntry(uf: string, city: string) {
  return CITIES.find((entry) => entry.uf === uf && entry.slug === city);
}
`;
}

function citySeedDataMjs(entries) {
  return `export const CITY_SEEDS = [
${entries
  .map(
    (entry) =>
      `  { uf: '${entry.uf}', city: ${JSON.stringify(entry.city)}, slug: '${entry.slug}', region: ${JSON.stringify(entry.region)}, population: ${entry.population}, isCapital: ${entry.isCapital ? 'true' : 'false'} }`
  )
  .join(',\n')}
];
`;
}

function migrationSql(entries) {
  const rows = entries.map(
    (entry) =>
      `  (${entry.id}, '${entry.uf.toUpperCase()}', '${entry.city.replace(/'/g, "''")}', '${entry.slug}', ${entry.isCapital ? 'true' : 'false'}, ${entry.population}, ${entry.lat.toFixed(6)}, ${entry.lon.toFixed(6)})`
  );

  return `-- migrations/V005__seo_expand_cities_top_100.sql
INSERT INTO seo.city (id, uf, name, slug, capital, populacao, lat, lon) VALUES
${rows.join(',\n')}
ON CONFLICT (id) DO UPDATE SET
  uf = EXCLUDED.uf,
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  capital = EXCLUDED.capital,
  populacao = EXCLUDED.populacao,
  lat = EXCLUDED.lat,
  lon = EXCLUDED.lon,
  updated_at = now();

INSERT INTO seo.schema_migrations (version) VALUES ('V005') ON CONFLICT DO NOTHING;
`;
}

async function main() {
  const municipalities = await fetchMunicipalities();
  const populationRows = await fetchPopulations();

  const populationById = new Map(
    populationRows
      .slice(1)
      .map((row) => [Number(row.D1C), Number(row.V)])
      .filter(([, value]) => Number.isFinite(value))
  );

  const capitals = new Set([
    'Rio Branco', 'Maceió', 'Macapá', 'Manaus', 'Salvador', 'Fortaleza', 'Brasília',
    'Vitória', 'Goiânia', 'São Luís', 'Cuiabá', 'Campo Grande', 'Belo Horizonte',
    'Belém', 'João Pessoa', 'Curitiba', 'Recife', 'Teresina', 'Rio de Janeiro',
    'Natal', 'Porto Velho', 'Boa Vista', 'Porto Alegre', 'Florianópolis', 'São Paulo',
    'Aracaju', 'Palmas',
  ]);

  const merged = municipalities
    .map((municipality) => {
      const uf = municipalityUf(municipality);
      const population = populationById.get(Number(municipality.id));
      if (!uf || !population) return null;
      const regionCode = municipalityRegionCode(municipality);
      return {
        id: Number(municipality.id),
        uf: uf.sigla.toLowerCase(),
        city: municipality.nome,
        slug: slugify(municipality.nome),
        region: REGION_LABELS[regionCode] ?? 'Brasil',
        population,
        isCapital: capitals.has(municipality.nome),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.population - a.population || a.city.localeCompare(b.city, 'pt-BR'))
    .slice(0, OUTPUT_LIMIT)
    .map((entry, index) => ({
      ...entry,
      populationLabel: formatPopulationLabel(entry.population),
      marketNote: buildMarketNote(index + 1, entry.isCapital, entry.population),
    }));

  const withCoords = await mapWithConcurrency(merged, 8, async (entry) => {
    const topology = await fetchTopology(entry.id);
    const { lat, lon } = bboxCenter(topology);
    return { ...entry, lat, lon };
  });

  await writeFile(new URL('../lib/cities.ts', import.meta.url), cityTs(withCoords), 'utf8');
  await writeFile(new URL('./city-seed-data.mjs', import.meta.url), citySeedDataMjs(withCoords), 'utf8');
  await writeFile(new URL('../migrations/V005__seo_expand_cities_top_100.sql', import.meta.url), migrationSql(withCoords), 'utf8');
  console.log(`Generated assets for ${withCoords.length} cities.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

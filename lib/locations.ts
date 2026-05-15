import { getDbPool } from './db';
import { CITIES, type CityEntry } from './cities';

export type ResolvedCityEntry = CityEntry & {
  source: 'catalog' | 'seo.city';
  populationValue?: number;
};

function formatPopulation(population?: number) {
  if (!population) return 'mercado em expansão';
  return `cerca de ${new Intl.NumberFormat('pt-BR').format(population)} habitantes`;
}

function mapDbRow(row: {
  uf: string;
  name: string;
  slug: string;
  capital: boolean;
  populacao: number;
  region: string;
}): ResolvedCityEntry {
  return {
    uf: row.uf.toLowerCase(),
    city: row.name,
    slug: row.slug,
    region: row.region,
    populationLabel: formatPopulation(row.populacao),
    isCapital: row.capital,
    marketNote: row.capital
      ? 'Capital com maior densidade de negócios e necessidade de operação previsível.'
      : 'Mercado regional relevante para ganho de escala com gestão mais organizada.',
    source: 'seo.city',
    populationValue: row.populacao,
  };
}

export async function loadCities(): Promise<ResolvedCityEntry[]> {
  if (!process.env.SEO_DB_URL) {
    return CITIES.map((city) => ({ ...city, source: 'catalog' as const }));
  }

  try {
    const pool = getDbPool();
    const { rows } = await pool.query<{
      uf: string;
      name: string;
      slug: string;
      capital: boolean;
      populacao: number;
      region: string;
    }>(`
      SELECT c.uf, c.name, c.slug, c.capital, c.populacao, u.region
      FROM seo.city c
      JOIN seo.uf u ON u.code = c.uf
      ORDER BY c.populacao DESC, c.name ASC
      LIMIT 200
    `);

    if (!rows.length) {
      return CITIES.map((city) => ({ ...city, source: 'catalog' as const }));
    }

    return rows.map(mapDbRow);
  } catch {
    return CITIES.map((city) => ({ ...city, source: 'catalog' as const }));
  }
}

export async function loadCity(uf: string, citySlug: string): Promise<ResolvedCityEntry | null> {
  const cities = await loadCities();
  return cities.find((entry) => entry.uf === uf && entry.slug === citySlug) ?? null;
}

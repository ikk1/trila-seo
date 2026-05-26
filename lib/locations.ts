import { getDbPool } from './db';
import { CITIES, type CityEntry } from './cities';

export type ResolvedCityEntry = CityEntry & {
  source: 'catalog' | 'seo.city';
};

function formatPopulation(population?: number) {
  if (!population) return 'mercado em expansão';
  return `cerca de ${new Intl.NumberFormat('pt-BR').format(population)} habitantes`;
}

function mapDbRow(row: {
  id: number;
  uf: string;
  name: string;
  slug: string;
  capital: boolean;
  populacao: number;
  region: string;
}): ResolvedCityEntry {
  return {
    uf: row.uf.toLowerCase(),
    id: row.id,
    city: row.name,
    slug: row.slug,
    region: row.region,
    population: row.populacao,
    populationLabel: formatPopulation(row.populacao),
    isCapital: row.capital,
    marketNote: row.capital
      ? 'Capital com maior densidade de negócios e necessidade de operação previsível.'
      : 'Mercado regional relevante para ganho de escala com gestão mais organizada.',
    source: 'seo.city',
  };
}

async function queryCities(limit?: number): Promise<ResolvedCityEntry[]> {
  if (!process.env.SEO_DB_URL) {
    const cities = CITIES.map((city) => ({ ...city, source: 'catalog' as const }));
    return limit ? cities.slice(0, limit) : cities;
  }

  try {
    const pool = getDbPool();
    const { rows } = await pool.query<{
      id: number;
      uf: string;
      name: string;
      slug: string;
      capital: boolean;
      populacao: number;
      region: string;
    }>(
      limit
        ? `SELECT c.id, c.uf, c.name, c.slug, c.capital, c.populacao, u.region
           FROM seo.city c
           JOIN seo.uf u ON u.code = c.uf
           ORDER BY c.populacao DESC, c.name ASC
           LIMIT ${limit}`
        : `SELECT c.id, c.uf, c.name, c.slug, c.capital, c.populacao, u.region
           FROM seo.city c
           JOIN seo.uf u ON u.code = c.uf
           ORDER BY c.populacao DESC, c.name ASC`
    );

    if (!rows.length) {
      const cities = CITIES.map((city) => ({ ...city, source: 'catalog' as const }));
      return limit ? cities.slice(0, limit) : cities;
    }

    return rows.map(mapDbRow);
  } catch {
    const cities = CITIES.map((city) => ({ ...city, source: 'catalog' as const }));
    return limit ? cities.slice(0, limit) : cities;
  }
}

/** Top 500 cities — used for generateStaticParams (pre-build). */
export async function loadCities(): Promise<ResolvedCityEntry[]> {
  return queryCities(500);
}

/** All cities — used for sitemap generation only. */
export async function loadAllCities(): Promise<ResolvedCityEntry[]> {
  return queryCities();
}

export async function loadCity(uf: string, citySlug: string): Promise<ResolvedCityEntry | null> {
  const cities = await loadCities();
  return cities.find((entry) => entry.uf === uf && entry.slug === citySlug) ?? null;
}

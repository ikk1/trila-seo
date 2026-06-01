import { cache } from 'react';
import { getDbPool } from './db';
import { CITIES, type CityEntry } from './cities';

export type ResolvedCityEntry = CityEntry & {
  source: 'catalog' | 'seo.city';
};

function formatPopulation(population?: number) {
  if (!population) return 'mercado em expansão';
  return `cerca de ${new Intl.NumberFormat('pt-BR').format(population)} habitantes`;
}

function sizeTier(pop: number): string {
  if (pop >= 1_000_000) return 'grande centro urbano';
  if (pop >= 300_000) return 'cidade de médio-grande porte';
  if (pop >= 100_000) return 'cidade de médio porte';
  if (pop >= 30_000) return 'município de porte regional';
  return 'mercado local em estruturação';
}

function buildMarketNote(name: string, region: string, capital: boolean, pop: number): string {
  const tier = sizeTier(pop);
  if (capital) {
    return `Capital da região ${region} e ${tier}, com demanda urbana intensa e boa aderência a uma operação mais estruturada.`;
  }
  return `${name} é ${tier} na região ${region}, onde organizar agenda, financeiro e recorrência tende a destravar crescimento.`;
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
    marketNote: buildMarketNote(row.name, row.region, row.capital, row.populacao),
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

function catalogCity(uf: string, citySlug: string): ResolvedCityEntry | null {
  const found = CITIES.find((c) => c.uf === uf && c.slug === citySlug);
  return found ? { ...found, source: 'catalog' } : null;
}

/** Carrega UMA cidade por (uf, slug) direto do DB — sem o teto de 500. */
export const loadCity = cache(async function loadCity(uf: string, citySlug: string): Promise<ResolvedCityEntry | null> {
  if (!process.env.SEO_DB_URL) {
    return catalogCity(uf, citySlug);
  }

  try {
    const pool = getDbPool();
    const { rows } = await pool.query<{
      id: number; uf: string; name: string; slug: string;
      capital: boolean; populacao: number; region: string;
    }>(
      `SELECT c.id, c.uf, c.name, c.slug, c.capital, c.populacao, u.region
         FROM seo.city c
         JOIN seo.uf u ON u.code = c.uf
        WHERE c.uf = upper($1) AND c.slug = $2
        LIMIT 1`,
      [uf, citySlug]
    );

    if (!rows.length) {
      return catalogCity(uf, citySlug);
    }
    return mapDbRow(rows[0]);
  } catch {
    return catalogCity(uf, citySlug);
  }
});

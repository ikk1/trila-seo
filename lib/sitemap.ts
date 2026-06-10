// lib/sitemap.ts
// Fonte única do sitemap — gerado em RUNTIME (route handlers com ISR), pois o
// build do Railway não alcança o Postgres interno. id 0 = estático+verticais,
// id 1 = cidades, id 2..N = pares cidade×vertical em chunks de CHUNK_SIZE.
import { loadAllCities } from './locations';
import { VERTICALS } from './verticals';
import { CITY_INDEX_POPULATION_THRESHOLD } from './city-pages';
import { SITE_URL, DEFAULT_LAST_MODIFIED } from './site';

export const CHUNK_SIZE = 5_000;

// Só promovemos no sitemap cidades que o template de fato indexa por porte (mesmo
// limiar do noindex em shouldIndexCityVertical: população >= limiar OU capital).
// Promover ~61k páginas programáticas órfãs num domínio novo trava tudo em
// "Discovered - currently not indexed" (o Google não gasta crawl budget). O long
// tail continua acessível (loadCity não tem teto) e entra em ondas. Mesma fonte
// em getSitemapIds e getSitemapChunk para a contagem de chunks bater com o conteúdo.
async function loadSitemapCities() {
  const cities = await loadAllCities();
  return cities.filter(
    (city) => city.population >= CITY_INDEX_POPULATION_THRESHOLD || city.isCapital
  );
}

export async function getSitemapIds(): Promise<number[]> {
  const cities = await loadSitemapCities();
  const chunks = Math.ceil((cities.length * VERTICALS.length) / CHUNK_SIZE);
  return [0, 1, ...Array.from({ length: chunks }, (_, i) => i + 2)];
}

function cityPriorities(population: number): { hub: number; vertical: number } {
  if (population >= 500_000) return { hub: 0.8, vertical: 0.75 };
  if (population >= 100_000) return { hub: 0.75, vertical: 0.7 };
  return { hub: 0.65, vertical: 0.6 };
}

export type SitemapEntry = { loc: string; changefreq: string; priority: number };

export async function getSitemapChunk(id: number): Promise<SitemapEntry[]> {
  if (id === 0) {
    return [
      { loc: SITE_URL, changefreq: 'weekly', priority: 1 },
      { loc: `${SITE_URL}/planos`, changefreq: 'weekly', priority: 0.9 },
      { loc: `${SITE_URL}/cidades`, changefreq: 'weekly', priority: 0.85 },
      ...VERTICALS.map((v) => ({
        loc: `${SITE_URL}/sistema-para-${v.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
      })),
    ];
  }

  const cities = await loadSitemapCities();

  if (id === 1) {
    return cities.map((city) => ({
      loc: `${SITE_URL}/${city.uf}/${city.slug}`,
      changefreq: 'monthly',
      priority: cityPriorities(city.population).hub,
    }));
  }

  const pairs = cities.flatMap((city) => VERTICALS.map((vertical) => ({ city, vertical })));
  const start = (id - 2) * CHUNK_SIZE;
  return pairs.slice(start, start + CHUNK_SIZE).map(({ city, vertical }) => ({
    loc: `${SITE_URL}/${city.uf}/${city.slug}/${vertical.slug}`,
    changefreq: 'monthly',
    priority: cityPriorities(city.population).vertical,
  }));
}

export function renderUrlset(entries: SitemapEntry[]): string {
  const lastmod = DEFAULT_LAST_MODIFIED.toISOString();
  const urls = entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${e.loc}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n');
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
}

// lib/sitemap.ts
// Fonte única dos sitemaps — gerada em RUNTIME (route handlers), pois o build do
// Railway não alcança o Postgres interno. Segmentos nomeados por tipo:
//   core.xml      -> páginas institucionais
//   verticais.xml -> /sistema-para-{vertical}
//   locais.xml    -> cidades-hub + pares cidade×vertical (paginado em locais-N.xml)
import { loadAllCities } from './locations';
import { listGuides } from './guides';
import { VERTICALS } from './verticals';
import { CITY_INDEX_POPULATION_THRESHOLD } from './city-pages';
import { SITE_URL, SITEMAP_LASTMOD } from './site';

export const LOCAIS_CHUNK_SIZE = 45_000;

export type SitemapEntry = { loc: string; changefreq: string; priority: number };

// Só promovemos cidades que o template de fato indexa por porte (mesmo limiar do
// noindex em shouldIndexCityVertical: população >= limiar OU capital). Promover
// páginas programáticas órfãs num domínio novo trava tudo em "Discovered - currently
// not indexed". O long tail continua acessível e entra em ondas.
async function loadSitemapCities() {
  const cities = await loadAllCities();
  return cities.filter(
    (city) => city.population >= CITY_INDEX_POPULATION_THRESHOLD || city.isCapital,
  );
}

function cityPriorities(population: number): { hub: number; vertical: number } {
  if (population >= 500_000) return { hub: 0.8, vertical: 0.75 };
  if (population >= 100_000) return { hub: 0.75, vertical: 0.7 };
  return { hub: 0.65, vertical: 0.6 };
}

export function getCoreEntries(): SitemapEntry[] {
  return [
    { loc: SITE_URL, changefreq: 'weekly', priority: 1 },
    { loc: `${SITE_URL}/planos`, changefreq: 'weekly', priority: 0.9 },
    { loc: `${SITE_URL}/cidades`, changefreq: 'weekly', priority: 0.85 },
    { loc: `${SITE_URL}/inteligencia-artificial`, changefreq: 'monthly', priority: 0.8 },
  ];
}

export function getVerticaisEntries(): SitemapEntry[] {
  return VERTICALS.map((v) => ({
    loc: `${SITE_URL}/sistema-para-${v.slug}`,
    changefreq: 'monthly',
    priority: 0.8,
  }));
}

export function getGuiasEntries(): SitemapEntry[] {
  const guides = listGuides();
  const verticais = [...new Set(guides.map((g) => g.vertical))];
  const entries: SitemapEntry[] = [
    { loc: `${SITE_URL}/guias`, changefreq: 'monthly', priority: 0.7 },
    ...verticais.map((v) => ({
      loc: `${SITE_URL}/guias/${v}`,
      changefreq: 'monthly',
      priority: 0.7,
    })),
    ...guides.map((g) => ({
      loc: `${SITE_URL}/guias/${g.vertical}/${g.topic}`,
      changefreq: 'monthly',
      priority: 0.6,
    })),
  ];
  return entries;
}

export async function getLocaisEntries(): Promise<SitemapEntry[]> {
  const cities = await loadSitemapCities();
  const hubs = cities.map((city) => ({
    loc: `${SITE_URL}/${city.uf}/${city.slug}`,
    changefreq: 'monthly',
    priority: cityPriorities(city.population).hub,
  }));
  const pairs = cities.flatMap((city) =>
    VERTICALS.map((vertical) => ({
      loc: `${SITE_URL}/${city.uf}/${city.slug}/${vertical.slug}`,
      changefreq: 'monthly',
      priority: cityPriorities(city.population).vertical,
    })),
  );
  return [...hubs, ...pairs];
}

export async function getLocaisPageCount(): Promise<number> {
  const entries = await getLocaisEntries();
  return Math.max(1, Math.ceil(entries.length / LOCAIS_CHUNK_SIZE));
}

export async function getLocaisPage(page: number): Promise<SitemapEntry[]> {
  const entries = await getLocaisEntries();
  const start = (page - 1) * LOCAIS_CHUNK_SIZE;
  return entries.slice(start, start + LOCAIS_CHUNK_SIZE);
}

export async function getSitemapIndex(): Promise<string[]> {
  const paths = [
    '/sitemaps/core.xml',
    '/sitemaps/verticais.xml',
    '/sitemaps/guias.xml',
    '/sitemaps/locais.xml',
  ];
  const pages = await getLocaisPageCount();
  for (let p = 2; p <= pages; p++) {
    paths.push(`/sitemaps/locais-${p}.xml`);
  }
  return paths;
}

export function renderUrlset(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n` +
        `    <loc>${e.loc}</loc>\n` +
        `    <lastmod>${SITEMAP_LASTMOD}</lastmod>\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n');
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`
  );
}

export function renderSitemapIndex(paths: string[]): string {
  const entries = paths
    .map(
      (path) =>
        `  <sitemap>\n` +
        `    <loc>${SITE_URL}${path}</loc>\n` +
        `    <lastmod>${SITEMAP_LASTMOD}</lastmod>\n` +
        `  </sitemap>`,
    )
    .join('\n');
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries}\n` +
    `</sitemapindex>\n`
  );
}

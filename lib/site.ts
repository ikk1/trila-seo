export const SITE_URL = 'https://trila.app.br';
export const APP_URL = 'https://sistema.trila.app.br';
export const BRAND_NAME = 'Trila';
export const DEFAULT_OG_IMAGE = '/og-default.png';
export const DEFAULT_LAST_MODIFIED = new Date();

// Limiar de população para entrar no sitemap. Promover ~61k páginas programáticas
// num domínio novo faz o Google parar em "Discovered - currently not indexed" (não
// gasta crawl budget). Concentramos em cidades >= 100k hab (~300), que já têm linking
// interno (home -> /cidades -> hub da cidade -> verticais). O long tail continua
// acessível (loadCity não tem teto) e entra em ondas conforme a autoridade cresce.
export const MIN_SITEMAP_POPULATION = 100_000;

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

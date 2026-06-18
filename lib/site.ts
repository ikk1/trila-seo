export const SITE_URL = 'https://trila.app.br';
export const APP_URL = 'https://sistema.trila.app.br';
export const BRAND_NAME = 'Trila';
export const DEFAULT_OG_IMAGE = '/og-default.png';

// Data de última modificação dos sitemaps. Estável entre cold starts (ao contrário
// de `new Date()`, que mudava a cada boot e fazia o Google desconfiar do lastmod).
// Bumpar à mão quando o conteúdo dos templates de sitemap mudar de fato.
export const SITEMAP_LASTMOD = '2026-06-18T00:00:00.000Z';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

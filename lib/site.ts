export const SITE_URL = 'https://trila.app.br';
export const APP_URL = 'https://sistema.trila.app.br';
export const BRAND_NAME = 'Trila';
export const DEFAULT_OG_IMAGE = '/og-default.png';
export const DEFAULT_LAST_MODIFIED = new Date();

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

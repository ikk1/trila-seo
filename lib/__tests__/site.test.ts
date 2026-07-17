import { describe, it, expect } from 'vitest';
import { SITEMAP_LASTMOD, APP_URL, buildRegisterUrl } from '@/lib/site';

describe('SITEMAP_LASTMOD', () => {
  it('é uma string ISO 8601 válida e estável', () => {
    expect(typeof SITEMAP_LASTMOD).toBe('string');
    expect(SITEMAP_LASTMOD).toBe(new Date(SITEMAP_LASTMOD).toISOString());
  });
});

describe('buildRegisterUrl', () => {
  it('aponta para /register do app com UTMs orgânicas por padrão', () => {
    const url = new URL(buildRegisterUrl('home'));
    expect(`${url.origin}${url.pathname}`).toBe(`${APP_URL}/register`);
    expect(url.searchParams.get('utm_source')).toBe('site');
    expect(url.searchParams.get('utm_medium')).toBe('organic');
    expect(url.searchParams.get('utm_campaign')).toBe('home');
  });

  it('aceita source/medium customizados (caso das LPs de Ads)', () => {
    const url = new URL(buildRegisterUrl('lp-barbearia', { source: 'google', medium: 'cpc' }));
    expect(url.searchParams.get('utm_source')).toBe('google');
    expect(url.searchParams.get('utm_medium')).toBe('cpc');
  });
});

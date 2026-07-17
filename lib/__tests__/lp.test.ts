import { describe, it, expect } from 'vitest';
import {
  LP_VERTICAL_SLUGS,
  isLpVertical,
  buildLpRegisterUrl,
  isLpPath,
  LP_HERO_COPY,
} from '@/lib/lp';
import { APP_URL } from '@/lib/site';
import { VERTICALS } from '@/lib/verticals';

describe('landing pages de Ads', () => {
  it('expõe barbearia e salão como verticais com LP', () => {
    expect(LP_VERTICAL_SLUGS).toContain('barbearia');
    expect(LP_VERTICAL_SLUGS).toContain('salao-de-beleza');
  });

  it('isLpVertical reconhece só os slugs com LP', () => {
    expect(isLpVertical('barbearia')).toBe(true);
    expect(isLpVertical('salao-de-beleza')).toBe(true);
    expect(isLpVertical('spa')).toBe(true);
    expect(isLpVertical('inexistente')).toBe(false);
  });

  it('buildLpRegisterUrl aponta para o /register do app com UTMs de atribuição', () => {
    const url = new URL(buildLpRegisterUrl('barbearia'));
    expect(`${url.origin}${url.pathname}`).toBe(`${APP_URL}/register`);
    expect(url.searchParams.get('utm_source')).toBe('google');
    expect(url.searchParams.get('utm_medium')).toBe('cpc');
    expect(url.searchParams.get('utm_campaign')).toBe('lp-barbearia');
  });

  it('cada vertical gera uma campaign UTM própria', () => {
    expect(new URL(buildLpRegisterUrl('salao-de-beleza')).searchParams.get('utm_campaign')).toBe(
      'lp-salao-de-beleza',
    );
  });

  it('isLpPath identifica rotas de LP (onde o header/footer somem)', () => {
    expect(isLpPath('/lp/barbearia')).toBe(true);
    expect(isLpPath('/lp')).toBe(true);
    expect(isLpPath('/sistema-para/barbearia')).toBe(false);
    expect(isLpPath('/')).toBe(false);
    expect(isLpPath(null)).toBe(false);
  });

  it('toda vertical com LP tem copy de hero completa', () => {
    for (const slug of LP_VERTICAL_SLUGS) {
      const copy = LP_HERO_COPY[slug];
      expect(copy, `copy de ${slug}`).toBeDefined();
      expect(copy.eyebrow.length).toBeGreaterThan(0);
      expect(copy.headline.length).toBeGreaterThan(0);
      expect(copy.subheadline.length).toBeGreaterThan(0);
      expect(copy.services.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('toda vertical do site tem LP de Ads', () => {
    const lpSlugs = [...LP_VERTICAL_SLUGS];
    for (const v of VERTICALS) {
      expect(lpSlugs).toContain(v.slug);
    }
  });

  it('toda LP tem copy completa e sem promessa de WhatsApp', () => {
    for (const slug of LP_VERTICAL_SLUGS) {
      const copy = LP_HERO_COPY[slug];
      expect(copy.headline.length).toBeGreaterThan(10);
      expect(copy.services.length).toBeGreaterThanOrEqual(3);
      const all = `${copy.eyebrow} ${copy.headline} ${copy.subheadline}`.toLowerCase();
      expect(all).not.toMatch(/whats|zap|sms/);
    }
  });
});

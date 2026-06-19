import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCities = vi.hoisted(() => ({ value: [] as any[] }));

vi.mock('@/lib/locations', () => ({
  loadAllCities: vi.fn(async () => mockCities.value),
}));

import {
  getCoreEntries,
  getVerticaisEntries,
  getLocaisEntries,
  getLocaisPageCount,
  getSitemapIndex,
  renderUrlset,
  renderSitemapIndex,
} from '@/lib/sitemap';
import { VERTICALS } from '@/lib/verticals';
import { SITE_URL } from '@/lib/site';

function city(over: Partial<any>) {
  return { uf: 'sp', slug: 'x', city: 'X', population: 0, isCapital: false, region: 'Sudeste', ...over };
}

beforeEach(() => {
  mockCities.value = [];
});

describe('getCoreEntries', () => {
  it('inclui home, planos, cidades e inteligencia-artificial', () => {
    const locs = getCoreEntries().map((e) => e.loc);
    expect(locs).toContain(SITE_URL);
    expect(locs).toContain(`${SITE_URL}/planos`);
    expect(locs).toContain(`${SITE_URL}/cidades`);
    expect(locs).toContain(`${SITE_URL}/inteligencia-artificial`);
  });
});

describe('getVerticaisEntries', () => {
  it('gera uma URL por vertical', () => {
    const entries = getVerticaisEntries();
    expect(entries).toHaveLength(VERTICALS.length);
    expect(entries[0].loc).toBe(`${SITE_URL}/sistema-para-${VERTICALS[0].slug}`);
  });
});

describe('getLocaisEntries', () => {
  it('só inclui cidade com pop >= 100k ou capital', async () => {
    mockCities.value = [
      city({ slug: 'grande', population: 200_000 }),
      city({ slug: 'capital-pequena', population: 5_000, isCapital: true }),
      city({ slug: 'pequena', population: 5_000, isCapital: false }),
    ];
    const locs = (await getLocaisEntries()).map((e) => e.loc);
    expect(locs.some((l) => l.includes('/grande'))).toBe(true);
    expect(locs.some((l) => l.includes('/capital-pequena'))).toBe(true);
    expect(locs.some((l) => l.includes('/pequena'))).toBe(false);
  });

  it('gera hub + um par por vertical para cada cidade elegível', async () => {
    mockCities.value = [city({ slug: 'grande', population: 200_000 })];
    const entries = await getLocaisEntries();
    // 1 hub + N verticais
    expect(entries).toHaveLength(1 + VERTICALS.length);
    expect(entries[0].loc).toBe(`${SITE_URL}/sp/grande`);
  });
});

describe('paginação de locais', () => {
  it('uma página quando abaixo do limiar', async () => {
    mockCities.value = [city({ slug: 'grande', population: 200_000 })];
    expect(await getLocaisPageCount()).toBe(1);
    const index = await getSitemapIndex();
    expect(index).toEqual(['/sitemaps/core.xml', '/sitemaps/verticais.xml', '/sitemaps/guias.xml', '/sitemaps/locais.xml']);
  });

  it('divide em locais-2.xml quando passa de 45k URLs', async () => {
    // 6000 cidades -> 6000 hubs + 6000*VERTICALS pares > 45k
    mockCities.value = Array.from({ length: 6000 }, (_, i) =>
      city({ slug: `c${i}`, population: 200_000 }),
    );
    expect(await getLocaisPageCount()).toBeGreaterThanOrEqual(2);
    const index = await getSitemapIndex();
    expect(index).toContain('/sitemaps/locais.xml');
    expect(index).toContain('/sitemaps/locais-2.xml');
  });
});

describe('renderização XML', () => {
  it('renderUrlset produz urlset bem-formado', () => {
    const xml = renderUrlset([{ loc: `${SITE_URL}/planos`, changefreq: 'weekly', priority: 0.9 }]);
    expect(xml).toContain('<urlset');
    expect(xml).toContain(`<loc>${SITE_URL}/planos</loc>`);
    expect(xml).toContain('<changefreq>weekly</changefreq>');
    expect(xml).toContain('<priority>0.9</priority>');
    expect(xml).toContain('<lastmod>');
  });

  it('renderSitemapIndex aponta para os filhos por nome', () => {
    const xml = renderSitemapIndex(['/sitemaps/core.xml']);
    expect(xml).toContain('<sitemapindex');
    expect(xml).toContain(`<loc>${SITE_URL}/sitemaps/core.xml</loc>`);
  });
});

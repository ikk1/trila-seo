import { describe, it, expect, vi } from 'vitest';

const mockCities = vi.hoisted(() => ({ value: [] as any[] }));
vi.mock('@/lib/locations', () => ({
  loadAllCities: vi.fn(async () => mockCities.value),
}));

import { GET as indexGet } from '@/app/sitemap.xml/route';
import { GET as segGet } from '@/app/sitemaps/[file]/route';

function req() {
  return new Request('https://trila.app.br/x');
}

describe('GET /sitemap.xml (índice)', () => {
  it('responde 200 com sitemapindex e filhos nomeados', async () => {
    const res = await indexGet();
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/xml');
    const body = await res.text();
    expect(body).toContain('<sitemapindex');
    expect(body).toContain('/sitemaps/core.xml');
    expect(body).toContain('/sitemaps/verticais.xml');
    expect(body).toContain('/sitemaps/locais.xml');
  });
});

describe('GET /sitemaps/[file].xml', () => {
  it('core.xml -> urlset com inteligencia-artificial', async () => {
    const res = await segGet(req(), { params: Promise.resolve({ file: 'core.xml' }) });
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('/inteligencia-artificial');
  });

  it('verticais.xml -> urlset com sistema-para', async () => {
    const res = await segGet(req(), { params: Promise.resolve({ file: 'verticais.xml' }) });
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('/sistema-para-');
  });

  it('locais.xml -> urlset', async () => {
    mockCities.value = [
      { uf: 'sp', slug: 'sao-paulo', city: 'São Paulo', population: 12_000_000, isCapital: true, region: 'Sudeste' },
    ];
    const res = await segGet(req(), { params: Promise.resolve({ file: 'locais.xml' }) });
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('/sp/sao-paulo');
  });

  it('nome inválido -> 404', async () => {
    const res = await segGet(req(), { params: Promise.resolve({ file: 'qualquer.xml' }) });
    expect(res.status).toBe(404);
  });

  it('página de locais fora do range -> 404', async () => {
    mockCities.value = [];
    const res = await segGet(req(), { params: Promise.resolve({ file: 'locais-9.xml' }) });
    expect(res.status).toBe(404);
  });

  it('locais-1.xml explícito -> 404 (página 1 só em locais.xml)', async () => {
    mockCities.value = [
      { uf: 'sp', slug: 'sao-paulo', city: 'São Paulo', population: 12_000_000, isCapital: true, region: 'Sudeste' },
    ];
    const res = await segGet(req(), { params: Promise.resolve({ file: 'locais-1.xml' }) });
    expect(res.status).toBe(404);
  });
});

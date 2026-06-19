import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/guides', () => ({
  listGuides: vi.fn(() => [
    { vertical: 'salao-de-beleza', topic: 'como-abrir', frontmatter: {}, body: '' },
    { vertical: 'barbearia', topic: 'como-precificar', frontmatter: {}, body: '' },
  ]),
}));

import { getGuiasEntries, getSitemapIndex } from '@/lib/sitemap';
import { SITE_URL } from '@/lib/site';

describe('getGuiasEntries', () => {
  it('inclui o índice /guias, os hubs por vertical e os guias', async () => {
    const locs = getGuiasEntries().map((e) => e.loc);
    expect(locs).toContain(`${SITE_URL}/guias`);
    expect(locs).toContain(`${SITE_URL}/guias/salao-de-beleza`);
    expect(locs).toContain(`${SITE_URL}/guias/barbearia`);
    expect(locs).toContain(`${SITE_URL}/guias/salao-de-beleza/como-abrir`);
    expect(locs).toContain(`${SITE_URL}/guias/barbearia/como-precificar`);
  });
});

describe('getSitemapIndex', () => {
  it('inclui guias.xml', async () => {
    expect(await getSitemapIndex()).toContain('/sitemaps/guias.xml');
  });
});

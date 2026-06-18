import { describe, it, expect } from 'vitest';
import { SITEMAP_LASTMOD } from '@/lib/site';

describe('SITEMAP_LASTMOD', () => {
  it('é uma string ISO 8601 válida e estável', () => {
    expect(typeof SITEMAP_LASTMOD).toBe('string');
    expect(SITEMAP_LASTMOD).toBe(new Date(SITEMAP_LASTMOD).toISOString());
  });
});

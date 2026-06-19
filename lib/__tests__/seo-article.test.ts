import { describe, it, expect } from 'vitest';
import { buildArticleJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

describe('buildArticleJsonLd', () => {
  it('produz um Article com URL absoluta e datas', () => {
    const ld = buildArticleJsonLd({
      title: 'Como abrir um salão',
      description: 'Guia',
      path: '/guias/salao-de-beleza/como-abrir',
      updatedAt: '2026-06-19',
    }) as any;
    expect(ld['@type']).toBe('Article');
    expect(ld.headline).toBe('Como abrir um salão');
    expect(ld.mainEntityOfPage).toBe(`${SITE_URL}/guias/salao-de-beleza/como-abrir`);
    expect(ld.dateModified).toBe('2026-06-19');
    expect(ld.author.name).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import {
  ORGANIZATION_ID,
  buildOrganizationJsonLd,
  buildSoftwareJsonLd,
  buildArticleJsonLd,
} from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

describe('entidade Organization consolidada por @id', () => {
  it('ORGANIZATION_ID é uma âncora estável no domínio do site', () => {
    expect(ORGANIZATION_ID).toBe(`${SITE_URL}/#organization`);
  });

  it('Organization carrega o @id estável', () => {
    const ld = buildOrganizationJsonLd() as any;
    expect(ld['@type']).toBe('Organization');
    expect(ld['@id']).toBe(ORGANIZATION_ID);
    expect(ld.name).toBeTruthy();
    expect(ld.url).toBe(SITE_URL);
  });

  it('SoftwareApplication referencia a mesma Organization via provider @id', () => {
    const ld = buildSoftwareJsonLd() as any;
    expect(ld.provider['@id']).toBe(ORGANIZATION_ID);
  });

  it('Article aponta o publisher para a mesma Organization via @id', () => {
    const ld = buildArticleJsonLd({
      title: 'X',
      description: 'Y',
      path: '/guias/x',
      updatedAt: '2026-06-29',
    }) as any;
    expect(ld.publisher['@id']).toBe(ORGANIZATION_ID);
  });

  it('as três menções de Organization compartilham o mesmo @id (entidade única)', () => {
    const org = buildOrganizationJsonLd() as any;
    const sw = buildSoftwareJsonLd() as any;
    const article = buildArticleJsonLd({
      title: 'X',
      description: 'Y',
      path: '/guias/x',
      updatedAt: '2026-06-29',
    }) as any;
    const ids = new Set([org['@id'], sw.provider['@id'], article.publisher['@id']]);
    expect(ids.size).toBe(1);
  });
});

import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { GUIDE_TOPICS, getTopicBySlug } from '@/lib/guides-taxonomy';
import {
  listGuides,
  getGuide,
  listGuidesByVertical,
  validateFrontmatter,
} from '@/lib/guides';

const FIXTURES = path.join(__dirname, 'fixtures', 'guias');

describe('guides-taxonomy', () => {
  it('tem 12 tópicos com slugs únicos', () => {
    expect(GUIDE_TOPICS).toHaveLength(12);
    const slugs = GUIDE_TOPICS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(12);
  });
  it('getTopicBySlug resolve e retorna undefined para desconhecido', () => {
    expect(getTopicBySlug('como-abrir')?.funnel).toBe('topo');
    expect(getTopicBySlug('inexistente')).toBeUndefined();
  });
});

describe('listGuides', () => {
  it('carrega todos os .md das fixtures', () => {
    const guides = listGuides(FIXTURES);
    expect(guides).toHaveLength(2);
    const keys = guides.map((g) => `${g.vertical}/${g.topic}`).sort();
    expect(keys).toEqual(['barbearia/como-precificar', 'salao-de-beleza/como-abrir']);
  });
});

describe('getGuide', () => {
  it('resolve um guia existente com frontmatter e corpo', () => {
    const g = getGuide('salao-de-beleza', 'como-abrir', FIXTURES);
    expect(g).not.toBeNull();
    expect(g!.frontmatter.title).toContain('Como abrir');
    expect(g!.frontmatter.faq[0].q).toContain('CNPJ');
    expect(g!.body).toContain('## Planejamento');
  });
  it('retorna null para guia inexistente', () => {
    expect(getGuide('spa', 'inexistente', FIXTURES)).toBeNull();
  });
});

describe('listGuidesByVertical', () => {
  it('filtra por vertical', () => {
    const g = listGuidesByVertical('barbearia', FIXTURES);
    expect(g).toHaveLength(1);
    expect(g[0].topic).toBe('como-precificar');
  });
});

describe('validateFrontmatter', () => {
  const ok = {
    title: 't', description: 'd', vertical: 'barbearia', topic: 'como-abrir',
    updatedAt: '2026-06-19', keyTakeaways: ['a'], faq: [{ q: 'p', answer: 'r' }],
  };
  it('aceita frontmatter válido', () => {
    expect(validateFrontmatter(ok).title).toBe('t');
  });
  it('lança se faltar campo obrigatório', () => {
    const { title, ...semTitle } = ok;
    expect(() => validateFrontmatter(semTitle)).toThrow();
  });
  it('lança se faq tiver formato errado', () => {
    expect(() => validateFrontmatter({ ...ok, faq: [{ pergunta: 'x' }] })).toThrow();
  });
  it('normaliza Date para string ISO quando gray-matter retorna Date', () => {
    const result = validateFrontmatter({ ...ok, updatedAt: new Date('2026-06-19') });
    expect(typeof result.updatedAt).toBe('string');
    expect(result.updatedAt).toBe('2026-06-19');
  });
});

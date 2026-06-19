import { describe, it, expect } from 'vitest';
import { buildGuidePrompt, parseGuideOutput } from '../guide-prompt';

const grounding = {
  vertical: 'barbearia',
  singular: 'barbearia',
  ticketP50: 45,
  priceRanges: [{ service: 'corte', min: 30, max: 60 }],
  establishments: 1200,
  painPoints: ['Agenda quebrada'],
  features: ['Agenda com confirmação'],
  grounded: true,
};

describe('buildGuidePrompt', () => {
  it('injeta vertical, tópico e os dados de ancoragem', () => {
    const p = buildGuidePrompt({ verticalSlug: 'barbearia', topicSlug: 'como-precificar', grounding });
    expect(p).toContain('barbearia');
    expect(p).toContain('como-precificar');
    expect(p).toContain('45'); // ticket
    expect(p).toContain('corte'); // price range
    expect(p).toContain('Agenda quebrada'); // pain point
  });
});

describe('parseGuideOutput', () => {
  it('extrai frontmatter válido e corpo de uma saída com fences', () => {
    const out = [
      '```markdown',
      '---',
      'title: "Como precificar barbearia"',
      'description: "Guia de preço para barbearia."',
      'vertical: barbearia',
      'topic: como-precificar',
      'updatedAt: 2026-06-19',
      'keyTakeaways:',
      '  - "Some custo e margem."',
      'faq:',
      '  - q: "Como definir o preço?"',
      '    answer: "Custo da hora mais insumos."',
      '---',
      '',
      '## Estrutura',
      'Texto.',
      '```',
    ].join('\n');
    const { frontmatter, body } = parseGuideOutput(out);
    expect(frontmatter.title).toContain('precificar');
    expect(frontmatter.faq[0].q).toContain('preço');
    expect(body).toContain('## Estrutura');
  });

  it('lança se a saída não tiver frontmatter válido', () => {
    expect(() => parseGuideOutput('sem frontmatter aqui')).toThrow();
  });
});

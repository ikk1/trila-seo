import matter from 'gray-matter';
import { getTopicBySlug } from '@/lib/guides-taxonomy';
import { validateFrontmatter, type GuideFrontmatter } from '@/lib/guides';
import type { GroundingData } from './guide-grounding';

export function buildGuidePrompt(args: {
  verticalSlug: string;
  topicSlug: string;
  grounding: GroundingData;
}): string {
  const { verticalSlug, topicSlug, grounding } = args;
  const topic = getTopicBySlug(topicSlug);
  const tipoFunil = topic?.funnel ?? 'topo';
  const ticket = grounding.ticketP50 != null ? `R$ ${grounding.ticketP50}` : 'sem dado';
  const precos = grounding.priceRanges
    .map((p) => `${p.service}: R$ ${p.min}–${p.max}`)
    .join('; ') || 'sem dado';
  const estabs = grounding.establishments != null ? String(grounding.establishments) : 'sem dado';

  return [
    `Você é redator de conteúdo SEO para a Trila, um sistema de gestão para negócios de beleza.`,
    `Escreva um guia em português do Brasil sobre o tópico "${topicSlug}" para o segmento "${grounding.singular}" (slug "${verticalSlug}").`,
    `Tipo de funil: ${tipoFunil}.`,
    ``,
    `DADOS REAIS DE MERCADO (use ao menos um num bloco de destaque; não invente números além destes):`,
    `- Ticket médio típico: ${ticket}`,
    `- Faixas de preço: ${precos}`,
    `- Estabelecimentos ativos (referência): ${estabs}`,
    `- Dores comuns: ${grounding.painPoints.join('; ')}`,
    `- Como a Trila ajuda: ${grounding.features.join('; ')}`,
    ``,
    `ESTRUTURA OBRIGATÓRIA da saída — um documento Markdown com frontmatter YAML:`,
    `---`,
    `title: (título com a intenção de busca, até 60 caracteres)`,
    `description: (meta description, 150–160 caracteres)`,
    `vertical: ${verticalSlug}`,
    `topic: ${topicSlug}`,
    `updatedAt: 2026-06-19`,
    `keyTakeaways: (3 a 5 itens curtos)`,
    `faq: (3 a 5 itens, cada um com "q" e "answer")`,
    `---`,
    ``,
    `Corpo: 600–1000 palavras, com 4 a 6 seções "##", listas quando útil, um bloco citando um dado real acima,`,
    `e um parágrafo final com CTA suave para a Trila (sem ser propaganda agressiva).`,
    `Responda APENAS com o documento Markdown (frontmatter + corpo), sem comentários fora dele.`,
  ].join('\n');
}

export function parseGuideOutput(text: string): { frontmatter: GuideFrontmatter; body: string } {
  // Remove fences ```markdown ... ``` se presentes.
  let cleaned = text.trim();
  const fence = /^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/.exec(cleaned);
  if (fence) cleaned = fence[1].trim();
  const parsed = matter(cleaned);
  const frontmatter = validateFrontmatter(parsed.data);
  return { frontmatter, body: parsed.content.trim() };
}

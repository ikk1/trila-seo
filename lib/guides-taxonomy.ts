// lib/guides-taxonomy.ts
// Fonte única dos tópicos de guias. Consumida pelas rotas /guias e pelo script
// de geração. Os slugs de vertical NÃO vivem aqui — vêm de lib/verticals.ts.
export type GuideFunnel = 'topo' | 'meio' | 'produto';

export type GuideTopic = {
  slug: string;
  label: string; // rótulo curto, usado em listas/hubs
  funnel: GuideFunnel;
};

export const GUIDE_TOPICS: GuideTopic[] = [
  { slug: 'como-abrir', label: 'Como abrir', funnel: 'topo' },
  { slug: 'quanto-custa-montar', label: 'Quanto custa montar', funnel: 'topo' },
  { slug: 'licencas-e-documentos', label: 'Licenças e documentos', funnel: 'topo' },
  { slug: 'equipamentos-necessarios', label: 'Equipamentos necessários', funnel: 'topo' },
  { slug: 'plano-de-negocio', label: 'Plano de negócio', funnel: 'topo' },
  { slug: 'como-precificar', label: 'Como precificar', funnel: 'meio' },
  { slug: 'como-divulgar', label: 'Como divulgar', funnel: 'meio' },
  { slug: 'como-contratar', label: 'Como contratar e comissionar', funnel: 'meio' },
  { slug: 'controle-financeiro', label: 'Controle financeiro', funnel: 'produto' },
  { slug: 'agenda-online', label: 'Agenda online', funnel: 'produto' },
  { slug: 'como-reduzir-no-show', label: 'Como reduzir no-show', funnel: 'produto' },
  { slug: 'como-fidelizar-clientes', label: 'Como fidelizar clientes', funnel: 'produto' },
];

export function getTopicBySlug(slug: string): GuideTopic | undefined {
  return GUIDE_TOPICS.find((t) => t.slug === slug);
}

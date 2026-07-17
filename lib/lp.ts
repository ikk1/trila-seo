// Landing pages de campanhas pagas (Google Ads). Diferente das páginas de SEO
// (sistema-para/[vertical]), estas são noindex e focadas 100% em conversão de
// cadastro. Cada vertical tem uma campanha de Ads própria, então o CTA carrega
// UTMs para segmentar a origem no GA4 (a atribuição de conversão em si vem do
// gclid/auto-tagging do Ads).
import { buildRegisterUrl } from '@/lib/site';

/** Verticais que têm landing page de Ads. Comece enxuto: amplie conforme escalar. */
export const LP_VERTICAL_SLUGS = [
  'barbearia',
  'salao-de-beleza',
  'clinica-de-estetica',
  'spa',
  'manicure',
  'nail-designer',
  'centro-de-beleza',
  'esteticista',
] as const;

export type LpVerticalSlug = (typeof LP_VERTICAL_SLUGS)[number];

export interface LpHeroCopy {
  /** Etiqueta de segmento, casa com o anúncio (ex.: "Para barbearias"). */
  eyebrow: string;
  /** Promessa principal. Escrita à mão por vertical para acertar gênero e tom. */
  headline: string;
  /** Reforço de valor logo abaixo do headline. */
  subheadline: string;
  /** Serviços de exemplo no mock de "Agenda de hoje" (linguagem da vertical). */
  services: string[];
}

/**
 * Copy de conversão por vertical. Mantida à mão (não derivada de verticals.ts)
 * porque headline de LP precisa de gênero e ritmo certos — "Sua barbearia" vs
 * "Seu salão" — e de um tom mais direto que o conteúdo de SEO.
 */
export const LP_HERO_COPY: Record<LpVerticalSlug, LpHeroCopy> = {
  barbearia: {
    eyebrow: 'Para barbearias',
    headline: 'Sua barbearia com a agenda cheia e zero falta',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Corte + Barba', 'Corte na máquina', 'Barba'],
  },
  'salao-de-beleza': {
    eyebrow: 'Para salões de beleza',
    headline: 'Seu salão de beleza com a agenda cheia e zero falta',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Escova + Hidratação', 'Corte feminino', 'Coloração'],
  },
  'clinica-de-estetica': {
    eyebrow: 'Para clínicas de estética',
    headline: 'Sua clínica de estética com a agenda cheia e zero falta',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Limpeza de pele', 'Drenagem linfática', 'Peeling'],
  },
  spa: {
    eyebrow: 'Para spas',
    headline: 'Seu spa com a agenda cheia e zero falta',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Massagem relaxante', 'Day spa', 'Pedras quentes'],
  },
  manicure: {
    eyebrow: 'Para manicures',
    headline: 'Sua agenda de manicure cheia e sem furo de horário',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Manicure + Pedicure', 'Esmaltação em gel', 'Spa dos pés'],
  },
  'nail-designer': {
    eyebrow: 'Para nail designers',
    headline: 'Seu studio de unhas com a agenda cheia e zero falta',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Alongamento em fibra', 'Banho de gel', 'Nail art'],
  },
  'centro-de-beleza': {
    eyebrow: 'Para centros de beleza',
    headline: 'Seu centro de beleza com a agenda cheia e zero falta',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Corte + Escova', 'Manicure', 'Depilação'],
  },
  esteticista: {
    eyebrow: 'Para esteticistas',
    headline: 'Sua agenda de esteticista cheia e sem falta de cliente',
    subheadline:
      'Agenda, confirmação de horário, financeiro e comissões num sistema só. Pare de perder cliente no caderno e na memória.',
    services: ['Limpeza de pele', 'Design de sobrancelha', 'Depilação a cera'],
  },
};

export function isLpVertical(slug: string): slug is LpVerticalSlug {
  return (LP_VERTICAL_SLUGS as readonly string[]).includes(slug);
}

/** True nas rotas de landing page de Ads, onde o header e o footer do site somem. */
export function isLpPath(pathname: string | null): boolean {
  return !!pathname && pathname.startsWith('/lp');
}

/** URL de cadastro no app, com UTMs para rastrear a origem da campanha no GA4. */
export function buildLpRegisterUrl(slug: string): string {
  return buildRegisterUrl(`lp-${slug}`, { source: 'google', medium: 'cpc' });
}

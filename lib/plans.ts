// Planos comerciais. Fonte de verdade: tabela subscription_plans no banco do backend
// (a mesma que o app e o admin usam). O site lê de lá para que preço/recursos nunca
// divirjam do que é realmente cobrado. FALLBACK_PLANS só entra como resiliência se o
// banco estiver indisponível no build/runtime — nunca como fonte de preço autoritativa.

import { getDbPool } from './db';

export const TRIAL_DAYS = 14;
export const TRIAL_LABEL = `${TRIAL_DAYS} dias grátis, sem cartão`;
export const PLAN_CTA = 'Começar grátis';

export type Plan = {
  name: string;
  price: number; // mensal, em BRL
  priceLabel: string;
  tagline: string;
  highlighted: boolean;
  badge?: string;
  features: string[];
};

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export function formatBRL(value: number): string {
  return BRL.format(value);
}

function toNumber(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

// subscription_plans.features is a TEXT column holding a JSON-encoded array of strings
// (the JPA entity maps it as String). The pg driver returns it as a raw string, so we must
// parse it. Tolerates a native array too, in case the column is ever migrated back to JSONB.
function parseFeatures(value: unknown): string[] {
  let arr: unknown = value;
  if (typeof value === 'string') {
    try {
      arr = JSON.parse(value);
    } catch {
      return [];
    }
  }
  return Array.isArray(arr) ? arr.filter((f): f is string => typeof f === 'string') : [];
}

// Taglines são copy de marketing (não existem no banco) — mapeadas por nome do plano.
const TAGLINES: Record<string, string> = {
  Starter: 'Para quem está organizando a operação e saindo do caderno + planilha.',
  Pro: 'Para casas em crescimento que querem IA, fidelidade e relatórios.',
};

// Fallback de resiliência — espelha subscription_plans (V121–V124). Mantido mínimo de
// propósito; se o banco responder, estes valores nunca são usados.
export const FALLBACK_PLANS: Plan[] = [
  {
    name: 'Starter',
    price: 49.9,
    priceLabel: formatBRL(49.9),
    tagline: TAGLINES.Starter,
    highlighted: false,
    features: [
      'Agendamento online',
      'Portal do cliente',
      'Pagamentos via Pix',
      'Campanhas de marketing',
      'Até 2 profissionais',
      'Até 500 clientes',
      'Até 3 usuários',
      '2 campanhas/mês',
    ],
  },
  {
    name: 'Pro',
    price: 99.9,
    priceLabel: formatBRL(99.9),
    tagline: TAGLINES.Pro,
    highlighted: true,
    badge: 'Mais popular',
    features: [
      'Agendamento online',
      'Pagamentos via Pix',
      'Campanhas de marketing',
      'Portal do cliente',
      'Insights de IA',
      'Relatórios avançados',
      'Programa de fidelidade',
      'Lista de espera',
      'Até 8 profissionais',
      'Clientes ilimitados',
      'Campanhas ilimitadas',
      'Usuários ilimitados',
    ],
  },
];

type PlanRow = {
  name: string;
  price: unknown;
  features: unknown;
  highlighted: boolean | null;
  badge_text: string | null;
};

/**
 * Carrega os planos ativos do banco. Cai para FALLBACK_PLANS se SEO_DB_URL não estiver
 * configurado ou a query falhar — o site de preços nunca deve ficar sem conteúdo.
 */
export async function loadPlans(): Promise<Plan[]> {
  if (!process.env.SEO_DB_URL) {
    return FALLBACK_PLANS;
  }

  try {
    const pool = getDbPool();
    const { rows } = await pool.query<PlanRow>(
      `
        SELECT name, price, features, COALESCE(highlighted, false) AS highlighted, badge_text
        FROM subscription_plans
        WHERE active = true
        ORDER BY sort_order ASC NULLS LAST, price ASC
      `,
    );

    if (rows.length === 0) {
      return FALLBACK_PLANS;
    }

    return rows.map((row) => {
      const price = toNumber(row.price);
      const features = parseFeatures(row.features);
      return {
        name: row.name,
        price,
        priceLabel: formatBRL(price),
        tagline: TAGLINES[row.name] ?? '',
        highlighted: Boolean(row.highlighted),
        badge: row.badge_text ?? undefined,
        features,
      };
    });
  } catch (error) {
    console.warn('[plans] failed to load from DB, using fallback:', error);
    return FALLBACK_PLANS;
  }
}

/** Menor preço pago do catálogo — usado no schema.org offers. */
export function getLowestPlanPrice(plans: Plan[]): number {
  const prices = plans.map((p) => p.price).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : 49.9;
}

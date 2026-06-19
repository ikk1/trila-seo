import { getVerticalBySlug } from '@/lib/verticals';
import { getDbPool } from '@/lib/db';

export type GroundingData = {
  vertical: string;
  singular: string;
  ticketP50: number | null;
  priceRanges: Array<{ service: string; min: number; max: number }>;
  establishments: number | null;
  painPoints: string[];
  features: string[];
  grounded: boolean;
};

// Faixas típicas de fallback quando o DB não tem dado para a vertical.
const FALLBACK: Record<string, { ticketP50: number; priceRanges: GroundingData['priceRanges']; establishments: number }> = {
  'salao-de-beleza': { ticketP50: 80, priceRanges: [{ service: 'corte feminino', min: 50, max: 120 }], establishments: 0 },
  barbearia: { ticketP50: 45, priceRanges: [{ service: 'corte', min: 30, max: 70 }], establishments: 0 },
  'clinica-de-estetica': { ticketP50: 180, priceRanges: [{ service: 'limpeza de pele', min: 120, max: 300 }], establishments: 0 },
  spa: { ticketP50: 220, priceRanges: [{ service: 'massagem', min: 150, max: 350 }], establishments: 0 },
  manicure: { ticketP50: 45, priceRanges: [{ service: 'manicure', min: 30, max: 80 }], establishments: 0 },
  'nail-designer': { ticketP50: 90, priceRanges: [{ service: 'alongamento', min: 100, max: 250 }], establishments: 0 },
  'centro-de-beleza': { ticketP50: 90, priceRanges: [{ service: 'pacote', min: 60, max: 200 }], establishments: 0 },
  esteticista: { ticketP50: 150, priceRanges: [{ service: 'procedimento', min: 100, max: 300 }], establishments: 0 },
};

const DEFAULT_FALLBACK = { ticketP50: 90, priceRanges: [{ service: 'serviço', min: 60, max: 200 }], establishments: 0 };

export async function buildGroundingData(verticalSlug: string): Promise<GroundingData> {
  const content = getVerticalBySlug(verticalSlug);
  if (!content) throw new Error(`Vertical desconhecida: ${verticalSlug}`);

  const base: GroundingData = {
    vertical: verticalSlug,
    singular: content.singular,
    ticketP50: null,
    priceRanges: [],
    establishments: null,
    painPoints: content.painPoints,
    features: content.features,
    grounded: false,
  };

  if (!process.env.SEO_DB_URL) {
    const fb = FALLBACK[verticalSlug] ?? DEFAULT_FALLBACK;
    return { ...base, ticketP50: fb.ticketP50, priceRanges: fb.priceRanges, establishments: fb.establishments, grounded: false };
  }

  try {
    const pool = getDbPool();
    // Real schema (V001__seo_schema.sql):
    // seo.ticket_agg: (vertical_slug, city_id, ticket_p50, ...)
    // seo.service_price_agg: (vertical_slug, city_id, service_type, p25, p50, p75) — no price_min/price_max
    // seo.cnae_establishments: (city_id, cnae, total_ativos, ...) — no active_count column
    const ticket = await pool.query(
      `SELECT AVG(ticket_p50)::numeric AS p50 FROM seo.ticket_agg WHERE vertical_slug = $1`,
      [verticalSlug],
    );
    const prices = await pool.query(
      `SELECT service_type AS service, MIN(p25)::numeric AS min, MAX(p75)::numeric AS max
       FROM seo.service_price_agg WHERE vertical_slug = $1 GROUP BY service_type LIMIT 5`,
      [verticalSlug],
    );
    const estabs = await pool.query(
      `SELECT SUM(total_ativos)::int AS total FROM seo.cnae_establishments
       WHERE cnae = ANY($1)`,
      [content.cnaes],
    );

    const ticketP50 = ticket.rows[0]?.p50 != null ? Math.round(Number(ticket.rows[0].p50)) : null;
    const priceRanges = prices.rows.map((r: any) => ({ service: String(r.service), min: Math.round(Number(r.min)), max: Math.round(Number(r.max)) }));
    const establishments = estabs.rows[0]?.total != null ? Number(estabs.rows[0].total) : null;
    const grounded = ticketP50 != null || priceRanges.length > 0;

    if (!grounded) {
      const fb = FALLBACK[verticalSlug] ?? DEFAULT_FALLBACK;
      return { ...base, ticketP50: fb.ticketP50, priceRanges: fb.priceRanges, establishments, grounded: false };
    }
    return { ...base, ticketP50, priceRanges, establishments, grounded: true };
  } catch (err) {
    console.warn(`[grounding] falha no DB para ${verticalSlug}, usando fallback:`, (err as Error).message);
    const fb = FALLBACK[verticalSlug] ?? DEFAULT_FALLBACK;
    return { ...base, ticketP50: fb.ticketP50, priceRanges: fb.priceRanges, establishments: fb.establishments, grounded: false };
  }
}

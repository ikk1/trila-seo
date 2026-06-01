import { cache } from 'react';
import { getDbPool } from './db';

export type CityVerticalTicketInsight = {
  sampleSize: number;
  ticketP25: number;
  ticketP50: number;
  ticketP75: number;
  noShowPct: number | null;
  computedAt: string;
};

export type CityVerticalServicePriceInsight = {
  serviceType: string;
  sampleSize: number;
  p25: number;
  p50: number;
  p75: number;
  computedAt: string;
};

export type CityVerticalTestimonial = {
  id: number;
  displayName: string;
  role: string;
  body: string;
  rating: number;
  citySpecific: boolean;
};

export type CityVerticalInsights = {
  ticket: CityVerticalTicketInsight | null;
  servicePrices: CityVerticalServicePriceInsight[];
  testimonials: CityVerticalTestimonial[];
};

function toNumber(value: unknown): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const numeric = toNumber(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export const loadCityVerticalInsights = cache(async function loadCityVerticalInsights(
  cityId: number,
  verticalSlug: string,
): Promise<CityVerticalInsights | null> {
  if (!process.env.SEO_DB_URL) {
    return null;
  }

  try {
    const pool = getDbPool();

    const [ticketResult, priceResult, testimonialResult] = await Promise.all([
      pool.query<{
        sample_size: number;
        ticket_p25: unknown;
        ticket_p50: unknown;
        ticket_p75: unknown;
        no_show_pct: unknown;
        computed_at: Date;
      }>(
        `
          SELECT sample_size, ticket_p25, ticket_p50, ticket_p75, no_show_pct, computed_at
          FROM seo.ticket_agg
          WHERE vertical_slug = $1 AND city_id = $2
          ORDER BY computed_at DESC
          LIMIT 1
        `,
        [verticalSlug, cityId],
      ),
      pool.query<{
        service_type: string;
        sample_size: number;
        p25: unknown;
        p50: unknown;
        p75: unknown;
        computed_at: Date;
      }>(
        `
          SELECT DISTINCT ON (service_type)
            service_type, sample_size, p25, p50, p75, computed_at
          FROM seo.service_price_agg
          WHERE vertical_slug = $1 AND city_id = $2
          ORDER BY service_type, computed_at DESC
        `,
        [verticalSlug, cityId],
      ),
      pool.query<{
        id: number;
        display_name: string;
        role: string;
        body: string;
        rating: number;
        city_id: number | null;
        consented_at: Date;
      }>(
        `
          SELECT id, display_name, role, body, rating, city_id
          FROM seo.testimonial
          WHERE vertical_slug = $1
            AND active
            AND (city_id = $2 OR city_id IS NULL)
          ORDER BY CASE WHEN city_id = $2 THEN 0 ELSE 1 END, consented_at DESC
          LIMIT 3
        `,
        [verticalSlug, cityId],
      ),
    ]);

    const ticketRow = ticketResult.rows[0];
    const ticket = ticketRow
      ? {
          sampleSize: toNumber(ticketRow.sample_size),
          ticketP25: toNumber(ticketRow.ticket_p25),
          ticketP50: toNumber(ticketRow.ticket_p50),
          ticketP75: toNumber(ticketRow.ticket_p75),
          noShowPct: toNullableNumber(ticketRow.no_show_pct),
          computedAt: ticketRow.computed_at.toISOString(),
        }
      : null;

    const servicePrices = priceResult.rows.map((row) => ({
      serviceType: row.service_type,
      sampleSize: toNumber(row.sample_size),
      p25: toNumber(row.p25),
      p50: toNumber(row.p50),
      p75: toNumber(row.p75),
      computedAt: row.computed_at.toISOString(),
    }));

    const testimonials = testimonialResult.rows.map((row) => ({
      id: toNumber(row.id),
      displayName: row.display_name,
      role: row.role,
      body: row.body,
      rating: toNumber(row.rating),
      citySpecific: row.city_id === cityId,
    }));

    if (!ticket && !servicePrices.length && !testimonials.length) {
      return null;
    }

    return { ticket, servicePrices, testimonials };
  } catch {
    return null;
  }
});

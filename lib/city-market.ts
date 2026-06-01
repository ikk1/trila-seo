import { cache } from 'react';
import { getDbPool } from './db';

export type CityVerticalMarket = {
  totalAtivos: number;
  abertos12m: number;
  fechados12m: number;
  snapshotDate: string;
};

function toNumber(value: unknown): number {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export const loadCityVerticalMarket = cache(async function loadCityVerticalMarket(
  cityId: number,
  cnaes: string[],
): Promise<CityVerticalMarket | null> {
  if (!process.env.SEO_DB_URL || cnaes.length === 0) {
    return null;
  }

  try {
    const pool = getDbPool();
    const { rows } = await pool.query<{
      total_ativos: unknown;
      abertos_12m: unknown;
      fechados_12m: unknown;
      snapshot_date: Date | null;
    }>(
      `
        SELECT
          SUM(total_ativos)  AS total_ativos,
          SUM(abertos_12m)   AS abertos_12m,
          SUM(fechados_12m)  AS fechados_12m,
          MAX(snapshot_date) AS snapshot_date
        FROM seo.cnae_establishments
        WHERE city_id = $1
          AND cnae = ANY($2)
          AND snapshot_date = (
            SELECT MAX(snapshot_date)
            FROM seo.cnae_establishments
            WHERE city_id = $1
          )
      `,
      [cityId, cnaes],
    );

    const row = rows[0];
    if (!row || row.snapshot_date === null) {
      return null;
    }
    const totalAtivos = toNumber(row.total_ativos);
    if (totalAtivos === 0) {
      return null;
    }
    return {
      totalAtivos,
      abertos12m: toNumber(row.abertos_12m),
      fechados12m: toNumber(row.fechados_12m),
      snapshotDate: row.snapshot_date.toISOString(),
    };
  } catch {
    return null;
  }
});

// lib/db.ts
import { Pool } from 'pg';

let pool: Pool | undefined;

export function getDbPool(): Pool {
  if (pool) return pool;
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL is not set');
  pool = new Pool({ connectionString: url, max: 5, idleTimeoutMillis: 30_000 });
  return pool;
}

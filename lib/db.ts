// lib/db.ts
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

function createPool(): Pool {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL is not set');
  return new Pool({ connectionString: url, max: 5, idleTimeoutMillis: 30_000 });
}

// Reuse pool across hot reloads in dev to avoid exhausting connections.
export const db: Pool = globalThis._pgPool ?? (globalThis._pgPool = createPool());

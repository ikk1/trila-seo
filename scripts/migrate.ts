// scripts/migrate.ts
// Applies pending V* migrations from migrations/ directory.
// Usage: SEO_DB_URL=<url> npx tsx scripts/migrate.ts
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { Pool } from 'pg';

async function main() {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL env var required');

  const pool = new Pool({ connectionString: url });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS seo.schema_migrations (
      version     text        PRIMARY KEY,
      applied_at  timestamptz NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await pool.query<{ version: string }>(
    'SELECT version FROM seo.schema_migrations ORDER BY version'
  );
  const applied = new Set(rows.map((r) => r.version));

  const dir = path.join(process.cwd(), 'migrations');
  const files = (await readdir(dir))
    .filter((f) => /^V\d+__.+\.sql$/.test(f))
    .sort();

  for (const file of files) {
    const version = file.split('__')[0];
    if (applied.has(version)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    console.log(`  apply ${file} ...`);
    const sql = await readFile(path.join(dir, file), 'utf8');
    await pool.query(sql);
    await pool.query(
      'INSERT INTO seo.schema_migrations (version) VALUES ($1)',
      [version]
    );
    console.log(`  done  ${file}`);
  }

  await pool.end();
  console.log('Migrations complete.');
}

main().catch((e) => { console.error(e); process.exit(1); });

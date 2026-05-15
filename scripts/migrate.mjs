// Applies pending V* migrations from migrations/ directory.
// Usage: SEO_DB_URL=<url> node scripts/migrate.mjs
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { Pool } from 'pg';

async function main() {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL env var required');

  const pool = new Pool({ connectionString: url, max: 1 });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seo.schema_migrations (
        version     text        PRIMARY KEY,
        applied_at  timestamptz NOT NULL DEFAULT now()
      )
    `);

    const { rows } = await pool.query(
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
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          `INSERT INTO seo.schema_migrations (version) VALUES ($1) ON CONFLICT DO NOTHING`,
          [version]
        );
        await client.query('COMMIT');
        console.log(`  done  ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    console.log('Migrations complete.');
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

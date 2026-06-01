import { readFile } from 'fs/promises';
import { Pool } from 'pg';

function parseArgs() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v ?? true];
    }),
  );
  const file = args.file ?? 'scripts/data/establishments.json';
  const snapshot = args.snapshot;
  if (!snapshot || !/^\d{4}-\d{2}-\d{2}$/.test(String(snapshot))) {
    throw new Error('Informe --snapshot=YYYY-MM-DD (data de referência da safra RFB)');
  }
  return { file, snapshot };
}

// Insere em lotes (um INSERT multi-VALUES por lote) — evita milhares de
// round-trips sequenciais pela proxy pública, que travam/demoram horas.
const BATCH = 500;

async function main() {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL env var required');
  const { file, snapshot } = parseArgs();

  const raw = await readFile(file, 'utf8');
  const records = JSON.parse(raw);
  if (!Array.isArray(records)) throw new Error('JSON esperado: array de linhas do BigQuery');
  console.log(`${records.length} linhas no arquivo ${file}.`);

  // statement_timeout: uma query travada falha em 60s em vez de pendurar para sempre.
  const pool = new Pool({
    connectionString: url,
    max: 4,
    statement_timeout: 60_000,
    connectionTimeoutMillis: 30_000,
  });

  try {
    const cityRows = await pool.query('SELECT id FROM seo.city');
    const cityIds = new Set(cityRows.rows.map((r) => Number(r.id)));
    console.log(`${cityIds.size} cidades conhecidas em seo.city.`);

    // Filtra/normaliza antes de inserir.
    const rows = [];
    let skipped = 0;
    for (const rec of records) {
      const cityId = Number(rec.id_municipio);
      const totalAtivos = Number(rec.total_ativos);
      if (!cityIds.has(cityId) || !Number.isFinite(totalAtivos) || totalAtivos <= 0) {
        skipped += 1;
        continue;
      }
      rows.push([
        cityId,
        String(rec.cnae),
        snapshot,
        totalAtivos,
        Number(rec.abertos_12m ?? 0),
        Number(rec.fechados_12m ?? 0),
      ]);
    }
    console.log(`${rows.length} linhas para inserir, ${skipped} skipped (cidade desconhecida ou total<=0).`);

    let upserted = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const values = [];
      const params = [];
      batch.forEach((r, j) => {
        const o = j * 6;
        values.push(`($${o + 1},$${o + 2},$${o + 3},$${o + 4},$${o + 5},$${o + 6})`);
        params.push(...r);
      });

      await pool.query(
        `INSERT INTO seo.cnae_establishments
           (city_id, cnae, snapshot_date, total_ativos, abertos_12m, fechados_12m)
         VALUES ${values.join(',')}
         ON CONFLICT (city_id, cnae, snapshot_date) DO UPDATE SET
           total_ativos = EXCLUDED.total_ativos,
           abertos_12m  = EXCLUDED.abertos_12m,
           fechados_12m = EXCLUDED.fechados_12m`,
        params,
      );

      upserted += batch.length;
      console.log(`  ${upserted}/${rows.length} upserted...`);
    }

    console.log(`Ingestão completa. ${upserted} upserted, ${skipped} skipped.`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

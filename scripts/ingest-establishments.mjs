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

async function main() {
  const url = process.env.SEO_DB_URL;
  if (!url) throw new Error('SEO_DB_URL env var required');
  const { file, snapshot } = parseArgs();

  const raw = await readFile(file, 'utf8');
  const records = JSON.parse(raw);
  if (!Array.isArray(records)) throw new Error('JSON esperado: array de linhas do BigQuery');
  console.log(`${records.length} linhas no arquivo ${file}.`);

  const pool = new Pool({ connectionString: url, max: 8 });

  try {
    const cityRows = await pool.query('SELECT id FROM seo.city');
    const cityIds = new Set(cityRows.rows.map((r) => Number(r.id)));
    console.log(`${cityIds.size} cidades conhecidas em seo.city.`);

    let upserted = 0;
    let skipped = 0;

    for (const rec of records) {
      const cityId = Number(rec.id_municipio);
      const cnae = String(rec.cnae);
      const totalAtivos = Number(rec.total_ativos);
      const abertos12m = Number(rec.abertos_12m ?? 0);
      const fechados12m = Number(rec.fechados_12m ?? 0);

      if (!cityIds.has(cityId) || !Number.isFinite(totalAtivos) || totalAtivos <= 0) {
        skipped += 1;
        continue;
      }

      await pool.query(
        `INSERT INTO seo.cnae_establishments
           (city_id, cnae, snapshot_date, total_ativos, abertos_12m, fechados_12m)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (city_id, cnae, snapshot_date) DO UPDATE SET
           total_ativos = EXCLUDED.total_ativos,
           abertos_12m  = EXCLUDED.abertos_12m,
           fechados_12m = EXCLUDED.fechados_12m`,
        [cityId, cnae, snapshot, totalAtivos, abertos12m, fechados12m],
      );

      upserted += 1;
      if (upserted % 1000 === 0) console.log(`  ${upserted} upserted...`);
    }

    console.log(`Ingestão completa. ${upserted} upserted, ${skipped} skipped (cidade desconhecida ou total<=0).`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

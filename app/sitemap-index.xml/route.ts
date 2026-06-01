// app/sitemap-index.xml/route.ts
// Índice de sitemap gerado em runtime (ISR 1 dia) — agrega os chunks /sitemap/[id].
import { getSitemapIds } from '@/lib/sitemap';
import { SITE_URL, DEFAULT_LAST_MODIFIED } from '@/lib/site';

export const revalidate = 86400;

export async function GET() {
  const ids = await getSitemapIds();
  const lastmod = DEFAULT_LAST_MODIFIED.toISOString();

  const entries = ids
    .map(
      (id) =>
        `  <sitemap>\n` +
        `    <loc>${SITE_URL}/sitemap/${id}</loc>\n` +
        `    <lastmod>${lastmod}</lastmod>\n` +
        `  </sitemap>`
    )
    .join('\n');

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${entries}\n` +
    `</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}

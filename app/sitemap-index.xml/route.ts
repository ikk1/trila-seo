// app/sitemap-index.xml/route.ts
// Índice de sitemap: agrega todos os chunks /sitemap/[id].xml num
// <sitemapindex>, para o Google descobrir as páginas programáticas.
import { getSitemapIds } from '@/lib/sitemap';
import { SITE_URL, DEFAULT_LAST_MODIFIED } from '@/lib/site';

export const dynamic = 'force-static';

export async function GET() {
  const ids = await getSitemapIds();
  const lastmod = DEFAULT_LAST_MODIFIED.toISOString();

  const entries = ids
    .map(
      (id) =>
        `  <sitemap>\n` +
        `    <loc>${SITE_URL}/sitemap/${id}.xml</loc>\n` +
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
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

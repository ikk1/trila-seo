// app/sitemaps/[file]/route.ts
// Serve os sitemaps nomeados: core.xml, verticais.xml, locais.xml, locais-N.xml.
// Gerado em runtime (ISR 1 dia) — locais depende do Postgres interno.
import {
  getCoreEntries,
  getVerticaisEntries,
  getLocaisPage,
  getLocaisPageCount,
  renderUrlset,
  type SitemapEntry,
} from '@/lib/sitemap';

export const revalidate = 86400;

function notFound() {
  return new Response('Not found', { status: 404 });
}

function xml(body: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;

  if (file === 'core.xml') return xml(renderUrlset(getCoreEntries()));
  if (file === 'verticais.xml') return xml(renderUrlset(getVerticaisEntries()));

  // locais.xml = página 1; locais-2.xml, locais-3.xml = páginas seguintes.
  const locaisMatch = /^locais(?:-(\d+))?\.xml$/.exec(file);
  if (locaisMatch) {
    // Rejeita locais-1.xml explícito; página 1 só em locais.xml
    if (locaisMatch[1] === '1') return notFound();
    const page = locaisMatch[1] ? Number(locaisMatch[1]) : 1;
    if (page < 1 || page > (await getLocaisPageCount())) return notFound();
    const entries: SitemapEntry[] = await getLocaisPage(page);
    if (entries.length === 0) return notFound();
    return xml(renderUrlset(entries));
  }

  return notFound();
}

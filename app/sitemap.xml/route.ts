// app/sitemap.xml/route.ts
// Índice de sitemap gerado em runtime. Entry point padrão (/sitemap.xml).
// force-dynamic em vez de revalidate: rotas sem segmento dinâmico são
// pré-renderizadas no build (onde o DB interno não é alcançável), o que
// congelaria a contagem de páginas de locais.
import { getSitemapIndex, renderSitemapIndex } from '@/lib/sitemap';

export const dynamic = 'force-dynamic';

export async function GET() {
  const paths = await getSitemapIndex();
  return new Response(renderSitemapIndex(paths), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
    },
  });
}

// app/sitemap/[id]/route.ts
// Chunk de sitemap gerado em runtime (ISR 1 dia). URL: /sitemap/0, /sitemap/1, ...
import { getSitemapChunk, renderUrlset } from '@/lib/sitemap';

export const revalidate = 86400;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId < 0) {
    return new Response('Not found', { status: 404 });
  }
  const entries = await getSitemapChunk(numId);
  return new Response(renderUrlset(entries), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}

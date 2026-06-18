// app/llms.txt/route.ts
// Convenção llms.txt — índice em markdown que ferramentas de IA leem para
// entender o site. https://llmstxt.org/
import { SITE_URL, APP_URL } from '@/lib/site';
import { VERTICALS } from '@/lib/verticals';

export const dynamic = 'force-static';

export function GET() {
  const verticalLinks = VERTICALS.map(
    (v) => `- [Sistema para ${v.singular}](${SITE_URL}/sistema-para-${v.slug}): ${v.headline}`
  ).join('\n');

  const body = `# Trila

> Sistema de gestão para salões de beleza, barbearias, clínicas de estética e spas. Agenda online 24h, WhatsApp integrado, PIX, comissões automáticas, financeiro e IA — tudo no mesmo fluxo.

A Trila é um SaaS brasileiro para negócios de beleza e estética. O site público (${SITE_URL}) apresenta o produto e páginas por segmento e por cidade; o sistema em si fica em ${APP_URL}.

## Segmentos
${verticalLinks}

## Páginas principais
- [Planos](${SITE_URL}/planos): comparativo de planos e preços.
- [Inteligência Artificial](${SITE_URL}/inteligencia-artificial): recursos de IA da Trila.
- [Cidades](${SITE_URL}/cidades): índice de páginas locais por município.

## Recursos
- Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

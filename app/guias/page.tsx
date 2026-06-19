import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { listGuidesByVertical } from '@/lib/guides';
import { VERTICALS } from '@/lib/verticals';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Guias para negócios de beleza e estética',
    description: 'Guias práticos para abrir, precificar e gerir salões, barbearias, clínicas e mais.',
    path: '/guias',
  });
}

export default function GuiasIndex() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: 'Guias', path: '/guias' }])} />
      <h1 className="text-4xl text-text-main">Guias por segmento</h1>
      <p className="mt-4 leading-8 text-text-muted">
        Como abrir, precificar e operar cada tipo de negócio de beleza.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {VERTICALS.map((v) => {
          const count = listGuidesByVertical(v.slug).length;
          return (
            <Link key={v.slug} href={`/guias/${v.slug}`} className="rounded-2xl border border-black/6 bg-white p-6 hover:shadow-[var(--shadow-card-hover)]">
              <h2 className="text-xl text-text-main capitalize">{v.singular}</h2>
              <p className="mt-2 text-sm text-text-muted">
                {count > 0 ? `${count} guia(s) disponível(is)` : 'Guias em breve'}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

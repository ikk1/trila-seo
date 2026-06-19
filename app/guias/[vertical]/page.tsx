import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { listGuidesByVertical } from '@/lib/guides';
import { VERTICALS, getVerticalBySlug } from '@/lib/verticals';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ vertical: string }> };

export async function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vertical } = await params;
  const content = getVerticalBySlug(vertical);
  if (!content) return {};
  return buildMetadata({
    title: `Guias para ${content.singular}`,
    description: `Guias práticos para abrir, precificar e gerir ${content.pluralEstablishments}.`,
    path: `/guias/${vertical}`,
  });
}

export default async function VerticalGuidesHub({ params }: PageProps) {
  const { vertical } = await params;
  const content = getVerticalBySlug(vertical);
  if (!content) notFound();
  const guides = listGuidesByVertical(vertical);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Guias', path: '/guias' },
        { name: content.singular, path: `/guias/${vertical}` },
      ])} />
      <h1 className="text-4xl text-text-main">Guias para {content.singular}</h1>
      <p className="mt-4 leading-8 text-text-muted">
        Conteúdo prático para abrir, organizar e crescer {content.pluralEstablishments}.
      </p>
      {guides.length === 0 ? (
        <p className="mt-8 text-text-muted">Guias em breve.</p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {guides.map((g) => (
            <li key={g.topic}>
              <Link href={`/guias/${vertical}/${g.topic}`} className="block rounded-2xl border border-black/6 bg-white p-5 hover:shadow-[var(--shadow-card-hover)]">
                <h2 className="text-xl text-text-main">{g.frontmatter.title}</h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">{g.frontmatter.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

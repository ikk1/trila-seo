import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { Prose } from '@/components/Prose';
import { getGuide, listGuides, listGuidesByVertical } from '@/lib/guides';
import { getVerticalBySlug } from '@/lib/verticals';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildMetadata,
} from '@/lib/seo';
import { buildRegisterUrl } from '@/lib/site';

type PageProps = { params: Promise<{ vertical: string; topico: string }> };

export async function generateStaticParams() {
  return listGuides().map((g) => ({ vertical: g.vertical, topico: g.topic }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vertical, topico } = await params;
  const guide = getGuide(vertical, topico);
  if (!guide) return {};
  return buildMetadata({
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    path: `/guias/${vertical}/${topico}`,
  });
}

export default async function GuidePage({ params }: PageProps) {
  const { vertical, topico } = await params;
  const guide = getGuide(vertical, topico);
  const content = getVerticalBySlug(vertical);
  if (!guide || !content) notFound();

  const path = `/guias/${vertical}/${topico}`;
  const siblings = listGuidesByVertical(vertical)
    .filter((g) => g.topic !== topico)
    .slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={buildArticleJsonLd({ title: guide.frontmatter.title, description: guide.frontmatter.description, path, updatedAt: guide.frontmatter.updatedAt })} />
      <JsonLd data={buildFaqJsonLd(guide.frontmatter.faq.map((f) => ({ question: f.q, answer: f.answer })))} />
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: 'Guias', path: '/guias' },
        { name: content.singular, path: `/guias/${vertical}` },
        { name: guide.frontmatter.title, path },
      ])} />

      <nav className="text-sm text-text-muted">
        <Link href="/guias" className="hover:text-primary">Guias</Link>
        {' / '}
        <Link href={`/guias/${vertical}`} className="hover:text-primary">{content.singular}</Link>
      </nav>

      <h1 className="mt-4 text-balance text-4xl text-text-main">{guide.frontmatter.title}</h1>

      <ul className="mt-8 grid gap-2 rounded-2xl border border-black/6 bg-surface p-6">
        {guide.frontmatter.keyTakeaways.map((k) => (
          <li key={k} className="text-text-muted">• {k}</li>
        ))}
      </ul>

      <article className="mt-10">
        <Prose markdown={guide.body} />
      </article>

      <section className="mt-12 rounded-2xl border border-black/6 bg-surface p-6">
        <h2>Perguntas frequentes</h2>
        <div className="mt-6 grid gap-4">
          {guide.frontmatter.faq.map((f) => (
            <div key={f.q} className="rounded-xl border border-black/6 bg-white p-4">
              <h3>{f.q}</h3>
              <p className="mt-2 leading-7 text-text-muted">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 flex flex-col gap-3 sm:flex-row">
        <a href={buildRegisterUrl(`guia-${vertical}`)} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark">
          Conhecer a Trila
        </a>
        <Link href={`/sistema-para-${vertical}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main hover:bg-surface">
          Sistema para {content.singular}
        </Link>
      </section>

      {siblings.length > 0 && (
        <section className="mt-12">
          <h2>Outros guias de {content.singular}</h2>
          <ul className="mt-4 grid gap-2">
            {siblings.map((s) => (
              <li key={s.topic}>
                <Link href={`/guias/${vertical}/${s.topic}`} className="text-primary hover:underline">
                  {s.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

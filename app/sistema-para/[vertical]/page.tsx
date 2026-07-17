import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { loadCities } from '@/lib/locations';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from '@/lib/seo';
import { buildRegisterUrl } from '@/lib/site';
import { VERTICALS, getVerticalBySlug } from '@/lib/verticals';
import { listGuidesByVertical } from '@/lib/guides';

type PageProps = {
  params: Promise<{ vertical: string }>;
};

export async function generateStaticParams() {
  return VERTICALS.map((vertical) => ({ vertical: vertical.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vertical } = await params;
  const content = getVerticalBySlug(vertical);

  if (!content) {
    return {};
  }

  return buildMetadata({
    title: content.seoTitle,
    description: content.description,
    path: `/sistema-para-${content.slug}`,
  });
}

export default async function VerticalPage({ params }: PageProps) {
  const { vertical } = await params;
  const content = getVerticalBySlug(vertical);

  if (!content) {
    notFound();
  }

  const cities = await loadCities();
  const guias = listGuidesByVertical(content.slug).slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd data={buildFaqJsonLd(content.faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: `Sistema para ${content.singular}`, path: `/sistema-para-${content.slug}` },
        ])}
      />

      <section className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
        <div>
          <span className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-sm font-semibold text-primary">
            {content.singular}
          </span>
          <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl">
            {content.headline}
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-muted">{content.hero}</p>
          <p className="mt-4 leading-8 text-text-muted">{content.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={buildRegisterUrl(`seo-${content.slug}`)}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
            >
              Acessar o sistema
            </a>
            <Link
              href="/planos"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main hover:bg-surface"
            >
              Ver posicionamento comercial
            </Link>
          </div>
        </div>

        <aside className="rounded-[24px] border border-black/6 bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Cobertura de mensagem
          </p>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-black/6 bg-white p-4">
              <p className="font-semibold">Negócio alvo</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {content.pluralEstablishments} e {content.pluralProfessionals} que precisam
                de previsibilidade operacional.
              </p>
            </div>
            <div className="rounded-2xl border border-black/6 bg-white p-4">
              <p className="font-semibold">Leitura principal</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Agenda, recorrência, financeiro e relação com cliente no mesmo fluxo.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2>Onde a operação costuma travar</h2>
          <ul className="mt-6 grid gap-4">
            {content.painPoints.map((item) => (
              <li key={item} className="rounded-2xl border border-black/6 bg-surface p-4 text-text-muted">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2>Como a Trila responde</h2>
          <ul className="mt-6 grid gap-4">
            {content.features.map((item) => (
              <li key={item} className="rounded-2xl border border-black/6 bg-surface p-4 text-text-muted">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-16 rounded-[28px] border border-black/6 bg-surface p-8">
        <h2>Perguntas frequentes sobre sistema para {content.singular}</h2>
        <div className="mt-8 grid gap-5">
          {content.faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-black/6 bg-white p-5">
              <h3>{faq.question}</h3>
              <p className="mt-3 leading-7 text-text-muted">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="max-w-3xl">
          <h2>Mercados locais em destaque para {content.singular}</h2>
          <p className="mt-4 leading-8 text-text-muted">
            Estas páginas conectam a vertical com cidades prioritárias já publicadas no índice local.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cities.slice(0, 24).map((city) => (
            <Link
              key={`${city.uf}-${city.slug}-${content.slug}`}
              href={`/${city.uf}/${city.slug}/${content.slug}`}
              className="rounded-[20px] border border-black/6 bg-white p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                {city.region}
              </p>
              <h3 className="mt-3 text-xl">{city.city}</h3>
              <p className="mt-3 text-sm leading-6 text-text-muted">{city.marketNote}</p>
            </Link>
          ))}
        </div>
      </section>

      {guias.length > 0 && (
        <section className="mt-16">
          <h2>Guias para {content.singular}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {guias.map((g) => (
              <Link
                key={g.topic}
                href={`/guias/${content.slug}/${g.topic}`}
                className="rounded-[20px] border border-black/6 bg-white p-5 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <h3 className="text-lg">{g.frontmatter.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{g.frontmatter.description}</p>
              </Link>
            ))}
          </div>
          <Link href={`/guias/${content.slug}`} className="mt-6 inline-block text-primary hover:underline">
            Ver todos os guias de {content.singular} →
          </Link>
        </section>
      )}
    </main>
  );
}

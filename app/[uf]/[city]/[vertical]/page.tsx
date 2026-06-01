import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildMetadata,
} from '@/lib/seo';
import { loadCities } from '@/lib/locations';
import { loadCityVerticalInsights } from '@/lib/city-insights';
import { VERTICALS } from '@/lib/verticals';
import { resolveCityVertical, buildCityVerticalDescription, buildCityVerticalTitle, shouldIndexCityVertical } from '@/lib/city-pages';
import { APP_URL } from '@/lib/site';

type PageProps = {
  params: Promise<{ uf: string; city: string; vertical: string }>;
};

export const revalidate = 86400;

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export async function generateStaticParams() {
  const cities = await loadCities();
  return cities.flatMap((city) =>
    VERTICALS.map((vertical) => ({
      uf: city.uf,
      city: city.slug,
      vertical: vertical.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uf, city, vertical } = await params;
  const resolved = await resolveCityVertical(uf, city, vertical);

  if (!resolved) {
    return { robots: { index: false, follow: true } };
  }

  const insights =
    typeof resolved.city.id === 'number'
      ? await loadCityVerticalInsights(resolved.city.id, resolved.vertical.slug)
      : null;
  const indexable = shouldIndexCityVertical(resolved.city, insights !== null);

  return {
    ...buildMetadata({
      title: buildCityVerticalTitle(resolved.city.city, resolved.vertical),
      description: buildCityVerticalDescription(resolved.city.city, resolved.vertical),
      path: `/${resolved.city.uf}/${resolved.city.slug}/${resolved.vertical.slug}`,
    }),
    robots: { index: indexable, follow: true },
  };
}

export default async function CityVerticalPage({ params }: PageProps) {
  const { uf, city, vertical } = await params;
  const resolved = await resolveCityVertical(uf, city, vertical);

  if (!resolved) {
    notFound();
  }

  const { city: cityEntry, vertical: verticalEntry } = resolved;
  const insights =
    typeof cityEntry.id === 'number'
      ? await loadCityVerticalInsights(cityEntry.id, verticalEntry.slug)
      : null;
  const faqs = [
    {
      question: `A Trila funciona para ${verticalEntry.singular} em ${cityEntry.city}?`,
      answer:
        `Sim. A Trila atende ${verticalEntry.pluralEstablishments} em ${cityEntry.city} e região, ` +
        `com agenda online, confirmação por WhatsApp, financeiro e histórico de cliente no mesmo fluxo.`,
    },
    {
      question: `Quanto custa o sistema para ${verticalEntry.singular}?`,
      answer:
        'Os planos começam no valor de entrada publicado na página de planos, com teste sem cartão. ' +
        'O preço não muda por cidade — você paga pelo plano, não pela praça.',
    },
    ...verticalEntry.faqs,
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: cityEntry.city, path: `/${cityEntry.uf}/${cityEntry.slug}` },
          {
            name: `Sistema para ${verticalEntry.singular} em ${cityEntry.city}`,
            path: `/${cityEntry.uf}/${cityEntry.slug}/${verticalEntry.slug}`,
          },
        ])}
      />

      <section className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
        <div>
          <span className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-sm font-semibold text-primary">
            {cityEntry.city} · {cityEntry.region}
          </span>
          <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl">
            {buildCityVerticalTitle(cityEntry.city, verticalEntry)}
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-muted">
            {buildCityVerticalDescription(cityEntry.city, verticalEntry)}
          </p>
          <p className="mt-4 leading-8 text-text-muted">
            Em {cityEntry.city}, {verticalEntry.singular} pode se beneficiar de uma operação
            que organiza agenda, confirmação, financeiro e histórico de cliente em um único fluxo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={APP_URL}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
            >
              Acessar o sistema
            </a>
            <Link
              href={`/${cityEntry.uf}/${cityEntry.slug}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main hover:bg-surface"
            >
              Ver hub da cidade
            </Link>
          </div>
        </div>

        <aside className="rounded-[24px] border border-black/6 bg-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            Cidade de foco
          </p>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-black/6 bg-white p-4">
              <p className="font-semibold">{cityEntry.city}</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {cityEntry.isCapital ? 'Capital' : 'Município'} da região {cityEntry.region}.
              </p>
            </div>
            <div className="rounded-2xl border border-black/6 bg-white p-4">
              <p className="font-semibold">Porte de mercado</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {cityEntry.populationLabel}. {cityEntry.marketNote}
              </p>
            </div>
          </div>
        </aside>
      </section>

      {insights && (
        <section className="mt-16 space-y-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Sinais do mercado
            </p>
            <h2 className="mt-3 text-3xl text-text-main">
              O que os dados já indicam para essa combinação
            </h2>
            <p className="mt-4 leading-8 text-text-muted">
              Quando existem registros consolidados no `seo.*`, esta página mostra a leitura
              operacional da cidade e da vertical com base em ticket, preços e prova social.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {insights.ticket && (
              <article className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Ticket mediano
                </p>
                <p className="mt-4 text-4xl font-semibold text-text-main">
                  {money.format(insights.ticket.ticketP50)}
                </p>
                <p className="mt-3 text-sm leading-7 text-text-muted">
                  Faixa observada entre {money.format(insights.ticket.ticketP25)} e{' '}
                  {money.format(insights.ticket.ticketP75)}.
                </p>
                {insights.ticket.noShowPct !== null && (
                  <p className="mt-3 text-sm leading-7 text-text-muted">
                    No-show estimado de {percent.format(insights.ticket.noShowPct)} nas amostras
                    consolidadas.
                  </p>
                )}
              </article>
            )}

            {insights.servicePrices.length > 0 && (
              <article className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)] lg:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Faixa de preços por serviço
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {insights.servicePrices.map((price) => (
                    <div key={price.serviceType} className="rounded-2xl border border-black/6 bg-surface p-4">
                      <p className="font-semibold text-text-main">{price.serviceType}</p>
                      <p className="mt-2 text-sm leading-6 text-text-muted">
                        Mediana de {money.format(price.p50)}. Faixa entre {money.format(price.p25)} e{' '}
                        {money.format(price.p75)}.
                      </p>
                      <p className="mt-2 text-xs text-text-muted">
                        Base: {price.sampleSize} registros consolidados.
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </div>

          {insights.testimonials.length > 0 && (
            <article className="rounded-[28px] border border-black/6 bg-surface p-8">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Prova social
                </p>
                <h2 className="mt-3 text-3xl text-text-main">
                  Depoimentos ligados a essa vertical
                </h2>
                <p className="mt-4 leading-8 text-text-muted">
                  Quando há relatos aprovados no banco, a página mostra comentários públicos
                  para reforçar a leitura comercial da combinação.
                </p>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {insights.testimonials.map((testimonial) => (
                  <figure key={testimonial.id} className="rounded-2xl border border-black/6 bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-text-main">{testimonial.displayName}</p>
                        <p className="mt-1 text-xs text-text-muted">{testimonial.role}</p>
                      </div>
                      <span className="rounded-full border border-black/6 bg-surface px-2.5 py-1 text-xs font-semibold text-primary">
                        {'★'.repeat(testimonial.rating)}
                      </span>
                    </div>
                    <blockquote className="mt-4 text-sm leading-7 text-text-muted">
                      {testimonial.body}
                    </blockquote>
                    {testimonial.citySpecific && (
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                        Depoimento local
                      </p>
                    )}
                  </figure>
                ))}
              </div>
            </article>
          )}
        </section>
      )}

      <section className="mt-16 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2>Onde a demanda local costuma pesar</h2>
          <ul className="mt-6 grid gap-4">
            {verticalEntry.painPoints.map((item) => (
              <li key={item} className="rounded-2xl border border-black/6 bg-surface p-4 text-text-muted">
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]">
          <h2>Como a Trila ajuda nessa praça</h2>
          <ul className="mt-6 grid gap-4">
            {verticalEntry.features.map((item) => (
              <li key={item} className="rounded-2xl border border-black/6 bg-surface p-4 text-text-muted">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mt-16 rounded-[28px] border border-black/6 bg-surface p-8">
        <h2>Perguntas frequentes sobre {verticalEntry.singular} em {cityEntry.city}</h2>
        <div className="mt-8 grid gap-5">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-black/6 bg-white p-5">
              <h3>{faq.question}</h3>
              <p className="mt-3 leading-7 text-text-muted">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

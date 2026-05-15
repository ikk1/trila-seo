import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { loadCities, loadCity } from '@/lib/locations';
import { VERTICALS } from '@/lib/verticals';
import { buildCityPageDescription, buildCityPageTitle } from '@/lib/city-pages';

type PageProps = {
  params: Promise<{ uf: string; city: string }>;
};

export async function generateStaticParams() {
  const cities = await loadCities();
  return cities.map((entry) => ({ uf: entry.uf, city: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uf, city } = await params;
  const entry = await loadCity(uf, city);

  if (!entry) {
    return {};
  }

  return buildMetadata({
    title: buildCityPageTitle(entry.city),
    description: buildCityPageDescription(entry.city, entry.marketNote),
    path: `/${entry.uf}/${entry.slug}`,
  });
}

export default async function CityPage({ params }: PageProps) {
  const { uf, city } = await params;
  const entry = await loadCity(uf, city);

  if (!entry) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: entry.city, path: `/${entry.uf}/${entry.slug}` },
        ])}
      />

      <section className="max-w-3xl">
        <span className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-sm font-semibold text-primary">
          {entry.region}
        </span>
        <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl">
          {buildCityPageTitle(entry.city)}
        </h1>
        <p className="mt-6 text-lg leading-8 text-text-muted">
          {buildCityPageDescription(entry.city, entry.marketNote)}
        </p>
        <p className="mt-4 leading-8 text-text-muted">
          Esta cidade concentra oportunidades para salões, barbearias, clínicas de estética,
          spas e outros negócios de beleza que precisam de gestão mais previsível.
        </p>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {VERTICALS.map((vertical) => (
          <Link
            key={vertical.slug}
            href={`/${entry.uf}/${entry.slug}/${vertical.slug}`}
            className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {vertical.singular}
            </p>
            <h2 className="mt-4 text-2xl text-text-main">{vertical.headline}</h2>
            <p className="mt-4 leading-7 text-text-muted">{vertical.description}</p>
            <span className="mt-6 inline-flex font-semibold text-primary">
              Ver página para {entry.city}
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

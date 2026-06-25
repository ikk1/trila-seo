import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { loadCities } from '@/lib/locations';
import { isCuratedCity } from '@/lib/city-pages';
import { buildBreadcrumbJsonLd, buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Cidades atendidas pela Trila',
  description:
    'Veja as cidades priorizadas pela Trila para páginas locais de salões, barbearias, clínicas e spas.',
  path: '/cidades',
});

const REGION_ORDER = ['Sudeste', 'Sul', 'Centro-Oeste', 'Nordeste', 'Norte'];

export default async function CitiesIndexPage() {
  const cities = (await loadCities()).filter(isCuratedCity);
  const grouped = REGION_ORDER.map((region) => ({
    region,
    cities: cities.filter((city) => city.region === region),
  })).filter((group) => group.cities.length > 0);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Cidades', path: '/cidades' },
        ])}
      />

      <section className="max-w-3xl">
        <span className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-sm font-semibold text-primary">
          SEO local
        </span>
        <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl">
          Cidades atendidas pela Trila
        </h1>
        <p className="mt-6 text-lg leading-8 text-text-muted">
          Este índice reúne os mercados locais priorizados para salões, barbearias,
          clínicas de estética e spas.
        </p>
      </section>

      <section className="mt-14 space-y-12">
        {grouped.map((group) => (
          <div key={group.region}>
            <h2>{group.region}</h2>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              {group.cities.length} cidades no índice local atual.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.cities.map((city) => (
                <Link
                  key={`${city.uf}-${city.slug}`}
                  href={`/${city.uf}/${city.slug}`}
                  className="rounded-[24px] border border-black/6 bg-white p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-text-main">{city.city}</p>
                    <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {city.uf}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-text-muted">{city.marketNote}</p>
                  <p className="mt-4 text-xs leading-5 text-text-muted">{city.populationLabel}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

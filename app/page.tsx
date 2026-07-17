import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildOrganizationJsonLd,
  buildSoftwareJsonLd,
} from '@/lib/seo';
import { loadCities } from '@/lib/locations';
import { buildRegisterUrl } from '@/lib/site';
import { TRIAL_LABEL, loadPlans, getLowestPlanPrice } from '@/lib/plans';
import { VERTICALS } from '@/lib/verticals';

// Revalida de hora em hora, igual a /planos: o preço lido do banco (usado no schema.org
// offers) acompanha mudanças feitas no admin sem precisar de redeploy.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Sistema para salão de beleza, barbearia e estética',
  description:
    'Agenda online, controle de caixa, comissões e CRM num sistema só, com IA que sugere o que fazer no dia. 14 dias grátis, sem cartão.',
  path: '/',
});

const highlights = [
  'Agenda, confirmações e operação em um fluxo único.',
  'Financeiro, comissões e rotina diária com menos improviso.',
  'Pensado para negócios de beleza que precisam de previsibilidade.',
];

const features = [
  'Agenda online',
  'Lembretes e confirmações',
  'Controle financeiro',
  'Comissões e repasses',
  'Histórico de clientes',
  'Relatório de recorrência',
];

const sections = [
  {
    title: 'Agenda sem ruído operacional',
    body: 'Centralize horários, confirmações e rotina da recepção para reduzir retrabalho e no-show.',
  },
  {
    title: 'Financeiro que fecha junto com a operação',
    body: 'Acompanhe caixa, repasses e visão diária sem depender de planilhas paralelas.',
  },
  {
    title: 'Crescimento com visão real da base',
    body: 'Histórico de clientes e recorrência ajudam a entender retorno, frequência e produtividade.',
  },
];

export default async function HomePage() {
  const [cities, plans] = await Promise.all([loadCities(), loadPlans()]);
  const lowestPlanPrice = getLowestPlanPrice(plans);

  return (
    <main className="bg-background">
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildSoftwareJsonLd(lowestPlanPrice)} />
      <JsonLd data={buildBreadcrumbJsonLd([{ name: 'Home', path: '/' }])} />

      <section className="relative overflow-hidden border-b border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(158,90,82,0.14),_transparent_35%),linear-gradient(180deg,_#fff_0%,_#f9f7f7_100%)]">
        <div className="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center gap-12 px-6 py-20 lg:flex-row lg:items-center">
          <div className="max-w-3xl flex-1">
            <span className="inline-flex rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              Software de gestão para beleza e estética
            </span>
            <h1 className="mt-6 max-w-4xl text-balance text-4xl text-text-main sm:text-5xl lg:text-6xl">
              Operação de beleza organizada para crescer sem depender de improviso.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
              A Trila concentra agenda, financeiro, relacionamento e rotina operacional
              de salões, barbearias, clínicas de estética e spas em um único sistema.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildRegisterUrl('home')}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-[var(--shadow-card-hover)] transition-colors hover:bg-primary-dark"
              >
                Começar grátis
              </a>
              <Link
                href="/planos"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main transition-colors hover:bg-surface"
              >
                Ver planos e preços
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-text-muted">
              {TRIAL_LABEL} · cancele quando quiser
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-text-muted sm:grid-cols-3">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-black/6 bg-white/80 p-4 shadow-[var(--shadow-card)]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {features.map((feat) => (
                <span
                  key={feat}
                  className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-medium text-text-muted"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-[28px] border border-black/6 bg-text-main p-6 text-white shadow-[var(--shadow-modal)]">
              <div className="rounded-2xl border border-white/10 bg-white/6 p-5">
                <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                  Leitura operacional
                </p>
                <div className="mt-5 grid gap-4">
                  {sections.map((section) => (
                    <div
                      key={section.title}
                      className="rounded-2xl border border-white/8 bg-white/5 p-4"
                    >
                      <p className="font-semibold">{section.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/70">
                        {section.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 rounded-[28px] border border-black/6 bg-text-main p-8 text-white shadow-[var(--shadow-modal)] lg:grid-cols-2 lg:p-12">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              Diferencial: IA aplicada
            </span>
            <h2 className="mt-6 text-3xl text-white sm:text-4xl">
              Uma IA que te diz o que fazer hoje.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/75">
              Todo dia a Trila lê os dados do seu salão e sugere uma ação concreta para
              reter clientes e encher a agenda. É o tipo de ajuda que nenhuma planilha dá.
            </p>
            <Link
              href="/inteligencia-artificial"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-text-main transition-colors hover:bg-surface"
            >
              Conhecer a IA da Trila →
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/6 p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm">✨</span>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
                Insight do dia
              </p>
            </div>
            <p className="mt-4 text-lg leading-7">
              “Você tem 12 clientes que não voltam há 45 dias. Considere criar uma campanha
              de reengajamento.”
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="max-w-3xl">
          <h2>Segmentos que a Trila atende</h2>
          <p className="mt-4 text-lg leading-8 text-text-muted">
            De salão de beleza a espaço de estética, a Trila adapta agenda,
            financeiro e rotina ao ritmo de cada operação.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {VERTICALS.map((vertical) => (
            <Link
              key={vertical.slug}
              href={`/sistema-para-${vertical.slug}`}
              className="group rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                {vertical.singular}
              </p>
              <h3 className="mt-4 text-2xl text-text-main">{vertical.headline}</h3>
              <p className="mt-4 leading-7 text-text-muted">{vertical.description}</p>
              <span className="mt-6 inline-flex items-center gap-1 font-semibold text-primary">
                Ver página da vertical
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="max-w-3xl">
          <h2>Mercados prioritários</h2>
          <p className="mt-4 text-lg leading-8 text-text-muted">
            Começamos por cidades com forte densidade de negócios de beleza e estética.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cities.slice(0, 8).map((city) => (
            <Link
              key={`${city.uf}-${city.slug}`}
              href={`/${city.uf}/${city.slug}`}
              className="rounded-[24px] border border-black/6 bg-white p-5 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                {city.region}
              </p>
              <h3 className="mt-3 text-xl text-text-main">{city.city}</h3>
              <p className="mt-3 text-sm leading-6 text-text-muted">{city.marketNote}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/cidades" className="inline-flex items-center gap-1 font-semibold text-primary">
            Ver índice completo de cidades
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildOrganizationJsonLd,
  buildSoftwareJsonLd,
} from '@/lib/seo';
import { APP_URL } from '@/lib/site';
import { VERTICALS } from '@/lib/verticals';

export const metadata = buildMetadata({
  title: 'Sistema de gestão para salões, barbearias e clínicas',
  description:
    'Sistema para agenda, financeiro, WhatsApp e operação de negócios de beleza e estética.',
  path: '/',
});

const highlights = [
  'Agenda, confirmações e operação em um fluxo único.',
  'Financeiro, comissões e rotina diária com menos improviso.',
  'Pensado para negócios de beleza que precisam de previsibilidade.',
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

export default function HomePage() {
  return (
    <main className="bg-background">
      <JsonLd data={buildOrganizationJsonLd()} />
      <JsonLd data={buildSoftwareJsonLd()} />
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
                href={APP_URL}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-[var(--shadow-card-hover)] transition-colors hover:bg-primary-dark"
              >
                Acessar o sistema
              </a>
              <Link
                href="/planos"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main transition-colors hover:bg-surface"
              >
                Ver como a Trila se posiciona
              </Link>
            </div>
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
        <div className="max-w-3xl">
          <h2>Segmentos que a Trila atende</h2>
          <p className="mt-4 text-lg leading-8 text-text-muted">
            As primeiras páginas de SEO foram organizadas por vertical para capturar
            demanda mais específica sem misturar a mensagem de cada operação.
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
              <span className="mt-6 inline-flex font-semibold text-primary">
                Ver página da vertical
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

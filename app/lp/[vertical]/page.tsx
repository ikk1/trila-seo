import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getVerticalBySlug } from '@/lib/verticals';
import {
  LP_VERTICAL_SLUGS,
  isLpVertical,
  buildLpRegisterUrl,
  LP_HERO_COPY,
  type LpVerticalSlug,
} from '@/lib/lp';

type PageProps = {
  params: Promise<{ vertical: string }>;
};

export function generateStaticParams() {
  return LP_VERTICAL_SLUGS.map((vertical) => ({ vertical }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vertical } = await params;
  if (!isLpVertical(vertical)) return {};
  const copy = LP_HERO_COPY[vertical];
  return {
    title: copy.headline,
    description: copy.subheadline,
    // Página de Ads: fora do índice e sem repassar autoridade. Não compete com a
    // página de SEO sistema-para/[vertical] nem é vista como conteúdo duplicado.
    robots: { index: false, follow: false },
  };
}

/** Botão de conversão. Mesmo verbo do começo ao fim do funil: "Criar conta grátis". */
function PrimaryCta({ href, className = '' }: { href: string; className?: string }) {
  return (
    <a
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-7 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      Criar conta grátis
    </a>
  );
}

/** Elemento-assinatura: a agenda do dia da barbearia, cheia — a promessa, visível. */
function AgendaCard({ services }: { services: string[] }) {
  const slots = [
    { time: '14:00', name: 'João Mendes', service: services[0], status: 'confirmado' as const },
    { time: '15:00', name: 'Pedro Alves', service: services[1], status: 'confirmado' as const },
    { time: '16:00', name: null, service: services[2], status: 'livre' as const },
  ];

  return (
    <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-white p-6 text-text-main shadow-2xl shadow-black/40">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Agenda de hoje
          </p>
          <p className="mt-1 text-lg font-semibold">Sexta · 14h às 18h</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          4 de 5 cheios
        </span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {slots.map((slot) => (
          <li
            key={slot.time}
            className={
              slot.status === 'livre'
                ? 'flex items-center gap-3 rounded-2xl border border-dashed border-black/15 bg-surface/60 px-4 py-3'
                : 'flex items-center gap-3 rounded-2xl border border-black/6 bg-surface px-4 py-3'
            }
          >
            <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-text-muted">
              {slot.time}
            </span>
            {slot.status === 'livre' ? (
              <span className="text-sm text-text-muted">Horário livre — encaixe</span>
            ) : (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{slot.name}</span>
                <span className="block truncate text-xs text-text-muted">{slot.service}</span>
              </span>
            )}
            {slot.status === 'confirmado' && (
              <span className="shrink-0 rounded-full bg-emerald-500/12 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                confirmado
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-text-main/[0.04] px-4 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <p className="text-xs leading-snug text-text-muted">
          Cada horário com confirmação do cliente, sem retrabalho na recepção.
        </p>
      </div>
    </div>
  );
}

export default async function LpPage({ params }: PageProps) {
  const { vertical } = await params;
  if (!isLpVertical(vertical)) notFound();
  const content = getVerticalBySlug(vertical);
  if (!content) notFound();

  const copy = LP_HERO_COPY[vertical as LpVerticalSlug];
  const registerUrl = buildLpRegisterUrl(vertical);
  const valueProps = [
    { title: 'Agenda', body: 'Horários, encaixes e confirmação num lugar só.' },
    { title: 'Clientes', body: 'Histórico e frequência de retorno de cada um.' },
    { title: 'Financeiro', body: 'Caixa do dia sem depender de memória.' },
    { title: 'Comissões', body: 'Repasse por profissional, calculado sozinho.' },
  ];
  // dor → resposta, na ordem em que vêm da vertical
  const painSolutions = content.painPoints.map((pain, i) => ({
    pain,
    solution: content.features[i] ?? content.features[content.features.length - 1],
  }));

  return (
    <main>
      {/* HERO escuro — a cara da barbearia, terracota só no que importa clicar */}
      <section className="relative overflow-hidden bg-[#17120f] text-white">
        <div
          className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full opacity-60 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(158,90,82,0.45), transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-20 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-[#e9b8b0]">
              {copy.eyebrow}
            </span>
            <h1 className="mt-6 text-balance text-4xl leading-[1.05] sm:text-5xl">
              {copy.headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/70">{copy.subheadline}</p>

            <div className="mt-9">
              <PrimaryCta href={registerUrl} />
              <p className="mt-3 text-sm text-white/45">14 dias grátis · sem cartão de crédito</p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
              {valueProps.map((v) => (
                <span key={v.title} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {v.title}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <AgendaCard services={copy.services} />
          </div>
        </div>
      </section>

      {/* Faixa de valor */}
      <section className="border-b border-black/6 bg-background">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-black/6 bg-white p-5 shadow-[var(--shadow-card)]"
            >
              <p className="text-base font-semibold text-text-main">{v.title}</p>
              <p className="mt-1.5 text-sm leading-6 text-text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dor → solução */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-2xl text-3xl text-text-main sm:text-4xl">
            O que trava a {content.singular} hoje — e o que a Trila resolve
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {painSolutions.map(({ pain, solution }) => (
              <article
                key={pain}
                className="flex flex-col rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-text-muted">
                  O problema
                </p>
                <p className="mt-3 leading-7 text-text-main">{pain}</p>
                <div className="my-5 h-px bg-black/6" />
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                  Com a Trila
                </p>
                <p className="mt-3 leading-7 text-text-muted">{solution}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-black/6 bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="text-3xl text-text-main sm:text-4xl">Perguntas frequentes</h2>
          <div className="mt-10 space-y-4">
            {content.faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-black/6 bg-white p-6">
                <h3 className="text-lg font-semibold text-text-main">{faq.question}</h3>
                <p className="mt-3 leading-7 text-text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[#17120f] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl text-white sm:text-3xl">Comece com a agenda de amanhã.</h2>
            <p className="mt-2 text-white/60">14 dias grátis, sem cartão. Leva poucos minutos.</p>
          </div>
          <PrimaryCta href={registerUrl} className="shrink-0" />
        </div>
      </section>

      {/* Rodapé mínimo — sem links de fuga, só o essencial de LGPD */}
      <footer className="bg-[#17120f] text-white/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 pb-10 pt-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© Trila — sistema para {content.pluralEstablishments}.</span>
          <a href="/privacidade" className="hover:text-white/70">
            Política de Privacidade
          </a>
        </div>
      </footer>
    </main>
  );
}

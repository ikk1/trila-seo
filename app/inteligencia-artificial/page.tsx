import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from '@/lib/seo';
import { TRIAL_LABEL, PLAN_CTA } from '@/lib/plans';
import { buildRegisterUrl } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'IA para salão de beleza — um consultor que diz o que fazer hoje',
  description:
    'A Trila tem uma IA que lê os dados do seu salão e sugere, todo dia, uma ação concreta para reter clientes, encher a agenda e crescer. Comece com 14 dias grátis.',
  path: '/inteligencia-artificial',
});

// Exemplos fiéis ao que o insight diário realmente gera (DashboardInsightService).
const insightExamples = [
  'Você tem 12 clientes que não voltam há 45 dias. Considere criar uma campanha de reengajamento.',
  'Esta semana você tem 8 agendamentos a mais que a semana anterior — ótimo momento para maximizar a receita!',
  'Você tem 5 clientes cadastrados — crie uma promoção de boas-vindas para atrair seus primeiros 20 clientes.',
  'Sua base está crescendo — lance uma campanha de indicação para seus clientes atuais e acelere o crescimento.',
];

const capabilities = [
  {
    title: 'Lê os seus números, não os do mercado',
    body: 'A IA olha clientes sem retorno, agendamentos da semana e receita do mês do seu próprio salão — e transforma isso em uma recomendação específica, com nome e número.',
  },
  {
    title: 'Entende a fase do seu negócio',
    body: 'Quem está começando recebe sugestões para atrair os primeiros clientes. Quem já tem base recebe ações de retenção e recompra. O conselho muda junto com você.',
  },
  {
    title: 'Sugere campanhas prontas',
    body: 'Quando faz sentido reativar clientes ou preencher horários, a IA já indica a campanha a disparar — você revisa e envia.',
  },
  {
    title: 'Resume novidades em português claro',
    body: 'As atualizações do sistema chegam explicadas sem jargão técnico, do jeito que um dono de salão entende.',
  },
];

const faqs = [
  {
    question: 'A IA agenda clientes sozinha?',
    answer:
      'A IA responde dúvidas comuns e direciona o cliente para o agendamento no portal, mas quem confirma o horário é você ou o cliente. A IA acelera o atendimento, não substitui sua decisão.',
  },
  {
    question: 'Preciso entender de tecnologia para usar?',
    answer:
      'Não. O insight aparece pronto no painel, em uma frase, com a ação sugerida. Você só decide se quer agir.',
  },
  {
    question: 'A IA está em qual plano?',
    answer:
      'Os insights de IA fazem parte do plano Pro. Você pode testar tudo por 14 dias grátis, sem cartão de crédito.',
  },
];

export default function AiPage() {
  return (
    <main className="bg-background">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Inteligência Artificial', path: '/inteligencia-artificial' },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/5 bg-[radial-gradient(circle_at_top_right,_rgba(158,90,82,0.14),_transparent_38%),linear-gradient(180deg,_#fff_0%,_#f9f7f7_100%)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center">
          <div className="max-w-3xl flex-1">
            <span className="inline-flex rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              Inteligência artificial aplicada
            </span>
            <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl lg:text-6xl">
              Uma IA que te diz o que fazer hoje para o salão crescer.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
              Todo dia a Trila analisa os dados do seu negócio e entrega uma recomendação
              concreta — quem reativar, quando a agenda está aquecendo, qual campanha
              disparar. Sem planilha, sem achismo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildRegisterUrl('ia')}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-[var(--shadow-card-hover)] transition-colors hover:bg-primary-dark"
              >
                {PLAN_CTA}
              </a>
              <Link
                href="/planos"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main transition-colors hover:bg-surface"
              >
                Ver planos e preços
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-text-muted">{TRIAL_LABEL}</p>
          </div>

          {/* Mock do insight diário no painel */}
          <div className="flex-1">
            <div className="rounded-[28px] border border-black/6 bg-text-main p-6 text-white shadow-[var(--shadow-modal)]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm">✨</span>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
                  Insight do dia
                </p>
              </div>
              <p className="mt-5 text-lg leading-7">
                “{insightExamples[0]}”
              </p>
              <div className="mt-5 flex gap-2">
                <span className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
                  Criar campanha
                </span>
                <span className="inline-flex rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80">
                  Ver clientes
                </span>
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-[0.16em] text-white/50">
                  Outros dias podem trazer
                </p>
                <ul className="mt-3 grid gap-2.5">
                  {insightExamples.slice(1).map((ex) => (
                    <li key={ex} className="text-sm leading-6 text-white/75">
                      “{ex}”
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capacidades */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <h2>O que a IA da Trila faz de verdade</h2>
          <p className="mt-4 text-lg leading-8 text-text-muted">
            Nada de promessa vaga. Aqui está, em concreto, onde a inteligência artificial
            trabalha a favor do seu salão.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {capabilities.map((cap) => (
            <article
              key={cap.title}
              className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-xl text-text-main">{cap.title}</h3>
              <p className="mt-3 leading-7 text-text-muted">{cap.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[28px] border border-black/6 bg-surface p-8">
          <h2>Perguntas frequentes sobre a IA</h2>
          <div className="mt-8 grid gap-5">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-black/6 bg-white p-5">
                <h3>{faq.question}</h3>
                <p className="mt-3 leading-7 text-text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <a
            href={buildRegisterUrl('ia-footer')}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            {PLAN_CTA}
          </a>
          <Link
            href="/planos"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main hover:bg-surface"
          >
            Ver planos
          </Link>
        </div>
      </section>
    </main>
  );
}

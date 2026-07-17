import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from '@/lib/seo';
import { loadPlans, formatBRL, getLowestPlanPrice, TRIAL_LABEL, TRIAL_DAYS, PLAN_CTA } from '@/lib/plans';
import { buildRegisterUrl } from '@/lib/site';

// Revalida a cada 60s: mudanças de preço/recursos feitas no admin refletem no
// site sem precisar de novo deploy. A página continua sendo servida estaticamente.
export const revalidate = 60;

export const metadata = buildMetadata({
  title: 'Planos e preços da Trila',
  description:
    'Planos da Trila a partir de R$ 49,90/mês. Comece com 14 dias grátis, sem cartão de crédito, e organize agenda, financeiro e operação do seu negócio de beleza.',
  path: '/planos',
});

const faqs = [
  {
    question: 'Preciso de cartão de crédito para testar?',
    answer:
      'Não. O teste de 14 dias é totalmente gratuito e não exige cartão. Você só escolhe a forma de pagamento se decidir continuar ao final do período.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer:
      'Sim. A assinatura é mensal e sem fidelidade — você pode cancelar a qualquer momento direto no sistema.',
  },
  {
    question: 'A Trila atende negócios pequenos e grandes?',
    answer:
      'Sim. O plano Starter atende operações enxutas com até 2 profissionais, e o Pro acompanha casas em crescimento com até 8 profissionais, clientes ilimitados e recursos de IA.',
  },
];

export default async function PlansPage() {
  const plans = await loadPlans();
  const lowest = getLowestPlanPrice(plans);

  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <JsonLd data={buildFaqJsonLd(faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Planos', path: '/planos' },
        ])}
      />

      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-2 text-sm font-semibold text-primary">
          Planos e preços
        </span>
        <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl">
          Preço simples, sem surpresa. A partir de {formatBRL(lowest)}/mês.
        </h1>
        <p className="mt-6 text-lg leading-8 text-text-muted">
          {TRIAL_DAYS} dias grátis em qualquer plano, sem cartão de crédito. Assinatura
          mensal, sem fidelidade — cancele quando quiser.
        </p>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex flex-col rounded-[24px] border bg-white p-8 shadow-[var(--shadow-card)] ${
              plan.highlighted ? 'border-primary ring-1 ring-primary/30' : 'border-black/6'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 right-6 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                {plan.badge}
              </span>
            )}
            <h2 className="text-2xl text-text-main">{plan.name}</h2>
            {plan.tagline && (
              <p className="mt-2 min-h-12 leading-6 text-text-muted">{plan.tagline}</p>
            )}

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-text-main">{plan.priceLabel}</span>
              <span className="text-text-muted">/mês</span>
            </div>

            <a
              href={buildRegisterUrl('planos')}
              className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-xl px-6 py-3 font-semibold transition-colors ${
                plan.highlighted
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'border border-black/10 bg-white text-text-main hover:bg-surface'
              }`}
            >
              {PLAN_CTA}
            </a>
            <p className="mt-2 text-center text-xs text-text-muted">{TRIAL_LABEL}</p>

            <ul className="mt-8 grid gap-3 text-sm leading-6 text-text-main">
              {plan.features.map((feat) => (
                <li key={feat} className="flex gap-2">
                  <span aria-hidden className="mt-0.5 text-primary">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-[28px] border border-black/6 bg-surface p-8">
        <h2>Perguntas frequentes</h2>
        <div className="mt-8 grid gap-5">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-black/6 bg-white p-5">
              <h3>{faq.question}</h3>
              <p className="mt-3 leading-7 text-text-muted">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <a
          href={buildRegisterUrl('planos-footer')}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
        >
          {PLAN_CTA}
        </a>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3 font-semibold text-text-main hover:bg-surface"
        >
          Voltar para a home
        </Link>
      </div>
    </main>
  );
}

import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from '@/lib/seo';
import { APP_URL } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Planos e posicionamento da Trila',
  description:
    'Entenda como a Trila se encaixa em operações de beleza e estética com diferentes níveis de complexidade.',
  path: '/planos',
});

const pillars = [
  {
    title: 'Operação enxuta',
    audience: 'Para negócios que querem sair do WhatsApp mais planilha.',
    body: 'Centralização de agenda, clientes e rotina principal sem empilhar ferramenta desconexa.',
  },
  {
    title: 'Equipe em crescimento',
    audience: 'Para casas com mais profissionais e necessidade de coordenação.',
    body: 'Mais previsibilidade para recepção, comissões, produtividade e fechamento.',
  },
  {
    title: 'Operação multi-serviço',
    audience: 'Para clínicas, centros e operações mais exigentes.',
    body: 'Visão consolidada de fluxo, recorrência, financeiro e atendimento.',
  },
];

const faqs = [
  {
    question: 'A Trila publica tabela de preço nesta etapa?',
    answer:
      'Não. Nesta fase a página organiza posicionamento e aderência de uso; detalhamento comercial pode acontecer no fluxo de contato ou demonstração.',
  },
  {
    question: 'A Trila atende negócios pequenos e grandes?',
    answer:
      'Sim. A proposta é servir desde operações enxutas até estruturas com vários profissionais e mais de uma frente de serviço.',
  },
  {
    question: 'A contratação depende de implantação complexa?',
    answer:
      'A implantação pode ser guiada conforme o tamanho da operação, mas a mensagem central é reduzir atrito operacional rapidamente.',
  },
];

export default function PlansPage() {
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
          Planos e enquadramento comercial
        </span>
        <h1 className="mt-6 text-balance text-4xl text-text-main sm:text-5xl">
          A Trila se adapta ao tamanho da operação, não ao contrário.
        </h1>
        <p className="mt-6 text-lg leading-8 text-text-muted">
          Esta página organiza a leitura comercial do produto por maturidade operacional.
          O objetivo aqui é deixar claro para que tipo de negócio a Trila faz sentido.
        </p>
      </div>

      <section className="mt-12 grid gap-6 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[24px] border border-black/6 bg-white p-6 shadow-[var(--shadow-card)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {pillar.audience}
            </p>
            <h2 className="mt-4 text-2xl">{pillar.title}</h2>
            <p className="mt-4 leading-7 text-text-muted">{pillar.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 rounded-[28px] border border-black/6 bg-surface p-8">
        <h2>Perguntas frequentes sobre contratação</h2>
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
          href={APP_URL}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
        >
          Acessar o sistema
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

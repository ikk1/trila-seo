export interface VerticalContent {
  slug: string;
  cnaes: string[];
  singular: string;
  pluralEstablishments: string;
  pluralProfessionals: string;
  headline: string;
  description: string;
  hero: string;
  painPoints: string[];
  features: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export const VERTICALS: VerticalContent[] = [
  {
    slug: 'salao-de-beleza',
    cnaes: ['9602501'],
    singular: 'salão de beleza',
    pluralEstablishments: 'salões de beleza',
    pluralProfessionals: 'profissionais de beleza',
    headline: 'Sistema para salão de beleza com agenda, financeiro e CRM no mesmo fluxo',
    description:
      'A Trila organiza agenda, confirmações, repasses e recorrência operacional para salões que querem crescer sem virar reféns de planilhas.',
    hero:
      'Para salões com operação cheia, múltiplos profissionais e necessidade de controle fino da agenda e do caixa.',
    painPoints: [
      'Agenda quebrada entre recepção, telefone e caderno.',
      'Comissões fechadas no improviso no fim do mês.',
      'Falta de visão sobre retorno, no-show e ocupação por profissional.',
    ],
    features: [
      'Agenda com confirmação e lembrete automáticos.',
      'Caixa, comissões e fechamento diário no mesmo painel.',
      'Histórico de clientes, recorrência e campanhas de reativação.',
    ],
    faqs: [
      {
        question: 'A Trila serve para salão com vários profissionais?',
        answer:
          'Sim. A operação foi pensada para equipes com agendas paralelas, repasses e visão por profissional.',
      },
      {
        question: 'Consigo centralizar agenda e atendimento?',
        answer:
          'Sim. A proposta é tirar a operação do improviso e concentrar agenda, cliente e financeiro em um único sistema.',
      },
    ],
  },
  {
    slug: 'barbearia',
    cnaes: ['9602501'],
    singular: 'barbearia',
    pluralEstablishments: 'barbearias',
    pluralProfessionals: 'barbeiros',
    headline: 'Sistema para barbearia com agenda rápida e controle de recorrência',
    description:
      'A Trila ajuda barbearias a reduzir furos na agenda, acelerar o atendimento e manter visão de ticket, recorrência e produtividade.',
    hero:
      'Ideal para barbearias que operam com encaixes, alta frequência de retorno e alta demanda de agendamentos.',
    painPoints: [
      'Clientes pedem encaixe o dia inteiro e a agenda vira um caos.',
      'Retorno recorrente existe, mas ninguém acompanha frequência nem ticket.',
      'Parte do faturamento some porque o fechamento depende de memória.',
    ],
    features: [
      'Agenda enxuta para encaixes, horários e confirmação.',
      'Cadastro simples com histórico de serviços e frequência de retorno.',
      'Relatórios de faturamento e visão por barbeiro.',
    ],
    faqs: [
      {
        question: 'Barbearia pequena também aproveita o sistema?',
        answer:
          'Sim. A Trila serve tanto para operação enxuta quanto para casas com mais profissionais.',
      },
      {
        question: 'Dá para usar o sistema no celular?',
        answer:
          'Sim. O fluxo foi pensado para uso web e rotina operacional no dia a dia.',
      },
    ],
  },
  {
    slug: 'clinica-de-estetica',
    cnaes: ['8690901', '8690999'],
    singular: 'clínica de estética',
    pluralEstablishments: 'clínicas de estética',
    pluralProfessionals: 'esteticistas',
    headline: 'Sistema para clínica de estética com jornada da cliente, agenda e previsibilidade',
    description:
      'A Trila estrutura acompanhamento, recorrência e controle operacional para clínicas que precisam vender continuidade e não apenas horários soltos.',
    hero:
      'Indicada para clínicas com procedimentos recorrentes, pacotes e necessidade de acompanhamento comercial e operacional.',
    painPoints: [
      'Pacotes vendidos sem controle claro de saldo e retorno.',
      'Confirmações manuais consomem a recepção.',
      'A clínica cresce, mas a gestão continua sem previsibilidade.',
    ],
    features: [
      'Agenda com histórico completo de atendimento por cliente.',
      'Controle de recorrência, retornos e comunicação operacional.',
      'Visão financeira para acompanhar crescimento com menos ruído.',
    ],
    faqs: [
      {
        question: 'A Trila ajuda em tratamentos recorrentes?',
        answer:
          'Sim. O sistema favorece acompanhamento, retorno e organização de jornadas contínuas.',
      },
      {
        question: 'Serve para clínica com recepção e vários profissionais?',
        answer:
          'Sim. A estrutura atende operações com mais de um profissional e necessidade de coordenação central.',
      },
    ],
  },
  {
    slug: 'spa',
    cnaes: ['9609299'],
    singular: 'spa',
    pluralEstablishments: 'spas',
    pluralProfessionals: 'terapeutas',
    headline: 'Sistema para spa com agenda premium e operação sem ruído',
    description:
      'A Trila dá estrutura para spas que precisam combinar experiência, previsibilidade e controle de agenda em atendimentos mais longos.',
    hero:
      'Para spas com serviços de maior duração, experiência consultiva e necessidade de coordenação entre agenda e relacionamento.',
    painPoints: [
      'Serviços longos exigem agenda precisa e qualquer erro custa caro.',
      'A comunicação pré-atendimento toma tempo demais da equipe.',
      'Falta clareza sobre demanda, ocupação e retorno por serviço.',
    ],
    features: [
      'Agenda preparada para serviços longos e organização por profissional.',
      'Confirmações automáticas para reduzir falhas operacionais.',
      'Visão de demanda e receita por tipo de atendimento.',
    ],
    faqs: [
      {
        question: 'O sistema funciona para operação de ticket mais alto?',
        answer:
          'Sim. A proposta é manter a experiência fluida sem perder controle operacional.',
      },
      {
        question: 'Ajuda a reduzir falhas em agenda longa?',
        answer:
          'Sim. Centralizar agenda e confirmação reduz ruídos em atendimentos mais sensíveis.',
      },
    ],
  },
  {
    slug: 'manicure',
    cnaes: ['9602502'],
    singular: 'espaço de manicure',
    pluralEstablishments: 'espaços de manicure',
    pluralProfessionals: 'manicures e pedicures',
    headline: 'Sistema para manicure com agenda recorrente e controle simples',
    description:
      'A Trila organiza atendimento recorrente, confirmações e caixa para espaços com giro alto e necessidade de agilidade.',
    hero:
      'Boa escolha para operações com alta recorrência, encaixes frequentes e equipe enxuta.',
    painPoints: [
      'Agenda cheia, mas muito retrabalho para confirmar e reorganizar horários.',
      'Recorrência forte sem acompanhamento estruturado.',
      'Operação depende de mensagens dispersas e conferência manual.',
    ],
    features: [
      'Agenda rápida para recorrência e encaixes.',
      'Histórico simples por cliente para aumentar retorno.',
      'Fluxo operacional mais leve para equipe pequena.',
    ],
    faqs: [
      {
        question: 'O sistema serve para espaço menor?',
        answer:
          'Sim. A Trila funciona bem para negócios enxutos que precisam de organização sem complexidade desnecessária.',
      },
      {
        question: 'Ajuda com clientes recorrentes?',
        answer:
          'Sim. O histórico e a agenda favorecem retorno e acompanhamento da frequência.',
      },
    ],
  },
  {
    slug: 'nail-designer',
    cnaes: ['9602502'],
    singular: 'nail studio',
    pluralEstablishments: 'nail studios',
    pluralProfessionals: 'nail designers',
    headline: 'Sistema para nail studio com agenda organizada e atendimento consistente',
    description:
      'A Trila apoia nail studios que precisam dar previsibilidade ao dia, manter padrão de atendimento e organizar a recorrência das clientes.',
    hero:
      'Para operações especializadas em unhas que vivem de recorrência, experiência e organização da agenda.',
    painPoints: [
      'Horários muito disputados e difíceis de remanejar.',
      'No-show prejudica uma operação com agenda apertada.',
      'A equipe perde tempo demais ajustando agenda manualmente.',
    ],
    features: [
      'Agenda organizada para serviços com duração variável.',
      'Confirmação e lembrete para reduzir furos.',
      'Visão de histórico e frequência de retorno das clientes.',
    ],
    faqs: [
      {
        question: 'A Trila é útil para operação especializada em unhas?',
        answer:
          'Sim. O foco está em recorrência, agenda e fluidez operacional, que são pontos centrais desse modelo.',
      },
      {
        question: 'Dá para acompanhar retorno de clientes?',
        answer:
          'Sim. O sistema concentra histórico e ajuda a recuperar previsibilidade de atendimento.',
      },
    ],
  },
  {
    slug: 'centro-de-beleza',
    cnaes: ['9602501'],
    singular: 'centro de beleza',
    pluralEstablishments: 'centros de beleza',
    pluralProfessionals: 'profissionais de beleza',
    headline: 'Sistema para centro de beleza com operação multi-serviço e visão central',
    description:
      'A Trila conecta agenda, recepção e gestão para centros de beleza com várias frentes de serviço e necessidade de coordenação.',
    hero:
      'Feita para operações que combinam diferentes especialidades e precisam de visão central sem perder agilidade.',
    painPoints: [
      'Cada serviço cria um fluxo próprio e a gestão fica fragmentada.',
      'Recepção opera sem visão consolidada do dia.',
      'Falta leitura clara de desempenho por serviço e profissional.',
    ],
    features: [
      'Agenda centralizada para múltiplos serviços e profissionais.',
      'Fluxo operacional unificado para recepção e gestão.',
      'Leitura consolidada de operação, receita e produtividade.',
    ],
    faqs: [
      {
        question: 'Serve para operação com várias especialidades?',
        answer:
          'Sim. O sistema foi desenhado para concentrar a visão operacional mesmo quando o negócio tem múltiplas linhas de atendimento.',
      },
      {
        question: 'A recepção consegue operar melhor com a Trila?',
        answer:
          'Sim. Centralização e menos retrabalho são justamente parte do ganho esperado.',
      },
    ],
  },
  {
    slug: 'esteticista',
    cnaes: ['8690901'],
    singular: 'espaço de estética',
    pluralEstablishments: 'espaços de estética',
    pluralProfessionals: 'esteticistas autônomos',
    headline: 'Sistema para esteticista com mais controle da agenda e da recorrência',
    description:
      'A Trila ajuda profissionais e espaços de estética a manter uma operação organizada, previsível e preparada para crescer.',
    hero:
      'Pensada para quem precisa profissionalizar a rotina sem carregar uma solução pesada demais.',
    painPoints: [
      'Rotina comercial e agenda se misturam o tempo todo.',
      'Acompanhamento de clientes depende de memória ou planilha.',
      'Crescimento trava porque a gestão continua artesanal.',
    ],
    features: [
      'Agenda e histórico centralizados em um único fluxo.',
      'Acompanhamento de retorno e recorrência de clientes.',
      'Base para profissionalizar atendimento e financeiro.',
    ],
    faqs: [
      {
        question: 'A Trila funciona para profissional autônoma?',
        answer:
          'Sim. Ela atende desde operação individual até espaços em crescimento.',
      },
      {
        question: 'Ajuda a sair da planilha?',
        answer:
          'Sim. O objetivo é tirar a operação do improviso e concentrar rotina crítica no sistema.',
      },
    ],
  },
];

export function getVerticalBySlug(slug: string) {
  return VERTICALS.find((vertical) => vertical.slug === slug);
}

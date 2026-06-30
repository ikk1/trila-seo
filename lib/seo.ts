import type { Metadata } from 'next';
import { BRAND_NAME, DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl } from './site';

type MetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: `${title} | ${BRAND_NAME}`,
      description,
      siteName: BRAND_NAME,
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${BRAND_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

// Âncora estável da entidade Organization. O mesmo @id é repetido em toda menção
// à marca (Organization na home, provider do SoftwareApplication, publisher dos
// artigos) para o Google fundir tudo num único nó de entidade no grafo de
// conhecimento — base para um painel de marca e para "travar" o SERP de "Trila".
export const ORGANIZATION_ID = absoluteUrl('/#organization');

// 👉 PARA ATIVAR O sameAs: cole aqui a URL do Google Business Profile (depois de
// verificado) e/ou perfis de redes sociais. Enquanto a lista estiver vazia, o
// schema NÃO emite `sameAs` (fica idêntico ao de hoje). Assim que tiver pelo
// menos uma URL, ela aparece sozinha no JSON-LD da Organization — é o elo que
// liga o site ao perfil e fecha a entidade de marca no Google.
// Ex.: 'https://www.google.com/maps?cid=SEU_CID', 'https://instagram.com/...'.
export const ORGANIZATION_SAME_AS: string[] = [];

export function buildOrganizationJsonLd(sameAs: string[] = ORGANIZATION_SAME_AS) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    description:
      'Software de gestão para salões, barbearias, clínicas de estética e spas.',
    // Só inclui sameAs quando há perfis — evita um array vazio no schema.
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildSoftwareJsonLd(lowestPlanPrice = 49.9) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: BRAND_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    inLanguage: 'pt-BR',
    description:
      'Sistema completo para agenda, financeiro, relacionamento e rotina operacional de negócios de beleza e estética.',
    audience: {
      '@type': 'Audience',
      audienceType:
        'Salões de beleza, barbearias, clínicas de estética, spas e operações de beleza.',
    },
    // Preço real do plano de entrada, lido do banco. aggregateRating é deliberadamente
    // omitido até existirem avaliações reais coletadas — rating fabricado viola
    // as diretrizes de rich results do Google.
    offers: {
      '@type': 'Offer',
      price: lowestPlanPrice.toFixed(2),
      priceCurrency: 'BRL',
      url: absoluteUrl('/planos'),
      availability: 'https://schema.org/InStock',
    },
    // Amarra o software à mesma entidade de marca (mesmo @id da Organization).
    provider: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: BRAND_NAME,
      url: SITE_URL,
    },
  };
}

export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildArticleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  updatedAt: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    mainEntityOfPage: url,
    url,
    inLanguage: 'pt-BR',
    datePublished: input.updatedAt,
    dateModified: input.updatedAt,
    author: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: BRAND_NAME },
    publisher: {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: BRAND_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl(DEFAULT_OG_IMAGE) },
    },
  };
}

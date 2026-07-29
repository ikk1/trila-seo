'use client';

import { useEffect, useState } from 'react';
import { withGclid } from '@/lib/lp';

/**
 * Botão de conversão das landing pages de Ads. Recebe o href já montado no
 * servidor (via buildLpRegisterUrl) e, após o mount, anexa o gclid da query
 * string da própria LP, se presente — ver withGclid em lib/lp.ts.
 */
export function RegisterCta({ href, className = '' }: { href: string; className?: string }) {
  const [finalHref, setFinalHref] = useState(href);

  useEffect(() => {
    setFinalHref(withGclid(href, window.location.search));
  }, [href]);

  return (
    <a
      href={finalHref}
      className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-7 py-3 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      Criar conta grátis
    </a>
  );
}

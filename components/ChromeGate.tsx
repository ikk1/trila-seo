'use client';

import { usePathname } from 'next/navigation';
import { isLpPath } from '@/lib/lp';

/**
 * Esconde o conteúdo (ex.: o footer do site) nas rotas de landing page de Ads,
 * onde queremos foco total no CTA — sem links de fuga. O SiteFooter continua
 * sendo server component: é passado como children e só deixa de ser renderizado.
 */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isLpPath(pathname)) return null;
  return <>{children}</>;
}

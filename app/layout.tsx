import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { BRAND_NAME, DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/site';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ChromeGate } from '@/components/ChromeGate';
import { Analytics } from '@/components/Analytics';
import { ConsentBanner } from '@/components/ConsentBanner';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Trila - Sistema para salão de beleza, barbearia e clínica',
    template: `%s | ${BRAND_NAME}`,
  },
  description:
    'Sistema completo para salão de beleza, barbearia, clínica estética e spa. Agenda online, financeiro e operação no mesmo fluxo.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    url: SITE_URL,
    siteName: BRAND_NAME,
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body>
        <Analytics />
        <SiteHeader />
        {children}
        <ChromeGate>
          <SiteFooter />
          <ConsentBanner />
        </ChromeGate>
      </body>
    </html>
  );
}

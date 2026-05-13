// app/layout.tsx
import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
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

const BASE = 'https://trila.app.br';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Trila — Sistema para Salão de Beleza, Barbearia e Clínica',
    template: '%s | Trila',
  },
  description:
    'Sistema completo para salão de beleza, barbearia, clínica estética e spa. Agenda online 24h, WhatsApp integrado, PIX nativo, comissões automáticas e IA financeira.',
  openGraph: {
    siteName: 'Trila',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: BASE },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

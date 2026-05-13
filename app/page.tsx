// app/page.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Sistema de Gestão para Salões, Barbearias e Clínicas',
  alternates: { canonical: 'https://trila.app.br' },
};

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-primary text-center">
        Trila — gestão para beleza e estética
      </h1>
      <p className="text-text-muted text-center max-w-lg">
        Sistema completo para salão de beleza, barbearia, clínica estética e spa.
        Em breve.
      </p>
      <a
        href="https://app.trila.app.br"
        className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Acessar o sistema →
      </a>
    </main>
  );
}

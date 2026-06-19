import Link from 'next/link';
import { VERTICALS } from '@/lib/verticals';
import { FOOTER_CITIES } from '@/lib/footer-cities';
import { APP_URL } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="bg-text-main">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">

          {/* Segmentos */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
              Segmentos
            </p>
            <ul className="space-y-2">
              {VERTICALS.map((vertical) => (
                <li key={vertical.slug}>
                  <Link
                    href={`/sistema-para-${vertical.slug}`}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {vertical.singular}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cidades */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
              Cidades
            </p>
            <ul className="space-y-2">
              {FOOTER_CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/${city.uf}/${city.slug}`}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {city.city}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/cidades"
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
                >
                  Ver índice completo →
                </Link>
              </li>
            </ul>
          </div>

          {/* Produto */}
          <div>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
              Produto
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/inteligencia-artificial"
                  className="text-sm text-white/65 transition-colors hover:text-white"
                >
                  Inteligência Artificial
                </Link>
              </li>
              <li>
                <Link
                  href="/planos"
                  className="text-sm text-white/65 transition-colors hover:text-white"
                >
                  Planos
                </Link>
              </li>
              <li>
                <Link
                  href="/guias"
                  className="text-sm text-white/65 transition-colors hover:text-white"
                >
                  Guias
                </Link>
              </li>
              <li>
                <a
                  href={APP_URL}
                  className="text-sm text-white/65 transition-colors hover:text-white"
                >
                  Acessar sistema
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-white/8 pt-5">
          <span className="font-display text-[15px] font-extrabold tracking-tight text-white">
            Trila
          </span>
          <span className="text-[11px] text-white/30">
            © 2026 Trila · Sistema de gestão para beleza e estética
          </span>
        </div>
      </div>
    </footer>
  );
}

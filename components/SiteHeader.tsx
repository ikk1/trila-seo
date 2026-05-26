'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VERTICALS } from '@/lib/verticals';
import { APP_URL } from '@/lib/site';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [segmentosOpen, setSegmentosOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Fecha gaveta mobile ao navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Fecha dropdown ao clicar fora + ESC fecha ambos
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSegmentosOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSegmentosOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-black/6 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-base font-extrabold tracking-tight text-text-main"
        >
          Trila
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 md:flex">
          <Link
            href="/planos"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-main"
          >
            Planos
          </Link>
          <Link
            href="/cidades"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text-main"
          >
            Cidades
          </Link>

          {/* Segmentos dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={segmentosOpen}
              onClick={() => setSegmentosOpen((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-main"
            >
              Segmentos
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                aria-hidden="true"
                className={`transition-transform duration-150 ${segmentosOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M1 1l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {segmentosOpen && (
              <div className="absolute left-0 top-[calc(100%+10px)] min-w-[200px] rounded-[14px] border border-black/6 bg-white p-2 shadow-[var(--shadow-card-hover)]">
                <p className="mb-1 px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted/60">
                  Segmentos
                </p>
                {VERTICALS.map((vertical) => (
                  <Link
                    key={vertical.slug}
                    href={`/sistema-para-${vertical.slug}`}
                    onClick={() => setSegmentosOpen(false)}
                    className="block rounded-lg px-2.5 py-2 text-sm text-text-main transition-colors hover:bg-surface"
                  >
                    {vertical.singular}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA */}
        <a
          href={APP_URL}
          className="hidden min-h-9 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark md:inline-flex"
        >
          Acessar sistema →
        </a>

        {/* Mobile hambúrguer */}
        <button
          type="button"
          aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg md:hidden"
        >
          {mobileOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M2 2l14 14M16 2L2 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <>
              <span className="h-0.5 w-[18px] rounded-full bg-text-main" />
              <span className="h-0.5 w-[14px] self-start rounded-full bg-text-main" />
              <span className="h-0.5 w-[18px] rounded-full bg-text-main" />
            </>
          )}
        </button>

      </div>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden transition-all duration-200 md:hidden ${
          mobileOpen ? 'max-h-[600px]' : 'max-h-0'
        }`}
      >
        <nav
          aria-label="Menu mobile"
          className="border-t border-black/6 bg-white px-6 pb-5 pt-2"
        >
          <Link
            href="/planos"
            className="block border-b border-black/6 py-3 text-sm font-medium text-text-main"
          >
            Planos
          </Link>
          <Link
            href="/cidades"
            className="block border-b border-black/6 py-3 text-sm font-medium text-text-main"
          >
            Cidades
          </Link>

          <div className="border-b border-black/6 py-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Segmentos
            </p>
            {VERTICALS.map((vertical) => (
              <Link
                key={vertical.slug}
                href={`/sistema-para-${vertical.slug}`}
                className="block py-1.5 text-sm text-text-muted transition-colors hover:text-text-main"
              >
                {vertical.singular}
              </Link>
            ))}
          </div>

          <div className="pt-4">
            <a
              href={APP_URL}
              className="block rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Acessar sistema →
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

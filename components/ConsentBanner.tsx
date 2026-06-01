// components/ConsentBanner.tsx
'use client';

import { useEffect, useState } from 'react';
import { CONSENT_STORAGE_KEY, updateConsent, type ConsentChoice } from '@/lib/gtag';

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY) as ConsentChoice | null;
    if (saved === 'granted' || saved === 'denied') {
      updateConsent(saved); // reaplica em visitas seguintes
      return;
    }
    setVisible(true);
  }, []);

  function decide(choice: ConsentChoice) {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    updateConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface shadow-card"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-text-muted">
          Usamos cookies para entender o uso do site e melhorar sua experiência.
          Você pode aceitar ou recusar a análise de navegação.
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="rounded-md px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-main"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

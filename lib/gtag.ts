// lib/gtag.ts
// Tipos globais do gtag e helpers de consentimento (Consent Mode v2).
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';
export const CONSENT_STORAGE_KEY = 'trila-consent';

export type ConsentChoice = 'granted' | 'denied';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/** Atualiza o Consent Mode após a escolha do usuário. */
export function updateConsent(choice: ConsentChoice) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('consent', 'update', {
    analytics_storage: choice,
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
  });
}

import { describe, it, expect } from 'vitest';
import { VERTICALS } from '@/lib/verticals';

describe('VERTICALS seoTitle', () => {
  it('todo vertical tem seoTitle não-vazio', () => {
    for (const v of VERTICALS) {
      expect(v.seoTitle, v.slug).toBeTruthy();
    }
  });

  it('seoTitle cabe no SERP (<= 60 chars, evita truncar)', () => {
    for (const v of VERTICALS) {
      expect(v.seoTitle.length, `${v.slug}: "${v.seoTitle}" (${v.seoTitle.length})`).toBeLessThanOrEqual(60);
    }
  });

  it('seoTitle reforça o termo comercial "sistema para"', () => {
    for (const v of VERTICALS) {
      expect(v.seoTitle.toLowerCase(), v.slug).toContain('sistema para');
    }
  });

  it('nenhum seoTitle menciona WhatsApp (feature indisponível por ora)', () => {
    for (const v of VERTICALS) {
      expect(/whats|zap/i.test(v.seoTitle), `${v.slug}: ${v.seoTitle}`).toBe(false);
    }
  });
});

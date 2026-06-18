import { describe, it, expect } from 'vitest';
import { SITE_URL } from '@/lib/site';

describe('infra de teste', () => {
  it('roda e resolve o alias @/*', () => {
    expect(SITE_URL).toBe('https://trila.app.br');
  });
});

import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadPlans } from '../plans';

afterEach(() => vi.unstubAllGlobals());

function mockFetchOnce(payload: unknown, ok = true) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok,
    json: async () => payload,
  }));
}

describe('loadPlans', () => {
  it('mapeia name, price, features e tagline da API pública', async () => {
    mockFetchOnce([
      {
        name: 'Pro',
        price: 99.9,
        features: '["Agendamento online","Insights de IA"]',
        highlighted: true,
        badgeText: 'Mais popular',
        tagline: 'Tagline do banco',
      },
    ]);

    const plans = await loadPlans();

    expect(plans).toHaveLength(1);
    expect(plans[0]).toMatchObject({
      name: 'Pro',
      price: 99.9,
      priceLabel: expect.stringContaining('99,90'),
      tagline: 'Tagline do banco',
      highlighted: true,
      badge: 'Mais popular',
      features: ['Agendamento online', 'Insights de IA'],
    });
  });

  it('usa o mapa TAGLINES quando a API devolve tagline vazia', async () => {
    mockFetchOnce([
      { name: 'Starter', price: 49.9, features: '[]', highlighted: false, badgeText: null, tagline: '' },
    ]);

    const plans = await loadPlans();

    expect(plans[0].tagline).toBe(
      'Para quem está organizando a operação e saindo do caderno + planilha.',
    );
  });

  it('cai para FALLBACK_PLANS quando o fetch falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    const plans = await loadPlans();

    expect(plans.map((p) => p.name)).toEqual(['Starter', 'Pro']);
  });
});

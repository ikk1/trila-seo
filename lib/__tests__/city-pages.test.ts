import { describe, it, expect } from 'vitest';
import { isCuratedCity, CITY_INDEX_POPULATION_THRESHOLD } from '@/lib/city-pages';

function city(over: Partial<any> = {}) {
  return {
    uf: 'sp',
    slug: 'x',
    city: 'X',
    population: 0,
    isCapital: false,
    region: 'Sudeste',
    populationLabel: '',
    marketNote: '',
    source: 'catalog' as const,
    ...over,
  };
}

describe('isCuratedCity', () => {
  it('cura cidade com população >= limiar', () => {
    expect(isCuratedCity(city({ population: CITY_INDEX_POPULATION_THRESHOLD }))).toBe(true);
    expect(isCuratedCity(city({ population: 200_000 }))).toBe(true);
  });

  it('cura capital independente da população', () => {
    expect(isCuratedCity(city({ population: 5_000, isCapital: true }))).toBe(true);
  });

  it('NÃO cura cidade pequena não-capital (vira 404 → fora do índice)', () => {
    expect(isCuratedCity(city({ population: 5_000, isCapital: false }))).toBe(false);
    expect(isCuratedCity(city({ population: CITY_INDEX_POPULATION_THRESHOLD - 1 }))).toBe(false);
  });
});

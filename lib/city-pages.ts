import { BRAND_NAME } from './site';
import { loadCity } from './locations';
import type { ResolvedCityEntry } from './locations';
import { getVerticalBySlug, type VerticalContent } from './verticals';

export function buildCityPageTitle(cityLabel: string) {
  return `${BRAND_NAME} em ${cityLabel}`;
}

export function buildCityPageDescription(cityLabel: string, marketNote: string) {
  return `Veja como a ${BRAND_NAME} se posiciona em ${cityLabel}. ${marketNote}`;
}

export function buildCityVerticalTitle(cityLabel: string, vertical: VerticalContent) {
  return `Sistema para ${vertical.singular} em ${cityLabel}`;
}

export function buildCityVerticalDescription(cityLabel: string, vertical: VerticalContent) {
  return `Página programática da ${BRAND_NAME} para ${vertical.singular} em ${cityLabel}, com foco em agenda, operação e previsibilidade.`;
}

export async function resolveCityVertical(uf: string, citySlug: string, verticalSlug: string) {
  const city = await loadCity(uf, citySlug);
  const vertical = getVerticalBySlug(verticalSlug);

  if (!city || !vertical) {
    return null;
  }

  return { city, vertical };
}

/** Limiar de população para indexar a página cidade×vertical sem dados diferenciados. */
export const CITY_INDEX_POPULATION_THRESHOLD = 100_000;

/**
 * Cidade "curada": a única que tem direito a páginas servidas (hub e cidade×vertical).
 * Critério por porte — capital OU população >= limiar — exatamente o mesmo filtro do
 * sitemap (loadSitemapCities). Cidade fora disso retorna 404 nas rotas, em vez de
 * servir 200+noindex, para o Google esvaziar a fila "Discovered - currently not indexed"
 * (long tail programático que trava a indexação de um domínio novo). Fonte única: o
 * sitemap, o índice /cidades e as rotas dinâmicas devem todos consultar esta função.
 */
export function isCuratedCity(city: ResolvedCityEntry): boolean {
  return city.isCapital || city.population >= CITY_INDEX_POPULATION_THRESHOLD;
}

/** Limiar de estabelecimentos ativos para indexar a página cidade×vertical via dados de mercado. */
export const CITY_MARKET_INDEX_THRESHOLD = 5;

/**
 * Decide se uma página cidade×vertical deve ser indexável.
 * Indexa quando há dados diferenciados (insights) OU a cidade é prioritária
 * (capital ou população >= limiar) OU há mercado local real (>= limiar de estabelecimentos).
 * Caso contrário, noindex até ganhar conteúdo.
 */
export function shouldIndexCityVertical(
  city: ResolvedCityEntry,
  hasInsights: boolean,
  marketCount: number,
): boolean {
  if (hasInsights) return true;
  if (city.isCapital) return true;
  if (city.population >= CITY_INDEX_POPULATION_THRESHOLD) return true;
  return marketCount >= CITY_MARKET_INDEX_THRESHOLD;
}

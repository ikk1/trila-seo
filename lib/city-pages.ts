import { BRAND_NAME } from './site';
import { loadCity } from './locations';
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

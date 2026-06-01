// lib/sitemap.ts
// Fonte única da regra de particionamento do sitemap.
// Usado por app/sitemap.ts (geração dos chunks) e
// app/sitemap-index.xml/route.ts (índice). NÃO duplicar a regra.
import { loadAllCities } from './locations';
import { VERTICALS } from './verticals';

export const CHUNK_SIZE = 5_000;

/**
 * Lista de ids de sitemap a gerar:
 *  - 0: páginas estáticas + verticais
 *  - 1: páginas de cidade
 *  - 2..N: pares cidade×vertical em chunks de CHUNK_SIZE
 */
export async function getSitemapIds(): Promise<number[]> {
  const cities = await loadAllCities();
  const chunks = Math.ceil((cities.length * VERTICALS.length) / CHUNK_SIZE);
  return [0, 1, ...Array.from({ length: chunks }, (_, i) => i + 2)];
}

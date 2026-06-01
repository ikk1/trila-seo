import type { MetadataRoute } from 'next';
import { loadAllCities } from '@/lib/locations';
import { VERTICALS } from '@/lib/verticals';
import { DEFAULT_LAST_MODIFIED, SITE_URL } from '@/lib/site';
import { CHUNK_SIZE, getSitemapIds } from '@/lib/sitemap';

function cityPriorities(population: number): { hub: number; vertical: number } {
  if (population >= 500_000) return { hub: 0.8, vertical: 0.75 };
  if (population >= 100_000) return { hub: 0.75, vertical: 0.7 };
  return { hub: 0.65, vertical: 0.6 };
}

export async function generateSitemaps() {
  const ids = await getSitemapIds();
  return ids.map((id) => ({ id }));
}

export default async function sitemap(props: { id: Promise<number> }): Promise<MetadataRoute.Sitemap> {
  const numId = Number(await props.id);
  if (numId === 0) {
    return [
      { url: SITE_URL, lastModified: DEFAULT_LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
      { url: `${SITE_URL}/planos`, lastModified: DEFAULT_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${SITE_URL}/cidades`, lastModified: DEFAULT_LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.85 },
      ...VERTICALS.map((v) => ({
        url: `${SITE_URL}/sistema-para-${v.slug}`,
        lastModified: DEFAULT_LAST_MODIFIED,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ];
  }

  const cities = await loadAllCities();

  if (numId === 1) {
    return cities.map((city) => ({
      url: `${SITE_URL}/${city.uf}/${city.slug}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: cityPriorities(city.population).hub,
    }));
  }

  const chunkIndex = numId - 2;
  const allPairs = cities.flatMap((city) =>
    VERTICALS.map((vertical) => ({ city, vertical }))
  );
  const start = chunkIndex * CHUNK_SIZE;
  const chunk = allPairs.slice(start, start + CHUNK_SIZE);

  return chunk.map(({ city, vertical }) => ({
    url: `${SITE_URL}/${city.uf}/${city.slug}/${vertical.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: 'monthly' as const,
    priority: cityPriorities(city.population).vertical,
  }));
}

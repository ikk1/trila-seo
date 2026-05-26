import type { MetadataRoute } from 'next';
import { loadAllCities } from '@/lib/locations';
import { VERTICALS } from '@/lib/verticals';
import { DEFAULT_LAST_MODIFIED, SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cities = await loadAllCities();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/planos`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/cidades`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${SITE_URL}/${city.uf}/${city.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const cityVerticalPages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    VERTICALS.map((vertical) => ({
      url: `${SITE_URL}/${city.uf}/${city.slug}/${vertical.slug}`,
      lastModified: DEFAULT_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))
  );

  const verticalPages: MetadataRoute.Sitemap = VERTICALS.map((vertical) => ({
    url: `${SITE_URL}/sistema-para-${vertical.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...cityPages, ...cityVerticalPages, ...verticalPages];
}

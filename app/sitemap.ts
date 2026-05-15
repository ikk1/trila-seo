import type { MetadataRoute } from 'next';
import { DEFAULT_LAST_MODIFIED, SITE_URL } from '@/lib/site';
import { VERTICALS } from '@/lib/verticals';

export default function sitemap(): MetadataRoute.Sitemap {
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
  ];

  const verticalPages: MetadataRoute.Sitemap = VERTICALS.map((vertical) => ({
    url: `${SITE_URL}/sistema-para-${vertical.slug}`,
    lastModified: DEFAULT_LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...verticalPages];
}

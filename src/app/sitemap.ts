import { MetadataRoute } from 'next';
import { getProjectsData } from '@/lib/cms';

const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Public static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/experience`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ];

  try {
    const projects = await getProjectsData();
    const projectRoutes: MetadataRoute.Sitemap = (projects || [])
      .filter((p) => p.isPublished !== false)
      .map((p) => ({
        url: `${baseUrl}/projects/${p.id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      }));

    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}

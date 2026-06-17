import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://mohammedkhizershaikh.netlify.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/monitoring/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

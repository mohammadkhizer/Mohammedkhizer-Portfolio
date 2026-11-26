import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mohammedkhizershaikh.netlify.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow all admin and api routes
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

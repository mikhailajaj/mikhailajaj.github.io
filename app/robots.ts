/**
 * Robots.txt Generation
 * 
 * Generates robots.txt for search engine crawling guidelines
 */

import { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mikhailajaj.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '*.json',
        '/data/reviews/pending/',
        '/data/reviews/verified/',
        '/data/reviews/rejected/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
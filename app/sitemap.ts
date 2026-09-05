import type { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog'
import { allProjects } from '@/data/projects'
import { hasPostBody } from '@/lib/posts'
import { siteUrl } from '@/lib/site'

// Required by output: 'export' — emits a static file instead of a route handler.
export const dynamic = 'force-static'

/** Static export writes this to /sitemap.xml at build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/projects', '/expertise', '/resume', '/education', '/blog']

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route}/`,
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    })),
    ...allProjects.map((p) => ({
      url: `${siteUrl}/projects/${p.id}/`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    ...blogPosts
      .filter((p) => hasPostBody(p.slug))
      .map((p) => ({
        url: `${siteUrl}/blog/${p.slug}/`,
        lastModified: p.date,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      })),
  ]
}

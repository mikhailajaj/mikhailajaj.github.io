import fs from 'node:fs'
import path from 'node:path'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * Reads an article body from content/blog/<slug>.md.
 *
 * Post *metadata* lives in data/blog.ts — these files hold only the prose, so
 * there is exactly one place to edit a title or tag. Runs at build time only:
 * `output: 'export'` prerenders every post, so no filesystem access happens at
 * request time.
 */
export function getPostBody(slug: string): string | null {
  // Defend against a slug escaping the content directory.
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const file = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(file)) return null

  const raw = fs.readFileSync(file, 'utf8')

  // Each article opens with its own `# Title`, but the page header already
  // renders the title from data/blog.ts — keeping both prints it twice and
  // gives the page two <h1>s, which is invalid.
  return raw.replace(/^\s*#\s+.+?\n+/, '')
}

export function hasPostBody(slug: string): boolean {
  return getPostBody(slug) !== null
}

/**
 * Intrinsic size of an SVG in /public, read from its width/height attributes
 * and falling back to the viewBox.
 *
 * Images need width and height to reserve layout space before they load;
 * reading them from the file keeps the numbers correct automatically instead
 * of hardcoding a pair that silently rots when the asset is redrawn.
 */
export function getSvgSize(
  src: string,
): { width: number; height: number } | null {
  const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''))
  if (!file.endsWith('.svg') || !fs.existsSync(file)) return null

  const head = fs.readFileSync(file, 'utf8').slice(0, 2000)

  const w = head.match(/\bwidth="([\d.]+)"/)
  const h = head.match(/\bheight="([\d.]+)"/)
  if (w && h) return { width: Math.round(+w[1]), height: Math.round(+h[1]) }

  const vb = head.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/)
  if (vb) return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) }

  return null
}

/**
 * Rough reading time, used when a post has no explicit `readTime`.
 * 200 wpm is the usual prose estimate; code blocks skew slower but this is
 * only ever a hint.
 */
export function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

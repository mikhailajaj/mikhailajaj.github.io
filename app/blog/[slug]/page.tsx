import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import Article from '@/components/blog/Article'
import { blogPosts } from '@/data/blog'
import { getPostBody, getSvgSize, hasPostBody, readingTime } from '@/lib/posts'

/** Only posts whose body was ported get a page. */
export function generateStaticParams() {
  return blogPosts.filter((p) => hasPostBody(p.slug)).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: `${post.title} · Mikhail Ajaj`,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  const body = getPostBody(slug)
  if (!post || !body) notFound()

  const date = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <PageShell eyebrow="Article" backHref="/blog/" backLabel="All Articles">
      <article>
        <header className="mb-10 pb-8 border-b border-[rgb(var(--text-muted-rgb)/0.14)]">
          <p className="section-label">{post.category}</p>
          <h1 className="section-heading mb-4">{post.title}</h1>
          <p className="text-[rgb(var(--text-muted-rgb))] leading-relaxed max-w-3xl mb-5">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.7rem] font-mono
                          text-[rgb(var(--text-muted-rgb)/0.75)]">
            <time dateTime={post.date}>{date}</time>
            <span>·</span>
            <span>{post.readTime ?? readingTime(body)}</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[0.7rem] rounded-md font-medium tracking-wide
                             bg-[rgb(var(--bg-elevated-rgb)/0.42)]
                             border border-[rgb(var(--text-muted-rgb)/0.12)]
                             text-[rgb(var(--text-muted-rgb))]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.image && <Cover src={post.image} title={post.title} />}

        <Article body={body} />
      </article>

      <div className="mt-12 pt-6 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
        <Link
          href="/blog/"
          className="text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
        >
          ← Back to all articles
        </Link>
      </div>
    </PageShell>
  )
}

/**
 * The card cover art, reused as the article's lead image. Decorative — the
 * headline above already carries the meaning — so it is hidden from screen
 * readers rather than given a redundant alt text.
 */
function Cover({ src, title }: { src: string; title: string }) {
  const size = getSvgSize(src)

  return (
    <div
      className="mb-10 rounded-2xl overflow-hidden border border-[rgb(var(--text-muted-rgb)/0.14)]
                 bg-gradient-to-br from-[rgb(var(--accent-cool-rgb)/0.1)] via-transparent
                 to-[rgb(var(--accent-warm-rgb)/0.07)] p-4"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={size?.width}
        height={size?.height}
        className="w-full h-auto rounded-lg"
        // Above the fold on the article page, so it should not be lazy.
        decoding="async"
        title={title}
      />
    </div>
  )
}

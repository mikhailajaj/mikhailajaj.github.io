import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { blogPosts, type BlogPost } from '@/data/blog'
import { hasPostBody } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog · Mikhail Ajaj',
  description:
    'Articles on full-stack development, cloud architecture, algorithms, and software engineering.',
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.date.localeCompare(a.date)
  })

  return (
    <PageShell eyebrow="Writing">

        <div className="mb-10">
          <p className="section-label">Blog</p>
          <h1 className="section-heading mb-3">Notes &amp; articles</h1>
          <p className="text-[rgb(var(--text-muted-rgb))] max-w-2xl">
            Writing on full-stack development, cloud architecture, algorithms,
            and the craft of software engineering.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

    </PageShell>
  )
}

function PostCard({ post }: { post: BlogPost }) {
  const date = new Date(`${post.date}T00:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  /* A card only advertises itself as clickable when the article body exists —
     otherwise the hover states promise a page that isn't there. */
  const readable = hasPostBody(post.slug)

  const className = [
    'group flex flex-col rounded-2xl overflow-hidden',
    'bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]',
    'transition-all duration-300',
    readable
      ? 'hover:border-[rgb(var(--accent-cool-rgb)/0.3)] hover:bg-[rgb(var(--surface-rgb)/0.48)]'
      : '',
  ].join(' ')

  const inner = (
    <>
      {/* Cover — SVG illustration or gradient fallback */}
      <div className="relative h-36 border-b border-[rgb(var(--text-muted-rgb)/0.12)] bg-gradient-to-br from-[rgb(var(--accent-cool-rgb)/0.12)] via-transparent to-[rgb(var(--accent-warm-rgb)/0.08)] overflow-hidden">
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-[rgb(var(--text-muted-rgb)/0.16)] tracking-tight select-none">
              {post.category}
            </span>
          </div>
        )}
        {post.featured && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider
                           rounded-full bg-[rgb(var(--accent-warm-rgb)/0.15)] border border-[rgb(var(--accent-warm-rgb)/0.3)] text-[rgb(var(--accent-warm-rgb))] backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2 text-[0.65rem] font-mono uppercase tracking-widest">
          <span className="text-[rgb(var(--accent-warm-rgb)/0.8)]">{post.category}</span>
          <span className="text-[rgb(var(--text-muted-rgb)/0.5)]">·</span>
          <span className="text-[rgb(var(--text-muted-rgb)/0.75)]">{date}</span>
          {post.readTime && (
            <>
              <span className="text-[rgb(var(--text-muted-rgb)/0.5)]">·</span>
              <span className="text-[rgb(var(--text-muted-rgb)/0.75)]">{post.readTime}</span>
            </>
          )}
        </div>

        <h2 className="text-[0.95rem] font-semibold text-[rgb(var(--text-rgb))] leading-snug mb-2
                       group-hover:text-[rgb(var(--accent-warm-rgb))] transition-colors">
          {post.title}
        </h2>

        <p className="text-[0.8rem] text-[rgb(var(--text-muted-rgb))] leading-relaxed mb-4 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[0.65rem] rounded-md bg-[rgb(var(--bg-elevated-rgb)/0.42)]
                         border border-[rgb(var(--text-muted-rgb)/0.16)] text-[rgb(var(--text-muted-rgb))] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )

  return readable ? (
    <Link href={`/blog/${post.slug}/`} className={className}>
      {inner}
    </Link>
  ) : (
    <article className={className}>{inner}</article>
  )
}

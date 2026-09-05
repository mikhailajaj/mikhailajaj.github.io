import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found · Mikhail Ajaj',
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="section-label">404</p>
      <h1 className="section-heading">This page doesn&apos;t exist</h1>
      <p className="text-[rgb(var(--text-muted-rgb))] max-w-md">
        The link may be out of date, or the page may have moved. Everything else
        is still where you left it.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                     bg-[rgb(var(--accent-rgb)/0.12)] border border-[rgb(var(--accent-rgb)/0.24)]
                     text-[rgb(var(--accent-rgb))] hover:bg-[rgb(var(--accent-rgb)/0.2)]"
        >
          Back to portfolio
        </Link>
        <Link
          href="/projects/"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                     bg-[rgb(var(--surface-rgb)/0.42)] border border-[rgb(var(--text-muted-rgb)/0.16)]
                     text-[rgb(var(--text-soft-rgb))] hover:text-[rgb(var(--text-rgb))]"
        >
          View case studies
        </Link>
      </div>
    </main>
  )
}

import Link from 'next/link'
import type { ReactNode } from 'react'

interface PageShellProps {
  /** Small uppercase label on the right of the bar, e.g. "Case Study". */
  eyebrow: string
  /** Where the back link goes. Defaults to the home page. */
  backHref?: string
  backLabel?: string
  /** Optional control rendered next to the eyebrow (e.g. a download button). */
  action?: ReactNode
  children: ReactNode
}

/**
 * Chrome shared by every sub-page: the sticky back bar and the centred
 * content column. The home page uses <Navigation /> instead.
 */
export default function PageShell({
  eyebrow,
  backHref = '/',
  backLabel = 'Back to Portfolio',
  action,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg-rgb))]">
      <div className="sticky top-0 z-40 bg-[rgb(var(--bg-rgb)/0.9)] backdrop-blur-xl
                      border-b border-[rgb(var(--text-muted-rgb)/0.12)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-sm text-[rgb(var(--text-muted-rgb))]
                       hover:text-[rgb(var(--text-rgb))] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)]
                             tracking-wider uppercase">
              {eyebrow}
            </span>
            {action}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 pb-20">{children}</main>
    </div>
  )
}

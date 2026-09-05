const social = [
  { label: 'GitHub',   href: 'https://github.com/mikhailajaj',                         external: true  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mikhail-ajaj/',    external: true  },
  { label: 'Email',    href: 'mailto:mikhailajaj@gmail.com',                            external: false },
]

const siteLinks = [
  { label: 'Projects',   href: '/projects/'  },
  { label: 'Expertise',  href: '/expertise/' },
  { label: 'Blog',       href: '/blog/'      },
  { label: 'Transcript', href: '/education/' },
]

export default function Footer() {
  return (
    <footer className="section-alt border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          <div>
            <p className="text-sm font-bold tracking-[0.12em] uppercase
                           bg-gradient-to-r from-[rgb(var(--accent-rgb))] to-[rgb(var(--accent-cool-rgb))]
                           bg-clip-text text-transparent mb-1">
              Mikhail Ajaj
            </p>
            <p className="text-xs text-[rgb(var(--text-muted-rgb))]">
              Full-Stack Developer · Toronto, Canada
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {siteLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--accent-cool-rgb))] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
            <span className="hidden md:block w-px h-4 bg-[rgb(var(--text-muted-rgb)/0.25)]" />
            {social.map(({ label, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))] transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3
                        pt-6 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
          <p className="text-xs text-[rgb(var(--text-muted-rgb))]">
            © {new Date().getFullYear()} Mikhail Ajaj. All rights reserved.
          </p>
          <p className="text-xs text-[rgb(var(--text-muted-rgb))]">
            Built with Next.js · Tailwind CSS · Deployed on GitHub Pages
          </p>
        </div>

      </div>
    </footer>
  )
}

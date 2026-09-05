'use client'

import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'About',     href: '#about'      },
  { label: 'Projects',  href: '#projects'   },
  { label: 'Skills',    href: '#skills'     },
  { label: 'Education', href: '#education'  },
  { label: 'Expertise', href: '/expertise/' },
  { label: 'Resume',    href: '/resume/'    },
  { label: 'Blog',      href: '/blog/'      },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[rgb(var(--bg-rgb)/0.9)] backdrop-blur-2xl border-b border-[rgb(var(--text-muted-rgb)/0.12)] shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mikhail Ajaj">
            <rect width="64" height="64" rx="14" fill="#0f172a" />
            <g fill="#f97316" transform="translate(3.132 3.019) scale(0.11321)">
              <rect x="270" y="284" width="80" height="24" />
              <path d="M162 122h27l1 66-50 202H96z" />
              <path d="M188 122h25l35 185-1 83H228l-38-202z" />
              <path d="M293 122h23l-4 68-48 200h-18l2-83z" />
              <path d="M315 122h22l77 268h-44l-58-200z" />
            </g>
          </svg>
          <span
            className="text-sm font-bold tracking-[0.12em] uppercase
                       bg-gradient-to-r from-[rgb(var(--text-rgb))] to-[rgb(var(--accent-cool-rgb))]
                       bg-clip-text text-transparent"
          >
            Mikhail Ajaj
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))]
                         transition-colors duration-200 tracking-wide"
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          href="mailto:mikhailajaj@gmail.com"
          className="hidden md:inline-flex items-center text-sm font-medium
                     px-4 py-2 rounded-lg
                     border border-[rgb(var(--accent-rgb)/0.24)] bg-[rgb(var(--accent-rgb)/0.08)]
                     text-[rgb(var(--accent-rgb))] hover:text-[rgb(var(--accent-warm-rgb))]
                     hover:bg-[rgb(var(--accent-rgb)/0.13)] hover:border-[rgb(var(--accent-warm-rgb)/0.34)]
                     transition-all duration-200"
        >
          Contact
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))] transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgb(var(--bg-rgb)/0.95)] backdrop-blur-2xl
                        border-b border-[rgb(var(--text-muted-rgb)/0.14)] px-6 py-5 flex flex-col gap-4">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))] transition-colors py-0.5"
            >
              {label}
            </a>
          ))}
          <a
            href="mailto:mikhailajaj@gmail.com"
            className="text-sm text-[rgb(var(--accent-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors py-0.5 mt-1
                       border-t border-[rgb(var(--text-muted-rgb)/0.14)] pt-4"
          >
            Contact →
          </a>
        </div>
      )}
    </header>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { siteDescription, siteName, siteUrl } from '@/lib/site'
// Syntax-highlighting theme for code blocks in ported articles.
import 'highlight.js/styles/github-dark.css'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const title = 'Mikhail Ajaj | Full-Stack Developer'
const tagline = 'Building scalable, user-centric solutions that drive real business impact.'

export const metadata: Metadata = {
  // Lets every relative URL below (and in child pages) resolve to an absolute one.
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: '%s',
  },
  description: siteDescription,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title,
    description: tagline,
    url: siteUrl,
    siteName,
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: tagline,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}

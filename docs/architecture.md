# Portfolio v2 — Architecture & Technical Documentation

## Overview

A dark-themed personal portfolio built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS**. It is a multi-route site exported to fully static HTML and deployed to GitHub Pages.

---

## Tech Stack

| Layer       | Technology                      | Version |
|-------------|---------------------------------|---------|
| Framework   | Next.js (App Router, Turbopack) | 16.2.2  |
| Language    | TypeScript                      | 5.9.x   |
| Styling     | Tailwind CSS                    | 3.4.x   |
| Charts      | Recharts (lazy, one page only)  | 3.8.x   |
| Font        | Inter (via `next/font/google`)  | —       |
| Runtime     | React                           | 19.2.x  |
| Lint        | ESLint + `eslint-config-next`   | 9.x     |
| Package Mgr | pnpm                            | 10.x    |

No UI component library and no animation library — all visuals are CSS + Tailwind.

---

## Project Structure

```
portfolio-v2/
├── app/
│   ├── globals.css            # Design tokens, base styles, utility classes
│   ├── layout.tsx             # Root layout — metadata, font, html/body
│   ├── icon.svg               # Favicon (Next file convention)
│   ├── not-found.tsx          # 404 page
│   ├── robots.ts              # → /robots.txt at build time
│   ├── sitemap.ts             # → /sitemap.xml at build time
│   ├── page.tsx               # Home — assembles the section components
│   ├── blog/page.tsx          # Article index
│   ├── education/page.tsx     # Transcript, stats and charts
│   ├── expertise/page.tsx     # Five domains, each linked to case studies
│   └── projects/
│       ├── page.tsx           # Case-study index
│       └── [slug]/page.tsx    # Case-study detail (generateStaticParams)
│
├── components/
│   ├── Navigation.tsx         # Fixed home-page navbar (client)
│   ├── PageShell.tsx          # Sticky back bar + content column for sub-pages
│   ├── Hero.tsx  About.tsx  Projects.tsx  Skills.tsx
│   ├── Experience.tsx  Education.tsx  Footer.tsx
│   ├── TranscriptRecord.tsx   # Course table (client — expand/collapse)
│   └── charts/
│       ├── ChartsWrapper.tsx  # Client boundary for the lazy import
│       └── TranscriptCharts.tsx
│
├── data/
│   ├── schemas/project.ts     # Project + Technology types
│   ├── projects/              # One file per project + index with helpers
│   ├── blog.ts  timeline.ts  certifications.ts  transcript.ts
│
├── lib/site.ts                # siteUrl / siteName / siteDescription
├── assets-src/                # Full-resolution image originals (NOT deployed)
├── public/                    # Deployed assets, incl. .nojekyll
└── docs/
```

`assets-src/` holds the original PNGs. Only the optimised WebP derivatives live
in `public/`, so the originals stay available without shipping to visitors.

---

## Rendering Model

Everything is prerendered at build time (`output: 'export'`). Only four
components ship client JavaScript:

| Component            | Why it's a client component            |
|----------------------|----------------------------------------|
| `Navigation`         | Scroll listener + mobile menu state    |
| `TranscriptRecord`   | Expand/collapse term state             |
| `ChartsWrapper`      | Hosts `dynamic(..., { ssr: false })`   |
| `TranscriptCharts`   | Recharts needs the DOM                 |

Recharts (~450 KB) is lazy-loaded and therefore only downloaded on
`/education`. Keep it that way: import it through `ChartsWrapper`, never
directly from a server component.

---

## Design System

All colour lives in `app/globals.css` as CSS custom properties. Components
reference them through Tailwind arbitrary values, e.g.
`bg-[rgb(var(--surface-rgb)/0.34)]`. **Do not introduce raw Tailwind palette
classes** (`text-slate-400`, `bg-indigo-500/10`) — they bypass the tokens and
were removed deliberately.

Each colour is declared twice: once as a hex value (for direct `var(--x)` use)
and once as a space-separated RGB triple (so Tailwind can apply an opacity).

| Token           | Value     | Usage                          |
|-----------------|-----------|--------------------------------|
| `--bg`          | `#0f172a` | Page background                |
| `--bg-elevated` | `#162033` | Raised surfaces, footer        |
| `--surface`     | `#1e293b` | Cards                          |
| `--text`        | `#e5e7eb` | Body text                      |
| `--text-soft`   | `#cbd5e1` | Secondary text                 |
| `--text-muted`  | `#94a3b8` | Metadata, labels               |
| `--accent`      | `#f97316` | Orange — primary accent, focus |
| `--accent-warm` | `#facc15` | Yellow — section labels        |
| `--accent-cool` | `#3b82f6` | Blue — links, hover states     |
| `--accent-deep` | `#7f1d1d` | Dark red — background depth    |
| `--accent-ok`   | `#34d399` | Positive metrics, good grades  |
| `--accent-alert`| `#fb7185` | Problem statements, failures   |

### Utility classes

| Class              | Description                                  |
|--------------------|----------------------------------------------|
| `.bg-dots`         | Dot grid used in the Hero background         |
| `.section-divider` | 1px horizontal gradient rule                 |
| `.section-alt`     | Alternating darker section background        |
| `.section-label`   | Monospace uppercase eyebrow with leading rule|
| `.section-heading` | `clamp()`-scaled section h2                  |
| `.hero-name`       | `clamp()`-scaled hero h1                     |

Recharts series colours in `components/charts/TranscriptCharts.tsx` are literal
hex values because SVG attributes can't take Tailwind classes — they mirror the
token palette and must be updated alongside it.

---

## Data Layer

`data/schemas/project.ts` defines exactly one field per concept. Earlier
revisions carried aliases (`techStack` *and* `technologies`, `liveUrl` *and*
`liveDemo` *and* `links.demo`); those are gone. If you need a value the schema
doesn't have, add the field — don't add a second spelling of an existing one.

```ts
interface Project {
  id: string              // also the URL slug: /projects/<id>/
  title: string           // full title, used on the detail page
  shortTitle?: string     // used on cards when the full title is too long
  domain: Domain          // one of 5 — drives domainLabels + /expertise grouping
  description, problem, solution: string
  impact: { metrics: string[]; roi?; businessValue?; testimonial? }
  technologies: Technology[]
  tags: string[]
  status, featured, year?, duration?, role?, teamSize?, client?
  links?: { github?: string; demo?: string }
  images?: ProjectImage[] // src + alt + intrinsic width/height (prevents CLS)
  highlights?, features?, technicalDetails?
}
```

Helpers in `data/projects/index.ts`:

| Helper                | Purpose                                        |
|-----------------------|------------------------------------------------|
| `allProjects`         | Every project, in display order                |
| `featuredProjects`    | `featured: true` — what the home page renders   |
| `getProjectById(id)`  | Detail-page lookup                             |
| `domainLabels`        | `Domain` → human label                         |
| `cardTitle(p)`        | `shortTitle ?? title`                          |
| `techNames(p)`        | `Technology[]` → `string[]`                    |

**The home page and the case-study routes read the same data.** There is no
second copy of the project list inside a component — adding a project to
`data/projects/index.ts` makes it appear on `/`, `/projects/`, `/expertise/`,
its own detail page, and the sitemap.

### Adding a project

1. Create `data/projects/my-project.ts` exporting a `Project`.
2. Add it to `allProjects` in `data/projects/index.ts`.
3. Put screenshots in `public/`, and record real `width`/`height` in `images`
   (`sips -g pixelWidth -g pixelHeight file.webp`).

---

## Page Assembly

**Home** (`app/page.tsx`) — `Navigation`, then `Hero`, `About`, `Projects`,
`Skills`, `Experience`, `Education`, `Footer`. Alternating sections carry
`.section-alt`. Anchor links rely on `html { scroll-behavior: smooth }`.

**Sub-pages** wrap their content in `<PageShell>`, which supplies the sticky
back bar and the `max-w-5xl` column:

```tsx
<PageShell eyebrow="Case Study" backHref="/projects/" backLabel="All Projects">
  …
</PageShell>
```

`action` accepts an optional node rendered beside the eyebrow — `/education`
uses it for the transcript download button.

---

## Extending

**New home section** — create the component, add it to `app/page.tsx`, set
`id="…"` on its `<section>`, and add a nav entry in `Navigation.tsx`.

**New route** — create `app/<name>/page.tsx`, wrap it in `PageShell`, export
`metadata`, and add the path to the `routes` array in `app/sitemap.ts`.

---

## Commands

```bash
pnpm install
pnpm dev      # dev server on http://localhost:3000
pnpm lint     # ESLint (flat config, eslint.config.mjs)
pnpm build    # static export → /out
```

See `docs/deployment.md` for deployment.

---

*Last updated: August 2026*

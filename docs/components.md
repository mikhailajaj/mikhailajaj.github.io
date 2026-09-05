# Component API Reference

Every component is a Server Component with no props unless noted. Colours come
from the tokens in `app/globals.css` — see `docs/architecture.md`.

---

## PageShell

**Path**: `components/PageShell.tsx`

The sticky back bar and centred content column shared by all sub-pages. The
home page uses `Navigation` instead.

| Prop        | Type        | Default              | Description                              |
|-------------|-------------|----------------------|------------------------------------------|
| `eyebrow`   | `string`    | —                    | Uppercase label on the right of the bar   |
| `backHref`  | `string`    | `'/'`                | Back-link target                          |
| `backLabel` | `string`    | `'Back to Portfolio'`| Back-link text                            |
| `action`    | `ReactNode` | —                    | Rendered beside the eyebrow               |
| `children`  | `ReactNode` | —                    | Page content, inside `<main>`             |

```tsx
<PageShell eyebrow="Case Study" backHref="/projects/" backLabel="All Projects">
  …
</PageShell>
```

---

## Navigation

**Path**: `components/Navigation.tsx` · Client Component

State: `scrolled` (frosted background past 40px) and `menuOpen` (mobile menu).

Edit the `navLinks` array to change links. In-page anchors use `#id`; other
routes use a trailing slash (`/blog/`).

---

## Hero

**Path**: `components/Hero.tsx`

Availability badge, gradient name, role, tagline, CTA buttons, floating tech
pills, scroll hint. Layered back-to-front: `.bg-dots`, three blurred orbs,
then `z-10` content.

---

## About

**Path**: `components/About.tsx`

Two-column grid — bio and links on the left, a 2×2 stats grid on the right.
Edit the `stats` array at the top of the file.

---

## Projects

**Path**: `components/Projects.tsx`

Renders `featuredProjects` from `@/data/projects` — **it holds no project data
of its own**. To change what appears here, edit `data/projects/` and the
`featured` flag. Cards show `domainLabels[domain]`, `cardTitle(project)`,
`duration`, the description, the first 7 `technologies`, and links derived from
`project.links`.

The whole card is a `<Link>` overlay; the footer links sit above it via
`relative`.

---

## Skills

**Path**: `components/Skills.tsx`

Two-column grid of `skillGroups`. Each group carries `category`, `accent`, `bg`,
`border` and `skills`. Add a skill by pushing to the relevant array; add a group
by appending an object with token-based colour classes.

---

## Experience

**Path**: `components/Experience.tsx`

Card per role, with a decorative SVG icon (`aria-hidden`, explicit `width`/
`height` so it reserves space). Data lives in the `experience` array.

---

## Education

**Path**: `components/Education.tsx`

Degree summary and certifications, sourced from `data/certifications.ts`. Links
through to `/education/` for the full transcript.

---

## TranscriptRecord

**Path**: `components/TranscriptRecord.tsx` · Client Component

Per-term course tables with expand/collapse. Grade colours come from
`gradeStyle()` in `data/transcript.ts`, which returns token-based classes.

---

## charts/ChartsWrapper + charts/TranscriptCharts

**Path**: `components/charts/` · Client Components

`ChartsWrapper` exists so `dynamic(..., { ssr: false })` has a client boundary
to live in — that call is illegal in a server component. It renders skeleton
placeholders while Recharts loads.

**Always import charts through `ChartsWrapper`.** Importing `TranscriptCharts`
directly would pull ~450 KB of Recharts into the shared bundle.

---

## Footer

**Path**: `components/Footer.tsx`

Logo and copyright on the left, links on the right. Edit the `links` array;
`external: true` adds `target="_blank" rel="noopener noreferrer"`.

---

## Global Styles

See the design-system table in `docs/architecture.md` for the token list and the
`.section-*` utility classes.

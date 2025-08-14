# Education Feature

This folder documents the Education feature implementation: data schema, context, components, and usage.

## Overview
- Data lives in `data/education.ts` using the schema in `data/schemas/education.ts`.
- A dedicated `EducationContext` (`lib/contexts/EducationContext.tsx`) exposes typed hooks and sorted items.
- UI components render an animated timeline with Framer Motion:
  - `components/features/education/EducationTimeline.tsx`
  - `components/features/education/CertificationGallery.tsx` (placeholder)
  - `components/features/education/SelfEducation.tsx` (Self‑Education section with icons, mobile layout, and resources)
- The page `app/education/page.tsx` wraps content with `EducationProvider`.

## Adding Entries
Add new items to `data/education.ts`:

```ts
{
  id: "unique-id",
  level: "university" | "college" | "highschool" | "secondary" | "primary" | "other",
  title: "Program or Title",
  institution: "Institution Name",
  location: "City, Country",
  start: "YYYY" | "YYYY (Term)",
  end: "YYYY" | "YYYY (Term)",
  ongoing: true | false,
  link: "https://institution.example/program",
  attachments: [{ label: "Transcript", href: "/docs/Education/Transcript.pdf" }],
  highlights: ["Bullet 1", "Bullet 2"],
  order: 1 // lower number appears higher in the timeline (more recent)
}
```

## Two-Column Timeline (Education vs Work)
- This implementation shows one central vertical line and alternating entries.
- For a dual vertical track (Education on left, Work on right), options:
  1. Separate contexts: `EducationContext` and `ExperienceContext`, then render two synchronized columns with independent lists and a shared center guideline.
  2. Unified `TimelineItem` type with `type: "education" | "work"`, then filter by side in a single component.

## Accessibility & Performance
- Animations are enter-on-view, respecting motion-reduced environments.
- Semantic list (`<ol>`) structure is used with accessible links and labels.
- Keep assets in `public/docs/Education/` for static hosting.

## GitHub Pages / Static Export
- All assets referenced (e.g., transcripts) should live under `public/`.
- The link `href: "/docs/Education/Official Transcript (1).pdf"` resolves correctly when deployed.

## Usage
In `app/education/page.tsx`, the provider wraps the page:

```tsx
<EducationProvider>
  <EducationTimeline />
</EducationProvider>
```

You can read data via the hook:

```tsx
const { items, getByLevel } = useEducation();
```

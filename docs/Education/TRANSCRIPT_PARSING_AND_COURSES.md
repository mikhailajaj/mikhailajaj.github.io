# Education: Transcript Parsing and Courses UI

This document describes how the transcript is parsed and rendered, how grades are computed/mapped, and how to configure filters and subject icons.

## Files
- Parser: `lib/services/TranscriptParser.ts`
- Courses UI: `components/features/education/TranscriptCourses.tsx`
- Public transcript: `public/docs/Education/official-transcript.txt`
- Education page integration: `app/education/page.tsx`

## Parsing Logic
- The parser derives term context from headers like `Fall 2017`, `Winter 2025`.
- Course lines detected by presence of a course code (e.g., `PROG 34104`) and/or grade token.
- Withdraw/Fail entries are filtered out even when grades are concatenated with numbers (e.g., `W0.00`, `F0.00`).
- Course subject extracted from the code prefix (e.g., `PROG`, `INFO`, `DBAS`).
- Numeric grade is extracted from the final decimal token on the line (e.g., `657.50` → `65`, `8911.40` → `89`).
- Course name is cleaned by stripping trailing credits/points clusters (e.g., `3.00 8911.40`).

## Grade Mapping
Numeric grades map to letters as follows:
- 90–100 → A+
- 85–89 → A
- 80–84 → A-
- 75–79 → B+
- 70–74 → B
- 65–69 → C+
- 60–64 → C
- 55–59 → C-
- 50–54 → D
- <50 → F

Only date/term, course info, and grade are displayed—credits/points are hidden.

## Subjects & Icons
Subject badges show category and an icon:
- PROG/INFO → code icon
- DBAS → database icon
- TELE → network icon
- SYST → chip icon
- MATH → square-root icon
- PHYS/SCIE → flask icon
- ENGL/HIST/CULT/PSYC → book icon

## Filters & Sorting
The Courses component exposes filtering controls (enabled by default):
- Subject: derived from course codes
- Term: based on term headers parsed from the transcript
- Grade range: based on mapped numeric grade brackets

Props:
```tsx
<TranscriptCourses
  transcriptUrl="/docs/Education/official-transcript.txt"
  title="Selected Courses"
  showFilters={true} // show filter controls
  // Sorting and actions are included by default:
  // - Sort by grade, term, subject, code, or name (asc/desc)
  // - Summary metrics (count, average, A-range)
  // - CSV export of filtered+sorted results
/>
```

## Embedding and A11y
To embed without outer container and supply your own card/section:
```tsx
<Card>
  <TranscriptCourses
    transcriptUrl="/docs/Education/official-transcript.txt"
    embedded
  />
</Card>
```

A11y enhancements:
- Screen-reader status announcer (aria-live) for loading/success/error
- Sort/select inputs include aria-labels
- Summary metrics area is aria-live polite


## Date Labels on Timeline Dots
Education timeline dots display dates with season→month mapping:
- Winter → Jan, Spring → Apr, Summer → Jul, Fall → Sep

Implementation: `components/features/education/EducationTimeline.tsx`.

## Notes
- Replace the public transcript with your real extract. Keep the file under `public/docs/Education/` so it’s accessible on GitHub Pages.
- If the transcript structure changes, adjust the regex in the parser to improve course detection.

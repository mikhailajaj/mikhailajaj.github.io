# Menu System – Current Status and Improvement Plan

This document captures the current navigation (menu) architecture, key findings, and a step-by-step plan to clean up and enhance the system with a “glass” style inspired by https://glass3d.dev/ while preserving filenames to minimize churn across the project.

---

## 1) Current Architecture (as of ./)

Top-level rendering
- ./app/layout.tsx
  - Renders header: `@/components/ui/navigation/DomainAwareNavigation`
  - Renders footer and a persistent mobile bottom bar: `@/components/ui/navigation/MobileBottomNav`

Primary navigation components
- ./components/ui/navigation/DomainAwareNavigation.tsx
  - Production header navigation. Domain-aware styling via `@/lib/contexts/DomainThemeContext`.
  - Uses centralized navigation data: `@/data/navigation.tsx` (mainNavigationItems) and domain data: `@/lib/constants/domains.ts`.
  - Accessibility: keyboard navigation, ARIA, screen reader announcements; hydration-safe active link detection; Framer Motion; `ThemeSwitcher` included.
- ./components/ui/navigation/MobileBottomNav.tsx
  - Fixed bottom mobile navigation; items from `@/data/navigation.tsx` (mobileNavigationItems).
  - Helper hook: `useMobileBottomNavPadding()` to avoid content overlap.
- ./components/ui/navigation/UniversalNavigation.tsx
  - Generic, variant-based nav (header/mobile/sidebar/breadcrumb). Not used by root layout. Keeps its own local nav lists (risk of drift from centralized data).
- ./components/ui/navigation/MegaMenu.tsx
  - Showcase mega menu. Referenced in `./app/ui-showcase/page.tsx`. Keeps its own static sections (not using shared data).

Navigation data and domain config
- ./data/navigation.tsx
  - Canonical navigation data: `mainNavigationItems`, `mobileNavigationItems`, `domainIcons` (see issue below), plus helpers.
- ./data/navigation-unified.tsx
  - Legacy/alternate “unified” version. Not used by production nav; duplicates concepts with a different type shape.
- ./lib/constants/domains.ts
  - Domain IDs (Domain), `DOMAIN_CONFIGS` (names, colors, paths), `DOMAINS` array, utilities to get config and colors.
- ./lib/contexts/DomainThemeContext.tsx
  - Optimized domain theme provider and hooks used by the nav for color and domain state.
- ./lib/utils/hydration.tsx
  - Hydration-safe helpers: `useSafePathname` used by nav for active state.

Secondary integration
- ./components/layouts/UniversalLayout.tsx (optional pages)
  - Renders `DomainAwareNavigation` when used by specific pages.
- ./components/ThemeSwitcher.tsx (used inside nav)
- Tests: `./components/ui/navigation/__tests__/DomainAwareNavigation.test.tsx`, `./components/ui/navigation/__tests__/MobileBottomNav.test.tsx`

---

## 2) Key Findings

- Bug: `domainIcons` keys mismatch Domain IDs
  - In `./data/navigation.tsx`, `domainIcons` is typed as `Record<Domain, React.ReactNode>` but uses keys like `cloud-engineering`, `data-analytics`, etc., whereas Domain IDs are `cloud`, `data`, `ux-ui`, `consulting`.
  - Impact: icons may be undefined in the domain dropdown.
  - Fix: update keys to exact Domain IDs: `cloud`, `data`, `ux-ui`, `consulting`.

- Duplication/drift risk
  - `UniversalNavigation.tsx` holds its own lists rather than consuming `data/navigation.tsx`.
  - `data/navigation-unified.tsx` duplicates the concept with divergent types and is unused.
  - `MegaMenu.tsx` holds static sections internally (not centralized).

- ARIA semantics
  - `DomainAwareNavigation` uses menubar/menu/menuitem roles (more typical for app menus). Consider semantic nav/ul/li/a with aria-current to simplify and improve AT familiarity.

- Consistency
  - Two `cn` imports exist (`@/lib/utils` and `@/lib/utils/cn`); also two button bases in codebase. Standardization will help.

---

## 3) Goals for the Improved Menu

- Keep filenames unchanged for primary, in-use components to minimize refactoring impact:
  - `./components/ui/navigation/DomainAwareNavigation.tsx` (replace content in-place)
  - `./components/ui/navigation/MobileBottomNav.tsx` (replace content in-place)
- Back up unused/non-functional or legacy components to `./docs/components/menu/backup/` with a move record.
- Preserve or improve accessibility (WCAG 2.1 AA), keyboard navigation, and hydration safety.
- Improve performance (minimize re-renders, avoid heavy animations on load, leverage CSS variables for theming).
- Adopt a glass aesthetic inspired by https://glass3d.dev/ (translucent layers, subtle blur, domain-accent borders), respecting contrast requirements.
- Unify data sourcing through `./data/navigation.tsx` and `./lib/constants/domains.ts` only.

---

## 4) Glass Style Direction (inspired by glass3d.dev)

- Visual
  - Translucent containers: `bg-background/50` + `backdrop-blur-md` with subtle border `border-white/10` and domain-accented focus ring/border.
  - Light elevation with `shadow-lg` and colored `outline` or `ring` tinted by domain color.
  - Smooth micro-transitions using Framer Motion for nav reveal and dropdown, but constrained for performance.
- Theming
  - Use domain color from context to style active backgrounds, focus rings, and thin borders, via inline CSS vars or Tailwind style objects.
- Accessibility
  - Opt for semantic nav/ul/li/a with `aria-current="page"` over application menu roles.
  - Maintain keyboard nav: Arrow navigation for horizontal menus; Esc to close mobile/drodpown; robust focus order; visible focus.
- Performance
  - Hydration-safe active link detection (already in place via `useSafePathname`).
  - Avoid animating expensive filters on scroll; prefer transform/opacity.

---

## 5) Detailed Cleanup and Improvement Plan

Step 0 – Tracking and backups
- Create backup directory: `./docs/components/menu/backup/`
- Maintain `./docs/components/menu/backup/move-records.json` with entries:
  - `{ "filename": string, "previouslocation": string }` (paths relative to `./`)

Step 1 – Quick fixes & data consistency (Completed)
- Fix `domainIcons` keys in `./data/navigation.tsx` to match Domain IDs.
- Standardize `cn` import to a single source within nav components.

Step 2 – De-duplicate and archive legacy (Completed for navigation-unified, UniversalNavigation, MegaMenu)
- Update `./components/ui/navigation/UniversalNavigation.tsx` to consume `data/navigation.tsx` (or mark as legacy and move to backup if not used).
- Move `./data/navigation-unified.tsx` to backup (unused).
- If `MegaMenu` is not planned for production, move `./components/ui/navigation/MegaMenu.tsx` to backup and keep the showcase reference updated or documented.

Step 3 – Glass-styled DomainAwareNavigation (keep same filename) — Option A (Completed)
- Replace internals with glass style while preserving props and exports.
- Switch to semantic nav/ul/li/a and keep hydration-safe active state.
- Keep dropdown but style with translucent panel and domain-accent border.

Step 4 – Glass-styled MobileBottomNav (keep same filename) — Option A (Completed)
- Apply translucent background, blur, domain-accented active indicators.
- Maintain large touch targets and hydration-safe active state.

Step 5 – Testing & verification
- Run existing tests: navigation unit tests and accessibility tests.
- Manual checks:
  1) Keyboard navigation (Tab/Shift+Tab, arrow keys where applicable, Esc behavior)
  2) Screen reader labels (`aria-current`, labels on toggle buttons)
  3) Mobile overlay and bottom bar overlap (use `useMobileBottomNavPadding()`)
  4) Domain color application across routes

Step 6 – Documentation & SoC
- Keep components thin and data-driven from `data/navigation.tsx`.
- Add JSDoc/comments describing props, a11y rationale, and styling approach.
- Update this plan with completed tasks and any deltas.

---

## 6) Files Considered in Scope

Core in-use files (keep names; replace contents in-place)
- `./components/ui/navigation/DomainAwareNavigation.tsx`
- `./components/ui/navigation/MobileBottomNav.tsx`

Candidates to archive in backup (unless you prefer to keep active)
- `./components/ui/navigation/UniversalNavigation.tsx` (legacy/demo)
- `./data/navigation-unified.tsx` (unused)
- `./components/ui/navigation/MegaMenu.tsx` (showcase-only; optional)

Shared data/config
- `./data/navigation.tsx` (canonical data for menu)
- `./lib/constants/domains.ts` (domain config/paths/colors)
- `./lib/contexts/DomainThemeContext.tsx` (domain colors via context)
- `./lib/utils/hydration.tsx` (SSR-safe active state)

---

## 7) Move Record Template

Add one line per move to `./docs/components/menu/backup/move-records.json`:

[
  { "filename": "UniversalNavigation.tsx", "previouslocation": "./components/ui/navigation/UniversalNavigation.tsx" },
  { "filename": "navigation-unified.tsx", "previouslocation": "./data/navigation-unified.tsx" },
  { "filename": "MegaMenu.tsx", "previouslocation": "./components/ui/navigation/MegaMenu.tsx" }
]

---

## 8) Rollout Strategy (updated)

- Phase 1: Apply quick bug fix (icons), standardize imports, and archive unused data file.
- Phase 2: Implement glass style in DomainAwareNavigation and MobileBottomNav with the same filenames (Completed).
- Phase 3: Optional: refactor or archive UniversalNavigation and MegaMenu; document alternatives.
- Phase 4: Test, debug, and validate accessibility; update this doc with completion notes.

---

## 9) Senior Dev Notes and Verification Checklist

- Preserve component APIs to avoid ripple changes.
- Favor composition and data-driven rendering over hardcoded lists.
- Keep navigation semantics simple; avoid app-menu roles unless required.
- Ensure colors meet contrast in both light/dark themes; consider fallbacks when domain color is low-contrast over translucent backgrounds.
- Avoid overly heavy backdrop filters on scroll; keep animations inexpensive (opacity/transform only).

Verification checklist (Option A)
- Hydration-safe rendering:
  - MobileBottomNav className SSR vs CSR parity (glass extras only after hydration)
  - MobileBottomNav borderTopColor gated by hydration
  - DomainAwareNavigation uses useSafePathname for active link
- Keyboard navigation:
  - Tab/Shift+Tab moves through main links and dropdown trigger
  - Esc closes mobile drawer and dropdown, focus returns to trigger
  - Arrow keys cycle through menu items (horizontal) with wrap
- Screen reader semantics:
  - aria-current="page" applied to active links
  - Mobile toggle has descriptive aria-label changing with state
  - Dropdown has proper aria-expanded and role semantics preserved (Option A)
- Visual checks:
  - Glass surfaces: bg-background/[30–80] with backdrop-blur-md
  - Subtle borders: border-white/10; focus rings tinted by domain color
  - Hover/active alpha: hover ~10%, active ~40% domain tint
  - Shadows applied to raised glass layers (header scrolled, mobile drawer, bottom bar)
- Mobile:
  - Bottom nav doesn’t overlap content when using useMobileBottomNavPadding
  - Tap targets >= 44px; active indicator animates correctly
- Contrast:
  - Text and icons meet 4.5:1 across light/dark over glass backgrounds


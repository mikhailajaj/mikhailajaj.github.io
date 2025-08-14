# File and Directory Naming Conventions

Consistent naming conventions for files and directories improve code readability, navigation, and understanding. This document outlines the standard naming conventions used in the **Mikhail Ajaj Portfolio** project, following professional development standards and domain-aware architecture.

## General Rules

-   **Use `kebab-case`**: For all directories and non-component files (e.g., utilities, hooks, types, configuration, markdown).
    -   Examples: `lib/utils/cn.ts`, `docs/rules/file-structure/`, `next.config.mjs`, `use-scroll-animation.ts`.
-   **Use `PascalCase`**: For React component files (both `.ts` and `.tsx`). The filename should match the component's name.
    -   Examples: `components/ui/base/Button.tsx`, `components/features/homepage/EnhancedHero.tsx`, `components/core/Layout/MainLayout.tsx`.
-   **Clarity and Descriptiveness**: Names should clearly indicate the purpose or content of the file or directory. Avoid overly generic or abbreviated names where possible.
-   **Lowercase**: All names should generally be lowercase, except for `PascalCase` component files.

## Specific Conventions

### Directories

-   **`kebab-case`**: Always use `kebab-case`.
    -   Examples: `components/features/homepage/`, `components/ui/navigation/`, `lib/utils/`, `data/projects/`.
-   **Portfolio-Specific Structure**:
    -   **Domain directories**: Use domain names for expertise areas: `full-stack/`, `cloud-engineering/`, `data-analytics/`, `ux-ui-design/`, `technical-consulting/`
    -   **Component hierarchy**: Follow the domain-aware structure: `ui/base/`, `ui/navigation/`, `core/Layout/`, `features/homepage/`
    -   **Data organization**: Group by type: `data/projects/`, `data/schemas/`, `data/constants/`
-   **Plural vs. Singular**:
    -   Use plural nouns for directories containing multiple items of the same type (e.g., `components/`, `hooks/`, `types/`, `projects/`).
    -   Use singular nouns for directories representing a single concept (e.g., `data/`, `lib/`, `public/`).

### React Components (`.tsx`, `.ts`)

-   **`PascalCase`**: Match the component name.
    -   Example: Component `UserProfile` -> file `UserProfile.tsx`.
-   **Index Files**: Use `index.ts` (or `index.tsx` if exporting a component directly) for barrel files that re-export modules from a directory.
    -   Example: `features/auth/index.ts` exports `LoginForm`, `useAuthStatus`, etc.
    -   Example: `components/ui/index.ts` exports `Button`, `Card`, `Input`, etc.

### Hooks (`.ts`)

-   **`kebab-case`**: Use `kebab-case`.
-   **`use` Prefix**: Hook filenames should correspond to the hook name, including the `use` prefix.
    -   Example: Hook `useToggle` -> file `use-toggle.ts`.
    -   Example: Hook `useProjectData` -> file `use-project-data.ts`.

### Utility Files (`.ts`)

-   **`kebab-case`**: Use `kebab-case`.
-   **Descriptive Naming**: Name based on the utility's purpose. Often includes a suffix like `-utils` or `-helpers`.
    -   Examples: `date-utils.ts`, `string-helpers.ts`, `api-client.ts`.

### Type Definition Files (`.ts`)

-   **`kebab-case`**: Use `kebab-case`.
-   **Descriptive Naming**: Name based on the domain or feature the types represent. Often includes a suffix like `-types`.
    -   Examples: `project-types.ts`, `auth-types.ts`, `api-responses.ts`.
    -   Alternatively, a single `types.ts` file within a feature directory is acceptable if the number of types is small.

### Configuration Files (`.js`, `.ts`, `.json`, etc.)

-   **`kebab-case` or Standard Names**: Follow common conventions or specific tool requirements.
    -   Examples: `next.config.js`, `tailwind.config.js`, `tsconfig.json`, `eslint.config.mjs`, `.eslintrc.json`.

### Stylesheets (`.css`, `.module.css`, etc.)

-   **`kebab-case`**: Use `kebab-case`.
-   **Component Styles**: For component-specific styles (e.g., CSS Modules), name the file after the component.
    -   Example: Component `UserProfile.tsx` -> styles `UserProfile.module.css`.
-   **Global/Shared Styles**: Name based on purpose.
    -   Examples: `globals.css`, `variables.css`, `layout.css`.

### Documentation Files (`.md`)

-   **`kebab-case`**: Use `kebab-case`.
-   **README**: Use `README.md` (all caps) for the primary documentation file within a directory.
    -   Examples: `docs/rules/README.md`, `features/auth/README.md`.

### Test Files (`.test.ts`, `.test.tsx`, `.spec.ts`, etc.)

-   **Match Tested File**: Name the test file the same as the file it tests, appending the test suffix.
    -   Example: `date-utils.ts` -> `date-utils.test.ts`.
    -   Example: `Button.tsx` -> `Button.test.tsx`.

## Summary Table

| File Type                 | Convention   | Example                                      |
| :------------------------ | :----------- | :------------------------------------------- |
| Directories               | `kebab-case` | `features/auth/`, `components/ui/`           |
| React Components          | `PascalCase` | `UserProfile.tsx`, `Button.tsx`              |
| Hooks                     | `kebab-case` | `use-toggle.ts`, `use-project-data.ts`       |
| Utilities                 | `kebab-case` | `date-utils.ts`, `api-client.ts`             |
| Types                     | `kebab-case` | `project-types.ts`, `types.ts`               |
| Config                    | `kebab-case` | `next.config.js`, `tsconfig.json`            |
| Styles (Component)        | `PascalCase` | `UserProfile.module.css`                     |
| Styles (Other)            | `kebab-case` | `globals.css`, `variables.css`               |
| Docs (README)             | `UPPERCASE`  | `README.md`                                  |
| Docs (Other)              | `kebab-case` | `naming-conventions.md`                      |
| Tests                     | Match File   | `Button.test.tsx`, `date-utils.test.ts`      |
| Barrel Files              | `lowercase`  | `index.ts`                                   |

Adhering to these conventions ensures consistency and predictability across the codebase.
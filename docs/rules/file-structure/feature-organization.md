# Feature-First Organization Guidelines

The Mikhail Ajaj Portfolio project utilizes a "feature-first" (also known as "feature-based" or "module-based") directory structure. This approach organizes code by application features rather than by file type (like grouping all components in one folder, all hooks in another, etc.).

## Rationale

-   **Co-location**: Keeps all code related to a specific feature (components, hooks, types, styles, tests, API routes, etc.) together in one place.
-   **Discoverability**: Easier to find all relevant code for a particular feature when working on it or debugging.
-   **Modularity**: Features are more self-contained, making them potentially easier to refactor, move, or even extract into separate packages later.
-   **Reduced Context Switching**: Developers can focus on a single feature directory without jumping between disparate type-based folders.
-   **Scalability**: Scales better for larger applications with many features compared to type-based structures which can become unwieldy.

## Core Structure

The primary location for feature-specific code is the `features/` directory at the project root.

```
constructit/
├── app/                 # Next.js app router (can contain feature routes)
├── components/          # Truly *shared*, generic UI components (e.g., Button, Card, Input)
├── features/            # Top-level directory for feature modules
│   ├── auth/            # Feature: Authentication
│   │   ├── api/         # API routes specific to auth (if colocated)
│   │   ├── components/  # React components specific to auth (e.g., LoginForm, UserMenu)
│   │   ├── hooks/       # React hooks specific to auth (e.g., useAuthStatus)
│   │   ├── lib/         # Utility functions, constants specific to auth
│   │   ├── types/       # TypeScript types specific to auth
│   │   ├── index.ts     # Barrel file exporting public parts of the feature
│   │   └── README.md    # Documentation for the auth feature
│   │
│   ├── projects/        # Feature: Project Management
│   │   ├── components/  # (e.g., ProjectList, ProjectCard, ProjectForm)
│   │   ├── hooks/       # (e.g., useProjectData)
│   │   ├── store/       # State management specific to projects (if applicable)
│   │   ├── types/       # (e.g., Project, Task)
│   │   ├── index.ts
│   │   └── README.md
│   │
│   ├── service-request-wizard/ # Feature: Service Request Wizard
│   │   └── ... (similar structure)
│   │
│   └── ... (other features)
│
├── hooks/               # Truly *shared*, generic hooks (e.g., useDebounce, useLocalStorage)
├── lib/                 # Truly *shared*, generic utilities, types, constants
├── store/               # Global application state setup (if applicable)
├── styles/              # Global styles
└── ... (other project files: next.config.js, package.json, etc.)
```

## Key Guidelines

1.  **Identify Features**: Define clear boundaries for what constitutes a "feature". This might align with major sections of the application (Auth, Projects, Estimates, Admin Panel) or significant user workflows (Service Request Wizard).
2.  **Co-locate within `features/`**: Place all code *primarily* related to a single feature within its dedicated directory inside `features/`.
3.  **Internal Structure**: Within each feature directory, you can further organize by type (e.g., `components/`, `hooks/`, `types/`, `api/`) but these are *local* to the feature.
4.  **Shared Code**:
    *   Place genuinely reusable, generic components (e.g., `Button`, `Input`, `Modal`, `Card`) in the top-level `components/` directory. These should be presentation-focused and not tied to any specific feature's logic or data.
    *   Place genuinely reusable, generic hooks (e.g., `useToggle`, `useFetch`) in the top-level `hooks/` directory.
    *   Place genuinely reusable utilities, types, constants, or core logic (e.g., date formatting, API client setup, core domain types) in the top-level `lib/` directory.
5.  **Avoid Premature Abstraction**: Don't move code to the shared directories (`components/`, `hooks/`, `lib/`) too early. It's often better to duplicate slightly first and only abstract when a clear, reusable pattern emerges across multiple features.
6.  **Barrel Files (`index.ts`)**: Each feature directory should have an `index.ts` file that exports the public interface of the feature (e.g., the main components or hooks intended for use by other features or the app router). This simplifies imports.
7.  **App Router Integration**: Feature routes within the Next.js `app/` directory can import components and logic directly from the corresponding `features/` directory. Keep route files (`page.tsx`, `layout.tsx`, `route.ts`) focused on routing, data fetching for the route, and composing feature components.
8.  **Module Boundaries**: Define clear rules about how features can interact. Consider using ESLint rules (like `eslint-plugin-import` or custom rules) to enforce boundaries if needed (e.g., preventing direct imports into the internals of another feature, forcing use of the barrel file). (See [module-boundaries.md](./module-boundaries.md)).

## When *Not* to Use Feature-First

-   For truly cross-cutting concerns like core UI elements, foundational hooks, or application-wide configuration, the top-level shared directories are more appropriate.
-   Tiny features might not warrant a full directory structure initially, but consider creating one if the feature starts to grow.

Adopting a consistent feature-first structure promotes better organization and scalability for the Mikhail Ajaj Portfolio.
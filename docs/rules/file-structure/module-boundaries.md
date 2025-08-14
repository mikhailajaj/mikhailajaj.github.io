# Module Boundary Guidelines

In a feature-first architecture, establishing clear boundaries between feature modules is crucial for maintaining modularity, reducing coupling, and improving long-term maintainability. This document outlines guidelines for defining and enforcing module boundaries in the Mikhail Ajaj Portfolio project.

## Why Module Boundaries?

-   **Reduced Coupling**: Features should depend on each other as little as possible. Clear boundaries prevent features from becoming tightly interwoven, making them easier to modify or replace independently.
-   **Improved Maintainability**: Changes within one feature module are less likely to have unintended side effects on other features if boundaries are respected.
-   **Encapsulation**: Each feature module should hide its internal implementation details and expose only a well-defined public API (via its barrel file).
-   **Team Scalability**: Different teams or developers can work on separate features with less risk of conflicts or breaking changes if boundaries are clear.
-   **Code Understanding**: Boundaries make it easier to understand the scope and responsibilities of a specific feature.

## Defining a Module's Public API

The primary mechanism for defining a feature module's public API is its **barrel file (`index.ts`)**.

-   Each feature directory (e.g., `features/auth/`) **must** have an `index.ts` file.
-   This `index.ts` file should explicitly export only the components, hooks, types, constants, or utility functions that are intended to be used by *other* modules or the application's routing layer (`app/`).
-   Internal components, types, or utilities used only within the feature module should **not** be exported from the barrel file.

**Example (`features/auth/index.ts`):**

```typescript
// Export components intended for external use
export { default as LoginForm } from './components/LoginForm';
export { default as UserMenu } from './components/UserMenu';

// Export hooks intended for external use
export { useAuthStatus } from './hooks/useAuthStatus';
export { usePermissions } from './hooks/usePermissions';

// Export types needed externally
export type { AuthUser, Permission } from './types';

// DO NOT export internal components like AuthFormFields, PasswordInput, etc.
// DO NOT export internal utility functions unless truly intended for sharing.
```

## Enforcing Boundaries

### 1. Import Conventions (Manual Enforcement)

-   **Rule**: Code outside a feature module (e.g., in another feature module or in `app/`) **must** import from the feature's barrel file, not directly from internal files within the feature directory.

    ```typescript
    // Good: Importing from the barrel file
    import { LoginForm, useAuthStatus } from '@/features/auth';

    // Bad: Importing directly from internal files
    // import LoginForm from '@/features/auth/components/LoginForm'; // Avoid!
    // import { internalHelper } from '@/features/auth/lib/helpers'; // Avoid!
    ```

-   **Rationale**: This ensures consumers only rely on the defined public API, allowing the feature's internal structure to be refactored without breaking external code.

### 2. ESLint Rules (Automated Enforcement)

Using ESLint plugins can help automate the enforcement of module boundaries.

-   **`eslint-plugin-import`**:
    *   `no-restricted-paths`: This rule can be configured to prevent imports that cross specified boundaries. You can define zones (e.g., each feature directory) and restrict imports between them or into their internal paths.
    *   `no-internal-modules`: Can sometimes be configured to prevent deep imports if barrel files are consistently used.

-   **`eslint-plugin-boundaries`** (or similar): Dedicated plugins exist specifically for enforcing architectural boundaries between layers or modules. These often provide more sophisticated configuration options.

-   **Custom ESLint Rules**: For very specific boundary requirements, custom rules can be written.

**Example Configuration Concept (`.eslintrc.js` or similar):**

```javascript
// NOTE: This is conceptual. Actual configuration depends on the chosen plugin.
// Example using eslint-plugin-import's no-restricted-paths

module.exports = {
  // ... other config
  plugins: ['import'],
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Prevent feature A from importing directly into feature B's internals
          {
            target: './features/auth/**/*', // Target internal files of auth
            from: './features/projects/**/*', // From project feature
            message: 'Do not import directly into auth internals from projects. Use "@/features/auth" barrel file.',
          },
          {
            target: './features/projects/**/*', // Target internal files of projects
            from: './features/auth/**/*', // From auth feature
            message: 'Do not import directly into projects internals from auth. Use "@/features/projects" barrel file.',
          },
          // Add more zones for other features and shared directories as needed
          // Prevent any feature from importing directly into another feature's components/hooks/lib etc.
          {
            target: './features/*/components/**/*',
            from: './features/*/**/*',
            except: ['./index.ts'], // Allow imports from barrel files
            message: 'Cross-feature component import must use the feature barrel file.',
          },
           // Prevent app from importing feature internals
          {
            target: './features/*/**/*',
            from: './app/**/*',
            except: ['./index.ts'],
             message: 'App routes must import from feature barrel files, not internals.',
          }
        ],
      },
    ],
    // ... other rules
  },
};
```

*(Consult the documentation for the specific ESLint plugin you choose for the exact configuration syntax)*.

## Shared Code Boundaries

Similar principles apply to shared directories (`components/`, `hooks/`, `lib/`). While generally more permissible to import from, consider using barrel files (`index.ts`) within subdirectories (e.g., `components/ui/index.ts`) to group related shared items and simplify imports.

By defining and enforcing clear module boundaries, the Mikhail Ajaj Portfolio project can maintain a clean, modular, and scalable architecture.
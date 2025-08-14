# Next.js App Router Routing Guidelines

The Next.js App Router (`app/` directory) uses a file-system based routing mechanism with specific file conventions to define routes, layouts, and UI components for different URL paths. Understanding these conventions is key to structuring navigation and UI in the Mikhail Ajaj Portfolio project.

## Core Concepts

-   **File-System Based**: Folders define route segments, and special files within those folders define the UI and behavior for that route.
-   **Route Segments**: Each folder in `app/` maps to a URL segment (e.g., `app/dashboard/settings/` maps to `/dashboard/settings`).
-   **Special Files**: Files like `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `template.tsx`, and `route.ts` have specific meanings and define the UI and server-side logic for a route segment.
-   **Server Components by Default**: Files within `app/` are Server Components unless marked with `"use client"`.

## Special File Conventions

-   **`page.tsx`**: Defines the unique UI for a specific route segment. This is the component rendered when the user navigates to the exact path defined by the folder structure. Required to make a route segment publicly accessible.
-   **`layout.tsx`**: Defines a shared UI layout that wraps `page.tsx` and any nested child layouts. Layouts preserve state during navigation between child segments. Must accept a `children` prop. A root layout (`app/layout.tsx`) is required.
-   **`template.tsx`**: Similar to `layout.tsx` but creates a *new* instance for each child segment on navigation. State is *not* preserved. Useful for enter/exit animations or effects that need to re-run on navigation. Use less frequently than layouts.
-   **`loading.tsx`**: Defines loading UI (e.g., a spinner or skeleton screen) shown via React Suspense while the content of a route segment (defined by `page.tsx` or child layouts) is loading. Automatically wraps the `page.tsx` and its children in a Suspense boundary.
-   **`error.tsx`**: Defines error UI shown when an *uncaught* error occurs within a route segment or its children. Automatically wraps the segment in a React Error Boundary. Must be a Client Component (`"use client"`) and receives `error` and `reset` props. Catches errors from `page.tsx` and components below it, but *not* from `layout.tsx` in the same segment.
-   **`global-error.tsx`**: Similar to `error.tsx` but catches errors in the *root* layout (`app/layout.tsx`).
-   **`not-found.tsx`**: Defines UI shown when the `notFound()` function is thrown within a route segment, or when a URL doesn't match any defined route.
-   **`route.ts`**: Defines server-side API endpoints (Route Handlers) instead of UI components. Exports functions corresponding to HTTP methods (e.g., `export async function GET(request: Request) { ... }`).

## Dynamic Routes

-   **Single Segment**: Use square brackets `[]` to create a dynamic route segment. The value is passed as a parameter.
    -   Example: `app/projects/[projectId]/page.tsx` matches `/projects/abc`, `/projects/123`. The `projectId` ('abc', '123') is available in `props.params`.
-   **Catch-all Segment**: Use square brackets with ellipsis `[...folderName]` to match multiple segments.
    -   Example: `app/files/[...fileSegments]/page.tsx` matches `/files/a`, `/files/a/b`, `/files/a/b/c`. `fileSegments` is an array (`['a']`, `['a', 'b']`, `['a', 'b', 'c']`).
-   **Optional Catch-all Segment**: Use double square brackets `[[...folderName]]` to match zero or more segments, including the base path.
    -   Example: `app/optional/[[...slug]]/page.tsx` matches `/optional`, `/optional/a`, `/optional/a/b`. `slug` is an array or `undefined`.

## Layout Nesting

Layouts are nested by default. A `layout.tsx` file applies to its own segment and all child segments below it.

```
app/
├── layout.tsx        # Root layout (applies to all routes)
├── page.tsx          # UI for '/'
│
└── dashboard/
    ├── layout.tsx    # Dashboard layout (wraps dashboard pages)
    ├── page.tsx      # UI for '/dashboard'
    │
    └── settings/
        └── page.tsx  # UI for '/dashboard/settings' (wrapped by BOTH root and dashboard layouts)
```

## Route Groups

-   Use parentheses `()` around a folder name to create a route group. This allows organizing routes or opting a segment into a specific layout *without* affecting the URL path.
    -   Example: `app/(marketing)/about/page.tsx` maps to `/about`. Useful for grouping marketing pages under a specific marketing layout defined in `app/(marketing)/layout.tsx`.
    -   Example: `app/(shop)/layout.tsx` and `app/(checkout)/layout.tsx` allow `/shop/product` and `/checkout` to have different root layouts below the main `app/layout.tsx`.

## Parallel Routes

-   Use the `@folder` naming convention (slots) to render multiple independent pages within the same layout simultaneously. Often used for dashboards or feeds with independent sections.
-   Define slots in `layout.tsx` by creating folders prefixed with `@`. Each slot is passed as a prop to the layout component.
-   Each slot (`@folder`) has its own navigation state and can have its own layouts and pages.

```
app/
└── dashboard/
    ├── @analytics/     # Slot 1
    │   └── page.tsx
    ├── @team/          # Slot 2
    │   └── settings/
    │       └── page.tsx
    ├── layout.tsx      # Receives props.analytics and props.team
    └── page.tsx        # Default page if slots don't match or as fallback
```

## Intercepting Routes

-   Use the `(.)`, `(..)`, `(..)(..)`, `(...)` conventions in folder names to load a route from *another* part of the application within the current layout, often used for modals or previews.
    -   `(.)photoId`: Matches `photoId` segment in the *same* level.
    -   `(..)photoId`: Matches `photoId` segment *one* level above.
    -   `(..)(..)photoId`: Matches `photoId` segment *two* levels above.
    -   `(...)photoId`: Matches `photoId` segment from the *root* `app` directory.
-   Example: Displaying a photo modal (`@modal/(.)photos/[id]/page.tsx`) when navigating to `/photos/[id]` from a feed page (`/feed/page.tsx`), without a full page transition initially. A hard navigation to `/photos/[id]` would render the actual photo page (`/photos/[id]/page.tsx`).

## Best Practices

*   **Co-location**: Keep route-specific components (`page.tsx`, `layout.tsx`, etc.) close to the feature code they relate to, often importing components from `features/`.
*   **Minimal `page.tsx`**: Keep `page.tsx` files focused on fetching data for the route and composing the main UI components for that page. Complex UI logic should reside in imported components.
*   **Strategic Layouts**: Use layouts effectively for shared UI, but avoid overly deep nesting if it complicates logic. Use route groups to apply layouts selectively.
*   **Loading/Error UI**: Implement `loading.tsx` and `error.tsx` for better user experience during data fetching and error states.
*   **`Link` Component**: Use the `next/link` component for client-side navigation between routes. Avoid using standard `<a>` tags for internal navigation.
*   **Programmatic Navigation**: Use the `useRouter` hook (from `next/navigation`) in Client Components for programmatic navigation (`router.push('/path')`, `router.replace('/path')`, `router.back()`).

Understanding these file conventions and patterns is essential for building well-structured and performant applications with the Next.js App Router.
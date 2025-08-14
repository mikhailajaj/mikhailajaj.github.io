# Code Splitting Guidelines

Code splitting is a technique used by modern JavaScript bundlers (like Webpack, used by Next.js) to split your application's code into smaller chunks that can be loaded on demand, rather than downloading a single, large bundle upfront. This significantly improves initial page load performance.

## Why Code Splitting?

-   **Faster Initial Load**: Users only download the JavaScript necessary for the initial route, reducing download time and parsing/execution cost.
-   **Improved Time to Interactive (TTI)**: The browser can parse and execute smaller chunks faster, making the page interactive sooner.
-   **On-Demand Loading**: Code for features or routes not immediately needed is loaded only when the user navigates to them or interacts with them.

## How Next.js Handles Code Splitting

Next.js has built-in support for automatic code splitting, requiring minimal configuration for basic cases:

1.  **Page-Based Splitting**: By default, Next.js automatically splits code based on pages (route segments in the `app/` directory or files in the `pages/` directory). Each page only loads the JavaScript it needs for its initial render.
2.  **Dynamic Imports (`next/dynamic`)**: Allows you to explicitly defer the loading of specific components or libraries until they are actually needed or rendered.

## Using Dynamic Imports (`next/dynamic`)

This is the primary way to manually control code splitting beyond the default page-based splitting.

-   **What**: A function provided by Next.js that allows importing React components dynamically. The imported component and its dependencies are placed into a separate chunk.
-   **When**: Use for:
    *   Large components or sections of the UI that are not visible on initial load (e.g., modals, complex charts, components below the fold).
    *   Components that rely on large third-party libraries only needed for specific interactions.
    *   Components that should only be rendered on the client-side (disabling SSR).
-   **How**:

    ```typescript
    import React, { useState } from 'react';
    import dynamic from 'next/dynamic';

    // Dynamically import HeavyComponent
    // The component code will be in a separate chunk and loaded only when needed.
    const HeavyComponent = dynamic(() => import('@/features/reporting/components/HeavyComponent'), {
      loading: () => <p>Loading component...</p>, // Optional loading indicator
      ssr: false // Optional: Disable server-side rendering for this component
    });

    // Example: Dynamically import a large library for a specific feature
    const MarkdownEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });


    function MyPage() {
      const [showModal, setShowModal] = useState(false);

      return (
        <div>
          <h1>My Page</h1>
          <button onClick={() => setShowModal(true)}>Show Heavy Modal</button>

          {/* HeavyComponent is only loaded when showModal becomes true */}
          {showModal && <HeavyComponent data={...} />}

          {/* MarkdownEditor is loaded only when rendered */}
          {/* <MarkdownEditor value={text} onChange={handleEditorChange} /> */}
        </div>
      );
    }

    export default MyPage;
    ```

-   **Options**:
    *   `loading`: A function returning a React component to display while the dynamic component is loading.
    *   `ssr`: A boolean. If `false`, the component will only be rendered on the client-side, skipping server-side rendering. Useful for components that rely heavily on browser APIs (`window`, etc.). Defaults to `true`.
    *   `suspense`: (App Router) If `true`, uses React Suspense boundary instead of the `loading` prop. Recommended in App Router.

## Best Practices

*   **Identify Large/Conditional Components**: Use bundle analysis tools (see [Bundle Size](./bundle-size.md)) to identify large components or libraries that are good candidates for dynamic imports.
*   **Load Below-the-Fold Content Dynamically**: Components that are not initially visible can often be loaded dynamically.
*   **Conditional Loading**: Use dynamic imports for components rendered based on user interaction (e.g., opening a modal, clicking a tab).
*   **Client-Side Only Components**: Use `dynamic(() => import(...), { ssr: false })` for components that interact directly with browser APIs like `window` or `document`, or rely on libraries that only work client-side.
*   **Loading States**: Provide clear loading indicators (`loading` prop or Suspense) for dynamically loaded components to improve user experience.
*   **Avoid Over-Splitting**: Creating too many tiny chunks can sometimes negatively impact performance due to increased network requests or build complexity. Focus on splitting significant chunks of code.
*   **Analyze Impact**: Measure performance before and after implementing dynamic imports to ensure they provide a net benefit.

By leveraging Next.js's automatic page-based splitting and strategically using `next/dynamic` for large or conditionally rendered components, you can significantly improve the load performance of the Mikhail Ajaj Portfolio.
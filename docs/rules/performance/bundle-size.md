# Bundle Size Guidelines

JavaScript bundle size is a critical factor affecting web performance. Larger bundles take longer to download, parse, and execute, delaying the Time to Interactive (TTI) and potentially frustrating users. Regularly analyzing and optimizing bundle size is essential for the Mikhail Ajaj Portfolio.

## Why Bundle Size Matters

-   **Download Time**: Larger files take longer to download, especially on slower network connections.
-   **Parse & Compile Time**: Browsers need to parse and compile JavaScript before executing it. This is CPU-intensive, particularly on less powerful mobile devices.
-   **Execution Time**: More code generally means longer execution time, potentially blocking the main thread and delaying interactivity.
-   **Memory Usage**: Larger bundles consume more memory on the user's device.

## Analyzing Bundle Size

Regularly analyze the application's bundle composition to identify what contributes most to its size.

1.  **`@next/bundle-analyzer`**:
    *   **What**: An official Next.js plugin that generates an interactive treemap visualization of your JavaScript bundles after a production build.
    *   **How**:
        *   Install: `npm install --save-dev @next/bundle-analyzer` (or yarn/pnpm equivalent).
        *   Configure `next.config.js`:
            ```javascript
            const withBundleAnalyzer = require('@next/bundle-analyzer')({
              enabled: process.env.ANALYZE === 'true',
            })
            module.exports = withBundleAnalyzer({
              // Your Next.js config
            })
            ```
        *   Run analysis: `ANALYZE=true npm run build` (or `yarn build`, `pnpm build`).
        *   This will open interactive HTML reports (`.next/analyze/client.html` and `server.html`) showing the size and composition of each chunk.
    *   **Use**: Identify large dependencies, duplicated modules, or code that could be dynamically imported.

2.  **Source Map Explorer**:
    *   **What**: A tool that analyzes JavaScript bundles using source maps to show which original source files contribute to the bundle size.
    *   **How**: `npx source-map-explorer .next/static/**/*.js` (run after a production build).
    *   **Use**: Helps pinpoint specific components or utilities in your source code that result in large bundle contributions.

3.  **Webpack Bundle Analyzer** (Alternative):
    *   Similar to `@next/bundle-analyzer` but can be used more generally with Webpack projects. `@next/bundle-analyzer` is usually sufficient for Next.js projects.

## Strategies for Reducing Bundle Size

1.  **Code Splitting**:
    *   Leverage Next.js automatic page-based splitting.
    *   Use `next/dynamic` for large components, libraries, or conditionally rendered UI. (See [Code Splitting](./code-splitting.md)).
2.  **Dependency Auditing**:
    *   Regularly review `package.json`. Are all dependencies still necessary?
    *   Check for large dependencies using bundle analysis tools. Can they be replaced with smaller alternatives? (e.g., use `date-fns` for specific date functions instead of importing all of `moment.js`).
    *   Use tools like `bundlephobia.com` to check the size impact of adding new dependencies *before* installing them.
3.  **Tree Shaking**:
    *   Ensure tree shaking is working effectively. This process eliminates unused code (dead code elimination) during the build.
    *   Prefer importing specific members (`import { functionA } from 'library'`) rather than entire libraries (`import library from 'library'`) if the library supports it and is properly configured for tree shaking (ES module format).
    *   Check library documentation for tree shaking compatibility. Avoid libraries that cause side effects on import if possible.
4.  **Optimize Imports**:
    *   Some libraries offer direct imports for specific modules which can aid tree shaking (e.g., `import Button from 'lodash/button'`). Check library documentation.
5.  **Server Components**:
    *   Utilize Next.js Server Components extensively. Code within Server Components (and libraries only used by them) does not contribute to the client-side bundle size.
6.  **Environment Variables**:
    *   Use environment variables (`NEXT_PUBLIC_...`) carefully. They get inlined into the client bundle. Avoid storing large amounts of data in them.
7.  **Remove Unused Code**: Regularly refactor and remove dead or unused code, components, and dependencies.
8.  **Compression**: Ensure server-side compression (Brotli, Gzip) is enabled for your assets. Next.js/Vercel typically handle this automatically.

## Monitoring

-   **Regular Analysis**: Run the bundle analyzer periodically (e.g., before major releases or after adding significant dependencies) to catch regressions.
-   **Performance Budgets**: Consider setting performance budgets (e.g., maximum bundle size for specific chunks) using tools or CI checks to prevent accidental size increases.
-   **Real User Monitoring (RUM)**: Use analytics tools that track real user performance metrics, which can indirectly indicate issues related to bundle size (e.g., high TTI).

By actively monitoring and optimizing bundle size using these techniques, you can ensure the Mikhail Ajaj Portfolio remains fast and responsive for all users.
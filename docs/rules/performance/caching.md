# Caching Guidelines

Caching is a fundamental performance optimization technique that involves storing copies of data or computations to serve future requests faster. Next.js implements several layers of caching automatically and provides mechanisms for fine-grained control. Understanding and leveraging these is crucial for optimizing the Mikhail Ajaj Portfolio.

## Next.js Caching Layers

1.  **Request Memoization (React)**:
    *   **Scope**: Single render pass on the server.
    *   **What**: Deduplicates identical `fetch` requests made within the same React component tree during one server render. Prevents fetching the same data multiple times unnecessarily within a single request lifecycle.
    *   **Control**: Automatic for `fetch`. Does not apply across different server requests.

2.  **Data Cache (Next.js)**:
    *   **Scope**: Across multiple server requests. Persistent.
    *   **What**: Caches the results of data fetching operations, primarily those using the extended Next.js `fetch` API in Server Components or Route Handlers.
    *   **Control**:
        *   Default: `fetch` requests are cached indefinitely (`force-cache`) unless part of a dynamically rendered route.
        *   Opt-out: `fetch(url, { cache: 'no-store' })`.
        *   Time-based revalidation: `fetch(url, { next: { revalidate: 60 } })` (revalidate after 60 seconds).
        *   Tagged-based revalidation: `fetch(url, { next: { tags: ['myTag'] } })` and use `revalidateTag('myTag')` on-demand.
    *   **Note**: Does *not* automatically cache data fetched using third-party libraries (e.g., database clients) unless they explicitly integrate with this cache or you implement custom caching.

3.  **Full Route Cache (Next.js)**:
    *   **Scope**: Across multiple server requests. Persistent.
    *   **What**: Caches the fully rendered HTML and the React Server Component (RSC) payload for a route segment. Makes subsequent navigations to statically rendered routes extremely fast.
    *   **Control**:
        *   Default: Enabled for statically rendered routes.
        *   Invalidation: Automatically invalidated if the route uses dynamic functions (`cookies()`, `headers()`, `searchParams` in Server Components) or dynamic `fetch` requests (`cache: 'no-store'`, `revalidate: 0`).
        *   Manual Revalidation: Use `revalidatePath` or `revalidateTag` (which revalidates all paths using that tag) in Server Actions or Route Handlers.
        *   Segment Config: `export const revalidate = 60;` or `export const dynamic = 'force-dynamic';` within `page.tsx` or `layout.tsx`.

4.  **Router Cache (Client-Side)**:
    *   **Scope**: Single user session in the browser. In-memory.
    *   **What**: Caches the RSC payload (the result of rendering Server Components) for visited route segments.
    *   **Control**:
        *   Automatic: Populated as the user navigates.
        *   Prefetching: `next/link` automatically prefetches routes within the viewport (RSC payload only), making subsequent navigations near-instantaneous.
        *   Invalidation: Automatically invalidated on page reload. Can be partially invalidated by `router.refresh()` or fully by cache-busting techniques if needed (less common). `revalidatePath`/`revalidateTag` on the server *do not* directly invalidate this client-side cache, but the next navigation to the affected path will fetch fresh data from the server (which might then come from the updated Data Cache or be newly rendered).

## HTTP Caching Headers

Beyond Next.js specific caches, standard HTTP caching headers controlled by your server/hosting platform (like Vercel) play a role, especially for static assets (JS, CSS, images, fonts).

-   **`Cache-Control`**: The primary header dictating how browsers and CDNs should cache assets (e.g., `public, max-age=31536000, immutable` for versioned assets, `public, max-age=0, must-revalidate` for HTML). Next.js and Vercel typically set appropriate defaults.
-   **`ETag` / `Last-Modified`**: Used for validation, allowing browsers to check if a cached asset is still fresh without re-downloading it (resulting in a `304 Not Modified` response).

## Best Practices

*   **Leverage `fetch` Caching**: Use the extended `fetch` API in Server Components and Route Handlers whenever possible to benefit from automatic caching and revalidation features.
*   **Static Rendering**: Aim for static rendering (`output: 'export'` or default static behavior) for pages where possible to maximize the benefit of the Full Route Cache and CDNs.
*   **Configure Revalidation**: Set appropriate `revalidate` times for data that changes infrequently but shouldn't be completely static. Use `tags` for data that needs on-demand revalidation after mutations.
*   **Use `revalidatePath`/`revalidateTag`**: Trigger on-demand revalidation in Server Actions or Route Handlers after data mutations to ensure users see fresh data without waiting for time-based revalidation.
*   **Understand Dynamic Rendering Triggers**: Be aware that using `cookies()`, `headers()`, `searchParams`, or uncached fetches in a Server Component opts that route segment out of the Full Route Cache, potentially impacting performance if not intended.
*   **Client-Side Caching**: For client-side data fetching (e.g., with SWR or React Query), configure their caching mechanisms appropriately based on data freshness requirements.
*   **Static Assets**: Ensure static assets (JS, CSS, images) have long cache lifetimes via `Cache-Control` headers (usually handled by Next.js/Vercel). Use file hashing for cache busting.
*   **Monitor Cache Hit Rates**: If possible (e.g., via hosting provider analytics or CDN logs), monitor cache hit rates to ensure caching strategies are effective.

Effective caching is multi-layered. By understanding and configuring Next.js's built-in caches and leveraging standard HTTP caching, you can dramatically improve the performance and reduce the load times of the Mikhail Ajaj Portfolio.
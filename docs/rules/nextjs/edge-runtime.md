# Next.js Edge Runtime Guidelines

Next.js allows specific parts of your application, namely Middleware and certain Route Handlers, to run on the "Edge" - a lightweight V8 JavaScript runtime closer to your users globally. Understanding when and how to use the Edge Runtime is important for optimizing performance and latency in the Mikhail Ajaj Portfolio project.

## What is the Edge Runtime?

-   **Lightweight Runtime**: A subset of standard Web APIs, optimized for speed and low latency. It does *not* support native Node.js APIs.
-   **Global Distribution**: Code runs on Edge infrastructure (like Vercel Edge Network or Cloudflare Workers) geographically closer to the user, reducing network latency.
-   **Use Cases**: Ideal for functions that need to execute quickly before a request hits the main server origin or before content is cached.
    -   **Middleware (`middleware.ts`)**: Intercepting requests for authentication, A/B testing, redirects, localization, header modification, etc. Middleware *always* runs on the Edge Runtime.
    -   **Route Handlers (`route.ts`)**: Opt-in for specific API routes that benefit from Edge execution (e.g., simple data fetching from fast global data stores, personalization APIs).

## Constraints of the Edge Runtime

The Edge Runtime has limitations compared to the standard Node.js runtime used by default for Server Components and most Route Handlers:

-   **No Native Node.js APIs**: You cannot use modules like `fs`, `path`, `child_process`, or most Node.js built-in modules.
-   **Limited Web APIs**: Provides a subset of Web APIs like `fetch`, `Request`, `Response`, `URL`, `Headers`, `TextEncoder`, `crypto`, `setTimeout`, etc. See Vercel/Next.js documentation for the exact supported APIs.
-   **No Direct Database Connections (Typically)**: Traditional database drivers often rely on Node.js APIs or TCP connections not available on the Edge. Access databases via HTTP APIs (e.g., serverless data platforms like Neon, PlanetScale via their fetch-compatible drivers, or your own API layer).
-   **Code Size Limits**: Edge functions typically have stricter code size limits (e.g., ~1-4MB after compression, depending on the provider). Avoid large dependencies.
-   **Execution Time Limits**: Short execution time limits (e.g., milliseconds to a few seconds). Not suitable for long-running tasks.
-   **Streaming Preferred**: APIs are optimized for streaming request and response bodies.

## Opting into Edge Runtime (Route Handlers)

To run a specific Route Handler (`route.ts`) on the Edge, export the `runtime` constant:

```typescript
// app/api/geo/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Opt into the Edge Runtime
export const runtime = 'edge';
// export const preferredRegion = 'iad1'; // Optional: Specify preferred region

export async function GET(request: NextRequest) {
  // Access geo information provided by Vercel Edge Network
  const country = request.geo?.country || 'Unknown';
  const city = request.geo?.city || 'Unknown';

  // Example: Return geo data (runs close to the user)
  return NextResponse.json({ country, city });
}
```

**Note**: `middleware.ts` *always* runs on the Edge Runtime; no explicit opt-in is needed there.

## When to Use Edge vs. Node.js Runtime (for Route Handlers)

| Feature / Requirement        | Use Edge Runtime (`runtime = 'edge'`) | Use Node.js Runtime (Default) |
| :--------------------------- | :------------------------------------ | :---------------------------- |
| **Middleware (`middleware.ts`)** | **Always**                            | N/A                           |
| **Need Lowest Latency**      | Yes (for simple, fast operations)     | No                            |
| **Need Native Node.js APIs** | No                                    | Yes (`fs`, `path`, etc.)      |
| **Heavy Dependencies**       | No (strict size limits)               | Yes (more lenient)            |
| **Direct DB Connection (TCP)** | No (use HTTP APIs)                    | Yes                           |
| **Long-Running Tasks**       | No (short execution limits)           | Yes                           |
| **CPU Intensive Tasks**      | No                                    | Yes                           |
| **Streaming Responses**      | Yes (well-supported)                  | Yes                           |
| **Simple API Proxies**       | Good fit                              | Also works                    |
| **Personalization/Geo IP**   | Good fit                              | Possible, but higher latency  |

## Best Practices

*   **Middleware**: Leverage `middleware.ts` for tasks that need to run on every request or specific subsets of requests *before* they hit your main application logic (auth checks, redirects, A/B testing flags). Keep middleware fast and lean.
*   **Choose Runtime Wisely**: For Route Handlers, carefully consider the trade-offs. Default to the Node.js runtime unless you have a specific reason (latency-sensitive simple API, geo-location needs) and can work within the Edge constraints.
*   **Check Dependencies**: Ensure any libraries used in Edge functions are compatible with the Edge Runtime (no Node.js dependencies). Bundle size is critical.
*   **Database Access**: Use Edge-compatible database clients (e.g., Neon Serverless Driver, PlanetScale Serverless Driver) or fetch data from your own API layer running in the Node.js runtime.
*   **Error Handling**: Implement robust error handling, as debugging Edge functions can sometimes be more challenging than Node.js functions.
*   **Testing**: Use tools or environments that can simulate the Edge Runtime constraints if possible, or be mindful of the differences during testing.

Using the Edge Runtime strategically for Middleware and specific Route Handlers can significantly improve the performance and responsiveness of parts of the Mikhail Ajaj Portfolio.
# Next.js Data Fetching Guidelines

Next.js App Router offers several ways to fetch data, leveraging Server Components, caching, and Server Actions for efficient and performant data handling. This guide outlines the recommended strategies for data fetching in the Mikhail Ajaj Portfolio project.

## Data Fetching Strategies

### 1. Server Components (Recommended for Initial Load)

-   **How**: Use `async/await` directly within Server Components (`page.tsx`, `layout.tsx`, or other components not marked `"use client"`).
-   **Where**: Fetch data needed for the initial render of a route segment.
-   **Caching**: Next.js automatically extends the native `fetch` API to provide request deduplication and caching. Data fetched using `fetch` in Server Components is cached by default.
    -   Control caching behavior using `fetch` options: `{ cache: 'force-cache' | 'no-store' }` or `{ next: { revalidate: number | false } }`.
    -   Data fetched using third-party libraries (like database clients or ORMs) is *not* automatically cached by Next.js; implement caching manually or use the library's caching features if available. Route Segment Caching might still apply.
-   **Pros**: Simple syntax, data available before rendering, reduces client-side waterfalls, secure access to backend resources.
-   **Cons**: Only runs on the server; not suitable for data fetching triggered by client-side interactions after the initial load.

```typescript
// app/users/[userId]/page.tsx (Server Component)
import { getUserProfile } from '@/lib/data/users';

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  // Direct async/await data fetching
  const user = await getUserProfile(params.userId); // Assumes getUserProfile fetches data

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### 2. Client Components (for Client-Side Needs)

-   **How**:
    *   **Route Handlers (`route.ts`)**: Create API endpoints within `app/api/...` and fetch from them using `fetch` (or libraries like `axios`) within Client Components (typically inside `useEffect` or event handlers).
    *   **Libraries (SWR, React Query)**: Use dedicated data fetching libraries within Client Components to handle fetching, caching, revalidation, and state management on the client side. Recommended for complex client-side data needs.
    *   **Server Actions (for Mutations)**: While primarily for mutations, Server Actions *can* return data, though less common for pure read operations triggered client-side compared to Route Handlers or libraries.
-   **Where**: Fetch data triggered by client-side interactions (e.g., fetching more data on button click, polling, real-time updates) or when using libraries like SWR/React Query.
-   **Pros**: Enables dynamic data fetching based on user interaction, integrates well with client-side state.
-   **Cons**: Can lead to client-side loading states and potential request waterfalls if not managed carefully. Requires separate API endpoints or specific libraries.

```typescript
// features/tasks/components/TaskDetailFetcher.tsx (Client Component)
'use client';
import React, { useState, useEffect } from 'react';
import useSWR from 'swr'; // Example using SWR

// Define a fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface TaskDetailFetcherProps {
  taskId: string;
}

export default function TaskDetailFetcher({ taskId }: TaskDetailFetcherProps) {
  const { data: task, error, isLoading } = useSWR(`/api/tasks/${taskId}`, fetcher);

  if (error) return <div>Failed to load task</div>;
  if (isLoading) return <div>Loading task details...</div>;
  if (!task) return null;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  );
}

// Corresponding Route Handler needed at app/api/tasks/[taskId]/route.ts
```

### 3. Server Actions (Primarily for Mutations)

-   **How**: Define functions with `"use server"` and call them from Client Components.
-   **Where**: Handle data modifications (create, update, delete) triggered by client interactions (e.g., form submissions).
-   **Pros**: Secure server-side execution, simplifies mutations without manual API endpoints, integrates with forms and revalidation.
-   **Cons**: Less conventional for pure data *reading* triggered client-side compared to Route Handlers or libraries like SWR/React Query.

(See [Server Actions Guidelines](./server-actions.md) for more details).

## Caching

Next.js employs multiple layers of caching:

1.  **Request Memoization**: Deduplicates `fetch` requests within a React component tree during a single render pass. (Applies only to `fetch`).
2.  **Data Cache**: Persistent cache for data fetched via `fetch` across requests. Opt-out with `cache: 'no-store'` or control duration with `next.revalidate`. Does *not* apply to data fetched via third-party libraries directly.
3.  **Full Route Cache**: (Default) Caches the rendered HTML and RSC payload for routes. Automatically invalidated when using dynamic rendering (`cookies()`, `headers()`, `searchParams`, `cache: 'no-store'`) or dynamic functions. Can be manually revalidated.
4.  **Router Cache**: Client-side cache storing the RSC payload for visited routes, enabling instant back/forward navigation and prefetching.

## Revalidation

Updating cached data:

-   **Time-based**: Set `revalidate` time (in seconds) in `fetch` options or segment config (`export const revalidate = 60;`). Data is considered fresh for the specified duration.
-   **On-demand**:
    *   `revalidatePath(path)`: Revalidate cache for a specific route path. Use inside Server Actions or Route Handlers.
    *   `revalidateTag(tag)`: Revalidate cache entries associated with a specific tag (assigned during `fetch`). Use inside Server Actions or Route Handlers.

```typescript
// Example using revalidateTag in a Server Action
'use server';
import { revalidateTag } from 'next/cache';
import { db } from '@/lib/db';

export async function addTask(formData: FormData) {
  const title = formData.get('title') as string;
  await db.task.create({ data: { title } });
  revalidateTag('tasks'); // Revalidate data tagged with 'tasks'
}

// Example fetching data with a tag
async function getTasks() {
  const res = await fetch('/api/tasks', { next: { tags: ['tasks'] } });
  return res.json();
}
```

## Choosing the Right Strategy

-   **Initial page load data**: Fetch in **Server Components**.
-   **Client interaction data fetching (reads)**: Use **Route Handlers + client-side fetching (fetch/SWR/React Query)**.
-   **Client interaction data fetching (mutations)**: Use **Server Actions**.
-   **Leverage Caching**: Understand Next.js caching defaults and configure revalidation as needed for data freshness. Use tags for granular on-demand revalidation.

By selecting the appropriate data fetching strategy based on the context (server vs. client, read vs. write), you can build efficient and responsive applications.
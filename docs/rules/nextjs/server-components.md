# Next.js Server Components Guidelines

Next.js App Router introduces React Server Components (RSCs) by default. Understanding how and when to use them is key to leveraging Next.js effectively for performance and data fetching in the Mikhail Ajaj Portfolio project.

## What are Server Components?

-   **Run on the Server**: Execute exclusively on the server during the request/response lifecycle or at build time. Their code is *never* sent to the client browser.
-   **Default in App Router**: Components inside the `app/` directory are Server Components by default unless explicitly marked with `"use client"`.
-   **Direct Data Fetching**: Can directly access server-side resources (databases, file systems, external APIs using server-side credentials) without needing separate API routes. Can use `async/await` directly in the component function.
-   **No Interactivity/State**: Cannot use React hooks like `useState`, `useEffect`, `useReducer`, or browser APIs (like `window`, `localStorage`). They cannot have event listeners (`onClick`, `onChange`, etc.).
-   **Reduced Client Bundle Size**: Since their code doesn't ship to the browser, they help reduce the amount of JavaScript downloaded and parsed by the client.
-   **Security**: Sensitive data fetching logic and API keys remain on the server.

## When to Use Server Components

Use Server Components for:

1.  **Data Fetching**: Directly fetching data needed for the initial render of a page or section.
2.  **Accessing Backend Resources**: Interacting directly with databases, file systems, or server-side libraries.
3.  **Keeping Sensitive Logic on Server**: Preventing exposure of API keys or complex business logic to the client.
4.  **Reducing Client-Side JavaScript**: For components that are purely presentational after initial render and don't require interactivity or state. Large libraries that are only needed for rendering can be kept on the server.
5.  **Initial HTML Rendering**: Generating the static HTML structure of a page quickly.

## Best Practices

*   **Default Choice**: Start with Server Components for new components within the `app/` directory. Only opt into Client Components (`"use client"`) when necessary.
*   **Data Fetching**:
    *   Use `async/await` directly within the component function for data fetching.
    *   Leverage Next.js's extended `fetch` API for automatic request deduplication and caching.
    *   Consider using Server Actions for mutations triggered by client interactions.
*   **Keep them Focused**: Server Components should primarily focus on data fetching and rendering the initial structure. Delegate interactivity and client-side state management to Client Components.
*   **Composition**: Server Components can import and render Client Components. This is a common pattern: a Server Component fetches data and passes it down as props to interactive Client Components.
    *   **Important**: Client Components *cannot* directly import Server Components (because Server Component code doesn't exist on the client). You can pass Server Components as `children` or props *to* Client Components.
*   **Serialization**: Data passed as props from a Server Component to a Client Component must be serializable (plain objects, arrays, primitives - no functions, Dates, Maps, Sets, etc., without explicit handling). Next.js handles basic serialization.
*   **Avoid Browser APIs**: Remember you cannot access `window`, `document`, `localStorage`, etc., within Server Components. Pass necessary data derived from these (if applicable) from Client Components further up the tree if needed, or handle logic requiring them in Client Components.

## Example

```typescript
// app/projects/[id]/page.tsx (Server Component by default)
import { getProjectData } from '@/lib/data/projects'; // Server-side data fetching function
import ProjectDetailsClient from '@/features/projects/components/ProjectDetailsClient'; // Client Component
import TaskList from '@/features/projects/components/TaskList'; // Could be another Server Component

interface PageProps {
  params: { id: string };
}

// Can use async/await directly
export default async function ProjectPage({ params }: PageProps) {
  const projectId = params.id;

  // Direct data fetching on the server
  const project = await getProjectData(projectId);
  // const tasks = await getTasksForProject(projectId); // Another server fetch

  if (!project) {
    return <div>Project not found.</div>;
  }

  // Render structure and pass data to Client Components
  return (
    <div>
      <h1>{project.name} (Server Rendered)</h1>

      {/* Pass serializable data as props to Client Component */}
      <ProjectDetailsClient project={project} />

      {/* Render another Server Component (or pass data to a Client one) */}
      {/* <TaskList projectId={projectId} /> */}
    </div>
  );
}

// --- Client Component ---
// features/projects/components/ProjectDetailsClient.tsx
'use client'; // Mark as a Client Component

import React, { useState } from 'react';
import type { Project } from '@/lib/types/project-types'; // Import type

interface ProjectDetailsClientProps {
  project: Project; // Receives serializable data
}

export default function ProjectDetailsClient({ project }: ProjectDetailsClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    // Client-side logic...
  };

  return (
    <div>
      <p>Description: {project.description}</p>
      <p>Status: {project.status}</p>
      <button onClick={handleEditClick}>
        {isEditing ? 'Cancel Edit' : 'Edit Project (Client Interaction)'}
      </button>
      {/* More client-side interactive elements */}
    </div>
  );
}
```

By defaulting to Server Components and strategically using Client Components for interactivity, you can build performant and efficient applications with Next.js App Router.

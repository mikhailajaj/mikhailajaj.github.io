# Next.js Client Components Guidelines

Client Components enable interactivity and the use of browser-specific APIs within the Next.js App Router. They are opted into using the `"use client"` directive and are essential for building dynamic user interfaces in the Mikhail Ajaj Portfolio project.

## What are Client Components?

-   **Opt-In**: Marked with the `"use client"` directive at the *very top* of the file, before any imports.
-   **Render on Client (and Server)**: Client Components are pre-rendered on the server (for the initial HTML) and then "hydrated" and rendered interactively in the client browser. Their JavaScript code *is* sent to the browser.
-   **Interactivity & State**: Can use React hooks like `useState`, `useEffect`, `useReducer`, `useContext`, etc.
-   **Event Listeners**: Can use event listeners like `onClick`, `onChange`, `onSubmit`, etc.
-   **Browser APIs**: Can access browser-only APIs like `window`, `document`, `localStorage`, `navigator`, etc. (typically within `useEffect` to ensure they run client-side).
-   **Lifecycle**: Participate in the standard React client-side component lifecycle.

## When to Use Client Components

Use Client Components when you need:

1.  **Interactivity**: Handling user events (clicks, input changes, form submissions).
2.  **Local State & Effects**: Using `useState`, `useEffect`, `useReducer` for managing component state or performing side effects tied to the component's lifecycle or state changes.
3.  **Browser APIs**: Accessing `window`, `document`, `localStorage`, geolocation, etc.
4.  **Custom Hooks**: Using custom hooks that rely on state, effects, or browser APIs.
5.  **Class Components**: If you need to use React class components (though functional components with hooks are preferred).
6.  **Context Consumers**: Components that need to consume React Context (Context providers can often be Server Components if the value is static, but consumers needing dynamic updates usually need to be Client Components).

## Best Practices

*   **Use `"use client"` Sparingly**: Only add the directive when necessary for interactivity, state, effects, or browser APIs. Keep components as Server Components by default to minimize client-side JavaScript.
*   **Push Client Components Down the Tree**: Structure your application so that Client Components are leaves in the component tree where possible. Let Server Components handle data fetching and layout, passing data down to smaller, interactive Client Components.
    *   *Example*: A Server Component page fetches user data and renders a `<UserProfile>` Client Component, passing the user data as props. The `<UserProfile>` handles the "Edit Profile" button click and state.
*   **`"use client"` Boundary**: The `"use client"` directive defines a boundary. All components imported *into* a Client Component (that are not already marked `"use client"`) become part of the client bundle as well. Server Components cannot be directly imported into Client Components.
*   **Passing Server Components as Props/Children**: You *can* pass Server Components as `children` or props to Client Components. This allows you to "interleave" Server and Client components, keeping server-rendered content within interactive client wrappers.
    ```typescript
    // Server Component (parent)
    import ClientWrapper from './ClientWrapper';
    import ServerContent from './ServerContent'; // Another Server Component

    export default function ServerPage() {
      return (
        <ClientWrapper>
          {/* ServerContent is passed as children to ClientWrapper */}
          <ServerContent />
        </ClientWrapper>
      );
    }

    // Client Component (wrapper)
    'use client';
    import React, { useState } from 'react';

    export default function ClientWrapper({ children }: { children: React.ReactNode }) {
      const [count, setCount] = useState(0);
      return (
        <div>
          <button onClick={() => setCount(c => c + 1)}>Increment {count}</button>
          {/* Renders the Server Component passed as children */}
          {children}
        </div>
      );
    }
    ```
*   **Data Fetching**: Client Components *should not* directly fetch data using server-side credentials or methods.
    *   Receive data via props from parent Server Components.
    *   Fetch data from client-side Route Handlers (`app/api/.../route.ts`) using `fetch`.
    *   Use libraries like SWR or React Query for client-side data fetching, caching, and synchronization.
    *   Use Server Actions for mutations initiated from the client.
*   **Context**: Context providers can often be rendered within Server Components if the context value is static or derived purely from server data. However, components *consuming* the context often need to be Client Components if they rely on the context value for state or effects. Place providers as deep in the tree as possible, potentially wrapping Client Components that need the context.

## Example (`"use client"` directive)

```typescript
// features/projects/components/ProjectEditor.tsx
'use client'; // Must be the very first line

import React, { useState, useEffect } from 'react';
import type { Project } from '@/lib/types/project-types';
import { Button } from '@/components/ui/button';
import { updateProjectAction } from '@/features/projects/actions'; // Server Action

interface ProjectEditorProps {
  project: Project;
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [isSaving, setIsSaving] = useState(false);

  // Example of using useEffect in a Client Component
  useEffect(() => {
    // Example: Log to browser console when project changes
    console.log(`Editing project: ${project.id}`);
    // Ensure state resets if the project prop changes
    setName(project.name);
    setDescription(project.description);
  }, [project]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Call a Server Action
      await updateProjectAction(project.id, { name, description });
      alert('Project saved!');
    } catch (error) {
      alert('Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isSaving}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSaving}
      />
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
```

By understanding the role of Client Components and using them judiciously, you can build interactive and feature-rich user experiences while optimizing the performance benefits offered by Server Components in Next.js.
# Next.js Server Actions Guidelines

Server Actions are a feature in Next.js App Router that allows client-side components to invoke functions that execute securely on the server, without needing to manually create API endpoints (Route Handlers). They are ideal for handling data mutations like form submissions.

## What are Server Actions?

-   **Server-Side Execution**: Functions marked with the `"use server"` directive run exclusively on the server.
-   **RPC Mechanism**: Provide a Remote Procedure Call (RPC) mechanism. Client Components can import and call these functions as if they were regular JavaScript functions, but the execution happens on the server.
-   **Security**: Code within Server Actions is never sent to the client browser, keeping sensitive logic and credentials secure.
-   **Integrated with Forms**: Designed to work seamlessly with HTML `<form>` elements for progressive enhancement. Forms can submit directly to Server Actions.
-   **Data Mutations**: Primarily used for actions that modify data (create, update, delete).
-   **Revalidation**: Can be used with Next.js data caching mechanisms (`revalidatePath`, `revalidateTag`) to update cached data after a mutation.

## Defining Server Actions

Server Actions can be defined in two ways:

1.  **Inside Server Components**: Define an async function directly within a Server Component and add the `"use server"` directive *inside* the function body.

    ```typescript
    // app/projects/page.tsx (Server Component)
    import { createProject } from '@/lib/data/projects'; // Server-side DB function

    export default function ProjectsPage() {
      // Define Server Action within the Server Component
      async function handleCreateProject(formData: FormData) {
        'use server'; // Directive inside the function

        const projectName = formData.get('projectName') as string;
        if (!projectName) return; // Basic validation

        try {
          await createProject({ name: projectName });
          // Optionally revalidate data here
          // revalidatePath('/projects');
          console.log('Project created on server');
        } catch (error) {
          console.error('Failed to create project:', error);
          // Handle error appropriately
        }
      }

      return (
        <div>
          <h1>Create New Project</h1>
          {/* Pass the Server Action to the form's action prop */}
          <form action={handleCreateProject}>
            <input type="text" name="projectName" required />
            <button type="submit">Create</button>
          </form>
        </div>
      );
    }
    ```

2.  **In Separate Files (Recommended for Reusability)**: Define an async function in a separate file (e.g., `actions.ts`) and place the `"use server"` directive at the *top* of the file. This makes the action reusable across multiple components.

    ```typescript
    // features/projects/actions.ts
    'use server'; // Directive at the top of the file

    import { revalidatePath } from 'next/cache';
    import { db } from '@/lib/db'; // Example DB client

    export async function updateProjectName(projectId: string, newName: string) {
      if (!newName) {
        throw new Error('Project name cannot be empty.');
      }
      try {
        await db.project.update({
          where: { id: projectId },
          data: { name: newName },
        });
        revalidatePath(`/projects/${projectId}`); // Revalidate specific path
        revalidatePath('/projects'); // Revalidate list page
        return { success: true, message: 'Project name updated.' };
      } catch (error) {
        console.error('Failed to update project name:', error);
        return { success: false, message: 'Database error.' };
      }
    }

    // features/projects/components/EditProjectForm.tsx (Client Component)
    'use client';
    import React, { useState, useTransition } from 'react';
    import { updateProjectName } from '../actions'; // Import the Server Action

    interface EditProjectFormProps {
      projectId: string;
      initialName: string;
    }

    export default function EditProjectForm({ projectId, initialName }: EditProjectFormProps) {
      const [name, setName] = useState(initialName);
      const [isPending, startTransition] = useTransition(); // For loading state without blocking UI

      const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await updateProjectName(projectId, name);
          if (result.success) {
            alert(result.message);
          } else {
            alert(`Error: ${result.message}`);
          }
        });
      };

      return (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Update Name'}
          </button>
        </form>
      );
    }
    ```

## Best Practices

*   **Use for Mutations**: Server Actions are best suited for operations that change data. Use direct data fetching in Server Components or Route Handlers/client-side fetching for read operations.
*   **Separate Files for Reusability**: Define reusable actions in dedicated files (`actions.ts`) within relevant feature directories.
*   **Progressive Enhancement**: When using Server Actions with `<form action={...}>`, the form will still work even if JavaScript is disabled (though client-side validation/feedback will be lost).
*   **Loading States**: Use the `useTransition` hook in Client Components when calling Server Actions to manage pending/loading states without blocking the UI thread. The `useFormStatus` hook can be used within a `<form>` to get status when submitting directly via the `action` prop.
*   **Error Handling**: Implement robust error handling within your Server Action functions. Return meaningful error messages or objects to the client so feedback can be provided to the user.
*   **Validation**: Perform validation on the server within the Server Action, even if you also have client-side validation. Never trust client-side input alone. Libraries like Zod can be used server-side.
*   **Security**: Server Actions execute in a server environment. Ensure proper authorization checks are performed within the action to verify the user has permission to perform the operation.
*   **Revalidation**: Use `revalidatePath` or `revalidateTag` after successful mutations to ensure cached data is updated and the UI reflects the changes.
*   **File Scope**: The `"use server"` directive applies to the entire file if placed at the top, or just the specific function if placed inside it. Be mindful of this scope.

Server Actions provide a powerful and streamlined way to handle data mutations from the client in Next.js applications, simplifying the process compared to manually creating API endpoints for every mutation.
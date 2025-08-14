# Next.js Development Rules

This document outlines the rules and guidelines for Next.js development in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Core Principles](#core-principles)
2. [App Router Structure](#app-router-structure)
3. [Server Components](#server-components)
4. [Client Components](#client-components)
5. [Data Fetching](#data-fetching)
6. [Server Actions](#server-actions)
7. [Routing and Navigation](#routing-and-navigation)
8. [Layouts and Templates](#layouts-and-templates)
9. [Metadata and SEO](#metadata-and-seo)
10. [Error Handling](#error-handling)
11. [Performance Optimization](#performance-optimization)
12. [Deployment Considerations](#deployment-considerations)
13. [Examples](#examples)

## Core Principles

- **Server-First Approach**: Use Server Components by default for improved performance
- **Progressive Enhancement**: Build with progressive enhancement in mind
- **Edge Compatibility**: Ensure compatibility with Edge Runtime for Cloudflare deployment
- **Type Safety**: Use TypeScript throughout the application
- **Accessibility**: Ensure all pages and components are accessible
- **Performance**: Optimize for Core Web Vitals and user experience

## App Router Structure

### Route Organization

- Use the App Router for all new routes
- Organize routes based on URL structure
- Use route groups (parentheses) to organize routes without affecting URL paths
- Use private folders (underscore prefix) for internal components and utilities

```
app/
├── (auth)/                # Route group for authentication
│   ├── signin/            # /signin route
│   ├── signup/            # /signup route
│   ├── reset-password/    # /reset-password route
│   └── layout.tsx         # Shared layout for auth routes
├── (marketing)/           # Route group for marketing pages
│   ├── about/             # /about route
│   ├── services/          # /services route
│   ├── contact/           # /contact route
│   └── layout.tsx         # Shared layout for marketing pages
├── (webapp)/              # Route group for web application
│   ├── dashboard/         # /dashboard route
│   ├── projects/          # /projects route
│   │   ├── [projectId]/   # /projects/[projectId] dynamic route
│   │   └── create/        # /projects/create route
│   └── layout.tsx         # Shared layout for webapp routes
├── api/                   # API routes
│   └── [...]              # API endpoints
├── _components/           # Private components for app directory
├── _lib/                  # Private utilities for app directory
├── layout.tsx             # Root layout
└── page.tsx               # Home page
```

### Special Files

- **page.tsx**: Defines the UI for a route segment
- **layout.tsx**: Defines shared UI for a segment and its children
- **loading.tsx**: Creates a loading UI for a segment
- **error.tsx**: Creates an error UI for a segment
- **not-found.tsx**: Creates a UI for 404 errors
- **route.ts**: Defines API endpoints for a route
- **template.tsx**: Similar to layout but creates a new instance on navigation

## Server Components

Server Components are the default in Next.js App Router. They offer several advantages:

- Zero JavaScript sent to the client
- Direct database access
- Keep sensitive information on the server
- Improved initial page load and SEO

### Server Component Rules

- Use Server Components by default for all components
- Do not use React hooks (useState, useEffect, etc.) in Server Components
- Do not use browser-only APIs in Server Components
- Use async/await for data fetching directly in Server Components
- Keep sensitive logic and data fetching in Server Components

Example Server Component:

```tsx
// app/(webapp)/projects/page.tsx
import { ProjectList } from '@/features/projects/components/ProjectList';
import { getProjects } from '@/features/projects/server/db/project-repository';

export default async function ProjectsPage() {
  // Data fetching directly in the Server Component
  const projects = await getProjects();
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ProjectList initialProjects={projects} />
    </div>
  );
}
```

## Client Components

Client Components are used when you need interactivity, browser APIs, or React hooks.

### Client Component Rules

- Add the `'use client'` directive at the top of the file
- Keep Client Components as small and focused as possible
- Use Client Components only when you need interactivity or browser APIs
- Avoid fetching data in Client Components when possible
- Pass data from Server Components to Client Components as props

Example Client Component:

```tsx
// features/projects/components/ProjectCard.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onStatusChange?: (id: string, status: string) => void;
}

export function ProjectCard({ project, onStatusChange }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-bold">{project.title}</h3>
      
      {isExpanded && (
        <p className="mt-2 text-gray-600">{project.description}</p>
      )}
      
      <div className="mt-4 flex justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
        
        {onStatusChange && (
          <Button 
            onClick={() => onStatusChange(project.id, 'completed')}
            disabled={project.status === 'completed'}
          >
            Mark as Completed
          </Button>
        )}
      </div>
    </div>
  );
}
```

## Data Fetching

### Server-Side Data Fetching

- Fetch data directly in Server Components using async/await
- Use the React cache() function for request memoization
- Implement proper error handling for data fetching
- Use revalidation strategies appropriate for the data

Example:

```tsx
// features/projects/server/db/project-repository.ts
import { cache } from 'react';
import { Project } from '../../types';

export const getProjects = cache(async () => {
  try {
    const response = await fetch('https://api.example.com/projects', {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return response.json() as Promise<Project[]>;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
});
```

### Client-Side Data Fetching

- Use SWR or React Query for client-side data fetching
- Implement proper loading and error states
- Use optimistic updates for better user experience
- Implement proper cache invalidation

Example:

```tsx
// features/projects/hooks/use-projects.ts
'use client';

import useSWR from 'swr';
import { Project } from '../types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    '/api/projects',
    fetcher,
    { revalidateOnFocus: false }
  );
  
  return {
    projects: data || [],
    isLoading,
    isError: !!error,
    mutate
  };
}
```

## Server Actions

Server Actions are a new feature in Next.js that allow you to run server-side code directly from components.

### Server Action Rules

- Create Server Actions in separate files with clear naming
- Implement proper validation for all inputs
- Return structured responses with success/error information
- Handle errors gracefully and provide meaningful error messages
- Use TypeScript for type safety

Example:

```tsx
// features/projects/server/actions/project-actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createProject, updateProject } from '../db/project-repository';

const ProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  clientId: z.string().uuid(),
  dueDate: z.string().datetime(),
});

export async function createProjectAction(formData: FormData) {
  try {
    // Extract and validate data
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      clientId: formData.get('clientId'),
      dueDate: formData.get('dueDate'),
    };
    
    const validationResult = ProjectSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
      };
    }
    
    // Create project in database
    const project = await createProject(validationResult.data);
    
    // Revalidate the projects page
    revalidatePath('/projects');
    
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    return {
      success: false,
      errors: { _form: ['Failed to create project. Please try again.'] },
    };
  }
}
```

## Routing and Navigation

### Link Component

- Use the Next.js Link component for client-side navigation
- Avoid using regular `<a>` tags for internal navigation
- Prefetch important links for faster navigation
- Use dynamic routes for resource-based URLs

Example:

```tsx
// features/projects/components/ProjectList.tsx
import Link from 'next/link';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <Link 
          key={project.id} 
          href={`/projects/${project.id}`}
          className="block hover:shadow-md transition-shadow"
        >
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-bold">{project.title}</h3>
            <p className="mt-2 text-gray-600 line-clamp-2">{project.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

### Navigation Hooks

- Use the `useRouter` hook from `next/navigation` for programmatic navigation
- Use the `usePathname` and `useSearchParams` hooks for accessing route information
- Implement proper loading states during navigation

Example:

```tsx
// features/projects/components/CreateProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { createProjectAction } from '../server/actions/project-actions';

export function CreateProjectForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    
    try {
      const result = await createProjectAction(formData);
      
      if (result.success) {
        // Navigate to the new project
        router.push(`/projects/${result.data.id}`);
      } else {
        // Handle errors
        console.error('Form errors:', result.errors);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  }
  
  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
}
```

## Layouts and Templates

### Layout Rules

- Use layouts for shared UI elements across routes
- Keep layouts simple and focused on structure
- Implement nested layouts for complex UI hierarchies
- Use route groups to apply different layouts to different sections

Example:

```tsx
// app/(webapp)/layout.tsx
import { DashboardSidebar } from '@/features/dashboard/components/DashboardSidebar';
import { TopNavbar } from '@/features/dashboard/components/TopNavbar';

export default function WebAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <div className="flex-1 flex">
        <DashboardSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

### Template Rules

- Use templates when you need a new instance of the UI on each navigation
- Use templates for pages with transitions or animations between routes
- Keep templates focused on the specific UI needs

Example:

```tsx
// app/(webapp)/projects/[projectId]/template.tsx
import { ProjectHeader } from '@/features/projects/components/ProjectHeader';

export default function ProjectTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <ProjectHeader />
      <div className="mt-6">{children}</div>
    </div>
  );
}
```

## Metadata and SEO

### Metadata Rules

- Define metadata for all pages
- Use dynamic metadata for data-dependent pages
- Implement Open Graph and Twitter card metadata
- Use the Metadata API for type-safe metadata

Example:

```tsx
// app/(marketing)/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Mikhail Ajaj Portfolio',
  description: 'Learn about Mikhail Ajaj Portfolio, the leading construction management platform.',
  openGraph: {
    title: 'About Mikhail Ajaj Portfolio',
    description: 'Learn about Mikhail Ajaj Portfolio, the leading construction management platform.',
    images: ['/images/about-og.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-6">About Mikhail Ajaj Portfolio</h1>
      {/* Page content */}
    </div>
  );
}
```

### Dynamic Metadata

```tsx
// app/(webapp)/projects/[projectId]/page.tsx
import { Metadata } from 'next';
import { getProject } from '@/features/projects/server/db/project-repository';

export async function generateMetadata({ 
  params 
}: { 
  params: { projectId: string } 
}): Promise<Metadata> {
  const project = await getProject(params.projectId);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }
  
  return {
    title: `${project.title} | Mikhail Ajaj Portfolio`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({ 
  params 
}: { 
  params: { projectId: string } 
}) {
  const project = await getProject(params.projectId);
  
  if (!project) {
    return <div>Project not found</div>;
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold">{project.title}</h1>
      {/* Project details */}
    </div>
  );
}
```

## Error Handling

### Error Boundaries

- Implement error.tsx files for route error handling
- Create custom error components for specific error types
- Implement global error handling for the application
- Log errors to monitoring services

Example:

```tsx
// app/(webapp)/projects/[projectId]/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Project error:', error);
  }, [error]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-gray-600 mb-6">
        {error.message || 'An error occurred while loading the project.'}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}
```

### Not Found Handling

- Implement not-found.tsx files for 404 handling
- Create custom not found pages for different sections
- Use the notFound() function to trigger 404 pages

Example:

```tsx
// app/(webapp)/projects/[projectId]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
      <p className="text-gray-600 mb-6">
        The project you're looking for doesn't exist or has been removed.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/projects">View All Projects</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
```

## Performance Optimization

### Partial Prerendering (PPR)

- Use Partial Prerendering for pages with both static and dynamic content
- Implement streaming for dynamic content
- Use the `<Suspense>` component to wrap dynamic content

Example:

```tsx
// app/(webapp)/dashboard/page.tsx
import { Suspense } from 'react';
import { DashboardStats } from '@/features/dashboard/components/DashboardStats';
import { RecentProjects } from '@/features/projects/components/RecentProjects';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Static content */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        {/* Static content here */}
      </div>
      
      {/* Dynamic content with Suspense */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardStats />
      </Suspense>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <Suspense fallback={<p>Loading projects...</p>}>
          <RecentProjects />
        </Suspense>
      </div>
    </div>
  );
}
```

### Image Optimization

- Use the Next.js Image component for all images
- Implement proper sizing and responsive images
- Use the `priority` prop for above-the-fold images
- Implement lazy loading for below-the-fold images

Example:

```tsx
// features/projects/components/ProjectImage.tsx
import Image from 'next/image';

interface ProjectImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export function ProjectImage({ src, alt, priority = false }: ProjectImageProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
}
```

### Route Optimization

- Implement route prefetching for common navigation paths
- Use parallel routes for complex layouts
- Implement intercepting routes for modal patterns
- Use route groups to organize routes without affecting URL structure

## Deployment Considerations

### Edge Runtime

- Use the Edge Runtime for improved performance and global distribution
- Ensure compatibility with Edge Runtime limitations
- Implement proper error handling for Edge functions
- Use Edge-compatible data fetching patterns

Example:

```tsx
// app/api/edge-example/route.ts
export const runtime = 'edge';

export async function GET() {
  try {
    const data = { message: 'Hello from the Edge!' };
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Cloudflare Integration

- Implement Cloudflare D1 for database access
- Use Cloudflare KV for key-value storage
- Implement Cloudflare R2 for file storage
- Ensure compatibility with Cloudflare Workers

Example:

```tsx
// features/projects/server/db/cloudflare-project-repository.ts
import { D1Database } from '@cloudflare/workers-types';
import { Project } from '../../types';

export async function getProjects(db: D1Database): Promise<Project[]> {
  try {
    const result = await db
      .prepare('SELECT * FROM projects ORDER BY created_at DESC')
      .all();
    
    return result.results as Project[];
  } catch (error) {
    console.error('Error fetching projects from D1:', error);
    return [];
  }
}
```

## Examples

### Complete Page Example

```tsx
// app/(webapp)/projects/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { ProjectListSkeleton } from '@/features/projects/components/ProjectListSkeleton';
import { getProjects } from '@/features/projects/server/db/project-repository';

export const metadata: Metadata = {
  title: 'Projects | Mikhail Ajaj Portfolio',
  description: 'Manage your construction projects with Mikhail Ajaj Portfolio.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  // Extract filter from search params
  const status = searchParams.status;
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/projects/create">Create Project</Link>
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-2">
          <Link
            href="/projects"
            className={`px-4 py-2 rounded-lg ${!status ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            All
          </Link>
          <Link
            href="/projects?status=active"
            className={`px-4 py-2 rounded-lg ${status === 'active' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Active
          </Link>
          <Link
            href="/projects?status=completed"
            className={`px-4 py-2 rounded-lg ${status === 'completed' ? 'bg-primary text-white' : 'bg-gray-100'}`}
          >
            Completed
          </Link>
        </div>
      </div>
      
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectListWrapper status={status} />
      </Suspense>
    </div>
  );
}

async function ProjectListWrapper({ status }: { status?: string }) {
  // Fetch projects with optional status filter
  const projects = await getProjects(status);
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No projects found</h2>
        <p className="text-gray-600 mb-6">
          {status
            ? `No ${status} projects found. Try a different filter or create a new project.`
            : 'No projects found. Create your first project to get started.'}
        </p>
        <Button asChild>
          <Link href="/projects/create">Create Project</Link>
        </Button>
      </div>
    );
  }
  
  return <ProjectList projects={projects} />;
}
```

### Server Action with Form Example

```tsx
// features/projects/components/CreateProjectForm.tsx
'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { createProjectAction } from '../server/actions/project-actions';

const initialState = {
  success: false,
  errors: {},
};

export function CreateProjectForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(createProjectAction, initialState);
  
  // If the form was submitted successfully, redirect to the project
  if (state.success && state.data) {
    router.push(`/projects/${state.data.id}`);
  }
  
  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Project Title
        </label>
        <Input
          id="title"
          name="title"
          required
          aria-describedby="title-error"
        />
        {state.errors?.title && (
          <p id="title-error" className="text-sm text-red-600 mt-1">
            {state.errors.title[0]}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          required
          aria-describedby="description-error"
        />
        {state.errors?.description && (
          <p id="description-error" className="text-sm text-red-600 mt-1">
            {state.errors.description[0]}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="clientId" className="block text-sm font-medium mb-1">
          Client
        </label>
        <select
          id="clientId"
          name="clientId"
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
          aria-describedby="clientId-error"
        >
          <option value="">Select a client</option>
          {/* Client options would be populated here */}
        </select>
        {state.errors?.clientId && (
          <p id="clientId-error" className="text-sm text-red-600 mt-1">
            {state.errors.clientId[0]}
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
          Due Date
        </label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          required
          aria-describedby="dueDate-error"
        />
        {state.errors?.dueDate && (
          <p id="dueDate-error" className="text-sm text-red-600 mt-1">
            {state.errors.dueDate[0]}
          </p>
        )}
      </div>
      
      {state.errors?._form && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">
            {state.errors._form[0]}
          </p>
        </div>
      )}
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit">Create Project</Button>
      </div>
    </form>
  );
}
```

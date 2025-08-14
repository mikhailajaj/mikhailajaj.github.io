# React Development Rules

This document outlines the rules and guidelines for React development in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Structure](#component-structure)
3. [Props and PropTypes](#props-and-proptypes)
4. [State Management](#state-management)
5. [Hooks Usage](#hooks-usage)
6. [Performance Optimization](#performance-optimization)
7. [Component Composition](#component-composition)
8. [Error Handling](#error-handling)
9. [Examples](#examples)

## Core Principles

- **Component-Based Architecture**: Build UIs from small, reusable components
- **Unidirectional Data Flow**: Data flows down, events flow up
- **Separation of Concerns**: Separate UI, state, and business logic
- **Declarative Programming**: Describe what the UI should look like, not how to update it
- **Composition Over Inheritance**: Use composition to reuse code between components

## Component Structure

### Component Types

- **Server Components**: Use Server Components by default for data fetching and rendering
- **Client Components**: Use Client Components only when needed for interactivity
- **UI Components**: Presentational components that render UI based on props
- **Container Components**: Components that manage state and pass data to UI components
- **Layout Components**: Components that define the structure and layout of pages
- **Higher-Order Components**: Functions that take a component and return an enhanced component

### Component File Structure

Each component file should follow this structure:

1. Imports
2. Type definitions
3. Helper functions (if small and component-specific)
4. Component definition
5. Exports

Example:

```tsx
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/utils/date-utils';

// 2. Type definitions
interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  onStatusChange?: (id: string, status: string) => void;
}

// 3. Helper functions
function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'gray';
    case 'in-progress': return 'blue';
    case 'completed': return 'green';
    default: return 'gray';
  }
}

// 4. Component definition
export function ProjectCard({
  id,
  title,
  description,
  dueDate,
  status,
  onStatusChange,
}: ProjectCardProps) {
  // Component implementation
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Due: {formatDate(dueDate)}
        </span>
        <span 
          className={`px-2 py-1 rounded-full text-xs bg-${getStatusColor(status)}-100 text-${getStatusColor(status)}-800`}
        >
          {status}
        </span>
      </div>
      {onStatusChange && (
        <div className="mt-4">
          <Button 
            onClick={() => onStatusChange(id, 'completed')}
            disabled={status === 'completed'}
          >
            Mark as Completed
          </Button>
        </div>
      )}
    </div>
  );
}

// 5. Exports
// Default export is already included in the component definition
```

## Props and PropTypes

### Prop Guidelines

- Use TypeScript interfaces to define prop types
- Make props as specific as possible (avoid `any` types)
- Use optional props with default values where appropriate
- Destructure props in function parameters
- Use consistent naming conventions for props
- Document complex props with JSDoc comments

### Prop Naming Conventions

- Use camelCase for prop names
- Use boolean props with "is", "has", or "should" prefixes
- Use consistent naming for event handlers: `onEventName`
- Use consistent naming for render props: `renderItemName`

Example:

```tsx
interface ButtonProps {
  /** The content to display inside the button */
  children: React.ReactNode;
  /** The variant style to apply to the button */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** The size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Whether the button is disabled */
  isDisabled?: boolean;
  /** Function called when the button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Optional class name to apply to the button */
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  onClick,
  className,
}: ButtonProps) {
  // Component implementation
}
```

## State Management

### Local State

- Use `useState` for simple component state
- Use `useReducer` for complex state logic
- Keep state as close as possible to where it's used
- Avoid redundant state that can be derived from props or other state
- Use state initialization functions for expensive computations

### Global State

- Use Zustand for global state management
- Create focused stores for specific domains
- Use selectors to access only the needed state
- Implement proper state persistence where needed
- Document store structure and usage

Example Zustand Store:

```tsx
// features/projects/store/projects-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ProjectStatus } from '../types';

interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateProjectStatus: (id: string, status: ProjectStatus) => Promise<void>;
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      isLoading: false,
      error: null,
      
      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/projects');
          if (!response.ok) throw new Error('Failed to fetch projects');
          const projects = await response.json();
          set({ projects, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      addProject: async (project) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
          });
          if (!response.ok) throw new Error('Failed to add project');
          const newProject = await response.json();
          set(state => ({ 
            projects: [...state.projects, newProject],
            isLoading: false 
          }));
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      // Other actions implementation...
    }),
    {
      name: 'projects-storage',
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);
```

## Hooks Usage

### Built-in Hooks

- Use `useState` for simple state management
- Use `useEffect` for side effects, with proper cleanup
- Use `useContext` for context consumption
- Use `useReducer` for complex state logic
- Use `useCallback` for memoized callbacks
- Use `useMemo` for expensive computations
- Use `useRef` for mutable references that don't trigger re-renders
- Use `useLayoutEffect` only when necessary for DOM measurements before paint

### Custom Hooks

- Create custom hooks for reusable logic
- Name custom hooks with `use` prefix
- Keep custom hooks focused on a single concern
- Document custom hooks with JSDoc comments
- Test custom hooks independently

Example Custom Hook:

```tsx
// features/projects/hooks/use-project-details.ts
import { useState, useEffect } from 'react';
import { Project } from '../types';

/**
 * Hook to fetch and manage project details
 * @param projectId The ID of the project to fetch
 * @returns Object containing project details, loading state, error state, and refresh function
 */
export function useProjectDetails(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchProject = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project details');
      const data = await response.json();
      setProject(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProject();
  }, [projectId]);
  
  const refreshProject = () => {
    fetchProject();
  };
  
  return { project, isLoading, error, refreshProject };
}
```

## Performance Optimization

### Memoization

- Use `React.memo` for components that render often with the same props
- Use `useCallback` for event handlers passed to memoized child components
- Use `useMemo` for expensive computations
- Avoid premature optimization - measure performance first

### Rendering Optimization

- Keep component state as local as possible
- Use proper keys for list items
- Avoid anonymous functions in render methods
- Use virtualization for long lists
- Implement code splitting with dynamic imports
- Use the React Profiler to identify performance bottlenecks

Example Memoization:

```tsx
import { useMemo, useCallback } from 'react';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onStatusChange: (id: string, status: string) => void;
}

// Memoize the component to prevent unnecessary re-renders
export const ProjectList = React.memo(function ProjectList({
  projects,
  onStatusChange,
}: ProjectListProps) {
  // Memoize the filtered projects to prevent recalculation on every render
  const activeProjects = useMemo(() => {
    return projects.filter(project => project.status !== 'completed');
  }, [projects]);
  
  // Memoize the event handler to maintain referential equality
  const handleStatusChange = useCallback((id: string, status: string) => {
    onStatusChange(id, status);
  }, [onStatusChange]);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activeProjects.map(project => (
        <ProjectCard
          key={project.id}
          {...project}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
});
```

## Component Composition

### Composition Patterns

- Use the children prop for simple composition
- Use render props for more flexible composition
- Use compound components for related component sets
- Use higher-order components for cross-cutting concerns
- Use the Context API for deep component trees

### Compound Components Example

```tsx
// features/projects/components/Tabs/Tabs.tsx
import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
}

function Tabs({ defaultTab, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
}

function TabList({ children }: TabListProps) {
  return (
    <div className="tabs-list">
      {children}
    </div>
  );
}

interface TabProps {
  id: string;
  children: React.ReactNode;
}

function Tab({ id, children }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  
  return (
    <button
      className={`tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  id: string;
  children: React.ReactNode;
}

function TabPanel({ id, children }: TabPanelProps) {
  const { activeTab } = useTabs();
  
  if (activeTab !== id) return null;
  
  return (
    <div className="tab-panel">
      {children}
    </div>
  );
}

// Attach sub-components to the main component
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export { Tabs };
```

Usage:

```tsx
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="tasks">Tasks</Tabs.Tab>
    <Tabs.Tab id="documents">Documents</Tabs.Tab>
  </Tabs.List>
  
  <Tabs.Panel id="overview">
    <ProjectOverview project={project} />
  </Tabs.Panel>
  
  <Tabs.Panel id="tasks">
    <ProjectTasks projectId={project.id} />
  </Tabs.Panel>
  
  <Tabs.Panel id="documents">
    <ProjectDocuments projectId={project.id} />
  </Tabs.Panel>
</Tabs>
```

## Error Handling

### Error Boundaries

- Use error boundaries to catch and handle errors in component trees
- Create custom error boundary components for different parts of the application
- Implement fallback UIs for error states
- Log errors to monitoring services

### Error States

- Implement proper error states in components
- Provide helpful error messages to users
- Implement retry mechanisms where appropriate
- Handle network errors gracefully

Example Error Boundary:

```tsx
// shared/components/error-boundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render the fallback UI if provided, otherwise render a default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary-fallback">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="retry-button"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Usage:

```tsx
<ErrorBoundary
  fallback={<ProjectErrorFallback />}
  onError={(error, errorInfo) => {
    // Log to monitoring service
    logError(error, errorInfo);
  }}
>
  <ProjectDetails projectId={projectId} />
</ErrorBoundary>
```

## Examples

### Complete Component Example

```tsx
// features/projects/components/ProjectDetails.tsx
import { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from '@/shared/components/error-boundary';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatDate } from '@/shared/utils/date-utils';
import { useProjectDetails } from '../hooks/use-project-details';
import { ProjectStatus } from '../types';
import { ProjectStatusBadge } from './_components/ProjectStatusBadge';
import { ProjectActions } from './_components/ProjectActions';

interface ProjectDetailsProps {
  projectId: string;
  onStatusChange?: (id: string, status: ProjectStatus) => void;
}

function ProjectDetailsFallback() {
  return (
    <div className="rounded-lg border p-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

function ProjectDetailsError({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="rounded-lg border p-6 bg-red-50">
      <h3 className="text-lg font-medium text-red-800">Error Loading Project</h3>
      <p className="text-sm text-red-600 mt-2">{error.message}</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={resetError}
      >
        Try Again
      </Button>
    </div>
  );
}

export function ProjectDetails({ projectId, onStatusChange }: ProjectDetailsProps) {
  const { project, isLoading, error, refreshProject } = useProjectDetails(projectId);
  
  const handleStatusChange = useCallback((status: ProjectStatus) => {
    if (onStatusChange && project) {
      onStatusChange(project.id, status);
    }
  }, [project, onStatusChange]);
  
  if (isLoading) {
    return <ProjectDetailsFallback />;
  }
  
  if (error) {
    return (
      <ProjectDetailsError 
        error={new Error(error)} 
        resetError={refreshProject} 
      />
    );
  }
  
  if (!project) {
    return (
      <div className="rounded-lg border p-6">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }
  
  return (
    <ErrorBoundary
      fallback={
        <ProjectDetailsError 
          error={new Error('An unexpected error occurred')} 
          resetError={refreshProject} 
        />
      }
    >
      <div className="rounded-lg border p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{project.title}</h2>
          <ProjectStatusBadge status={project.status} />
        </div>
        
        <p className="text-gray-700 mb-4">{project.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
            <p>{formatDate(project.startDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
            <p>{formatDate(project.dueDate)}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Client</h4>
            <p>{project.client.name}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Budget</h4>
            <p>${project.budget.toLocaleString()}</p>
          </div>
        </div>
        
        <ProjectActions 
          project={project}
          onStatusChange={handleStatusChange}
        />
      </div>
    </ErrorBoundary>
  );
}
```

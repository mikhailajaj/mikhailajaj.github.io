# React Design Patterns

This document outlines key React design patterns used in the Mikhail Ajaj Portfolio project to improve code quality, maintainability, and performance.

## Table of Contents

1. [Component Patterns](#component-patterns)
2. [State Management Patterns](#state-management-patterns)
3. [Composition Patterns](#composition-patterns)
4. [Hook Patterns](#hook-patterns)
5. [Performance Patterns](#performance-patterns)
6. [References](#references)

## Component Patterns

### Compound Pattern

The Compound Pattern allows you to create components that work together as a cohesive unit while maintaining flexibility. Components share state through context and expose subcomponents as properties.

#### When to use:
- Complex UI components with multiple related parts (dropdowns, tabs, accordions)
- Components that need to share state between subcomponents
- When you want a clean, declarative API for component composition

#### Example:

```tsx
// features/client/components/Tabs/index.tsx
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  
  return (
    <button 
      className={`tab ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== id) return null;
  
  return <div className="tab-panel">{children}</div>;
}

// Attach subcomponents to the main component
Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanel = TabPanel;

export { Tabs };
```

#### Usage:

```tsx
<Tabs defaultTab="tab1">
  <Tabs.TabList>
    <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
  </Tabs.TabList>
  <Tabs.TabPanel id="tab1">Content for Tab 1</Tabs.TabPanel>
  <Tabs.TabPanel id="tab2">Content for Tab 2</Tabs.TabPanel>
</Tabs>
```

### Container/Presentational Pattern

This pattern separates logic (container) from UI (presentational component).

#### When to use:
- When you want to separate data fetching and state management from rendering
- When you want to improve component reusability
- When you want to make testing easier

#### Example:

```tsx
// Presentational Component
function ProjectList({ projects, onEdit, onDelete }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}

// Container Component
function ProjectListContainer() {
  const { projects, isLoading, error } = useProjects();
  const { deleteProject } = useProjectActions();
  const router = useRouter();
  
  const handleEdit = (id) => {
    router.push(`/projects/${id}/edit`);
  };
  
  const handleDelete = async (id) => {
    await deleteProject(id);
  };
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <ProjectList 
      projects={projects} 
      onEdit={handleEdit} 
      onDelete={handleDelete} 
    />
  );
}
```

### Higher-Order Component (HOC) Pattern

A higher-order component is a function that takes a component and returns a new enhanced component.

#### When to use:
- When you want to reuse component logic across multiple components
- For cross-cutting concerns like authentication, logging, or data fetching
- When you want to enhance a component without modifying its implementation

#### Example:

```tsx
// features/auth/hocs/withAuth.tsx
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/shared/components/ui/loading-spinner';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options = { redirectTo: '/auth/signin' }
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    
    if (isLoading) {
      return <LoadingSpinner />;
    }
    
    if (!user) {
      router.push(options.redirectTo);
      return null;
    }
    
    return <Component {...props} user={user} />;
  };
}
```

#### Usage:

```tsx
const ProtectedDashboard = withAuth(Dashboard);

// Or with options
const AdminOnlyPage = withAuth(AdminPage, { redirectTo: '/auth/unauthorized' });
```

### Render Props Pattern

The Render Props pattern involves passing a function as a prop that returns a React element.

#### When to use:
- When you want to share code between components
- When you need more flexibility than HOCs
- When you want to avoid prop drilling

#### Example:

```tsx
// features/projects/components/ProjectFilter.tsx
import { useState } from 'react';

interface ProjectFilterProps {
  children: (filters: {
    status: string;
    search: string;
  }, setFilters: {
    setStatus: (status: string) => void;
    setSearch: (search: string) => void;
  }) => React.ReactNode;
}

export function ProjectFilter({ children }: ProjectFilterProps) {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  
  return (
    <>
      {children(
        { status, search },
        { setStatus, setSearch }
      )}
    </>
  );
}
```

#### Usage:

```tsx
<ProjectFilter>
  {(filters, setFilters) => (
    <>
      <div className="filter-controls">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters.setSearch(e.target.value)}
          placeholder="Search projects..."
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters.setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <ProjectList
        filters={filters}
      />
    </>
  )}
</ProjectFilter>
```

## State Management Patterns

### Zustand Store Pattern

Zustand provides a simple and flexible state management solution.

#### When to use:
- When you need global state management
- When you want a simpler alternative to Redux
- When you need to share state between components

#### Example:

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

#### Usage:

```tsx
function ProjectList() {
  const projects = useProjectsStore(state => state.projects);
  const fetchProjects = useProjectsStore(state => state.fetchProjects);
  const isLoading = useProjectsStore(state => state.isLoading);
  
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div className="grid gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Context + Reducer Pattern

This pattern combines React Context with useReducer for more complex state management.

#### When to use:
- When you need to share state between components
- When the state logic is complex
- When you want a Redux-like pattern without the boilerplate

#### Example:

```tsx
// features/projects/context/projects-context.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project } from '../types';

// Define the state type
interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

// Define the action types
type ProjectsAction =
  | { type: 'FETCH_PROJECTS_START' }
  | { type: 'FETCH_PROJECTS_SUCCESS'; payload: Project[] }
  | { type: 'FETCH_PROJECTS_ERROR'; payload: string }
  | { type: 'ADD_PROJECT_SUCCESS'; payload: Project }
  | { type: 'UPDATE_PROJECT_SUCCESS'; payload: Project }
  | { type: 'DELETE_PROJECT_SUCCESS'; payload: string };

// Create the initial state
const initialState: ProjectsState = {
  projects: [],
  isLoading: false,
  error: null,
};

// Create the reducer function
function projectsReducer(state: ProjectsState, action: ProjectsAction): ProjectsState {
  switch (action.type) {
    case 'FETCH_PROJECTS_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_PROJECTS_SUCCESS':
      return { ...state, projects: action.payload, isLoading: false };
    case 'FETCH_PROJECTS_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_PROJECT_SUCCESS':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT_SUCCESS':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    default:
      return state;
  }
}

// Create the context
const ProjectsContext = createContext<{
  state: ProjectsState;
  dispatch: React.Dispatch<ProjectsAction>;
} | undefined>(undefined);

// Create the provider component
export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectsReducer, initialState);
  
  return (
    <ProjectsContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectsContext.Provider>
  );
}

// Create a custom hook to use the context
export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
}
```

#### Usage:

```tsx
function App() {
  return (
    <ProjectsProvider>
      <ProjectDashboard />
    </ProjectsProvider>
  );
}

function ProjectDashboard() {
  const { state, dispatch } = useProjectsContext();
  
  useEffect(() => {
    async function fetchProjects() {
      dispatch({ type: 'FETCH_PROJECTS_START' });
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const projects = await response.json();
        dispatch({ type: 'FETCH_PROJECTS_SUCCESS', payload: projects });
      } catch (error) {
        dispatch({
          type: 'FETCH_PROJECTS_ERROR',
          payload: error.message,
        });
      }
    }
    
    fetchProjects();
  }, [dispatch]);
  
  // Component implementation
}
```

## Composition Patterns

### Children as Props Pattern

This pattern involves passing Server Components to Client Components as children.

#### When to use:
- When you need to use Server Components inside Client Components
- When you want to avoid prop drilling
- When you want to create flexible component APIs

#### Example:

```tsx
// Client Component
'use client'
function ClientComponent({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="client-component">
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Hide' : 'Show'} Content
      </button>
      
      {isOpen && (
        <div className="content">
          {children}
        </div>
      )}
    </div>
  );
}

// Server Component
function ServerComponent() {
  // Data fetching on the server
  const data = await fetchDataOnServer();
  
  return (
    <ClientComponent>
      <ServerContent data={data} />
    </ClientComponent>
  );
}

// Another Server Component
async function ServerContent({ data }) {
  // More server-side operations
  const processedData = await processDataOnServer(data);
  
  return (
    <div className="server-content">
      {processedData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Render Props Pattern

This pattern involves passing a function as a prop that returns a React element.

#### When to use:
- When you want to share code between components
- When you need more flexibility than HOCs
- When you want to avoid prop drilling

#### Example:

```tsx
// features/projects/components/ProjectList.tsx
interface ProjectListProps {
  renderItem: (project: Project) => React.ReactNode;
  projects: Project[];
}

function ProjectList({ renderItem, projects }: ProjectListProps) {
  return (
    <div className="grid gap-4">
      {projects.map(project => renderItem(project))}
    </div>
  );
}
```

#### Usage:

```tsx
<ProjectList
  projects={projects}
  renderItem={(project) => (
    <ProjectCard
      key={project.id}
      project={project}
      onEdit={() => handleEdit(project.id)}
      onDelete={() => handleDelete(project.id)}
    />
  )}
/>
```

## Hook Patterns

### Custom Data Fetching Hook

This pattern involves creating a custom hook for data fetching.

#### When to use:
- When you need to fetch data in multiple components
- When you want to abstract away the data fetching logic
- When you want to handle loading and error states consistently

#### Example:

```tsx
// features/projects/hooks/useProjects.ts
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchProjects() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        
        if (isMounted) {
          setProjects(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchProjects();
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return { projects, isLoading, error };
}
```

For more hook patterns, see [Hook Guidelines](../hooks/README.md).

### Custom Form Hook

This pattern involves creating a custom hook for form state management.

#### When to use:
- When you need to manage form state in multiple components
- When you want to abstract away form validation logic
- When you want to handle form submission consistently

#### Example:

```tsx
// features/shared/hooks/useForm.ts
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  };
  
  const handleSubmit = (onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }
      
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    };
  };
  
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
```

## Performance Patterns

### Memoization Pattern

This pattern involves using memoization to optimize performance.

#### When to use:
- When you have expensive calculations
- When you want to prevent unnecessary re-renders
- When you pass callbacks to child components

#### Example:

```tsx
// features/projects/components/ProjectList.tsx
import { useMemo, useCallback } from 'react';

function ProjectList({ projects, onEdit, onDelete }) {
  // Memoize filtered projects
  const activeProjects = useMemo(() => {
    return projects.filter(project => project.status !== 'completed');
  }, [projects]);
  
  // Memoize callbacks
  const handleEdit = useCallback((id: string) => {
    onEdit(id);
  }, [onEdit]);
  
  const handleDelete = useCallback((id: string) => {
    onDelete(id);
  }, [onDelete]);
  
  return (
    <div className="grid gap-4">
      {activeProjects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => handleEdit(project.id)}
          onDelete={() => handleDelete(project.id)}
        />
      ))}
    </div>
  );
}

// Memoize the component itself
export default React.memo(ProjectList);
```

### Code Splitting Pattern

This pattern involves splitting your code into smaller chunks to improve performance.

#### When to use:
- When you have large components
- When you want to reduce initial load time
- When you have components that are not needed immediately

#### Example:

```tsx
// features/projects/pages/ProjectsPage.tsx
import { Suspense, lazy } from 'react';

// Lazy load components
const ProjectDetails = lazy(() => import('../components/ProjectDetails'));
const ProjectComments = lazy(() => import('../components/ProjectComments'));
const ProjectDocuments = lazy(() => import('../components/ProjectDocuments'));

function ProjectsPage({ projectId }) {
  return (
    <div className="project-page">
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectDetails projectId={projectId} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectComments projectId={projectId} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <ProjectDocuments projectId={projectId} />
      </Suspense>
    </div>
  );
}
```

## References

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [React Design Patterns](../architecture/react-patterns.md)
- [Component Guidelines](../components/README.md)
- [Hook Guidelines](../hooks/README.md)
- [State Management Guidelines](./state-management.md)
- [Performance Optimization Guidelines](./performance-optimization.md)

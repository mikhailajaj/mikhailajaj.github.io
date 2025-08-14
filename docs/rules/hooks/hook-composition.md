# Hook Composition Patterns

This document outlines patterns for composing React hooks in the Mikhail Ajaj Portfolio project. Hook composition allows you to build complex behavior from simpler, reusable hooks.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Composition](#basic-composition)
3. [Sequential Composition](#sequential-composition)
4. [Conditional Composition](#conditional-composition)
5. [Parallel Composition](#parallel-composition)
6. [Higher-Order Hooks](#higher-order-hooks)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [References](#references)

## Introduction

Hook composition is the practice of combining multiple hooks to create more complex functionality. This approach promotes code reuse, separation of concerns, and maintainability.

For general hook guidelines, see the [main hooks README](./README.md).

## Basic Composition

The simplest form of hook composition is using multiple hooks within a custom hook.

### Pattern

```typescript
function useComposedHook(param1, param2) {
  // Use hook A
  const resultA = useHookA(param1);
  
  // Use hook B
  const resultB = useHookB(param2);
  
  // Combine results
  return {
    ...resultA,
    ...resultB,
    // Additional properties or transformations
  };
}
```

### Example

```typescript
function useUserProfile(userId: string) {
  // Use data fetching hook
  const { data: user, isLoading, error } = useUser(userId);
  
  // Use permissions hook
  const { canEdit, canDelete } = usePermissions(userId);
  
  // Return combined result
  return {
    user,
    isLoading,
    error,
    canEdit,
    canDelete
  };
}
```

## Sequential Composition

Sequential composition involves using the output of one hook as input to another.

### Pattern

```typescript
function useSequentialHook(param) {
  // Use first hook
  const resultA = useHookA(param);
  
  // Use second hook with result from first hook
  const resultB = useHookB(resultA.someValue);
  
  // Return combined or transformed result
  return {
    ...resultA,
    ...resultB,
    // Additional properties or transformations
  };
}
```

### Example

```typescript
function useProjectWithTasks(projectId: string) {
  // First, fetch the project
  const { data: project, isLoading: projectLoading, error: projectError } = 
    useProject(projectId);
  
  // Then, use the project's taskIds to fetch tasks
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = 
    useTasks(project?.taskIds || []);
  
  // Combine loading and error states
  const isLoading = projectLoading || tasksLoading;
  const error = projectError || tasksError;
  
  // Return combined result
  return {
    project,
    tasks,
    isLoading,
    error
  };
}
```

## Conditional Composition

Conditional composition involves using hooks based on certain conditions.

### Pattern

```typescript
function useConditionalHook(param, condition) {
  // Always use this hook
  const resultA = useHookA(param);
  
  // Conditionally use this hook
  const resultB = condition ? useHookB(param) : null;
  
  // Return appropriate result
  return {
    ...resultA,
    ...(condition ? resultB : { defaultValue: null })
  };
}
```

### Example

```typescript
function useAuthenticatedUser(redirectToLogin = true) {
  // Get authentication state
  const { user, isLoading, error } = useAuth();
  
  // Conditionally use redirect hook
  if (!user && !isLoading && redirectToLogin) {
    useRedirect('/login');
  }
  
  return { user, isLoading, error };
}
```

> **Note**: Be careful with conditional hooks. React's Rules of Hooks require that hooks are called in the same order on every render. Don't put hooks inside conditions; instead, always call the hook and conditionally use its result.

## Parallel Composition

Parallel composition involves using multiple hooks independently and combining their results.

### Pattern

```typescript
function useParallelHook(param1, param2) {
  // Use hooks in parallel
  const resultA = useHookA(param1);
  const resultB = useHookB(param2);
  
  // Combine results
  return {
    a: resultA,
    b: resultB,
    // Derived values
    combined: someTransformation(resultA, resultB)
  };
}
```

### Example

```typescript
function useDashboardData() {
  // Fetch different data sources in parallel
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();
  
  // Combine loading states
  const isLoading = projectsLoading || tasksLoading || notificationsLoading;
  
  // Return all data
  return {
    projects,
    tasks,
    notifications,
    isLoading
  };
}
```

## Higher-Order Hooks

Higher-order hooks are functions that take a hook as an argument and return an enhanced hook. For more details, see [Higher-Order Hook Patterns](./higher-order-hooks.md).

### Pattern

```typescript
function withEnhancement(useBaseHook) {
  return function useEnhancedHook(...args) {
    // Use the base hook
    const result = useBaseHook(...args);
    
    // Add enhancements
    const enhancement = someEnhancement(result);
    
    // Return enhanced result
    return {
      ...result,
      enhancement
    };
  };
}
```

### Example

```typescript
function withLogging(useHook) {
  return function useLoggedHook(...args) {
    console.log(`Hook called with args:`, args);
    
    const result = useHook(...args);
    
    console.log(`Hook returned:`, result);
    
    return result;
  };
}

// Usage
const useLoggedProjects = withLogging(useProjects);
```

## Best Practices

### 1. Keep Hooks Focused

Each hook should have a single responsibility. Compose multiple focused hooks rather than creating complex monolithic hooks.

```typescript
// Good: Focused hooks
function useProjectData(projectId) {
  // Fetch project data
}

function useProjectPermissions(projectId) {
  // Check permissions
}

function useProject(projectId) {
  const data = useProjectData(projectId);
  const permissions = useProjectPermissions(projectId);
  return { ...data, ...permissions };
}

// Bad: Monolithic hook
function useProject(projectId) {
  // Fetch data, check permissions, handle updates, etc.
}
```

### 2. Handle Loading and Error States Consistently

When composing hooks that have loading and error states, handle these states consistently.

```typescript
function useComposedData() {
  const { data: dataA, isLoading: loadingA, error: errorA } = useDataA();
  const { data: dataB, isLoading: loadingB, error: errorB } = useDataB();
  
  return {
    data: { a: dataA, b: dataB },
    isLoading: loadingA || loadingB,
    error: errorA || errorB
  };
}
```

### 3. Use Memoization for Derived Values

Use `useMemo` for expensive computations derived from hook results.

```typescript
function useFilteredProjects(status) {
  const { data: projects, isLoading, error } = useProjects();
  
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    return projects.filter(project => project.status === status);
  }, [projects, status]);
  
  return { filteredProjects, isLoading, error };
}
```

### 4. Avoid Prop Drilling with Context

If you find yourself passing hook results through many levels of components, consider using Context.

```typescript
// Create a context
const ProjectContext = createContext(null);

// Provider component
function ProjectProvider({ children, projectId }) {
  const projectData = useProject(projectId);
  return (
    <ProjectContext.Provider value={projectData}>
      {children}
    </ProjectContext.Provider>
  );
}

// Custom hook to use the context
function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
```

### 5. Document Hook Dependencies

Clearly document the dependencies between composed hooks.

```typescript
/**
 * Hook for project details with tasks
 * 
 * @depends useProject - Fetches project data
 * @depends useTasks - Fetches task data
 */
function useProjectWithTasks(projectId) {
  // Implementation
}
```

## Examples

### Form with Validation and Submission

```typescript
function useLoginForm() {
  // Form state management
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: values => {
      const errors = {};
      if (!values.email) errors.email = 'Email is required';
      if (!values.password) errors.password = 'Password is required';
      return errors;
    }
  });
  
  // Authentication
  const { login, isLoading, error } = useAuth();
  
  // Form submission
  const handleSubmit = async (values) => {
    await login(values.email, values.password);
  };
  
  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting: isLoading,
    submitError: error
  };
}
```

### Data Fetching with Caching and Polling

```typescript
function useRealTimeData(endpoint, pollInterval = 5000) {
  // Data fetching with SWR
  const { data, error, mutate } = useSWR(endpoint, fetcher);
  
  // Polling
  usePolling(() => {
    mutate();
  }, pollInterval, [mutate]);
  
  // Local storage caching
  useLocalStorageCache(endpoint, data);
  
  return {
    data,
    error,
    isLoading: !data && !error,
    refresh: mutate
  };
}
```

### Responsive UI Hook

```typescript
function useResponsiveLayout() {
  // Media queries
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  // Theme
  const { theme, toggleTheme } = useTheme();
  
  // Scroll position
  const scrollY = useScrollPosition();
  
  // Derived values
  const showCompactHeader = useMemo(() => {
    return isMobile || scrollY > 100;
  }, [isMobile, scrollY]);
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    theme,
    toggleTheme,
    scrollY,
    showCompactHeader
  };
}
```

## References

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Custom Hooks Patterns](./hook-patterns.md)
- [Higher-Order Hook Patterns](./higher-order-hooks.md)
- [Mikhail Ajaj Portfolio Shared Hooks](../../shared/hooks/README.md)

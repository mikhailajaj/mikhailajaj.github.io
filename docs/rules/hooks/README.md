# React Hooks Guidelines

This document provides guidelines for creating and using React hooks in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [Hook Types](#hook-types)
3. [Naming Conventions](#naming-conventions)
4. [Implementation Guidelines](#implementation-guidelines)
5. [Testing Hooks](#testing-hooks)
6. [Documentation](#documentation)
7. [Common Patterns](#common-patterns)
8. [Anti-patterns](#anti-patterns)
9. [References](#references)

## Introduction

React Hooks allow you to use state and other React features without writing a class. In the Mikhail Ajaj Portfolio project, we use hooks extensively to manage state, side effects, and reuse stateful logic across components.

**Key Benefits of Hooks:**
- Reuse stateful logic between components
- Split complex components into smaller functions
- Use React features without classes
- Avoid wrapper hell from render props and HOCs
- Organize related code together

For more detailed information, see [React Hooks Introduction](./hooks-introduction.md).

## Hook Types

### Built-in Hooks

| Hook | Purpose | When to Use | Documentation |
|------|---------|-------------|---------------|
| `useState` | State management | Simple component state | [useState Guidelines](./use-state.md) |
| `useEffect` | Side effects | API calls, subscriptions, DOM mutations | [useEffect Guidelines](./use-effect.md) |
| `useContext` | Context consumption | Accessing shared state | [useContext Guidelines](./use-context.md) |
| `useReducer` | Complex state logic | State with multiple sub-values or complex transitions | [useReducer Guidelines](./use-reducer.md) |
| `useCallback` | Memoized callbacks | Performance optimization for callbacks | [useCallback Guidelines](./use-callback.md) |
| `useMemo` | Memoized values | Performance optimization for expensive calculations | [useMemo Guidelines](./use-memo.md) |
| `useRef` | Mutable references | Accessing DOM elements, storing mutable values | [useRef Guidelines](./use-ref.md) |
| `useLayoutEffect` | Synchronous effects | DOM measurements before paint | [useLayoutEffect Guidelines](./use-layout-effect.md) |
| `useImperativeHandle` | Customizing ref value | Exposing imperative methods to parent components | [useImperativeHandle Guidelines](./use-imperative-handle.md) |
| `useDebugValue` | Custom hook debugging | Displaying a label in React DevTools | [useDebugValue Guidelines](./use-debug-value.md) |

### Custom Hooks

In the Mikhail Ajaj Portfolio project, we use several types of custom hooks:

1. **Data Fetching Hooks**: For API interactions
2. **Form Hooks**: For form state and validation
3. **UI Hooks**: For UI-related logic
4. **Utility Hooks**: For common utilities
5. **Feature-Specific Hooks**: For domain-specific logic

For detailed guidelines on each type, see [Custom Hooks Guidelines](./custom-hooks.md).

## Naming Conventions

### Hook Naming

- All hook names **must** start with `use` (e.g., `useProjects`, `useForm`)
- Use camelCase for hook names
- Be descriptive and specific (e.g., `useProjectDetails` instead of `useDetails`)
- For feature-specific hooks, include the feature name (e.g., `useProjectList`, `useClientDetails`)
- For generic hooks, use descriptive names that indicate functionality (e.g., `useLocalStorage`, `useMediaQuery`)

### Return Value Naming

- For hooks that return an array, use destructuring with meaningful names
- For hooks that return an object, use destructuring to extract only what you need

```typescript
// Good: Descriptive array destructuring
const [isOpen, setIsOpen] = useState(false);

// Good: Object destructuring
const { data, isLoading, error } = useQuery('projects', fetchProjects);

// Bad: Non-descriptive names
const [s, ss] = useState(false);
```

For more detailed naming guidelines, see [Hook Naming Conventions](./hook-naming.md).

## Implementation Guidelines

### General Guidelines

1. **Keep hooks focused**: Each hook should have a single responsibility
2. **Composition over complexity**: Compose multiple hooks rather than creating complex ones
3. **Handle errors gracefully**: Implement proper error handling in hooks
4. **Manage loading states**: Include loading states for asynchronous operations
5. **Clean up side effects**: Always clean up subscriptions and async tasks

### Code Structure

```typescript
// Template for a custom hook
import { useState, useEffect } from 'react';

// Hook definition
export function useExample(param1: Type1, param2?: Type2) {
  // State declarations
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Effect for side operations
  useEffect(() => {
    // Skip effect if necessary
    if (!param1) return;

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Async operation
    const fetchData = async () => {
      try {
        const result = await someAsyncOperation(param1, param2);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Cleanup code (cancel requests, clear subscriptions, etc.)
    };
  }, [param1, param2]); // Dependencies array

  // Additional derived state or methods
  const isEmpty = !data || (Array.isArray(data) && data.length === 0);

  const refresh = async () => {
    // Implementation for refreshing data
  };

  // Return values
  return {
    data,
    isLoading,
    error,
    isEmpty,
    refresh
  };
}
```

For more detailed implementation guidelines, see [Hook Implementation Guidelines](./hook-implementation.md).

## Testing Hooks

### Testing Approaches

1. **Rendering Test Components**: Create a test component that uses the hook
2. **Using @testing-library/react-hooks**: Test hooks directly with the `renderHook` function
3. **Integration Testing**: Test hooks as part of component integration tests

### Example Test

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './use-counter';

describe('useCounter', () => {
  test('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  test('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  test('should increment counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  test('should decrement counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });
});
```

For more detailed testing guidelines, see [Hook Testing Guidelines](./hook-testing.md).

## Documentation

### JSDoc Comments

All hooks should be documented with JSDoc comments:

```typescript
/**
 * Hook for managing pagination state
 *
 * @param initialPage - The initial page number (default: 1)
 * @param initialPageSize - The initial page size (default: 10)
 * @param totalItems - The total number of items (optional)
 * @returns Pagination state and control functions
 *
 * @example
 * ```tsx
 * const { page, pageSize, setPage, setPageSize, totalPages } = usePagination({
 *   initialPage: 1,
 *   initialPageSize: 25,
 *   totalItems: 100
 * });
 * ```
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems
}: PaginationOptions = {}) {
  // Implementation...
}
```

### README Documentation

Each custom hook should be documented in a README file within its directory:

```
features/
└── projects/
    └── hooks/
        ├── use-projects.ts
        ├── use-project-details.ts
        └── README.md  // Documents all hooks in this directory
```

For more detailed documentation guidelines, see [Hook Documentation Guidelines](./hook-documentation.md).

## Common Patterns

### Data Fetching Pattern

```typescript
export function useData<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchFn()
      .then(result => {
        if (isMounted) {
          setData(result);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setData(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, isLoading, error };
}
```

### Form State Pattern

```typescript
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset,
    setValues,
    setErrors,
    setTouched
  };
}
```

For more common patterns, see [Hook Patterns](./hook-patterns.md).

## Anti-patterns

### Common Mistakes to Avoid

1. **Breaking the Rules of Hooks**
   - Don't call hooks inside loops, conditions, or nested functions
   - Only call hooks from React function components or custom hooks

2. **Missing Dependencies**
   - Always include all values from the component scope that change over time and are used by the effect

3. **Overusing Effects**
   - Don't use effects for logic that doesn't involve side effects
   - Consider using derived state with `useMemo` instead

4. **Complex State Structures**
   - Avoid deeply nested state objects
   - Split complex state into multiple simpler states

5. **Ignoring Cleanup**
   - Always clean up subscriptions, timers, and event listeners

For more anti-patterns and how to avoid them, see [Hook Anti-patterns](./hook-anti-patterns.md).

## References

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [React Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- [Hooks FAQ](https://reactjs.org/docs/hooks-faq.html)
- [useEffect Complete Guide](https://overreacted.io/a-complete-guide-to-useeffect/)

## Related Documents

- [Hook Patterns](./hook-patterns.md) - Common patterns for custom hooks
- [Hook Composition Patterns](./hook-composition.md) - Patterns for composing hooks
- [Higher-Order Hook Patterns](./higher-order-hooks.md) - Patterns for higher-order hooks
- [Hook Anti-patterns](./hook-anti-patterns.md) - Common anti-patterns to avoid
- [Hook Testing Guidelines](./hook-testing.md) - Guidelines for testing hooks
- [Hook Naming Conventions](./hook-naming.md) - Conventions for naming hooks
- [useEffect Guidelines](./use-effect.md) - Detailed guidelines for useEffect

# Hook Naming Conventions

This document outlines the naming conventions for React hooks in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [General Naming Rules](#general-naming-rules)
3. [Hook Categories](#hook-categories)
4. [Return Value Naming](#return-value-naming)
5. [File Naming](#file-naming)
6. [Examples](#examples)
7. [References](#references)

## Introduction

Consistent naming conventions for hooks make the codebase more maintainable and easier to understand. This document provides guidelines for naming hooks, their return values, and their files in the Mikhail Ajaj Portfolio project.

For general hook guidelines, see the [main hooks README](./README.md).

## General Naming Rules

### 1. Use Prefix

All hook names **must** start with `use` to follow React's convention and to make it clear that the rules of hooks apply.

```typescript
// ✅ Good: Starts with 'use'
function useCounter() { /* ... */ }

// ❌ Bad: Doesn't start with 'use'
function counter() { /* ... */ }
```

### 2. Use Camel Case

Use camelCase for hook names, following JavaScript conventions.

```typescript
// ✅ Good: camelCase
function useFormValidation() { /* ... */ }

// ❌ Bad: PascalCase
function UseFormValidation() { /* ... */ }

// ❌ Bad: snake_case
function use_form_validation() { /* ... */ }
```

### 3. Be Descriptive

Hook names should clearly describe their purpose or the state they manage.

```typescript
// ✅ Good: Descriptive name
function useProjectDetails(projectId: string) { /* ... */ }

// ❌ Bad: Vague name
function useData(id: string) { /* ... */ }
```

### 4. Be Specific

Prefer specific names over generic ones, especially for domain-specific hooks.

```typescript
// ✅ Good: Specific to domain
function useProjectTasks(projectId: string) { /* ... */ }

// ❌ Bad: Too generic
function useItems(id: string) { /* ... */ }
```

### 5. Avoid Redundant Suffixes

Avoid redundant suffixes like `useHook` or `useCustomHook`.

```typescript
// ✅ Good: Clean name
function useLocalStorage() { /* ... */ }

// ❌ Bad: Redundant suffix
function useLocalStorageHook() { /* ... */ }
```

## Hook Categories

Different categories of hooks follow specific naming patterns:

### 1. State Hooks

Hooks that manage state should be named after the state they manage.

```typescript
function useCounter() { /* ... */ }
function useForm() { /* ... */ }
function useToggle() { /* ... */ }
```

### 2. Effect Hooks

Hooks that perform side effects should be named after the effect they perform.

```typescript
function useDocumentTitle(title: string) { /* ... */ }
function useLogger(value: any) { /* ... */ }
function useFetch(url: string) { /* ... */ }
```

### 3. Context Hooks

Hooks that consume context should be named after the context they consume.

```typescript
function useTheme() { /* ... */ }
function useAuth() { /* ... */ }
function useUserContext() { /* ... */ }
```

### 4. Ref Hooks

Hooks that manage refs should be named after the ref they manage.

```typescript
function useClickOutside(callback: () => void) { /* ... */ }
function usePrevious(value: any) { /* ... */ }
function useInterval(callback: () => void, delay: number) { /* ... */ }
```

### 5. Domain-Specific Hooks

Hooks that are specific to a domain should include the domain name.

```typescript
function useProject(projectId: string) { /* ... */ }
function useUserProfile(userId: string) { /* ... */ }
function useTaskList(projectId: string) { /* ... */ }
```

### 6. Utility Hooks

Hooks that provide utility functions should be named after the utility they provide.

```typescript
function useDebounce(value: any, delay: number) { /* ... */ }
function useLocalStorage(key: string, initialValue: any) { /* ... */ }
function useMediaQuery(query: string) { /* ... */ }
```

### 7. Compound Hooks

Hooks that combine multiple hooks should have names that reflect their combined functionality.

```typescript
function useFormWithValidation() { /* ... */ }
function useAuthenticatedFetch() { /* ... */ }
function useSortableTable() { /* ... */ }
```

## Return Value Naming

### 1. Array Returns

For hooks that return an array (like `useState`), use destructuring with meaningful names.

```typescript
// ✅ Good: Descriptive destructuring
const [isOpen, setIsOpen] = useToggle();

// ❌ Bad: Non-descriptive names
const [s, ss] = useToggle();
```

### 2. Object Returns

For hooks that return an object, use descriptive property names and destructure only what you need.

```typescript
// ✅ Good: Descriptive property names
const { user, isLoading, error } = useUser(userId);

// ✅ Good: Destructure only what you need
const { data: projects } = useProjects();

// ❌ Bad: Non-descriptive property names
const { d, l, e } = useUser(userId);
```

### 3. State and Setter Naming

For state and setter pairs, use consistent naming patterns:

- For boolean state, use `is` or `has` prefix for the state and `set` prefix for the setter
- For other state, use a noun for the state and `set` prefix for the setter

```typescript
// Boolean state
const [isOpen, setIsOpen] = useState(false);
const [hasError, setHasError] = useState(false);

// Other state
const [count, setCount] = useState(0);
const [user, setUser] = useState(null);
```

### 4. Action Naming

For actions or event handlers, use verb-based names that describe the action.

```typescript
// ✅ Good: Verb-based action names
const { increment, decrement, reset } = useCounter();

// ❌ Bad: Noun-based or unclear action names
const { up, down, zero } = useCounter();
```

## File Naming

### 1. File Names

Hook files should be named after the hook they export, using kebab-case.

```
use-counter.ts
use-local-storage.ts
use-project-details.ts
```

### 2. Directory Structure

Hooks should be organized in directories according to their scope and purpose:

```
shared/
└── hooks/
    ├── use-counter.ts
    ├── use-local-storage.ts
    └── use-media-query.ts

features/
└── projects/
    └── hooks/
        ├── use-project-details.ts
        ├── use-project-tasks.ts
        └── use-project-timeline.ts
```

### 3. Index Files

Use index files to re-export hooks from a directory:

```typescript
// hooks/index.ts
export * from './use-counter';
export * from './use-local-storage';
export * from './use-media-query';
```

## Examples

### State Hook Example

```typescript
// use-counter.ts
import { useState, useCallback } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
  step?: number;
}

export function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const { min, max, step = 1 } = options;
  
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => {
      const next = prev + step;
      if (max !== undefined && next > max) {
        return max;
      }
      return next;
    });
  }, [max, step]);
  
  const decrement = useCallback(() => {
    setCount(prev => {
      const next = prev - step;
      if (min !== undefined && next < min) {
        return min;
      }
      return next;
    });
  }, [min, step]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return { count, increment, decrement, reset };
}
```

### Effect Hook Example

```typescript
// use-document-title.ts
import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
}
```

### Context Hook Example

```typescript
// use-theme.ts
import { useContext } from 'react';
import { ThemeContext } from '../context/theme-context';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
```

### Domain-Specific Hook Example

```typescript
// use-project-details.ts
import { useState, useEffect } from 'react';
import { Project } from '../types';
import { fetchProject } from '../api';

export function useProjectDetails(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function loadProject() {
      setIsLoading(true);
      
      try {
        const data = await fetchProject(projectId);
        
        if (isMounted) {
          setProject(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setProject(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadProject();
    
    return () => {
      isMounted = false;
    };
  }, [projectId]);
  
  return { project, isLoading, error };
}
```

### Utility Hook Example

```typescript
// use-local-storage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // Listen for changes to the stored value in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue) as T);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
}
```

## References

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [React Hooks Naming Conventions](https://www.reactjunkie.com/react-hook-naming-conventions)
- [Mikhail Ajaj Portfolio Coding Standards](../coding-standards.md)

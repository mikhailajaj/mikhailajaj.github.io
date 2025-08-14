# Custom Hook Patterns

This document outlines common patterns for custom hooks in the Mikhail Ajaj Portfolio project. Each pattern includes a description, implementation guidelines, and references to example implementations.

## Table of Contents

1. [Introduction](#introduction)
2. [Data Fetching Hooks](#data-fetching-hooks)
3. [Form Hooks](#form-hooks)
4. [UI State Hooks](#ui-state-hooks)
5. [Browser API Hooks](#browser-api-hooks)
6. [Composition Patterns](#composition-patterns)
7. [References](#references)

## Introduction

Custom hooks allow you to extract component logic into reusable functions. This document provides patterns for common hook use cases in the Mikhail Ajaj Portfolio project.

For general hook guidelines, see the [main hooks README](./README.md).

## Data Fetching Hooks

### Basic Data Fetching Pattern

A pattern for fetching data with loading, error, and data states.

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

For a complete implementation, see [useData.ts](../../shared/hooks/use-data.ts).

### Resource Fetching Pattern

A pattern for fetching resources by ID with caching.

```typescript
export function useResource<T>(
  resourceId: string | null,
  fetchResource: (id: string) => Promise<T>
) {
  const [resource, setResource] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!resourceId) {
      setResource(null);
      return;
    }
    
    let isMounted = true;
    setIsLoading(true);
    
    fetchResource(resourceId)
      .then(result => {
        if (isMounted) {
          setResource(result);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setResource(null);
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
  }, [resourceId, fetchResource]);
  
  return { resource, isLoading, error };
}
```

For a complete implementation with caching, see [useResource.ts](../../shared/hooks/use-resource.ts).

### Pagination Pattern

A pattern for implementing paginated data fetching.

```typescript
export function usePaginatedData<T>(
  fetchPage: (page: number, pageSize: number) => Promise<{ items: T[], total: number }>,
  initialPage = 1,
  initialPageSize = 10
) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    
    fetchPage(page, pageSize)
      .then(result => {
        if (isMounted) {
          setData(result.items);
          setTotal(result.total);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
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
  }, [page, pageSize, fetchPage]);
  
  const totalPages = Math.ceil(total / pageSize);
  
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };
  
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  return {
    data,
    isLoading,
    error,
    page,
    pageSize,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize
  };
}
```

For a complete implementation, see [usePaginatedData.ts](../../shared/hooks/use-paginated-data.ts).

## Form Hooks

### Basic Form State Pattern

A pattern for managing form state with validation.

```typescript
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Record<string, string>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form to initial values
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Update form values
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);
  
  // Mark field as touched on blur
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  // Validate form values
  const validateForm = useCallback(() => {
    if (!validate) return {};
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    return validationErrors;
  }, [values, validate]);
  
  // Submit form if valid
  const handleSubmit = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);
      
      // Validate form
      const validationErrors = validateForm();
      
      // If form is valid, submit
      if (Object.keys(validationErrors).length === 0) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    };
  }, [values, validateForm]);
  
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
    setErrors,
    setTouched
  };
}
```

For a complete implementation with Zod validation, see [useForm.ts](../../shared/hooks/use-form.ts).

### Field Array Pattern

A pattern for managing arrays of form fields.

```typescript
export function useFieldArray<T>(
  initialItems: T[] = [],
  onChange?: (items: T[]) => void
) {
  const [items, setItems] = useState<T[]>(initialItems);
  
  // Update items and call onChange
  const updateItems = useCallback((newItems: T[]) => {
    setItems(newItems);
    onChange?.(newItems);
  }, [onChange]);
  
  // Add an item to the array
  const append = useCallback((item: T) => {
    updateItems([...items, item]);
  }, [items, updateItems]);
  
  // Remove an item at a specific index
  const remove = useCallback((index: number) => {
    updateItems(items.filter((_, i) => i !== index));
  }, [items, updateItems]);
  
  // Update an item at a specific index
  const update = useCallback((index: number, item: T) => {
    updateItems(items.map((oldItem, i) => (i === index ? item : oldItem)));
  }, [items, updateItems]);
  
  // Move an item from one index to another
  const move = useCallback((fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      fromIndex >= items.length ||
      toIndex < 0 ||
      toIndex >= items.length
    ) {
      return;
    }
    
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    
    updateItems(newItems);
  }, [items, updateItems]);
  
  return {
    items,
    append,
    remove,
    update,
    move,
    replace: updateItems
  };
}
```

For a complete implementation, see [useFieldArray.ts](../../shared/hooks/use-field-array.ts).

## UI State Hooks

### Toggle Pattern

A pattern for toggling boolean state.

```typescript
export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  
  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);
  
  const setTrue = useCallback(() => {
    setState(true);
  }, []);
  
  const setFalse = useCallback(() => {
    setState(false);
  }, []);
  
  return [state, { toggle, setTrue, setFalse, setState }] as const;
}
```

For a complete implementation, see [useToggle.ts](../../shared/hooks/use-toggle.ts).

### Disclosure Pattern

A pattern for managing disclosure state (open/closed).

```typescript
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  const onToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return {
    isOpen,
    onOpen,
    onClose,
    onToggle
  };
}
```

For a complete implementation, see [useDisclosure.ts](../../shared/hooks/use-disclosure.ts).

### Media Query Pattern

A pattern for responding to media queries.

```typescript
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);
  
  return matches;
}
```

For a complete implementation, see [useMediaQuery.ts](../../shared/hooks/use-media-query.ts).

## Browser API Hooks

### Local Storage Pattern

A pattern for syncing state with localStorage.

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
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
  }, [initialValue, key]);
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a browser`
        );
      }
      
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
    },
    [key, storedValue]
  );
  
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return [storedValue, setValue];
}
```

For a complete implementation, see [useLocalStorage.ts](../../shared/hooks/use-local-storage.ts).

### Clipboard Pattern

A pattern for interacting with the clipboard API.

```typescript
export function useClipboard(timeout = 2000) {
  const [hasCopied, setHasCopied] = useState(false);
  const [value, setValue] = useState('');
  
  const onCopy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard not supported');
        return;
      }
      
      try {
        await navigator.clipboard.writeText(text);
        setValue(text);
        setHasCopied(true);
        
        setTimeout(() => {
          setHasCopied(false);
        }, timeout);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    },
    [timeout]
  );
  
  return { value, hasCopied, onCopy };
}
```

For a complete implementation, see [useClipboard.ts](../../shared/hooks/use-clipboard.ts).

### Event Listener Pattern

A pattern for adding event listeners.

```typescript
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: KW | KH,
  handler: (
    event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event
  ) => void,
  element?: RefObject<T>,
  options?: boolean | AddEventListenerOptions
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window;
    
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }
    
    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = event => savedHandler.current(event);
    
    targetElement.addEventListener(eventName, eventListener, options);
    
    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}
```

For a complete implementation, see [useEventListener.ts](../../shared/hooks/use-event-listener.ts).

## Composition Patterns

### Combining Hooks Pattern

A pattern for composing multiple hooks together.

```typescript
// First, create individual hooks
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  
  return { count, increment, decrement, reset };
}

function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = 'Mikhail Ajaj Portfolio';
    };
  }, [title]);
}

// Then, compose them together
function useCounterWithDocumentTitle(initialValue = 0) {
  const counter = useCounter(initialValue);
  useDocumentTitle(`Count: ${counter.count}`);
  
  return counter;
}
```

For more examples of hook composition, see [Hook Composition Patterns](./hook-composition.md).

### Higher-Order Hook Pattern

A pattern for creating hooks that enhance other hooks.

```typescript
// Higher-order hook that adds loading state
function withLoading<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> & { isLoading: boolean } {
  return (...args: Parameters<T>) => {
    const [isLoading, setIsLoading] = useState(false);
    
    const result = useHook(...args);
    
    // Wrap any async methods to add loading state
    const enhancedResult = { ...result, isLoading };
    
    // Find all methods in the result
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      // If it's a function, wrap it to handle loading state
      if (typeof value === 'function') {
        enhancedResult[key] = async (...fnArgs: any[]) => {
          setIsLoading(true);
          try {
            return await value(...fnArgs);
          } finally {
            setIsLoading(false);
          }
        };
      }
    });
    
    return enhancedResult;
  };
}

// Usage
const useProjectsWithLoading = withLoading(useProjects);
```

For more examples of higher-order hooks, see [Higher-Order Hook Patterns](./higher-order-hooks.md).

## References

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [useHooks Collection](https://usehooks.com/)
- [React Hooks Cheatsheet](https://react-hooks-cheatsheet.com/)
- [Mikhail Ajaj Portfolio Shared Hooks](../../shared/hooks/README.md)
- [Feature-Specific Hooks Guidelines](./feature-hooks.md)

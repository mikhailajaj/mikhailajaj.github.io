# Hook Testing Guidelines

This document provides guidelines for testing React hooks in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Approaches](#testing-approaches)
3. [Testing Libraries](#testing-libraries)
4. [Testing Patterns](#testing-patterns)
5. [Mocking Dependencies](#mocking-dependencies)
6. [Common Test Cases](#common-test-cases)
7. [Examples](#examples)
8. [References](#references)

## Introduction

Testing hooks is essential to ensure they work correctly and maintain their behavior over time. This document outlines approaches, patterns, and best practices for testing hooks in the Mikhail Ajaj Portfolio project.

For general hook guidelines, see the [main hooks README](./README.md).

## Testing Approaches

There are three main approaches to testing hooks:

### 1. Rendering Test Components

Create a test component that uses the hook and test the component's behavior.

**Pros:**
- Tests the hook in a realistic context
- Can test interactions with the DOM
- Works with any testing library

**Cons:**
- Indirect testing of hook behavior
- May be affected by component rendering issues

### 2. Using @testing-library/react-hooks

Test hooks directly with the `renderHook` function from `@testing-library/react-hooks`.

**Pros:**
- Direct testing of hook behavior
- Simpler test setup
- Cleaner test code

**Cons:**
- Additional dependency
- May not catch integration issues with components

### 3. Integration Testing

Test hooks as part of larger component integration tests.

**Pros:**
- Tests hooks in their actual usage context
- Catches integration issues
- Tests the full user experience

**Cons:**
- Less focused on hook behavior
- More complex test setup
- Harder to isolate hook-specific issues

## Testing Libraries

### React Testing Library

The primary testing library for React components and hooks in the Mikhail Ajaj Portfolio project.

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### React Hooks Testing Library

A library specifically designed for testing hooks.

```bash
npm install --save-dev @testing-library/react-hooks
```

### Jest

The test runner and assertion library used in the Mikhail Ajaj Portfolio project.

```bash
npm install --save-dev jest
```

## Testing Patterns

### 1. Testing Initial State

Test that the hook initializes with the expected state.

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useCounter } from './use-counter';

test('should initialize with default value', () => {
  const { result } = renderHook(() => useCounter());
  expect(result.current.count).toBe(0);
});

test('should initialize with provided value', () => {
  const { result } = renderHook(() => useCounter(10));
  expect(result.current.count).toBe(10);
});
```

### 2. Testing State Updates

Test that the hook updates state correctly when its functions are called.

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCounter } from './use-counter';

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
```

### 3. Testing Effects

Test that the hook's effects run at the right times and with the right dependencies.

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useDocumentTitle } from './use-document-title';

test('should update document title', () => {
  // Mock document.title
  const originalTitle = document.title;
  
  renderHook(() => useDocumentTitle('New Title'));
  
  expect(document.title).toBe('New Title');
  
  // Cleanup
  document.title = originalTitle;
});

test('should update document title when title changes', () => {
  // Mock document.title
  const originalTitle = document.title;
  
  const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
    initialProps: { title: 'Initial Title' }
  });
  
  expect(document.title).toBe('Initial Title');
  
  rerender({ title: 'Updated Title' });
  
  expect(document.title).toBe('Updated Title');
  
  // Cleanup
  document.title = originalTitle;
});
```

### 4. Testing Cleanup

Test that the hook's cleanup functions run correctly.

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useEventListener } from './use-event-listener';

test('should add and remove event listener', () => {
  // Mock addEventListener and removeEventListener
  const addEventListener = jest.spyOn(window, 'addEventListener');
  const removeEventListener = jest.spyOn(window, 'removeEventListener');
  
  const handler = jest.fn();
  
  const { unmount } = renderHook(() => 
    useEventListener('click', handler)
  );
  
  expect(addEventListener).toHaveBeenCalledWith('click', handler, undefined);
  
  unmount();
  
  expect(removeEventListener).toHaveBeenCalledWith('click', handler, undefined);
  
  // Cleanup
  addEventListener.mockRestore();
  removeEventListener.mockRestore();
});
```

### 5. Testing Async Behavior

Test that the hook handles asynchronous operations correctly.

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAsync } from './use-async';

test('should handle async function', async () => {
  const asyncFunction = jest.fn().mockResolvedValue('result');
  
  const { result, waitForNextUpdate } = renderHook(() => 
    useAsync(asyncFunction)
  );
  
  // Initial state
  expect(result.current.status).toBe('idle');
  expect(result.current.data).toBe(null);
  expect(result.current.error).toBe(null);
  
  // Execute async function
  act(() => {
    result.current.execute();
  });
  
  // Loading state
  expect(result.current.status).toBe('pending');
  
  // Wait for async function to resolve
  await waitForNextUpdate();
  
  // Success state
  expect(result.current.status).toBe('success');
  expect(result.current.data).toBe('result');
  expect(result.current.error).toBe(null);
});

test('should handle async error', async () => {
  const error = new Error('Async error');
  const asyncFunction = jest.fn().mockRejectedValue(error);
  
  const { result, waitForNextUpdate } = renderHook(() => 
    useAsync(asyncFunction)
  );
  
  // Execute async function
  act(() => {
    result.current.execute();
  });
  
  // Wait for async function to reject
  await waitForNextUpdate();
  
  // Error state
  expect(result.current.status).toBe('error');
  expect(result.current.data).toBe(null);
  expect(result.current.error).toBe(error);
});
```

## Mocking Dependencies

### 1. Mocking Fetch

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useFetch } from './use-fetch';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

test('should fetch data', async () => {
  const mockData = { id: 1, name: 'Test' };
  
  // Mock successful fetch
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  });
  
  const { result, waitForNextUpdate } = renderHook(() => 
    useFetch('https://api.example.com/data')
  );
  
  // Initial state
  expect(result.current.data).toBe(null);
  expect(result.current.isLoading).toBe(true);
  expect(result.current.error).toBe(null);
  
  // Wait for fetch to resolve
  await waitForNextUpdate();
  
  // Success state
  expect(result.current.data).toEqual(mockData);
  expect(result.current.isLoading).toBe(false);
  expect(result.current.error).toBe(null);
  
  // Verify fetch was called correctly
  expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/data');
});
```

### 2. Mocking Custom Hooks

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from './use-auth';
import { useProtectedResource } from './use-protected-resource';

// Mock useAuth hook
jest.mock('./use-auth', () => ({
  useAuth: jest.fn()
}));

test('should fetch protected resource when authenticated', async () => {
  // Mock useAuth to return authenticated user
  useAuth.mockReturnValue({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true
  });
  
  const { result, waitForNextUpdate } = renderHook(() => 
    useProtectedResource('https://api.example.com/protected')
  );
  
  await waitForNextUpdate();
  
  expect(result.current.data).not.toBe(null);
  expect(result.current.error).toBe(null);
});

test('should return error when not authenticated', () => {
  // Mock useAuth to return unauthenticated state
  useAuth.mockReturnValue({
    user: null,
    isAuthenticated: false
  });
  
  const { result } = renderHook(() => 
    useProtectedResource('https://api.example.com/protected')
  );
  
  expect(result.current.data).toBe(null);
  expect(result.current.error).toBe('Not authenticated');
});
```

### 3. Mocking Context

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { ThemeContext } from './theme-context';
import { useTheme } from './use-theme';

test('should use theme from context', () => {
  const wrapper = ({ children }) => (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: jest.fn() }}>
      {children}
    </ThemeContext.Provider>
  );
  
  const { result } = renderHook(() => useTheme(), { wrapper });
  
  expect(result.current.theme).toBe('dark');
});
```

## Common Test Cases

### 1. Testing State Hooks

- Initial state
- State updates
- Reset functionality
- Edge cases (e.g., min/max values)

### 2. Testing Effect Hooks

- Effect execution
- Dependency changes
- Cleanup
- Race conditions

### 3. Testing Context Hooks

- Context consumption
- Default values
- Context updates

### 4. Testing Ref Hooks

- Initial ref value
- Ref updates
- Ref stability

### 5. Testing Custom Hooks

- API contract
- Integration with other hooks
- Error handling
- Performance (e.g., memoization)

## Examples

### Testing a Counter Hook

```typescript
// use-counter.ts
import { useState, useCallback } from 'react';

interface UseCounterOptions {
  min?: number;
  max?: number;
}

export function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const { min, max } = options;
  
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => {
      if (max !== undefined && prev >= max) {
        return prev;
      }
      return prev + 1;
    });
  }, [max]);
  
  const decrement = useCallback(() => {
    setCount(prev => {
      if (min !== undefined && prev <= min) {
        return prev;
      }
      return prev - 1;
    });
  }, [min]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return { count, increment, decrement, reset };
}
```

```typescript
// use-counter.test.ts
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
  
  test('should reset counter', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    
    expect(result.current.count).toBe(5);
  });
  
  test('should respect min value', () => {
    const { result } = renderHook(() => 
      useCounter(5, { min: 5 })
    );
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(5);
  });
  
  test('should respect max value', () => {
    const { result } = renderHook(() => 
      useCounter(5, { max: 5 })
    );
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(5);
  });
});
```

### Testing a Data Fetching Hook

```typescript
// use-fetch.ts
import { useState, useEffect } from 'react';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [url]);
  
  return { data, isLoading, error };
}
```

```typescript
// use-fetch.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useFetch } from './use-fetch';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('useFetch', () => {
  test('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    
    // Mock successful fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useFetch('https://api.example.com/data')
    );
    
    // Initial state
    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    
    // Wait for fetch to resolve
    await waitForNextUpdate();
    
    // Success state
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
  
  test('should handle fetch error', async () => {
    // Mock fetch error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useFetch('https://api.example.com/data')
    );
    
    // Wait for fetch to reject
    await waitForNextUpdate();
    
    // Error state
    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });
  
  test('should handle HTTP error', async () => {
    // Mock HTTP error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useFetch('https://api.example.com/data')
    );
    
    // Wait for fetch to resolve with error
    await waitForNextUpdate();
    
    // Error state
    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('HTTP error');
  });
  
  test('should refetch when URL changes', async () => {
    // Mock first fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1 })
    });
    
    const { result, waitForNextUpdate, rerender } = renderHook(
      (url) => useFetch(url),
      { initialProps: 'https://api.example.com/data/1' }
    );
    
    // Wait for first fetch
    await waitForNextUpdate();
    
    expect(result.current.data).toEqual({ id: 1 });
    
    // Mock second fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 2 })
    });
    
    // Change URL
    rerender('https://api.example.com/data/2');
    
    // Wait for second fetch
    await waitForNextUpdate();
    
    expect(result.current.data).toEqual({ id: 2 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
```

## References

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [React Hooks Testing Library Documentation](https://react-hooks-testing-library.com/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing React Hooks](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)
- [Mikhail Ajaj Portfolio Testing Guidelines](../testing/README.md)

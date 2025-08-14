# Higher-Order Hook Patterns

This document outlines patterns for creating and using higher-order hooks in the Mikhail Ajaj Portfolio project. Higher-order hooks are functions that take a hook as an argument and return an enhanced hook.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Pattern](#basic-pattern)
3. [Common Use Cases](#common-use-cases)
4. [Implementation Techniques](#implementation-techniques)
5. [Best Practices](#best-practices)
6. [Examples](#examples)
7. [References](#references)

## Introduction

Higher-order hooks (HOHs) are inspired by higher-order components (HOCs) and follow a similar pattern. They allow you to extract common hook logic, apply cross-cutting concerns, and enhance existing hooks without modifying their implementation.

For general hook guidelines, see the [main hooks README](./README.md).

## Basic Pattern

The basic pattern for a higher-order hook is:

```typescript
function withFeature<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> & AdditionalFeature {
  return function useEnhancedHook(...args: Parameters<T>) {
    // Call the original hook
    const result = useHook(...args);
    
    // Add additional features
    const additionalFeature = useAdditionalFeature(result);
    
    // Return enhanced result
    return {
      ...result,
      ...additionalFeature
    };
  };
}
```

## Common Use Cases

### 1. Adding Loading State

```typescript
function withLoading<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> & { isLoading: boolean } {
  return function useHookWithLoading(...args: Parameters<T>) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Call the original hook
    const result = useHook(...args);
    
    // Enhance any async methods with loading state
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
```

### 2. Adding Error Handling

```typescript
function withErrorHandling<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> & { error: Error | null } {
  return function useHookWithErrorHandling(...args: Parameters<T>) {
    const [error, setError] = useState<Error | null>(null);
    
    // Call the original hook
    const result = useHook(...args);
    
    // Enhance any async methods with error handling
    const enhancedResult = { ...result, error };
    
    // Find all methods in the result
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      // If it's a function, wrap it to handle errors
      if (typeof value === 'function') {
        enhancedResult[key] = async (...fnArgs: any[]) => {
          try {
            setError(null);
            return await value(...fnArgs);
          } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            throw err;
          }
        };
      }
    });
    
    return enhancedResult;
  };
}
```

### 3. Adding Caching

```typescript
function withCache<T extends (...args: any[]) => any>(
  useHook: T,
  options: { ttl?: number } = {}
): T {
  const cache = new Map();
  const { ttl = 5 * 60 * 1000 } = options; // Default TTL: 5 minutes
  
  return function useHookWithCache(...args: Parameters<T>) {
    // Create a cache key from the arguments
    const cacheKey = JSON.stringify(args);
    
    // Check if we have a valid cached result
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.result;
    }
    
    // Call the original hook
    const result = useHook(...args);
    
    // Cache the result
    useEffect(() => {
      cache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });
      
      // Optional: Clean up old cache entries
      const cleanup = () => {
        for (const [key, value] of cache.entries()) {
          if (Date.now() - value.timestamp > ttl) {
            cache.delete(key);
          }
        }
      };
      
      cleanup();
      const interval = setInterval(cleanup, ttl);
      
      return () => clearInterval(interval);
    }, [result, cacheKey]);
    
    return result;
  };
}
```

### 4. Adding Logging

```typescript
function withLogging<T extends (...args: any[]) => any>(
  useHook: T,
  name = useHook.name
): T {
  return function useHookWithLogging(...args: Parameters<T>) {
    console.log(`[${name}] Called with:`, args);
    
    // Call the original hook
    const result = useHook(...args);
    
    // Log the result
    console.log(`[${name}] Returned:`, result);
    
    // Enhance any methods with logging
    const enhancedResult = { ...result };
    
    // Find all methods in the result
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      // If it's a function, wrap it with logging
      if (typeof value === 'function') {
        enhancedResult[key] = async (...fnArgs: any[]) => {
          console.log(`[${name}.${key}] Called with:`, fnArgs);
          try {
            const fnResult = await value(...fnArgs);
            console.log(`[${name}.${key}] Returned:`, fnResult);
            return fnResult;
          } catch (error) {
            console.error(`[${name}.${key}] Error:`, error);
            throw error;
          }
        };
      }
    });
    
    return enhancedResult;
  };
}
```

### 5. Adding Authentication Check

```typescript
function withAuth<T extends (...args: any[]) => any>(
  useHook: T,
  options: { redirectUrl?: string } = {}
): T {
  const { redirectUrl = '/login' } = options;
  
  return function useHookWithAuth(...args: Parameters<T>) {
    // Get authentication state
    const { user, isLoading } = useAuth();
    
    // Redirect if not authenticated
    useEffect(() => {
      if (!isLoading && !user) {
        window.location.href = redirectUrl;
      }
    }, [user, isLoading]);
    
    // If still loading or not authenticated, return a placeholder
    if (isLoading || !user) {
      // Create a placeholder result with the same shape as the original hook
      return {} as ReturnType<T>;
    }
    
    // Call the original hook only if authenticated
    return useHook(...args);
  };
}
```

## Implementation Techniques

### 1. Preserving TypeScript Types

Use TypeScript generics to preserve the types of the original hook:

```typescript
function withFeature<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> & AdditionalFeature {
  // Implementation
}
```

### 2. Handling Hook Arguments

Use the `Parameters<T>` utility type to handle the arguments of the original hook:

```typescript
function withFeature<T extends (...args: any[]) => any>(useHook: T) {
  return function useEnhancedHook(...args: Parameters<T>) {
    // Implementation
  };
}
```

### 3. Enhancing Return Values

Use the `ReturnType<T>` utility type to enhance the return value of the original hook:

```typescript
function withFeature<T extends (...args: any[]) => any>(
  useHook: T
): (...args: Parameters<T>) => ReturnType<T> & AdditionalFeature {
  return function useEnhancedHook(...args: Parameters<T>) {
    const result = useHook(...args);
    return {
      ...result,
      additionalFeature: 'value'
    };
  };
}
```

### 4. Composing Multiple Higher-Order Hooks

Compose multiple higher-order hooks using function composition:

```typescript
// Compose higher-order hooks
const enhance = compose(
  withLoading,
  withErrorHandling,
  withLogging
);

// Apply the composed enhancement
const useEnhancedHook = enhance(useBaseHook);

// Helper function for composition
function compose(...fns) {
  return (x) => fns.reduceRight((y, f) => f(y), x);
}
```

## Best Practices

### 1. Preserve Original Hook Name

Preserve the name of the original hook for better debugging:

```typescript
function withFeature(useHook) {
  // Use the original hook name in the enhanced hook
  const useEnhancedHook = (...args) => {
    // Implementation
  };
  
  // Set the display name
  useEnhancedHook.displayName = `withFeature(${useHook.name || 'useHook'})`;
  
  return useEnhancedHook;
}
```

### 2. Forward Refs and Other Special Properties

If the original hook has special properties, forward them to the enhanced hook:

```typescript
function withFeature(useHook) {
  const useEnhancedHook = (...args) => {
    // Implementation
  };
  
  // Forward special properties
  if (useHook.someSpecialProperty) {
    useEnhancedHook.someSpecialProperty = useHook.someSpecialProperty;
  }
  
  return useEnhancedHook;
}
```

### 3. Don't Modify the Original Hook

Higher-order hooks should not modify the original hook. Instead, they should create a new hook that calls the original:

```typescript
// Good: Creates a new hook
function withFeature(useHook) {
  return function useEnhancedHook(...args) {
    const result = useHook(...args);
    // Enhance the result
    return enhancedResult;
  };
}

// Bad: Modifies the original hook
function withFeature(useHook) {
  // Don't do this!
  useHook.someProperty = 'value';
  return useHook;
}
```

### 4. Document the Enhancement

Clearly document what the higher-order hook adds to the original hook:

```typescript
/**
 * Enhances a hook with loading state.
 * 
 * @param useHook - The hook to enhance
 * @returns A new hook that includes isLoading state and wraps async methods
 * 
 * @example
 * ```tsx
 * const useProjectsWithLoading = withLoading(useProjects);
 * 
 * function ProjectList() {
 *   const { projects, fetchProjects, isLoading } = useProjectsWithLoading();
 *   
 *   return (
 *     <div>
 *       <button onClick={fetchProjects} disabled={isLoading}>
 *         {isLoading ? 'Loading...' : 'Refresh'}
 *       </button>
 *       {projects.map(project => (
 *         <ProjectItem key={project.id} project={project} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
function withLoading(useHook) {
  // Implementation
}
```

### 5. Keep It Simple

Higher-order hooks should have a single responsibility. If you need multiple enhancements, compose them rather than creating a complex higher-order hook:

```typescript
// Good: Single responsibility
function withLoading(useHook) {
  // Add loading state
}

function withErrorHandling(useHook) {
  // Add error handling
}

// Compose them
const useEnhancedHook = withErrorHandling(withLoading(useBaseHook));

// Bad: Multiple responsibilities
function withLoadingAndErrorHandling(useHook) {
  // Add loading state and error handling
}
```

## Examples

### Data Fetching with Loading and Error Handling

```typescript
// Base hook
function useProjects() {
  const [projects, setProjects] = useState([]);
  
  const fetchProjects = async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    setProjects(data);
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  return { projects, fetchProjects };
}

// Higher-order hook for loading state
function withLoading(useHook) {
  return function useHookWithLoading(...args) {
    const [isLoading, setIsLoading] = useState(false);
    
    const result = useHook(...args);
    
    const enhancedResult = { ...result, isLoading };
    
    // Enhance async methods
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      if (typeof value === 'function') {
        enhancedResult[key] = async (...fnArgs) => {
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

// Higher-order hook for error handling
function withErrorHandling(useHook) {
  return function useHookWithErrorHandling(...args) {
    const [error, setError] = useState(null);
    
    const result = useHook(...args);
    
    const enhancedResult = { ...result, error };
    
    // Enhance async methods
    Object.keys(result).forEach(key => {
      const value = result[key];
      
      if (typeof value === 'function') {
        enhancedResult[key] = async (...fnArgs) => {
          try {
            setError(null);
            return await value(...fnArgs);
          } catch (err) {
            setError(err);
            throw err;
          }
        };
      }
    });
    
    return enhancedResult;
  };
}

// Compose higher-order hooks
const useProjectsWithLoadingAndError = withErrorHandling(withLoading(useProjects));

// Usage
function ProjectList() {
  const { projects, fetchProjects, isLoading, error } = useProjectsWithLoadingAndError();
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <div>
      <button onClick={fetchProjects} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh'}
      </button>
      {projects.map(project => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Form Hook with Validation and Submission

```typescript
// Base hook
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };
  
  const reset = () => {
    setValues(initialValues);
  };
  
  return { values, handleChange, reset };
}

// Higher-order hook for validation
function withValidation(useHook, validate) {
  return function useFormWithValidation(...args) {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    const result = useHook(...args);
    
    const validateForm = () => {
      const validationErrors = validate(result.values);
      setErrors(validationErrors);
      return validationErrors;
    };
    
    const handleBlur = (e) => {
      const { name } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));
      
      // Validate the field
      const fieldErrors = validate({ [name]: result.values[name] });
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    };
    
    return {
      ...result,
      errors,
      touched,
      handleBlur,
      validateForm,
      isValid: Object.keys(errors).length === 0
    };
  };
}

// Higher-order hook for submission
function withSubmission(useHook) {
  return function useFormWithSubmission(...args) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    
    const result = useHook(...args);
    
    const handleSubmit = (onSubmit) => async (e) => {
      e.preventDefault();
      
      // Validate form if available
      if (result.validateForm) {
        const errors = result.validateForm();
        if (Object.keys(errors).length > 0) {
          return;
        }
      }
      
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        await onSubmit(result.values);
      } catch (error) {
        setSubmitError(error);
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return {
      ...result,
      handleSubmit,
      isSubmitting,
      submitError
    };
  };
}

// Validation function
const validateLoginForm = (values) => {
  const errors = {};
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return errors;
};

// Compose higher-order hooks
const useLoginForm = withSubmission(
  withValidation(
    useForm,
    validateLoginForm
  )
);

// Usage
function LoginForm() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isSubmitting,
    submitError
  } = useLoginForm({
    email: '',
    password: ''
  });
  
  const onSubmit = async (values) => {
    // Login logic
    await api.login(values.email, values.password);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {submitError && (
        <div className="error">{submitError.message}</div>
      )}
      
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <div className="error">{errors.email}</div>
        )}
      </div>
      
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.password && errors.password && (
          <div className="error">{errors.password}</div>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

## References

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Custom Hooks Patterns](./hook-patterns.md)
- [Hook Composition Patterns](./hook-composition.md)
- [Mikhail Ajaj Portfolio Shared Hooks](../../shared/hooks/README.md)

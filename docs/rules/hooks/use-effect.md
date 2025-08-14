# useEffect Guidelines

This document provides detailed guidelines for using the `useEffect` hook in the Mikhail Ajaj Portfolio project.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Usage](#basic-usage)
3. [Dependency Array](#dependency-array)
4. [Cleanup Function](#cleanup-function)
5. [Common Use Cases](#common-use-cases)
6. [Best Practices](#best-practices)
7. [Anti-patterns](#anti-patterns)
8. [Examples](#examples)
9. [References](#references)

## Introduction

The `useEffect` hook lets you perform side effects in function components. Side effects include data fetching, subscriptions, manual DOM manipulations, logging, and other operations that affect things outside the component.

```typescript
useEffect(() => {
  // Side effect code
  
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]); // Dependency array
```

## Basic Usage

### When to Use useEffect

Use `useEffect` when you need to:

1. **Fetch data** from an API
2. **Subscribe** to external data sources
3. **Manipulate the DOM** directly
4. **Set up event listeners**
5. **Perform timing operations** (setTimeout, setInterval)
6. **Log** component lifecycle events
7. **Integrate** with non-React code

### When NOT to Use useEffect

Don't use `useEffect` for:

1. **Transforming data for rendering** (use regular variables or `useMemo` instead)
2. **Handling user events** (use event handlers instead)
3. **Managing state that doesn't involve side effects** (use `useState` or `useReducer` instead)
4. **Synchronous calculations** (do them directly in the component body)

## Dependency Array

The dependency array is a crucial part of `useEffect` that determines when the effect will run.

### Empty Dependency Array

```typescript
useEffect(() => {
  // This runs only once after the initial render
}, []);
```

Use an empty dependency array when the effect should run only once after the initial render, such as for initial data fetching or one-time setup.

### No Dependency Array

```typescript
useEffect(() => {
  // This runs after every render
});
```

Omitting the dependency array causes the effect to run after every render. This is rarely what you want and can lead to performance issues.

### With Dependencies

```typescript
useEffect(() => {
  // This runs after the initial render and whenever any dependency changes
}, [dependency1, dependency2]);
```

Include all values from the component scope that change over time and are used by the effect.

### Dependency Rules

1. **Include all external values used in the effect**
   - Props, state, context, and any other values defined outside the effect

2. **Don't omit dependencies**
   - React's ESLint rules will warn you about missing dependencies

3. **Use functional updates for state**
   - If you update state based on previous state, use the functional form to avoid dependencies

   ```typescript
   // Good: No need to include count in dependencies
   useEffect(() => {
     const timer = setInterval(() => {
       setCount(c => c + 1);
     }, 1000);
     return () => clearInterval(timer);
   }, []);
   
   // Bad: Requires count in dependencies
   useEffect(() => {
     const timer = setInterval(() => {
       setCount(count + 1);
     }, 1000);
     return () => clearInterval(timer);
   }, [count]); // This will run the effect every time count changes
   ```

4. **Use object destructuring for specific properties**
   - If you only need specific properties from an object, destructure them to avoid unnecessary effect triggers

   ```typescript
   // Good: Effect only runs when user.name changes
   const { name } = user;
   useEffect(() => {
     document.title = `Hello, ${name}`;
   }, [name]);
   
   // Bad: Effect runs when any property of user changes
   useEffect(() => {
     document.title = `Hello, ${user.name}`;
   }, [user]);
   ```

## Cleanup Function

The cleanup function is returned from the effect and runs before the component unmounts or before the effect runs again.

### When to Use Cleanup

Use cleanup to:

1. **Cancel subscriptions**
2. **Clear timers**
3. **Remove event listeners**
4. **Cancel in-flight API requests**
5. **Clean up resources** that won't be used anymore

### Cleanup Example

```typescript
useEffect(() => {
  // Set up subscription
  const subscription = someAPI.subscribe();
  
  // Return cleanup function
  return () => {
    // Clean up subscription
    subscription.unsubscribe();
  };
}, [someAPI]);
```

### Preventing Memory Leaks

A common pattern to prevent memory leaks with async operations:

```typescript
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    try {
      const data = await api.fetchSomething();
      if (isMounted) {
        // Only update state if component is still mounted
        setState(data);
      }
    } catch (error) {
      if (isMounted) {
        setError(error);
      }
    }
  };
  
  fetchData();
  
  return () => {
    isMounted = false;
  };
}, [api]);
```

## Common Use Cases

### Data Fetching

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!userId) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    async function fetchUser() {
      try {
        const data = await api.getUser(userId);
        if (isMounted) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchUser();
    
    return () => {
      isMounted = false;
    };
  }, [userId, api]);
  
  // Component rendering
}
```

### Subscriptions

```typescript
function NotificationListener({ userId }) {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (!userId) return;
    
    // Set up subscription
    const unsubscribe = notificationService.subscribe(userId, (newNotification) => {
      setNotifications(prev => [...prev, newNotification]);
    });
    
    // Clean up subscription
    return () => unsubscribe();
  }, [userId, notificationService]);
  
  // Component rendering
}
```

### DOM Manipulation

```typescript
function AutoFocusInput({ autoFocus }) {
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  return <input ref={inputRef} />;
}
```

### Timers

```typescript
function Countdown({ seconds, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(time => time - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);
  
  // Component rendering
}
```

### Event Listeners

```typescript
function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Component rendering
}
```

## Best Practices

### 1. Keep Effects Pure

Effects should be pure functions without side effects beyond their intended purpose.

```typescript
// Good: Pure effect
useEffect(() => {
  document.title = `${count} new messages`;
}, [count]);

// Bad: Impure effect with unrelated side effects
useEffect(() => {
  document.title = `${count} new messages`;
  localStorage.setItem('lastVisit', Date.now()); // Unrelated side effect
}, [count]);
```

### 2. Split Unrelated Logic into Separate Effects

Each effect should have a single responsibility.

```typescript
// Good: Separate effects for separate concerns
useEffect(() => {
  document.title = `${count} new messages`;
}, [count]);

useEffect(() => {
  localStorage.setItem('lastVisit', Date.now());
}, []);

// Bad: Multiple unrelated concerns in one effect
useEffect(() => {
  document.title = `${count} new messages`;
  localStorage.setItem('lastVisit', Date.now());
}, [count]);
```

### 3. Use Custom Hooks for Reusable Effects

Extract common effect patterns into custom hooks.

```typescript
// Custom hook for document title
function useDocumentTitle(title) {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title;
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
}

// Usage
function MessagePage({ count }) {
  useDocumentTitle(`${count} new messages`);
  // Rest of component
}
```

### 4. Handle Race Conditions

When dealing with async operations, handle potential race conditions.

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    let isCurrent = true;
    
    async function fetchUser() {
      const userData = await api.getUser(userId);
      if (isCurrent) {
        setUser(userData);
      }
    }
    
    fetchUser();
    
    return () => {
      isCurrent = false;
    };
  }, [userId, api]);
  
  // Component rendering
}
```

### 5. Use AbortController for Fetch Requests

For fetch requests, use AbortController to cancel in-flight requests.

```typescript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!query) return;
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    async function fetchResults() {
      try {
        const data = await fetch(`/api/search?q=${query}`, { signal });
        const json = await data.json();
        setResults(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }
    
    fetchResults();
    
    return () => controller.abort();
  }, [query]);
  
  // Component rendering
}
```

### 6. Avoid Infinite Loops

Be careful with effects that update state which is also a dependency.

```typescript
// Bad: Infinite loop
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1); // Updates state that's a dependency
  }, [count]); // This will cause an infinite loop
  
  return <div>{count}</div>;
}

// Good: Using functional update to avoid dependency
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(c => c + 1); // Functional update doesn't need count as dependency
  }, []); // Runs only once
  
  return <div>{count}</div>;
}
```

### 7. Use Refs for Values You Want to Read but Not React To

If you need to access the latest value of a prop or state but don't want to trigger an effect when it changes, use a ref.

```typescript
function IntervalCounter({ step }) {
  const [count, setCount] = useState(0);
  const stepRef = useRef(step);
  
  // Update ref when prop changes
  useEffect(() => {
    stepRef.current = step;
  }, [step]);
  
  // Use ref in interval without adding step as a dependency
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + stepRef.current);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []); // No need to include step
  
  return <div>{count}</div>;
}
```

## Anti-patterns

### 1. Missing Dependencies

```typescript
// Bad: Missing dependency
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    async function fetchProduct() {
      const data = await api.getProduct(productId);
      setProduct(data);
    }
    
    fetchProduct();
  }, []); // Missing productId dependency
  
  // Component rendering
}

// Good: Including all dependencies
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    async function fetchProduct() {
      const data = await api.getProduct(productId);
      setProduct(data);
    }
    
    fetchProduct();
  }, [productId, api]); // All dependencies included
  
  // Component rendering
}
```

### 2. Unnecessary Object Creation in Dependencies

```typescript
// Bad: New object created on every render
function UserList({ filter }) {
  useEffect(() => {
    fetchUsers({ status: filter, sortBy: 'name' }); // New object on every render
  }, [filter, { status: filter, sortBy: 'name' }]); // Object reference changes every time
  
  // Component rendering
}

// Good: Create object inside effect or memoize it
function UserList({ filter }) {
  useEffect(() => {
    const filterOptions = { status: filter, sortBy: 'name' };
    fetchUsers(filterOptions);
  }, [filter]); // Only depends on filter
  
  // Component rendering
}
```

### 3. Using useEffect for Derived State

```typescript
// Bad: Using effect for derived state
function ProductList({ products }) {
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    setFilteredProducts(
      products.filter(product => product.inStock)
    );
  }, [products]);
  
  // Component rendering
}

// Good: Calculate derived state during render
function ProductList({ products }) {
  // Calculate derived state directly
  const filteredProducts = products.filter(product => product.inStock);
  
  // Or use useMemo for expensive calculations
  const filteredProducts = useMemo(() => {
    return products.filter(product => product.inStock);
  }, [products]);
  
  // Component rendering
}
```

### 4. Fetching Without Cleanup

```typescript
// Bad: No cleanup for fetch
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    async function fetchUser() {
      const data = await api.getUser(userId);
      setUser(data); // Might set state after component unmounts
    }
    
    fetchUser();
  }, [userId, api]);
  
  // Component rendering
}

// Good: With cleanup
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function fetchUser() {
      const data = await api.getUser(userId);
      if (isMounted) {
        setUser(data);
      }
    }
    
    fetchUser();
    
    return () => {
      isMounted = false;
    };
  }, [userId, api]);
  
  // Component rendering
}
```

### 5. Overusing useEffect

```typescript
// Bad: Overusing effects
function ProfileForm({ user }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Unnecessary effect
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);
  
  // Component rendering
}

// Good: Initialize state directly
function ProfileForm({ user }) {
  // Initialize state with props
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  
  // Update state when user prop changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user.name, user.email]);
  
  // Component rendering
}
```

## Examples

### Data Fetching with Error Handling and Loading State

```typescript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!userId) return;
    
    let isMounted = true;
    setIsLoading(true);
    
    async function fetchUser() {
      try {
        const data = await api.getUser(userId);
        if (isMounted) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    fetchUser();
    
    return () => {
      isMounted = false;
    };
  }, [userId, api]);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No user found</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### Debounced Search Input

```typescript
function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');
  
  // Debounce the search query
  useEffect(() => {
    if (!query) {
      onSearch('');
      return;
    }
    
    const debounceTimeout = setTimeout(() => {
      onSearch(query);
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [query, onSearch]);
  
  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Syncing with localStorage

```typescript
function useLocalStorage(key, initialValue) {
  // Get stored value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // Update localStorage when storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setStoredValue];
}

// Usage
function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  
  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode
      </button>
    </div>
  );
}
```

### Handling WebSocket Connections

```typescript
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // Connect to WebSocket
    const socket = new WebSocket(`wss://chat.example.com/room/${roomId}`);
    
    // Set up event listeners
    socket.addEventListener('open', () => {
      console.log('Connected to chat room:', roomId);
    });
    
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    });
    
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    // Clean up on unmount or roomId change
    return () => {
      console.log('Disconnecting from chat room:', roomId);
      socket.close();
    };
  }, [roomId]);
  
  // Component rendering
}
```

## References

- [React useEffect Documentation](https://reactjs.org/docs/hooks-effect.html)
- [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/) by Dan Abramov
- [React Hooks: Compound Components](https://kentcdodds.com/blog/compound-components-with-react-hooks) by Kent C. Dodds
- [How to Fetch Data with React Hooks](https://www.robinwieruch.de/react-hooks-fetch-data/) by Robin Wieruch
- [Mikhail Ajaj Portfolio Project useEffect Best Practices](../best-practices/use-effect-best-practices.md)

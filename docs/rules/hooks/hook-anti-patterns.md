# Hook Anti-patterns

This document outlines common anti-patterns when using React hooks in the Mikhail Ajaj Portfolio project and how to avoid them.

## Table of Contents

1. [Introduction](#introduction)
2. [Breaking the Rules of Hooks](#breaking-the-rules-of-hooks)
3. [Dependency Array Issues](#dependency-array-issues)
4. [State Management Anti-patterns](#state-management-anti-patterns)
5. [Effect Anti-patterns](#effect-anti-patterns)
6. [Performance Anti-patterns](#performance-anti-patterns)
7. [Custom Hook Anti-patterns](#custom-hook-anti-patterns)
8. [References](#references)

## Introduction

While hooks provide a powerful way to use state and other React features, there are common pitfalls that can lead to bugs, performance issues, and maintenance problems. This document identifies these anti-patterns and provides guidance on how to avoid them.

For general hook guidelines, see the [main hooks README](./README.md).

## Breaking the Rules of Hooks

### 1. Conditional Hook Calls

**Anti-pattern:**
```jsx
function Component(props) {
  // ❌ Bad: Conditional hook call
  if (props.condition) {
    useEffect(() => {
      // Effect code
    }, []);
  }
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function Component(props) {
  // ✅ Good: Always call the hook
  useEffect(() => {
    if (props.condition) {
      // Effect code
    }
  }, [props.condition]);
  
  return <div>...</div>;
}
```

### 2. Hooks in Loops

**Anti-pattern:**
```jsx
function Component(props) {
  // ❌ Bad: Hook in a loop
  props.items.forEach(item => {
    const [state, setState] = useState(item.initialState);
    // Use state
  });
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function Component(props) {
  // ✅ Good: Use a single state object
  const [itemStates, setItemStates] = useState(
    props.items.reduce((acc, item) => {
      acc[item.id] = item.initialState;
      return acc;
    }, {})
  );
  
  // Update a specific item's state
  const updateItemState = (itemId, newState) => {
    setItemStates(prev => ({
      ...prev,
      [itemId]: newState
    }));
  };
  
  return <div>...</div>;
}
```

### 3. Hooks in Regular Functions

**Anti-pattern:**
```jsx
function Component() {
  const data = [];
  
  // ❌ Bad: Hook in a regular function
  function processData() {
    const [processed, setProcessed] = useState(false);
    // Process data
    return processed ? 'Processed' : 'Raw';
  }
  
  return <div>{processData()}</div>;
}
```

**Correct approach:**
```jsx
function Component() {
  const [processed, setProcessed] = useState(false);
  const data = [];
  
  // ✅ Good: Regular function without hooks
  function processData() {
    // Process data
    return processed ? 'Processed' : 'Raw';
  }
  
  return <div>{processData()}</div>;
}
```

## Dependency Array Issues

### 1. Missing Dependencies

**Anti-pattern:**
```jsx
function Component(props) {
  const { id, fetchData } = props;
  
  // ❌ Bad: Missing dependencies
  useEffect(() => {
    fetchData(id);
  }, []); // Missing id and fetchData
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function Component(props) {
  const { id, fetchData } = props;
  
  // ✅ Good: All dependencies included
  useEffect(() => {
    fetchData(id);
  }, [id, fetchData]);
  
  return <div>...</div>;
}
```

### 2. Unnecessary Dependencies

**Anti-pattern:**
```jsx
function Component() {
  const [count, setCount] = useState(0);
  
  // Derived value
  const doubledCount = count * 2;
  
  // ❌ Bad: Unnecessary dependency
  useEffect(() => {
    document.title = `Count: ${count}, Doubled: ${doubledCount}`;
  }, [count, doubledCount]); // doubledCount is derived from count
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function Component() {
  const [count, setCount] = useState(0);
  
  // ✅ Good: Only necessary dependencies
  useEffect(() => {
    const doubledCount = count * 2;
    document.title = `Count: ${count}, Doubled: ${doubledCount}`;
  }, [count]);
  
  return <div>...</div>;
}
```

### 3. Object and Array Dependencies

**Anti-pattern:**
```jsx
function Component(props) {
  // ❌ Bad: New object created on every render
  useEffect(() => {
    fetchData(props.id);
  }, [{ id: props.id }]); // Object reference changes on every render
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function Component(props) {
  // ✅ Good: Use primitive values as dependencies
  useEffect(() => {
    fetchData(props.id);
  }, [props.id]);
  
  // If you need to use an object:
  const options = useMemo(() => ({ id: props.id }), [props.id]);
  
  useEffect(() => {
    fetchDataWithOptions(options);
  }, [options]);
  
  return <div>...</div>;
}
```

## State Management Anti-patterns

### 1. State Updates Based on Previous State

**Anti-pattern:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // ❌ Bad: Updating state based on current state value
  const increment = () => {
    setCount(count + 1);
    setCount(count + 1); // This will not work as expected
  };
  
  return (
    <button onClick={increment}>Increment</button>
  );
}
```

**Correct approach:**
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // ✅ Good: Using functional updates
  const increment = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1); // This will work correctly
  };
  
  return (
    <button onClick={increment}>Increment</button>
  );
}
```

### 2. Derived State

**Anti-pattern:**
```jsx
function ProductList({ products }) {
  // ❌ Bad: Derived state
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    setFilteredProducts(
      products.filter(product => 
        filter === 'all' || product.category === filter
      )
    );
  }, [products, filter]);
  
  return (
    <div>
      {/* UI code */}
    </div>
  );
}
```

**Correct approach:**
```jsx
function ProductList({ products }) {
  // ✅ Good: Only store the filter in state
  const [filter, setFilter] = useState('all');
  
  // Calculate filtered products during render
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      filter === 'all' || product.category === filter
    );
  }, [products, filter]);
  
  return (
    <div>
      {/* UI code */}
    </div>
  );
}
```

### 3. Complex State Structures

**Anti-pattern:**
```jsx
function UserProfile() {
  // ❌ Bad: Complex nested state
  const [user, setUser] = useState({
    personal: {
      name: '',
      email: '',
      address: {
        street: '',
        city: '',
        zipCode: ''
      }
    },
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: false
      }
    }
  });
  
  const updateEmail = (email) => {
    setUser({
      ...user,
      personal: {
        ...user.personal,
        email
      }
    });
  };
  
  // More update functions...
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function UserProfile() {
  // ✅ Good: Split complex state
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: ''
  });
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    zipCode: ''
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    emailNotifications: true,
    pushNotifications: false
  });
  
  const updateEmail = (email) => {
    setPersonalInfo(prev => ({
      ...prev,
      email
    }));
  };
  
  // More update functions...
  
  return <div>...</div>;
}
```

## Effect Anti-patterns

### 1. Effects for Computed Values

**Anti-pattern:**
```jsx
function ProductSummary({ products }) {
  const [totalPrice, setTotalPrice] = useState(0);
  
  // ❌ Bad: Using effect for computed value
  useEffect(() => {
    setTotalPrice(
      products.reduce((sum, product) => sum + product.price, 0)
    );
  }, [products]);
  
  return <div>Total: ${totalPrice}</div>;
}
```

**Correct approach:**
```jsx
function ProductSummary({ products }) {
  // ✅ Good: Compute value during render
  const totalPrice = useMemo(() => {
    return products.reduce((sum, product) => sum + product.price, 0);
  }, [products]);
  
  return <div>Total: ${totalPrice}</div>;
}
```

### 2. Effects with Multiple Concerns

**Anti-pattern:**
```jsx
function UserDashboard({ userId }) {
  // ❌ Bad: Effect with multiple concerns
  useEffect(() => {
    // Fetch user data
    fetchUserData(userId);
    
    // Set up event listeners
    window.addEventListener('resize', handleResize);
    
    // Update document title
    document.title = `Dashboard for User ${userId}`;
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [userId]);
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function UserDashboard({ userId }) {
  // ✅ Good: Separate effects for separate concerns
  
  // Fetch user data
  useEffect(() => {
    fetchUserData(userId);
  }, [userId]);
  
  // Set up event listeners
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Update document title
  useEffect(() => {
    document.title = `Dashboard for User ${userId}`;
  }, [userId]);
  
  return <div>...</div>;
}
```

### 3. Effects Without Cleanup

**Anti-pattern:**
```jsx
function ChatRoom({ roomId }) {
  // ❌ Bad: Missing cleanup
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
  }, [roomId]);
  
  return <div>...</div>;
}
```

**Correct approach:**
```jsx
function ChatRoom({ roomId }) {
  // ✅ Good: Proper cleanup
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  
  return <div>...</div>;
}
```

## Performance Anti-patterns

### 1. Expensive Calculations Without Memoization

**Anti-pattern:**
```jsx
function DataGrid({ data, columns }) {
  // ❌ Bad: Expensive calculation on every render
  const processedData = data.map(item => {
    // Expensive processing...
    return transformData(item);
  });
  
  return (
    <table>
      {/* Render table with processedData */}
    </table>
  );
}
```

**Correct approach:**
```jsx
function DataGrid({ data, columns }) {
  // ✅ Good: Memoized expensive calculation
  const processedData = useMemo(() => {
    return data.map(item => {
      // Expensive processing...
      return transformData(item);
    });
  }, [data]);
  
  return (
    <table>
      {/* Render table with processedData */}
    </table>
  );
}
```

### 2. Inline Function Definitions

**Anti-pattern:**
```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      {/* ❌ Bad: New function created on every render */}
      <ChildComponent onClick={() => setCount(count + 1)} />
    </div>
  );
}
```

**Correct approach:**
```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  // ✅ Good: Memoized callback
  const handleClick = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);
  
  return (
    <div>
      <ChildComponent onClick={handleClick} />
    </div>
  );
}
```

### 3. Over-optimization

**Anti-pattern:**
```jsx
function SimpleComponent({ text }) {
  // ❌ Bad: Unnecessary optimization for simple values
  const displayText = useMemo(() => {
    return `Hello, ${text}!`;
  }, [text]);
  
  // ❌ Bad: Unnecessary callback memoization for simple handler
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return (
    <button onClick={handleClick}>{displayText}</button>
  );
}
```

**Correct approach:**
```jsx
function SimpleComponent({ text }) {
  // ✅ Good: Simple calculations don't need memoization
  const displayText = `Hello, ${text}!`;
  
  // ✅ Good: Simple handlers don't need memoization
  // unless passed to memoized child components
  const handleClick = () => {
    console.log('Clicked');
  };
  
  return (
    <button onClick={handleClick}>{displayText}</button>
  );
}
```

## Custom Hook Anti-patterns

### 1. Returning Too Much

**Anti-pattern:**
```jsx
// ❌ Bad: Hook returns too much
function useUserData(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  
  // Fetch and update logic...
  
  return {
    user,
    loading,
    error,
    lastUpdated,
    notifications,
    friends,
    posts,
    updateUser,
    refreshData,
    addFriend,
    removeFriend,
    createPost,
    deletePost
  };
}
```

**Correct approach:**
```jsx
// ✅ Good: Split into focused hooks
function useUserProfile(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch and update logic...
  
  return { user, loading, error, updateUser, refreshData };
}

function useUserNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  
  // Notification logic...
  
  return { notifications, markAsRead, clearAll };
}

function useUserFriends(userId) {
  const [friends, setFriends] = useState([]);
  
  // Friends logic...
  
  return { friends, addFriend, removeFriend };
}

function useUserPosts(userId) {
  const [posts, setPosts] = useState([]);
  
  // Posts logic...
  
  return { posts, createPost, deletePost };
}
```

### 2. Side Effects in Hook Body

**Anti-pattern:**
```jsx
// ❌ Bad: Side effects in hook body
function useCurrentUser() {
  const [user, setUser] = useState(null);
  
  // Side effect outside of useEffect
  fetch('/api/user')
    .then(response => response.json())
    .then(data => setUser(data));
  
  return user;
}
```

**Correct approach:**
```jsx
// ✅ Good: Side effects in useEffect
function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    fetch('/api/user')
      .then(response => response.json())
      .then(data => {
        if (isMounted) {
          setUser(data);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return { user, loading, error };
}
```

### 3. Non-Reusable Custom Hooks

**Anti-pattern:**
```jsx
// ❌ Bad: Non-reusable hook tied to specific UI
function useProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);
  
  // UI-specific logic
  const renderProductList = () => {
    if (loading) {
      return <div>Loading...</div>;
    }
    
    return (
      <ul>
        {products.map(product => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    );
  };
  
  return { products, loading, renderProductList };
}
```

**Correct approach:**
```jsx
// ✅ Good: Reusable hook focused on data
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    fetchProducts()
      .then(data => {
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return { products, loading, error };
}

// UI component uses the hook
function ProductList() {
  const { products, loading, error } = useProducts();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## References

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)
- [Hooks FAQ](https://reactjs.org/docs/hooks-faq.html)
- [useEffect Complete Guide](https://overreacted.io/a-complete-guide-to-useeffect/)
- [Custom Hooks Patterns](./hook-patterns.md)
- [Mikhail Ajaj Portfolio Shared Hooks](../../shared/hooks/README.md)

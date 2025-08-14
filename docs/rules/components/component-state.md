# Component State Management Guidelines

Managing state effectively is crucial for building predictable and maintainable React components. This document provides guidelines for handling component state within the Mikhail Ajaj Portfolio project, primarily focusing on local component state using React hooks.

## Core Principles

-   **Keep State Local**: Whenever possible, keep state as close to where it's needed. Avoid lifting state up unnecessarily.
-   **Minimal State**: Only store data in state that is truly necessary for rendering or component logic and changes over time. Avoid deriving state from props or other state if it can be calculated during rendering.
-   **Immutability**: Treat state as immutable. When updating state (especially objects or arrays), always create new instances instead of modifying the existing ones directly. This prevents bugs and ensures React detects changes correctly.
-   **Choose the Right Tool**: Use the appropriate React hook (`useState`, `useReducer`) based on the complexity of the state logic.

## State Management Tools

### 1. `useState` Hook

-   **Use Case**: Ideal for simple state values (booleans, strings, numbers) or simple objects/arrays where updates are straightforward replacements.
-   **Best Practices**:
    *   Use descriptive names for state variables and setter functions (e.g., `const [isLoading, setIsLoading] = useState(false);`).
    *   Group related simple state variables if they often change together, potentially using `useReducer` instead if logic becomes complex.
    *   For objects/arrays, always use the setter function with a new object/array reference:
        ```typescript
        // Bad: Mutating state directly
        // list.push(newItem); setList(list);
        // Good: Creating a new array
        setList([...list, newItem]);
        setList(prevList => [...prevList, newItem]);

        // Bad: Mutating object property
        // user.name = newName; setUser(user);
        // Good: Creating a new object
        setUser({...user, name: newName });
        setUser(prevUser => ({...prevUser, name: newName }));
        ```

### 2. `useReducer` Hook

-   **Use Case**: Suitable for more complex state logic involving multiple sub-values or when the next state depends on the previous one in intricate ways. Often preferred when state updates involve multiple steps or are triggered by different action types.
-   **Best Practices**:
    *   Define clear action types (often using string constants or enums).
    *   Keep the reducer function pure – it should only compute the next state based on the current state and action, without side effects.
    *   The reducer must return a new state object/value if changes occur, or the existing state if no changes are needed.
    *   Consider co-locating the reducer function and initial state near the component or extracting them into a separate file if the logic is substantial.

    ```typescript
    interface State { count: number; error: string | null; }
    type Action =
      | { type: 'increment' }
      | { type: 'decrement' }
      | { type: 'setError'; payload: string };

    const initialState: State = { count: 0, error: null };

    function reducer(state: State, action: Action): State {
      switch (action.type) {
        case 'increment':
          return { ...state, count: state.count + 1 };
        case 'decrement':
          return { ...state, count: state.count - 1 };
        case 'setError':
          return { ...state, error: action.payload };
        default:
          return state; // Or throw new Error('Unknown action type');
      }
    }

    function CounterComponent() {
      const [state, dispatch] = useReducer(reducer, initialState);

      return (
        <div>
          Count: {state.count}
          <button onClick={() => dispatch({ type: 'increment' })}>+</button>
          <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
          {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
        </div>
      );
    }
    ```

## Lifting State Up

-   **When**: If multiple sibling components need access to the same state, or if a child component needs to modify state owned by an ancestor, lift the state up to their nearest common ancestor component.
-   **How**: The common ancestor holds the state and passes it down to the relevant children via props. It also passes down callback functions (event handlers) via props that allow children to trigger state updates in the ancestor.
-   **Considerations**: Lifting state up too high can lead to "prop drilling" (passing props through many intermediate components). If this becomes excessive, consider using:
    *   **Component Composition**: Pass components as props (e.g., using `children` or specific slots) to avoid intermediate components needing to know about the props.
    *   **React Context**: Suitable for global state or state needed by many components at different levels (e.g., theme, user authentication). Use judiciously as it can make component reuse harder. (See [React Context Guidelines](../react/context.md) - *to be created*).
    *   **Global State Management Libraries** (Redux, Zustand, etc.): For complex application-wide state. (See project-specific guidelines if applicable).

## Derived State

Avoid storing data in state if it can be calculated directly from props or existing state during rendering. This simplifies state management and prevents synchronization issues.

```typescript
// Bad: Storing derived state
// const [fullName, setFullName] = useState('');
// useEffect(() => {
//   setFullName(`${firstName} ${lastName}`);
// }, [firstName, lastName]);

// Good: Calculating derived data during render
const fullName = `${firstName} ${lastName}`;

return <div>{fullName}</div>;
```

By carefully choosing where and how to manage state, you can create components that are easier to understand, debug, and maintain.
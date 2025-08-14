# Rendering Optimization Guidelines

Optimizing React component rendering is crucial for a smooth and responsive user interface. Unnecessary re-renders can lead to performance degradation, especially in complex applications like Mikhail Ajaj Portfolio.

## Understanding Re-renders

React components re-render when:

1.  Their internal state changes (via `useState` or `useReducer`).
2.  Their props change (a shallow comparison of props by default).
3.  Their parent component re-renders (causing children to re-render by default, even if their props haven't changed).
4.  Their context value changes (if they consume context via `useContext`).

## Optimization Techniques

### 1. `React.memo()`

-   **What**: A Higher-Order Component (HOC) that memoizes your functional component. React will skip rendering the component if its props have not changed (using shallow comparison).
-   **When**: Use for components that:
    *   Render often.
    *   Usually render with the same props.
    *   Are reasonably complex to render.
    *   Are pure (render the same output for the same props).
-   **How**: Wrap the component export with `React.memo()`.
    ```typescript
    import React from 'react';

    interface MyComponentProps {
      value: string;
      // ... other props
    }

    const MyComponent: React.FC<MyComponentProps> = ({ value }) => {
      console.log('Rendering MyComponent');
      return <div>{value}</div>;
    };

    // Memoize the component
    export default React.memo(MyComponent);
    ```
-   **Custom Comparison**: You can provide a custom comparison function as the second argument to `React.memo` if shallow comparison is insufficient (rarely needed).

### 2. `useMemo()`

-   **What**: A hook that memoizes the result of an expensive calculation. The calculation function only re-runs if one of its dependencies changes.
-   **When**: Use for:
    *   Computationally expensive calculations within a component that shouldn't run on every render.
    *   Ensuring referential stability for objects or arrays passed as props to memoized child components (`React.memo`).
-   **How**:
    ```typescript
    import React, { useMemo } from 'react';

    function calculateExpensiveValue(a: number, b: number): number {
      console.log('Calculating expensive value...');
      // Simulate expensive calculation
      return a * b + a - b;
    }

    interface MyComponentProps { propA: number; propB: number; }

    const MyComponent: React.FC<MyComponentProps> = ({ propA, propB }) => {
      // Memoize the result of the calculation
      const expensiveValue = useMemo(() => {
        return calculateExpensiveValue(propA, propB);
      }, [propA, propB]); // Dependencies: re-calculate only if propA or propB changes

      // Example: Memoizing an object for child prop
      const itemStyle = useMemo(() => ({
         padding: 10,
         margin: propA > 5 ? 5 : 2 // Style depends on propA
      }), [propA]);

      return (
        <div>
          <p>Expensive Value: {expensiveValue}</p>
          {/* <MemoizedChildComponent style={itemStyle} /> */}
        </div>
      );
    };
    ```

### 3. `useCallback()`

-   **What**: A hook that memoizes a callback function. It returns the same function instance between renders as long as its dependencies haven't changed.
-   **When**: Primarily used when passing callbacks as props to memoized child components (`React.memo`). If you pass a new function instance on every render, `React.memo`'s shallow prop comparison will fail, causing the child to re-render unnecessarily.
-   **How**:
    ```typescript
    import React, { useState, useCallback } from 'react';
    import MemoizedButton from './MemoizedButton'; // Assume Button is wrapped in React.memo

    const ParentComponent: React.FC = () => {
      const [count, setCount] = useState(0);

      // Memoize the callback function
      const handleClick = useCallback(() => {
        console.log('Button clicked!');
        // If the callback depends on state/props, include them in dependencies
        // setCount(prevCount => prevCount + 1); // Example dependency
      }, []); // Empty dependencies: function instance never changes

      // Example with dependency:
      // const handleUpdate = useCallback((value: string) => {
      //   updateItem(itemId, value); // Assume updateItem and itemId are stable or included
      // }, [itemId, updateItem]);

      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => setCount(c => c + 1)}>Increment</button>
          {/* Pass the memoized callback to the memoized child */}
          <MemoizedButton onClick={handleClick}>Click Me</MemoizedButton>
        </div>
      );
    };
    ```

### 4. Minimize Work During Render

-   Keep render logic fast. Avoid complex computations directly in the render path if possible. Use `useMemo` if necessary.
-   Avoid creating new objects or arrays directly in the render path if they are passed as props to memoized children, as this breaks referential equality. Use `useMemo` or `useState` if needed.

### 5. Virtualization (Windowing)

-   For long lists or large tables, render only the items currently visible in the viewport. Libraries like `react-window` or `react-virtualized` can help implement this.

### 6. Server Components

-   Leverage Next.js Server Components. They render on the server and don't contribute to client-side re-renders unless interacting with Client Components. Offload non-interactive parts of the UI to Server Components.

## Measuring Rendering Performance

-   **React DevTools Profiler**: Use the profiler to record interactions, identify components that render unnecessarily, and measure the time spent rendering. Look for components that render frequently or take a long time.
-   **`console.log` / `console.time`**: Simple logging within components can help understand when they render, but use sparingly and remove before production.

## Cautions

-   **Premature Optimization**: Don't overuse `React.memo`, `useMemo`, and `useCallback`. Measure performance first and apply optimizations where bottlenecks actually exist. Memoization itself has a small overhead.
-   **Dependency Arrays**: Ensure dependency arrays for `useMemo`, `useCallback`, and `useEffect` are correct. Missing dependencies can cause stale closures and bugs. Including unnecessary dependencies can negate the benefits of memoization. Use ESLint plugins (`eslint-plugin-react-hooks`) to help manage dependencies.

By applying these techniques thoughtfully and measuring their impact, you can significantly improve the rendering performance of the Mikhail Ajaj Portfolio.
# Component Lifecycle Guidelines

Understanding the component lifecycle is fundamental to managing side effects, performance, and state correctly in React. While functional components with hooks have largely replaced class component lifecycle methods, the underlying concepts remain relevant. This document provides an overview of the lifecycle phases and how they map to React Hooks.

## Lifecycle Phases (Conceptual)

React components generally go through three main phases:

1.  **Mounting**: The component instance is created and inserted into the DOM for the first time.
2.  **Updating**: The component re-renders due to changes in its props or state.
3.  **Unmounting**: The component instance is removed from the DOM.

## Class Component Lifecycle Methods (Legacy Reference)

These methods are specific to class components and are less commonly used in new code within the Mikhail Ajaj Portfolio project, but understanding them provides context for hooks:

*   **Mounting:**
    *   `constructor()`: Initialize state, bind event handlers. (Runs once).
    *   `static getDerivedStateFromProps()`: Calculate state updates based on prop changes before rendering. (Use rarely).
    *   `render()`: Returns the JSX to be rendered. (Required).
    *   `componentDidMount()`: Component is in the DOM. Ideal place for initial data fetching, setting up subscriptions, or interacting with the DOM. (Runs once after initial render).
*   **Updating:**
    *   `static getDerivedStateFromProps()`: (Runs before every render on update).
    *   `shouldComponentUpdate()`: Determine if a re-render is necessary based on prop/state changes. Performance optimization. (Use `React.memo` for functional components).
    *   `render()`: Returns the updated JSX.
    *   `getSnapshotBeforeUpdate()`: Capture some information from the DOM (e.g., scroll position) right before changes are committed. (Use rarely).
    *   `componentDidUpdate()`: Component has re-rendered. Place for side effects based on prop/state changes (e.g., fetching data when an ID prop changes), but guard against infinite loops.
*   **Unmounting:**
    *   `componentWillUnmount()`: Component is about to be removed from the DOM. Ideal place for cleanup (canceling network requests, removing event listeners, clearing timers, cleaning up subscriptions).
*   **Error Handling:**
    *   `static getDerivedStateFromError()`: Render fallback UI after an error is thrown by a descendant component.
    *   `componentDidCatch()`: Log error information after an error is thrown by a descendant component.

## Mapping Lifecycle Concepts to Hooks (Functional Components)

Hooks provide a more direct way to tap into lifecycle concepts without the boilerplate of class components.

*   **Initialization (like `constructor`)**:
    *   State initialization happens directly in `useState` or `useReducer` calls.
    *   Refs are initialized with `useRef`.
    *   Logic that runs only once on mount is placed inside `useEffect` with an empty dependency array (`[]`).

*   **Mounting Side Effects (like `componentDidMount`)**:
    *   Use `useEffect` with an empty dependency array (`[]`). The effect function runs once after the initial render.

    ```typescript
    useEffect(() => {
      // Runs once after initial render
      console.log('Component mounted!');
      const subscription = setupSubscription();
      // Cleanup function (see Unmounting)
      return () => {
        subscription.unsubscribe();
      };
    }, []); // Empty dependency array means run once on mount
    ```

*   **Updating Side Effects (like `componentDidUpdate`)**:
    *   Use `useEffect` with a dependency array containing the props or state values that should trigger the effect when they change.

    ```typescript
    useEffect(() => {
      // Runs after initial render AND after updates if userId changes
      console.log(`Fetching data for user ${userId}`);
      fetchData(userId);
    }, [userId]); // Dependency array includes userId
    ```

*   **Preventing Re-renders (like `shouldComponentUpdate`)**:
    *   Wrap the component export in `React.memo()` to memoize it based on props. React will skip rendering if props haven't changed.
    *   Use `useMemo` to memoize expensive calculations within the component.
    *   Use `useCallback` to memoize callback functions passed down to memoized children.

*   **Cleanup (like `componentWillUnmount`)**:
    *   Return a cleanup function from within `useEffect`. This function runs when the component unmounts, or before the effect runs again if dependencies change.

    ```typescript
    useEffect(() => {
      const timerId = setInterval(tick, 1000);
      console.log('Timer started');

      // Cleanup function
      return () => {
        clearInterval(timerId);
        console.log('Timer cleared');
      };
    }, []); // Runs cleanup on unmount
    ```

*   **Getting Previous Props/State (needed for some `componentDidUpdate` logic)**:
    *   There's no direct hook equivalent. Use a `useRef` to manually store the previous value and update it within a `useEffect`.

    ```typescript
    function usePrevious<T>(value: T): T | undefined {
      const ref = useRef<T>();
      useEffect(() => {
        ref.current = value;
      }, [value]);
      return ref.current;
    }

    // Usage in component:
    // const prevCount = usePrevious(count);
    // useEffect(() => {
    //   if (prevCount !== undefined && count > prevCount) {
    //     console.log('Count increased!');
    //   }
    // }, [count, prevCount]);
    ```

*   **Error Handling (like `componentDidCatch`)**:
    *   Use Error Boundaries (which are still class components) higher up the component tree to catch errors in their descendants. There is no direct hook equivalent for catching errors in children.

## Key Takeaway

Focus on using `useEffect` for side effects and cleanup, and `useState`/`useReducer` for state management. Understand the dependency array in `useEffect` to control when effects run, mimicking the behavior of `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`. Use memoization techniques (`React.memo`, `useMemo`, `useCallback`) for performance optimization instead of `shouldComponentUpdate`.
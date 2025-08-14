# Component Props Guidelines

Props (properties) are the primary way to pass data and configuration down the component tree in React. Defining and using props clearly and consistently is essential for component reusability and maintainability. This document outlines guidelines for working with props in the Mikhail Ajaj Portfolio project, leveraging TypeScript for type safety.

## Core Principles

-   **Explicitness**: Clearly define the expected props and their types.
-   **Immutability**: Props should be treated as read-only within the component receiving them. A component should never modify its own props.
-   **Clarity**: Use descriptive prop names that clearly indicate their purpose.
-   **Minimalism**: Only pass down the props that a component actually needs. Avoid passing down large objects if only a few properties are used.

## Defining Props with TypeScript

Always define an interface or type alias for a component's props.

```typescript
import React from 'react';

// Define the props interface
interface UserProfileProps {
  userId: string;
  name: string;
  email?: string; // Optional prop
  isActive: boolean;
  onUpdate: (newName: string) => void; // Function prop
  avatar?: React.ReactNode; // Prop accepting a React element/component
}

const UserProfile: React.FC<UserProfileProps> = ({
  userId,
  name,
  email,
  isActive,
  onUpdate,
  avatar
}) => {
  // Component logic...

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Call the callback prop passed from the parent
    onUpdate(event.target.value);
  };

  return (
    <div>
      {avatar}
      <h2>{name} ({isActive ? 'Active' : 'Inactive'})</h2>
      {email && <p>Email: {email}</p>}
      {/* Example of using the callback */}
      {/* <input type="text" value={name} onChange={handleNameChange} /> */}
      {/* Note: This input should likely be controlled differently in a real app */}
    </div>
  );
};

export default UserProfile;
```

## Best Practices

*   **Use TypeScript Interfaces/Types**: Provides static type checking, improves code understanding, and enables better tooling (autocompletion, refactoring).
*   **Descriptive Names**: Choose names that clearly explain the prop's purpose (e.g., `isLoading` instead of `flag`, `userProfile` instead of `data`).
*   **Specify Optional Props**: Use the `?` syntax for props that are not required (e.g., `email?: string`). Provide default values within the component if necessary.
*   **Default Values**:
    *   Use JavaScript default parameter syntax for simple defaults: `({ name = 'Guest', isActive = false })`.
    *   Ensure default values match the defined types.
*   **Boolean Props**:
    *   Prefer positive naming (e.g., `isOpen`, `isActive`, `isEnabled`) over negative (e.g., `isNotOpen`, `isDisabled`).
    *   Passing the prop name alone implies `true` (e.g., `<Modal isOpen />` is equivalent to `<Modal isOpen={true} />`). Avoid passing `propName={false}` explicitly unless necessary for clarity; omitting the prop is usually sufficient if the default is `false`.
*   **Function Props (Callbacks)**:
    *   Use clear, action-oriented names, often prefixed with `on` (e.g., `onClick`, `onSubmit`, `onNameChange`).
    *   Define the function signature clearly in the TypeScript interface, including parameter types and return type (`void` for typical event handlers).
    *   Use `useCallback` in the parent component when passing callbacks to memoized children (`React.memo`) to prevent unnecessary re-renders.
*   **Avoid Prop Drilling**: If you find yourself passing the same prop through many levels of intermediate components that don't use it, consider:
    *   Component Composition (passing components via `children` or specific slots).
    *   React Context API.
    *   Global state management libraries.
*   **Destructuring Props**: Use object destructuring in the component function signature for cleaner access to props.
*   **Spreading Props (`{...props}`)**:
    *   Use cautiously when wrapping native HTML elements or other components to pass through attributes/props (e.g., passing `...rest` to a `<div>` or `<input>`).
    *   Be explicit about the props your component consumes directly. Avoid over-using spread props on your own components, as it can obscure the component's actual API.
    *   Ensure you are not unintentionally overriding critical props (like `className` or event handlers) when spreading.

```typescript
interface WrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
}

// Example of spreading props onto a native element
const Wrapper: React.FC<WrapperProps> = ({ highlight, className, children, ...rest }) => {
  const wrapperClasses = `wrapper ${highlight ? 'highlight' : ''} ${className || ''}`;

  return (
    <div className={wrapperClasses} {...rest}> {/* Pass remaining div attributes */}
      {children}
    </div>
  );
};
```

By following these guidelines, you can create clear, type-safe, and maintainable component APIs using props.
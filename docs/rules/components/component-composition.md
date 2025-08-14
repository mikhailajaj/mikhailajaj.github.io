# Component Composition Guidelines

Component composition is a core concept in React, allowing you to build complex UIs by combining smaller, reusable components. This document outlines patterns and best practices for composing components effectively in the Mikhail Ajaj Portfolio project.

## Why Composition?

-   **Reusability**: Break down UI into smaller pieces that can be reused across the application.
-   **Maintainability**: Smaller, focused components are easier to understand, modify, and test.
-   **Flexibility**: Easily rearrange or replace parts of the UI by changing how components are composed.
-   **Separation of Concerns**: Isolate different aspects of the UI or logic into distinct components.

## Composition Patterns

### 1. Containment (Using `children`)

This is the most common composition pattern. Components can accept arbitrary children passed to them via the `props.children` prop. This is ideal for generic "box" or "container" components that don't know their content ahead of time.

**Example:** A `Card` component that can contain any content.

```typescript
import React, { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  children: ReactNode; // Accept any valid React node(s) as children
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>
        {children} {/* Render the passed children here */}
      </div>
    </div>
  );
};

export default Card;

// Usage:
// <Card title="Project Details">
//   <p>Some project information...</p>
//   <StatusBadge status="active" />
// </Card>
```

### 2. Specialization (Configuration via Props)

Components can be specialized by passing specific configuration or data via props. This is common for components that render variations of a similar structure.

**Example:** A generic `Button` component specialized via `variant` and `size` props.

```typescript
import React from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;

// Usage:
// <Button variant="danger" size="small" onClick={handleDelete}>Delete</Button>
// <Button variant="secondary">Cancel</Button>
```

### 3. Specific Slots (Dedicated Props for Components)

Instead of generic `children`, a component can define specific props that expect React elements. This provides more structure when a component needs distinct sections filled by the parent.

**Example:** A `PageLayout` component with dedicated `header` and `sidebar` props.

```typescript
import React, { ReactNode } from 'react';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  header: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode; // Main content area
}

const PageLayout: React.FC<PageLayoutProps> = ({ header, sidebar, children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>{header}</header>
      <div className={styles.container}>
        {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;

// Usage:
// <PageLayout
//   header={<AppHeader user={currentUser} />}
//   sidebar={<NavigationMenu items={menuItems} />}
// >
//   <DashboardContent />
// </PageLayout>
```

### 4. Render Props

A component uses a prop whose value is a function that returns a React element. This allows the component to share state or logic with its parent, letting the parent control the rendering. Often replaced by custom hooks in modern React.

**Example:** A `MouseTracker` component sharing mouse coordinates.

```typescript
import React, { useState, ReactNode } from 'react';

interface MouseTrackerProps {
  render: (state: { x: number; y: number }) => ReactNode;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {/* Call the render prop function with the current state */}
      {render(position)}
    </div>
  );
};

// Usage:
// <MouseTracker render={({ x, y }) => (
//   <h1>Mouse position: {x}, {y}</h1>
// )}/>
```

### 5. Higher-Order Components (HOCs) - Less Common Now

A function that takes a component and returns a new component, usually adding extra props or logic. Largely superseded by custom hooks for logic reuse, but still seen occasionally.

**Example:** `withAuth` HOC adding user data.

```typescript
// HOC definition (simplified)
function withAuth(WrappedComponent) {
  return function(props) {
    const user = useAuth(); // Assume useAuth hook exists
    if (!user) return <LoginPage />;
    return <WrappedComponent {...props} user={user} />;
  }
}

// Usage:
// const ProtectedComponent = withAuth(MyComponent);
// <ProtectedComponent someProp="value" />
```

## Choosing the Right Pattern

-   Use **Containment (`children`)** for generic wrappers and layouts.
-   Use **Specialization (Props)** for configurable components with predefined structures.
-   Use **Specific Slots** when a component needs distinct, named sections provided by the parent.
-   Prefer **Custom Hooks** over Render Props and HOCs for sharing non-visual logic and state. Use Render Props if you specifically need the parent to control rendering based on shared state.

By leveraging these composition patterns, you can build flexible, maintainable, and reusable UI components.
# Component Guidelines

This section provides guidelines for designing, structuring, and implementing React components within the Mikhail Ajaj Portfolio. Consistent and well-structured components improve maintainability, reusability, and collaboration.

## Core Principles

-   **Single Responsibility Principle (SRP)**: Components should ideally do one thing well. Avoid creating monolithic components that handle too many concerns (state management, data fetching, complex rendering logic).
-   **Reusability**: Design components with reusability in mind where appropriate. Abstract common UI patterns or logic into shared components.
-   **Composability**: Build complex UIs by composing smaller, focused components together.
-   **Readability**: Write clean, well-formatted, and commented code that is easy for other developers to understand.
-   **Testability**: Structure components in a way that makes them easy to test (unit, integration).

## Key Areas

This section covers the following aspects of component development:

-   **[Component Structure](./component-structure.md)**: Guidelines on organizing the internal structure of a component file.
-   **[Component Composition](./component-composition.md)**: Patterns for combining components effectively.
-   **[Component State](./component-state.md)**: Best practices for managing component state.
-   **[Component Props](./component-props.md)**: Guidelines for defining and using component props.
-   **[Component Lifecycle](./component-lifecycle.md)**: Understanding and utilizing React's component lifecycle (primarily for class components, but relevant concepts apply to hooks).

Refer to the specific documents linked above for detailed rules and implementation guidance. See also the [React Guidelines](../react/README.md) for broader React-specific rules.

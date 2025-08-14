# UI Components: Rules and Guidelines

This document outlines the rules and guidelines for implementing and maintaining UI components in the Mikhail Ajaj Portfolio project.

## Component Library

The project uses shadcn UI as its component library foundation:

1. **Base Components**:
   - Use shadcn UI components as the foundation
   - Extend and customize as needed
   - Follow the shadcn UI naming conventions

2. **Component Location**:
   - Place shared UI components in `shared/components/ui/`
   - Place feature-specific components in `features/feature-name/components/`
   - Place internal feature components in `features/feature-name/_components/`

3. **Component Customization**:
   - Use the `cn()` utility for class name composition
   - Extend shadcn UI components with additional props
   - Maintain accessibility when customizing

## Component Structure

1. **File Organization**:
   - One component per file for primary components
   - Related smaller components can be in the same file
   - Export named components (not default exports)

2. **Component Definition**:
   - Use function declarations for components
   - Use React.memo for performance optimization when appropriate
   - Use TypeScript interfaces for props

3. **Props Structure**:
   - Define a clear interface for component props
   - Use descriptive prop names
   - Provide sensible defaults
   - Use optional props with default values when appropriate

Example:
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'default',
  size = 'md',
  isLoading = false,
  className,
  children,
  ...props
}: ButtonProps) {
  // Component implementation
}
```

## Styling Guidelines

1. **Tailwind CSS**:
   - Use Tailwind CSS for styling
   - Follow the project's Tailwind configuration
   - Use the `cn()` utility for conditional classes

2. **Dark Mode Support**:
   - Implement dark mode support for all components
   - Test components in both light and dark modes
   - Use Tailwind's dark mode classes

3. **Responsive Design**:
   - Design for mobile first, then enhance for larger screens
   - Use Tailwind's responsive prefixes (sm, md, lg, xl)
   - Test on various device sizes

4. **Animation and Transitions**:
   - Use CSS transitions for simple animations
   - Use Framer Motion for complex animations
   - Ensure animations respect reduced motion preferences

## State Management

1. **Component State**:
   - Use React state for simple component state
   - Use useReducer for complex component state
   - Keep state as local as possible

2. **Shared State**:
   - Use Zustand for shared state across components
   - Create focused stores with selectors
   - Avoid prop drilling for deeply nested components

3. **Form State**:
   - Use React Hook Form for form state
   - Use Zod for validation
   - Create reusable form components

## Performance Optimization

1. **Memoization**:
   - Use React.memo for components that render often
   - Use useMemo for expensive computations
   - Use useCallback for event handlers passed to child components

2. **Rendering Optimization**:
   - Avoid unnecessary re-renders
   - Use proper dependency arrays in hooks
   - Implement virtualization for long lists

3. **Code Splitting**:
   - Use dynamic imports for large components
   - Implement route-based code splitting
   - Lazy load components that aren't immediately visible

## Accessibility Guidelines

1. **Semantic HTML**:
   - Use semantic HTML elements
   - Use appropriate ARIA attributes
   - Ensure proper heading hierarchy

2. **Keyboard Navigation**:
   - Ensure all interactive elements are keyboard accessible
   - Implement proper focus management
   - Use appropriate tabIndex values

3. **Screen Readers**:
   - Add descriptive aria-labels
   - Announce state changes
   - Test with screen readers

4. **Visual Design**:
   - Ensure sufficient color contrast
   - Don't rely solely on color to convey information
   - Support text zoom and high contrast modes

## Testing Guidelines

1. **Component Testing**:
   - Test components in isolation
   - Test both success and error states
   - Test accessibility compliance

2. **User Interaction Testing**:
   - Test user interactions (clicks, keyboard, etc.)
   - Test form submissions
   - Test error handling

3. **Visual Testing**:
   - Test in different viewport sizes
   - Test in both light and dark modes
   - Test with different content lengths

## Documentation Guidelines

1. **Component Documentation**:
   - Add JSDoc comments to all exported components
   - Document props and their default values
   - Provide usage examples

2. **Storybook**:
   - Create Storybook stories for components
   - Show different component variations
   - Document component usage

## Best Practices

1. **Composition Over Inheritance**:
   - Compose components using children and props
   - Avoid inheritance for component reuse
   - Use higher-order components and hooks for cross-cutting concerns

2. **Controlled vs Uncontrolled**:
   - Prefer controlled components for forms
   - Document whether a component is controlled or uncontrolled
   - Provide both options when appropriate

3. **Error Handling**:
   - Implement proper error boundaries
   - Handle loading, error, and empty states
   - Provide meaningful error messages

4. **Internationalization**:
   - Support internationalization in components
   - Avoid hardcoded strings
   - Support right-to-left languages

5. **Mobile Considerations**:
   - Ensure adequate touch targets (minimum 44x44px)
   - Consider mobile gestures
   - Test on actual mobile devices

## UI Patterns

1. **Loading States**:
   - Implement skeleton loaders for content
   - Use loading spinners for actions
   - Maintain layout stability during loading

2. **Empty States**:
   - Provide meaningful empty states
   - Include actions to fill empty states
   - Use illustrations or icons to enhance empty states

3. **Error States**:
   - Show clear error messages
   - Provide recovery actions
   - Log errors for debugging

4. **Confirmation Dialogs**:
   - Use for destructive actions
   - Clearly state consequences
   - Provide cancel and confirm options

## Conclusion

Following these rules and guidelines ensures that UI components in the Mikhail Ajaj Portfolio project are consistent, accessible, performant, and maintainable. These components form the foundation of the user experience and should be implemented with care and attention to detail.

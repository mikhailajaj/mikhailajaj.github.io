# Marketing Menu Components: Rules and Guidelines

This document outlines the rules and guidelines for implementing and maintaining menu components in the marketing feature of the Mikhail Ajaj Portfolio project.

## Directory Structure

The marketing feature follows the feature-first organization pattern:

```
features/
  marketing/
    _components/       # Internal components used only within the marketing feature
      base-menu.tsx    # Base menu component that powers all menu variants
      marketing-header.tsx # Composition of MainMenu and SecondaryMenu
    _data/             # Data structures and constants
      navigation.tsx   # Navigation links and icon definitions
    menus/             # Specific menu implementations
      main-menu.tsx    # Primary navigation menu
      secondary-menu.tsx # Utility navigation menu
    sections/          # Page sections
      hero-section.tsx
      features-section.tsx
      cta-section.tsx
    index.ts           # Barrel exports for the feature
```

## Architectural Boundaries

The marketing feature adheres to the project's architectural boundaries:

1. **Import Rules**:
   - Marketing components can only import from:
     - Shared modules (`@/shared/...`)
     - Other marketing feature modules (`../` relative imports)
   - Marketing components CANNOT import from other features

2. **Export Rules**:
   - Only export what is needed by other parts of the application through `features/marketing/index.ts`
   - Internal components (prefixed with `_`) should not be exported directly

## Component Guidelines

### Base Menu Component

The `BaseMenu` component is the foundation for all menu variants and should:

1. Be highly configurable with props for:
   - `links`: Navigation link data
   - `variant`: Visual styling ('default', 'subtle', 'minimal')
   - `showIcons`: Whether to display icons
   - `showDescriptions`: Whether to display descriptions
   - `orientation`: Layout direction ('horizontal', 'vertical')
   - `mobileBreakpoint`: Responsive breakpoint ('sm', 'md', 'lg')

2. Handle both mobile and desktop views:
   - Desktop: Horizontal navigation with dropdowns
   - Mobile: Collapsible menu with animations

3. Use React.memo for performance optimization

4. Implement proper accessibility attributes

### Main Menu and Secondary Menu

These components should:

1. Compose the BaseMenu with specific configurations
2. Add feature-specific functionality (theme toggle, CTA buttons)
3. Handle scroll behavior and styling
4. Be configurable through props

### Navigation Data Structure

The `NavLink` interface in `_data/navigation.tsx` defines the structure for all navigation items:

```typescript
export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavLink[];
  description?: string;
}
```

All navigation data should follow this structure for consistency.

## Performance Guidelines

1. **Memoization**:
   - Use React.memo for all menu components
   - Use useCallback for event handlers
   - Use proper dependency arrays in hooks

2. **State Management**:
   - Keep state local to components when possible
   - Use context only when necessary for deeply nested components

3. **Animations**:
   - Use CSS transitions for simple animations
   - Use Framer Motion for complex animations
   - Ensure animations respect reduced motion preferences

## Accessibility Guidelines

1. **Keyboard Navigation**:
   - Ensure all menu items are keyboard accessible
   - Implement proper focus management
   - Use appropriate ARIA attributes

2. **Screen Readers**:
   - Add descriptive aria-labels
   - Announce state changes
   - Test with screen readers

3. **Visual Contrast**:
   - Ensure sufficient contrast ratios
   - Test with color blindness simulators

## Mobile-First Approach

1. **Responsive Design**:
   - Design for mobile first, then enhance for larger screens
   - Use appropriate breakpoints (sm, md, lg)
   - Test on various device sizes

2. **Touch Targets**:
   - Ensure touch targets are at least 44x44px
   - Add appropriate spacing between interactive elements

## Integration Guidelines

1. **App Router Integration**:
   - Use the MarketingHeader component in app/(marketing)/layout.tsx
   - Configure the component based on the specific page needs

2. **Theme Integration**:
   - Use the theme toggle component for light/dark mode switching
   - Ensure proper styling in both light and dark modes

## Testing Guidelines

1. **Component Testing**:
   - Test each menu component in isolation
   - Test responsive behavior
   - Test dropdown functionality
   - Test theme toggle functionality

2. **Integration Testing**:
   - Test the complete marketing header
   - Test navigation between pages
   - Test mobile menu behavior

## Documentation Guidelines

1. **Component Documentation**:
   - Add JSDoc comments to all exported components
   - Document props and their default values
   - Provide usage examples

2. **Code Comments**:
   - Add comments for complex logic
   - Explain non-obvious design decisions

## Future Enhancements

1. **Performance Optimization**:
   - Further optimize rendering with useMemo
   - Implement code splitting for menu components

2. **Accessibility Improvements**:
   - Add comprehensive ARIA attributes
   - Improve keyboard navigation
   - Add screen reader announcements

3. **Animation Enhancements**:
   - Refine animation timing and easing
   - Add staggered animations for menu items

4. **Additional Menu Variants**:
   - Implement mega menu for services section
   - Create sidebar menu for dashboard layouts
   - Add breadcrumb navigation

5. **Authentication Integration**:
   - Add user avatar and dropdown menu
   - Implement role-based menu visibility

## Conclusion

Following these rules and guidelines ensures that the marketing menu components are maintainable, performant, accessible, and consistent with the project's architecture. These components form the foundation of the user's navigation experience and should be implemented with care and attention to detail.

# UI Design Principles and Standards

This document outlines the UI design principles and standards for the Mikhail Ajaj Portfolio project. Following these guidelines ensures a consistent, high-quality user experience across the application.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Design System](#design-system)
3. [Layout Guidelines](#layout-guidelines)
4. [Typography](#typography)
5. [Color Usage](#color-usage)
6. [Component Design](#component-design)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Animation and Transitions](#animation-and-transitions)
10. [Dark Mode](#dark-mode)
11. [Best Practices](#best-practices)
12. [Resources](#resources)

## Core Principles

Our UI design is guided by these core principles:

### 1. Clarity

- Design with clear visual hierarchy
- Use straightforward, concise language
- Eliminate ambiguity and confusion
- Make actions and options obvious

### 2. Consistency

- Maintain consistent patterns throughout the application
- Use the same solution for the same problem
- Follow established conventions when appropriate
- Create predictable behaviors and interactions

### 3. Efficiency

- Minimize the steps needed to complete tasks
- Prioritize frequently used actions
- Reduce cognitive load on users
- Design for both novice and expert users

### 4. Accessibility

- Design for users of all abilities
- Follow WCAG 2.1 AA standards
- Ensure keyboard navigability
- Support assistive technologies

### 5. Feedback

- Provide clear feedback for all user actions
- Communicate system status effectively
- Make error states helpful and actionable
- Guide users through complex processes

## Design System

The Mikhail Ajaj Portfolio project uses a design system based on shadcn UI components, which provides a consistent foundation for the application.

### Component Library

- Use shadcn UI components as the primary building blocks
- Extend the library with custom components when needed
- Follow the component API patterns established by shadcn UI
- Document custom components thoroughly

### Design Tokens

Use design tokens for consistent styling:

```typescript
// Example of design tokens in Tailwind config
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Other color scales...
      },
      spacing: {
        // Custom spacing values...
      },
      borderRadius: {
        // Custom border radius values...
      },
      // Other design tokens...
    },
  },
};
```

### Design Resources

- [UI Component Documentation](../components/README.md)
- [Design System Figma Library](https://figma.com/file/example-link)
- [Icon Set Documentation](../components/icons.md)

## Layout Guidelines

### Grid System

- Use a 12-column grid system for layouts
- Maintain consistent spacing between elements
- Use appropriate breakpoints for responsive design
- Follow a consistent content width strategy

### Spacing

Use a consistent spacing scale:

- `space-0`: 0px
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- `space-5`: 20px
- `space-6`: 24px
- `space-8`: 32px
- `space-10`: 40px
- `space-12`: 48px
- `space-16`: 64px
- `space-20`: 80px
- `space-24`: 96px

### Container Widths

- `container-sm`: 640px
- `container-md`: 768px
- `container-lg`: 1024px
- `container-xl`: 1280px
- `container-2xl`: 1536px

### Z-Index Scale

Use a consistent z-index scale to manage layering:

- `z-0`: Base layer
- `z-10`: Elements that need to appear above the base layer
- `z-20`: Dropdowns, tooltips
- `z-30`: Fixed elements like headers
- `z-40`: Modals and dialogs
- `z-50`: Notifications and toasts

## Typography

### Font Family

- Primary font: Inter
- Monospace font: JetBrains Mono

### Font Sizes

- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px)
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)
- `text-5xl`: 3rem (48px)

### Font Weights

- `font-normal`: 400
- `font-medium`: 500
- `font-semibold`: 600
- `font-bold`: 700

### Line Heights

- `leading-none`: 1
- `leading-tight`: 1.25
- `leading-snug`: 1.375
- `leading-normal`: 1.5
- `leading-relaxed`: 1.625
- `leading-loose`: 2

### Text Styles

| Style | Usage | Example |
|-------|-------|---------|
| Heading 1 | Page titles | `<h1 className="text-4xl font-bold">Page Title</h1>` |
| Heading 2 | Section titles | `<h2 className="text-3xl font-semibold">Section Title</h2>` |
| Heading 3 | Subsection titles | `<h3 className="text-2xl font-semibold">Subsection Title</h3>` |
| Heading 4 | Card titles | `<h4 className="text-xl font-medium">Card Title</h4>` |
| Body | Main content | `<p className="text-base">Main content text</p>` |
| Small | Secondary content | `<p className="text-sm text-gray-500">Secondary content</p>` |
| Caption | Labels and captions | `<span className="text-xs text-gray-400">Caption text</span>` |

## Color Usage

### Primary Colors

- Primary: Blue (#0ea5e9)
- Secondary: Slate (#64748b)
- Accent: Amber (#f59e0b)

### Semantic Colors

- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Info: Blue (#3b82f6)

### Neutral Colors

- Background: White (#ffffff)
- Surface: Gray 50 (#f9fafb)
- Border: Gray 200 (#e5e7eb)
- Text: Gray 900 (#111827)
- Text Secondary: Gray 500 (#6b7280)
- Text Tertiary: Gray 400 (#9ca3af)

### Color Usage Guidelines

- Use primary color for primary actions and key UI elements
- Use semantic colors consistently for their intended purposes
- Maintain sufficient contrast for text readability
- Use color to support hierarchy, not as the only indicator
- Ensure color combinations meet accessibility standards

## Component Design

### Button Hierarchy

| Type | Usage | Example |
|------|-------|---------|
| Primary | Main actions | `<Button>Save Changes</Button>` |
| Secondary | Alternative actions | `<Button variant="secondary">Cancel</Button>` |
| Outline | Less prominent actions | `<Button variant="outline">View Details</Button>` |
| Ghost | Subtle actions | `<Button variant="ghost">Dismiss</Button>` |
| Link | Navigation actions | `<Button variant="link">Learn More</Button>` |
| Destructive | Dangerous actions | `<Button variant="destructive">Delete</Button>` |

### Form Controls

- Use consistent form layouts
- Group related form fields
- Provide clear labels for all inputs
- Show validation errors inline
- Use appropriate input types for data
- Implement consistent focus states

### Card Design

- Use cards to group related content
- Maintain consistent padding within cards
- Use clear visual hierarchy for card content
- Implement consistent card actions
- Consider hover and focus states

### Navigation

- Make current location clear
- Use consistent navigation patterns
- Implement breadcrumbs for deep navigation
- Consider mobile navigation patterns
- Ensure keyboard navigability

## Responsive Design

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile-First Approach

- Design for mobile first, then enhance for larger screens
- Use fluid layouts that adapt to different screen sizes
- Implement appropriate touch targets for mobile (minimum 44x44px)
- Consider different interaction patterns for touch vs. mouse

### Responsive Patterns

- Stack elements vertically on small screens
- Use appropriate font sizes across breakpoints
- Hide non-essential content on smaller screens
- Implement mobile-specific navigation patterns
- Test designs across multiple device sizes

## Accessibility

### WCAG Compliance

Follow WCAG 2.1 AA standards:

- **Perceivable**: Information must be presentable to users in ways they can perceive
- **Operable**: User interface components must be operable
- **Understandable**: Information and operation must be understandable
- **Robust**: Content must be robust enough to be interpreted by a wide variety of user agents

### Keyboard Navigation

- Ensure all interactive elements are keyboard accessible
- Implement logical tab order
- Provide visible focus indicators
- Support keyboard shortcuts for common actions
- Test all flows with keyboard-only navigation

### Screen Readers

- Use semantic HTML elements
- Provide alternative text for images
- Implement ARIA attributes when necessary
- Test with screen readers
- Ensure dynamic content updates are announced

### Color and Contrast

- Maintain minimum contrast ratios:
  - 4.5:1 for normal text
  - 3:1 for large text
  - 3:1 for UI components and graphical objects
- Don't rely on color alone to convey information
- Test designs in grayscale
- Support high contrast mode

## Animation and Transitions

### Principles

- Use animation purposefully, not decoratively
- Keep animations subtle and quick
- Ensure animations don't block user interaction
- Respect user preferences for reduced motion

### Timing

- Quick transitions: 150ms
- Standard transitions: 250ms
- Complex transitions: 300-500ms

### Animation Types

| Type | Usage | Example |
|------|-------|---------|
| Fade | Appearing/disappearing elements | `transition-opacity duration-150` |
| Slide | Panel transitions | `transition-transform duration-250` |
| Scale | Expanding/collapsing elements | `transition-all duration-200` |
| Color | State changes | `transition-colors duration-150` |

### Reduced Motion

- Implement alternatives for users who prefer reduced motion
- Use the `prefers-reduced-motion` media query
- Simplify or remove animations when reduced motion is preferred

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Dark Mode

### Implementation

- Use Tailwind's dark mode utilities
- Design for both light and dark mode from the start
- Test color contrast in both modes
- Consider different elevation techniques for dark mode

### Color Mapping

| Light Mode | Dark Mode |
|------------|-----------|
| White (#ffffff) | Gray 950 (#030712) |
| Gray 50 (#f9fafb) | Gray 900 (#111827) |
| Gray 100 (#f3f4f6) | Gray 800 (#1f2937) |
| Gray 200 (#e5e7eb) | Gray 700 (#374151) |
| Gray 300 (#d1d5db) | Gray 600 (#4b5563) |
| Gray 400 (#9ca3af) | Gray 500 (#6b7280) |
| Gray 500 (#6b7280) | Gray 400 (#9ca3af) |
| Gray 900 (#111827) | Gray 100 (#f3f4f6) |

### Dark Mode Best Practices

- Don't simply invert colors
- Reduce the intensity of bright colors
- Use shadows and elevation differently
- Test readability in both modes
- Consider environmental factors (e.g., glare, low light)

## Best Practices

### Performance

- Optimize images and assets
- Minimize layout shifts
- Implement progressive loading
- Consider performance budgets
- Test on low-end devices

### Consistency

- Use the same patterns for similar problems
- Maintain consistent spacing and alignment
- Follow established platform conventions
- Document and share patterns

### User Experience

- Design with user goals in mind
- Minimize steps to complete tasks
- Provide clear feedback for actions
- Design for different user expertise levels
- Test designs with real users

### Implementation

- Use the component library
- Follow the established coding patterns
- Document custom components
- Review designs for accessibility
- Test across different devices and browsers

## Resources

### Internal Resources

- [Component Library Documentation](../components/README.md)
- [Accessibility Guidelines](../accessibility/README.md)
- [Design System Figma Library](https://figma.com/file/example-link)

### External Resources

- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn UI Documentation](https://ui.shadcn.com)
- [Inclusive Components](https://inclusive-components.design/)
- [Material Design Guidelines](https://material.io/design)

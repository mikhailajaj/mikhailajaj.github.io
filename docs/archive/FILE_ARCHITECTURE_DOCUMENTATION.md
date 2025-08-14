# File Architecture Documentation

## Overview
This document provides a comprehensive overview of the Mikhail Ajaj Portfolio application architecture, describing the function and purpose of each file and directory in the codebase.

## Project Structure

### Root Configuration Files

#### `package.json`
**Purpose**: Project configuration and dependency management
- **Dependencies**: React 18.3.1, Next.js 15.0.2, TypeScript, Tailwind CSS
- **Scripts**: Development, build, test, and documentation commands
- **Key Features**: 
  - React 18 with concurrent features
  - Next.js 15 with App Router
  - Comprehensive testing setup with Jest
  - Accessibility testing with @axe-core/react
  - Performance monitoring with web-vitals

#### `next.config.mjs`
**Purpose**: Next.js configuration and build optimization
- **Features**: 
  - Static export configuration for GitHub Pages
  - Image optimization settings
  - Bundle analyzer integration
  - Performance optimizations

#### `tailwind.config.ts`
**Purpose**: Tailwind CSS configuration
- **Features**:
  - Custom color schemes and themes
  - Animation configurations
  - Component-specific styling
  - Dark mode support

#### `tsconfig.json`
**Purpose**: TypeScript configuration
- **Features**:
  - Strict type checking
  - Path aliases for clean imports
  - Next.js specific settings
  - Modern ES features support

### Application Core (`app/` directory)

#### `app/layout.tsx`
**Purpose**: Root layout component with global providers
- **Features**:
  - Theme management (dark/light mode)
  - Accessibility provider integration
  - Google Analytics setup
  - SEO metadata configuration
  - Performance monitoring
  - Global CSS imports

#### `app/page.tsx`
**Purpose**: Homepage component with multi-domain showcase
- **Features**:
  - Static rendering optimization
  - Sally's HCI framework integration
  - Progressive disclosure patterns
  - Cognitive load management
  - Performance-optimized component loading

#### `app/globals.css`
**Purpose**: Global styles and CSS variables
- **Features**:
  - Tailwind CSS imports
  - Custom CSS properties
  - Dark mode variables
  - Animation definitions

#### Route-Specific Pages
- `app/contact/`: Contact form and information
- `app/projects/`: Project showcase and details
- `app/services/`: Service offerings and descriptions
- `app/blog/`: Blog posts and articles
- `app/experience/`: Professional experience timeline

### Components Architecture (`components/` directory)

#### Layout Components (`components/layouts/`)

##### `MainLayout.tsx`
**Purpose**: Main application layout wrapper
- **Features**:
  - Domain-aware navigation
  - Responsive design
  - Accessibility features
  - Mobile bottom navigation
  - Scroll progress indicator

#### UI Components (`components/ui/`)

##### Base Components (`components/ui/base/`)
- `Button.tsx`: Reusable button component with variants
- `Card.tsx`: Card component for content containers
- `Input.tsx`: Form input components
- `Modal.tsx`: Modal dialog components

##### Specialized UI Components
- `DomainCard.tsx`: Domain-specific showcase cards
- `DomainAnimationShowcase.tsx`: Animated domain presentations
- `DomainComparisonMatrix.tsx`: Comparative analysis displays
- `ErrorBoundary.tsx`: Error handling and recovery
- `MotionComponents.tsx`: Framer Motion wrapper components

#### Feature Components (`components/features/`)

##### Homepage Features (`components/features/homepage/`)
- `EnhancedImpactHero.tsx`: Hero section with impact metrics
- `FeaturedProjects.tsx`: Project showcase section
- `SkillsOverview.tsx`: Technical skills presentation
- `ProfessionalHighlights.tsx`: Career achievements
- `CallToAction.tsx`: Conversion-focused sections

#### Legacy Components (Root Level)
- `EnhancedGrid.tsx`: Bento grid layout for about section
- `EnhancedHero.tsx`: Original hero component
- `ContactForm.tsx`: Contact form implementation
- `TestimonialsSection.tsx`: Client testimonials display

### Data Layer (`data/` directory)

#### `gridItems.ts`
**Purpose**: Configuration for the about section grid
- **Features**:
  - Icon imports and management
  - Grid item definitions
  - Technology stack representation
  - Domain expertise showcase

#### Schema Definitions (`data/schemas/`)
- Type definitions for projects, domains, and content
- Validation schemas for forms and data
- API response interfaces

### Library Functions (`lib/` directory)

#### Configuration (`lib/config/`)
- `domainThemes.ts`: Domain-specific theming and branding
- Theme configurations for different expertise areas

#### Utilities (`lib/utils/`)
- `analytics.ts`: Analytics and tracking utilities
- Helper functions for data processing
- Performance optimization utilities

#### Contexts (`lib/contexts/`)
- React context providers for state management
- Theme context and accessibility context
- Production-optimized data providers

### Styling (`styles/` directory)
- Component-specific stylesheets
- Animation definitions
- Responsive design utilities

### Testing (`__tests__/` directory)
- Unit tests for components
- Integration tests for features
- Accessibility tests
- Performance tests

### Documentation (`docs/` directory)
- Technical documentation
- API documentation
- Deployment guides
- Troubleshooting guides

### Scripts (`scripts/` directory)
- Build optimization scripts
- Dependency validation
- Performance analysis tools
- Development utilities

### Public Assets (`public/` directory)
- Images and media files
- Icons and logos
- Static assets for SEO

## Architecture Patterns

### Component Organization
1. **Atomic Design**: Components organized by complexity (base → ui → features)
2. **Domain-Driven Design**: Features grouped by business domain
3. **Separation of Concerns**: Clear separation between UI, logic, and data

### Performance Optimizations
1. **Static Generation**: Pages pre-rendered at build time
2. **Code Splitting**: Component-level lazy loading
3. **Image Optimization**: Next.js Image component with optimization
4. **Bundle Analysis**: Webpack bundle analyzer integration

### Accessibility Features
1. **WCAG 2.1 AA Compliance**: Comprehensive accessibility testing
2. **Screen Reader Support**: Proper ARIA labels and semantic HTML
3. **Keyboard Navigation**: Full keyboard accessibility
4. **Color Contrast**: High contrast ratios for readability

### State Management
1. **React Context**: Global state management
2. **Local State**: Component-specific state with hooks
3. **Form State**: React Hook Form for form management

### Styling Architecture
1. **Tailwind CSS**: Utility-first CSS framework
2. **CSS Modules**: Component-scoped styles
3. **Theme System**: Dark/light mode support
4. **Responsive Design**: Mobile-first approach

## Key Technologies

### Frontend Stack
- **React 18.3.1**: UI library with concurrent features
- **Next.js 15.0.2**: Full-stack React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

### Animation & Interaction
- **Framer Motion**: Animation library
- **React Three Fiber**: 3D graphics with Three.js
- **Lucide React**: Icon library

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Axe**: Accessibility testing

### Performance & Analytics
- **Web Vitals**: Performance monitoring
- **Google Analytics**: User analytics
- **Bundle Analyzer**: Bundle size analysis

## File Naming Conventions

### Components
- PascalCase for component files: `ComponentName.tsx`
- Descriptive names indicating purpose: `DomainAwareNavigation.tsx`

### Utilities
- camelCase for utility files: `utilityFunction.ts`
- Descriptive names indicating functionality: `analyticsUtils.ts`

### Styles
- kebab-case for CSS files: `component-styles.css`
- Descriptive names indicating scope: `enhanced-accessibility.css`

### Data
- camelCase for data files: `gridItems.ts`
- Descriptive names indicating content: `domainThemes.ts`

## Best Practices Implemented

### Code Quality
1. **TypeScript Strict Mode**: Full type safety
2. **ESLint Configuration**: Consistent code style
3. **Prettier Integration**: Automatic code formatting
4. **Component Documentation**: JSDoc comments for all components

### Performance
1. **Lazy Loading**: Components loaded on demand
2. **Image Optimization**: Next.js Image component
3. **Bundle Splitting**: Automatic code splitting
4. **Static Generation**: Pre-rendered pages for speed

### Accessibility
1. **Semantic HTML**: Proper HTML structure
2. **ARIA Labels**: Screen reader support
3. **Keyboard Navigation**: Full keyboard accessibility
4. **Color Contrast**: WCAG AA compliance

### SEO
1. **Meta Tags**: Comprehensive SEO metadata
2. **Open Graph**: Social media sharing optimization
3. **Structured Data**: Search engine optimization
4. **Sitemap Generation**: Automatic sitemap creation

## Maintenance Guidelines

### Adding New Components
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Include JSDoc documentation
4. Add unit tests
5. Update this documentation

### Modifying Existing Components
1. Maintain backward compatibility
2. Update tests accordingly
3. Update documentation
4. Consider performance impact

### Adding New Pages
1. Create page in `app/` directory
2. Add to navigation if needed
3. Include SEO metadata
4. Test accessibility compliance

This documentation serves as a living guide to the codebase architecture and should be updated as the project evolves.
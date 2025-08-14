# Unified Layout System Documentation

## Overview

The Unified Layout System provides a modern, responsive, and consistent layout architecture with collapsible side menu functionality. This system replaces the dual layout approach (MainLayout + EnhancedLayout) with a single, flexible solution that auto-configures based on routes.

## Architecture Components

### Core Components

1. **UnifiedLayout.tsx** - Main layout wrapper with auto-configuration
2. **TopNavigation.tsx** - Modern top navigation with dual navigation bars
3. **SideMenu.tsx** - Collapsible side menu with multiple content types
4. **PageHeader.tsx** - Consistent page headers with variants
5. **ContentSkeleton.tsx** - Enhanced loading states for all content types

### Total Implementation: 2,043 lines of modern layout code

## Key Features

### Auto-Configuration

The layout automatically configures based on the current route:

```typescript
// Homepage - minimal layout
'/' → { showSideMenu: false, sideMenuContent: 'none' }

// Blog posts - table of contents
'/blog/[slug]' → { showSideMenu: true, sideMenuContent: 'toc', showBreadcrumbs: true }

// Domain pages - navigation
'/full-stack' → { showSideMenu: true, sideMenuContent: 'navigation' }

// Projects - filters
'/projects' → { showSideMenu: true, sideMenuContent: 'filters' }
```

### Responsive Design

- **Desktop**: Collapsible sidebar (256px → 64px)
- **Tablet**: Overlay sidebar with backdrop
- **Mobile**: Full-screen overlay + bottom navigation

### Side Menu Content Types

1. **Navigation** - Main navigation + domain links
2. **Table of Contents** - Article outline + reading progress
3. **Filters** - Project filters + sort options
4. **Custom** - Flexible custom content

## Usage Examples

### Basic Implementation (Recommended)

```typescript
import { UnifiedLayout } from '@/components/layouts/UnifiedLayout';

function MyPage() {
  return (
    <UnifiedLayout>
      {/* Layout auto-configures based on route */}
      <div>Your page content here</div>
    </UnifiedLayout>
  );
}
```

### Manual Configuration

```typescript
function CustomPage() {
  return (
    <UnifiedLayout
      showSideMenu={true}
      sideMenuContent="navigation"
      pageTitle="Custom Page"
      pageSubtitle="With manual configuration"
      showBreadcrumbs={true}
      loading={false}
    >
      <div>Your page content here</div>
    </UnifiedLayout>
  );
}
```

### Loading States

```typescript
function DataPage() {
  const [loading, setLoading] = useState(true);

  return (
    <UnifiedLayout
      loading={loading}
      pageTitle="Data Dashboard"
    >
      <DashboardContent />
    </UnifiedLayout>
  );
}
```

## Page Header Variants

### Default Page Header

```typescript
<UnifiedLayout
  pageTitle="Page Title"
  pageSubtitle="Optional subtitle"
  showBreadcrumbs={true}
>
```

### Project Page Header

```typescript
import { ProjectPageHeader } from '@/components/layouts/components/PageHeader';

<UnifiedLayout>
  <ProjectPageHeader
    title="Amazing Project"
    subtitle="Full-stack web application"
    domain="Full-Stack Development"
    technologies={['React', 'Node.js', 'TypeScript']}
    liveUrl="https://example.com"
    githubUrl="https://github.com/user/repo"
  />
  <ProjectContent />
</UnifiedLayout>
```

### Blog Page Header

```typescript
import { BlogPageHeader } from '@/components/layouts/components/PageHeader';

<UnifiedLayout>
  <BlogPageHeader
    title="Blog Post Title"
    subtitle="Comprehensive guide to..."
    author="Mikhail Ajaj"
    publishedAt={new Date()}
    readingTime={8}
    tags={['React', 'TypeScript', 'Performance']}
  />
  <BlogContent />
</UnifiedLayout>
```

### Domain Page Header

```typescript
import { DomainPageHeader } from '@/components/layouts/components/PageHeader';

<UnifiedLayout>
  <DomainPageHeader
    title="Full-Stack Development"
    subtitle="React, Node.js, TypeScript Expertise"
    description="Comprehensive full-stack solutions..."
    projectCount={15}
    stats={[
      { label: 'Years Experience', value: '8+' },
      { label: 'Client Satisfaction', value: '98%' },
      { label: 'Revenue Impact', value: '$2.3M+' }
    ]}
  />
  <DomainContent />
</UnifiedLayout>
```

## Content Skeleton Types

The system provides realistic loading states for different content types:

```typescript
// Auto-detected based on route
<UnifiedLayout loading={true}>
  {/* Automatically shows appropriate skeleton */}
</UnifiedLayout>

// Manual skeleton type
<ContentSkeleton type="blog" />     // Blog post skeleton
<ContentSkeleton type="project" />  // Project page skeleton
<ContentSkeleton type="dashboard" /> // Dashboard skeleton
<ContentSkeleton type="list" />     // List view skeleton
<ContentSkeleton type="card" />     // Card grid skeleton
<ContentSkeleton type="table" />    // Data table skeleton
```

## Side Menu Customization

### Custom Side Menu Content

```typescript
const customSideContent = (
  <div className="p-4">
    <h3 className="text-white font-semibold mb-4">Custom Menu</h3>
    {/* Your custom content */}
  </div>
);

<UnifiedLayout
  sideMenuContent="custom"
  customSideMenuContent={customSideContent}
>
```

### Side Menu Props

```typescript
<UnifiedLayout
  sideMenuProps={{
    allowCollapse: true,
    defaultCollapsed: false,
    // Additional props passed to SideMenu
  }}
>
```

## Layout Context

Access layout state and controls:

```typescript
import { useLayoutContext } from '@/components/layouts/UnifiedLayout';

function MyComponent() {
  const {
    isSideMenuCollapsed,
    isMobileMenuOpen,
    toggleSideMenu,
    sideMenuContent,
    showBreadcrumbs
  } = useLayoutContext();

  return (
    <div>
      <button onClick={toggleSideMenu}>
        Toggle Menu
      </button>
    </div>
  );
}
```

## Layout Hooks

### useLayoutConfig

```typescript
import { useLayoutConfig } from "@/components/layouts/UnifiedLayout";

function MyComponent() {
  const config = useLayoutConfig();
  // Returns current route's layout configuration
}
```

### useSideMenu

```typescript
import { useSideMenu } from "@/components/layouts/UnifiedLayout";

function MyComponent() {
  const { isCollapsed, isMobileOpen, toggle, collapse, expand, toggleMobile } =
    useSideMenu();
}
```

## Migration from Existing Layouts

### From MainLayout

```typescript
// Before
import { MainLayout } from '@/components/layouts/MainLayout';

function Page() {
  return (
    <MainLayout>
      <Content />
    </MainLayout>
  );
}

// After
import { UnifiedLayout } from '@/components/layouts/UnifiedLayout';

function Page() {
  return (
    <UnifiedLayout>
      <Content />
    </UnifiedLayout>
  );
}
```

### From EnhancedLayout

```typescript
// Before
import { EnhancedLayout } from '@/components/layouts/EnhancedLayout';

function BlogPage() {
  return (
    <EnhancedLayout>
      <BlogContent />
    </EnhancedLayout>
  );
}

// After
import { UnifiedLayout } from '@/components/layouts/UnifiedLayout';

function BlogPage() {
  return (
    <UnifiedLayout>
      {/* Auto-configures for blog with TOC sidebar */}
      <BlogContent />
    </UnifiedLayout>
  );
}
```

## Performance Optimization

### Conditional Rendering

The layout only renders components when needed:

- Side menu only renders when `showSideMenu={true}`
- Breadcrumbs only render when `showBreadcrumbs={true}`
- Page header only renders when title/subtitle provided

### Responsive Detection

```typescript
// Automatic mobile detection with resize listener
useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);
```

### Animation Performance

- CSS transitions for smooth animations
- Transform-based animations for better performance
- Reduced layout thrashing with proper CSS properties

## Accessibility Features

### ARIA Support

- Proper ARIA labels for all interactive elements
- Screen reader friendly navigation
- Keyboard navigation support
- Focus management

### Keyboard Navigation

- Tab navigation through all interactive elements
- Escape key to close mobile menu
- Enter/Space for button activation
- Arrow keys for menu navigation

### Screen Reader Support

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images
- Live regions for dynamic content

## Styling and Theming

### CSS Classes

The layout uses Tailwind CSS with consistent design tokens:

```css
/* Primary colors */
bg-black text-white          /* Main background */
bg-gray-900 border-gray-800  /* Sidebar background */
bg-blue-600 hover:bg-blue-700 /* Primary buttons */

/* Responsive breakpoints */
lg:ml-64    /* Desktop sidebar margin */
lg:hidden   /* Hide on desktop */
md:grid-cols-2 /* Tablet grid */
```

### Dark Mode Support

All components support dark mode by default with proper color schemes.

## Browser Support

### Modern Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features Used

- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ JavaScript features
- React 18+ features

## Troubleshooting

### Common Issues

1. **Layout not auto-configuring**
   - Ensure you're using Next.js App Router
   - Check that `usePathname()` is working correctly
   - Verify route patterns in `getLayoutConfig()`

2. **Side menu not collapsing**
   - Check `allowCollapse` prop
   - Verify responsive breakpoints
   - Ensure CSS transitions are not disabled

3. **Mobile menu not working**
   - Check z-index conflicts
   - Verify touch event handlers
   - Ensure backdrop overlay is present

4. **Skeleton loading not showing**
   - Check `loading` prop value
   - Verify skeleton type detection
   - Ensure proper route matching

### Debug Tools

```typescript
// Enable layout debugging
<UnifiedLayout
  className="debug-layout" // Add debug styles
>

// Check layout configuration
const config = useLayoutConfig();
console.log('Layout config:', config);

// Monitor layout state
const { isSideMenuCollapsed, isMobileMenuOpen } = useLayoutContext();
console.log('Layout state:', { isSideMenuCollapsed, isMobileMenuOpen });
```

## Best Practices

### 1. Use Auto-Configuration

```typescript
// ✅ Recommended - Let layout auto-configure
<UnifiedLayout>
  <Content />
</UnifiedLayout>

// ❌ Avoid - Manual configuration unless necessary
<UnifiedLayout showSideMenu={true} sideMenuContent="navigation">
  <Content />
</UnifiedLayout>
```

### 2. Leverage Page Header Variants

```typescript
// ✅ Use specific header variants
<ProjectPageHeader {...projectProps} />

// ❌ Generic headers for specific content
<PageHeader title="Project" />
```

### 3. Implement Loading States

```typescript
// ✅ Show loading skeletons
<UnifiedLayout loading={isLoading}>

// ❌ Empty content while loading
{isLoading ? null : <Content />}
```

### 4. Optimize for Mobile

```typescript
// ✅ Mobile-first responsive design
<UnifiedLayout> {/* Handles mobile automatically */}

// ❌ Desktop-only considerations
<div className="hidden lg:block"> {/* Mobile users excluded */}
```

## API Reference

### UnifiedLayout Props

```typescript
interface UnifiedLayoutProps {
  children: React.ReactNode;
  showSideMenu?: boolean;
  sideMenuContent?: "navigation" | "toc" | "filters" | "custom" | "none";
  showBreadcrumbs?: boolean;
  pageTitle?: string;
  pageSubtitle?: string;
  loading?: boolean;
  className?: string;
  sideMenuProps?: Record<string, any>;
  customSideMenuContent?: React.ReactNode;
}
```

### Layout Configuration

```typescript
interface LayoutConfig {
  showSideMenu: boolean;
  sideMenuContent: SideMenuContent;
  showBreadcrumbs: boolean;
  allowCollapse: boolean;
  defaultCollapsed: boolean;
}
```

### Context Types

```typescript
interface LayoutContextType {
  isSideMenuCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleSideMenu: () => void;
  sideMenuContent: SideMenuContent;
  showBreadcrumbs: boolean;
}
```

## Conclusion

The Unified Layout System provides a modern, flexible, and maintainable foundation for all portfolio pages. It eliminates layout inconsistencies, improves user experience, and simplifies development with auto-configuration and comprehensive component variants.

The system is designed to scale with your portfolio's growth while maintaining professional quality and performance standards that match your $30M+ business impact demonstration.

For implementation guidance, see the [Unified Layout Implementation Plan](../plan/UNIFIED-LAYOUT-IMPLEMENTATION-PLAN.md).

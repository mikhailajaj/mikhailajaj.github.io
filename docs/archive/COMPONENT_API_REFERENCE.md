# Component API Reference

## Overview
This document provides detailed API references, usage examples, and implementation guidelines for all components in the Mikhail Ajaj Portfolio application.

---

## 🎯 Core Components

### MainLayout

**File**: `components/core/Layout/MainLayout.tsx`

#### API Reference
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
  domain?: Domain;
  showNavigation?: boolean;
  showFooter?: boolean;
  showScrollProgress?: boolean;
  className?: string;
  backgroundVariant?: 'default' | 'gradient' | 'stars' | 'minimal';
}
```

#### Usage Examples
```tsx
// Basic usage
<MainLayout>
  <HomePage />
</MainLayout>

// With domain context
<MainLayout 
  domain="fullstack" 
  showScrollProgress={true}
  backgroundVariant="stars"
>
  <ProjectPage />
</MainLayout>

// Minimal layout for landing pages
<MainLayout 
  showNavigation={false}
  showFooter={false}
  backgroundVariant="minimal"
>
  <LandingPage />
</MainLayout>
```

#### Props Details
- **children**: Page content to render
- **domain**: Current domain context for navigation theming
- **showNavigation**: Toggle main navigation visibility (default: true)
- **showFooter**: Toggle footer visibility (default: true)
- **showScrollProgress**: Toggle scroll progress indicator (default: true)
- **className**: Additional CSS classes
- **backgroundVariant**: Background styling variant

#### Dependencies
- `DomainAwareNavigation`
- `Footer`
- `ScrollProgress`
- `AccessibilityFeatures`
- `MobileBottomNav`

---

## 🎨 UI Components

### Button

**File**: `components/ui/base/Button.tsx`

#### API Reference
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient" | 
           "destructive" | "success" | "warning" | "info";
  size?: "sm" | "md" | "lg" | "xl" | "icon";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  tooltip?: string;
}
```

#### Usage Examples
```tsx
// Basic button
<Button>Click me</Button>

// Primary action button
<Button variant="primary" size="lg">
  Get Started
</Button>

// Button with icons
<Button 
  variant="gradient" 
  leftIcon={<FaRocket />}
  rightIcon={<FaArrowRight />}
>
  Launch Project
</Button>

// Loading state
<Button loading disabled>
  Processing...
</Button>

// Full width button
<Button variant="success" fullWidth>
  Complete Purchase
</Button>

// Icon-only button
<Button variant="ghost" size="icon" tooltip="Settings">
  <FaCog />
</Button>
```

#### Variant Styles
- **primary**: Blue background, white text
- **secondary**: Gray background, white text
- **outline**: Transparent background, colored border
- **ghost**: Transparent background, hover effects
- **gradient**: Blue to purple gradient
- **destructive**: Red background for dangerous actions
- **success**: Green background for positive actions
- **warning**: Yellow background for caution
- **info**: Blue background for informational actions

#### Size Options
- **sm**: Small button (32px height)
- **md**: Medium button (40px height) - default
- **lg**: Large button (48px height)
- **xl**: Extra large button (56px height)
- **icon**: Square icon button (40x40px)

### Card

**File**: `components/ui/base/Card.tsx`

#### API Reference
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

#### Usage Examples
```tsx
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</Card>

// Elevated card with hover effects
<Card variant="elevated" hoverable>
  <ProjectPreview project={project} />
</Card>

// Outlined card with custom padding
<Card variant="outlined" padding="lg">
  <ContactForm />
</Card>
```

### DomainCard

**File**: `components/ui/DomainCard.tsx`

#### API Reference
```typescript
interface DomainCardProps {
  theme: DomainTheme;
  index: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  showDescription?: boolean;
}
```

#### Usage Examples
```tsx
// Basic domain card
<DomainCard 
  theme={fullStackTheme} 
  index={0} 
  size="md" 
/>

// Interactive domain card
<DomainCard 
  theme={cloudTheme}
  index={1}
  size="lg"
  onClick={() => navigate('/cloud-engineering')}
  showDescription={true}
/>

// Small domain card for navigation
<DomainCard 
  theme={dataTheme}
  index={2}
  size="sm"
  className="cursor-pointer"
/>
```

---

## 🏠 Homepage Components

### ConsolidatedHero

**File**: `components/features/homepage/ConsolidatedHero.tsx`

#### API Reference
```typescript
interface ConsolidatedHeroProps {
  showMetrics?: boolean;
  showDomains?: boolean;
  className?: string;
  variant?: 'full' | 'minimal' | 'compact';
}
```

#### Usage Examples
```tsx
// Full hero with all features
<ConsolidatedHero 
  showMetrics={true}
  showDomains={true}
  variant="full"
/>

// Minimal hero for landing pages
<ConsolidatedHero 
  showMetrics={false}
  showDomains={false}
  variant="minimal"
/>

// Compact hero for internal pages
<ConsolidatedHero 
  showMetrics={true}
  showDomains={false}
  variant="compact"
/>
```

#### Features
- **Animated Counters**: Business impact metrics with smooth animations
- **Domain Showcase**: Interactive domain cards
- **Call-to-Action**: Optimized conversion buttons
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant

### FeaturedProjects

**File**: `components/features/homepage/FeaturedProjects.tsx`

#### API Reference
```typescript
interface FeaturedProjectsProps {
  limit?: number;
  showFilters?: boolean;
  layout?: 'grid' | 'carousel' | 'masonry';
  className?: string;
}
```

#### Usage Examples
```tsx
// Grid layout with filters
<FeaturedProjects 
  limit={6}
  showFilters={true}
  layout="grid"
/>

// Carousel layout for mobile
<FeaturedProjects 
  limit={4}
  layout="carousel"
  className="md:hidden"
/>

// Masonry layout for varied content
<FeaturedProjects 
  limit={8}
  layout="masonry"
  showFilters={false}
/>
```

---

## 📝 Form Components

### ContactForm

**File**: `components/ContactForm.tsx`

#### API Reference
```typescript
interface ContactFormProps {
  className?: string;
  onSubmit?: (data: ContactFormData) => void;
  showSocialLinks?: boolean;
  variant?: 'default' | 'modal' | 'inline';
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
}
```

#### Usage Examples
```tsx
// Basic contact form
<ContactForm />

// Contact form with custom handler
<ContactForm 
  onSubmit={(data) => {
    console.log('Form submitted:', data);
    // Custom submission logic
  }}
/>

// Modal variant
<ContactForm 
  variant="modal"
  showSocialLinks={false}
/>

// Inline variant for sidebars
<ContactForm 
  variant="inline"
  className="max-w-sm"
/>
```

#### Validation Rules
- **name**: Required, min 2 characters
- **email**: Required, valid email format
- **subject**: Required, min 5 characters
- **message**: Required, min 10 characters
- **company**: Optional
- **phone**: Optional, valid phone format if provided

---

## 🎭 Animation Components

### MotionComponents

**File**: `components/ui/MotionComponents.tsx`

#### API Reference
```typescript
// Pre-configured motion variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Motion wrapper components
interface MotionWrapperProps {
  children: React.ReactNode;
  variant?: keyof typeof motionVariants;
  delay?: number;
  className?: string;
}
```

#### Usage Examples
```tsx
// Fade in animation
<MotionWrapper variant="fadeInUp">
  <Card>Content that fades in</Card>
</MotionWrapper>

// Staggered children animation
<MotionWrapper variant="staggerContainer">
  {items.map((item, index) => (
    <MotionWrapper key={index} variant="fadeInUp" delay={index * 0.1}>
      <ItemCard item={item} />
    </MotionWrapper>
  ))}
</MotionWrapper>

// Custom animation with delay
<MotionWrapper variant="slideInLeft" delay={0.5}>
  <HeroContent />
</MotionWrapper>
```

---

## 🛡️ Utility Components

### ErrorBoundary

**File**: `components/ui/ErrorBoundary.tsx`

#### API Reference
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{error: Error; resetError: () => void}>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
```

#### Usage Examples
```tsx
// Basic error boundary
<ErrorBoundary>
  <ComponentThatMightFail />
</ErrorBoundary>

// Custom fallback component
<ErrorBoundary 
  fallback={CustomErrorFallback}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error);
    // Send to error reporting service
  }}
>
  <CriticalComponent />
</ErrorBoundary>

// Error boundary with retry functionality
<ErrorBoundary fallback={({error, resetError}) => (
  <div className="error-container">
    <h2>Something went wrong</h2>
    <p>{error.message}</p>
    <Button onClick={resetError}>Try Again</Button>
  </div>
)}>
  <DataFetchingComponent />
</ErrorBoundary>
```

---

## 📊 Data Components

### GridItems Configuration

**File**: `data/gridItems.ts`

#### Structure
```typescript
interface GridItem {
  id: number;
  title: string;
  description: React.ReactNode | string;
  className?: string;
  icons?: React.ComponentType[];
  image?: {
    src: string;
    alt: string;
  };
  header?: React.ReactNode;
}
```

#### Usage Examples
```tsx
// Accessing grid items
import { gridItems } from '@/data/gridItems';

// Rendering grid items
{gridItems.map((item) => (
  <EnhancedBentoGridItem
    key={item.id}
    title={item.title}
    description={item.description}
    className={item.className}
    header={<GridItemHeader image={item.image} />}
    icon={<GridIcons icons={item.icons} />}
  />
))}

// Filtering grid items
const techItems = gridItems.filter(item => 
  item.title.toLowerCase().includes('tech')
);
```

---

## 🎨 Theme Configuration

### Domain Themes

**File**: `lib/config/domainThemes.ts`

#### API Reference
```typescript
interface DomainTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  icon: React.ComponentType;
  gradient: string;
  technologies: string[];
}
```

#### Usage Examples
```tsx
// Get all domain themes
import { getAllDomainThemes } from '@/lib/config/domainThemes';

const themes = getAllDomainThemes();

// Get specific theme
import { getDomainTheme } from '@/lib/config/domainThemes';

const fullStackTheme = getDomainTheme('fullstack');

// Use theme in component
<div 
  className="p-4 rounded-lg"
  style={{
    backgroundColor: fullStackTheme.colors.background,
    color: fullStackTheme.colors.primary
  }}
>
  <fullStackTheme.icon className="w-6 h-6" />
  <h3>{fullStackTheme.name}</h3>
</div>
```

---

## 🔧 Utility Functions

### Class Name Utilities

**File**: `lib/utils/index.ts`

#### API Reference
```typescript
// Combine class names with conditional logic
function cn(...inputs: ClassValue[]): string

// Format date strings
function formatDate(date: string | Date, format?: string): string

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string

// Generate slug from text
function generateSlug(text: string): string
```

#### Usage Examples
```tsx
// Conditional class names
const buttonClasses = cn(
  'px-4 py-2 rounded',
  isActive && 'bg-blue-500 text-white',
  isDisabled && 'opacity-50 cursor-not-allowed',
  className
);

// Date formatting
const formattedDate = formatDate(post.createdAt, 'MMM dd, yyyy');

// Text truncation
const excerpt = truncateText(post.content, 150);

// Slug generation
const slug = generateSlug(post.title);
```

---

## 📱 Responsive Design Patterns

### Breakpoint Usage
```tsx
// Responsive component visibility
<div className="hidden md:block">
  <DesktopNavigation />
</div>
<div className="block md:hidden">
  <MobileNavigation />
</div>

// Responsive grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>

// Responsive text sizes
<h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
  Responsive Heading
</h1>
```

---

## 🎯 Performance Optimization Patterns

### Lazy Loading
```tsx
// Component lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <HeavyComponent />
</Suspense>

// Image lazy loading
<Image
  src="/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Memoization
```tsx
// Memoized component
const ExpensiveComponent = React.memo(({ data }) => {
  return <ComplexVisualization data={data} />;
});

// Memoized calculations
const expensiveValue = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);

// Memoized callbacks
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);
```

---

## 🔍 Testing Patterns

### Component Testing
```tsx
// Basic component test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/base/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});

// Testing with user interactions
import userEvent from '@testing-library/user-event';

test('calls onClick when clicked', async () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe';

test('has no accessibility violations', async () => {
  const { container } = render(<Button>Accessible Button</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

This API reference provides comprehensive documentation for implementing and using components throughout the portfolio application. Each component includes detailed props, usage examples, and best practices for optimal performance and accessibility.
# Animation Integration Guide

This guide shows how to integrate the advanced micro-interactions and animation system into your existing portfolio components.

## Quick Start

### 1. Import Components

```tsx
// Import specific animation components
import { 
  MagneticButton, 
  AnimatedCounter, 
  StaggeredList,
  PageTransition,
  SkeletonLoader 
} from '@/components/animations';

// Or import everything
import * as Animations from '@/components/animations';
```

### 2. Basic Integration Examples

#### Replace Standard Buttons with Magnetic Buttons

**Before:**
```tsx
// In your existing components
<button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">
  Contact Me
</button>
```

**After:**
```tsx
import { MagneticButton } from '@/components/animations';

<MagneticButton 
  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
  onClick={() => router.push('/contact')}
>
  Contact Me
</MagneticButton>
```

#### Enhance Hero Section with Animated Counters

**Before:**
```tsx
// In components/EnhancedHero.tsx
<div className="text-4xl font-bold text-primary">$30M+</div>
<div className="text-4xl font-bold text-primary">98%</div>
```

**After:**
```tsx
import { AnimatedCounter } from '@/components/animations';

<AnimatedCounter 
  value={30000000} 
  prefix="$" 
  suffix="M+" 
  className="text-4xl font-bold text-primary"
  duration={2.5}
/>
<AnimatedCounter 
  value={98} 
  suffix="%" 
  className="text-4xl font-bold text-primary"
  duration={2}
/>
```

## Component-Specific Integration

### 1. Hero Section Enhancement

```tsx
// components/EnhancedHero.tsx
import { AnimatedCounter, StaggeredList, MagneticButton } from '@/components/animations';

export const EnhancedHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <StaggeredList className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold">
            Building Digital Excellence
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming ideas into scalable solutions with modern technology
          </p>
          
          {/* Animated metrics */}
          <div className="grid grid-cols-3 gap-8 my-12">
            <div className="text-center">
              <AnimatedCounter 
                value={30000000} 
                prefix="$" 
                suffix="M+" 
                className="text-4xl font-bold text-primary"
              />
              <p className="text-muted-foreground">Business Impact</p>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                value={98} 
                suffix="%" 
                className="text-4xl font-bold text-green-500"
              />
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                value={150} 
                suffix="+" 
                className="text-4xl font-bold text-purple-500"
              />
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
          </div>
          
          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold"
              strength={0.4}
            >
              View My Work
            </MagneticButton>
            
            <MagneticButton 
              className="px-8 py-4 border border-border rounded-lg text-lg font-semibold hover:bg-muted/50"
              strength={0.2}
            >
              Get In Touch
            </MagneticButton>
          </div>
        </StaggeredList>
      </div>
    </section>
  );
};
```

### 2. Project Cards with Interactive Effects

```tsx
// components/RecentProjects.tsx
import { InteractiveCard, StaggeredList } from '@/components/animations';

export const RecentProjects = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Recent Projects</h2>
        
        <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <InteractiveCard
              key={project.id}
              className="bg-card border border-border rounded-xl p-6"
              glowEffect
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <div className="aspect-video bg-muted rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </InteractiveCard>
          ))}
        </StaggeredList>
      </div>
    </section>
  );
};
```

### 3. Loading States for Data Fetching

```tsx
// components/ProjectsClient.tsx
import { SkeletonLoader, ContentPlaceholder, DomainLoader } from '@/components/animations';

export const ProjectsClient = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<string>('full-stack');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <DomainLoader 
            domain={domain as any} 
            message="Loading projects..."
          />
        </div>
        <ContentPlaceholder type="card" count={6} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Your projects content */}
    </div>
  );
};
```

### 4. Enhanced Navigation with Transitions

```tsx
// components/ui/navigation/MegaMenu.tsx
import { ModalTransition, TabTransition } from '@/components/animations';

export const MegaMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('services');

  const tabs = [
    {
      id: 'services',
      label: 'Services',
      content: <ServicesMenu />
    },
    {
      id: 'projects',
      label: 'Projects', 
      content: <ProjectsMenu />
    },
    {
      id: 'about',
      label: 'About',
      content: <AboutMenu />
    }
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Menu
      </button>
      
      <ModalTransition
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="slide"
      >
        <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
          <TabTransition
            activeTab={activeTab}
            tabs={tabs}
            onTabChange={setActiveTab}
            className="p-6"
          />
        </div>
      </ModalTransition>
    </>
  );
};
```

### 5. Form Enhancement with Micro-Interactions

```tsx
// components/EnhancedContactForm.tsx
import { RippleButton, AnimatedProgressBar } from '@/components/animations';

export const EnhancedContactForm = () => {
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form className="space-y-6">
      {/* Progress indicator */}
      <AnimatedProgressBar 
        progress={progress} 
        showLabel 
        label="Form Completion"
        className="mb-6"
      />
      
      {/* Form fields */}
      <div className="space-y-4">
        {/* Your existing form fields */}
      </div>
      
      {/* Enhanced submit button */}
      <RippleButton 
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </RippleButton>
    </form>
  );
};
```

## Page-Level Integration

### 1. Add Page Transitions

```tsx
// app/layout.tsx
import { PageTransition } from '@/components/animations';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageTransition variant="fadeBlur" duration={0.3}>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
```

### 2. Domain-Specific Loading States

```tsx
// app/cloud-engineering/page.tsx
import { DomainLoader } from '@/components/animations';

export default function CloudEngineeringPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DomainLoader 
          domain="cloud" 
          message="Loading cloud engineering portfolio..."
        />
      </div>
    );
  }

  return (
    <div>
      {/* Your page content */}
    </div>
  );
}
```

## Global Integration Patterns

### 1. Create Animation Wrapper Components

```tsx
// components/ui/AnimatedSection.tsx
import { StaggeredList } from '@/components/animations';

interface AnimatedSectionProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  staggerDelay = 0.1
}) => {
  return (
    <StaggeredList 
      className={`space-y-8 ${className}`}
      staggerDelay={staggerDelay}
    >
      {children}
    </StaggeredList>
  );
};
```

### 2. Enhanced Button Component

```tsx
// components/ui/EnhancedButton.tsx
import { MagneticButton, RippleButton } from '@/components/animations';

interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?: 'magnetic' | 'ripple' | 'standard';
  className?: string;
  onClick?: () => void;
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'magnetic',
  className = "",
  onClick
}) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-colors";
  
  switch (variant) {
    case 'magnetic':
      return (
        <MagneticButton 
          className={`${baseClasses} ${className}`}
          onClick={onClick}
        >
          {children}
        </MagneticButton>
      );
    
    case 'ripple':
      return (
        <RippleButton 
          className={`${baseClasses} ${className}`}
          onClick={onClick}
        >
          {children}
        </RippleButton>
      );
    
    default:
      return (
        <button 
          className={`${baseClasses} ${className}`}
          onClick={onClick}
        >
          {children}
        </button>
      );
  }
};
```

## Performance Considerations

### 1. Lazy Loading Animations

```tsx
// components/LazyAnimations.tsx
import { lazy, Suspense } from 'react';
import { SkeletonLoader } from '@/components/animations';

const HeavyAnimation = lazy(() => import('@/components/animations/HeavyAnimation'));

export const LazyAnimationWrapper = () => {
  return (
    <Suspense fallback={<SkeletonLoader height="200px" />}>
      <HeavyAnimation />
    </Suspense>
  );
};
```

### 2. Conditional Animation Loading

```tsx
// hooks/useAnimations.ts
import { useReducedMotion } from 'framer-motion';

export const useAnimations = () => {
  const shouldReduceMotion = useReducedMotion();
  
  return {
    shouldAnimate: !shouldReduceMotion,
    duration: shouldReduceMotion ? 0 : 0.3,
    staggerDelay: shouldReduceMotion ? 0 : 0.1
  };
};
```

## Migration Strategy

### Phase 1: High-Impact Areas
1. Hero section with animated counters
2. CTA buttons with magnetic effects
3. Project cards with interactive hover

### Phase 2: Navigation & Forms
1. Navigation with smooth transitions
2. Contact forms with progress indicators
3. Modal dialogs with entrance animations

### Phase 3: Loading States
1. Page transitions between routes
2. Skeleton loaders for data fetching
3. Domain-specific loading states

### Phase 4: Advanced Interactions
1. Carousel components for testimonials
2. Accordion sections for FAQs
3. Staggered reveals for content sections

## Testing Integration

```tsx
// __tests__/animations/integration.test.tsx
import { render, screen } from '@testing-library/react';
import { MagneticButton } from '@/components/animations';

describe('Animation Integration', () => {
  it('renders magnetic button with accessibility', () => {
    render(
      <MagneticButton className="test-button">
        Test Button
      </MagneticButton>
    );
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('test-button');
  });
});
```

This integration guide provides a systematic approach to enhancing your existing portfolio with the new animation system while maintaining performance and accessibility standards.
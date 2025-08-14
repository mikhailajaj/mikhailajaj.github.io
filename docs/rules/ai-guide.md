# AI Development Guide for Mikhail Ajaj Portfolio

This guide provides comprehensive instructions for AI assistants working on the **Mikhail Ajaj Portfolio** project, ensuring consistent, high-quality implementations that reflect professional standards and multi-domain expertise.

## 🎯 **Project Context**

The Mikhail Ajaj Portfolio is a professional showcase demonstrating expertise across five key domains:
- **Full-Stack Development**: Modern web applications with React, Next.js, TypeScript
- **Cloud Engineering**: AWS, Azure, infrastructure as code, serverless architectures
- **Data Analytics**: Data pipelines, visualization, machine learning integration
- **UX/UI Design**: User-centered design, accessibility, design systems
- **Technical Consulting**: Architecture decisions, performance optimization, best practices

## 🏗️ **Architecture Understanding**

### **Domain-Driven Structure**
```
portfolio/
├── app/                     # Next.js 14 App Router
│   ├── (domains)/          # Domain-specific pages
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Component hierarchy
│   ├── ui/base/           # Fundamental components (Button, Card, etc.)
│   ├── ui/layout/         # Layout components
│   ├── ui/navigation/     # Navigation components
│   ├── features/          # Feature-specific components
│   └── domain-specific/   # Domain-aware components
├── lib/                   # Utilities and configurations
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── contexts/         # React contexts
├── data/                 # Data and schemas
│   ├── schemas/          # TypeScript schemas
│   └── projects/         # Project data by domain
└── docs/                 # Documentation and rules
    └── rules/            # Development guidelines
```

### **Import Hierarchy (Critical)**
Always follow this exact import order:
```typescript
// 1. React and Next.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. External libraries
import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';

// 3. Internal absolute imports (in order)
import { cn } from '@/lib/utils/cn';
import { hydrationSafeUseEffect } from '@/lib/utils/hydration';
import type { Project } from '@/data/schemas/project';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';
import { ProjectCard } from '@/components/features/projects/ProjectCard';

// 4. Relative imports
import { LocalComponent } from './LocalComponent';
import type { LocalType } from './types';

// 5. CSS imports (last)
import './Component.css';
```

## 🎨 **Design System Requirements**

### **Color System**
```typescript
// Domain-specific colors (WCAG AA compliant)
const domainColors = {
  'full-stack': '#1e40af',      // Blue - 4.8:1 contrast
  'cloud': '#0369a1',           // Sky Blue - 5.2:1 contrast
  'data': '#059669',            // Green - 4.6:1 contrast
  'ux-ui': '#7c3aed',           // Purple - 4.7:1 contrast
  'consulting': '#ea580c'       // Orange - 4.5:1 contrast
};

// Usage in components
const getDomainColor = (domain: Domain) => domainColors[domain];
```

### **Typography Standards**
```typescript
// Accessible typography scale
const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px - Minimum for accessibility
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
};
```

## ♿ **Accessibility Requirements (Critical)**

### **WCAG 2.1 AA Compliance**
Every component must include:

```typescript
// ✅ Required accessibility features
const AccessibleComponent = ({ title, description }: Props) => {
  return (
    <section
      role="region"
      aria-labelledby="section-title"
      aria-describedby="section-description"
    >
      <h2 id="section-title">{title}</h2>
      <p id="section-description">{description}</p>
      
      {/* Interactive elements */}
      <button
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Descriptive action label"
      >
        Action
      </button>
    </section>
  );
};
```

### **Keyboard Navigation**
```typescript
// ✅ Keyboard navigation pattern
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault();
      focusNext();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault();
      focusPrevious();
      break;
    case 'Home':
      e.preventDefault();
      focusFirst();
      break;
    case 'End':
      e.preventDefault();
      focusLast();
      break;
    case 'Escape':
      closeModal();
      break;
  }
};
```

## 🚀 **Performance Requirements**

### **Core Web Vitals Targets**
```typescript
// Performance budgets
const performanceTargets = {
  LCP: 1200,  // Largest Contentful Paint (ms)
  FID: 100,   // First Input Delay (ms)
  CLS: 0.1,   // Cumulative Layout Shift
  INP: 200,   // Interaction to Next Paint (ms)
};

// Implementation patterns
const OptimizedComponent = () => {
  // ✅ Lazy loading
  const LazyComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <Skeleton />,
    ssr: false
  });
  
  // ✅ Image optimization
  return (
    <Image
      src="/project-image.jpg"
      alt="Project screenshot"
      width={800}
      height={600}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
};
```

### **Animation Performance**
```typescript
// ✅ GPU-accelerated animations
const animationVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// ✅ Respect reduced motion
const prefersReducedMotion = useReducedMotion();
const animationProps = prefersReducedMotion 
  ? { initial: false, animate: false }
  : { variants: animationVariants };
```

## 📱 **Mobile-First Development**

### **Responsive Design Patterns**
```typescript
// ✅ Mobile-first breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// ✅ Touch-friendly interactions
const MobileComponent = () => {
  return (
    <button
      className={cn(
        "min-h-[44px] min-w-[44px]", // Touch target size
        "p-3", // Adequate padding
        "active:scale-95", // Touch feedback
        "transition-transform duration-150"
      )}
    >
      Touch Action
    </button>
  );
};
```

## 🧪 **Testing Requirements**

### **Component Testing Pattern**
```typescript
// ✅ Required test structure
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('should be accessible', async () => {
    const { container } = render(<ComponentName {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should handle keyboard navigation', () => {
    render(<ComponentName {...defaultProps} />);
    const element = screen.getByRole('button');
    
    fireEvent.keyDown(element, { key: 'Enter' });
    // Assert expected behavior
  });
  
  it('should work on mobile', () => {
    // Mobile-specific test cases
  });
});
```

## 🎯 **AI Development Guidelines**

### **When Creating Components**
1. **Always start with accessibility**: Include proper ARIA labels, roles, and keyboard navigation
2. **Follow the import hierarchy**: Use the exact order specified above
3. **Implement responsive design**: Mobile-first approach with proper breakpoints
4. **Add performance optimizations**: Lazy loading, image optimization, animation considerations
5. **Include comprehensive TypeScript types**: No `any` types allowed
6. **Write tests**: Component, accessibility, and interaction tests
7. **Document the component**: JSDoc comments with usage examples

### **Component Template**
```typescript
/**
 * ComponentName - Brief description
 * 
 * Detailed description of what this component does and how it fits
 * into the portfolio architecture.
 * 
 * @example
 * <ComponentName 
 *   prop1="value1"
 *   prop2={value2}
 *   onAction={handleAction}
 * />
 */

"use client";

// Imports following hierarchy
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/base/Button';

// Types
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Constants
const ANIMATION_DURATION = 0.6;

// Component
export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2 = 0,
  onAction,
  className,
  children
}) => {
  // Hooks
  const [state, setState] = useState(false);
  
  // Event handlers
  const handleClick = () => {
    setState(!state);
    onAction?.();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATION }}
      className={cn(
        "component-base-styles",
        "focus-visible:outline-none focus-visible:ring-2",
        className
      )}
      role="region"
      aria-label="Component description"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
      
      <Button
        onClick={handleClick}
        aria-label="Descriptive action label"
      >
        Action
      </Button>
    </motion.div>
  );
};

// Display name for debugging
ComponentName.displayName = 'ComponentName';

// Export types
export type { ComponentNameProps };
```

### **Page Template**
```typescript
/**
 * Page Name
 * 
 * Description of the page and its purpose in the portfolio.
 */

import type { Metadata } from 'next';
import { PageComponent } from '@/components/features/page/PageComponent';

// SEO metadata
export const metadata: Metadata = {
  title: 'Page Title | Mikhail Ajaj',
  description: 'Page description for SEO',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    type: 'website',
  },
};

// Page component
export default function PageName() {
  return (
    <main
      id="main-content"
      role="main"
      className="min-h-screen"
    >
      <PageComponent />
    </main>
  );
}
```

## 🔍 **Code Review Checklist**

When reviewing AI-generated code, ensure:

### **Architecture**
- [ ] Follows domain-driven structure
- [ ] Uses correct import hierarchy
- [ ] No circular dependencies
- [ ] Proper abstraction levels

### **Accessibility**
- [ ] WCAG 2.1 AA compliant
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation implemented
- [ ] Screen reader friendly
- [ ] Color contrast meets standards

### **Performance**
- [ ] Images optimized
- [ ] Lazy loading where appropriate
- [ ] Animations respect reduced motion
- [ ] Bundle size impact minimal
- [ ] Core Web Vitals maintained

### **Mobile Experience**
- [ ] Touch targets 44px minimum
- [ ] Responsive design implemented
- [ ] Works on small screens
- [ ] Touch interactions smooth

### **Code Quality**
- [ ] TypeScript types complete
- [ ] No `any` types
- [ ] Error handling implemented
- [ ] Tests written and passing
- [ ] Documentation complete

## 🚨 **Common Mistakes to Avoid**

1. **Import Order**: Never deviate from the specified import hierarchy
2. **Accessibility**: Don't skip ARIA labels, roles, or keyboard navigation
3. **Performance**: Avoid large bundle imports or unoptimized images
4. **Mobile**: Don't forget touch target sizes or responsive design
5. **Types**: Never use `any` - always provide proper TypeScript types
6. **Testing**: Don't skip accessibility or mobile tests
7. **SEO**: Always include proper metadata for pages
8. **Hydration**: Be careful with client-side only code

## 🎯 **Success Criteria**

AI-generated code is successful when it:

1. **Demonstrates Technical Excellence**: Clean, performant, well-structured code
2. **Follows Accessibility Standards**: WCAG 2.1 AA compliant
3. **Provides Great User Experience**: Smooth, intuitive interactions
4. **Works Across Devices**: Responsive and mobile-friendly
5. **Maintains Performance**: Meets Core Web Vitals targets
6. **Reflects Professional Standards**: Production-ready quality
7. **Integrates Seamlessly**: Fits naturally into existing architecture

Remember: This portfolio is a professional showcase. Every line of code should demonstrate expertise and attention to detail that reflects the quality clients and employers expect.
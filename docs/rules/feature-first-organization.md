# Feature-First Organization for Mikhail Ajaj Portfolio

This document outlines the feature-first organizational approach used in the **Mikhail Ajaj Portfolio** project, designed to showcase multi-domain expertise while maintaining clean, scalable architecture.

## 🎯 **Philosophy**

The portfolio uses a **domain-aware, feature-first** organization that reflects the five core expertise areas:
- **Full-Stack Development**
- **Cloud Engineering** 
- **Data Analytics**
- **UX/UI Design**
- **Technical Consulting**

This structure demonstrates architectural thinking while keeping related functionality grouped together for maintainability.

## 🏗️ **Directory Structure**

### **App Router Organization**
```
app/
├── (domains)/                   # Domain-specific pages
│   ├── full-stack/
│   │   ├── page.tsx            # Full-stack showcase
│   │   └── loading.tsx         # Loading state
│   ├── cloud-engineering/
│   │   ├── page.tsx            # Cloud projects
│   │   └── loading.tsx
│   ├── data-analytics/
│   │   ├── page.tsx            # Data projects
│   │   └── loading.tsx
│   ├── ux-ui-design/
│   │   ├── page.tsx            # Design projects
│   │   └── loading.tsx
│   └── technical-consulting/
│       ├── page.tsx            # Consulting projects
│       └── loading.tsx
├── projects/
│   ├── page.tsx                # All projects overview
│   └── [id]/
│       └── page.tsx            # Individual project
├── contact/
│   └── page.tsx                # Contact form
├── blog/
│   ├── page.tsx                # Blog listing
│   └── [slug]/
│       └── page.tsx            # Blog post
├── layout.tsx                  # Root layout
├── page.tsx                    # Homepage
└── globals.css                 # Global styles
```

### **Component Organization**
```
components/
├── ui/                         # Base UI system
│   ├── base/                   # Fundamental components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   ├── Container.tsx
│   │   ├── Grid.tsx
│   │   └── Section.tsx
│   ├── navigation/             # Navigation components
│   │   ├── MainNavigation.tsx
│   │   ├── MobileBottomNav.tsx
│   │   └── DomainAwareNavigation.tsx
│   └── accessibility/          # Accessibility components
│       ├── AccessibilityToolbar.tsx
│       └── SkipLinks.tsx
├── features/                   # Feature-specific components
│   ├── homepage/
│   │   ├── Hero.tsx
│   │   ├── DomainShowcase.tsx
│   │   └── RecentProjects.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectFilter.tsx
│   │   └── ProjectDetail.tsx
│   ├── contact/
│   │   ├── ContactForm.tsx
│   │   └── ContactInfo.tsx
│   ├── blog/
│   │   ├── BlogCard.tsx
│   │   ├── BlogGrid.tsx
│   │   └── BlogPost.tsx
│   └── analytics/
│       ├── PerformanceMonitor.tsx
│       └── UserAnalytics.tsx
├── domain-specific/            # Domain-aware components
│   ├── full-stack/
│   │   ├── TechStackShowcase.tsx
│   │   └── CodeExamples.tsx
│   ├── cloud/
│   │   ├── ArchitectureDiagram.tsx
│   │   └── InfrastructureShowcase.tsx
│   ├── data/
│   │   ├── DataVisualization.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── ux-ui/
│   │   ├── DesignShowcase.tsx
│   │   └── PrototypeViewer.tsx
│   └── consulting/
│       ├── CaseStudyCard.tsx
│       └── ServiceOffering.tsx
└── 3d/                         # 3D components
    ├── core/
    │   ├── Scene.tsx
    │   └── Camera.tsx
    ├── components/
    │   ├── InteractiveModel.tsx
    │   └── PortfolioShowcase.tsx
    └── visualizations/
        ├── DataVisualization3D.tsx
        └── ArchitectureVisualization.tsx
```

### **Data Organization**
```
data/
├── schemas/                    # TypeScript schemas
│   ├── project.ts             # Project data structure
│   ├── blog.ts                # Blog post structure
│   └── service.ts             # Service offering structure
├── projects/                   # Project data by domain
│   ├── full-stack.ts
│   ├── cloud.ts
│   ├── data-analytics.ts
│   ├── ux-ui-design.ts
│   └── technical-consulting.ts
├── content/                    # Static content
│   ├── blog/                  # Blog posts
│   └── case-studies/          # Case studies
└── constants/                  # Application constants
    ├── domains.ts
    ├── navigation.ts
    └── themes.ts
```

### **Library Organization**
```
lib/
├── utils/                      # Utility functions
│   ├── cn.ts                  # Class name utility
│   ├── hydration.tsx          # Hydration utilities
│   └── performance.ts         # Performance utilities
├── hooks/                      # Custom hooks
│   ├── useScrollAnimation.ts
│   ├── useUserPreferences.ts
│   └── useProgressiveLoading.ts
├── contexts/                   # React contexts
│   ├── ThemeContext.tsx
│   └── UserPreferencesContext.tsx
├── services/                   # External services
│   ├── analytics.ts
│   └── api.ts
└── types/                      # Global types
    ├── index.ts
    └── api.ts
```

## 🎨 **Feature Boundaries**

### **Core Features**
1. **Homepage**: Hero, domain showcase, recent projects
2. **Projects**: Project listing, filtering, individual project pages
3. **Blog**: Blog listing, individual posts, categories
4. **Contact**: Contact form, information, social links
5. **Navigation**: Main nav, mobile nav, domain-aware navigation

### **Domain Features**
1. **Full-Stack**: Tech stack showcase, code examples, project demos
2. **Cloud**: Architecture diagrams, infrastructure showcases
3. **Data**: Data visualizations, analytics dashboards
4. **UX/UI**: Design showcases, prototype viewers
5. **Consulting**: Case studies, service offerings

### **Supporting Features**
1. **3D Visualizations**: Interactive models, portfolio showcases
2. **Analytics**: Performance monitoring, user analytics
3. **Accessibility**: Accessibility toolbar, skip links
4. **Performance**: Progressive loading, optimization

## 📋 **Naming Conventions**

### **Files and Directories**
```typescript
// ✅ Correct naming patterns
components/
├── ui/base/Button.tsx          # PascalCase for components
├── features/homepage/Hero.tsx  # Feature-specific components
├── domain-specific/cloud/      # kebab-case for directories
└── 3d/core/Scene.tsx          # Descriptive directory names

// ✅ Hook naming
hooks/
├── useScrollAnimation.ts       # camelCase with 'use' prefix
├── useUserPreferences.ts       # Descriptive hook names
└── useProgressiveLoading.ts    # Clear purpose

// ✅ Utility naming
lib/utils/
├── cn.ts                      # Short, clear utility names
├── hydration.tsx              # Descriptive utility names
└── performance.ts             # Domain-specific utilities
```

### **Component Structure**
```typescript
// ✅ Feature component structure
features/projects/
├── ProjectCard.tsx            # Main component
├── ProjectGrid.tsx            # Related components
├── ProjectFilter.tsx          # Feature-specific components
├── components/                # Internal components
│   ├── ProjectTechStack.tsx
│   └── ProjectActions.tsx
├── hooks/                     # Feature-specific hooks
│   ├── useProjectFilter.ts
│   └── useProjectData.ts
├── types/                     # Feature-specific types
│   └── index.ts
└── index.ts                   # Public API exports
```

## 🔄 **Import/Export Rules**

### **Import Hierarchy**
```typescript
// ✅ Correct import order and sources
import React from 'react';                    // External libraries
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils/cn';          // Utilities first
import type { Project } from '@/data/schemas/project'; // Data/types
import { useScrollAnimation } from '@/hooks/useScrollAnimation'; // Hooks
import { Button } from '@/components/ui/base/Button'; // Base UI
import { Card } from '@/components/ui/layout/Card';   // Layout UI
import { ProjectCard } from '@/components/features/projects/ProjectCard'; // Features

import { LocalComponent } from './LocalComponent'; // Relative imports
import './Component.css';                     // Styles last
```

### **Export Patterns**
```typescript
// ✅ Feature public API (index.ts)
export { ProjectCard } from './ProjectCard';
export { ProjectGrid } from './ProjectGrid';
export { ProjectFilter } from './ProjectFilter';
export type { ProjectCardProps, ProjectGridProps } from './types';

// ✅ Component exports
export const ProjectCard: React.FC<ProjectCardProps> = ({ ... }) => {
  // Component implementation
};

export type { ProjectCardProps };
```

## 🎯 **Domain-Aware Architecture**

### **Domain Context**
```typescript
// Domain-aware theming and behavior
export const DomainContext = createContext<{
  currentDomain: Domain;
  domainColors: Record<Domain, string>;
  domainProjects: Record<Domain, Project[]>;
}>({
  currentDomain: 'full-stack',
  domainColors: {
    'full-stack': '#1e40af',
    'cloud': '#0369a1',
    'data': '#059669',
    'ux-ui': '#7c3aed',
    'consulting': '#ea580c'
  },
  domainProjects: {}
});

// Usage in components
const { currentDomain, domainColors } = useDomain();
const themeColor = domainColors[currentDomain];
```

### **Domain-Specific Components**
```typescript
// ✅ Domain-aware component structure
domain-specific/
├── full-stack/
│   ├── TechStackShowcase.tsx   # React, Next.js, TypeScript showcase
│   ├── CodeExamples.tsx        # Interactive code examples
│   └── ProjectDemo.tsx         # Live project demonstrations
├── cloud/
│   ├── ArchitectureDiagram.tsx # AWS/Azure architecture diagrams
│   ├── InfrastructureShowcase.tsx # Infrastructure as code examples
│   └── DeploymentPipeline.tsx  # CI/CD pipeline visualization
└── data/
    ├── DataVisualization.tsx   # D3.js data visualizations
    ├── AnalyticsDashboard.tsx  # Analytics dashboard components
    └── MLModelShowcase.tsx     # Machine learning model demos
```

## 🧪 **Testing Organization**

### **Test Structure**
```
__tests__/
├── components/
│   ├── ui/base/
│   │   ├── Button.test.tsx
│   │   └── Card.test.tsx
│   ├── features/
│   │   ├── projects/
│   │   │   ├── ProjectCard.test.tsx
│   │   │   └── ProjectGrid.test.tsx
│   │   └── homepage/
│   │       └── Hero.test.tsx
│   └── domain-specific/
│       ├── full-stack/
│       │   └── TechStackShowcase.test.tsx
│       └── cloud/
│           └── ArchitectureDiagram.test.tsx
├── hooks/
│   ├── useScrollAnimation.test.ts
│   └── useUserPreferences.test.ts
├── utils/
│   ├── cn.test.ts
│   └── performance.test.ts
└── accessibility/
    ├── navigation.test.tsx
    └── keyboard-navigation.test.tsx
```

### **Test Patterns**
```typescript
// ✅ Component test structure
describe('ProjectCard', () => {
  const mockProject = {
    id: '1',
    title: 'Test Project',
    description: 'Test description',
    domain: 'full-stack' as Domain,
    technologies: ['React', 'TypeScript'],
    image: '/test-image.jpg',
    githubUrl: 'https://github.com/test',
    liveUrl: 'https://test.com'
  };

  it('should render project information correctly', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should handle domain theming', () => {
    render(<ProjectCard project={mockProject} />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('domain-full-stack');
  });
});
```

## 📚 **Documentation Standards**

### **Feature Documentation**
```markdown
# Feature Name

## Overview
Brief description of the feature and its purpose in the portfolio.

## Components
- **ComponentName**: Description of what it does
- **AnotherComponent**: Description of what it does

## Usage
```typescript
import { ComponentName } from '@/components/features/feature-name';

<ComponentName 
  prop1="value"
  prop2={value}
  onAction={handleAction}
/>
```

## Domain Integration
How this feature integrates with domain-specific functionality.

## Accessibility
Accessibility considerations and implementations.

## Performance
Performance optimizations and considerations.
```

### **Component Documentation**
```typescript
/**
 * ProjectCard - Displays individual project information
 * 
 * A responsive card component that showcases project details with
 * domain-aware theming and interactive features. Includes accessibility
 * features and performance optimizations.
 * 
 * @example
 * <ProjectCard 
 *   project={projectData}
 *   featured={true}
 *   onViewDetails={handleViewDetails}
 * />
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  featured = false,
  onViewDetails
}) => {
  // Implementation
};
```

## 🚀 **Migration Guidelines**

### **Adding New Features**
1. **Identify the feature scope**: Determine if it's a core feature, domain feature, or supporting feature
2. **Create the directory structure**: Follow the established patterns
3. **Implement components**: Start with base components, then build up
4. **Add tests**: Component, accessibility, and integration tests
5. **Document the feature**: Add README and component documentation
6. **Integrate with existing features**: Update navigation, routing, etc.

### **Refactoring Existing Code**
1. **Identify feature boundaries**: Group related functionality
2. **Extract shared code**: Move common utilities to appropriate locations
3. **Update imports**: Follow the import hierarchy rules
4. **Add missing tests**: Ensure comprehensive test coverage
5. **Update documentation**: Keep documentation current

## 🎯 **Best Practices**

### **Feature Development**
- **Single Responsibility**: Each feature should have a clear, focused purpose
- **Loose Coupling**: Features should be independent and loosely coupled
- **High Cohesion**: Related functionality should be grouped together
- **Clear Interfaces**: Features should have well-defined public APIs

### **Component Design**
- **Composition over Inheritance**: Use composition to build complex components
- **Props Interface**: Define clear, typed props interfaces
- **Default Props**: Provide sensible defaults for optional props
- **Error Boundaries**: Implement error boundaries for robust error handling

### **Performance Considerations**
- **Code Splitting**: Split features into separate bundles
- **Lazy Loading**: Load features on demand when possible
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Bundle Analysis**: Monitor bundle size impact of new features

## 🔍 **Quality Assurance**

### **Code Review Checklist**
- [ ] Follows feature-first organization principles
- [ ] Uses correct import hierarchy
- [ ] Includes comprehensive tests
- [ ] Has proper documentation
- [ ] Implements accessibility features
- [ ] Considers performance impact
- [ ] Follows naming conventions
- [ ] Has clear component interfaces

### **Automated Checks**
- **ESLint**: Enforces code style and import rules
- **TypeScript**: Ensures type safety
- **Jest**: Runs unit and integration tests
- **Axe**: Checks accessibility compliance
- **Bundle Analyzer**: Monitors bundle size

This feature-first organization ensures the Mikhail Ajaj Portfolio maintains clean architecture while effectively showcasing multi-domain expertise through well-organized, maintainable code.
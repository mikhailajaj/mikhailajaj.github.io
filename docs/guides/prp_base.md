name: "Portfolio PRP Template v2 - Context-Rich with Validation Loops"
description: |

## Purpose

Template optimized for portfolio development tasks with sufficient context and self-validation capabilities to achieve working implementations through iterative refinement.

## Core Principles

1. **Context is King**: Include ALL necessary documentation, examples, and portfolio-specific patterns
2. **Validation Loops**: Provide executable tests/checks the developer can run and fix
3. **Information Dense**: Use keywords and patterns from the Next.js portfolio codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Portfolio Standards**: Follow established portfolio architecture and clean code principles

---

## Goal

[What needs to be built - be specific about the portfolio feature and desired end state]

## Why

- [Business value and user impact for portfolio visitors]
- [Integration with existing portfolio features]
- [Problems this solves for portfolio users/clients]

## What

[User-visible behavior and technical requirements for portfolio implementation]

### Success Criteria

- [ ] [Specific measurable outcomes for portfolio feature]

## All Needed Context

### Documentation & References (list all context needed to implement the portfolio feature)

```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app
  why: Next.js 15 App Router patterns, static export, performance optimization

- file: package.json
  why: Dependencies, scripts, project configuration understanding

- file: components/ui/
  why: Portfolio component patterns, prop interfaces, usage examples

- doc: https://tailwindcss.com/docs
  section: Component patterns and utility classes
  critical: Custom design system implementation in tailwind.config.ts

- file: app/api/
  why: API route patterns, request/response formats, error handling

- file: lib/contexts/
  why: React context patterns, state management, performance optimization

- file: docs/architecture/system-overview.md
  why: Portfolio architecture patterns and SoC implementation

- docfile: docs/project-management/README.md
  why: Clean code principles and project management standards

- file: data/projects/
  why: Data structure patterns for portfolio content

- file: components/domain-specific/
  why: Domain-separated component organization patterns
```

### Current Portfolio Codebase Structure

```bash
mikhailajaj.github.io/
├── app/                          # Next.js App Router
│   ├── (domains)/               # Domain-specific pages
│   │   ├── full-stack/
│   │   ├── cloud-engineering/
│   │   ├── data-analytics/
│   │   ├── ux-ui-design/
│   │   └── technical-consulting/
│   ├── api/                     # API routes
│   │   ├── contact/
│   │   ├── projects/
│   │   ├── technologies/
│   │   └── testimonials/
│   ├── blog/                    # MDX blog system
│   └── globals.css              # Global styles
├── components/                   # SoC-organized components
│   ├── domain-specific/         # Domain-separated acomponents
│   ├── features/               # Feature-specific components
│   ├── interactive/            # Interactive demos and calculators
│   ├── 3d/                     # 3D visualization components
│   ├── ui/                     # Base UI component library
│   └── layouts/                # Layout components
├── data/                       # Structured data
│   ├── projects/               # Domain-specific project data
│   ├── schemas/                # TypeScript schemas
│   └── types/                  # Type definitions
├── lib/                        # Business logic and utilities
│   ├── analytics/              # Analytics and tracking
│   ├── contexts/               # React contexts (optimized)
│   ├── hooks/                  # Custom React hooks
│   └── services/               # Business logic services
├── content/blog/               # MDX blog posts
├── docs/                       # Comprehensive documentation
└── public/                     # Static assets
```

### Desired Portfolio Structure with files to be added

```bash
[Specify new files/directories to be created and their responsibilities]

Example:
├── components/interactive/
│   └── NewFeatureCalculator.tsx    # 🔄 Interactive calculator component
├── app/new-feature/
│   └── page.tsx                    # 🔄 New feature page
├── data/
│   └── new-feature-data.ts         # 🔄 Feature-specific data
└── lib/services/
    └── NewFeatureService.ts        # 🔄 Business logic service

Legend: ✅ Exists | 🔄 To be created/enhanced
```

### Known Portfolio Gotchas & Library Quirks

```typescript
// CRITICAL: Next.js 15 App Router requires specific patterns
// Example: Server components cannot use useState or browser APIs
// Example: Client components must have 'use client' directive
// Example: Static export requires specific configuration in next.config.mjs

// CRITICAL: Portfolio uses TypeScript strict mode
// Example: All props interfaces must be explicitly typed
// Example: No implicit any types allowed
// Example: Strict null checks enforced throughout

// CRITICAL: Portfolio SoC (Separation of Concerns) architecture
// Example: Domain-specific components go in components/domain-specific/
// Example: Interactive features go in components/interactive/
// Example: Base UI components go in components/ui/

// CRITICAL: Portfolio performance optimization patterns
// Example: Use React.memo for expensive components
// Example: Implement proper loading states with Suspense
// Example: Use dynamic imports for heavy 3D components

// CRITICAL: Portfolio data management patterns
// Example: All data must follow TypeScript schemas in data/schemas/
// Example: Use centralized data services in lib/services/
// Example: Implement proper error boundaries for data fetching

// CRITICAL: Portfolio styling patterns
// Example: Use CVA (class-variance-authority) for component variants
// Example: Follow mobile-first responsive design
// Example: Use custom design tokens from tailwind.config.ts

// CRITICAL: Portfolio analytics and tracking
// Example: All user interactions must be tracked via lib/analytics/
// Example: Follow privacy-compliant tracking patterns
// Example: Use proper event naming conventions
```

## Implementation Blueprint

### Portfolio Data Models and Structure

Create data models following portfolio patterns for type safety and consistency.

```typescript
// Portfolio Data Schema Pattern
interface PortfolioFeatureData {
  id: string;
  title: string;
  description: string;
  domain: "full-stack" | "cloud" | "data" | "ux-ui" | "consulting";
  technologies: string[];
  impact: {
    revenue?: number;
    savings?: number;
    improvement?: string;
  };
  featured: boolean;
  metadata: {
    createdAt: string;
    updatedAt: string;
    author: string;
  };
}

// Component Props Pattern
interface PortfolioComponentProps {
  data: PortfolioFeatureData;
  variant?: "default" | "featured" | "compact";
  className?: string;
  onInteraction?: (event: AnalyticsEvent) => void;
}

// Service Interface Pattern
interface PortfolioFeatureService {
  getFeatureData(): Promise<PortfolioFeatureData[]>;
  getFeatureById(id: string): Promise<PortfolioFeatureData | null>;
  trackFeatureInteraction(event: AnalyticsEvent): void;
}
```

### List of tasks to be completed to fulfill the Portfolio PRP

```yaml
Task 1: Create Data Layer
CREATE data/schemas/new-feature.ts:
  - FOLLOW pattern from: data/schemas/project.ts
  - DEFINE TypeScript interfaces for feature data
  - INCLUDE validation schemas using Zod
  - PRESERVE portfolio data structure patterns

CREATE data/new-feature-data.ts:
  - MIRROR pattern from: data/projects/
  - IMPLEMENT feature-specific data
  - FOLLOW domain separation principles
  - INCLUDE proper TypeScript typing

Task 2: Create Service Layer
CREATE lib/services/NewFeatureService.ts:
  - FOLLOW pattern from: lib/services/DataService.ts
  - IMPLEMENT business logic for feature
  - INCLUDE proper error handling
  - ADD analytics tracking integration

Task 3: Create Component Layer
CREATE components/ui/NewFeatureComponent.tsx:
  - FOLLOW pattern from: components/ui/ base components
  - USE CVA for component variants
  - IMPLEMENT proper prop interfaces
  - INCLUDE accessibility considerations

CREATE components/interactive/NewFeatureCalculator.tsx:
  - MIRROR pattern from: components/interactive/ROICalculator.tsx
  - IMPLEMENT interactive functionality
  - ADD proper state management
  - INCLUDE analytics tracking

Task 4: Create Page Layer
CREATE app/new-feature/page.tsx:
  - FOLLOW pattern from: existing domain pages
  - IMPLEMENT proper metadata and SEO
  - USE portfolio layout patterns
  - INCLUDE proper error boundaries

Task 5: Integration and Testing
MODIFY app/layout.tsx:
  - ADD navigation links if needed
  - PRESERVE existing navigation structure
  - FOLLOW portfolio navigation patterns

UPDATE relevant documentation:
  - ADD feature to README.md
  - UPDATE API documentation if applicable
  - INCLUDE usage examples
```

### Per Task Implementation Details

```typescript
// Task 1: Data Layer Implementation
// Pattern from data/schemas/project.ts
import { z } from "zod";

export const NewFeatureSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(2000),
  domain: z.enum(["full-stack", "cloud", "data", "ux-ui", "consulting"]),
  technologies: z.array(z.string()),
  impact: z.object({
    revenue: z.number().optional(),
    savings: z.number().optional(),
    improvement: z.string().optional(),
  }),
  featured: z.boolean(),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    author: z.string(),
  }),
});

// Task 2: Service Layer Implementation
// Pattern from lib/services/DataService.ts
export class NewFeatureService {
  static async getFeatureData(): Promise<NewFeatureData[]> {
    // PATTERN: Use existing data fetching patterns
    // INCLUDE: Proper error handling and caching
    // FOLLOW: Portfolio service architecture
  }

  static trackInteraction(event: AnalyticsEvent): void {
    // PATTERN: Use lib/analytics/ tracking patterns
    // INCLUDE: Privacy-compliant tracking
    // FOLLOW: Portfolio analytics standards
  }
}

// Task 3: Component Implementation
// Pattern from components/ui/ and components/interactive/
("use client");

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const newFeatureVariants = cva(
  "portfolio-component-base", // Base classes
  {
    variants: {
      variant: {
        default: "portfolio-default-variant",
        featured: "portfolio-featured-variant",
        compact: "portfolio-compact-variant",
      },
      size: {
        sm: "portfolio-size-sm",
        md: "portfolio-size-md",
        lg: "portfolio-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);
```

### Integration Points

```yaml
NAVIGATION:
  - add to: app/layout.tsx or components/navigation/
  - pattern: "Follow existing navigation structure"
  - preserve: "Existing navigation hierarchy"

ANALYTICS:
  - integrate with: lib/analytics/
  - pattern: "Use existing event tracking patterns"
  - include: "Privacy-compliant tracking implementation"

DATA_FLOW:
  - connect to: lib/contexts/ if needed
  - pattern: "Use optimized context patterns"
  - preserve: "Existing performance optimizations"

STYLING:
  - extend: tailwind.config.ts if needed
  - pattern: "Follow portfolio design system"
  - preserve: "Existing design tokens and patterns"
```

## Validation Loop

### Level 1: Portfolio Standards & Syntax

```bash
# Run these FIRST - fix any errors before proceeding
npm run type-check                    # TypeScript compilation
npm run lint                         # ESLint portfolio standards
npm run format                       # Prettier code formatting

# Portfolio-specific checks
npm run build                        # Next.js build verification
npm run analyze                      # Bundle size analysis

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Portfolio Component Testing

```typescript
// CREATE test files following portfolio patterns
// Pattern from __tests__/ directory

import { render, screen } from '@testing-library/react';
import { NewFeatureComponent } from '@/components/ui/NewFeatureComponent';

describe('NewFeatureComponent', () => {
  it('renders with portfolio standards', () => {
    const mockData = {
      // Use portfolio data patterns
    };

    render(<NewFeatureComponent data={mockData} />);

    // Test accessibility
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Test portfolio-specific functionality
    expect(screen.getByTestId('portfolio-feature')).toHaveClass('portfolio-component-base');
  });

  it('handles analytics tracking', () => {
    // Test analytics integration
    // Follow portfolio tracking patterns
  });

  it('meets accessibility standards', () => {
    // Test WCAG compliance
    // Follow portfolio accessibility patterns
  });
});
```

```bash
# Run portfolio tests
npm run test                         # Jest test suite
npm run test:coverage               # Coverage report
npm run test:accessibility          # Accessibility testing

# Expected: All tests pass, coverage meets portfolio standards
```

### Level 3: Portfolio Integration Test

```bash
# Start portfolio development server
npm run dev

# Test new feature integration
curl -X GET http://localhost:3000/api/new-feature
curl -X GET http://localhost:3000/new-feature

# Test portfolio navigation
# Verify feature appears in navigation
# Test responsive design on mobile/desktop
# Verify analytics tracking in browser dev tools

# Expected: Feature integrates seamlessly with portfolio
```

### Level 4: Portfolio Performance & SEO

```bash
# Performance testing
npm run lighthouse                   # Lighthouse audit
npm run analyze                      # Bundle analysis

# SEO verification
# Check meta tags and structured data
# Verify Open Graph and Twitter cards
# Test social media sharing

# Portfolio standards verification
# Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
# Accessibility: WCAG 2.1 AA compliance
# Performance: 95+ Lighthouse score
```

## Final Portfolio Validation Checklist

- [ ] All portfolio tests pass: `npm run test`
- [ ] No TypeScript errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Performance meets portfolio standards: `npm run lighthouse`
- [ ] Accessibility compliance verified
- [ ] Analytics tracking functional
- [ ] Feature integrates with portfolio navigation
- [ ] Responsive design works on all devices
- [ ] SEO metadata properly configured
- [ ] Documentation updated in relevant files

---

## Portfolio Anti-Patterns to Avoid

- ❌ Don't create components outside the SoC architecture
- ❌ Don't skip TypeScript strict mode compliance
- ❌ Don't ignore portfolio performance standards
- ❌ Don't bypass portfolio analytics tracking patterns
- ❌ Don't use hardcoded values instead of portfolio data patterns
- ❌ Don't create new styling patterns when portfolio patterns exist
- ❌ Don't skip accessibility considerations
- ❌ Don't ignore portfolio error boundary patterns
- ❌ Don't create components without proper prop interfaces
- ❌ Don't skip documentation updates for new features

## Portfolio Success Metrics

- **Integration Quality**: Feature seamlessly integrates with existing portfolio
- **Performance Impact**: No degradation of Core Web Vitals
- **Code Quality**: Maintains portfolio TypeScript and linting standards
- **User Experience**: Enhances portfolio visitor engagement
- **Maintainability**: Follows portfolio architecture and patterns
- **Documentation**: Properly documented for future maintenance
- **Analytics**: Provides valuable user interaction data
- **Accessibility**: Maintains WCAG 2.1 AA compliance

---

_This Portfolio PRP template ensures new features integrate seamlessly with the existing portfolio architecture while maintaining professional standards and performance optimization._

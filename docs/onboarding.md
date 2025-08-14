# My Portfolio - Developer Onboarding Guide

**Last Updated:** December 19, 2024

## Welcome to My Portfolio! 🎉

This guide will help you get started as a developer on the My Portfolio project - a professional portfolio showcasing multi-domain technical expertise.

## Prerequisites

### Required Tools

- **Node.js 18+**: JavaScript runtime
- **npm**: Package manager (comes with Node.js)
- **Git**: Version control
- **VS Code or Cursor IDE**: Recommended editors with TypeScript support

### Account Requirements

- GitHub account with repository access
- Optional: Vercel account for deployment

## Quick Start

### Setup Flow

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd my-portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or with Turbopack for faster builds
   npm run dev --turbo
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

### Verify Installation

Run the health check to ensure everything is working:

```bash
# Type checking
npm run type-check

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
my-portfolio/
├── app/                    # Next.js 15 App Router pages
│   ├── [domain]/          # Domain-specific pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── domain-specific/   # Domain components
│   ├── features/         # Feature components
│   ├── ui/               # Reusable UI components
│   └── layouts/          # Layout components
├── lib/                  # Business logic and utilities
│   ├── contexts/         # React contexts
│   ├── services/         # Business services
│   ├── theme/           # Theme system
│   └── utils/           # Utility functions
├── data/                # Static data and schemas
├── docs/                # Documentation
├── manual/              # Technical manual
└── __tests__/           # Test suites
```

## Development Workflow

### 1. Understanding the Architecture

This portfolio is organized around five specialized domains:
- **Full-Stack Development** (`/full-stack`)
- **Cloud Engineering** (`/cloud-engineering`)
- **Data Analytics** (`/data-analytics`)
- **UX/UI Design** (`/ux-ui-design`)
- **Technical Consulting** (`/technical-consulting`)

### 2. Component Development

#### Naming Conventions
- **Interactive*** - Components with user interaction
- **Animated*** - Components with motion effects
- **Domain*** - Domain-specific functionality
- **Multi*** - Multi-step or multi-state components

#### Example Component Structure
```typescript
// components/ui/ExampleComponent.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ExampleComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  variant = 'primary'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`component-base ${variant}`}
    >
      {title}
    </motion.div>
  );
};
```

### 3. Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Follow Component Patterns**
   - Use TypeScript interfaces for props
   - Include accessibility attributes
   - Add error boundaries where needed
   - Write tests for new components

3. **Update Documentation**
   - Add component to `manual/components.json`
   - Update relevant documentation files
   - Include usage examples

### 4. Testing Strategy

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Accessibility tests
npm run test:accessibility
```

#### Test Structure
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **Accessibility Tests**: WCAG compliance validation

### 5. Performance Guidelines

#### Core Web Vitals Targets
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

#### Optimization Techniques
- Use `next/image` for all images
- Lazy load heavy components
- Code split by domain and feature
- Monitor bundle sizes

## Key Technologies

### Core Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

### 3D & Visualization
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Three.js helpers
- **Three.js**: 3D graphics library

### Development Tools
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Common Tasks

### Adding a New Domain Page

1. **Create Page File**
   ```bash
   # Create new domain page
   touch app/new-domain/page.tsx
   ```

2. **Add Domain Components**
   ```bash
   mkdir components/domain-specific/new-domain
   ```

3. **Update Navigation**
   - Add to `data/navigation.tsx`
   - Update domain themes in `lib/config/domainThemes.ts`

### Creating UI Components

1. **Generate Component**
   ```bash
   ./scripts/generate-component.sh ComponentName
   ```

2. **Add to Storybook** (if applicable)
3. **Write Tests**
4. **Update Documentation**

### Working with 3D Components

```typescript
// Example 3D component
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export const Scene3D = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {/* Your 3D content */}
    </Canvas>
  );
};
```

## Error Handling

### Error Boundaries
- Global error boundary: `app/global-error.tsx`
- Route-level boundaries: `app/error.tsx`
- Component boundaries: Custom ErrorBoundary components

### Error Reporting
```typescript
import { reportError } from '@/lib/services/errorReporting';

// Report errors with context
reportError(error, 'javascript-error', 'high', {
  component: 'ComponentName',
  domain: 'full-stack'
});
```

## Admin Dashboard

Access the admin dashboard for monitoring:
- **Main dashboard**: `http://localhost:3000/admin/`
- **Error analytics**: `http://localhost:3000/admin/error-analytics`
- **Performance monitoring**: `http://localhost:3000/admin/performance`

## Accessibility Guidelines

### WCAG 2.1 AA Compliance
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast ratios (4.5:1 minimum)
- Test with screen readers

### Implementation
```typescript
// Accessible button example
<button
  aria-label="Close dialog"
  onClick={handleClose}
  className="focus:ring-2 focus:ring-blue-500"
>
  <CloseIcon aria-hidden="true" />
</button>
```

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Test production build locally
npm start
```

### Static Export
```bash
# Generate static files
npm run docs:build
```

## Troubleshooting

### Common Issues

**Q: TypeScript errors during build?**
A: Run `npm run type-check` to identify type issues. Ensure all imports have proper types.

**Q: 3D components not rendering?**
A: Check browser WebGL support. Ensure proper error boundaries around 3D components.

**Q: Hydration mismatches?**
A: Use `useEffect` for client-only code. Check for server/client rendering differences.

**Q: Performance issues?**
A: Run `npm run test:coverage` and check bundle analyzer. Consider lazy loading heavy components.

### Getting Help

1. **Check Documentation**: Review `/manual/` and `/docs/` directories
2. **Search Issues**: Look for similar problems in project issues
3. **Run Diagnostics**: Use built-in health checks and error reporting
4. **Admin Dashboard**: Check error analytics for patterns

## Resources

### Documentation
- **Manual**: `/manual/README.md` - Comprehensive technical manual
- **Architecture**: `/docs/architecture/` - System design documentation
- **Rules**: `/docs/rules/` - Development guidelines

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

## Next Steps

1. **Explore the Codebase**: Start with `app/page.tsx` and main components
2. **Run Tests**: Familiarize yourself with the testing patterns
3. **Check Admin Dashboard**: Understand monitoring and analytics
4. **Read Domain Documentation**: Explore domain-specific implementations
5. **Contribute**: Follow the development workflow for your first contribution

Welcome to the team! 🚀
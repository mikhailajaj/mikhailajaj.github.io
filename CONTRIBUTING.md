# Contributing to Mikhail Ajaj Portfolio

Thank you for your interest in contributing to this portfolio project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)

## 🤝 Code of Conduct

This project adheres to professional software development standards. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Maintain professional communication
- Follow established coding standards
- Respect intellectual property and confidentiality

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: Latest version
- **TypeScript**: Knowledge of TypeScript is required
- **React**: Familiarity with React 18+ and Next.js 15

### Development Environment

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/mikhailajaj.github.io.git
   cd mikhailajaj.github.io
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Required Tools

- **IDE**: VS Code with recommended extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Recommended VS Code Settings

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\\\"\\'\\`]([^\\\"\\'\\`]*).*?[\\\"\\'\\`]"],
    ["cx\\(([^)]*)\\)", "(?:\\'|\\\"|\\`)([^\\']*)(?:\\'|\\\"|\\`)"]
  ]
}
```

## 📁 Project Structure

### Architecture Overview

This project follows **Separation of Concerns (SoC)** principles:

```
├── app/                    # Next.js App Router
│   ├── (domains)/         # Domain-specific pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/             # UI Components (SoC organized)
│   ├── domain-specific/    # Domain-separated components
│   ├── features/          # Feature-specific components
│   ├── interactive/        # Interactive components
│   ├── ui/                # Base UI components
│   └── 3d/                # 3D visualization components
├── data/                  # Data layer
│   ├── projects/          # Project data by domain
│   ├── schemas/           # TypeScript schemas
│   └── types/             # Type definitions
├── lib/                   # Business logic
│   ├── analytics/         # Analytics services
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── services/          # Business services
└── docs/                  # Documentation
```

### Component Organization

Components are organized by responsibility:

- **`ui/`**: Atomic, reusable UI components
- **`features/`**: Feature-specific components
- **`domain-specific/`**: Domain-separated business logic
- **`interactive/`**: Interactive features and demos
- **`3d/`**: 3D visualizations and graphics

## 📝 Coding Standards

### TypeScript Guidelines

1. **Strict Mode**: Always use TypeScript strict mode
2. **Type Safety**: Prefer explicit types over `any`
3. **Interfaces**: Use interfaces for object shapes
4. **Enums**: Use const assertions or union types instead of enums

```typescript
// ✅ Good
interface ProjectData {
  id: string;
  title: string;
  technologies: readonly string[];
  impact: {
    revenue?: number;
    savings?: number;
  };
}

// ❌ Avoid
const project: any = { ... };
```

### React Component Guidelines

1. **Functional Components**: Use function declarations
2. **Props Interface**: Always define props interface
3. **Default Props**: Use default parameters
4. **Error Boundaries**: Wrap components in error boundaries

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS and Styling

1. **Tailwind CSS**: Use Tailwind for styling
2. **Component Variants**: Use `class-variance-authority` for variants
3. **Custom CSS**: Minimize custom CSS, prefer Tailwind utilities
4. **Responsive Design**: Mobile-first approach

```typescript
// ✅ Good - Using CVA for variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);
```

## 📝 Commit Guidelines

### Commit Message Format

Use conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(components): add interactive ROI calculator
fix(blog): resolve MDX rendering issue in production
docs(api): update API documentation for contact endpoints
perf(3d): optimize Three.js scene rendering performance
```

## 🔄 Pull Request Process

### Before Submitting

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Run Quality Checks**

   ```bash
   npm run lint          # ESLint check
   npm run type-check    # TypeScript check
   npm run build         # Build verification
   npm test              # Run tests
   ```

3. **Update Documentation**
   - Update relevant documentation
   - Add JSDoc comments for new functions
   - Update README if needed

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist

- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Accessibility tested
- [ ] Performance impact considered
```

## 🧪 Testing

### Testing Strategy

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Ensure WCAG compliance
4. **Performance Tests**: Monitor Core Web Vitals

### Writing Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies correct variant classes', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });
});
```

## 📚 Documentation

### Code Documentation

1. **JSDoc Comments**: Document all public functions
2. **Component Props**: Document all props with descriptions
3. **Complex Logic**: Add inline comments for complex algorithms

```typescript
/**
 * Calculates ROI based on investment and returns
 * @param investment - Initial investment amount
 * @param returns - Expected returns amount
 * @param timeframe - Investment timeframe in months
 * @returns ROI percentage and absolute values
 */
export function calculateROI(
  investment: number,
  returns: number,
  timeframe: number,
): ROIResult {
  // Implementation with clear comments
}
```

### README Updates

When adding new features:

1. Update feature list in README
2. Add usage examples
3. Update architecture diagrams if needed
4. Document any new environment variables

## ⚡ Performance Guidelines

### Core Web Vitals

Maintain excellent performance metrics:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Strategies

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Monitor bundle size changes
4. **Lazy Loading**: Implement for non-critical components

```typescript
// ✅ Good - Dynamic import for large components
const Heavy3DComponent = dynamic(() => import('./Heavy3DComponent'), {
  loading: () => <ComponentSkeleton />,
  ssr: false
});
```

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

Ensure all contributions meet accessibility standards:

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Readers**: Proper ARIA labels and semantic HTML
3. **Color Contrast**: Minimum 4.5:1 ratio for normal text
4. **Focus Management**: Visible focus indicators

### Accessibility Checklist

- [ ] Semantic HTML elements used
- [ ] ARIA labels provided where needed
- [ ] Keyboard navigation works
- [ ] Color contrast meets standards
- [ ] Images have alt text
- [ ] Form labels are associated
- [ ] Focus indicators visible

```typescript
// ✅ Good - Accessible button
<button
  aria-label="Calculate ROI for your investment"
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
  onClick={calculateROI}
>
  Calculate ROI
</button>
```

## 🚀 Deployment

### Production Checklist

Before deploying:

- [ ] All tests pass
- [ ] Build completes successfully
- [ ] Performance metrics meet standards
- [ ] Accessibility audit passes
- [ ] Security scan completes
- [ ] Documentation updated

### Environment Variables

Document any new environment variables:

```bash
# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Contact Form
NEXT_PUBLIC_CONTACT_EMAIL=your_email@domain.com
```

## 🆘 Getting Help

### Resources

- **Documentation**: Check `/docs` directory
- **Architecture**: Review `/docs/arch` for system overview
- **Examples**: Look at existing components for patterns

### Contact

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Questions**: Start a GitHub Discussion
- **Security**: Email security@mikhailajaj.com for security issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers the project.

---

Thank you for contributing to this portfolio project! Your contributions help demonstrate best practices in modern web development and showcase the power of clean, maintainable code architecture.

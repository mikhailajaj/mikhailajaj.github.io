# Testing Guide

**Last Updated:** December 19, 2024  
**Version:** 1.0.0

## Overview

This guide provides comprehensive testing strategies, patterns, and procedures for the Mikhail Ajaj Portfolio application. The testing approach emphasizes quality, accessibility, and performance across all components and features.

## Testing Philosophy

### Core Principles
1. **Test-Driven Development**: Write tests before implementation when possible
2. **Accessibility First**: Every component tested for WCAG 2.1 AA compliance
3. **Performance Focused**: Monitor and test performance metrics
4. **User-Centric**: Test from user perspective, not implementation details
5. **Comprehensive Coverage**: Target 70%+ code coverage across all modules

### Testing Pyramid
```
    E2E Tests (10%)
   ├─ User journeys
   ├─ Critical paths
   └─ Cross-browser testing

  Integration Tests (20%)
 ├─ Component interactions
 ├─ API endpoint testing
 ├─ Context providers
 └─ Error boundaries

Unit Tests (70%)
├─ Individual components
├─ Utility functions
├─ Custom hooks
├─ Business logic
└─ Data transformations
```

## Testing Stack

### Core Testing Framework
- **Jest 29.x**: Testing framework and test runner
- **React Testing Library**: Component testing utilities
- **Jest Environment**: jsdom for DOM simulation
- **TypeScript**: Type-safe test development

### Specialized Testing Tools
- **@axe-core/react**: Accessibility testing
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers
- **React Error Boundary**: Error handling testing

### Performance Testing
- **Web Vitals**: Core Web Vitals monitoring
- **Lighthouse CI**: Automated performance audits
- **Bundle Analyzer**: Bundle size monitoring

## Test Organization

### Directory Structure
```
__tests__/
├── accessibility/          # Accessibility-specific tests
│   ├── AccessibilityToolbar.test.tsx
│   ├── performance.test.tsx
│   └── TextToSpeech.test.tsx
├── error-tracking/         # Error system tests
│   └── ErrorTracking.test.ts
├── layouts/               # Layout component tests
│   ├── ConsolidatedLayout.test.tsx
│   ├── LayoutConfig.test.ts
│   └── NextJSLayoutIntegration.test.tsx
└── theme-migration/       # Theme system tests
    └── MenuMigrationBridge.test.tsx
```

### Component Co-location
```
components/
├── ui/
│   ├── button.tsx
│   ├── __tests__/
│   │   └── button.test.tsx
│   └── base/
│       ├── Button.tsx
│       └── __tests__/
│           └── Button.test.tsx
```

## Testing Patterns

### Component Testing Pattern
```typescript
// components/ui/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../button';

expect.extend(toHaveNoViolations);

describe('Button Component', () => {
  // Basic rendering test
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // Accessibility test
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // User interaction test
  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Variant testing
  it('applies correct variant styles', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-input');
  });

  // Keyboard navigation
  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Button onClick={handleClick}>Keyboard Button</Button>);
    
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Hook Testing Pattern
```typescript
// hooks/__tests__/useScrollAnimation.test.ts
import { renderHook, act } from '@testing-library/react';
import { useScrollAnimation } from '../useScrollAnimation';

describe('useScrollAnimation', () => {
  beforeEach(() => {
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0,
    });
  });

  it('returns initial scroll state', () => {
    const { result } = renderHook(() => useScrollAnimation());
    
    expect(result.current.scrollY).toBe(0);
    expect(result.current.isScrolled).toBe(false);
  });

  it('updates scroll state on scroll', () => {
    const { result } = renderHook(() => useScrollAnimation());
    
    act(() => {
      window.scrollY = 100;
      window.dispatchEvent(new Event('scroll'));
    });
    
    expect(result.current.scrollY).toBe(100);
    expect(result.current.isScrolled).toBe(true);
  });
});
```

### Context Testing Pattern
```typescript
// lib/contexts/__tests__/DomainThemeContext.test.tsx
import { render, screen } from '@testing-library/react';
import { DomainThemeProvider, useDomainTheme } from '../DomainThemeContext';

const TestComponent = () => {
  const { currentDomain, theme } = useDomainTheme();
  return (
    <div>
      <span data-testid="domain">{currentDomain}</span>
      <span data-testid="theme">{theme.colors.primary}</span>
    </div>
  );
};

describe('DomainThemeContext', () => {
  it('provides default theme values', () => {
    render(
      <DomainThemeProvider>
        <TestComponent />
      </DomainThemeProvider>
    );
    
    expect(screen.getByTestId('domain')).toHaveTextContent('full-stack');
    expect(screen.getByTestId('theme')).toHaveTextContent('#3B82F6');
  });

  it('updates theme when domain changes', () => {
    render(
      <DomainThemeProvider initialDomain="cloud-engineering">
        <TestComponent />
      </DomainThemeProvider>
    );
    
    expect(screen.getByTestId('domain')).toHaveTextContent('cloud-engineering');
    expect(screen.getByTestId('theme')).toHaveTextContent('#06B6D4');
  });
});
```

## Accessibility Testing

### Automated Accessibility Testing
```typescript
// __tests__/accessibility/AccessibilityToolbar.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { AccessibilityToolbar } from '@/components/ui/AccessibilityToolbar';

expect.extend(toHaveNoViolations);

describe('AccessibilityToolbar', () => {
  it('meets WCAG 2.1 AA standards', async () => {
    const { container } = render(<AccessibilityToolbar />);
    const results = await axe(container, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true },
      },
    });
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<AccessibilityToolbar />);
    
    // Test tab navigation
    await user.tab();
    expect(screen.getByRole('button', { name: /font size/i })).toHaveFocus();
    
    await user.tab();
    expect(screen.getByRole('button', { name: /high contrast/i })).toHaveFocus();
  });

  it('announces changes to screen readers', async () => {
    const user = userEvent.setup();
    render(<AccessibilityToolbar />);
    
    const fontSizeButton = screen.getByRole('button', { name: /increase font size/i });
    await user.click(fontSizeButton);
    
    // Check for aria-live announcements
    expect(screen.getByRole('status')).toHaveTextContent(/font size increased/i);
  });
});
```

### Manual Accessibility Testing Checklist
- [ ] **Keyboard Navigation**: All interactive elements accessible via keyboard
- [ ] **Screen Reader**: Test with NVDA, JAWS, or VoiceOver
- [ ] **Color Contrast**: Minimum 4.5:1 ratio for normal text
- [ ] **Focus Management**: Visible focus indicators and logical tab order
- [ ] **Semantic HTML**: Proper heading hierarchy and landmarks
- [ ] **Alternative Text**: Images have descriptive alt text
- [ ] **Form Labels**: All form inputs properly labeled

## Performance Testing

### Core Web Vitals Testing
```typescript
// __tests__/accessibility/performance.test.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

describe('Performance Metrics', () => {
  it('meets Core Web Vitals thresholds', (done) => {
    const metrics = {};
    
    getCLS((metric) => {
      metrics.cls = metric.value;
      expect(metric.value).toBeLessThan(0.1); // Good CLS
    });
    
    getLCP((metric) => {
      metrics.lcp = metric.value;
      expect(metric.value).toBeLessThan(2500); // Good LCP
    });
    
    getFCP((metric) => {
      metrics.fcp = metric.value;
      expect(metric.value).toBeLessThan(1500); // Good FCP
      done();
    });
  });
});
```

### Bundle Size Testing
```typescript
// scripts/test-bundle-size.js
const { execSync } = require('child_process');
const fs = require('fs');

describe('Bundle Size', () => {
  it('stays within size limits', () => {
    execSync('npm run build');
    
    const buildManifest = JSON.parse(
      fs.readFileSync('.next/build-manifest.json', 'utf8')
    );
    
    const mainBundleSize = buildManifest.pages['/'].reduce((total, file) => {
      if (file.endsWith('.js')) {
        const stats = fs.statSync(`.next/static/${file}`);
        return total + stats.size;
      }
      return total;
    }, 0);
    
    // Core framework should be < 100KB gzipped
    expect(mainBundleSize).toBeLessThan(100 * 1024);
  });
});
```

## Error Handling Testing

### Error Boundary Testing
```typescript
// lib/error/__tests__/ErrorBoundary.test.tsx
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
```

### Error Tracking Testing
```typescript
// __tests__/error-tracking/ErrorTracking.test.ts
import { ErrorTracking } from '@/lib/monitoring/ErrorTracking';

describe('ErrorTracking', () => {
  beforeEach(() => {
    ErrorTracking.clearErrors();
  });

  it('reports JavaScript errors', () => {
    const error = new Error('Test error');
    
    ErrorTracking.reportError(error, 'javascript-error', 'medium', {
      component: 'TestComponent',
    });
    
    const errors = ErrorTracking.getErrors();
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Test error');
    expect(errors[0].type).toBe('javascript-error');
  });

  it('tracks error trends', () => {
    // Report multiple errors
    for (let i = 0; i < 5; i++) {
      ErrorTracking.reportError(
        new Error(`Error ${i}`),
        'javascript-error',
        'low'
      );
    }
    
    const trends = ErrorTracking.getErrorTrends('1h');
    expect(trends.total).toBe(5);
    expect(trends.byType['javascript-error']).toBe(5);
  });
});
```

## Integration Testing

### API Integration Testing
```typescript
// __tests__/api/contact.test.ts
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

describe('/api/contact', () => {
  it('handles valid contact form submission', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with enough content.',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Contact form submitted successfully');
  });

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        subject: '',
        message: 'Short',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('validation');
  });
});
```

## Test Commands

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run accessibility tests only
npm run test:accessibility

# Run specific test file
npm test -- button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="accessibility"

# Update snapshots
npm test -- --updateSnapshot
```

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html

# Coverage thresholds (jest.config.js)
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

## Continuous Integration

### GitHub Actions Testing
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:accessibility
      - run: npm run build
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:changed && npm run lint",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

## Testing Best Practices

### Do's
- ✅ Test user behavior, not implementation details
- ✅ Use semantic queries (getByRole, getByLabelText)
- ✅ Test accessibility in every component test
- ✅ Mock external dependencies appropriately
- ✅ Write descriptive test names
- ✅ Test error states and edge cases
- ✅ Use data-testid sparingly, prefer semantic queries

### Don'ts
- ❌ Test implementation details (state, props)
- ❌ Use shallow rendering
- ❌ Test third-party library functionality
- ❌ Write tests that depend on other tests
- ❌ Mock everything (test real integrations when possible)
- ❌ Ignore accessibility in tests
- ❌ Write tests without clear assertions

## Debugging Tests

### Common Issues
```bash
# Debug failing tests
npm test -- --verbose

# Run single test with debugging
npm test -- --testNamePattern="specific test" --verbose

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Check test coverage for specific file
npm test -- --coverage --collectCoverageFrom="components/ui/button.tsx"
```

### Test Utilities
```typescript
// test-utils.tsx - Custom render with providers
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { DomainThemeProvider } from '@/lib/contexts/DomainThemeContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <DomainThemeProvider>
      {children}
    </DomainThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

## Future Testing Enhancements

### Planned Improvements
- **Visual Regression Testing**: Chromatic or Percy integration
- **E2E Testing**: Playwright or Cypress implementation
- **Performance Monitoring**: Real User Monitoring (RUM)
- **A/B Testing**: Feature flag testing framework
- **Load Testing**: API endpoint stress testing

### Monitoring Integration
- **Error Tracking**: Sentry or similar service integration
- **Performance Monitoring**: Web Vitals tracking in production
- **User Analytics**: Privacy-focused usage analytics
- **Accessibility Monitoring**: Automated a11y audits in CI/CD

---

**Testing is not just about finding bugs—it's about building confidence in your code and ensuring a great user experience for everyone.**
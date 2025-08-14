# Testing Guide

This guide provides comprehensive information about testing strategies, tools, and procedures for the Mikhail Ajaj Portfolio project.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Strategy](#testing-strategy)
- [Test Types](#test-types)
- [Testing Tools](#testing-tools)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [Performance Testing](#performance-testing)
- [Accessibility Testing](#accessibility-testing)
- [Security Testing](#security-testing)
- [Continuous Integration](#continuous-integration)
- [Best Practices](#best-practices)

## 🎯 Testing Philosophy

Our testing approach follows these principles:

1. **Quality First**: Tests ensure code reliability and prevent regressions
2. **Test Pyramid**: Unit tests form the foundation, with fewer integration and E2E tests
3. **Accessibility First**: Every component tested for WCAG 2.1 AA compliance
4. **Performance Focused**: Core Web Vitals and performance metrics monitored
5. **User-Centric**: Tests reflect real user interactions and scenarios

### Testing Goals

- **Reliability**: Ensure all features work as expected
- **Accessibility**: Verify WCAG 2.1 AA compliance
- **Performance**: Maintain excellent Core Web Vitals
- **Security**: Validate input handling and security measures
- **Maintainability**: Tests that are easy to understand and maintain

## 🏗️ Testing Strategy

### Test Pyramid

```
    /\
   /  \     E2E Tests (Few)
  /____\    - Critical user journeys
 /      \   - Cross-browser compatibility
/__________\ Integration Tests (Some)
            - Component interactions
            - API integrations
            - Context providers

            Unit Tests (Many)
            - Individual components
            - Utility functions
            - Business logic
```

### Coverage Targets

| Test Type             | Coverage Target | Focus Areas                           |
| --------------------- | --------------- | ------------------------------------- |
| **Unit Tests**        | 80%+            | Components, utilities, business logic |
| **Integration Tests** | 60%+            | Component interactions, data flow     |
| **E2E Tests**         | Critical paths  | User journeys, form submissions       |
| **Accessibility**     | 100%            | WCAG compliance, keyboard navigation  |
| **Performance**       | All pages       | Core Web Vitals, load times           |

## 🧪 Test Types

### Unit Tests

Test individual components and functions in isolation.

```typescript
// Example: Button component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200');
  });

  it('is accessible', () => {
    render(<Button aria-label="Submit form">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAccessibleName('Submit form');
  });
});
```

### Integration Tests

Test component interactions and data flow.

```typescript
// Example: Contact form integration test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactForm } from '@/components/ContactForm';
import { ContactProvider } from '@/lib/contexts/ContactContext';

describe('Contact Form Integration', () => {
  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();

    render(
      <ContactProvider onSubmit={mockSubmit}>
        <ContactForm />
      </ContactProvider>
    );

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'Test message' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      });
    });
  });
});
```

### End-to-End Tests

Test complete user journeys across the application.

```typescript
// Example: E2E test with Playwright
import { test, expect } from "@playwright/test";

test.describe("Portfolio Navigation", () => {
  test("user can navigate through all domains", async ({ page }) => {
    await page.goto("/");

    // Test navigation to each domain
    const domains = [
      "full-stack",
      "cloud-engineering",
      "data-analytics",
      "ux-ui-design",
      "technical-consulting",
    ];

    for (const domain of domains) {
      await page.click(`[href="/${domain}"]`);
      await expect(page).toHaveURL(`/${domain}`);

      // Verify page loads correctly
      await expect(page.locator("h1")).toBeVisible();
      await expect(
        page.locator('[data-testid="projects-section"]'),
      ).toBeVisible();
    }
  });

  test("contact form submission works", async ({ page }) => {
    await page.goto("/contact");

    // Fill contact form
    await page.fill('[name="name"]', "Test User");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="subject"]', "Test Subject");
    await page.fill('[name="message"]', "This is a test message");

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });
});
```

## 🛠️ Testing Tools

### Core Testing Framework

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "@playwright/test": "^1.40.0",
    "@axe-core/playwright": "^4.8.0"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/e2e/",
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

## 🏃‍♂️ Running Tests

### Available Test Scripts

```bash
# Unit and Integration Tests
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run tests with coverage report
npm run test:ci           # Run tests for CI (no watch)

# End-to-End Tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:headed   # Run E2E tests with browser UI
npm run test:e2e:debug    # Run E2E tests in debug mode

# Specific Test Types
npm run test:unit         # Run only unit tests
npm run test:integration  # Run only integration tests
npm run test:accessibility # Run accessibility tests
npm run test:performance  # Run performance tests

# Test Utilities
npm run test:update       # Update test snapshots
npm run test:clear        # Clear test cache
```

### Running Specific Tests

```bash
# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Button"

# Run tests for specific component
npm test -- components/ui/

# Run tests with verbose output
npm test -- --verbose

# Run tests and generate coverage
npm test -- --coverage
```

### Debugging Tests

```bash
# Debug specific test
npm test -- --testNamePattern="Button" --runInBand --no-cache

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug E2E tests
npm run test:e2e:debug
```

## ✍️ Writing Tests

### Component Testing Patterns

```typescript
// 1. Basic Component Test
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});

// 2. Props Testing
it('accepts and displays props correctly', () => {
  const props = { title: 'Test Title', variant: 'primary' };
  render(<ComponentName {...props} />);

  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveClass('primary');
});

// 3. Event Handling
it('handles user interactions', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();

  render(<ComponentName onClick={handleClick} />);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// 4. Accessibility Testing
it('meets accessibility standards', () => {
  render(<ComponentName />);

  expect(screen.getByRole('button')).toHaveAccessibleName();
  expect(screen.getByRole('button')).not.toHaveAttribute('aria-hidden', 'true');
});
```

### Custom Render Utilities

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Mock Patterns

```typescript
// 1. Mock External Dependencies
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    query: {},
  }),
}));

// 2. Mock API Calls
jest.mock("@/lib/api", () => ({
  fetchProjects: jest.fn(() => Promise.resolve(mockProjects)),
  submitContact: jest.fn(() => Promise.resolve({ success: true })),
}));

// 3. Mock Intersection Observer
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));
```

## 📊 Test Coverage

### Coverage Configuration

```javascript
// jest.config.js coverage settings
module.exports = {
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/*.stories.{ts,tsx}",
    "!**/index.{ts,tsx}",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./components/ui/": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
};
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html

# Coverage summary
npm run test:coverage -- --coverageReporters=text-summary
```

## ⚡ Performance Testing

### Core Web Vitals Testing

```typescript
// performance.test.ts
import { test, expect } from "@playwright/test";

test.describe("Performance Tests", () => {
  test("meets Core Web Vitals thresholds", async ({ page }) => {
    await page.goto("/");

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals = {};

          entries.forEach((entry) => {
            if (entry.entryType === "largest-contentful-paint") {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === "first-input") {
              vitals.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === "layout-shift") {
              vitals.cls = entry.value;
            }
          });

          resolve(vitals);
        }).observe({
          entryTypes: [
            "largest-contentful-paint",
            "first-input",
            "layout-shift",
          ],
        });
      });
    });

    // Assert Core Web Vitals thresholds
    expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
    expect(metrics.fid).toBeLessThan(100); // FID < 100ms
    expect(metrics.cls).toBeLessThan(0.1); // CLS < 0.1
  });
});
```

### Bundle Size Testing

```javascript
// bundle-size.test.js
const { execSync } = require("child_process");
const fs = require("fs");

describe("Bundle Size", () => {
  it("stays within size limits", () => {
    // Build the application
    execSync("npm run build", { stdio: "inherit" });

    // Check bundle sizes
    const buildManifest = JSON.parse(
      fs.readFileSync(".next/build-manifest.json", "utf8"),
    );

    const totalSize = Object.values(buildManifest.pages)
      .flat()
      .reduce((total, file) => {
        const filePath = `.next/static/${file}`;
        if (fs.existsSync(filePath)) {
          return total + fs.statSync(filePath).size;
        }
        return total;
      }, 0);

    // Assert bundle size limits
    expect(totalSize).toBeLessThan(1024 * 1024); // < 1MB
  });
});
```

## ♿ Accessibility Testing

### Automated Accessibility Testing

```typescript
// accessibility.test.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility Tests", () => {
  test("homepage meets WCAG standards", async ({ page }) => {
    await page.goto("/");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("keyboard navigation works", async ({ page }) => {
    await page.goto("/");

    // Test tab navigation
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toBeVisible();

    // Test skip link
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("screen reader compatibility", async ({ page }) => {
    await page.goto("/");

    // Check for proper heading structure
    const headings = await page.locator("h1, h2, h3, h4, h5, h6").all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for alt text on images
    const images = await page.locator("img").all();
    for (const img of images) {
      await expect(img).toHaveAttribute("alt");
    }
  });
});
```

### Manual Accessibility Testing

```bash
# Accessibility testing checklist
accessibility_test() {
  echo "Manual Accessibility Testing Checklist:"
  echo "1. Navigate using only keyboard (Tab, Shift+Tab, Enter, Space)"
  echo "2. Test with screen reader (NVDA, JAWS, VoiceOver)"
  echo "3. Verify color contrast ratios"
  echo "4. Test with high contrast mode"
  echo "5. Verify focus indicators are visible"
  echo "6. Test form labels and error messages"
  echo "7. Verify heading structure (h1-h6)"
  echo "8. Test with zoom up to 200%"
}
```

## 🔒 Security Testing

### Input Validation Testing

```typescript
// security.test.ts
import { render, screen, fireEvent } from '@testing-library/react';
import { ContactForm } from '@/components/ContactForm';

describe('Security Tests', () => {
  it('prevents XSS attacks', () => {
    render(<ContactForm />);

    const maliciousInput = '<script>alert("XSS")</script>';

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: maliciousInput }
    });

    // Verify input is sanitized
    expect(screen.getByDisplayValue(maliciousInput)).not.toBeInTheDocument();
  });

  it('validates email format', () => {
    render(<ContactForm />);

    const invalidEmail = 'invalid-email';

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: invalidEmail }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

## 🔄 Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:ci

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 📝 Best Practices

### Testing Best Practices

1. **Test Behavior, Not Implementation**

   ```typescript
   // ❌ Testing implementation details
   expect(component.state.isLoading).toBe(true);

   // ✅ Testing user-visible behavior
   expect(screen.getByText("Loading...")).toBeInTheDocument();
   ```

2. **Use Descriptive Test Names**

   ```typescript
   // ❌ Vague test name
   it("works correctly", () => {});

   // ✅ Descriptive test name
   it("displays error message when email is invalid", () => {});
   ```

3. **Arrange, Act, Assert Pattern**

   ```typescript
   it('submits form with valid data', () => {
     // Arrange
     const mockSubmit = jest.fn();
     render(<ContactForm onSubmit={mockSubmit} />);

     // Act
     fireEvent.change(screen.getByLabelText(/email/i), {
       target: { value: 'test@example.com' }
     });
     fireEvent.click(screen.getByRole('button', { name: /submit/i }));

     // Assert
     expect(mockSubmit).toHaveBeenCalledWith({
       email: 'test@example.com'
     });
   });
   ```

4. **Test Edge Cases**
   ```typescript
   describe('Button Component', () => {
     it('handles empty children gracefully', () => {
       render(<Button>{null}</Button>);
       expect(screen.getByRole('button')).toBeInTheDocument();
     });

     it('handles very long text', () => {
       const longText = 'a'.repeat(1000);
       render(<Button>{longText}</Button>);
       expect(screen.getByRole('button')).toHaveTextContent(longText);
     });
   });
   ```

### Performance Testing Best Practices

1. **Test on Different Devices**
2. **Monitor Bundle Size Changes**
3. **Test Network Conditions**
4. **Measure Real User Metrics**

### Accessibility Testing Best Practices

1. **Test with Real Assistive Technology**
2. **Include Users with Disabilities in Testing**
3. **Test Keyboard Navigation Thoroughly**
4. **Verify Color Contrast Ratios**

---

## 📞 Support

### Getting Help with Testing

- **Documentation**: Review this guide and related docs
- **Issues**: Create GitHub issue with `testing` label
- **Discussions**: Use GitHub Discussions for testing questions
- **Examples**: Check existing test files for patterns

### Resources

- **Testing Library Docs**: https://testing-library.com/
- **Jest Documentation**: https://jestjs.io/docs/
- **Playwright Docs**: https://playwright.dev/
- **Accessibility Testing**: https://web.dev/accessibility/

---

_This testing guide ensures comprehensive test coverage while maintaining code quality, accessibility, and performance standards throughout the development lifecycle._

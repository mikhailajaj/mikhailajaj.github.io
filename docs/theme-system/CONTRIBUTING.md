# Contributing to the Unified Theme System

Thank you for your interest in contributing to the Unified Theme System! This guide will help you get started with development, testing, and contributing improvements.

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TypeScript knowledge
- React experience

### Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Run tests**
```bash
npm run test
# or
yarn test
```

### Project Structure

```
lib/theme/
├── core/                 # Core theme engine
│   ├── ThemeEngine.ts   # Main theme engine
│   ├── events.ts        # Event system
│   ├── cssVariables.ts  # CSS variable management
│   ├── types.ts         # Type definitions
│   └── index.ts         # Core exports
├── state/               # State management
│   ├── ThemeStateManager.ts
│   ├── validation.ts
│   ├── persistence.ts
│   └── index.ts
├── computation/         # Theme computation
│   ├── ThemeComputer.ts
│   ├── merging.ts
│   └── index.ts
├── integration/         # Legacy system integration
│   ├── NextThemesAdapter.ts
│   ├── DomainThemeAdapter.ts
│   ├── ComponentIntegration.ts
│   └── index.ts
└── index.ts            # Main exports

docs/theme-system/       # Documentation
├── README.md
├── api-reference.md
├── migration-guide.md
├── performance-guide.md
├── troubleshooting.md
├── examples.md
└── CONTRIBUTING.md
```

## Development Guidelines

### Code Style

We follow strict TypeScript and React best practices:

#### TypeScript Guidelines

```typescript
// ✅ Good: Explicit types and interfaces
interface ThemeConfig {
  mode?: ThemeMode;
  domain?: Domain;
  preferences?: Partial<UserThemePreferences>;
}

// ✅ Good: Proper error handling
async function updateTheme(config: ThemeConfig): Promise<void> {
  try {
    await themeEngine.setTheme(config);
  } catch (error) {
    console.error('Theme update failed:', error);
    throw error;
  }
}

// ❌ Bad: Any types
function updateTheme(config: any): any {
  return themeEngine.setTheme(config);
}
```

#### React Guidelines

```typescript
// ✅ Good: Proper hooks usage with cleanup
function useThemeSubscription() {
  const [theme, setTheme] = useState<ComputedTheme | null>(null);

  useEffect(() => {
    const unsubscribe = themeEngine.subscribe((event) => {
      if (event.type === 'theme-changed') {
        setTheme(event.payload.current.computed);
      }
    });

    return unsubscribe; // Cleanup
  }, []);

  return theme;
}

// ❌ Bad: Missing cleanup
function useThemeSubscription() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    themeEngine.subscribe((event) => {
      setTheme(event.payload.current.computed);
    });
    // Missing cleanup!
  }, []);

  return theme;
}
```

#### Performance Guidelines

```typescript
// ✅ Good: Memoized expensive operations
const useOptimizedTheme = () => {
  const { theme } = useUnifiedTheme();
  
  return useMemo(() => {
    if (!theme) return null;
    
    return {
      colors: theme.colors,
      spacing: theme.spacing,
      // Only include what's needed
    };
  }, [theme?.colors, theme?.spacing]);
};

// ❌ Bad: No memoization
const useOptimizedTheme = () => {
  const { theme } = useUnifiedTheme();
  
  return {
    colors: theme?.colors,
    spacing: theme?.spacing,
    // Recreated on every render
  };
};
```

### Architecture Principles

#### 1. Single Responsibility
Each module should have a single, well-defined responsibility:

```typescript
// ✅ Good: Focused responsibility
class ThemeValidator {
  validateThemeConfig(config: ThemeConfig): ValidationResult {
    // Only validation logic
  }
}

// ❌ Bad: Mixed responsibilities
class ThemeManager {
  validateThemeConfig(config: ThemeConfig): ValidationResult { }
  computeTheme(config: ThemeConfig): ComputedTheme { }
  persistTheme(theme: ComputedTheme): void { }
  // Too many responsibilities
}
```

#### 2. Dependency Injection
Use dependency injection for testability:

```typescript
// ✅ Good: Dependency injection
class ThemeStateManager {
  constructor(
    private persistence: ThemeStatePersistence,
    private validator: ThemeValidator
  ) {}
}

// ❌ Bad: Hard dependencies
class ThemeStateManager {
  constructor() {
    this.persistence = new LocalStoragePersistence(); // Hard to test
    this.validator = new ThemeValidator(); // Hard to mock
  }
}
```

#### 3. Event-Driven Architecture
Use events for loose coupling:

```typescript
// ✅ Good: Event-driven updates
class ThemeEngine {
  async setTheme(config: ThemeConfig): Promise<void> {
    const previousTheme = this.currentTheme;
    const newTheme = await this.computeTheme(config);
    
    this.currentTheme = newTheme;
    
    // Emit event for subscribers
    this.emit({
      type: 'theme-changed',
      payload: { previous: previousTheme, current: newTheme }
    });
  }
}

// ❌ Bad: Direct coupling
class ThemeEngine {
  async setTheme(config: ThemeConfig): Promise<void> {
    const newTheme = await this.computeTheme(config);
    this.currentTheme = newTheme;
    
    // Direct calls create tight coupling
    this.updateComponents(newTheme);
    this.updateCSS(newTheme);
    this.persistTheme(newTheme);
  }
}
```

## Testing Guidelines

### Unit Tests

Write comprehensive unit tests for all functionality:

```typescript
// Example: Testing theme computation
describe('ThemeComputer', () => {
  let computer: ThemeComputer;

  beforeEach(() => {
    computer = new ThemeComputer({
      enableMemoization: false // Disable for predictable tests
    });
  });

  it('should compute theme correctly', () => {
    const context = {
      domain: 'cloud',
      mode: 'dark',
      preferences: defaultPreferences,
      customizations: {},
      timestamp: Date.now()
    };

    const theme = computer.computeTheme(context);

    expect(theme.mode).toBe('dark');
    expect(theme.domain).toBe('cloud');
    expect(theme.colors.domainPrimary).toBe('#06B6D4');
  });

  it('should use memoization when enabled', () => {
    const memoizedComputer = new ThemeComputer({
      enableMemoization: true
    });

    const context = { /* ... */ };
    
    // First computation
    const theme1 = memoizedComputer.computeTheme(context);
    
    // Second computation should use cache
    const theme2 = memoizedComputer.computeTheme(context);
    
    expect(theme1).toBe(theme2); // Same reference = cached
  });
});
```

### Integration Tests

Test component integration with theme system:

```typescript
describe('Theme Integration', () => {
  it('should update components when theme changes', async () => {
    function TestComponent() {
      const { theme } = useUnifiedTheme();
      return <div data-testid="theme-mode">{theme?.mode}</div>;
    }

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Change theme
    await act(async () => {
      await themeEngine.setMode('dark');
    });

    expect(getByTestId('theme-mode')).toHaveTextContent('dark');
  });
});
```

### Performance Tests

Include performance tests for critical paths:

```typescript
describe('Theme Performance', () => {
  it('should complete theme computation within time limit', () => {
    const startTime = performance.now();
    
    const theme = themeComputer.computeTheme({
      domain: 'cloud',
      mode: 'dark',
      preferences: defaultPreferences,
      customizations: {},
      timestamp: Date.now()
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(50); // 50ms limit
    expect(theme).toBeDefined();
  });
});
```

## Contributing Process

### 1. Issue Creation

Before starting work, create or find an issue:

- **Bug Reports**: Include reproduction steps, expected vs actual behavior
- **Feature Requests**: Describe the use case and proposed solution
- **Performance Issues**: Include performance metrics and profiling data

### 2. Development Workflow

1. **Create a branch**
```bash
git checkout -b feature/theme-enhancement
# or
git checkout -b fix/theme-bug
```

2. **Make changes**
- Follow code style guidelines
- Add tests for new functionality
- Update documentation if needed

3. **Test your changes**
```bash
npm run test
npm run test:integration
npm run test:performance
```

4. **Commit changes**
```bash
git add .
git commit -m "feat: add theme preloading functionality"
# or
git commit -m "fix: resolve theme persistence issue"
```

### 3. Pull Request Guidelines

#### PR Title Format
- `feat: description` - New features
- `fix: description` - Bug fixes
- `perf: description` - Performance improvements
- `docs: description` - Documentation updates
- `test: description` - Test additions/updates
- `refactor: description` - Code refactoring

#### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Performance improvement
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Performance tests added/updated
- [ ] Manual testing completed

## Performance Impact
- [ ] No performance impact
- [ ] Performance improvement
- [ ] Potential performance regression (explain)

## Breaking Changes
- [ ] No breaking changes
- [ ] Breaking changes (list them)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests pass
- [ ] Documentation updated
```

### 4. Code Review Process

All PRs require review:

1. **Automated Checks**
   - Tests must pass
   - Code coverage maintained
   - Performance benchmarks met

2. **Manual Review**
   - Code quality and style
   - Architecture alignment
   - Test coverage adequacy
   - Documentation completeness

3. **Performance Review**
   - Performance impact assessment
   - Memory usage analysis
   - Bundle size impact

## Feature Development

### Adding New Theme Features

1. **Design Phase**
   - Create RFC (Request for Comments) for significant features
   - Discuss architecture and API design
   - Consider backward compatibility

2. **Implementation Phase**
   - Start with types and interfaces
   - Implement core functionality
   - Add integration points
   - Write comprehensive tests

3. **Documentation Phase**
   - Update API documentation
   - Add usage examples
   - Update migration guide if needed

### Example: Adding New Theme Property

```typescript
// 1. Update types
interface ThemeColors {
  // ... existing properties
  highlight: string; // New property
}

// 2. Update computation
class ThemeComputer {
  private computeColors(domainTheme: any, mode: 'light' | 'dark'): ThemeColors {
    return {
      // ... existing colors
      highlight: this.computeHighlightColor(domainTheme, mode), // New computation
    };
  }

  private computeHighlightColor(domainTheme: any, mode: 'light' | 'dark'): string {
    // Implementation
  }
}

// 3. Update CSS variables
private addColorVariables(variables: Record<string, string>, colors: ThemeColors): void {
  // ... existing variables
  variables['--color-highlight'] = colors.highlight; // New variable
}

// 4. Add tests
describe('Highlight Color', () => {
  it('should compute highlight color correctly', () => {
    const colors = themeComputer.computeColors(domainTheme, 'dark');
    expect(colors.highlight).toBeDefined();
    expect(colors.highlight).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

// 5. Update documentation
// Add to API reference and examples
```

## Performance Considerations

### Optimization Guidelines

1. **Memoization**
   - Use memoization for expensive computations
   - Clear caches when memory usage is high
   - Monitor cache hit rates

2. **Event Batching**
   - Batch multiple theme updates
   - Debounce rapid changes
   - Use requestAnimationFrame for DOM updates

3. **Bundle Size**
   - Keep core bundle small
   - Use dynamic imports for optional features
   - Tree-shake unused code

### Performance Testing

```typescript
// Performance benchmark template
describe('Performance Benchmarks', () => {
  it('should meet performance targets', () => {
    const iterations = 1000;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      // Operation to benchmark
      themeComputer.computeTheme(testContext);
    }
    
    const endTime = performance.now();
    const averageTime = (endTime - startTime) / iterations;
    
    expect(averageTime).toBeLessThan(1); // 1ms per operation
  });
});
```

## Documentation Standards

### Code Documentation

Use JSDoc for all public APIs:

```typescript
/**
 * Computes theme for given domain and mode combination
 * 
 * @param domain - The target domain
 * @param mode - The theme mode (light/dark/system)
 * @param preferences - User preferences
 * @param customizations - Theme customizations
 * @returns Computed theme object
 * 
 * @example
 * ```typescript
 * const theme = themeComputer.computeTheme('cloud', 'dark', preferences, {});
 * console.log(theme.colors.primary); // '#06B6D4'
 * ```
 */
computeTheme(
  domain: Domain,
  mode: ThemeMode,
  preferences: UserThemePreferences,
  customizations: ThemeCustomizations
): ComputedTheme {
  // Implementation
}
```

### README Updates

When adding features, update relevant documentation:

- API reference for new methods/properties
- Examples for new usage patterns
- Migration guide for breaking changes
- Troubleshooting for common issues

## Release Process

### Version Management

We follow semantic versioning:

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### Release Checklist

- [ ] All tests pass
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Migration guide updated (if needed)
- [ ] Changelog updated
- [ ] Version bumped appropriately

## Getting Help

### Development Support

- **Questions**: Create a discussion issue
- **Bugs**: Create a bug report with reproduction steps
- **Features**: Create a feature request with use case

### Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Testing Library](https://testing-library.com/)
- [Performance Best Practices](./performance-guide.md)

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes for significant contributions
- Documentation credits

Thank you for contributing to the Unified Theme System! 🎨
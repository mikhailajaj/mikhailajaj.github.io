# Unified Theme System Documentation

A comprehensive, performant, and developer-friendly theme management solution for Next.js applications with domain-aware theming.

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Migration Guide](#migration-guide)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Installation

The unified theme system is already integrated into your project. No additional installation required.

### Basic Usage

```tsx
import { useUnifiedTheme } from '@/lib/theme';

function MyComponent() {
  const { theme, setMode, setDomain } = useUnifiedTheme();

  return (
    <div className={`theme-${theme.mode} domain-${theme.domain}`}>
      <button onClick={() => setMode('dark')}>
        Switch to Dark Mode
      </button>
      <button onClick={() => setDomain('cloud')}>
        Switch to Cloud Domain
      </button>
    </div>
  );
}
```

### Provider Setup

```tsx
import { ThemeSystemUtils } from '@/lib/theme';

const ThemeProvider = ThemeSystemUtils.createProvider();

function App({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

## 🏗️ Architecture Overview

The unified theme system consists of four main layers:

### 1. Core Engine (`lib/theme/core/`)
- **ThemeEngine**: Central theme management with event-driven updates
- **Event System**: Performance-optimized event handling
- **CSS Variables**: Efficient CSS custom property management
- **Type System**: Comprehensive TypeScript definitions

### 2. State Management (`lib/theme/state/`)
- **ThemeStateManager**: Robust state management with persistence
- **Validation**: Theme data validation and error handling
- **Persistence**: localStorage integration with SSR compatibility

### 3. Computation (`lib/theme/computation/`)
- **ThemeComputer**: Efficient theme computation with memoization
- **Merging**: Theme inheritance and conflict resolution
- **Optimization**: Performance optimizations and caching

### 4. Integration (`lib/theme/integration/`)
- **NextThemesAdapter**: Migration from next-themes
- **DomainThemeAdapter**: Integration with existing domain themes
- **ComponentIntegration**: Component migration utilities

## 💡 Core Concepts

### Theme Modes
- `light`: Light theme mode
- `dark`: Dark theme mode  
- `system`: Follows system preference

### Domains
- `full-stack`: Full-stack development theme
- `cloud`: Cloud engineering theme
- `data`: Data analytics theme
- `ux-ui`: UX/UI design theme
- `consulting`: Technical consulting theme

### Theme Computation
Themes are computed by merging:
1. Base theme (mode-specific colors, typography, etc.)
2. Domain theme (domain-specific colors and styling)
3. User preferences (accessibility, font size, etc.)
4. Custom overrides (user customizations)

### Event-Driven Updates
All theme changes are handled through an event system:
- `theme-changed`: Complete theme update
- `mode-changed`: Theme mode change
- `domain-changed`: Domain change
- `preferences-changed`: User preferences update

## 📖 API Reference

### Core Hooks

#### `useUnifiedTheme()`
Main hook for theme access and control.

```tsx
const {
  theme,        // Current computed theme
  isLoading,    // Loading state
  error,        // Error state
  setTheme,     // Set complete theme config
  setMode,      // Set theme mode
  setDomain,    // Set domain
  toggleMode,   // Toggle between light/dark
} = useUnifiedTheme();
```

#### `useMigrationStatus()`
Monitor migration status from legacy systems.

```tsx
const {
  nextThemes,     // Next-themes migration status
  domainTheme,    // Domain theme migration status
  components,     // Component migration statistics
} = useMigrationStatus();
```

### Theme Engine API

#### `themeEngine.setTheme(config)`
Update theme configuration.

```tsx
await themeEngine.setTheme({
  mode: 'dark',
  domain: 'cloud',
  preferences: {
    reducedMotion: true,
    fontSize: 'large'
  },
  customizations: {
    colors: {
      primary: '#custom-color'
    }
  }
});
```

#### `themeEngine.subscribe(callback)`
Subscribe to theme changes.

```tsx
const unsubscribe = themeEngine.subscribe((event) => {
  console.log('Theme changed:', event);
});

// Cleanup
unsubscribe();
```

### Component Integration

#### `createThemeAwareComponent(Component)`
Make components theme-aware.

```tsx
import { componentIntegrationManager } from '@/lib/theme/integration';

const ThemeAwareButton = componentIntegrationManager
  .createThemeAwareComponent(Button, 'Button');
```

#### `createLegacyCompatibilityWrapper(Component)`
Add backward compatibility.

```tsx
const CompatibleComponent = componentIntegrationManager
  .createLegacyCompatibilityWrapper(MyComponent, 'MyComponent');
```

## 🔄 Migration Guide

### From next-themes

The system automatically migrates from next-themes:

```tsx
// Before (next-themes)
import { useTheme } from 'next-themes';

function Component() {
  const { theme, setTheme } = useTheme();
  // ...
}

// After (unified system)
import { useUnifiedTheme } from '@/lib/theme';

function Component() {
  const { theme, setMode } = useUnifiedTheme();
  // ...
}
```

### From DomainThemeContext

Domain theme context is preserved with enhanced features:

```tsx
// Before
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';

// After (enhanced)
import { domainThemeAdapter } from '@/lib/theme/integration';

const useDomainTheme = domainThemeAdapter.createEnhancedDomainTheme();
```

### Component Migration

```tsx
// Before
const MyComponent = ({ isDark, currentDomain, ...props }) => {
  const themeClass = isDark ? 'dark' : 'light';
  const domainClass = `domain-${currentDomain}`;
  
  return <div className={`${themeClass} ${domainClass}`} {...props} />;
};

// After
const MyComponent = ({ theme, className, ...props }) => {
  return <div className={className} {...props} />;
};

export default createThemeAwareComponent(MyComponent, 'MyComponent');
```

## ⚡ Performance

### Optimization Features

1. **Memoization**: Theme computation results are cached
2. **Batching**: CSS variable updates are batched for performance
3. **Selective Updates**: Only changed properties trigger re-renders
4. **Event Debouncing**: Theme events are debounced to prevent spam

### Performance Monitoring

```tsx
// Get performance metrics
const metrics = themeEngine.performance;
console.log('Render count:', metrics.renderCount);
console.log('Average update time:', metrics.averageUpdateDuration);

// Get computation metrics
const computationMetrics = themeComputer.getMetrics();
console.log('Cache hit rate:', computationMetrics.cacheHitRate);
```

### Best Practices

1. **Use theme-aware components** instead of manual theme checks
2. **Batch theme updates** when changing multiple properties
3. **Preload themes** for domains you expect users to visit
4. **Clear caches** periodically in long-running applications

```tsx
// Batch updates
await themeEngine.setTheme({
  mode: 'dark',
  domain: 'cloud',
  preferences: { fontSize: 'large' }
});

// Preload themes
await themeEngine.preloadThemes(['cloud', 'data']);

// Clear caches
themeEngine.clearCache();
```

## 🔧 Troubleshooting

### Common Issues

#### Theme not updating
```tsx
// Check if theme engine is initialized
if (themeEngine.isLoading) {
  console.log('Theme engine still loading...');
}

// Check for errors
if (themeEngine.error) {
  console.error('Theme error:', themeEngine.error);
}
```

#### Migration issues
```tsx
// Check migration status
const migrationStatus = ThemeIntegrationUtils.getMigrationStatus();
console.log('Migration status:', migrationStatus);

// Force migration
await ThemeIntegrationUtils.performCompleteMigration();
```

#### Performance issues
```tsx
// Check performance metrics
const health = ThemeSystemUtils.getHealthStatus();
console.log('System health:', health);

// Clear caches if needed
if (health.engine.performance.renderCount > 1000) {
  themeEngine.clearCache();
}
```

### Debug Mode

Enable debug mode for detailed logging:

```tsx
// Enable debug mode
const devTools = ThemeSystemUtils.createDevTools();
devTools.debugging.enableDebugMode();

// Inspect current state
console.log('Current theme:', devTools.inspector.getCurrentTheme());
console.log('Performance:', devTools.inspector.getPerformanceMetrics());
```

### Error Recovery

The system includes automatic error recovery:

```tsx
// Reset to defaults if corrupted
await devTools.debugging.resetToDefaults();

// Clear all caches
devTools.debugging.clearAllCaches();
```

## 📋 Configuration

### Theme Engine Configuration

```tsx
import { ThemeEngine } from '@/lib/theme/core';

const engine = new ThemeEngine({
  initialMode: 'system',
  initialDomain: 'full-stack',
  enablePersistence: true,
  enablePerformanceMonitoring: true,
  enableDebugMode: process.env.NODE_ENV === 'development'
});
```

### Integration Configuration

```tsx
import { NextThemesAdapter, DomainThemeAdapter } from '@/lib/theme/integration';

// Next-themes adapter
const nextAdapter = new NextThemesAdapter({
  enableBackwardCompatibility: true,
  enableAutomaticMigration: true
});

// Domain theme adapter  
const domainAdapter = new DomainThemeAdapter({
  enableEnhancedFeatures: true,
  enablePerformanceOptimizations: true
});
```

## 🤝 Contributing

See the [Contributing Guide](./CONTRIBUTING.md) for development setup and guidelines.

## 📄 License

This theme system is part of the portfolio project and follows the same license terms.
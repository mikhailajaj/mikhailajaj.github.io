# Performance Guide

Comprehensive guide to optimizing performance with the Unified Theme System.

## Performance Overview

The Unified Theme System is designed with performance as a core principle:

- **Memoization**: Theme computations are cached to avoid redundant calculations
- **Batching**: CSS variable updates are batched for optimal DOM performance
- **Event Debouncing**: Theme events are debounced to prevent excessive re-renders
- **Selective Updates**: Only changed theme properties trigger component updates
- **Preloading**: Themes can be preloaded for instant switching

## Performance Metrics

### Monitoring Performance

```typescript
import { themeEngine, themeComputer } from '@/lib/theme';

// Get engine performance metrics
const engineMetrics = themeEngine.performance;
console.log('Engine Performance:', {
  renderCount: engineMetrics.renderCount,
  averageUpdateDuration: engineMetrics.averageUpdateDuration,
  lastUpdate: engineMetrics.lastUpdate,
  computationTime: engineMetrics.computationTime,
  cssApplicationTime: engineMetrics.cssApplicationTime
});

// Get computation metrics
const computationMetrics = themeComputer.getMetrics();
console.log('Computation Performance:', {
  totalComputations: computationMetrics.totalComputations,
  cacheHits: computationMetrics.cacheHits,
  cacheMisses: computationMetrics.cacheMisses,
  cacheHitRate: computationMetrics.cacheHitRate,
  averageComputationTime: computationMetrics.averageComputationTime
});
```

### Performance Thresholds

```typescript
import { THEME_CONSTANTS } from '@/lib/theme/core';

// Performance thresholds
const thresholds = {
  maxComputationTime: THEME_CONSTANTS.MAX_COMPUTATION_TIME, // 100ms
  maxApplicationTime: THEME_CONSTANTS.MAX_APPLICATION_TIME,  // 50ms
  maxRenderCount: THEME_CONSTANTS.MAX_RENDER_COUNT,         // 1000
  cacheSize: THEME_CONSTANTS.MAX_CACHE_SIZE,               // 100
  cacheTTL: THEME_CONSTANTS.CACHE_TTL                      // 30 seconds
};

// Check if performance is within acceptable limits
function checkPerformance() {
  const metrics = themeEngine.performance;
  
  const issues = [];
  if (metrics.computationTime > thresholds.maxComputationTime) {
    issues.push('Computation time too high');
  }
  if (metrics.cssApplicationTime > thresholds.maxApplicationTime) {
    issues.push('CSS application time too high');
  }
  if (metrics.renderCount > thresholds.maxRenderCount) {
    issues.push('Render count too high');
  }
  
  return {
    isHealthy: issues.length === 0,
    issues,
    score: Math.max(0, 100 - (issues.length * 20))
  };
}
```

## Optimization Strategies

### 1. Theme Computation Optimization

#### Memoization
Theme computations are automatically memoized, but you can optimize further:

```typescript
// Precompute themes for expected domains
await themeEngine.preloadThemes(['cloud', 'data', 'ux-ui']);

// Use consistent theme configurations to maximize cache hits
const consistentConfig = {
  preferences: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    customizations: {},
    autoDetectPreferences: true
  }
};

await themeEngine.setTheme({
  mode: 'dark',
  domain: 'cloud',
  preferences: consistentConfig.preferences
});
```

#### Cache Management
```typescript
// Monitor cache performance
const cacheMetrics = themeComputer.getMetrics();
if (cacheMetrics.cacheHitRate < 0.8) {
  console.warn('Low cache hit rate, consider optimizing theme usage');
}

// Clear cache when memory usage is high
if (cacheMetrics.cacheSize > 50) {
  themeComputer.clearCache();
}

// Optimize cache size for your use case
const optimizedComputer = new ThemeComputer({
  maxCacheSize: 50,        // Reduce for memory-constrained environments
  memoizationTTL: 60000,   // Increase for stable themes
  enableMemoization: true
});
```

### 2. CSS Variable Optimization

#### Batched Updates
CSS variables are automatically batched, but you can optimize:

```typescript
import { cssVariableManager } from '@/lib/theme/core';

// Batch multiple variable updates
const variables = {
  '--color-primary': '#3B82F6',
  '--color-secondary': '#06B6D4',
  '--color-accent': '#1E40AF'
};

// This will be batched automatically
cssVariableManager.applyVariables(variables);

// Monitor CSS variable performance
const cssMetrics = cssVariableManager.getMetrics();
console.log('CSS Performance:', {
  totalVariables: cssMetrics.totalVariables,
  pendingUpdates: cssMetrics.pendingUpdates,
  isApplying: cssMetrics.isApplying
});
```

#### Selective Variable Updates
```typescript
// Only update changed variables
const currentTheme = themeEngine.currentTheme;
const newTheme = themeComputer.computeTheme(context);

// Generate only changed variables
const currentVars = themeComputer.generateCSSVariables(currentTheme);
const newVars = themeComputer.generateCSSVariables(newTheme);

const changedVars = {};
Object.entries(newVars).forEach(([key, value]) => {
  if (currentVars[key] !== value) {
    changedVars[key] = value;
  }
});

// Apply only changed variables
if (Object.keys(changedVars).length > 0) {
  cssVariableManager.applyVariables(changedVars);
}
```

### 3. Component Performance

#### Theme-Aware Components
```typescript
import { componentIntegrationManager } from '@/lib/theme/integration';

// Create optimized theme-aware component
const OptimizedComponent = componentIntegrationManager
  .createThemeAwareComponent(BaseComponent, 'OptimizedComponent');

// Enable performance optimizations during migration
const MigratedComponent = componentIntegrationManager
  .migrateComponent(LegacyComponent, 'MigratedComponent', {
    enablePerformanceOptimizations: true,
    preserveLegacyProps: false // Disable for better performance
  });
```

#### Selective Theme Subscriptions
```typescript
// Subscribe only to specific theme changes
const useOptimizedTheme = () => {
  const [colors, setColors] = useState(null);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const unsubscribe = themeEngine.subscribe((event) => {
      // Only update if colors or mode changed
      if (event.type === 'theme-changed') {
        const current = event.payload.current;
        if (current.computed?.colors) {
          setColors(current.computed.colors);
        }
        if (current.computed?.mode) {
          setMode(current.computed.mode);
        }
      }
    });

    return unsubscribe;
  }, []);

  return { colors, mode };
};
```

#### Memoized Theme Hooks
```typescript
import { useMemo } from 'react';

const useOptimizedThemeStyles = (baseStyles = {}) => {
  const { theme } = useUnifiedTheme();
  
  return useMemo(() => {
    if (!theme) return baseStyles;
    
    return {
      ...baseStyles,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.backgroundPrimary,
      borderColor: theme.colors.borderPrimary
    };
  }, [theme?.colors, baseStyles]);
};
```

### 4. Event System Optimization

#### Event Debouncing
```typescript
import { themeEventEmitter } from '@/lib/theme/core';

// Events are automatically debounced, but you can configure:
const optimizedEmitter = new ThemeEventEmitter(false); // Disable debug mode

// Batch multiple events
const events = [
  { type: 'mode-changed', payload: { current: { mode: 'dark' } } },
  { type: 'domain-changed', payload: { current: { domain: 'cloud' } } }
];

optimizedEmitter.emitBatch(events);
```

#### Selective Event Listening
```typescript
// Listen only to specific events
const unsubscribeMode = themeEventEmitter.on('mode-changed', (event) => {
  console.log('Mode changed:', event.payload.current.mode);
});

const unsubscribeDomain = themeEventEmitter.on('domain-changed', (event) => {
  console.log('Domain changed:', event.payload.current.domain);
});

// Cleanup
unsubscribeMode();
unsubscribeDomain();
```

## Performance Best Practices

### 1. Theme Configuration

#### Consistent Configurations
```typescript
// Use consistent theme configurations to maximize cache hits
const standardPreferences = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  customizations: {},
  autoDetectPreferences: true
};

// Reuse configurations
await themeEngine.setTheme({
  mode: 'dark',
  domain: 'cloud',
  preferences: standardPreferences
});
```

#### Avoid Frequent Changes
```typescript
// Bad: Frequent theme changes
setInterval(() => {
  themeEngine.toggleMode();
}, 100);

// Good: Batch changes or use user-initiated changes
const handleThemeChange = async (mode, domain) => {
  await themeEngine.setTheme({ mode, domain });
};
```

### 2. Component Optimization

#### Minimize Theme Dependencies
```typescript
// Bad: Component depends on entire theme
const HeavyComponent = () => {
  const { theme } = useUnifiedTheme();
  return <div style={{ color: theme.colors.primary }}>Content</div>;
};

// Good: Component depends only on needed values
const OptimizedComponent = () => {
  const { theme } = useUnifiedTheme();
  const primaryColor = theme?.colors.primary;
  
  return <div style={{ color: primaryColor }}>Content</div>;
};

// Better: Use CSS variables
const CSSOptimizedComponent = () => {
  return (
    <div style={{ color: 'var(--color-primary)' }}>
      Content
    </div>
  );
};
```

#### Memoize Expensive Operations
```typescript
const ExpensiveThemeComponent = () => {
  const { theme } = useUnifiedTheme();
  
  const expensiveStyles = useMemo(() => {
    if (!theme) return {};
    
    // Expensive style computation
    return {
      background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
      boxShadow: `0 4px 8px ${theme.colors.primary}20`,
      border: `1px solid ${theme.colors.borderPrimary}`
    };
  }, [theme?.colors]);
  
  return <div style={expensiveStyles}>Content</div>;
};
```

### 3. Memory Management

#### Cache Cleanup
```typescript
// Set up periodic cache cleanup
useEffect(() => {
  const cleanup = setInterval(() => {
    const metrics = themeComputer.getMetrics();
    
    // Clear cache if it's getting large
    if (metrics.cacheSize > 75) {
      themeComputer.clearCache();
    }
    
    // Clear engine cache if render count is high
    const engineMetrics = themeEngine.performance;
    if (engineMetrics.renderCount > 800) {
      themeEngine.clearCache();
    }
  }, 60000); // Every minute

  return () => clearInterval(cleanup);
}, []);
```

#### Memory Leak Prevention
```typescript
// Always cleanup subscriptions
useEffect(() => {
  const unsubscribe = themeEngine.subscribe((event) => {
    // Handle theme changes
  });

  // Cleanup on unmount
  return unsubscribe;
}, []);

// Cleanup component integration
useEffect(() => {
  return () => {
    // Cleanup when component unmounts
    componentIntegrationManager.destroy?.();
  };
}, []);
```

### 4. SSR/Hydration Optimization

#### Prevent Hydration Mismatches
```typescript
const SSROptimizedComponent = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useUnifiedTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="theme-loading">Loading theme...</div>;
  }

  return (
    <div className={`theme-${theme?.mode} domain-${theme?.domain}`}>
      Content
    </div>
  );
};
```

#### Optimize Initial Load
```typescript
// Preload critical themes during app initialization
const initializeApp = async () => {
  // Initialize theme system
  const result = await ThemeSystemUtils.initialize();
  
  if (result.success) {
    // Preload commonly used themes
    await themeEngine.preloadThemes(['full-stack', 'cloud']);
  }
  
  return result;
};
```

## Performance Monitoring

### Real-time Monitoring
```typescript
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const updateMetrics = () => {
      const engineMetrics = themeEngine.performance;
      const computationMetrics = themeComputer.getMetrics();
      
      setMetrics({
        engine: engineMetrics,
        computation: computationMetrics,
        health: checkPerformance()
      });
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="performance-monitor">
      <h3>Theme System Performance</h3>
      
      <div>
        <h4>Engine Metrics</h4>
        <p>Render Count: {metrics.engine.renderCount}</p>
        <p>Avg Update Time: {metrics.engine.averageUpdateDuration.toFixed(2)}ms</p>
        <p>Computation Time: {metrics.engine.computationTime.toFixed(2)}ms</p>
        <p>CSS Application Time: {metrics.engine.cssApplicationTime.toFixed(2)}ms</p>
      </div>
      
      <div>
        <h4>Computation Metrics</h4>
        <p>Cache Hit Rate: {metrics.computation.cacheHitRate.toFixed(1)}%</p>
        <p>Total Computations: {metrics.computation.totalComputations}</p>
        <p>Cache Size: {metrics.computation.cacheSize}</p>
      </div>
      
      <div>
        <h4>Health Status</h4>
        <p>Score: {metrics.health.score}/100</p>
        <p>Status: {metrics.health.isHealthy ? 'Healthy' : 'Issues Detected'}</p>
        {metrics.health.issues.length > 0 && (
          <ul>
            {metrics.health.issues.map(issue => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
```

### Performance Alerts
```typescript
const usePerformanceAlerts = () => {
  useEffect(() => {
    const checkPerformance = () => {
      const metrics = themeEngine.performance;
      
      // Alert if computation time is too high
      if (metrics.computationTime > 100) {
        console.warn('Theme computation time is high:', metrics.computationTime);
      }
      
      // Alert if render count is excessive
      if (metrics.renderCount > 1000) {
        console.warn('High render count detected:', metrics.renderCount);
        themeEngine.clearCache(); // Auto-cleanup
      }
      
      // Alert if cache hit rate is low
      const computationMetrics = themeComputer.getMetrics();
      if (computationMetrics.cacheHitRate < 0.7) {
        console.warn('Low cache hit rate:', computationMetrics.cacheHitRate);
      }
    };

    const interval = setInterval(checkPerformance, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, []);
};
```

## Troubleshooting Performance Issues

### Common Performance Problems

#### High Computation Time
```typescript
// Check if themes are being recomputed unnecessarily
const diagnostics = {
  cacheHitRate: themeComputer.getMetrics().cacheHitRate,
  computationTime: themeEngine.performance.computationTime,
  renderCount: themeEngine.performance.renderCount
};

if (diagnostics.cacheHitRate < 0.8) {
  // Low cache hit rate - optimize theme usage
  console.log('Consider using consistent theme configurations');
}

if (diagnostics.computationTime > 50) {
  // High computation time - reduce complexity
  console.log('Consider simplifying theme customizations');
}
```

#### Memory Leaks
```typescript
// Check for memory leaks
const memoryUsage = {
  cacheSize: themeComputer.getMetrics().cacheSize,
  eventListeners: themeEventEmitter.getListenerCount(),
  componentRegistry: componentIntegrationManager.getMigratedComponents().length
};

// Cleanup if memory usage is high
if (memoryUsage.cacheSize > 80) {
  themeComputer.clearCache();
}

if (memoryUsage.eventListeners > 50) {
  console.warn('High number of event listeners - check for cleanup');
}
```

#### Slow CSS Updates
```typescript
// Check CSS variable performance
const cssMetrics = cssVariableManager.getMetrics();

if (cssMetrics.pendingUpdates > 10) {
  console.warn('High number of pending CSS updates');
}

// Force immediate CSS update if needed
if (cssMetrics.isApplying) {
  console.log('CSS updates in progress...');
} else {
  // Trigger immediate update
  cssVariableManager.applyVariables(themeEngine.currentTheme.cssVariables);
}
```

### Performance Optimization Checklist

- [ ] Use consistent theme configurations
- [ ] Preload commonly used themes
- [ ] Minimize component theme dependencies
- [ ] Use CSS variables instead of inline styles
- [ ] Memoize expensive theme computations
- [ ] Clean up event subscriptions
- [ ] Monitor cache hit rates
- [ ] Clear caches periodically
- [ ] Avoid frequent theme changes
- [ ] Use selective event listening
- [ ] Optimize component integration
- [ ] Monitor performance metrics
- [ ] Handle SSR/hydration properly
# Troubleshooting Guide

Common issues and solutions for the Unified Theme System.

## Common Issues

### Theme Not Loading

#### Symptoms
- Components show default/unstyled appearance
- Theme variables are undefined
- Console errors about missing theme

#### Diagnosis
```typescript
import { themeEngine, ThemeSystemUtils } from '@/lib/theme';

// Check theme engine status
console.log('Theme Engine Status:', {
  isLoading: themeEngine.isLoading,
  hasError: themeEngine.error !== null,
  currentTheme: themeEngine.currentTheme,
  mode: themeEngine.mode,
  domain: themeEngine.domain
});

// Check system health
const health = ThemeSystemUtils.getHealthStatus();
console.log('System Health:', health);
```

#### Solutions

**1. Ensure Theme Provider is Properly Set Up**
```typescript
import { ThemeSystemUtils } from '@/lib/theme';

const ThemeProvider = ThemeSystemUtils.createProvider();

// Make sure this wraps your app
function App({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
```

**2. Check for Initialization Errors**
```typescript
// Initialize manually if needed
const initResult = await ThemeSystemUtils.initialize();
if (!initResult.success) {
  console.error('Theme initialization failed:', initResult.error);
  
  // Try with default configuration
  await themeEngine.setTheme({
    mode: 'system',
    domain: 'full-stack'
  });
}
```

**3. Verify Component Integration**
```typescript
// Check if component is theme-aware
import { componentIntegrationManager } from '@/lib/theme/integration';

const status = componentIntegrationManager.getComponentMigrationStatus('MyComponent');
if (!status.isMigrated) {
  // Make component theme-aware
  const ThemeAwareComponent = componentIntegrationManager
    .createThemeAwareComponent(MyComponent, 'MyComponent');
}
```

### Theme Not Persisting

#### Symptoms
- Theme resets to default on page reload
- User preferences not saved
- Inconsistent theme across sessions

#### Diagnosis
```typescript
import { themePersistenceManager } from '@/lib/theme/state';

// Check persistence status
console.log('Persistence Available:', themePersistenceManager.isStorageAvailable());

// Check stored data
const storedState = await themePersistenceManager.loadThemeState();
console.log('Stored Theme State:', storedState);

// Check storage info
const storageInfo = themePersistenceManager.getStorageInfo();
console.log('Storage Info:', storageInfo);
```

#### Solutions

**1. Enable Persistence**
```typescript
// Ensure persistence is enabled in configuration
const engine = new ThemeEngine({
  enablePersistence: true,
  persistenceKeyPrefix: 'theme-engine'
});
```

**2. Check localStorage Availability**
```typescript
// Test localStorage
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage is available');
} catch (error) {
  console.error('localStorage not available:', error);
  
  // Use memory storage fallback
  const memoryStorage = new MemoryStorageAdapter();
  const persistence = new ThemePersistenceManager({}, memoryStorage);
}
```

**3. Manual Persistence**
```typescript
// Force save current state
await themePersistenceManager.saveThemeState({
  mode: themeEngine.mode,
  domain: themeEngine.domain,
  preferences: themeEngine.currentTheme.preferences,
  customizations: {}
});
```

### Performance Issues

#### Symptoms
- Slow theme switching
- High memory usage
- Laggy UI during theme changes
- High CPU usage

#### Diagnosis
```typescript
import { themeEngine, themeComputer } from '@/lib/theme';

// Check performance metrics
const engineMetrics = themeEngine.performance;
const computationMetrics = themeComputer.getMetrics();

console.log('Performance Metrics:', {
  renderCount: engineMetrics.renderCount,
  averageUpdateDuration: engineMetrics.averageUpdateDuration,
  computationTime: engineMetrics.computationTime,
  cacheHitRate: computationMetrics.cacheHitRate,
  cacheSize: computationMetrics.cacheSize
});

// Check for performance issues
if (engineMetrics.renderCount > 1000) {
  console.warn('High render count detected');
}
if (engineMetrics.computationTime > 100) {
  console.warn('High computation time detected');
}
if (computationMetrics.cacheHitRate < 0.7) {
  console.warn('Low cache hit rate detected');
}
```

#### Solutions

**1. Clear Caches**
```typescript
// Clear all caches
themeEngine.clearCache();
themeComputer.clearCache();

// Clear CSS variable cache
import { cssVariableManager } from '@/lib/theme/core';
cssVariableManager.clearVariables();
```

**2. Optimize Component Usage**
```typescript
// Use memoized theme hooks
const useOptimizedTheme = () => {
  const { theme } = useUnifiedTheme();
  
  return useMemo(() => ({
    colors: theme?.colors,
    mode: theme?.mode,
    domain: theme?.domain
  }), [theme?.colors, theme?.mode, theme?.domain]);
};

// Minimize theme dependencies
const OptimizedComponent = () => {
  const { colors } = useOptimizedTheme();
  return <div style={{ color: colors?.primary }}>Content</div>;
};
```

**3. Batch Theme Updates**
```typescript
// Bad: Multiple separate updates
await themeEngine.setMode('dark');
await themeEngine.setDomain('cloud');

// Good: Single batched update
await themeEngine.setTheme({
  mode: 'dark',
  domain: 'cloud'
});
```

### Migration Issues

#### Symptoms
- Legacy theme hooks not working
- Components not receiving theme updates
- Inconsistent theme behavior
- Migration warnings in console

#### Diagnosis
```typescript
import { useMigrationStatus } from '@/lib/theme/integration';

// Check migration status
const migrationStatus = useMigrationStatus();
console.log('Migration Status:', migrationStatus);

// Check specific migrations
import { 
  nextThemesAdapter, 
  domainThemeAdapter,
  ThemeIntegrationUtils 
} from '@/lib/theme/integration';

console.log('Next-themes Migration:', nextThemesAdapter.getMigrationStatus());
console.log('Domain Theme Migration:', domainThemeAdapter.getDomainMigrationStatus());

// Generate migration report
const report = ThemeIntegrationUtils.generateMigrationReport();
console.log('Migration Report:', report);
```

#### Solutions

**1. Force Migration**
```typescript
// Perform complete migration
const migrationResults = await ThemeIntegrationUtils.performCompleteMigration();
console.log('Migration Results:', migrationResults);

// Check for errors
if (!migrationResults.nextThemes.success) {
  console.error('Next-themes migration failed:', migrationResults.nextThemes.error);
}
if (!migrationResults.domainTheme.success) {
  console.error('Domain theme migration failed:', migrationResults.domainTheme.error);
}
```

**2. Use Compatibility Wrappers**
```typescript
// Use backward-compatible hooks during transition
import { ThemeIntegrationUtils } from '@/lib/theme/integration';

const compatibilityLayer = ThemeIntegrationUtils.createBackwardCompatibilityLayer();

// Use legacy-compatible hooks
const useTheme = compatibilityLayer.useTheme;
const useDomainTheme = compatibilityLayer.useDomainTheme;
```

**3. Reset Migration State**
```typescript
// Reset migration for testing
nextThemesAdapter.resetMigration();

// Clear migration flags
if (typeof window !== 'undefined') {
  localStorage.removeItem('theme-migration-complete');
  localStorage.removeItem('domain-theme-migration-complete');
}
```

### SSR/Hydration Issues

#### Symptoms
- Hydration mismatches
- Flash of unstyled content (FOUC)
- Different themes on server vs client
- Console warnings about hydration

#### Diagnosis
```typescript
// Check if running on server or client
console.log('Environment:', {
  isServer: typeof window === 'undefined',
  isClient: typeof window !== 'undefined',
  isHydrated: typeof window !== 'undefined' && window.document
});

// Check theme state during hydration
const { theme, isLoading } = useUnifiedTheme();
console.log('Theme State:', {
  theme: theme,
  isLoading: isLoading,
  hasTheme: theme !== null
});
```

#### Solutions

**1. Prevent Hydration Mismatches**
```typescript
const SSRSafeComponent = () => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useUnifiedTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return <div className="theme-loading">Loading...</div>;
  }

  return (
    <div className={`theme-${theme?.mode} domain-${theme?.domain}`}>
      Content
    </div>
  );
};
```

**2. Use CSS Variables for SSR**
```typescript
// Use CSS variables that work on both server and client
const SSROptimizedComponent = () => {
  return (
    <div style={{
      color: 'var(--color-text-primary)',
      backgroundColor: 'var(--color-bg-primary)',
      borderColor: 'var(--color-border-primary)'
    }}>
      Content
    </div>
  );
};
```

**3. Initialize Theme Early**
```typescript
// Initialize theme system before rendering
export default function App({ Component, pageProps }) {
  const [themeInitialized, setThemeInitialized] = useState(false);

  useEffect(() => {
    ThemeSystemUtils.initialize().then(() => {
      setThemeInitialized(true);
    });
  }, []);

  if (!themeInitialized) {
    return <div>Initializing theme system...</div>;
  }

  return <Component {...pageProps} />;
}
```

### CSS Variables Not Working

#### Symptoms
- Styles not applying correctly
- CSS variables showing as undefined
- Inconsistent styling across components

#### Diagnosis
```typescript
import { cssVariableManager } from '@/lib/theme/core';

// Check CSS variable status
const cssMetrics = cssVariableManager.getMetrics();
console.log('CSS Variable Metrics:', cssMetrics);

// Check current variables
const currentVariables = cssVariableManager.getAllVariables();
console.log('Current CSS Variables:', currentVariables);

// Check if specific variable exists
const hasPrimary = cssVariableManager.hasVariable('--color-primary');
console.log('Has primary color variable:', hasPrimary);
```

#### Solutions

**1. Force CSS Variable Application**
```typescript
// Apply theme CSS variables manually
const theme = themeEngine.currentTheme;
if (theme) {
  cssVariableManager.applyVariables(theme.cssVariables);
}

// Set specific variable
cssVariableManager.setVariable('--color-primary', '#3B82F6');
```

**2. Check CSS Variable Generation**
```typescript
// Regenerate CSS variables
const theme = themeEngine.currentTheme;
const variables = themeComputer.generateCSSVariables(theme);
console.log('Generated Variables:', variables);

// Apply regenerated variables
cssVariableManager.applyVariables(variables);
```

**3. Fallback Values**
```typescript
// Use fallback values in CSS
.my-component {
  color: var(--color-primary, #3B82F6);
  background: var(--color-bg-primary, #ffffff);
}

// Or in JavaScript
const styles = {
  color: cssVariableManager.getVariable('--color-primary') || '#3B82F6',
  background: cssVariableManager.getVariable('--color-bg-primary') || '#ffffff'
};
```

## Error Messages and Solutions

### "Theme engine not initialized"

**Cause**: Theme engine hasn't been properly initialized.

**Solution**:
```typescript
// Initialize theme engine
await ThemeSystemUtils.initialize();

// Or initialize manually
const result = await themeEngine.setTheme({
  mode: 'system',
  domain: 'full-stack'
});
```

### "Invalid theme mode: [mode]"

**Cause**: Invalid theme mode provided.

**Solution**:
```typescript
// Use valid theme modes
const validModes = ['light', 'dark', 'system'];
await themeEngine.setMode('dark'); // Valid
// await themeEngine.setMode('invalid'); // Invalid
```

### "Domain theme not found: [domain]"

**Cause**: Invalid domain provided.

**Solution**:
```typescript
// Use valid domains
const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];
await themeEngine.setDomain('cloud'); // Valid
// await themeEngine.setDomain('invalid'); // Invalid
```

### "useDomainTheme must be used within a DomainThemeProvider"

**Cause**: Hook used outside of provider context.

**Solution**:
```typescript
// Wrap component with provider
import { domainThemeAdapter } from '@/lib/theme/integration';

const DomainProvider = domainThemeAdapter.createDomainMigrationWrapper();

function App({ children }) {
  return (
    <DomainProvider>
      {children}
    </DomainProvider>
  );
}
```

### "Theme computation failed"

**Cause**: Error during theme computation.

**Solution**:
```typescript
// Check theme configuration
const validation = themeValidator.validateThemeConfig({
  mode: 'dark',
  domain: 'cloud'
});

if (!validation.isValid) {
  console.error('Invalid theme config:', validation.errors);
}

// Use fallback theme
const fallbackTheme = themeComputer.getFallbackTheme();
```

## Debug Mode

### Enable Debug Mode

```typescript
// Enable debug mode for detailed logging
const engine = new ThemeEngine({
  enableDebugMode: true
});

// Or enable globally
process.env.THEME_DEBUG = 'true';
```

### Debug Tools

```typescript
import { ThemeSystemUtils } from '@/lib/theme';

// Create debug tools
const devTools = ThemeSystemUtils.createDevTools();

// Inspector tools
console.log('Current Theme:', devTools.inspector.getCurrentTheme());
console.log('Performance Metrics:', devTools.inspector.getPerformanceMetrics());
console.log('Cache Status:', devTools.inspector.getCacheStatus());
console.log('Validation Results:', devTools.inspector.getValidationResults());

// Debugging tools
devTools.debugging.enableDebugMode();
devTools.debugging.clearAllCaches();
await devTools.debugging.resetToDefaults();

// Migration tools
console.log('Migration Status:', devTools.migration.checkMigrationStatus());
const migrationReport = devTools.migration.generateReport();
console.log('Migration Report:', migrationReport);
```

### Debug Component

```typescript
const ThemeDebugger = () => {
  const { theme, isLoading, error } = useUnifiedTheme();
  const migrationStatus = useMigrationStatus();
  const health = useIntegrationHealth();

  return (
    <div className="theme-debugger">
      <h3>Theme Debug Info</h3>
      
      <div>
        <h4>Current State</h4>
        <pre>{JSON.stringify({ theme, isLoading, error }, null, 2)}</pre>
      </div>
      
      <div>
        <h4>Migration Status</h4>
        <pre>{JSON.stringify(migrationStatus, null, 2)}</pre>
      </div>
      
      <div>
        <h4>Health Status</h4>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>
      
      <div>
        <h4>Performance</h4>
        <pre>{JSON.stringify(themeEngine.performance, null, 2)}</pre>
      </div>
    </div>
  );
};
```

## Recovery Procedures

### Complete System Reset

```typescript
async function resetThemeSystem() {
  try {
    // Clear all caches
    themeEngine.clearCache();
    themeComputer.clearCache();
    cssVariableManager.clearVariables();
    
    // Reset to defaults
    await themeEngine.setTheme({
      mode: 'system',
      domain: 'full-stack',
      preferences: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        customizations: {},
        autoDetectPreferences: true
      },
      customizations: {}
    });
    
    // Clear persistence
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme-engine-state');
      localStorage.removeItem('theme-engine-mode');
      localStorage.removeItem('theme-engine-domain');
    }
    
    console.log('Theme system reset successfully');
  } catch (error) {
    console.error('Failed to reset theme system:', error);
  }
}
```

### Repair Corrupted State

```typescript
async function repairThemeState() {
  try {
    // Validate current state
    const validation = themeValidator.validateThemeState(themeEngine.getState());
    
    if (!validation.isValid) {
      console.warn('Invalid theme state detected:', validation.errors);
      
      // Reset to valid state
      await resetThemeSystem();
    }
    
    // Check and repair persistence
    const storedState = await themePersistenceManager.loadThemeState();
    if (storedState) {
      const stateValidation = themeValidator.validateThemeState(storedState);
      if (!stateValidation.isValid) {
        console.warn('Corrupted stored state, clearing...');
        themePersistenceManager.removeThemeState();
      }
    }
    
    console.log('Theme state repaired successfully');
  } catch (error) {
    console.error('Failed to repair theme state:', error);
  }
}
```

### Emergency Fallback

```typescript
// Emergency fallback component
const EmergencyThemeFallback = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const checkThemeHealth = () => {
      try {
        const theme = themeEngine.currentTheme;
        if (!theme || themeEngine.error) {
          setHasError(true);
        }
      } catch (error) {
        setHasError(true);
      }
    };

    checkThemeHealth();
    const interval = setInterval(checkThemeHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  if (hasError) {
    return (
      <div className="emergency-theme-fallback">
        <style>{`
          .emergency-theme-fallback {
            --color-primary: #3B82F6;
            --color-bg-primary: #ffffff;
            --color-text-primary: #000000;
            color: var(--color-text-primary);
            background: var(--color-bg-primary);
          }
        `}</style>
        <div>
          <h2>Theme System Error</h2>
          <p>The theme system encountered an error. Using fallback theme.</p>
          <button onClick={resetThemeSystem}>
            Reset Theme System
          </button>
        </div>
        {children}
      </div>
    );
  }

  return children;
};
```

## Getting Help

### Reporting Issues

When reporting theme system issues, include:

1. **Environment Information**
```typescript
const debugInfo = {
  userAgent: navigator.userAgent,
  themeSystemVersion: THEME_SYSTEM_VERSION,
  nodeEnv: process.env.NODE_ENV,
  isSSR: typeof window === 'undefined'
};
```

2. **Theme State**
```typescript
const themeState = {
  currentTheme: themeEngine.currentTheme,
  mode: themeEngine.mode,
  domain: themeEngine.domain,
  isLoading: themeEngine.isLoading,
  error: themeEngine.error
};
```

3. **Performance Metrics**
```typescript
const performanceInfo = {
  engine: themeEngine.performance,
  computation: themeComputer.getMetrics(),
  css: cssVariableManager.getMetrics()
};
```

4. **Migration Status**
```typescript
const migrationInfo = ThemeIntegrationUtils.getMigrationStatus();
```

### Support Checklist

Before seeking help:

- [ ] Check console for error messages
- [ ] Verify theme provider is properly set up
- [ ] Confirm component is theme-aware
- [ ] Check migration status
- [ ] Try clearing caches
- [ ] Test with debug mode enabled
- [ ] Verify localStorage is available
- [ ] Check performance metrics
- [ ] Try emergency reset procedures
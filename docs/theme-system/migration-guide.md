# Migration Guide

Complete guide for migrating from existing theme systems to the Unified Theme System.

## Overview

The Unified Theme System provides automatic migration from:
- `next-themes` for light/dark mode management
- `DomainThemeContext` for domain-aware theming
- Legacy component theme implementations

## Migration Strategy

### Phase 1: Automatic Migration
The system automatically detects and migrates existing theme data during initialization.

### Phase 2: Backward Compatibility
All existing APIs continue to work through compatibility adapters.

### Phase 3: Gradual Migration
Components can be migrated individually without breaking existing functionality.

### Phase 4: Cleanup
Remove legacy dependencies and code after full migration.

## From next-themes

### Automatic Migration

The system automatically migrates `next-themes` data on first load:

```typescript
// Automatic migration happens during initialization
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

### Manual Migration

If you need to trigger migration manually:

```typescript
import { nextThemesAdapter } from '@/lib/theme/integration';

// Check if migration is needed
if (nextThemesAdapter.needsMigration()) {
  await nextThemesAdapter.migrateFromNextThemes();
}

// Check migration status
const status = nextThemesAdapter.getMigrationStatus();
console.log('Migration complete:', status.migrationComplete);
```

### API Changes

#### Before (next-themes)
```typescript
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {resolvedTheme}
    </button>
  );
}
```

#### After (Unified System)
```typescript
import { useUnifiedTheme } from '@/lib/theme';

function ThemeToggle() {
  const { theme, toggleMode } = useUnifiedTheme();
  
  return (
    <button onClick={toggleMode}>
      Current: {theme?.mode}
    </button>
  );
}
```

#### Backward Compatible (Transition Period)
```typescript
import { nextThemesAdapter } from '@/lib/theme/integration';

// Use the compatibility hook during transition
const useTheme = nextThemesAdapter.createCompatibleUseTheme();

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {resolvedTheme}
    </button>
  );
}
```

### Provider Migration

#### Before
```typescript
import { ThemeProvider } from 'next-themes';

function App({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
    </ThemeProvider>
  );
}
```

#### After
```typescript
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

## From DomainThemeContext

### Automatic Migration

Domain theme data is automatically migrated:

```typescript
// Migration happens automatically during initialization
import { domainThemeAdapter } from '@/lib/theme/integration';

// Check migration status
const status = domainThemeAdapter.getDomainMigrationStatus();
console.log('Domain migration complete:', status.migrationComplete);
```

### API Changes

#### Before (DomainThemeContext)
```typescript
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';

function DomainSelector() {
  const { currentDomain, setCurrentDomain, currentDomainColor } = useDomainTheme();
  
  return (
    <div style={{ color: currentDomainColor }}>
      <select 
        value={currentDomain} 
        onChange={(e) => setCurrentDomain(e.target.value)}
      >
        <option value="full-stack">Full-Stack</option>
        <option value="cloud">Cloud</option>
      </select>
    </div>
  );
}
```

#### After (Unified System)
```typescript
import { useUnifiedTheme } from '@/lib/theme';

function DomainSelector() {
  const { theme, setDomain } = useUnifiedTheme();
  
  return (
    <div style={{ color: theme?.colors.domainPrimary }}>
      <select 
        value={theme?.domain} 
        onChange={(e) => setDomain(e.target.value)}
      >
        <option value="full-stack">Full-Stack</option>
        <option value="cloud">Cloud</option>
      </select>
    </div>
  );
}
```

#### Enhanced Version (New Features)
```typescript
import { domainThemeAdapter } from '@/lib/theme/integration';

const useDomainTheme = domainThemeAdapter.createEnhancedDomainTheme();

function DomainSelector() {
  const { 
    currentDomain, 
    setCurrentDomain, 
    computedTheme,
    isLoading,
    preloadDomain 
  } = useDomainTheme();
  
  // Preload domain themes for better performance
  const handleDomainHover = (domain) => {
    preloadDomain(domain);
  };
  
  return (
    <div style={{ color: computedTheme?.colors.domainPrimary }}>
      {isLoading && <span>Loading...</span>}
      <select 
        value={currentDomain} 
        onChange={(e) => setCurrentDomain(e.target.value)}
      >
        <option 
          value="full-stack"
          onMouseEnter={() => handleDomainHover('full-stack')}
        >
          Full-Stack
        </option>
        <option 
          value="cloud"
          onMouseEnter={() => handleDomainHover('cloud')}
        >
          Cloud
        </option>
      </select>
    </div>
  );
}
```

### Domain Styling Migration

#### Before
```typescript
import { useDomainStyling } from '@/lib/contexts/DomainThemeContext';

function StyledComponent() {
  const { getThemeClasses, getThemeStyles, domainColor } = useDomainStyling();
  
  return (
    <div 
      className={getThemeClasses('base-class')}
      style={getThemeStyles({ padding: '1rem' })}
    >
      Content
    </div>
  );
}
```

#### After
```typescript
import { useUnifiedTheme } from '@/lib/theme';

function StyledComponent() {
  const { theme } = useUnifiedTheme();
  
  return (
    <div 
      className={`base-class theme-${theme?.mode} domain-${theme?.domain}`}
      style={{ 
        padding: '1rem',
        '--domain-color': theme?.colors.domainPrimary 
      }}
    >
      Content
    </div>
  );
}
```

## Component Migration

### Manual Component Migration

#### Before (Legacy Theme Props)
```typescript
interface ComponentProps {
  isDark?: boolean;
  isLight?: boolean;
  currentDomain?: Domain;
  domainColor?: string;
  themeClasses?: string;
}

const MyComponent: React.FC<ComponentProps> = ({ 
  isDark, 
  currentDomain, 
  domainColor,
  children 
}) => {
  const themeClass = isDark ? 'dark' : 'light';
  const domainClass = `domain-${currentDomain}`;
  
  return (
    <div 
      className={`${themeClass} ${domainClass}`}
      style={{ color: domainColor }}
    >
      {children}
    </div>
  );
};
```

#### After (Theme-Aware Component)
```typescript
import { componentIntegrationManager } from '@/lib/theme/integration';

interface ComponentProps {
  children: React.ReactNode;
}

const MyComponent: React.FC<ComponentProps> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

// Make component theme-aware
export default componentIntegrationManager.createThemeAwareComponent(
  MyComponent, 
  'MyComponent'
);
```

### Automatic Component Migration

```typescript
import { componentIntegrationManager } from '@/lib/theme/integration';

// Migrate existing component with backward compatibility
const MigratedComponent = componentIntegrationManager.migrateComponent(
  OriginalComponent,
  'MyComponent',
  {
    preserveLegacyProps: true, // Keep supporting old props during transition
    enablePerformanceOptimizations: true
  }
);

// Usage - both old and new props work
<MigratedComponent 
  isDark={true}           // Legacy prop (still works)
  currentDomain="cloud"   // Legacy prop (still works)
  theme={computedTheme}   // New prop (enhanced)
  themeMode="dark"        // New prop (enhanced)
  domain="cloud"          // New prop (enhanced)
>
  Content
</MigratedComponent>
```

### Component Hook Migration

#### Before (Multiple Hooks)
```typescript
import { useTheme } from 'next-themes';
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';

function Component() {
  const { theme: mode, setTheme: setMode } = useTheme();
  const { currentDomain, setCurrentDomain, currentDomainColor } = useDomainTheme();
  
  return (
    <div style={{ color: currentDomainColor }}>
      Mode: {mode}, Domain: {currentDomain}
    </div>
  );
}
```

#### After (Single Hook)
```typescript
import { useUnifiedTheme } from '@/lib/theme';

function Component() {
  const { theme, setMode, setDomain } = useUnifiedTheme();
  
  return (
    <div style={{ color: theme?.colors.domainPrimary }}>
      Mode: {theme?.mode}, Domain: {theme?.domain}
    </div>
  );
}
```

## Migration Utilities

### Migration Status Monitoring

```typescript
import { useMigrationStatus } from '@/lib/theme/integration';

function MigrationDashboard() {
  const status = useMigrationStatus();
  
  return (
    <div>
      <h3>Migration Status</h3>
      
      <div>
        <h4>Next-themes Migration</h4>
        <p>Complete: {status.nextThemes.migrationComplete ? 'Yes' : 'No'}</p>
        <p>Needs Migration: {status.nextThemes.needsMigration ? 'Yes' : 'No'}</p>
      </div>
      
      <div>
        <h4>Domain Theme Migration</h4>
        <p>Complete: {status.domainTheme.migrationComplete ? 'Yes' : 'No'}</p>
        <p>Has Legacy Data: {status.domainTheme.hasLegacyData ? 'Yes' : 'No'}</p>
      </div>
      
      <div>
        <h4>Component Migration</h4>
        <p>Progress: {status.components.migrationProgress}%</p>
        <p>Migrated: {status.components.migratedComponents}</p>
        <p>Pending: {status.components.pendingMigrations}</p>
      </div>
    </div>
  );
}
```

### Migration Report Generation

```typescript
import { ThemeIntegrationUtils } from '@/lib/theme/integration';

// Generate comprehensive migration report
const report = ThemeIntegrationUtils.generateMigrationReport();

console.log('Migration Report:', {
  summary: report.summary,
  nextThemes: report.nextThemes,
  domainTheme: report.domainTheme,
  components: report.components
});

// Example output:
// {
//   summary: {
//     totalIssues: 2,
//     migrationProgress: 75,
//     recommendedActions: [
//       'Run next-themes migration',
//       'Migrate remaining components'
//     ]
//   },
//   nextThemes: {
//     conflicts: ['Theme mode mismatch'],
//     recommendations: ['Run migration to sync theme states']
//   },
//   domainTheme: {
//     conflicts: [],
//     recommendations: ['Consider removing legacy domain storage']
//   },
//   components: {
//     migrationProgress: 75,
//     pendingMigrations: 5
//   }
// }
```

### Complete Migration Execution

```typescript
import { ThemeIntegrationUtils } from '@/lib/theme/integration';

async function performFullMigration() {
  try {
    const results = await ThemeIntegrationUtils.performCompleteMigration();
    
    console.log('Migration Results:', {
      nextThemes: results.nextThemes.success ? 'Success' : results.nextThemes.error,
      domainTheme: results.domainTheme.success ? 'Success' : results.domainTheme.error,
      components: results.components.success ? 'Success' : results.components.error
    });
    
    // Clean up legacy data after successful migration
    if (results.nextThemes.success && results.domainTheme.success) {
      const cleanup = ThemeIntegrationUtils.cleanupLegacyData();
      if (cleanup.success) {
        console.log('Legacy data cleaned up successfully');
      }
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
```

## Migration Wrapper Components

### Complete Migration Wrapper

```typescript
import { ThemeIntegrationUtils } from '@/lib/theme/integration';

const MigrationWrapper = ThemeIntegrationUtils.createMigrationWrapper();

function App({ children }) {
  return (
    <MigrationWrapper>
      {children}
    </MigrationWrapper>
  );
}
```

### Individual Migration Wrappers

```typescript
import { 
  nextThemesAdapter, 
  domainThemeAdapter 
} from '@/lib/theme/integration';

const NextThemesMigration = nextThemesAdapter.createMigrationWrapper();
const DomainMigration = domainThemeAdapter.createDomainMigrationWrapper();

function App({ children }) {
  return (
    <NextThemesMigration>
      <DomainMigration>
        {children}
      </DomainMigration>
    </NextThemesMigration>
  );
}
```

## Testing Migration

### Migration Testing Utilities

```typescript
import { 
  nextThemesAdapter,
  domainThemeAdapter,
  componentIntegrationManager 
} from '@/lib/theme/integration';

// Test next-themes migration
describe('Next-themes Migration', () => {
  beforeEach(() => {
    // Reset migration state for testing
    nextThemesAdapter.resetMigration();
  });

  it('should migrate theme data correctly', async () => {
    // Set up legacy data
    localStorage.setItem('theme', 'dark');
    
    // Perform migration
    await nextThemesAdapter.migrateFromNextThemes();
    
    // Verify migration
    const status = nextThemesAdapter.getMigrationStatus();
    expect(status.migrationComplete).toBe(true);
  });
});

// Test component migration
describe('Component Migration', () => {
  it('should create theme-aware component', () => {
    const TestComponent = ({ children }) => <div>{children}</div>;
    
    const ThemeAwareComponent = componentIntegrationManager
      .createThemeAwareComponent(TestComponent, 'TestComponent');
    
    const status = componentIntegrationManager
      .getComponentMigrationStatus('TestComponent');
    
    expect(status.isMigrated).toBe(true);
  });
});
```

### Integration Testing

```typescript
import { render, screen } from '@testing-library/react';
import { ThemeSystemUtils } from '@/lib/theme';

const ThemeProvider = ThemeSystemUtils.createProvider();

describe('Theme System Integration', () => {
  it('should initialize and migrate successfully', async () => {
    const result = await ThemeSystemUtils.initialize();
    expect(result.success).toBe(true);
  });

  it('should provide theme context to components', () => {
    function TestComponent() {
      const { theme } = useUnifiedTheme();
      return <div data-testid="theme-mode">{theme?.mode}</div>;
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toBeInTheDocument();
  });
});
```

## Troubleshooting Migration

### Common Migration Issues

#### Issue: Theme not persisting after migration
```typescript
// Check if persistence is enabled
const status = ThemeSystemUtils.getHealthStatus();
if (!status.engine.performance) {
  console.log('Persistence may be disabled');
}

// Force save current state
await unifiedThemeSystem.persistence.saveThemeState({
  mode: 'dark',
  domain: 'cloud'
});
```

#### Issue: Components not receiving theme updates
```typescript
// Check if component is properly wrapped
const migrationStatus = componentIntegrationManager
  .getComponentMigrationStatus('MyComponent');

if (!migrationStatus.isMigrated) {
  // Migrate the component
  const MigratedComponent = componentIntegrationManager
    .migrateComponent(OriginalComponent, 'MyComponent');
}
```

#### Issue: Performance degradation after migration
```typescript
// Check performance metrics
const metrics = unifiedThemeSystem.engine.performance;
if (metrics.renderCount > 1000) {
  // Clear caches
  unifiedThemeSystem.engine.clearCache();
  unifiedThemeSystem.computer.clearCache();
}

// Enable performance optimizations
const optimizedComponent = componentIntegrationManager
  .migrateComponent(Component, 'Component', {
    enablePerformanceOptimizations: true
  });
```

### Migration Rollback

If you need to rollback migration:

```typescript
// Reset migration flags
if (typeof window !== 'undefined') {
  localStorage.removeItem('theme-migration-complete');
  localStorage.removeItem('domain-theme-migration-complete');
}

// Reset to legacy implementations
const legacyUseTheme = NextThemesUtils.createCompatibilityShim().useTheme;
const legacyUseDomainTheme = domainThemeAdapter.createCompatibleDomainTheme();
```

## Best Practices

### 1. Gradual Migration
- Migrate components one at a time
- Keep legacy APIs working during transition
- Test thoroughly at each step

### 2. Performance Monitoring
- Monitor performance metrics during migration
- Use preloading for better user experience
- Clear caches if performance degrades

### 3. Error Handling
- Always check migration status before proceeding
- Handle migration errors gracefully
- Provide fallbacks for failed migrations

### 4. Testing
- Test both legacy and new APIs during transition
- Verify theme persistence across page reloads
- Test with different theme modes and domains

### 5. Cleanup
- Remove legacy dependencies after full migration
- Clean up unused code and props
- Update documentation and type definitions
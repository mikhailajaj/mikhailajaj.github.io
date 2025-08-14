# API Reference

Complete API documentation for the Unified Theme System.

## Core Engine API

### ThemeEngine

The central theme management engine.

#### Constructor

```typescript
new ThemeEngine(config?: ThemeEngineConfig)
```

**Parameters:**
- `config` (optional): Engine configuration options

**ThemeEngineConfig:**
```typescript
interface ThemeEngineConfig {
  initialMode?: ThemeMode;              // Default: 'system'
  initialDomain?: Domain;               // Default: 'full-stack'
  enablePersistence?: boolean;          // Default: true
  persistenceKeyPrefix?: string;        // Default: 'theme-engine'
  enablePerformanceMonitoring?: boolean; // Default: true
  enableDebugMode?: boolean;            // Default: false
  defaults?: Partial<ThemeState>;
}
```

#### Properties

##### `currentTheme: ComputedTheme`
Get the current computed theme.

```typescript
const theme = themeEngine.currentTheme;
console.log('Current mode:', theme.mode);
console.log('Current domain:', theme.domain);
```

##### `mode: ThemeMode`
Get the current theme mode.

```typescript
const mode = themeEngine.mode; // 'light' | 'dark' | 'system'
```

##### `domain: Domain`
Get the current domain.

```typescript
const domain = themeEngine.domain; // 'full-stack' | 'cloud' | 'data' | 'ux-ui' | 'consulting'
```

##### `isLoading: boolean`
Check if the theme engine is loading.

```typescript
if (themeEngine.isLoading) {
  console.log('Theme engine is loading...');
}
```

##### `error: ThemeError | null`
Get the current error state.

```typescript
if (themeEngine.error) {
  console.error('Theme error:', themeEngine.error.message);
}
```

##### `performance: ThemePerformanceMetrics`
Get performance metrics.

```typescript
const metrics = themeEngine.performance;
console.log('Render count:', metrics.renderCount);
console.log('Average update duration:', metrics.averageUpdateDuration);
```

#### Methods

##### `setTheme(config: ThemeConfig): Promise<void>`
Set theme configuration.

```typescript
await themeEngine.setTheme({
  mode: 'dark',
  domain: 'cloud',
  preferences: {
    reducedMotion: true,
    highContrast: false,
    fontSize: 'large',
    customizations: {},
    autoDetectPreferences: true
  },
  customizations: {
    colors: {
      primary: '#custom-blue'
    }
  }
});
```

##### `setMode(mode: ThemeMode): Promise<void>`
Set theme mode.

```typescript
await themeEngine.setMode('dark');
await themeEngine.setMode('light');
await themeEngine.setMode('system');
```

##### `setDomain(domain: Domain): Promise<void>`
Set current domain.

```typescript
await themeEngine.setDomain('cloud');
await themeEngine.setDomain('data');
```

##### `toggleMode(): Promise<void>`
Toggle between light and dark modes.

```typescript
await themeEngine.toggleMode();
```

##### `computeTheme(domain?, mode?): ComputedTheme`
Compute theme for given domain and mode.

```typescript
const theme = themeEngine.computeTheme('cloud', 'dark');
```

##### `applyTheme(theme?): void`
Apply theme to DOM.

```typescript
themeEngine.applyTheme(); // Apply current theme
themeEngine.applyTheme(customTheme); // Apply specific theme
```

##### `subscribe(callback: ThemeChangeCallback): UnsubscribeFunction`
Subscribe to theme changes.

```typescript
const unsubscribe = themeEngine.subscribe((event) => {
  console.log('Theme event:', event.type);
  console.log('New theme:', event.payload.current);
});

// Cleanup
unsubscribe();
```

##### `preloadThemes(domains: Domain[]): Promise<void>`
Preload themes for given domains.

```typescript
await themeEngine.preloadThemes(['cloud', 'data', 'ux-ui']);
```

##### `clearCache(): void`
Clear theme computation cache.

```typescript
themeEngine.clearCache();
```

##### `destroy(): void`
Destroy theme engine and cleanup.

```typescript
themeEngine.destroy();
```

## State Management API

### ThemeStateManager

Manages theme state with persistence and validation.

#### Constructor

```typescript
new ThemeStateManager(
  initialState?: Partial<ThemeState>,
  persistence?: ThemeStatePersistence,
  cache?: ThemeStateCache,
  debugMode?: boolean
)
```

#### Methods

##### `getState(): ThemeState`
Get current theme state.

```typescript
const state = stateManager.getState();
```

##### `updateState(updates: Partial<ThemeState>): Promise<void>`
Update theme state.

```typescript
await stateManager.updateState({
  mode: 'dark',
  domain: 'cloud'
});
```

##### `updateMode(mode: ThemeMode): Promise<void>`
Update theme mode.

```typescript
await stateManager.updateMode('dark');
```

##### `updateDomain(domain: Domain): Promise<void>`
Update domain.

```typescript
await stateManager.updateDomain('cloud');
```

##### `updatePreferences(preferences: Partial<UserThemePreferences>): Promise<void>`
Update user preferences.

```typescript
await stateManager.updatePreferences({
  reducedMotion: true,
  fontSize: 'large'
});
```

##### `subscribe(callback: (state: ThemeState) => void): () => void`
Subscribe to state changes.

```typescript
const unsubscribe = stateManager.subscribe((state) => {
  console.log('State updated:', state);
});
```

##### `hydrate(): Promise<void>`
Hydrate state from persistence.

```typescript
await stateManager.hydrate();
```

##### `validateState(): ThemeStateValidation`
Validate current state.

```typescript
const validation = stateManager.validateState();
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### ThemeValidator

Validates theme configurations and state.

#### Methods

##### `validateThemeConfig(config: ThemeConfig): ValidationResult`
Validate theme configuration.

```typescript
const result = themeValidator.validateThemeConfig({
  mode: 'dark',
  domain: 'cloud'
});

if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

##### `validateThemeState(state: ThemeState): ValidationResult`
Validate theme state.

```typescript
const result = themeValidator.validateThemeState(state);
```

##### `validateComputedTheme(theme: ComputedTheme): ValidationResult`
Validate computed theme.

```typescript
const result = themeValidator.validateComputedTheme(theme);
```

## Computation API

### ThemeComputer

Handles theme computation with performance optimization.

#### Methods

##### `computeTheme(context: ComputationContext): ComputedTheme`
Compute theme for given context.

```typescript
const theme = themeComputer.computeTheme({
  domain: 'cloud',
  mode: 'dark',
  preferences: userPreferences,
  customizations: userCustomizations,
  timestamp: Date.now()
});
```

##### `computeColors(domain, mode, preferences, customizations?): ThemeColors`
Compute theme colors.

```typescript
const colors = themeComputer.computeColors(
  'cloud',
  'dark',
  preferences,
  customizations
);
```

##### `generateCSSVariables(theme: ComputedTheme): Record<string, string>`
Generate CSS variables from computed theme.

```typescript
const variables = themeComputer.generateCSSVariables(theme);
```

##### `getMetrics(): ComputationMetrics`
Get computation metrics.

```typescript
const metrics = themeComputer.getMetrics();
console.log('Cache hit rate:', metrics.cacheHitRate);
console.log('Total computations:', metrics.totalComputations);
```

##### `clearCache(): void`
Clear computation cache.

```typescript
themeComputer.clearCache();
```

### ThemeMerger

Handles theme merging and inheritance.

#### Methods

##### `mergeThemeLayers(layers: ThemeLayer[], config?): MergeResult`
Merge multiple theme layers.

```typescript
const result = themeMerger.mergeThemeLayers([
  { level: 'base', priority: 1, source: 'base', data: baseTheme, timestamp: Date.now() },
  { level: 'domain', priority: 2, source: 'cloud', data: domainTheme, timestamp: Date.now() },
  { level: 'user', priority: 3, source: 'user', data: userTheme, timestamp: Date.now() }
]);

if (result.success) {
  console.log('Merged theme:', result.result);
} else {
  console.error('Merge conflicts:', result.conflicts);
}
```

##### `mergeBaseWithDomain(baseTheme, domainTheme, domain, mode): ComputedTheme`
Merge base theme with domain theme.

```typescript
const merged = themeMerger.mergeBaseWithDomain(
  baseTheme,
  domainTheme,
  'cloud',
  'dark'
);
```

##### `applyUserCustomizations(baseTheme, customizations, preferences): ComputedTheme`
Apply user customizations to theme.

```typescript
const customized = themeMerger.applyUserCustomizations(
  baseTheme,
  customizations,
  preferences
);
```

## Integration API

### NextThemesAdapter

Provides integration with next-themes.

#### Methods

##### `createCompatibleUseTheme(): () => NextThemesCompatibility`
Create backward-compatible useTheme hook.

```typescript
const useTheme = nextThemesAdapter.createCompatibleUseTheme();

function Component() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return <div>Current theme: {resolvedTheme}</div>;
}
```

##### `migrateFromNextThemes(): Promise<void>`
Migrate from next-themes to unified system.

```typescript
await nextThemesAdapter.migrateFromNextThemes();
```

##### `needsMigration(): boolean`
Check if migration is needed.

```typescript
if (nextThemesAdapter.needsMigration()) {
  await nextThemesAdapter.migrateFromNextThemes();
}
```

##### `getMigrationStatus()`
Get migration status.

```typescript
const status = nextThemesAdapter.getMigrationStatus();
console.log('Migration complete:', status.migrationComplete);
```

### DomainThemeAdapter

Provides integration with existing domain theme context.

#### Methods

##### `createEnhancedDomainTheme(): () => EnhancedDomainThemeContextValue`
Create enhanced domain theme hook.

```typescript
const useDomainTheme = domainThemeAdapter.createEnhancedDomainTheme();

function Component() {
  const { 
    currentDomain, 
    setCurrentDomain, 
    computedTheme,
    isLoading,
    preloadDomain 
  } = useDomainTheme();
  
  return <div>Current domain: {currentDomain}</div>;
}
```

##### `createCompatibleDomainTheme(): () => LegacyDomainThemeContextValue`
Create backward-compatible domain theme hook.

```typescript
const useDomainTheme = domainThemeAdapter.createCompatibleDomainTheme();
```

##### `migrateDomainThemeState(): Promise<void>`
Migrate domain theme state.

```typescript
await domainThemeAdapter.migrateDomainThemeState();
```

### ComponentIntegrationManager

Handles component integration with unified theme system.

#### Methods

##### `createThemeAwareComponent<P>(Component, name?): ComponentType<P & ThemeAwareProps>`
Create theme-aware component wrapper.

```typescript
const ThemeAwareButton = componentIntegrationManager
  .createThemeAwareComponent(Button, 'Button');

// Usage
<ThemeAwareButton theme={theme} themeMode="dark" domain="cloud">
  Click me
</ThemeAwareButton>
```

##### `createLegacyCompatibilityWrapper<P>(Component, name?): ComponentType<P & LegacyThemeProps>`
Create backward compatibility wrapper.

```typescript
const CompatibleComponent = componentIntegrationManager
  .createLegacyCompatibilityWrapper(MyComponent, 'MyComponent');

// Usage with legacy props
<CompatibleComponent isDark currentDomain="cloud">
  Content
</CompatibleComponent>
```

##### `migrateComponent<P>(Component, name, options?): ComponentType<P>`
Migrate existing component to unified theme.

```typescript
const MigratedComponent = componentIntegrationManager
  .migrateComponent(OriginalComponent, 'MyComponent', {
    preserveLegacyProps: true,
    enablePerformanceOptimizations: true
  });
```

##### `createThemeHook(): () => ThemeHookResult`
Create theme-aware hook for components.

```typescript
const useTheme = componentIntegrationManager.createThemeHook();

function Component() {
  const { 
    theme, 
    isLoading, 
    error, 
    mode, 
    domain, 
    colors 
  } = useTheme();
  
  return <div style={{ color: colors.primary }}>Themed content</div>;
}
```

## React Hooks

### `useUnifiedTheme()`

Main hook for theme access and control.

```typescript
function useUnifiedTheme(): {
  theme: ComputedTheme | null;
  isLoading: boolean;
  error: ThemeError | null;
  setTheme: (config: ThemeConfig) => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
  setDomain: (domain: Domain) => Promise<void>;
  toggleMode: () => Promise<void>;
}
```

**Example:**
```typescript
function ThemeControls() {
  const { theme, setMode, setDomain, toggleMode } = useUnifiedTheme();

  return (
    <div>
      <p>Current: {theme?.mode} mode, {theme?.domain} domain</p>
      <button onClick={() => setMode('dark')}>Dark Mode</button>
      <button onClick={() => setMode('light')}>Light Mode</button>
      <button onClick={toggleMode}>Toggle Mode</button>
      <button onClick={() => setDomain('cloud')}>Cloud Domain</button>
    </div>
  );
}
```

### `useMigrationStatus()`

Monitor migration status from legacy systems.

```typescript
function useMigrationStatus(): {
  nextThemes: NextThemesMigrationStatus;
  domainTheme: DomainThemeMigrationStatus;
  components: ComponentMigrationStatistics;
}
```

**Example:**
```typescript
function MigrationStatus() {
  const status = useMigrationStatus();

  return (
    <div>
      <p>Next-themes migration: {status.nextThemes.migrationComplete ? 'Complete' : 'Pending'}</p>
      <p>Domain theme migration: {status.domainTheme.migrationComplete ? 'Complete' : 'Pending'}</p>
      <p>Component migration: {status.components.migrationProgress}% complete</p>
    </div>
  );
}
```

### `useIntegrationHealth()`

Monitor integration health status.

```typescript
function useIntegrationHealth(): {
  isHealthy: boolean;
  issues: string[];
  warnings: string[];
  recommendations: string[];
  score: number;
}
```

**Example:**
```typescript
function HealthMonitor() {
  const health = useIntegrationHealth();

  return (
    <div>
      <p>Health Score: {health.score}/100</p>
      {health.issues.length > 0 && (
        <div>
          <h4>Issues:</h4>
          <ul>
            {health.issues.map(issue => <li key={issue}>{issue}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## Type Definitions

### Core Types

```typescript
type ThemeMode = 'light' | 'dark' | 'system';
type Domain = 'full-stack' | 'cloud' | 'data' | 'ux-ui' | 'consulting';
type ThemeEventType = 'theme-changed' | 'domain-changed' | 'mode-changed' | 'preferences-changed';
```

### Theme Configuration

```typescript
interface ThemeConfig {
  mode?: ThemeMode;
  domain?: Domain;
  preferences?: Partial<UserThemePreferences>;
  customizations?: ThemeCustomizations;
}

interface UserThemePreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  customizations: ThemeCustomizations;
  autoDetectPreferences: boolean;
}
```

### Computed Theme

```typescript
interface ComputedTheme {
  mode: 'light' | 'dark';
  domain: Domain;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  animations: ThemeAnimations;
  shadows: ThemeShadows;
  cssVariables: Record<string, string>;
  metadata: {
    version: string;
    computedAt: number;
    hash: string;
  };
}
```

### Theme Colors

```typescript
interface ThemeColors {
  // Primary colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Background colors
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;
  backgroundOverlay: string;
  
  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;
  
  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Domain-specific colors
  domainPrimary: string;
  domainSecondary: string;
  domainAccent: string;
  domainGradientStart: string;
  domainGradientEnd: string;
}
```

## Error Handling

### ThemeError

```typescript
interface ThemeError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recovery?: string[];
}
```

### Common Error Codes

- `THEME_INITIALIZATION_FAILED`: Theme engine initialization failed
- `THEME_UPDATE_FAILED`: Theme update operation failed
- `THEME_COMPUTATION_FAILED`: Theme computation failed
- `THEME_APPLICATION_FAILED`: Theme application to DOM failed
- `STATE_UPDATE_FAILED`: State update failed
- `INVALID_THEME_MODE`: Invalid theme mode provided
- `INVALID_DOMAIN`: Invalid domain provided

### Error Recovery

```typescript
// Handle theme errors
if (themeEngine.error) {
  console.error('Theme error:', themeEngine.error);
  
  // Try recovery suggestions
  if (themeEngine.error.recovery) {
    themeEngine.error.recovery.forEach(suggestion => {
      console.log('Recovery suggestion:', suggestion);
    });
  }
  
  // Reset to defaults if needed
  await themeEngine.setTheme({
    mode: 'system',
    domain: 'full-stack'
  });
}
```
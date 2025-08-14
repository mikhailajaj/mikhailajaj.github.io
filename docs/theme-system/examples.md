# Examples

Practical examples and code snippets for using the Unified Theme System.

## Basic Usage Examples

### Simple Theme Toggle

```typescript
import { useUnifiedTheme } from '@/lib/theme';

function ThemeToggle() {
  const { theme, toggleMode, isLoading } = useUnifiedTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <button 
      onClick={toggleMode}
      className={`theme-toggle theme-${theme?.mode}`}
    >
      {theme?.mode === 'dark' ? '☀️' : '🌙'} 
      {theme?.mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

### Domain Selector

```typescript
import { useUnifiedTheme } from '@/lib/theme';

const domains = [
  { id: 'full-stack', name: 'Full-Stack Development', icon: '💻' },
  { id: 'cloud', name: 'Cloud Engineering', icon: '☁️' },
  { id: 'data', name: 'Data Analytics', icon: '📊' },
  { id: 'ux-ui', name: 'UX/UI Design', icon: '🎨' },
  { id: 'consulting', name: 'Technical Consulting', icon: '💡' }
];

function DomainSelector() {
  const { theme, setDomain, isLoading } = useUnifiedTheme();

  return (
    <div className="domain-selector">
      <h3>Select Domain</h3>
      <div className="domain-grid">
        {domains.map(domain => (
          <button
            key={domain.id}
            onClick={() => setDomain(domain.id)}
            disabled={isLoading}
            className={`
              domain-card 
              ${theme?.domain === domain.id ? 'active' : ''}
              domain-${domain.id}
            `}
            style={{
              borderColor: theme?.domain === domain.id 
                ? theme?.colors.domainPrimary 
                : 'transparent'
            }}
          >
            <span className="domain-icon">{domain.icon}</span>
            <span className="domain-name">{domain.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Theme-Aware Card Component

```typescript
import { useUnifiedTheme } from '@/lib/theme';
import { useMemo } from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

function Card({ title, children, variant = 'default', className = '' }: CardProps) {
  const { theme } = useUnifiedTheme();

  const cardStyles = useMemo(() => {
    if (!theme) return {};

    const baseStyles = {
      backgroundColor: theme.colors.backgroundPrimary,
      color: theme.colors.textPrimary,
      borderRadius: '8px',
      padding: '1.5rem',
      transition: theme.animations.transitions.all
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.backgroundElevated,
          boxShadow: theme.shadows.lg,
          border: `1px solid ${theme.colors.borderPrimary}`
        };
      case 'outlined':
        return {
          ...baseStyles,
          border: `2px solid ${theme.colors.domainPrimary}`,
          backgroundColor: 'transparent'
        };
      default:
        return {
          ...baseStyles,
          border: `1px solid ${theme.colors.borderPrimary}`
        };
    }
  }, [theme, variant]);

  return (
    <div 
      className={`card card-${variant} ${className}`}
      style={cardStyles}
    >
      <h3 style={{ 
        color: theme?.colors.domainPrimary,
        marginBottom: '1rem',
        fontSize: theme?.typography.fontSize.lg 
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
```

## Advanced Usage Examples

### Custom Theme Hook

```typescript
import { useUnifiedTheme } from '@/lib/theme';
import { useMemo } from 'react';

function useCustomTheme() {
  const { theme, setTheme, isLoading, error } = useUnifiedTheme();

  const themeUtils = useMemo(() => {
    if (!theme) return null;

    return {
      // Color utilities
      getContrastColor: (backgroundColor: string) => {
        // Simple contrast calculation
        const rgb = backgroundColor.match(/\d+/g);
        if (!rgb) return theme.colors.textPrimary;
        
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        return brightness > 128 ? theme.colors.textPrimary : theme.colors.textInverse;
      },

      // Spacing utilities
      getSpacing: (size: keyof typeof theme.spacing) => theme.spacing[size],
      
      // Animation utilities
      getTransition: (property: string = 'all') => 
        `${property} ${theme.animations.duration.normal} ${theme.animations.easing.easeOut}`,

      // Domain utilities
      getDomainGradient: () => 
        `linear-gradient(135deg, ${theme.colors.domainGradientStart}, ${theme.colors.domainGradientEnd})`,

      // Responsive utilities
      getResponsiveValue: (mobile: string, desktop: string) => 
        window.innerWidth < 768 ? mobile : desktop,

      // Accessibility utilities
      getFocusStyles: () => ({
        outline: `2px solid ${theme.colors.domainPrimary}`,
        outlineOffset: '2px'
      })
    };
  }, [theme]);

  const actions = useMemo(() => ({
    // Quick theme actions
    switchToDark: () => setTheme({ mode: 'dark' }),
    switchToLight: () => setTheme({ mode: 'light' }),
    switchToSystem: () => setTheme({ mode: 'system' }),
    
    // Domain actions
    switchDomain: (domain: string) => setTheme({ domain }),
    
    // Preference actions
    toggleReducedMotion: () => setTheme({
      preferences: {
        reducedMotion: !theme?.animations.duration.fast.includes('0ms')
      }
    }),
    
    setFontSize: (fontSize: 'small' | 'medium' | 'large') => setTheme({
      preferences: { fontSize }
    }),

    // Custom color overrides
    setCustomColors: (colors: Partial<any>) => setTheme({
      customizations: { colors }
    })
  }), [theme, setTheme]);

  return {
    theme,
    themeUtils,
    actions,
    isLoading,
    error,
    // Computed properties
    isDark: theme?.mode === 'dark',
    isLight: theme?.mode === 'light',
    currentDomain: theme?.domain,
    hasReducedMotion: theme?.animations.duration.fast.includes('0ms')
  };
}

// Usage example
function CustomThemedComponent() {
  const { 
    theme, 
    themeUtils, 
    actions, 
    isDark, 
    currentDomain 
  } = useCustomTheme();

  if (!theme || !themeUtils) {
    return <div>Loading theme...</div>;
  }

  return (
    <div style={{
      background: themeUtils.getDomainGradient(),
      padding: themeUtils.getSpacing('lg'),
      borderRadius: '12px',
      transition: themeUtils.getTransition('background')
    }}>
      <h2 style={{ color: themeUtils.getContrastColor(theme.colors.domainPrimary) }}>
        Current Domain: {currentDomain}
      </h2>
      
      <div style={{ marginTop: themeUtils.getSpacing('md') }}>
        <button 
          onClick={actions.switchToDark}
          style={{
            ...themeUtils.getFocusStyles(),
            marginRight: themeUtils.getSpacing('sm')
          }}
        >
          Dark Mode
        </button>
        <button 
          onClick={actions.switchToLight}
          style={themeUtils.getFocusStyles()}
        >
          Light Mode
        </button>
      </div>
    </div>
  );
}
```

### Theme-Aware Form Components

```typescript
import { useUnifiedTheme } from '@/lib/theme';
import { forwardRef } from 'react';

// Theme-aware Input
const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    const { theme } = useUnifiedTheme();

    const inputStyles = {
      backgroundColor: theme?.colors.backgroundPrimary,
      color: theme?.colors.textPrimary,
      border: `1px solid ${theme?.colors.borderPrimary}`,
      borderRadius: '6px',
      padding: '0.75rem',
      fontSize: theme?.typography.fontSize.base,
      transition: theme?.animations.transitions.colors,
      outline: 'none',
      
      // Focus styles
      ':focus': {
        borderColor: theme?.colors.domainPrimary,
        boxShadow: `0 0 0 3px ${theme?.colors.domainPrimary}20`
      }
    };

    return (
      <input
        ref={ref}
        className={`themed-input ${className}`}
        style={inputStyles}
        {...props}
      />
    );
  }
);

// Theme-aware Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const { theme } = useUnifiedTheme();

    const getButtonStyles = () => {
      if (!theme) return {};

      const baseStyles = {
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: theme.typography.fontWeight.medium,
        transition: theme.animations.transitions.all,
        outline: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      };

      const sizeStyles = {
        sm: { padding: '0.5rem 1rem', fontSize: theme.typography.fontSize.sm },
        md: { padding: '0.75rem 1.5rem', fontSize: theme.typography.fontSize.base },
        lg: { padding: '1rem 2rem', fontSize: theme.typography.fontSize.lg }
      };

      const variantStyles = {
        primary: {
          backgroundColor: theme.colors.domainPrimary,
          color: theme.colors.textInverse,
          ':hover': {
            backgroundColor: theme.colors.domainAccent,
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows.md
          }
        },
        secondary: {
          backgroundColor: theme.colors.backgroundSecondary,
          color: theme.colors.textPrimary,
          border: `1px solid ${theme.colors.borderPrimary}`,
          ':hover': {
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.domainPrimary
          }
        },
        outline: {
          backgroundColor: 'transparent',
          color: theme.colors.domainPrimary,
          border: `2px solid ${theme.colors.domainPrimary}`,
          ':hover': {
            backgroundColor: theme.colors.domainPrimary,
            color: theme.colors.textInverse
          }
        },
        ghost: {
          backgroundColor: 'transparent',
          color: theme.colors.domainPrimary,
          ':hover': {
            backgroundColor: `${theme.colors.domainPrimary}10`
          }
        }
      };

      return {
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant]
      };
    };

    return (
      <button
        ref={ref}
        className={`themed-button themed-button-${variant} themed-button-${size} ${className}`}
        style={getButtonStyles()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Usage in a form
function ThemedForm() {
  const { theme, setDomain } = useUnifiedTheme();

  return (
    <form style={{
      backgroundColor: theme?.colors.backgroundPrimary,
      padding: theme?.spacing.lg,
      borderRadius: '12px',
      border: `1px solid ${theme?.colors.borderPrimary}`,
      maxWidth: '400px'
    }}>
      <h2 style={{ 
        color: theme?.colors.domainPrimary,
        marginBottom: theme?.spacing.lg 
      }}>
        Contact Form
      </h2>
      
      <div style={{ marginBottom: theme?.spacing.md }}>
        <label style={{ 
          display: 'block',
          marginBottom: theme?.spacing.sm,
          color: theme?.colors.textSecondary,
          fontSize: theme?.typography.fontSize.sm
        }}>
          Name
        </label>
        <Input placeholder="Enter your name" />
      </div>
      
      <div style={{ marginBottom: theme?.spacing.md }}>
        <label style={{ 
          display: 'block',
          marginBottom: theme?.spacing.sm,
          color: theme?.colors.textSecondary,
          fontSize: theme?.typography.fontSize.sm
        }}>
          Email
        </label>
        <Input type="email" placeholder="Enter your email" />
      </div>
      
      <div style={{ marginBottom: theme?.spacing.lg }}>
        <label style={{ 
          display: 'block',
          marginBottom: theme?.spacing.sm,
          color: theme?.colors.textSecondary,
          fontSize: theme?.typography.fontSize.sm
        }}>
          Domain Interest
        </label>
        <select 
          onChange={(e) => setDomain(e.target.value)}
          style={{
            backgroundColor: theme?.colors.backgroundPrimary,
            color: theme?.colors.textPrimary,
            border: `1px solid ${theme?.colors.borderPrimary}`,
            borderRadius: '6px',
            padding: '0.75rem',
            width: '100%'
          }}
        >
          <option value="full-stack">Full-Stack Development</option>
          <option value="cloud">Cloud Engineering</option>
          <option value="data">Data Analytics</option>
          <option value="ux-ui">UX/UI Design</option>
          <option value="consulting">Technical Consulting</option>
        </select>
      </div>
      
      <div style={{ display: 'flex', gap: theme?.spacing.sm }}>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button variant="outline" type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
```

### Theme Provider with Customization

```typescript
import { ThemeSystemUtils, unifiedThemeSystem } from '@/lib/theme';
import { createContext, useContext, useEffect, useState } from 'react';

// Custom theme context for app-specific features
interface AppThemeContextValue {
  // Theme system
  theme: any;
  setTheme: (config: any) => Promise<void>;
  
  // App-specific features
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  highContrast: boolean;
  toggleHighContrast: () => void;
  
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  
  // Custom color schemes
  customColors: Record<string, string>;
  setCustomColor: (key: string, value: string) => void;
  resetCustomColors: () => void;
}

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState(null);
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [customColors, setCustomColorsState] = useState<Record<string, string>>({});

  // Initialize theme system
  useEffect(() => {
    const initializeTheme = async () => {
      const result = await ThemeSystemUtils.initialize();
      if (result.success) {
        setThemeState(result.currentTheme);
      }
    };

    initializeTheme();

    // Subscribe to theme changes
    const unsubscribe = unifiedThemeSystem.engine.subscribe((event) => {
      if (event.type === 'theme-changed') {
        setThemeState(event.payload.current.computed);
      }
    });

    return unsubscribe;
  }, []);

  // Theme actions
  const setTheme = async (config: any) => {
    await unifiedThemeSystem.engine.setTheme(config);
  };

  const setFontSize = async (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    await setTheme({
      preferences: { fontSize: size }
    });
  };

  const toggleHighContrast = async () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    await setTheme({
      preferences: { highContrast: newValue }
    });
  };

  const toggleReducedMotion = async () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    await setTheme({
      preferences: { reducedMotion: newValue }
    });
  };

  const setCustomColor = async (key: string, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColorsState(newColors);
    await setTheme({
      customizations: {
        colors: newColors
      }
    });
  };

  const resetCustomColors = async () => {
    setCustomColorsState({});
    await setTheme({
      customizations: { colors: {} }
    });
  };

  const contextValue: AppThemeContextValue = {
    theme,
    setTheme,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    customColors,
    setCustomColor,
    resetCustomColors
  };

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return context;
}

// Theme customization panel
function ThemeCustomizationPanel() {
  const {
    theme,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    customColors,
    setCustomColor,
    resetCustomColors
  } = useAppTheme();

  return (
    <div style={{
      backgroundColor: theme?.colors.backgroundElevated,
      padding: theme?.spacing.lg,
      borderRadius: '12px',
      border: `1px solid ${theme?.colors.borderPrimary}`,
      maxWidth: '400px'
    }}>
      <h3 style={{ 
        color: theme?.colors.domainPrimary,
        marginBottom: theme?.spacing.lg 
      }}>
        Theme Customization
      </h3>

      {/* Font Size */}
      <div style={{ marginBottom: theme?.spacing.md }}>
        <label style={{ 
          display: 'block',
          marginBottom: theme?.spacing.sm,
          color: theme?.colors.textSecondary 
        }}>
          Font Size
        </label>
        <select 
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value as any)}
          style={{
            backgroundColor: theme?.colors.backgroundPrimary,
            color: theme?.colors.textPrimary,
            border: `1px solid ${theme?.colors.borderPrimary}`,
            borderRadius: '6px',
            padding: '0.5rem',
            width: '100%'
          }}
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Accessibility Options */}
      <div style={{ marginBottom: theme?.spacing.md }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme?.spacing.sm,
          color: theme?.colors.textPrimary,
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={toggleHighContrast}
            style={{ accentColor: theme?.colors.domainPrimary }}
          />
          High Contrast
        </label>
      </div>

      <div style={{ marginBottom: theme?.spacing.md }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme?.spacing.sm,
          color: theme?.colors.textPrimary,
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={toggleReducedMotion}
            style={{ accentColor: theme?.colors.domainPrimary }}
          />
          Reduced Motion
        </label>
      </div>

      {/* Custom Colors */}
      <div style={{ marginBottom: theme?.spacing.md }}>
        <h4 style={{ 
          color: theme?.colors.textPrimary,
          marginBottom: theme?.spacing.sm 
        }}>
          Custom Colors
        </h4>
        
        <div style={{ display: 'flex', gap: theme?.spacing.sm, marginBottom: theme?.spacing.sm }}>
          <input
            type="color"
            value={customColors.primary || theme?.colors.domainPrimary}
            onChange={(e) => setCustomColor('primary', e.target.value)}
            style={{ width: '40px', height: '40px', border: 'none', borderRadius: '6px' }}
          />
          <span style={{ color: theme?.colors.textSecondary, alignSelf: 'center' }}>
            Primary Color
          </span>
        </div>

        <button
          onClick={resetCustomColors}
          style={{
            backgroundColor: 'transparent',
            color: theme?.colors.domainPrimary,
            border: `1px solid ${theme?.colors.domainPrimary}`,
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer'
          }}
        >
          Reset Colors
        </button>
      </div>
    </div>
  );
}
```

## Migration Examples

### Migrating from next-themes

```typescript
// Before: Using next-themes
import { useTheme } from 'next-themes';

function OldThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {resolvedTheme}
    </button>
  );
}

// After: Using unified theme system
import { useUnifiedTheme } from '@/lib/theme';

function NewThemeToggle() {
  const { theme, toggleMode } = useUnifiedTheme();
  
  return (
    <button onClick={toggleMode}>
      Current: {theme?.mode}
    </button>
  );
}

// Transition: Using compatibility layer
import { nextThemesAdapter } from '@/lib/theme/integration';

const useTheme = nextThemesAdapter.createCompatibleUseTheme();

function TransitionThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {resolvedTheme}
    </button>
  );
}
```

### Migrating Domain Theme Context

```typescript
// Before: Using DomainThemeContext
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';

function OldDomainSelector() {
  const { currentDomain, setCurrentDomain, currentDomainColor } = useDomainTheme();
  
  return (
    <div style={{ color: currentDomainColor }}>
      <select value={currentDomain} onChange={(e) => setCurrentDomain(e.target.value)}>
        <option value="full-stack">Full-Stack</option>
        <option value="cloud">Cloud</option>
      </select>
    </div>
  );
}

// After: Using unified theme system
import { useUnifiedTheme } from '@/lib/theme';

function NewDomainSelector() {
  const { theme, setDomain } = useUnifiedTheme();
  
  return (
    <div style={{ color: theme?.colors.domainPrimary }}>
      <select value={theme?.domain} onChange={(e) => setDomain(e.target.value)}>
        <option value="full-stack">Full-Stack</option>
        <option value="cloud">Cloud</option>
      </select>
    </div>
  );
}

// Enhanced: Using enhanced domain adapter
import { domainThemeAdapter } from '@/lib/theme/integration';

const useDomainTheme = domainThemeAdapter.createEnhancedDomainTheme();

function EnhancedDomainSelector() {
  const { 
    currentDomain, 
    setCurrentDomain, 
    computedTheme,
    isLoading,
    preloadDomain 
  } = useDomainTheme();
  
  return (
    <div style={{ color: computedTheme?.colors.domainPrimary }}>
      {isLoading && <span>Loading...</span>}
      <select 
        value={currentDomain} 
        onChange={(e) => setCurrentDomain(e.target.value)}
      >
        <option 
          value="full-stack"
          onMouseEnter={() => preloadDomain('full-stack')}
        >
          Full-Stack
        </option>
        <option 
          value="cloud"
          onMouseEnter={() => preloadDomain('cloud')}
        >
          Cloud
        </option>
      </select>
    </div>
  );
}
```

### Component Migration

```typescript
// Before: Legacy component with theme props
interface LegacyProps {
  isDark?: boolean;
  currentDomain?: string;
  domainColor?: string;
  children: React.ReactNode;
}

function LegacyComponent({ isDark, currentDomain, domainColor, children }: LegacyProps) {
  return (
    <div 
      className={`${isDark ? 'dark' : 'light'} domain-${currentDomain}`}
      style={{ color: domainColor }}
    >
      {children}
    </div>
  );
}

// After: Theme-aware component
import { componentIntegrationManager } from '@/lib/theme/integration';

interface ModernProps {
  children: React.ReactNode;
}

function ModernComponent({ children }: ModernProps) {
  return <div>{children}</div>;
}

// Make component theme-aware
const ThemeAwareComponent = componentIntegrationManager.createThemeAwareComponent(
  ModernComponent, 
  'ModernComponent'
);

// Migration: Backward compatible component
const MigratedComponent = componentIntegrationManager.migrateComponent(
  LegacyComponent,
  'LegacyComponent',
  {
    preserveLegacyProps: true,
    enablePerformanceOptimizations: true
  }
);

// Usage - both old and new props work during transition
function App() {
  return (
    <div>
      {/* Legacy usage still works */}
      <MigratedComponent isDark currentDomain="cloud" domainColor="#06B6D4">
        Legacy usage
      </MigratedComponent>
      
      {/* New usage with enhanced features */}
      <ThemeAwareComponent>
        Modern usage
      </ThemeAwareComponent>
    </div>
  );
}
```

## Testing Examples

### Theme System Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeSystemUtils, unifiedThemeSystem } from '@/lib/theme';

const ThemeProvider = ThemeSystemUtils.createProvider();

describe('Theme System', () => {
  beforeEach(() => {
    // Reset theme system before each test
    unifiedThemeSystem.engine.clearCache();
  });

  it('should initialize with default theme', async () => {
    function TestComponent() {
      const { theme } = useUnifiedTheme();
      return <div data-testid="theme-mode">{theme?.mode}</div>;
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('system');
    });
  });

  it('should switch theme modes', async () => {
    function TestComponent() {
      const { theme, setMode } = useUnifiedTheme();
      return (
        <div>
          <div data-testid="theme-mode">{theme?.mode}</div>
          <button onClick={() => setMode('dark')}>Dark Mode</button>
        </div>
      );
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Dark Mode'));

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    });
  });

  it('should switch domains', async () => {
    function TestComponent() {
      const { theme, setDomain } = useUnifiedTheme();
      return (
        <div>
          <div data-testid="theme-domain">{theme?.domain}</div>
          <button onClick={() => setDomain('cloud')}>Cloud Domain</button>
        </div>
      );
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Cloud Domain'));

    await waitFor(() => {
      expect(screen.getByTestId('theme-domain')).toHaveTextContent('cloud');
    });
  });

  it('should persist theme across sessions', async () => {
    // Mock localStorage
    const mockStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockStorage });

    function TestComponent() {
      const { setMode } = useUnifiedTheme();
      return <button onClick={() => setMode('dark')}>Dark Mode</button>;
    }

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Dark Mode'));

    await waitFor(() => {
      expect(mockStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('theme-engine'),
        expect.any(String)
      );
    });
  });
});
```

### Component Testing with Themes

```typescript
import { render, screen } from '@testing-library/react';
import { ThemeSystemUtils } from '@/lib/theme';

const ThemeProvider = ThemeSystemUtils.createProvider();

// Mock theme for testing
const mockTheme = {
  mode: 'dark',
  domain: 'cloud',
  colors: {
    primary: '#3B82F6',
    domainPrimary: '#06B6D4',
    textPrimary: '#ffffff',
    backgroundPrimary: '#000000'
  },
  spacing: { md: '1rem', lg: '1.5rem' },
  typography: { fontSize: { base: '1rem' } }
};

// Test utility to render with theme
function renderWithTheme(component: React.ReactElement, theme = mockTheme) {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
}

describe('Themed Components', () => {
  it('should apply theme styles correctly', () => {
    function ThemedComponent() {
      const { theme } = useUnifiedTheme();
      return (
        <div 
          data-testid="themed-element"
          style={{ 
            color: theme?.colors.textPrimary,
            backgroundColor: theme?.colors.backgroundPrimary 
          }}
        >
          Themed content
        </div>
      );
    }

    renderWithTheme(<ThemedComponent />);

    const element = screen.getByTestId('themed-element');
    expect(element).toHaveStyle({
      color: mockTheme.colors.textPrimary,
      backgroundColor: mockTheme.colors.backgroundPrimary
    });
  });

  it('should handle theme loading state', () => {
    function LoadingComponent() {
      const { theme, isLoading } = useUnifiedTheme();
      
      if (isLoading) {
        return <div data-testid="loading">Loading theme...</div>;
      }
      
      return <div data-testid="content">Content loaded</div>;
    }

    renderWithTheme(<LoadingComponent />);

    // Initially should show loading or content based on theme state
    expect(
      screen.getByTestId('loading') || screen.getByTestId('content')
    ).toBeInTheDocument();
  });
});
```

### Performance Testing

```typescript
import { themeEngine, themeComputer } from '@/lib/theme';

describe('Theme Performance', () => {
  it('should have good cache hit rate', async () => {
    // Perform multiple theme computations
    for (let i = 0; i < 10; i++) {
      await themeEngine.setTheme({
        mode: i % 2 === 0 ? 'dark' : 'light',
        domain: 'cloud'
      });
    }

    const metrics = themeComputer.getMetrics();
    expect(metrics.cacheHitRate).toBeGreaterThan(0.5); // At least 50% cache hit rate
  });

  it('should complete theme updates quickly', async () => {
    const startTime = performance.now();
    
    await themeEngine.setTheme({
      mode: 'dark',
      domain: 'cloud'
    });
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(100); // Should complete in less than 100ms
  });

  it('should not have memory leaks', () => {
    const initialCacheSize = themeComputer.getMetrics().cacheSize;
    
    // Perform many operations
    for (let i = 0; i < 100; i++) {
      themeEngine.computeTheme('cloud', 'dark');
    }
    
    const finalCacheSize = themeComputer.getMetrics().cacheSize;
    
    // Cache should not grow indefinitely
    expect(finalCacheSize - initialCacheSize).toBeLessThan(50);
  });
});
```

These examples demonstrate practical usage patterns, migration strategies, and testing approaches for the Unified Theme System. They show how to build theme-aware components, handle complex theming scenarios, and ensure robust testing coverage.
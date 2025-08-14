/**
 * Component Integration System
 * 
 * Provides utilities for updating existing components to use the new unified theme API
 * while maintaining backward compatibility and ensuring smooth migration.
 */

import React, { ComponentType, forwardRef, useEffect, useState } from 'react';
import { themeEngine } from '../core/ThemeEngine';
import { type ComputedTheme, type ThemeMode } from '../core/types';
import { type Domain } from '@/lib/constants/domains';

/**
 * Component integration configuration
 */
interface ComponentIntegrationConfig {
  enableLegacySupport: boolean;
  enablePerformanceOptimizations: boolean;
  enableDebugMode: boolean;
  enableAutomaticMigration: boolean;
}

/**
 * Theme-aware component props
 */
interface ThemeAwareProps {
  theme?: ComputedTheme;
  themeMode?: ThemeMode;
  domain?: Domain;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Legacy theme props (for backward compatibility)
 */
interface LegacyThemeProps {
  isDark?: boolean;
  isLight?: boolean;
  currentDomain?: Domain;
  domainColor?: string;
  themeClasses?: string;
}

/**
 * Component migration status
 */
interface ComponentMigrationStatus {
  isMigrated: boolean;
  hasLegacyProps: boolean;
  usesUnifiedTheme: boolean;
  warnings: string[];
}

/**
 * Component Integration Manager
 * 
 * Handles component integration with unified theme system:
 * - Automatic component migration
 * - Backward compatibility support
 * - Performance optimizations
 * - Theme-aware component creation
 */
export class ComponentIntegrationManager {
  private config: ComponentIntegrationConfig;
  private migratedComponents = new Set<string>();
  private componentRegistry = new Map<string, ComponentType<any>>();

  constructor(config?: Partial<ComponentIntegrationConfig>) {
    this.config = {
      enableLegacySupport: true,
      enablePerformanceOptimizations: true,
      enableDebugMode: false,
      enableAutomaticMigration: true,
      ...config,
    };
  }

  /**
   * Create theme-aware component wrapper
   */
  createThemeAwareComponent<P extends object>(
    Component: ComponentType<P>,
    componentName?: string
  ): ComponentType<P & ThemeAwareProps> {
    const ThemeAwareComponent = forwardRef<any, P & ThemeAwareProps>((props, ref) => {
      const [computedTheme, setComputedTheme] = useState<ComputedTheme | null>(null);
      const [isLoading, setIsLoading] = useState(false);

      // Subscribe to theme changes
      useEffect(() => {
        const unsubscribe = themeEngine.subscribe((event) => {
          if (event.type === 'theme-changed') {
            setComputedTheme(event.payload.current.computed || null);
            setIsLoading(event.payload.current.isLoading || false);
          }
        });

        // Initialize with current theme
        setComputedTheme(themeEngine.currentTheme);
        setIsLoading(themeEngine.isLoading);

        return unsubscribe;
      }, []);

      // Merge theme props
      const themeProps = {
        theme: props.theme || computedTheme,
        themeMode: props.themeMode || computedTheme?.mode,
        domain: props.domain || computedTheme?.domain,
      };

      // Enhanced className with theme classes
      const enhancedClassName = this.enhanceClassName(
        props.className,
        themeProps.theme,
        themeProps.themeMode,
        themeProps.domain
      );

      // Enhanced styles with theme variables
      const enhancedStyle = this.enhanceStyles(
        props.style,
        themeProps.theme
      );

      const enhancedProps = {
        ...props,
        ...themeProps,
        className: enhancedClassName,
        style: enhancedStyle,
      };

      if (this.config.enableDebugMode) {
        console.log(`[ComponentIntegration] Rendering ${componentName || 'Component'} with theme:`, themeProps);
      }

      return React.createElement(Component, { ...enhancedProps, ref });
    });

    ThemeAwareComponent.displayName = `ThemeAware(${componentName || Component.displayName || Component.name})`;

    // Register component
    if (componentName) {
      this.componentRegistry.set(componentName, ThemeAwareComponent);
      this.migratedComponents.add(componentName);
    }

    return ThemeAwareComponent;
  }

  /**
   * Create backward compatibility wrapper
   */
  createLegacyCompatibilityWrapper<P extends object>(
    Component: ComponentType<P>,
    componentName?: string
  ): ComponentType<P & LegacyThemeProps> {
    const CompatibilityWrapper = forwardRef<any, P & LegacyThemeProps>((props, ref) => {
      const [computedTheme, setComputedTheme] = useState<ComputedTheme | null>(null);

      // Subscribe to theme changes
      useEffect(() => {
        const unsubscribe = themeEngine.subscribe((event) => {
          if (event.type === 'theme-changed') {
            setComputedTheme(event.payload.current.computed || null);
          }
        });

        setComputedTheme(themeEngine.currentTheme);
        return unsubscribe;
      }, []);

      // Convert legacy props to new format
      const convertedProps = this.convertLegacyProps(props, computedTheme);

      if (this.config.enableDebugMode && this.hasLegacyProps(props)) {
        console.warn(`[ComponentIntegration] Component ${componentName} using legacy props. Consider migrating.`);
      }

      return React.createElement(Component, { ...convertedProps, ref });
    });

    CompatibilityWrapper.displayName = `LegacyCompatible(${componentName || Component.displayName || Component.name})`;

    return CompatibilityWrapper;
  }

  /**
   * Create migration wrapper for gradual migration
   */
  createMigrationWrapper<P extends object>(
    LegacyComponent: ComponentType<P>,
    NewComponent: ComponentType<P>,
    componentName: string
  ): ComponentType<P> {
    const MigrationWrapper = forwardRef<any, P>((props, ref) => {
      const [useLegacy, setUseLegacy] = useState(true);

      useEffect(() => {
        // Check if component should use new implementation
        const shouldMigrate = this.shouldUseMigratedComponent(componentName, props);
        setUseLegacy(!shouldMigrate);
      }, [props]);

      const ComponentToUse = useLegacy ? LegacyComponent : NewComponent;

      if (this.config.enableDebugMode) {
        console.log(`[ComponentIntegration] ${componentName} using ${useLegacy ? 'legacy' : 'new'} implementation`);
      }

      return React.createElement(ComponentToUse, { ...props, ref });
    });

    MigrationWrapper.displayName = `Migration(${componentName})`;

    return MigrationWrapper;
  }

  /**
   * Update existing component to use unified theme
   */
  migrateComponent<P extends object>(
    Component: ComponentType<P>,
    componentName: string,
    migrationOptions?: {
      preserveLegacyProps?: boolean;
      enablePerformanceOptimizations?: boolean;
    }
  ): ComponentType<P> {
    const options = {
      preserveLegacyProps: true,
      enablePerformanceOptimizations: this.config.enablePerformanceOptimizations,
      ...migrationOptions,
    };

    let MigratedComponent = this.createThemeAwareComponent(Component, componentName);

    if (options.preserveLegacyProps) {
      MigratedComponent = this.createLegacyCompatibilityWrapper(MigratedComponent, componentName);
    }

    // Mark as migrated
    this.migratedComponents.add(componentName);

    if (this.config.enableDebugMode) {
      console.log(`[ComponentIntegration] Migrated component: ${componentName}`);
    }

    return MigratedComponent;
  }

  /**
   * Create theme-aware hook for components
   */
  createThemeHook() {
    return () => {
      const [theme, setTheme] = useState<ComputedTheme | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
        const unsubscribe = themeEngine.subscribe((event) => {
          if (event.type === 'theme-changed') {
            const current = event.payload.current;
            setTheme(current.computed || null);
            setIsLoading(current.isLoading || false);
            setError(current.error?.message || null);
          }
        });

        // Initialize
        setTheme(themeEngine.currentTheme);
        setIsLoading(themeEngine.isLoading);
        setError(themeEngine.error?.message || null);

        return unsubscribe;
      }, []);

      return {
        theme,
        isLoading,
        error,
        mode: theme?.mode,
        domain: theme?.domain,
        colors: theme?.colors,
        typography: theme?.typography,
        spacing: theme?.spacing,
        animations: theme?.animations,
        shadows: theme?.shadows,
        cssVariables: theme?.cssVariables,
      };
    };
  }

  /**
   * Get component migration status
   */
  getComponentMigrationStatus(componentName: string): ComponentMigrationStatus {
    const isMigrated = this.migratedComponents.has(componentName);
    const component = this.componentRegistry.get(componentName);

    return {
      isMigrated,
      hasLegacyProps: false, // Would need to analyze component props
      usesUnifiedTheme: isMigrated,
      warnings: isMigrated ? [] : [`Component ${componentName} not yet migrated to unified theme`],
    };
  }

  /**
   * Get all migrated components
   */
  getMigratedComponents(): string[] {
    return Array.from(this.migratedComponents);
  }

  /**
   * Get migration statistics
   */
  getMigrationStatistics() {
    return {
      totalComponents: this.componentRegistry.size,
      migratedComponents: this.migratedComponents.size,
      migrationProgress: this.componentRegistry.size > 0 
        ? (this.migratedComponents.size / this.componentRegistry.size) * 100 
        : 0,
      pendingMigrations: this.componentRegistry.size - this.migratedComponents.size,
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Enhance className with theme classes
   */
  private enhanceClassName(
    baseClassName?: string,
    theme?: ComputedTheme | null,
    mode?: ThemeMode,
    domain?: Domain
  ): string {
    const classes = [baseClassName || ''];

    if (theme) {
      classes.push(`theme-${theme.mode}`);
      classes.push(`domain-${theme.domain}`);
    } else if (mode && domain) {
      classes.push(`theme-${mode}`);
      classes.push(`domain-${domain}`);
    }

    return classes.filter(Boolean).join(' ');
  }

  /**
   * Enhance styles with theme variables
   */
  private enhanceStyles(
    baseStyle?: React.CSSProperties,
    theme?: ComputedTheme | null
  ): React.CSSProperties {
    const style = { ...baseStyle };

    if (theme?.cssVariables) {
      // Add theme CSS variables as custom properties
      Object.entries(theme.cssVariables).forEach(([property, value]) => {
        (style as any)[property] = value;
      });
    }

    return style;
  }

  /**
   * Convert legacy props to new format
   */
  private convertLegacyProps<P extends LegacyThemeProps>(
    props: P,
    theme: ComputedTheme | null
  ): Omit<P, keyof LegacyThemeProps> & ThemeAwareProps {
    const { isDark, isLight, currentDomain, domainColor, themeClasses, ...restProps } = props;

    // Convert legacy props
    const themeMode = isDark ? 'dark' : isLight ? 'light' : theme?.mode;
    const domain = currentDomain || theme?.domain;

    // Enhance className with legacy theme classes
    const className = [props.className, themeClasses].filter(Boolean).join(' ');

    return {
      ...restProps,
      theme,
      themeMode,
      domain,
      className,
    } as Omit<P, keyof LegacyThemeProps> & ThemeAwareProps;
  }

  /**
   * Check if props contain legacy theme properties
   */
  private hasLegacyProps(props: any): boolean {
    const legacyPropNames = ['isDark', 'isLight', 'currentDomain', 'domainColor', 'themeClasses'];
    return legacyPropNames.some(prop => prop in props);
  }

  /**
   * Determine if component should use migrated version
   */
  private shouldUseMigratedComponent(componentName: string, props: any): boolean {
    // Migration logic - could be based on feature flags, props, etc.
    
    // For now, use migrated version if component is registered as migrated
    if (this.migratedComponents.has(componentName)) {
      return true;
    }

    // Use migrated version if props suggest new API usage
    if (props.theme || props.themeMode || props.domain) {
      return true;
    }

    // Check for migration flag
    if (props.useMigratedTheme === true) {
      return true;
    }

    return false;
  }
}

/**
 * Component integration utilities
 */
export const ComponentIntegrationUtils = {
  /**
   * Analyze component for theme usage
   */
  analyzeComponentThemeUsage(component: ComponentType<any>): {
    usesTheme: boolean;
    themeProps: string[];
    legacyProps: string[];
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    // This would need actual component analysis
    // For now, return placeholder data
    
    return {
      usesTheme: false,
      themeProps: [],
      legacyProps: [],
      recommendations: [
        'Consider migrating to unified theme system',
        'Add theme-aware props for better integration',
      ],
    };
  },

  /**
   * Generate migration guide for component
   */
  generateMigrationGuide(componentName: string): {
    steps: string[];
    codeExamples: { before: string; after: string }[];
    warnings: string[];
  } {
    return {
      steps: [
        `Wrap ${componentName} with createThemeAwareComponent()`,
        'Update props to use theme, themeMode, and domain',
        'Replace legacy theme classes with unified theme classes',
        'Test component with different themes and domains',
        'Remove legacy theme prop handling',
      ],
      codeExamples: [
        {
          before: `const ${componentName} = ({ isDark, currentDomain, ...props }) => {
  const themeClass = isDark ? 'dark' : 'light';
  const domainClass = \`domain-\${currentDomain}\`;
  
  return <div className={\`\${themeClass} \${domainClass}\`} {...props} />;
};`,
          after: `const ${componentName} = ({ theme, className, ...props }) => {
  return <div className={className} {...props} />;
};

export default createThemeAwareComponent(${componentName}, '${componentName}');`,
        },
      ],
      warnings: [
        'Ensure all theme-dependent logic is updated',
        'Test with all supported themes and domains',
        'Verify backward compatibility if needed',
      ],
    };
  },

  /**
   * Validate component theme integration
   */
  validateComponentIntegration(component: ComponentType<any>): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // This would need actual component validation
    // For now, return placeholder validation

    return {
      isValid: issues.length === 0,
      issues,
      suggestions: [
        'Consider adding theme prop types',
        'Add theme-aware styling',
        'Implement responsive theme behavior',
      ],
    };
  },
};

// Export singleton instance
export const componentIntegrationManager = new ComponentIntegrationManager();
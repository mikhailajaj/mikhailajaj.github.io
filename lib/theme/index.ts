/**
 * Unified Theme System
 * 
 * Complete theme system exports providing a unified, performant, and developer-friendly
 * theme management solution for Next.js applications with domain-aware theming.
 */

// Core theme system
export * from './core';

// State management
export * from './state';

// Theme computation
export * from './computation';

// Integration utilities
export * from './integration';

// Main theme system interface
export interface UnifiedThemeSystem {
  // Core engine
  engine: typeof import('./core').themeEngine;
  
  // State management
  stateManager: typeof import('./state').ThemeStateManager;
  validator: typeof import('./state').themeValidator;
  persistence: typeof import('./state').themePersistenceManager;
  
  // Computation
  computer: typeof import('./computation').themeComputer;
  merger: typeof import('./computation').themeMerger;
  
  // Integration
  nextThemesAdapter: typeof import('./integration').nextThemesAdapter;
  domainThemeAdapter: typeof import('./integration').domainThemeAdapter;
  componentIntegration: typeof import('./integration').componentIntegrationManager;
}

// Create unified theme system instance
export const unifiedThemeSystem: UnifiedThemeSystem = {
  // Core
  engine: require('./core').themeEngine,
  
  // State
  stateManager: require('./state').ThemeStateManager,
  validator: require('./state').themeValidator,
  persistence: require('./state').themePersistenceManager,
  
  // Computation
  computer: require('./computation').themeComputer,
  merger: require('./computation').themeMerger,
  
  // Integration
  nextThemesAdapter: require('./integration').nextThemesAdapter,
  domainThemeAdapter: require('./integration').domainThemeAdapter,
  componentIntegration: require('./integration').componentIntegrationManager,
};

// Convenience hooks for React components
export const useUnifiedTheme = () => {
  const React = require('react');
  const [theme, setTheme] = React.useState(unifiedThemeSystem.engine.currentTheme);
  const [isLoading, setIsLoading] = React.useState(unifiedThemeSystem.engine.isLoading);
  const [error, setError] = React.useState(unifiedThemeSystem.engine.error);

  React.useEffect(() => {
    const unsubscribe = unifiedThemeSystem.engine.subscribe((event) => {
      if (event.type === 'theme-changed') {
        const current = event.payload.current;
        setTheme(current.computed || unifiedThemeSystem.engine.currentTheme);
        setIsLoading(current.isLoading || false);
        setError(current.error || null);
      }
    });

    return unsubscribe;
  }, []);

  return {
    theme,
    isLoading,
    error,
    setTheme: unifiedThemeSystem.engine.setTheme.bind(unifiedThemeSystem.engine),
    setMode: unifiedThemeSystem.engine.setMode.bind(unifiedThemeSystem.engine),
    setDomain: unifiedThemeSystem.engine.setDomain.bind(unifiedThemeSystem.engine),
    toggleMode: unifiedThemeSystem.engine.toggleMode.bind(unifiedThemeSystem.engine),
  };
};

// System utilities
export const ThemeSystemUtils = {
  /**
   * Initialize the unified theme system
   */
  async initialize(config?: any) {
    try {
      // Initialize state management
      await unifiedThemeSystem.persistence.loadThemeState();
      
      // Perform migrations if needed
      const migrationResults = await require('./integration').ThemeIntegrationUtils.performCompleteMigration();
      
      // Initialize theme engine with current state
      const currentState = await unifiedThemeSystem.persistence.loadThemeState();
      if (currentState) {
        await unifiedThemeSystem.engine.setTheme({
          mode: currentState.mode,
          domain: currentState.domain,
          preferences: currentState.preferences,
          customizations: currentState.customizations,
        });
      }

      return {
        success: true,
        migrationResults,
        currentTheme: unifiedThemeSystem.engine.currentTheme,
      };
    } catch (error) {
      console.error('[UnifiedThemeSystem] Initialization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  /**
   * Get system health status
   */
  getHealthStatus() {
    const engineMetrics = unifiedThemeSystem.engine.performance;
    const integrationHealth = require('./integration').ThemeIntegrationUtils.validateIntegrationHealth();
    const migrationStatus = require('./integration').ThemeIntegrationUtils.getMigrationStatus();

    return {
      overall: integrationHealth.isHealthy ? 'healthy' : 'needs-attention',
      engine: {
        isLoading: unifiedThemeSystem.engine.isLoading,
        hasError: unifiedThemeSystem.engine.error !== null,
        performance: engineMetrics,
      },
      integration: integrationHealth,
      migration: migrationStatus,
      recommendations: integrationHealth.recommendations,
    };
  },

  /**
   * Create development tools
   */
  createDevTools() {
    return {
      inspector: {
        getCurrentTheme: () => unifiedThemeSystem.engine.currentTheme,
        getPerformanceMetrics: () => unifiedThemeSystem.engine.performance,
        getCacheStatus: () => unifiedThemeSystem.computer.getMetrics(),
        getValidationResults: () => unifiedThemeSystem.validator.validateThemeState(
          unifiedThemeSystem.engine.currentTheme as any
        ),
      },
      debugging: {
        enableDebugMode: () => {
          // Enable debug mode across all systems
          console.log('[UnifiedThemeSystem] Debug mode enabled');
        },
        clearAllCaches: () => {
          unifiedThemeSystem.engine.clearCache();
          unifiedThemeSystem.computer.clearCache();
        },
        resetToDefaults: async () => {
          await unifiedThemeSystem.engine.setTheme({
            mode: 'system',
            domain: 'full-stack',
            preferences: {
              reducedMotion: false,
              highContrast: false,
              fontSize: 'medium',
              customizations: {},
              autoDetectPreferences: true,
            },
            customizations: {},
          });
        },
      },
      migration: {
        checkMigrationStatus: () => require('./integration').ThemeIntegrationUtils.getMigrationStatus(),
        performMigration: () => require('./integration').ThemeIntegrationUtils.performCompleteMigration(),
        generateReport: () => require('./integration').ThemeIntegrationUtils.generateMigrationReport(),
      },
    };
  },

  /**
   * Create theme system provider component
   */
  createProvider() {
    const React = require('react');
    
    return ({ children, config }: { children: React.ReactNode; config?: any }) => {
      const [initialized, setInitialized] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);

      React.useEffect(() => {
        ThemeSystemUtils.initialize(config)
          .then((result) => {
            if (result.success) {
              setInitialized(true);
            } else {
              setError(result.error || 'Initialization failed');
            }
          })
          .catch((err) => {
            setError(err.message || 'Initialization failed');
          });
      }, [config]);

      if (error) {
        return React.createElement('div', {
          className: 'theme-system-error',
          children: `Theme System Error: ${error}`,
        });
      }

      if (!initialized) {
        return React.createElement('div', {
          className: 'theme-system-loading',
          children: 'Initializing theme system...',
        });
      }

      return React.createElement(React.Fragment, { children });
    };
  },
};

// Export default unified theme system
export default unifiedThemeSystem;

// Version information
export const THEME_SYSTEM_VERSION = '1.0.0';
export const THEME_SYSTEM_BUILD = Date.now();

// Feature flags
export const THEME_SYSTEM_FEATURES = {
  UNIFIED_ENGINE: true,
  STATE_MANAGEMENT: true,
  THEME_COMPUTATION: true,
  NEXT_THEMES_INTEGRATION: true,
  DOMAIN_THEME_INTEGRATION: true,
  COMPONENT_INTEGRATION: true,
  PERFORMANCE_MONITORING: true,
  DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;
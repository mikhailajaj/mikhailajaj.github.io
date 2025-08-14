/**
 * Theme Integration System Exports
 * 
 * Centralized exports for theme system integration utilities.
 * Provides adapters and utilities for migrating from existing theme systems.
 */

// Next-themes integration
export { 
  NextThemesAdapter, 
  NextThemesUtils,
  nextThemesAdapter 
} from './NextThemesAdapter';

// Domain theme integration
export { 
  DomainThemeAdapter, 
  DomainThemeUtils,
  domainThemeAdapter 
} from './DomainThemeAdapter';

// Component integration
export { 
  ComponentIntegrationManager, 
  ComponentIntegrationUtils,
  componentIntegrationManager 
} from './ComponentIntegration';

// Integration utilities
export const ThemeIntegrationUtils = {
  /**
   * Check overall migration status
   */
  getMigrationStatus: () => ({
    nextThemes: nextThemesAdapter.getMigrationStatus(),
    domainTheme: domainThemeAdapter.getDomainMigrationStatus(),
    components: componentIntegrationManager.getMigrationStatistics(),
  }),

  /**
   * Perform complete migration
   */
  performCompleteMigration: async () => {
    const results = {
      nextThemes: { success: false, error: null as string | null },
      domainTheme: { success: false, error: null as string | null },
      components: { success: false, error: null as string | null },
    };

    // Migrate next-themes
    try {
      await nextThemesAdapter.migrateFromNextThemes();
      results.nextThemes.success = true;
    } catch (error) {
      results.nextThemes.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Migrate domain theme
    try {
      await domainThemeAdapter.migrateDomainThemeState();
      results.domainTheme.success = true;
    } catch (error) {
      results.domainTheme.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Component migration is handled per-component
    results.components.success = true;

    return results;
  },

  /**
   * Create complete migration wrapper
   */
  createMigrationWrapper: () => {
    const NextThemesMigration = nextThemesAdapter.createMigrationWrapper();
    const DomainMigration = domainThemeAdapter.createDomainMigrationWrapper();

    return ({ children }: { children: React.ReactNode }) => (
      <NextThemesMigration>
        <DomainMigration>
          {children}
        </DomainMigration>
      </NextThemesMigration>
    );
  },

  /**
   * Generate migration report
   */
  generateMigrationReport: () => {
    const nextThemesReport = NextThemesUtils.createMigrationReport();
    const domainReport = DomainThemeUtils.createDomainMigrationReport();
    const componentStats = componentIntegrationManager.getMigrationStatistics();

    return {
      summary: {
        totalIssues: nextThemesReport.conflicts.length + domainReport.conflicts.length,
        migrationProgress: componentStats.migrationProgress,
        recommendedActions: [
          ...nextThemesReport.recommendations,
          ...domainReport.recommendations,
        ],
      },
      nextThemes: nextThemesReport,
      domainTheme: domainReport,
      components: componentStats,
      timestamp: Date.now(),
    };
  },

  /**
   * Validate integration health
   */
  validateIntegrationHealth: () => {
    const issues: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    // Check next-themes integration
    const nextThemesStatus = nextThemesAdapter.getMigrationStatus();
    if (nextThemesStatus.needsMigration) {
      issues.push('Next-themes migration pending');
      recommendations.push('Run next-themes migration');
    }

    // Check domain theme integration
    const domainStatus = domainThemeAdapter.getDomainMigrationStatus();
    if (domainStatus.needsMigration) {
      issues.push('Domain theme migration pending');
      recommendations.push('Run domain theme migration');
    }

    // Check component integration
    const componentStats = componentIntegrationManager.getMigrationStatistics();
    if (componentStats.migrationProgress < 100) {
      warnings.push(`${componentStats.pendingMigrations} components pending migration`);
      recommendations.push('Migrate remaining components to unified theme system');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      warnings,
      recommendations,
      score: Math.max(0, 100 - (issues.length * 20) - (warnings.length * 10)),
    };
  },

  /**
   * Create integration monitoring hook
   */
  createIntegrationMonitor: () => {
    return () => {
      const [status, setStatus] = React.useState(() => 
        ThemeIntegrationUtils.validateIntegrationHealth()
      );

      React.useEffect(() => {
        const interval = setInterval(() => {
          setStatus(ThemeIntegrationUtils.validateIntegrationHealth());
        }, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
      }, []);

      return status;
    };
  },

  /**
   * Clean up legacy data after migration
   */
  cleanupLegacyData: () => {
    try {
      // Clean up next-themes data
      if (typeof window !== 'undefined') {
        const nextThemesKeys = ['theme', 'theme-storage'];
        nextThemesKeys.forEach(key => {
          if (localStorage.getItem('theme-migration-complete')) {
            localStorage.removeItem(key);
          }
        });
      }

      // Clean up domain theme data
      DomainThemeUtils.cleanupLegacyData();

      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  /**
   * Create backward compatibility layer
   */
  createBackwardCompatibilityLayer: () => {
    const useTheme = nextThemesAdapter.createCompatibleUseTheme();
    const useDomainTheme = domainThemeAdapter.createCompatibleDomainTheme();
    const useDomainStyling = domainThemeAdapter.createDomainStyling();
    const useThemeHook = componentIntegrationManager.createThemeHook();

    return {
      useTheme,
      useDomainTheme,
      useDomainStyling,
      useUnifiedTheme: useThemeHook,
    };
  },
};

// Migration hooks
export const useMigrationStatus = () => {
  const [status, setStatus] = React.useState(() => 
    ThemeIntegrationUtils.getMigrationStatus()
  );

  React.useEffect(() => {
    const checkStatus = () => {
      setStatus(ThemeIntegrationUtils.getMigrationStatus());
    };

    // Check status periodically
    const interval = setInterval(checkStatus, 10000); // Every 10 seconds

    // Listen for migration events
    const unsubscribeNextThemes = nextThemesAdapter.onMigrationComplete(checkStatus);
    const unsubscribeDomain = domainThemeAdapter.onDomainMigrationComplete(checkStatus);

    return () => {
      clearInterval(interval);
      unsubscribeNextThemes();
      unsubscribeDomain();
    };
  }, []);

  return status;
};

export const useIntegrationHealth = ThemeIntegrationUtils.createIntegrationMonitor();

// Constants
export const THEME_INTEGRATION_CONSTANTS = {
  // Migration phases
  MIGRATION_PHASES: {
    NOT_STARTED: 'not-started',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },

  // Integration types
  INTEGRATION_TYPES: {
    NEXT_THEMES: 'next-themes',
    DOMAIN_THEME: 'domain-theme',
    COMPONENT: 'component',
  },

  // Health scores
  HEALTH_SCORES: {
    EXCELLENT: 90,
    GOOD: 70,
    FAIR: 50,
    POOR: 30,
  },

  // Migration priorities
  MIGRATION_PRIORITIES: {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  },

  // Storage keys
  STORAGE_KEYS: {
    NEXT_THEMES_MIGRATION: 'theme-migration-complete',
    DOMAIN_MIGRATION: 'domain-theme-migration-complete',
    COMPONENT_MIGRATION: 'component-migration-status',
  },
} as const;
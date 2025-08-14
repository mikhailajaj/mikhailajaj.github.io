/**
 * Next-Themes Integration Adapter
 * 
 * Provides seamless migration from next-themes to the unified theme engine
 * while maintaining backward compatibility and preserving existing functionality.
 */

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState, useCallback } from 'react';
import { themeEngine } from '../core/ThemeEngine';
import { type ThemeMode, type ComputedTheme } from '../core/types';

/**
 * Next-themes compatibility interface
 */
interface NextThemesCompatibility {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  themes: string[];
  systemTheme: string | undefined;
  forcedTheme: string | undefined;
}

/**
 * Migration configuration
 */
interface MigrationConfig {
  enableBackwardCompatibility: boolean;
  preserveNextThemesAPI: boolean;
  enableAutomaticMigration: boolean;
  enableDebugMode: boolean;
}

/**
 * Next-Themes Adapter Class
 * 
 * Provides integration with next-themes while migrating to unified theme engine:
 * - Backward compatibility with existing next-themes usage
 * - Automatic migration of theme state
 * - Preservation of existing API surface
 * - Gradual migration path
 */
export class NextThemesAdapter {
  private config: MigrationConfig;
  private isInitialized = false;
  private migrationListeners: Set<() => void> = new Set();

  constructor(config?: Partial<MigrationConfig>) {
    this.config = {
      enableBackwardCompatibility: true,
      preserveNextThemesAPI: true,
      enableAutomaticMigration: true,
      enableDebugMode: false,
      ...config,
    };

    if (this.config.enableAutomaticMigration) {
      this.initializeAutomaticMigration();
    }
  }

  /**
   * Create backward-compatible useTheme hook
   */
  createCompatibleUseTheme() {
    return (): NextThemesCompatibility => {
      const nextThemes = useNextTheme();
      const [unifiedTheme, setUnifiedTheme] = useState<ComputedTheme | null>(null);

      // Sync with unified theme engine
      useEffect(() => {
        const unsubscribe = themeEngine.subscribe((event) => {
          if (event.type === 'theme-changed') {
            setUnifiedTheme(event.payload.current.computed || null);
          }
        });

        // Initialize with current theme
        setUnifiedTheme(themeEngine.currentTheme);

        return unsubscribe;
      }, []);

      // Enhanced setTheme that updates both systems
      const enhancedSetTheme = useCallback((theme: string) => {
        // Update next-themes
        nextThemes.setTheme(theme);

        // Update unified theme engine
        if (['light', 'dark', 'system'].includes(theme)) {
          themeEngine.setMode(theme as ThemeMode);
        }

        if (this.config.enableDebugMode) {
          console.log('[NextThemesAdapter] Theme updated:', theme);
        }
      }, [nextThemes.setTheme]);

      return {
        theme: nextThemes.theme,
        setTheme: enhancedSetTheme,
        resolvedTheme: nextThemes.resolvedTheme,
        themes: nextThemes.themes || ['light', 'dark', 'system'],
        systemTheme: nextThemes.systemTheme,
        forcedTheme: nextThemes.forcedTheme,
      };
    };
  }

  /**
   * Migrate existing next-themes state to unified engine
   */
  async migrateFromNextThemes(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Get current next-themes state
      const currentTheme = localStorage.getItem('theme');
      
      if (currentTheme && ['light', 'dark', 'system'].includes(currentTheme)) {
        await themeEngine.setMode(currentTheme as ThemeMode);
        
        if (this.config.enableDebugMode) {
          console.log('[NextThemesAdapter] Migrated theme from next-themes:', currentTheme);
        }
      }

      // Mark migration as complete
      localStorage.setItem('theme-migration-complete', 'true');
      
      // Notify listeners
      this.migrationListeners.forEach(listener => listener());

    } catch (error) {
      console.error('[NextThemesAdapter] Migration failed:', error);
    }
  }

  /**
   * Check if migration is needed
   */
  needsMigration(): boolean {
    if (typeof window === 'undefined') return false;
    
    const migrationComplete = localStorage.getItem('theme-migration-complete');
    const hasNextThemesData = localStorage.getItem('theme') !== null;
    
    return !migrationComplete && hasNextThemesData;
  }

  /**
   * Create migration wrapper component
   */
  createMigrationWrapper() {
    return ({ children }: { children: React.ReactNode }) => {
      const [migrationComplete, setMigrationComplete] = useState(false);

      useEffect(() => {
        const performMigration = async () => {
          if (this.needsMigration()) {
            await this.migrateFromNextThemes();
          }
          setMigrationComplete(true);
        };

        performMigration();
      }, []);

      // Show loading state during migration if needed
      if (!migrationComplete && this.needsMigration()) {
        return (
          <div className="theme-migration-loading">
            <div>Migrating theme settings...</div>
          </div>
        );
      }

      return <>{children}</>;
    };
  }

  /**
   * Create theme synchronization hook
   */
  createSyncHook() {
    return () => {
      const nextThemes = useNextTheme();

      useEffect(() => {
        // Sync next-themes changes to unified engine
        const handleNextThemeChange = async () => {
          if (nextThemes.resolvedTheme && ['light', 'dark'].includes(nextThemes.resolvedTheme)) {
            await themeEngine.setMode(nextThemes.resolvedTheme as ThemeMode);
          }
        };

        handleNextThemeChange();
      }, [nextThemes.resolvedTheme]);

      useEffect(() => {
        // Sync unified engine changes to next-themes
        const unsubscribe = themeEngine.subscribe((event) => {
          if (event.type === 'mode-changed') {
            const newMode = event.payload.current.mode;
            if (newMode && nextThemes.theme !== newMode) {
              nextThemes.setTheme(newMode);
            }
          }
        });

        return unsubscribe;
      }, [nextThemes.setTheme]);
    };
  }

  /**
   * Get migration status
   */
  getMigrationStatus() {
    return {
      isInitialized: this.isInitialized,
      needsMigration: this.needsMigration(),
      migrationComplete: typeof window !== 'undefined' 
        ? localStorage.getItem('theme-migration-complete') === 'true'
        : false,
      config: this.config,
    };
  }

  /**
   * Subscribe to migration events
   */
  onMigrationComplete(callback: () => void): () => void {
    this.migrationListeners.add(callback);
    
    return () => {
      this.migrationListeners.delete(callback);
    };
  }

  /**
   * Force migration reset (for testing)
   */
  resetMigration(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('theme-migration-complete');
    }
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Initialize automatic migration
   */
  private initializeAutomaticMigration(): void {
    if (typeof window === 'undefined') return;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.performAutomaticMigration();
      });
    } else {
      this.performAutomaticMigration();
    }
  }

  /**
   * Perform automatic migration
   */
  private async performAutomaticMigration(): Promise<void> {
    try {
      if (this.needsMigration()) {
        await this.migrateFromNextThemes();
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('[NextThemesAdapter] Automatic migration failed:', error);
      this.isInitialized = true; // Continue even if migration fails
    }
  }
}

/**
 * Utility functions for next-themes integration
 */
export const NextThemesUtils = {
  /**
   * Check if next-themes is installed
   */
  isNextThemesInstalled(): boolean {
    try {
      require('next-themes');
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get next-themes version
   */
  getNextThemesVersion(): string | null {
    try {
      const pkg = require('next-themes/package.json');
      return pkg.version;
    } catch {
      return null;
    }
  },

  /**
   * Create compatibility shim
   */
  createCompatibilityShim() {
    return {
      useTheme: () => {
        console.warn('[NextThemesAdapter] Using compatibility shim. Consider migrating to unified theme engine.');
        
        return {
          theme: 'light',
          setTheme: () => {},
          resolvedTheme: 'light',
          themes: ['light', 'dark', 'system'],
          systemTheme: 'light',
          forcedTheme: undefined,
        };
      },
    };
  },

  /**
   * Validate next-themes configuration
   */
  validateConfiguration(config: any): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!config) {
      issues.push('No next-themes configuration found');
      return { valid: false, issues };
    }

    // Check for common configuration issues
    if (config.attribute && config.attribute !== 'class' && config.attribute !== 'data-theme') {
      issues.push(`Unusual attribute configuration: ${config.attribute}`);
    }

    if (config.storageKey && config.storageKey !== 'theme') {
      issues.push(`Custom storage key may cause migration issues: ${config.storageKey}`);
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },

  /**
   * Create migration report
   */
  createMigrationReport(): {
    nextThemesData: any;
    unifiedEngineData: any;
    conflicts: string[];
    recommendations: string[];
  } {
    const conflicts: string[] = [];
    const recommendations: string[] = [];

    // Get next-themes data
    const nextThemesData = typeof window !== 'undefined' ? {
      theme: localStorage.getItem('theme'),
      systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    } : null;

    // Get unified engine data
    const unifiedEngineData = {
      mode: themeEngine.mode,
      domain: themeEngine.domain,
      isLoading: themeEngine.isLoading,
    };

    // Check for conflicts
    if (nextThemesData?.theme && nextThemesData.theme !== unifiedEngineData.mode) {
      conflicts.push(`Theme mode mismatch: next-themes=${nextThemesData.theme}, unified=${unifiedEngineData.mode}`);
    }

    // Generate recommendations
    if (conflicts.length > 0) {
      recommendations.push('Run migration to sync theme states');
    }

    if (nextThemesData?.theme) {
      recommendations.push('Consider removing next-themes dependency after migration');
    }

    return {
      nextThemesData: nextThemesData || {},
      unifiedEngineData,
      conflicts,
      recommendations,
    };
  },
};

// Export singleton instance
export const nextThemesAdapter = new NextThemesAdapter();
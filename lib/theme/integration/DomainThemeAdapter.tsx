/**
 * Domain Theme Context Integration Adapter
 * 
 * Provides seamless integration with existing DomainThemeContext while
 * migrating to the unified theme engine with backward compatibility.
 */

import { useContext, useEffect, useState, useCallback } from 'react';
import { type Domain } from '@/lib/constants/domains';
import { themeEngine } from '../core/ThemeEngine';
import { type ComputedTheme } from '../core/types';

/**
 * Legacy domain theme context value (for compatibility)
 */
interface LegacyDomainThemeContextValue {
  currentDomain: Domain;
  setCurrentDomain: (domain: Domain) => void;
  getDomainConfig: (domain: Domain) => any;
  getDomainColor: (domain: Domain) => string;
  currentDomainConfig: any;
  currentDomainColor: string;
  applyDomainTheme: (domain: Domain) => void;
  getDomainCSSVariables: (domain: Domain) => Record<string, string>;
  isDomainActive: (domain: Domain) => boolean;
}

/**
 * Enhanced domain theme context value
 */
interface EnhancedDomainThemeContextValue extends LegacyDomainThemeContextValue {
  // Enhanced features
  computedTheme: ComputedTheme | null;
  isLoading: boolean;
  error: string | null;
  
  // Performance features
  preloadDomain: (domain: Domain) => Promise<void>;
  clearCache: () => void;
  
  // Migration features
  migrationStatus: {
    isComplete: boolean;
    hasLegacyData: boolean;
  };
}

/**
 * Domain theme adapter configuration
 */
interface DomainAdapterConfig {
  enableBackwardCompatibility: boolean;
  enableEnhancedFeatures: boolean;
  enableAutomaticMigration: boolean;
  enablePerformanceOptimizations: boolean;
  enableDebugMode: boolean;
}

/**
 * Domain Theme Adapter Class
 * 
 * Provides integration between legacy DomainThemeContext and unified theme engine:
 * - Backward compatibility with existing domain theme usage
 * - Enhanced features through unified theme engine
 * - Automatic migration of domain state
 * - Performance optimizations
 */
export class DomainThemeAdapter {
  private config: DomainAdapterConfig;
  private legacyContext: any = null;
  private migrationListeners: Set<() => void> = new Set();

  constructor(config?: Partial<DomainAdapterConfig>) {
    this.config = {
      enableBackwardCompatibility: true,
      enableEnhancedFeatures: true,
      enableAutomaticMigration: true,
      enablePerformanceOptimizations: true,
      enableDebugMode: false,
      ...config,
    };
  }

  /**
   * Create enhanced domain theme hook
   */
  createEnhancedDomainTheme() {
    return (): EnhancedDomainThemeContextValue => {
      const [currentDomain, setCurrentDomainState] = useState<Domain>('full-stack');
      const [computedTheme, setComputedTheme] = useState<ComputedTheme | null>(null);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // Sync with unified theme engine
      useEffect(() => {
        const unsubscribe = themeEngine.subscribe((event) => {
          if (event.type === 'domain-changed' || event.type === 'theme-changed') {
            const current = event.payload.current;
            
            if (current.domain && current.domain !== currentDomain) {
              setCurrentDomainState(current.domain);
            }
            
            if (current.computed) {
              setComputedTheme(current.computed);
            }
            
            if (current.error) {
              setError(current.error.message);
            } else {
              setError(null);
            }
            
            setIsLoading(current.isLoading || false);
          }
        });

        // Initialize with current state
        setCurrentDomainState(themeEngine.domain);
        setComputedTheme(themeEngine.currentTheme);
        setIsLoading(themeEngine.isLoading);
        setError(themeEngine.error?.message || null);

        return unsubscribe;
      }, [currentDomain]);

      // Enhanced setCurrentDomain
      const setCurrentDomain = useCallback(async (domain: Domain) => {
        try {
          setIsLoading(true);
          setError(null);
          
          await themeEngine.setDomain(domain);
          
          if (this.config.enableDebugMode) {
            console.log('[DomainThemeAdapter] Domain updated:', domain);
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to set domain';
          setError(errorMessage);
          console.error('[DomainThemeAdapter] Failed to set domain:', err);
        } finally {
          setIsLoading(false);
        }
      }, []);

      // Legacy compatibility methods
      const getDomainConfig = useCallback((domain: Domain) => {
        // Return legacy-compatible domain config
        return this.getLegacyDomainConfig(domain);
      }, []);

      const getDomainColor = useCallback((domain: Domain) => {
        return this.getLegacyDomainColor(domain);
      }, []);

      const currentDomainConfig = getDomainConfig(currentDomain);
      const currentDomainColor = getDomainColor(currentDomain);

      const applyDomainTheme = useCallback((domain: Domain) => {
        // Legacy method - now handled by unified engine
        setCurrentDomain(domain);
      }, [setCurrentDomain]);

      const getDomainCSSVariables = useCallback((domain: Domain) => {
        return this.getLegacyDomainCSSVariables(domain);
      }, []);

      const isDomainActive = useCallback((domain: Domain) => {
        return currentDomain === domain;
      }, [currentDomain]);

      // Enhanced features
      const preloadDomain = useCallback(async (domain: Domain) => {
        if (this.config.enablePerformanceOptimizations) {
          await themeEngine.preloadThemes([domain]);
        }
      }, []);

      const clearCache = useCallback(() => {
        if (this.config.enablePerformanceOptimizations) {
          themeEngine.clearCache();
        }
      }, []);

      const migrationStatus = {
        isComplete: this.isMigrationComplete(),
        hasLegacyData: this.hasLegacyData(),
      };

      return {
        // Legacy API
        currentDomain,
        setCurrentDomain,
        getDomainConfig,
        getDomainColor,
        currentDomainConfig,
        currentDomainColor,
        applyDomainTheme,
        getDomainCSSVariables,
        isDomainActive,
        
        // Enhanced features
        computedTheme,
        isLoading,
        error,
        preloadDomain,
        clearCache,
        migrationStatus,
      };
    };
  }

  /**
   * Create backward-compatible domain theme hook
   */
  createCompatibleDomainTheme() {
    return (): LegacyDomainThemeContextValue => {
      const enhanced = this.createEnhancedDomainTheme()();
      
      // Return only legacy API
      return {
        currentDomain: enhanced.currentDomain,
        setCurrentDomain: enhanced.setCurrentDomain,
        getDomainConfig: enhanced.getDomainConfig,
        getDomainColor: enhanced.getDomainColor,
        currentDomainConfig: enhanced.currentDomainConfig,
        currentDomainColor: enhanced.currentDomainColor,
        applyDomainTheme: enhanced.applyDomainTheme,
        getDomainCSSVariables: enhanced.getDomainCSSVariables,
        isDomainActive: enhanced.isDomainActive,
      };
    };
  }

  /**
   * Migrate existing domain theme state
   */
  async migrateDomainThemeState(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Check for existing domain theme data
      const savedDomain = localStorage.getItem('portfolio-current-domain');
      
      if (savedDomain && this.isValidDomain(savedDomain)) {
        await themeEngine.setDomain(savedDomain as Domain);
        
        if (this.config.enableDebugMode) {
          console.log('[DomainThemeAdapter] Migrated domain from legacy storage:', savedDomain);
        }
      }

      // Mark migration as complete
      localStorage.setItem('domain-theme-migration-complete', 'true');
      
      // Notify listeners
      this.migrationListeners.forEach(listener => listener());

    } catch (error) {
      console.error('[DomainThemeAdapter] Domain migration failed:', error);
    }
  }

  /**
   * Create migration wrapper for domain theme
   */
  createDomainMigrationWrapper() {
    return ({ children }: { children: React.ReactNode }) => {
      const [migrationComplete, setMigrationComplete] = useState(false);

      useEffect(() => {
        const performMigration = async () => {
          if (this.needsDomainMigration()) {
            await this.migrateDomainThemeState();
          }
          setMigrationComplete(true);
        };

        performMigration();
      }, []);

      if (!migrationComplete && this.needsDomainMigration()) {
        return (
          <div className="domain-migration-loading">
            <div>Migrating domain settings...</div>
          </div>
        );
      }

      return <>{children}</>;
    };
  }

  /**
   * Create domain styling hook (legacy compatibility)
   */
  createDomainStyling() {
    return (domain?: Domain) => {
      const { currentDomain, getDomainColor, getDomainCSSVariables } = this.createCompatibleDomainTheme()();
      const targetDomain = domain || currentDomain;

      const getThemeClasses = useCallback((baseClasses: string = '') => {
        return `${baseClasses} domain-${targetDomain}`.trim();
      }, [targetDomain]);

      const getThemeStyles = useCallback((baseStyles: React.CSSProperties = {}) => {
        const domainColor = getDomainColor(targetDomain);
        return {
          ...baseStyles,
          '--domain-color': domainColor,
        } as React.CSSProperties;
      }, [targetDomain, getDomainColor]);

      const domainColor = getDomainColor(targetDomain);
      const cssVariables = getDomainCSSVariables(targetDomain);

      return {
        domain: targetDomain,
        domainColor,
        cssVariables,
        getThemeClasses,
        getThemeStyles,
      };
    };
  }

  /**
   * Get migration status
   */
  getDomainMigrationStatus() {
    return {
      needsMigration: this.needsDomainMigration(),
      migrationComplete: this.isMigrationComplete(),
      hasLegacyData: this.hasLegacyData(),
      config: this.config,
    };
  }

  /**
   * Subscribe to migration events
   */
  onDomainMigrationComplete(callback: () => void): () => void {
    this.migrationListeners.add(callback);
    
    return () => {
      this.migrationListeners.delete(callback);
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Check if domain migration is needed
   */
  private needsDomainMigration(): boolean {
    if (typeof window === 'undefined') return false;
    
    const migrationComplete = localStorage.getItem('domain-theme-migration-complete');
    const hasLegacyData = localStorage.getItem('portfolio-current-domain') !== null;
    
    return !migrationComplete && hasLegacyData;
  }

  /**
   * Check if migration is complete
   */
  private isMigrationComplete(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('domain-theme-migration-complete') === 'true';
  }

  /**
   * Check if legacy data exists
   */
  private hasLegacyData(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('portfolio-current-domain') !== null;
  }

  /**
   * Validate domain
   */
  private isValidDomain(domain: string): boolean {
    const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];
    return validDomains.includes(domain);
  }

  /**
   * Get legacy domain config
   */
  private getLegacyDomainConfig(domain: Domain): any {
    // Return legacy-compatible config structure
    const domainConfigs = {
      'full-stack': {
        id: 'full-stack',
        name: 'Full-Stack Development',
        shortName: 'Full-Stack',
        path: '/full-stack',
        color: '#3B82F6',
        description: 'End-to-end web applications'
      },
      'cloud': {
        id: 'cloud',
        name: 'Cloud Engineering',
        shortName: 'Cloud',
        path: '/cloud-engineering',
        color: '#06B6D4',
        description: 'AWS infrastructure and DevOps'
      },
      'data': {
        id: 'data',
        name: 'Data Analytics',
        shortName: 'Data',
        path: '/data-analytics',
        color: '#8B5CF6',
        description: 'ML and business intelligence'
      },
      'ux-ui': {
        id: 'ux-ui',
        name: 'UX/UI Design',
        shortName: 'UX/UI',
        path: '/ux-ui-design',
        color: '#EC4899',
        description: 'User experience design'
      },
      'consulting': {
        id: 'consulting',
        name: 'Technical Consulting',
        shortName: 'Consulting',
        path: '/technical-consulting',
        color: '#F97316',
        description: 'Strategic technology guidance'
      }
    };

    return domainConfigs[domain];
  }

  /**
   * Get legacy domain color
   */
  private getLegacyDomainColor(domain: Domain): string {
    const colors = {
      'full-stack': '#3B82F6',
      'cloud': '#06B6D4',
      'data': '#8B5CF6',
      'ux-ui': '#EC4899',
      'consulting': '#F97316',
    };

    return colors[domain] || '#3B82F6';
  }

  /**
   * Get legacy domain CSS variables
   */
  private getLegacyDomainCSSVariables(domain: Domain): Record<string, string> {
    const config = this.getLegacyDomainConfig(domain);
    
    return {
      '--domain-primary': config.color,
      '--domain-secondary': config.color,
      '--domain-accent': config.color,
      '--domain-gradient-start': config.color,
      '--domain-gradient-end': config.color,
      '--domain-gradient': `linear-gradient(135deg, ${config.color}, ${config.color})`,
      '--domain-pattern': 'none',
    };
  }
}

/**
 * Domain theme integration utilities
 */
export const DomainThemeUtils = {
  /**
   * Check if legacy domain theme context exists
   */
  hasLegacyDomainContext(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check if legacy context data exists
    return localStorage.getItem('portfolio-current-domain') !== null;
  },

  /**
   * Get legacy domain data
   */
  getLegacyDomainData(): { domain: Domain | null; timestamp: number | null } {
    if (typeof window === 'undefined') {
      return { domain: null, timestamp: null };
    }

    const domain = localStorage.getItem('portfolio-current-domain') as Domain | null;
    const timestamp = localStorage.getItem('portfolio-domain-timestamp');
    
    return {
      domain,
      timestamp: timestamp ? parseInt(timestamp, 10) : null,
    };
  },

  /**
   * Clean up legacy domain data
   */
  cleanupLegacyData(): void {
    if (typeof window === 'undefined') return;

    const legacyKeys = [
      'portfolio-current-domain',
      'portfolio-domain-timestamp',
      'domain-theme-cache',
    ];

    legacyKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  },

  /**
   * Create domain migration report
   */
  createDomainMigrationReport(): {
    legacyData: any;
    unifiedData: any;
    conflicts: string[];
    recommendations: string[];
  } {
    const conflicts: string[] = [];
    const recommendations: string[] = [];

    const legacyData = this.getLegacyDomainData();
    const unifiedData = {
      domain: themeEngine.domain,
      isLoading: themeEngine.isLoading,
      error: themeEngine.error,
    };

    // Check for conflicts
    if (legacyData.domain && legacyData.domain !== unifiedData.domain) {
      conflicts.push(`Domain mismatch: legacy=${legacyData.domain}, unified=${unifiedData.domain}`);
    }

    // Generate recommendations
    if (conflicts.length > 0) {
      recommendations.push('Run domain migration to sync states');
    }

    if (legacyData.domain) {
      recommendations.push('Consider removing legacy domain storage after migration');
    }

    return {
      legacyData,
      unifiedData,
      conflicts,
      recommendations,
    };
  },
};

// Export singleton instance
export const domainThemeAdapter = new DomainThemeAdapter();
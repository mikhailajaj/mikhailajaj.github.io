/**
 * Theme Computation System Exports
 * 
 * Centralized exports for the theme computation system.
 * Provides theme computation, merging, and optimization utilities.
 */

// Core computation
export { ThemeComputer, themeComputer } from './ThemeComputer';

// Merging and inheritance
export { 
  ThemeMerger, 
  ThemeInheritanceUtils,
  themeMerger,
  type MergeStrategy,
  type MergeConfig,
  type InheritanceLevel,
  type ThemeLayer,
  type MergeResult,
  type ThemeConflict,
} from './merging';

// Utility functions
export const ThemeComputationUtils = {
  /**
   * Create computation context
   */
  createContext: (domain: any, mode: any, preferences: any, customizations: any) => ({
    domain,
    mode,
    preferences,
    customizations,
    timestamp: Date.now(),
  }),

  /**
   * Validate computation inputs
   */
  validateInputs: (domain: any, mode: any, preferences: any, customizations: any): boolean => {
    try {
      const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];
      const validModes = ['light', 'dark', 'system'];

      if (!validDomains.includes(domain)) return false;
      if (!validModes.includes(mode)) return false;
      if (!preferences || typeof preferences !== 'object') return false;
      if (!customizations || typeof customizations !== 'object') return false;

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Compare computed themes
   */
  compareThemes: (theme1: any, theme2: any): { equal: boolean; differences: string[] } => {
    const differences: string[] = [];

    // Compare basic properties
    if (theme1.mode !== theme2.mode) {
      differences.push(`mode: ${theme1.mode} → ${theme2.mode}`);
    }

    if (theme1.domain !== theme2.domain) {
      differences.push(`domain: ${theme1.domain} → ${theme2.domain}`);
    }

    // Compare colors
    if (JSON.stringify(theme1.colors) !== JSON.stringify(theme2.colors)) {
      differences.push('colors changed');
    }

    // Compare other aspects
    const aspects = ['typography', 'spacing', 'animations', 'shadows'];
    aspects.forEach(aspect => {
      if (JSON.stringify(theme1[aspect]) !== JSON.stringify(theme2[aspect])) {
        differences.push(`${aspect} changed`);
      }
    });

    return {
      equal: differences.length === 0,
      differences,
    };
  },

  /**
   * Calculate theme complexity score
   */
  calculateComplexity: (theme: any): number => {
    let score = 0;

    // Base complexity
    score += 10;

    // Color complexity
    if (theme.colors) {
      score += Object.keys(theme.colors).length * 2;
    }

    // Typography complexity
    if (theme.typography) {
      score += Object.keys(theme.typography).length * 1.5;
    }

    // Animation complexity
    if (theme.animations) {
      score += Object.keys(theme.animations).length * 3;
    }

    // CSS variables complexity
    if (theme.cssVariables) {
      score += Object.keys(theme.cssVariables).length * 0.5;
    }

    return Math.round(score);
  },

  /**
   * Optimize theme for performance
   */
  optimizeTheme: (theme: any): any => {
    const optimized = { ...theme };

    // Remove unused CSS variables
    if (optimized.cssVariables) {
      const used = new Set<string>();
      
      // Scan for used variables (simplified)
      Object.values(optimized.cssVariables).forEach((value: any) => {
        if (typeof value === 'string') {
          const matches = value.match(/var\((--[^)]+)\)/g);
          if (matches) {
            matches.forEach(match => {
              const varName = match.replace(/var\(([^)]+)\)/, '$1');
              used.add(varName);
            });
          }
        }
      });

      // Keep only used variables
      const filteredVariables: Record<string, string> = {};
      Object.entries(optimized.cssVariables).forEach(([key, value]) => {
        if (used.has(key) || !key.startsWith('--unused-')) {
          filteredVariables[key] = value;
        }
      });

      optimized.cssVariables = filteredVariables;
    }

    return optimized;
  },

  /**
   * Generate theme fingerprint
   */
  generateFingerprint: (theme: any): string => {
    const data = {
      mode: theme.mode,
      domain: theme.domain,
      colorsHash: theme.colors ? Object.keys(theme.colors).sort().join(',') : '',
      typographyHash: theme.typography ? Object.keys(theme.typography).sort().join(',') : '',
    };

    return btoa(JSON.stringify(data)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  },

  /**
   * Validate computed theme structure
   */
  validateTheme: (theme: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required properties
    const required = ['mode', 'domain', 'colors', 'typography', 'spacing', 'animations', 'shadows', 'cssVariables', 'metadata'];
    required.forEach(prop => {
      if (!(prop in theme)) {
        errors.push(`Missing required property: ${prop}`);
      }
    });

    // Validate colors
    if (theme.colors) {
      const requiredColors = ['primary', 'secondary', 'textPrimary', 'backgroundPrimary'];
      requiredColors.forEach(color => {
        if (!(color in theme.colors)) {
          errors.push(`Missing required color: ${color}`);
        }
      });
    }

    // Validate metadata
    if (theme.metadata) {
      if (!theme.metadata.version) {
        errors.push('Missing metadata.version');
      }
      if (!theme.metadata.computedAt) {
        errors.push('Missing metadata.computedAt');
      }
      if (!theme.metadata.hash) {
        errors.push('Missing metadata.hash');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  /**
   * Create theme diff
   */
  createDiff: (oldTheme: any, newTheme: any) => {
    const diff: Record<string, any> = {};

    const compareObjects = (obj1: any, obj2: any, path = '') => {
      const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

      keys.forEach(key => {
        const currentPath = path ? `${path}.${key}` : key;
        const val1 = obj1?.[key];
        const val2 = obj2?.[key];

        if (typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null) {
          compareObjects(val1, val2, currentPath);
        } else if (val1 !== val2) {
          diff[currentPath] = {
            old: val1,
            new: val2,
            type: val1 === undefined ? 'added' : val2 === undefined ? 'removed' : 'changed',
          };
        }
      });
    };

    compareObjects(oldTheme, newTheme);
    return diff;
  },

  /**
   * Merge theme diffs
   */
  mergeDiffs: (diff1: any, diff2: any) => {
    const merged = { ...diff1 };

    Object.entries(diff2).forEach(([key, value]) => {
      if (key in merged) {
        // Handle conflicts
        merged[key] = {
          ...merged[key],
          conflicts: true,
          values: [merged[key], value],
        };
      } else {
        merged[key] = value;
      }
    });

    return merged;
  },
};

// Constants
export const THEME_COMPUTATION_CONSTANTS = {
  // Performance thresholds
  MAX_COMPUTATION_TIME: 100,    // ms
  MAX_CACHE_SIZE: 100,
  CACHE_TTL: 30000,            // 30 seconds
  
  // Complexity thresholds
  LOW_COMPLEXITY: 50,
  MEDIUM_COMPLEXITY: 100,
  HIGH_COMPLEXITY: 200,
  
  // Optimization settings
  ENABLE_MEMOIZATION: true,
  ENABLE_PERFORMANCE_TRACKING: true,
  ENABLE_DEBUG_MODE: false,
  
  // Merge strategies
  MERGE_STRATEGIES: {
    REPLACE: 'replace' as const,
    MERGE: 'merge' as const,
    DEEP_MERGE: 'deep-merge' as const,
    SELECTIVE: 'selective' as const,
  },
  
  // Inheritance levels
  INHERITANCE_LEVELS: {
    SYSTEM: 'system' as const,
    BASE: 'base' as const,
    DOMAIN: 'domain' as const,
    USER: 'user' as const,
    CUSTOM: 'custom' as const,
  },
  
  // Priority values
  PRIORITIES: {
    SYSTEM: 0,
    BASE: 1,
    DOMAIN: 2,
    USER: 3,
    CUSTOM: 4,
  },
} as const;
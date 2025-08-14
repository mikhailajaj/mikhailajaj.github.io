/**
 * Theme Merging and Inheritance System
 * 
 * Provides sophisticated theme merging and inheritance logic for:
 * - Base theme + domain theme merging
 * - User customizations application
 * - Theme inheritance hierarchies
 * - Conflict resolution strategies
 */

import { type Domain } from '@/lib/constants/domains';
import {
  type ThemeMode,
  type ComputedTheme,
  type ThemeColors,
  type ThemeTypography,
  type ThemeSpacing,
  type ThemeAnimations,
  type ThemeShadows,
  type ThemeCustomizations,
  type UserThemePreferences,
} from '../core/types';

/**
 * Theme merge strategy options
 */
export type MergeStrategy = 'replace' | 'merge' | 'deep-merge' | 'selective';

/**
 * Theme merge configuration
 */
export interface MergeConfig {
  strategy: MergeStrategy;
  preserveBase: boolean;
  allowOverrides: boolean;
  validateResult: boolean;
  enableDeepMerge: boolean;
}

/**
 * Theme inheritance level
 */
export type InheritanceLevel = 'system' | 'base' | 'domain' | 'user' | 'custom';

/**
 * Theme layer interface
 */
export interface ThemeLayer {
  level: InheritanceLevel;
  priority: number;
  source: string;
  data: Partial<ComputedTheme>;
  timestamp: number;
}

/**
 * Merge result interface
 */
export interface MergeResult {
  success: boolean;
  result: ComputedTheme | null;
  conflicts: ThemeConflict[];
  warnings: string[];
  metadata: {
    layersProcessed: number;
    mergeTime: number;
    strategy: MergeStrategy;
  };
}

/**
 * Theme conflict interface
 */
export interface ThemeConflict {
  property: string;
  values: Array<{
    value: any;
    source: string;
    level: InheritanceLevel;
  }>;
  resolution: 'higher-priority' | 'user-preference' | 'fallback';
  resolvedValue: any;
}

/**
 * Theme Merger Class
 * 
 * Handles sophisticated theme merging with:
 * - Multiple inheritance levels
 * - Conflict resolution
 * - Validation and error handling
 * - Performance optimization
 */
export class ThemeMerger {
  private defaultConfig: MergeConfig = {
    strategy: 'deep-merge',
    preserveBase: true,
    allowOverrides: true,
    validateResult: true,
    enableDeepMerge: true,
  };

  /**
   * Merge multiple theme layers into a single computed theme
   */
  mergeThemeLayers(layers: ThemeLayer[], config?: Partial<MergeConfig>): MergeResult {
    const startTime = performance.now();
    const mergeConfig = { ...this.defaultConfig, ...config };
    const conflicts: ThemeConflict[] = [];
    const warnings: string[] = [];

    try {
      // Sort layers by priority (higher priority = later in array)
      const sortedLayers = this.sortLayersByPriority(layers);

      // Initialize result with system defaults
      let result = this.createBaseTheme();

      // Process each layer
      for (const layer of sortedLayers) {
        const mergeResult = this.mergeLayer(result, layer, mergeConfig);
        result = mergeResult.theme;
        conflicts.push(...mergeResult.conflicts);
        warnings.push(...mergeResult.warnings);
      }

      // Validate final result
      if (mergeConfig.validateResult) {
        const validation = this.validateMergedTheme(result);
        if (!validation.isValid) {
          warnings.push(...validation.warnings);
        }
      }

      return {
        success: true,
        result,
        conflicts,
        warnings,
        metadata: {
          layersProcessed: sortedLayers.length,
          mergeTime: performance.now() - startTime,
          strategy: mergeConfig.strategy,
        },
      };

    } catch (error) {
      return {
        success: false,
        result: null,
        conflicts,
        warnings: [...warnings, `Merge failed: ${error}`],
        metadata: {
          layersProcessed: 0,
          mergeTime: performance.now() - startTime,
          strategy: mergeConfig.strategy,
        },
      };
    }
  }

  /**
   * Merge base theme with domain theme
   */
  mergeBaseWithDomain(
    baseTheme: Partial<ComputedTheme>,
    domainTheme: any,
    domain: Domain,
    mode: ThemeMode
  ): ComputedTheme {
    const layers: ThemeLayer[] = [
      {
        level: 'base',
        priority: 1,
        source: 'base-theme',
        data: baseTheme,
        timestamp: Date.now(),
      },
      {
        level: 'domain',
        priority: 2,
        source: `domain-${domain}`,
        data: this.convertDomainThemeToLayer(domainTheme, domain, mode),
        timestamp: Date.now(),
      },
    ];

    const result = this.mergeThemeLayers(layers);
    
    if (!result.success || !result.result) {
      throw new Error('Failed to merge base and domain themes');
    }

    return result.result;
  }

  /**
   * Apply user customizations to theme
   */
  applyUserCustomizations(
    baseTheme: ComputedTheme,
    customizations: ThemeCustomizations,
    preferences: UserThemePreferences
  ): ComputedTheme {
    const layers: ThemeLayer[] = [
      {
        level: 'base',
        priority: 1,
        source: 'computed-theme',
        data: baseTheme,
        timestamp: Date.now(),
      },
      {
        level: 'user',
        priority: 3,
        source: 'user-customizations',
        data: this.convertCustomizationsToLayer(customizations, preferences),
        timestamp: Date.now(),
      },
    ];

    const result = this.mergeThemeLayers(layers);
    
    if (!result.success || !result.result) {
      throw new Error('Failed to apply user customizations');
    }

    return result.result;
  }

  /**
   * Merge theme colors with conflict resolution
   */
  mergeColors(
    base: ThemeColors,
    override: Partial<ThemeColors>,
    strategy: MergeStrategy = 'deep-merge'
  ): { colors: ThemeColors; conflicts: ThemeConflict[] } {
    const conflicts: ThemeConflict[] = [];
    const result = { ...base };

    Object.entries(override).forEach(([key, value]) => {
      if (value !== undefined) {
        const baseValue = base[key as keyof ThemeColors];
        
        if (baseValue !== undefined && baseValue !== value) {
          conflicts.push({
            property: `colors.${key}`,
            values: [
              { value: baseValue, source: 'base', level: 'base' },
              { value, source: 'override', level: 'user' },
            ],
            resolution: 'higher-priority',
            resolvedValue: value,
          });
        }

        (result as any)[key] = value;
      }
    });

    return { colors: result, conflicts };
  }

  /**
   * Merge typography settings
   */
  mergeTypography(
    base: ThemeTypography,
    override: Partial<ThemeTypography>,
    strategy: MergeStrategy = 'deep-merge'
  ): { typography: ThemeTypography; conflicts: ThemeConflict[] } {
    const conflicts: ThemeConflict[] = [];
    
    const result: ThemeTypography = {
      fontFamily: this.mergeObject(base.fontFamily, override.fontFamily || {}, conflicts, 'typography.fontFamily'),
      fontSize: this.mergeObject(base.fontSize, override.fontSize || {}, conflicts, 'typography.fontSize'),
      fontWeight: this.mergeObject(base.fontWeight, override.fontWeight || {}, conflicts, 'typography.fontWeight'),
      lineHeight: this.mergeObject(base.lineHeight, override.lineHeight || {}, conflicts, 'typography.lineHeight'),
      letterSpacing: this.mergeObject(base.letterSpacing, override.letterSpacing || {}, conflicts, 'typography.letterSpacing'),
    };

    return { typography: result, conflicts };
  }

  /**
   * Create theme inheritance chain
   */
  createInheritanceChain(
    domain: Domain,
    mode: ThemeMode,
    preferences: UserThemePreferences,
    customizations: ThemeCustomizations
  ): ThemeLayer[] {
    return [
      // System level (lowest priority)
      {
        level: 'system',
        priority: 0,
        source: 'system-defaults',
        data: this.getSystemDefaults(),
        timestamp: Date.now(),
      },
      // Base theme level
      {
        level: 'base',
        priority: 1,
        source: 'base-theme',
        data: this.getBaseThemeLayer(mode),
        timestamp: Date.now(),
      },
      // Domain level
      {
        level: 'domain',
        priority: 2,
        source: `domain-${domain}`,
        data: this.getDomainThemeLayer(domain, mode),
        timestamp: Date.now(),
      },
      // User preferences level
      {
        level: 'user',
        priority: 3,
        source: 'user-preferences',
        data: this.getPreferencesLayer(preferences),
        timestamp: Date.now(),
      },
      // Custom overrides level (highest priority)
      {
        level: 'custom',
        priority: 4,
        source: 'user-customizations',
        data: this.getCustomizationsLayer(customizations),
        timestamp: Date.now(),
      },
    ];
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Sort layers by priority
   */
  private sortLayersByPriority(layers: ThemeLayer[]): ThemeLayer[] {
    return [...layers].sort((a, b) => a.priority - b.priority);
  }

  /**
   * Merge single layer into theme
   */
  private mergeLayer(
    baseTheme: ComputedTheme,
    layer: ThemeLayer,
    config: MergeConfig
  ): { theme: ComputedTheme; conflicts: ThemeConflict[]; warnings: string[] } {
    const conflicts: ThemeConflict[] = [];
    const warnings: string[] = [];

    let result = { ...baseTheme };

    // Merge each theme aspect
    if (layer.data.colors) {
      const colorMerge = this.mergeColors(result.colors, layer.data.colors, config.strategy);
      result.colors = colorMerge.colors;
      conflicts.push(...colorMerge.conflicts);
    }

    if (layer.data.typography) {
      const typographyMerge = this.mergeTypography(result.typography, layer.data.typography, config.strategy);
      result.typography = typographyMerge.typography;
      conflicts.push(...typographyMerge.conflicts);
    }

    if (layer.data.spacing) {
      result.spacing = { ...result.spacing, ...layer.data.spacing };
    }

    if (layer.data.animations) {
      result.animations = this.deepMerge(result.animations, layer.data.animations);
    }

    if (layer.data.shadows) {
      result.shadows = { ...result.shadows, ...layer.data.shadows };
    }

    // Update metadata
    if (layer.data.mode) result.mode = layer.data.mode;
    if (layer.data.domain) result.domain = layer.data.domain;

    return { theme: result, conflicts, warnings };
  }

  /**
   * Deep merge objects
   */
  private deepMerge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
    const result = { ...base };

    Object.entries(override).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result[key as keyof T] = this.deepMerge(result[key] || {}, value);
        } else {
          result[key as keyof T] = value;
        }
      }
    });

    return result;
  }

  /**
   * Merge object with conflict tracking
   */
  private mergeObject<T extends Record<string, any>>(
    base: T,
    override: Partial<T>,
    conflicts: ThemeConflict[],
    propertyPath: string
  ): T {
    const result = { ...base };

    Object.entries(override).forEach(([key, value]) => {
      if (value !== undefined) {
        const baseValue = base[key];
        
        if (baseValue !== undefined && baseValue !== value) {
          conflicts.push({
            property: `${propertyPath}.${key}`,
            values: [
              { value: baseValue, source: 'base', level: 'base' },
              { value, source: 'override', level: 'user' },
            ],
            resolution: 'higher-priority',
            resolvedValue: value,
          });
        }

        result[key] = value;
      }
    });

    return result;
  }

  /**
   * Convert domain theme to layer format
   */
  private convertDomainThemeToLayer(domainTheme: any, domain: Domain, mode: ThemeMode): Partial<ComputedTheme> {
    return {
      domain,
      colors: {
        primary: domainTheme.primaryColor,
        secondary: domainTheme.secondaryColor,
        accent: domainTheme.accentColor,
        domainPrimary: domainTheme.primaryColor,
        domainSecondary: domainTheme.secondaryColor,
        domainAccent: domainTheme.accentColor,
        domainGradientStart: domainTheme.gradientColors[0],
        domainGradientEnd: domainTheme.gradientColors[1],
      } as Partial<ThemeColors>,
    };
  }

  /**
   * Convert customizations to layer format
   */
  private convertCustomizationsToLayer(
    customizations: ThemeCustomizations,
    preferences: UserThemePreferences
  ): Partial<ComputedTheme> {
    return {
      colors: customizations.colors,
      typography: customizations.typography,
      spacing: customizations.spacing,
      animations: customizations.animations,
    };
  }

  /**
   * Create base theme structure
   */
  private createBaseTheme(): ComputedTheme {
    return {
      mode: 'light',
      domain: 'full-stack',
      colors: {} as ThemeColors,
      typography: {} as ThemeTypography,
      spacing: {} as ThemeSpacing,
      animations: {} as ThemeAnimations,
      shadows: {} as ThemeShadows,
      cssVariables: {},
      metadata: {
        version: '1.0.0',
        computedAt: Date.now(),
        hash: '',
      },
    };
  }

  /**
   * Get system defaults layer
   */
  private getSystemDefaults(): Partial<ComputedTheme> {
    return {
      mode: 'light',
      domain: 'full-stack',
    };
  }

  /**
   * Get base theme layer
   */
  private getBaseThemeLayer(mode: ThemeMode): Partial<ComputedTheme> {
    // This would return base theme data
    return {};
  }

  /**
   * Get domain theme layer
   */
  private getDomainThemeLayer(domain: Domain, mode: ThemeMode): Partial<ComputedTheme> {
    // This would return domain-specific theme data
    return {};
  }

  /**
   * Get preferences layer
   */
  private getPreferencesLayer(preferences: UserThemePreferences): Partial<ComputedTheme> {
    return {
      animations: preferences.reducedMotion ? {
        duration: { fast: '0ms', normal: '0ms', slow: '0ms' },
        transitions: { colors: 'none', transform: 'none', opacity: 'none', all: 'none' },
      } as Partial<ThemeAnimations> : undefined,
    };
  }

  /**
   * Get customizations layer
   */
  private getCustomizationsLayer(customizations: ThemeCustomizations): Partial<ComputedTheme> {
    return {
      colors: customizations.colors,
      typography: customizations.typography,
      spacing: customizations.spacing,
      animations: customizations.animations,
    };
  }

  /**
   * Validate merged theme
   */
  private validateMergedTheme(theme: ComputedTheme): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Basic validation
    if (!theme.colors || Object.keys(theme.colors).length === 0) {
      warnings.push('Theme colors are missing or empty');
    }

    if (!theme.typography || Object.keys(theme.typography).length === 0) {
      warnings.push('Theme typography is missing or empty');
    }

    return {
      isValid: warnings.length === 0,
      warnings,
    };
  }
}

/**
 * Theme Inheritance Utilities
 */
export class ThemeInheritanceUtils {
  /**
   * Check if property should inherit from parent
   */
  static shouldInherit(property: string, value: any, parentValue: any): boolean {
    // Don't inherit if value is explicitly set
    if (value !== undefined && value !== null) {
      return false;
    }

    // Inherit if parent has a value
    return parentValue !== undefined && parentValue !== null;
  }

  /**
   * Resolve inheritance chain for property
   */
  static resolveInheritance(property: string, layers: ThemeLayer[]): any {
    // Start from highest priority and work down
    const sortedLayers = layers.sort((a, b) => b.priority - a.priority);

    for (const layer of sortedLayers) {
      const value = this.getNestedProperty(layer.data, property);
      if (value !== undefined && value !== null) {
        return value;
      }
    }

    return undefined;
  }

  /**
   * Get nested property from object
   */
  static getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Set nested property in object
   */
  static setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  /**
   * Create inheritance map for debugging
   */
  static createInheritanceMap(layers: ThemeLayer[]): Record<string, any> {
    const map: Record<string, any> = {};

    layers.forEach(layer => {
      this.flattenObject(layer.data, '', (path, value) => {
        if (!map[path]) map[path] = [];
        map[path].push({
          value,
          source: layer.source,
          level: layer.level,
          priority: layer.priority,
        });
      });
    });

    return map;
  }

  /**
   * Flatten object for inheritance mapping
   */
  private static flattenObject(obj: any, prefix: string, callback: (path: string, value: any) => void): void {
    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.flattenObject(value, path, callback);
      } else {
        callback(path, value);
      }
    });
  }
}

// Export singleton instance
export const themeMerger = new ThemeMerger();
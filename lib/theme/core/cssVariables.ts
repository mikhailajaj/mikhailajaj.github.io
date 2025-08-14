/**
 * CSS Variables Generation System
 * 
 * Optimized CSS custom property generation and management for the unified theme system.
 * Provides performance-optimized CSS variable application with caching and batching.
 */

import { type Domain } from '@/lib/constants/domains';
import {
  type ComputedTheme,
  type ThemeColors,
  type ThemeMode,
  type ThemeCustomizations,
} from './types';

/**
 * CSS Variable Manager
 * 
 * Manages CSS custom properties with:
 * - Performance optimization
 * - Batch updates
 * - Change detection
 * - Fallback handling
 */
export class CSSVariableManager {
  private currentVariables: Map<string, string> = new Map();
  private pendingUpdates: Map<string, string> = new Map();
  private updateTimeout: NodeJS.Timeout | null = null;
  private isApplying = false;
  private debugMode = false;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  /**
   * Generate CSS variables from computed theme
   */
  generateVariables(theme: ComputedTheme): Record<string, string> {
    const variables: Record<string, string> = {};

    // Core theme variables
    this.addColorVariables(variables, theme.colors);
    this.addTypographyVariables(variables, theme.typography);
    this.addSpacingVariables(variables, theme.spacing);
    this.addAnimationVariables(variables, theme.animations);
    this.addShadowVariables(variables, theme.shadows);
    this.addDomainVariables(variables, theme.domain, theme.colors);
    this.addModeVariables(variables, theme.mode);

    // Add metadata
    variables['--theme-version'] = theme.metadata.version;
    variables['--theme-hash'] = theme.metadata.hash;
    variables['--theme-computed-at'] = theme.metadata.computedAt.toString();

    return variables;
  }

  /**
   * Apply CSS variables to DOM with optimization
   */
  applyVariables(variables: Record<string, string>): void {
    // Add to pending updates
    Object.entries(variables).forEach(([property, value]) => {
      this.pendingUpdates.set(property, value);
    });

    // Schedule batched update
    this.scheduleBatchUpdate();
  }

  /**
   * Apply single CSS variable immediately
   */
  setVariable(property: string, value: string): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const normalizedProperty = this.normalizeProperty(property);
    
    // Only update if value changed
    if (this.currentVariables.get(normalizedProperty) !== value) {
      root.style.setProperty(normalizedProperty, value);
      this.currentVariables.set(normalizedProperty, value);

      if (this.debugMode) {
        console.log(`[CSSVariableManager] Set ${normalizedProperty}: ${value}`);
      }
    }
  }

  /**
   * Remove CSS variable
   */
  removeVariable(property: string): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const normalizedProperty = this.normalizeProperty(property);
    
    root.style.removeProperty(normalizedProperty);
    this.currentVariables.delete(normalizedProperty);

    if (this.debugMode) {
      console.log(`[CSSVariableManager] Removed ${normalizedProperty}`);
    }
  }

  /**
   * Get current variable value
   */
  getVariable(property: string): string | undefined {
    const normalizedProperty = this.normalizeProperty(property);
    return this.currentVariables.get(normalizedProperty);
  }

  /**
   * Check if variable exists
   */
  hasVariable(property: string): boolean {
    const normalizedProperty = this.normalizeProperty(property);
    return this.currentVariables.has(normalizedProperty);
  }

  /**
   * Clear all variables
   */
  clearVariables(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    this.currentVariables.forEach((_, property) => {
      root.style.removeProperty(property);
    });

    this.currentVariables.clear();
    this.pendingUpdates.clear();

    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
      this.updateTimeout = null;
    }
  }

  /**
   * Get all current variables
   */
  getAllVariables(): Record<string, string> {
    const variables: Record<string, string> = {};
    this.currentVariables.forEach((value, property) => {
      variables[property] = value;
    });
    return variables;
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      totalVariables: this.currentVariables.size,
      pendingUpdates: this.pendingUpdates.size,
      isApplying: this.isApplying,
      hasScheduledUpdate: this.updateTimeout !== null,
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Schedule batched CSS variable update
   */
  private scheduleBatchUpdate(): void {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.processPendingUpdates();
    }, 16); // ~60fps batching
  }

  /**
   * Process pending CSS variable updates
   */
  private processPendingUpdates(): void {
    if (this.isApplying || this.pendingUpdates.size === 0) return;
    if (typeof document === 'undefined') return;

    this.isApplying = true;
    const startTime = performance.now();

    try {
      const root = document.documentElement;
      const updates: Array<[string, string]> = [];

      // Collect only changed variables
      this.pendingUpdates.forEach((value, property) => {
        const normalizedProperty = this.normalizeProperty(property);
        if (this.currentVariables.get(normalizedProperty) !== value) {
          updates.push([normalizedProperty, value]);
        }
      });

      // Apply updates in batch
      if (updates.length > 0) {
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          updates.forEach(([property, value]) => {
            root.style.setProperty(property, value);
            this.currentVariables.set(property, value);
          });

          if (this.debugMode) {
            const duration = performance.now() - startTime;
            console.log(`[CSSVariableManager] Applied ${updates.length} variables in ${duration.toFixed(2)}ms`);
          }
        });
      }

      // Clear pending updates
      this.pendingUpdates.clear();
    } catch (error) {
      console.error('[CSSVariableManager] Error applying variables:', error);
    } finally {
      this.isApplying = false;
      this.updateTimeout = null;
    }
  }

  /**
   * Normalize CSS property name
   */
  private normalizeProperty(property: string): string {
    return property.startsWith('--') ? property : `--${property}`;
  }

  /**
   * Add color variables
   */
  private addColorVariables(variables: Record<string, string>, colors: ThemeColors): void {
    // Primary colors
    variables['--color-primary'] = colors.primary;
    variables['--color-secondary'] = colors.secondary;
    variables['--color-accent'] = colors.accent;

    // Text colors
    variables['--color-text-primary'] = colors.textPrimary;
    variables['--color-text-secondary'] = colors.textSecondary;
    variables['--color-text-tertiary'] = colors.textTertiary;
    variables['--color-text-inverse'] = colors.textInverse;

    // Background colors
    variables['--color-bg-primary'] = colors.backgroundPrimary;
    variables['--color-bg-secondary'] = colors.backgroundSecondary;
    variables['--color-bg-tertiary'] = colors.backgroundTertiary;
    variables['--color-bg-elevated'] = colors.backgroundElevated;
    variables['--color-bg-overlay'] = colors.backgroundOverlay;

    // Border colors
    variables['--color-border-primary'] = colors.borderPrimary;
    variables['--color-border-secondary'] = colors.borderSecondary;
    variables['--color-border-accent'] = colors.borderAccent;

    // Semantic colors
    variables['--color-success'] = colors.success;
    variables['--color-warning'] = colors.warning;
    variables['--color-error'] = colors.error;
    variables['--color-info'] = colors.info;

    // Domain colors
    variables['--color-domain-primary'] = colors.domainPrimary;
    variables['--color-domain-secondary'] = colors.domainSecondary;
    variables['--color-domain-accent'] = colors.domainAccent;
    variables['--color-domain-gradient-start'] = colors.domainGradientStart;
    variables['--color-domain-gradient-end'] = colors.domainGradientEnd;
    variables['--gradient-domain'] = `linear-gradient(135deg, ${colors.domainGradientStart}, ${colors.domainGradientEnd})`;
  }

  /**
   * Add typography variables
   */
  private addTypographyVariables(variables: Record<string, string>, typography: any): void {
    // Font families
    if (typography.fontFamily) {
      variables['--font-sans'] = typography.fontFamily.sans || 'system-ui, sans-serif';
      variables['--font-mono'] = typography.fontFamily.mono || 'monospace';
      variables['--font-display'] = typography.fontFamily.display || 'system-ui, sans-serif';
    }

    // Font sizes
    if (typography.fontSize) {
      Object.entries(typography.fontSize).forEach(([size, value]) => {
        variables[`--font-size-${size}`] = value as string;
      });
    }

    // Font weights
    if (typography.fontWeight) {
      Object.entries(typography.fontWeight).forEach(([weight, value]) => {
        variables[`--font-weight-${weight}`] = (value as number).toString();
      });
    }

    // Line heights
    if (typography.lineHeight) {
      Object.entries(typography.lineHeight).forEach(([height, value]) => {
        variables[`--line-height-${height}`] = (value as number).toString();
      });
    }

    // Letter spacing
    if (typography.letterSpacing) {
      Object.entries(typography.letterSpacing).forEach(([spacing, value]) => {
        variables[`--letter-spacing-${spacing}`] = value as string;
      });
    }
  }

  /**
   * Add spacing variables
   */
  private addSpacingVariables(variables: Record<string, string>, spacing: any): void {
    Object.entries(spacing).forEach(([size, value]) => {
      variables[`--spacing-${size}`] = value as string;
    });
  }

  /**
   * Add animation variables
   */
  private addAnimationVariables(variables: Record<string, string>, animations: any): void {
    // Durations
    if (animations.duration) {
      Object.entries(animations.duration).forEach(([speed, value]) => {
        variables[`--duration-${speed}`] = value as string;
      });
    }

    // Easing
    if (animations.easing) {
      Object.entries(animations.easing).forEach(([type, value]) => {
        variables[`--easing-${type}`] = value as string;
      });
    }

    // Transitions
    if (animations.transitions) {
      Object.entries(animations.transitions).forEach(([type, value]) => {
        variables[`--transition-${type}`] = value as string;
      });
    }
  }

  /**
   * Add shadow variables
   */
  private addShadowVariables(variables: Record<string, string>, shadows: any): void {
    Object.entries(shadows).forEach(([size, value]) => {
      variables[`--shadow-${size}`] = value as string;
    });
  }

  /**
   * Add domain-specific variables
   */
  private addDomainVariables(variables: Record<string, string>, domain: Domain, colors: ThemeColors): void {
    variables['--current-domain'] = domain;
    variables['--domain-class'] = `domain-${domain}`;
    
    // Domain-specific gradients and patterns
    variables['--domain-gradient-radial'] = `radial-gradient(circle, ${colors.domainGradientStart}, ${colors.domainGradientEnd})`;
    variables['--domain-gradient-conic'] = `conic-gradient(from 0deg, ${colors.domainGradientStart}, ${colors.domainGradientEnd}, ${colors.domainGradientStart})`;
  }

  /**
   * Add mode-specific variables
   */
  private addModeVariables(variables: Record<string, string>, mode: ThemeMode): void {
    variables['--current-mode'] = mode;
    variables['--mode-class'] = `theme-${mode}`;
    variables['--is-dark'] = mode === 'dark' ? '1' : '0';
    variables['--is-light'] = mode === 'light' ? '1' : '0';
  }
}

/**
 * CSS Variable Utilities
 */
export class CSSVariableUtils {
  /**
   * Generate CSS variable reference
   */
  static var(property: string, fallback?: string): string {
    const normalizedProperty = property.startsWith('--') ? property : `--${property}`;
    return fallback ? `var(${normalizedProperty}, ${fallback})` : `var(${normalizedProperty})`;
  }

  /**
   * Generate CSS calc expression with variables
   */
  static calc(expression: string): string {
    return `calc(${expression})`;
  }

  /**
   * Generate CSS clamp expression with variables
   */
  static clamp(min: string, preferred: string, max: string): string {
    return `clamp(${min}, ${preferred}, ${max})`;
  }

  /**
   * Generate responsive CSS variable
   */
  static responsive(baseProperty: string, breakpoints: Record<string, string>): Record<string, string> {
    const variables: Record<string, string> = {};
    
    Object.entries(breakpoints).forEach(([breakpoint, value]) => {
      variables[`${baseProperty}-${breakpoint}`] = value;
    });

    return variables;
  }

  /**
   * Generate color variations
   */
  static colorVariations(baseColor: string, variations: Record<string, number>): Record<string, string> {
    const variables: Record<string, string> = {};
    
    Object.entries(variations).forEach(([variation, opacity]) => {
      variables[`${baseColor}-${variation}`] = `color-mix(in srgb, var(${baseColor}) ${opacity * 100}%, transparent)`;
    });

    return variables;
  }

  /**
   * Generate theme-aware property
   */
  static themeAware(lightValue: string, darkValue: string): string {
    return `light-dark(${lightValue}, ${darkValue})`;
  }

  /**
   * Validate CSS variable name
   */
  static isValidVariableName(name: string): boolean {
    return /^--[a-zA-Z][a-zA-Z0-9-_]*$/.test(name);
  }

  /**
   * Extract variable name from CSS value
   */
  static extractVariableName(cssValue: string): string | null {
    const match = cssValue.match(/var\((--[^,)]+)/);
    return match ? match[1] : null;
  }

  /**
   * Check if CSS value uses variables
   */
  static usesVariables(cssValue: string): boolean {
    return /var\(--[^)]+\)/.test(cssValue);
  }
}

// Export singleton instance
export const cssVariableManager = new CSSVariableManager();
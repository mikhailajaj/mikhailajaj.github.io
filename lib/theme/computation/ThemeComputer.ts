/**
 * Theme Computation System
 * 
 * Efficient theme computation with performance optimization, including:
 * - Algorithms for computing themes from domain and mode inputs
 * - Theme merging and inheritance logic
 * - CSS variable generation with optimization
 * - Theme memoization and caching system
 */

import { type Domain } from '@/lib/constants/domains';
import { getDomainTheme } from '@/lib/config/domainThemes';
import { theme as baseTheme } from '@/lib/theme';
import {
  type ThemeMode,
  type ComputedTheme,
  type ThemeColors,
  type ThemeTypography,
  type ThemeSpacing,
  type ThemeAnimations,
  type ThemeShadows,
  type UserThemePreferences,
  type ThemeCustomizations,
} from '../core/types';

/**
 * Theme computation configuration
 */
interface ComputationConfig {
  enableMemoization: boolean;
  memoizationTTL: number;
  enablePerformanceTracking: boolean;
  enableDebugMode: boolean;
  maxCacheSize: number;
}

/**
 * Theme computation context
 */
interface ComputationContext {
  domain: Domain;
  mode: ThemeMode;
  preferences: UserThemePreferences;
  customizations: ThemeCustomizations;
  timestamp: number;
}

/**
 * Memoization cache entry
 */
interface CacheEntry {
  key: string;
  value: ComputedTheme;
  timestamp: number;
  accessCount: number;
  computationTime: number;
}

/**
 * Theme computation metrics
 */
interface ComputationMetrics {
  totalComputations: number;
  cacheHits: number;
  cacheMisses: number;
  averageComputationTime: number;
  lastComputationTime: number;
  cacheSize: number;
  cacheHitRate: number;
}

/**
 * Theme Computer Class
 * 
 * Handles all theme computation with:
 * - Domain and mode-based computation
 * - Performance optimization through memoization
 * - CSS variable generation
 * - Theme inheritance and merging
 */
export class ThemeComputer {
  private config: ComputationConfig;
  private cache = new Map<string, CacheEntry>();
  private metrics: ComputationMetrics;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<ComputationConfig>) {
    this.config = {
      enableMemoization: true,
      memoizationTTL: 30000, // 30 seconds
      enablePerformanceTracking: true,
      enableDebugMode: false,
      maxCacheSize: 100,
      ...config,
    };

    this.metrics = {
      totalComputations: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageComputationTime: 0,
      lastComputationTime: 0,
      cacheSize: 0,
      cacheHitRate: 0,
    };

    // Setup cache cleanup
    if (this.config.enableMemoization) {
      this.setupCacheCleanup();
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Compute theme for given context
   */
  computeTheme(context: ComputationContext): ComputedTheme {
    const startTime = performance.now();
    
    try {
      // Generate cache key
      const cacheKey = this.generateCacheKey(context);

      // Check cache first
      if (this.config.enableMemoization) {
        const cached = this.getCachedTheme(cacheKey);
        if (cached) {
          this.updateMetrics(true, performance.now() - startTime);
          return cached;
        }
      }

      // Compute theme
      const computed = this.performComputation(context);

      // Cache result
      if (this.config.enableMemoization) {
        this.cacheTheme(cacheKey, computed, performance.now() - startTime);
      }

      this.updateMetrics(false, performance.now() - startTime);
      return computed;

    } catch (error) {
      console.error('[ThemeComputer] Computation failed:', error);
      return this.getFallbackTheme(context);
    }
  }

  /**
   * Compute theme colors
   */
  computeColors(
    domain: Domain,
    mode: ThemeMode,
    preferences: UserThemePreferences,
    customizations?: Partial<ThemeColors>
  ): ThemeColors {
    const resolvedMode = this.resolveMode(mode);
    const domainTheme = getDomainTheme(domain);
    
    if (!domainTheme) {
      throw new Error(`Domain theme not found: ${domain}`);
    }

    // Base colors from theme system
    const baseColors = this.getBaseColors(resolvedMode);
    
    // Domain-specific colors
    const domainColors = this.getDomainColors(domainTheme);
    
    // Accessibility adjustments
    const accessibilityColors = this.applyAccessibilityAdjustments(
      { ...baseColors, ...domainColors },
      preferences
    );

    // Apply customizations
    const finalColors = this.applyColorCustomizations(
      accessibilityColors,
      customizations || {}
    );

    return finalColors;
  }

  /**
   * Compute typography settings
   */
  computeTypography(
    preferences: UserThemePreferences,
    customizations?: Partial<ThemeTypography>
  ): ThemeTypography {
    // Base typography
    const baseTypography = this.getBaseTypography();
    
    // Apply font size preference
    const sizedTypography = this.applyFontSizePreference(baseTypography, preferences.fontSize);
    
    // Apply customizations
    const finalTypography = this.applyTypographyCustomizations(
      sizedTypography,
      customizations || {}
    );

    return finalTypography;
  }

  /**
   * Compute spacing values
   */
  computeSpacing(customizations?: Partial<ThemeSpacing>): ThemeSpacing {
    const baseSpacing = this.getBaseSpacing();
    
    return this.applySpacingCustomizations(baseSpacing, customizations || {});
  }

  /**
   * Compute animation settings
   */
  computeAnimations(
    preferences: UserThemePreferences,
    customizations?: Partial<ThemeAnimations>
  ): ThemeAnimations {
    const baseAnimations = this.getBaseAnimations();
    
    // Apply reduced motion preference
    const accessibleAnimations = this.applyReducedMotion(baseAnimations, preferences.reducedMotion);
    
    // Apply customizations
    const finalAnimations = this.applyAnimationCustomizations(
      accessibleAnimations,
      customizations || {}
    );

    return finalAnimations;
  }

  /**
   * Compute shadow definitions
   */
  computeShadows(mode: ThemeMode, customizations?: any): ThemeShadows {
    const resolvedMode = this.resolveMode(mode);
    const baseShadows = this.getBaseShadows(resolvedMode);
    
    return this.applyShadowCustomizations(baseShadows, customizations || {});
  }

  /**
   * Generate CSS variables from computed theme
   */
  generateCSSVariables(theme: ComputedTheme): Record<string, string> {
    const variables: Record<string, string> = {};

    // Color variables
    this.addColorVariables(variables, theme.colors);
    
    // Typography variables
    this.addTypographyVariables(variables, theme.typography);
    
    // Spacing variables
    this.addSpacingVariables(variables, theme.spacing);
    
    // Animation variables
    this.addAnimationVariables(variables, theme.animations);
    
    // Shadow variables
    this.addShadowVariables(variables, theme.shadows);
    
    // Domain-specific variables
    this.addDomainVariables(variables, theme.domain, theme.colors);
    
    // Mode-specific variables
    this.addModeVariables(variables, theme.mode);

    return variables;
  }

  /**
   * Clear computation cache
   */
  clearCache(): void {
    this.cache.clear();
    this.updateCacheMetrics();
  }

  /**
   * Get computation metrics
   */
  getMetrics(): ComputationMetrics {
    return { ...this.metrics };
  }

  /**
   * Destroy computer and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clearCache();
  }

  // ============================================================================
  // PRIVATE METHODS - CORE COMPUTATION
  // ============================================================================

  /**
   * Perform the actual theme computation
   */
  private performComputation(context: ComputationContext): ComputedTheme {
    const { domain, mode, preferences, customizations } = context;
    
    // Compute individual theme aspects
    const colors = this.computeColors(domain, mode, preferences, customizations.colors);
    const typography = this.computeTypography(preferences, customizations.typography);
    const spacing = this.computeSpacing(customizations.spacing);
    const animations = this.computeAnimations(preferences, customizations.animations);
    const shadows = this.computeShadows(mode);

    // Generate CSS variables
    const cssVariables = this.generateCSSVariables({
      mode: this.resolveMode(mode),
      domain,
      colors,
      typography,
      spacing,
      animations,
      shadows,
      cssVariables: {},
      metadata: {
        version: '1.0.0',
        computedAt: context.timestamp,
        hash: '',
      },
    });

    // Create final computed theme
    const computed: ComputedTheme = {
      mode: this.resolveMode(mode),
      domain,
      colors,
      typography,
      spacing,
      animations,
      shadows,
      cssVariables,
      metadata: {
        version: '1.0.0',
        computedAt: context.timestamp,
        hash: this.generateThemeHash(domain, mode, colors),
      },
    };

    return computed;
  }

  /**
   * Get base colors for mode
   */
  private getBaseColors(mode: 'light' | 'dark'): Partial<ThemeColors> {
    const textColors = baseTheme.text[mode];
    const backgroundColors = baseTheme.background[mode];
    const borderColors = baseTheme.border[mode];

    return {
      textPrimary: textColors.primary,
      textSecondary: textColors.secondary,
      textTertiary: textColors.tertiary,
      textInverse: textColors.inverse,
      backgroundPrimary: backgroundColors.primary,
      backgroundSecondary: backgroundColors.secondary,
      backgroundTertiary: backgroundColors.tertiary,
      backgroundElevated: backgroundColors.elevated,
      backgroundOverlay: backgroundColors.overlay,
      borderPrimary: borderColors.primary,
      borderSecondary: borderColors.secondary,
      borderAccent: borderColors.accent,
      success: baseTheme.colors.success[mode],
      warning: baseTheme.colors.warning[mode],
      error: baseTheme.colors.error[mode],
      info: baseTheme.colors.info[mode],
    };
  }

  /**
   * Get domain-specific colors
   */
  private getDomainColors(domainTheme: any): Partial<ThemeColors> {
    return {
      primary: domainTheme.primaryColor,
      secondary: domainTheme.secondaryColor,
      accent: domainTheme.accentColor,
      domainPrimary: domainTheme.primaryColor,
      domainSecondary: domainTheme.secondaryColor,
      domainAccent: domainTheme.accentColor,
      domainGradientStart: domainTheme.gradientColors[0],
      domainGradientEnd: domainTheme.gradientColors[1],
    };
  }

  /**
   * Apply accessibility adjustments to colors
   */
  private applyAccessibilityAdjustments(
    colors: Partial<ThemeColors>,
    preferences: UserThemePreferences
  ): ThemeColors {
    let adjustedColors = { ...colors } as ThemeColors;

    // High contrast adjustments
    if (preferences.highContrast) {
      adjustedColors = this.applyHighContrastAdjustments(adjustedColors);
    }

    return adjustedColors;
  }

  /**
   * Apply high contrast adjustments
   */
  private applyHighContrastAdjustments(colors: ThemeColors): ThemeColors {
    // Increase contrast for better accessibility
    return {
      ...colors,
      textPrimary: colors.textPrimary === '#ffffff' ? '#ffffff' : '#000000',
      backgroundPrimary: colors.backgroundPrimary === '#000000' ? '#000000' : '#ffffff',
      borderPrimary: colors.textPrimary === '#ffffff' ? '#ffffff' : '#000000',
    };
  }

  /**
   * Apply color customizations
   */
  private applyColorCustomizations(
    baseColors: ThemeColors,
    customizations: Partial<ThemeColors>
  ): ThemeColors {
    return { ...baseColors, ...customizations };
  }

  /**
   * Get base typography
   */
  private getBaseTypography(): ThemeTypography {
    return {
      fontFamily: {
        sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        display: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
      },
    };
  }

  /**
   * Apply font size preference
   */
  private applyFontSizePreference(
    typography: ThemeTypography,
    fontSize: 'small' | 'medium' | 'large'
  ): ThemeTypography {
    const multipliers = {
      small: 0.875,
      medium: 1,
      large: 1.125,
    };

    const multiplier = multipliers[fontSize];
    const adjustedFontSize = { ...typography.fontSize };

    Object.keys(adjustedFontSize).forEach(key => {
      const currentSize = parseFloat(adjustedFontSize[key as keyof typeof adjustedFontSize]);
      adjustedFontSize[key as keyof typeof adjustedFontSize] = `${currentSize * multiplier}rem`;
    });

    return {
      ...typography,
      fontSize: adjustedFontSize,
    };
  }

  /**
   * Apply typography customizations
   */
  private applyTypographyCustomizations(
    baseTypography: ThemeTypography,
    customizations: Partial<ThemeTypography>
  ): ThemeTypography {
    return {
      fontFamily: { ...baseTypography.fontFamily, ...customizations.fontFamily },
      fontSize: { ...baseTypography.fontSize, ...customizations.fontSize },
      fontWeight: { ...baseTypography.fontWeight, ...customizations.fontWeight },
      lineHeight: { ...baseTypography.lineHeight, ...customizations.lineHeight },
      letterSpacing: { ...baseTypography.letterSpacing, ...customizations.letterSpacing },
    };
  }

  /**
   * Get base spacing
   */
  private getBaseSpacing(): ThemeSpacing {
    return {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      '5xl': '8rem',
      '6xl': '12rem',
    };
  }

  /**
   * Apply spacing customizations
   */
  private applySpacingCustomizations(
    baseSpacing: ThemeSpacing,
    customizations: Partial<ThemeSpacing>
  ): ThemeSpacing {
    return { ...baseSpacing, ...customizations };
  }

  /**
   * Get base animations
   */
  private getBaseAnimations(): ThemeAnimations {
    return {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitions: {
        colors: 'color 300ms ease, background-color 300ms ease, border-color 300ms ease',
        transform: 'transform 300ms ease',
        opacity: 'opacity 300ms ease',
        all: 'all 300ms ease',
      },
    };
  }

  /**
   * Apply reduced motion preference
   */
  private applyReducedMotion(
    animations: ThemeAnimations,
    reducedMotion: boolean
  ): ThemeAnimations {
    if (!reducedMotion) return animations;

    return {
      duration: {
        fast: '0ms',
        normal: '0ms',
        slow: '0ms',
      },
      easing: animations.easing,
      transitions: {
        colors: 'none',
        transform: 'none',
        opacity: 'none',
        all: 'none',
      },
    };
  }

  /**
   * Apply animation customizations
   */
  private applyAnimationCustomizations(
    baseAnimations: ThemeAnimations,
    customizations: Partial<ThemeAnimations>
  ): ThemeAnimations {
    return {
      duration: { ...baseAnimations.duration, ...customizations.duration },
      easing: { ...baseAnimations.easing, ...customizations.easing },
      transitions: { ...baseAnimations.transitions, ...customizations.transitions },
    };
  }

  /**
   * Get base shadows
   */
  private getBaseShadows(mode: 'light' | 'dark'): ThemeShadows {
    return baseTheme.shadows[mode];
  }

  /**
   * Apply shadow customizations
   */
  private applyShadowCustomizations(
    baseShadows: ThemeShadows,
    customizations: any
  ): ThemeShadows {
    return { ...baseShadows, ...customizations };
  }

  // ============================================================================
  // PRIVATE METHODS - CSS VARIABLES
  // ============================================================================

  /**
   * Add color variables
   */
  private addColorVariables(variables: Record<string, string>, colors: ThemeColors): void {
    Object.entries(colors).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      variables[`--color-${cssKey}`] = value;
    });
  }

  /**
   * Add typography variables
   */
  private addTypographyVariables(variables: Record<string, string>, typography: ThemeTypography): void {
    // Font families
    Object.entries(typography.fontFamily).forEach(([key, value]) => {
      variables[`--font-${key}`] = value;
    });

    // Font sizes
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      variables[`--font-size-${key}`] = value;
    });

    // Font weights
    Object.entries(typography.fontWeight).forEach(([key, value]) => {
      variables[`--font-weight-${key}`] = value.toString();
    });

    // Line heights
    Object.entries(typography.lineHeight).forEach(([key, value]) => {
      variables[`--line-height-${key}`] = value.toString();
    });

    // Letter spacing
    Object.entries(typography.letterSpacing).forEach(([key, value]) => {
      variables[`--letter-spacing-${key}`] = value;
    });
  }

  /**
   * Add spacing variables
   */
  private addSpacingVariables(variables: Record<string, string>, spacing: ThemeSpacing): void {
    Object.entries(spacing).forEach(([key, value]) => {
      variables[`--spacing-${key}`] = value;
    });
  }

  /**
   * Add animation variables
   */
  private addAnimationVariables(variables: Record<string, string>, animations: ThemeAnimations): void {
    // Durations
    Object.entries(animations.duration).forEach(([key, value]) => {
      variables[`--duration-${key}`] = value;
    });

    // Easing
    Object.entries(animations.easing).forEach(([key, value]) => {
      variables[`--easing-${key}`] = value;
    });

    // Transitions
    Object.entries(animations.transitions).forEach(([key, value]) => {
      variables[`--transition-${key}`] = value;
    });
  }

  /**
   * Add shadow variables
   */
  private addShadowVariables(variables: Record<string, string>, shadows: ThemeShadows): void {
    Object.entries(shadows).forEach(([key, value]) => {
      variables[`--shadow-${key}`] = value;
    });
  }

  /**
   * Add domain-specific variables
   */
  private addDomainVariables(variables: Record<string, string>, domain: Domain, colors: ThemeColors): void {
    variables['--current-domain'] = domain;
    variables['--domain-gradient'] = `linear-gradient(135deg, ${colors.domainGradientStart}, ${colors.domainGradientEnd})`;
  }

  /**
   * Add mode-specific variables
   */
  private addModeVariables(variables: Record<string, string>, mode: 'light' | 'dark'): void {
    variables['--current-mode'] = mode;
    variables['--is-dark'] = mode === 'dark' ? '1' : '0';
    variables['--is-light'] = mode === 'light' ? '1' : '0';
  }

  // ============================================================================
  // PRIVATE METHODS - CACHING
  // ============================================================================

  /**
   * Generate cache key for computation context
   */
  private generateCacheKey(context: ComputationContext): string {
    const { domain, mode, preferences, customizations } = context;
    const data = {
      domain,
      mode,
      preferences: {
        reducedMotion: preferences.reducedMotion,
        highContrast: preferences.highContrast,
        fontSize: preferences.fontSize,
      },
      customizations,
    };
    
    return btoa(JSON.stringify(data)).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Get cached theme
   */
  private getCachedTheme(key: string): ComputedTheme | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check TTL
    if (Date.now() - entry.timestamp > this.config.memoizationTTL) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access count
    entry.accessCount++;
    
    return entry.value;
  }

  /**
   * Cache computed theme
   */
  private cacheTheme(key: string, theme: ComputedTheme, computationTime: number): void {
    // Clean cache if at max size
    if (this.cache.size >= this.config.maxCacheSize) {
      this.cleanOldestCacheEntry();
    }

    this.cache.set(key, {
      key,
      value: theme,
      timestamp: Date.now(),
      accessCount: 1,
      computationTime,
    });

    this.updateCacheMetrics();
  }

  /**
   * Clean oldest cache entry
   */
  private cleanOldestCacheEntry(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Setup cache cleanup interval
   */
  private setupCacheCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.config.memoizationTTL) {
          keysToDelete.push(key);
        }
      }

      keysToDelete.forEach(key => this.cache.delete(key));
      
      if (keysToDelete.length > 0) {
        this.updateCacheMetrics();
      }
    }, this.config.memoizationTTL / 2);
  }

  // ============================================================================
  // PRIVATE METHODS - UTILITIES
  // ============================================================================

  /**
   * Resolve theme mode
   */
  private resolveMode(mode: ThemeMode): 'light' | 'dark' {
    if (mode !== 'system') return mode;
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'light';
  }

  /**
   * Generate theme hash
   */
  private generateThemeHash(domain: Domain, mode: ThemeMode, colors: ThemeColors): string {
    const data = JSON.stringify({ domain, mode, colors });
    let hash = 0;
    
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  }

  /**
   * Get fallback theme
   */
  private getFallbackTheme(context: ComputationContext): ComputedTheme {
    return {
      mode: 'light',
      domain: context.domain,
      colors: {
        primary: '#3B82F6',
        secondary: '#06B6D4',
        accent: '#1E40AF',
        textPrimary: '#0a0a0a',
        textSecondary: '#404040',
        textTertiary: '#737373',
        textInverse: '#ffffff',
        backgroundPrimary: '#ffffff',
        backgroundSecondary: '#fafafa',
        backgroundTertiary: '#f5f5f5',
        backgroundElevated: '#ffffff',
        backgroundOverlay: 'rgba(255, 255, 255, 0.95)',
        borderPrimary: '#e5e5e5',
        borderSecondary: '#d4d4d4',
        borderAccent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        domainPrimary: '#3B82F6',
        domainSecondary: '#06B6D4',
        domainAccent: '#1E40AF',
        domainGradientStart: '#3B82F6',
        domainGradientEnd: '#06B6D4',
      },
      typography: this.getBaseTypography(),
      spacing: this.getBaseSpacing(),
      animations: this.getBaseAnimations(),
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      cssVariables: {},
      metadata: {
        version: '1.0.0',
        computedAt: context.timestamp,
        hash: 'fallback',
      },
    };
  }

  /**
   * Update computation metrics
   */
  private updateMetrics(cacheHit: boolean, computationTime: number): void {
    this.metrics.totalComputations++;
    this.metrics.lastComputationTime = computationTime;
    
    if (cacheHit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
      this.metrics.averageComputationTime = 
        (this.metrics.averageComputationTime + computationTime) / 2;
    }
    
    this.updateCacheMetrics();
  }

  /**
   * Update cache metrics
   */
  private updateCacheMetrics(): void {
    this.metrics.cacheSize = this.cache.size;
    this.metrics.cacheHitRate = 
      this.metrics.totalComputations > 0 
        ? (this.metrics.cacheHits / this.metrics.totalComputations) * 100 
        : 0;
  }
}

// Export singleton instance
export const themeComputer = new ThemeComputer();
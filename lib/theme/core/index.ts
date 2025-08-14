/**
 * Core Theme System Exports
 * 
 * Centralized exports for the unified theme engine core system.
 * Provides all necessary types, classes, and utilities for theme management.
 */

// Core theme engine
export { ThemeEngine, themeEngine } from './ThemeEngine';

// Event system
export { 
  ThemeEventEmitter, 
  ThemeEventUtils, 
  ThemeEventPerformanceMonitor,
  themeEventEmitter,
  themeEventPerformanceMonitor 
} from './events';

// CSS variables system
export { 
  CSSVariableManager, 
  CSSVariableUtils,
  cssVariableManager 
} from './cssVariables';

// Type definitions
export type {
  // Core types
  ThemeMode,
  ThemeEventType,
  ThemeChangeCallback,
  UnsubscribeFunction,
  
  // State interfaces
  UserThemePreferences,
  ThemeCustomizations,
  ThemeColors,
  ThemeTypography,
  ThemeSpacing,
  ThemeAnimations,
  ThemeShadows,
  ComputedTheme,
  ThemeConfig,
  ThemeState,
  ThemeError,
  ThemePerformanceMetrics,
  
  // Event interfaces
  ThemeEvent,
  ThemeUpdate,
  
  // Engine interfaces
  ThemeEngineConfig,
  ThemeSelector,
  ThemeMemoOptions,
} from './types';

// Utility functions
export const ThemeUtils = {
  /**
   * Check if theme mode is dark
   */
  isDarkMode: (mode: ThemeMode): boolean => mode === 'dark',
  
  /**
   * Check if theme mode is light
   */
  isLightMode: (mode: ThemeMode): boolean => mode === 'light',
  
  /**
   * Check if theme mode is system
   */
  isSystemMode: (mode: ThemeMode): boolean => mode === 'system',
  
  /**
   * Get opposite theme mode
   */
  getOppositeMode: (mode: ThemeMode): ThemeMode => {
    switch (mode) {
      case 'light': return 'dark';
      case 'dark': return 'light';
      case 'system': return 'system';
      default: return 'light';
    }
  },
  
  /**
   * Resolve system theme mode
   */
  resolveSystemMode: (mode: ThemeMode): 'light' | 'dark' => {
    if (mode !== 'system') return mode;
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'light';
  },
  
  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  },
  
  /**
   * Check if high contrast is preferred
   */
  prefersHighContrast: (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-contrast: high)').matches;
    }
    return false;
  },
  
  /**
   * Get system color scheme
   */
  getSystemColorScheme: (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  },
  
  /**
   * Create theme selector function
   */
  createSelector: <T>(selector: (theme: ComputedTheme) => T) => selector,
  
  /**
   * Merge theme customizations
   */
  mergeCustomizations: (
    base: ThemeCustomizations, 
    override: ThemeCustomizations
  ): ThemeCustomizations => {
    return {
      colors: { ...base.colors, ...override.colors },
      typography: { ...base.typography, ...override.typography },
      spacing: { ...base.spacing, ...override.spacing },
      animations: { ...base.animations, ...override.animations },
    };
  },
  
  /**
   * Validate theme configuration
   */
  validateThemeConfig: (config: ThemeConfig): boolean => {
    try {
      if (config.mode && !['light', 'dark', 'system'].includes(config.mode)) {
        return false;
      }
      
      if (config.domain && typeof config.domain !== 'string') {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  },
  
  /**
   * Generate theme hash
   */
  generateThemeHash: (theme: ComputedTheme): string => {
    const data = JSON.stringify({
      mode: theme.mode,
      domain: theme.domain,
      colors: theme.colors,
    });
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  },
  
  /**
   * Compare themes for equality
   */
  areThemesEqual: (theme1: ComputedTheme, theme2: ComputedTheme): boolean => {
    return theme1.metadata.hash === theme2.metadata.hash;
  },
  
  /**
   * Get theme performance score
   */
  getPerformanceScore: (metrics: ThemePerformanceMetrics): number => {
    const computationScore = Math.max(0, 100 - (metrics.computationTime / 10));
    const applicationScore = Math.max(0, 100 - (metrics.cssApplicationTime / 5));
    const renderScore = Math.max(0, 100 - (metrics.renderCount / 100));
    
    return Math.round((computationScore + applicationScore + renderScore) / 3);
  },
};

// Constants
export const THEME_CONSTANTS = {
  // Default values
  DEFAULT_MODE: 'system' as ThemeMode,
  DEFAULT_DOMAIN: 'full-stack' as const,
  
  // Performance thresholds
  MAX_COMPUTATION_TIME: 100, // ms
  MAX_APPLICATION_TIME: 50,   // ms
  MAX_RENDER_COUNT: 1000,
  
  // Cache settings
  CACHE_TTL: 30000,          // 30 seconds
  MAX_CACHE_SIZE: 100,
  
  // Event settings
  EVENT_BATCH_DELAY: 16,     // ~60fps
  MAX_EVENT_QUEUE_SIZE: 1000,
  
  // Storage keys
  STORAGE_KEYS: {
    MODE: 'theme-engine-mode',
    DOMAIN: 'theme-engine-domain',
    PREFERENCES: 'theme-engine-preferences',
    CUSTOMIZATIONS: 'theme-engine-customizations',
  },
  
  // CSS variable prefixes
  CSS_PREFIXES: {
    COLOR: '--color-',
    FONT: '--font-',
    SPACING: '--spacing-',
    SHADOW: '--shadow-',
    DURATION: '--duration-',
    EASING: '--easing-',
    TRANSITION: '--transition-',
    DOMAIN: '--domain-',
    THEME: '--theme-',
  },
} as const;
/**
 * Core Theme System Types
 * 
 * Centralized type definitions for the unified theme system.
 * Provides type safety and consistency across all theme-related operations.
 */

import { type Domain } from '@/lib/constants/domains';

// ============================================================================
// CORE THEME TYPES
// ============================================================================

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme update event types
 */
export type ThemeEventType = 'theme-changed' | 'domain-changed' | 'mode-changed' | 'preferences-changed';

/**
 * Theme change callback function
 */
export type ThemeChangeCallback = (event: ThemeEvent) => void;

/**
 * Unsubscribe function for theme event listeners
 */
export type UnsubscribeFunction = () => void;

// ============================================================================
// THEME STATE INTERFACES
// ============================================================================

/**
 * User theme preferences
 */
export interface UserThemePreferences {
  /** Reduced motion preference */
  reducedMotion: boolean;
  /** High contrast preference */
  highContrast: boolean;
  /** Font size preference */
  fontSize: 'small' | 'medium' | 'large';
  /** Custom theme overrides */
  customizations: ThemeCustomizations;
  /** Auto-detect system preferences */
  autoDetectPreferences: boolean;
}

/**
 * Theme customizations interface
 */
export interface ThemeCustomizations {
  /** Custom color overrides */
  colors?: Partial<ThemeColors>;
  /** Custom typography overrides */
  typography?: Partial<ThemeTypography>;
  /** Custom spacing overrides */
  spacing?: Partial<ThemeSpacing>;
  /** Custom animation overrides */
  animations?: Partial<ThemeAnimations>;
}

/**
 * Theme colors interface
 */
export interface ThemeColors {
  // Primary colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Background colors
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundElevated: string;
  backgroundOverlay: string;
  
  // Border colors
  borderPrimary: string;
  borderSecondary: string;
  borderAccent: string;
  
  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Domain-specific colors
  domainPrimary: string;
  domainSecondary: string;
  domainAccent: string;
  domainGradientStart: string;
  domainGradientEnd: string;
}

/**
 * Theme typography interface
 */
export interface ThemeTypography {
  fontFamily: {
    sans: string;
    mono: string;
    display: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

/**
 * Theme spacing interface
 */
export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

/**
 * Theme animations interface
 */
export interface ThemeAnimations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
  };
  transitions: {
    colors: string;
    transform: string;
    opacity: string;
    all: string;
  };
}

/**
 * Theme shadows interface
 */
export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  glow: string;
  inner: string;
}

/**
 * Computed theme interface - the final theme object used by components
 */
export interface ComputedTheme {
  /** Theme mode */
  mode: ThemeMode;
  /** Current domain */
  domain: Domain;
  /** Computed colors */
  colors: ThemeColors;
  /** Typography settings */
  typography: ThemeTypography;
  /** Spacing values */
  spacing: ThemeSpacing;
  /** Animation settings */
  animations: ThemeAnimations;
  /** Shadow definitions */
  shadows: ThemeShadows;
  /** CSS custom properties */
  cssVariables: Record<string, string>;
  /** Theme metadata */
  metadata: {
    version: string;
    computedAt: number;
    hash: string;
  };
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  /** Theme mode */
  mode?: ThemeMode;
  /** Domain */
  domain?: Domain;
  /** User preferences */
  preferences?: Partial<UserThemePreferences>;
  /** Custom overrides */
  customizations?: ThemeCustomizations;
}

/**
 * Theme state interface - internal state management
 */
export interface ThemeState {
  /** Current theme mode */
  mode: ThemeMode;
  /** Current domain */
  domain: Domain;
  /** User preferences */
  preferences: UserThemePreferences;
  /** Theme customizations */
  customizations: ThemeCustomizations;
  /** Computed theme */
  computed: ComputedTheme;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ThemeError | null;
  /** Performance metrics */
  performance: ThemePerformanceMetrics;
}

/**
 * Theme error interface
 */
export interface ThemeError {
  /** Error code */
  code: string;
  /** Error message */
  message: string;
  /** Error details */
  details?: any;
  /** Timestamp */
  timestamp: number;
  /** Recovery suggestions */
  recovery?: string[];
}

/**
 * Theme performance metrics
 */
export interface ThemePerformanceMetrics {
  /** Last update timestamp */
  lastUpdate: number;
  /** Number of renders */
  renderCount: number;
  /** Average update duration */
  averageUpdateDuration: number;
  /** Theme computation time */
  computationTime: number;
  /** CSS application time */
  cssApplicationTime: number;
}

/**
 * Theme event interface
 */
export interface ThemeEvent {
  /** Event type */
  type: ThemeEventType;
  /** Event payload */
  payload: {
    /** Previous state */
    previous?: Partial<ThemeState>;
    /** Current state */
    current: Partial<ThemeState>;
    /** Change metadata */
    metadata?: {
      source: string;
      timestamp: number;
      duration?: number;
    };
  };
}

/**
 * Theme update interface
 */
export interface ThemeUpdate {
  /** Update type */
  type: 'mode' | 'domain' | 'preferences' | 'customizations';
  /** Update payload */
  payload: any;
  /** Update options */
  options?: {
    /** Skip persistence */
    skipPersistence?: boolean;
    /** Skip event emission */
    skipEvents?: boolean;
    /** Batch with other updates */
    batch?: boolean;
  };
}

// ============================================================================
// THEME ENGINE INTERFACES
// ============================================================================

/**
 * Theme engine configuration
 */
export interface ThemeEngineConfig {
  /** Initial theme mode */
  initialMode?: ThemeMode;
  /** Initial domain */
  initialDomain?: Domain;
  /** Enable persistence */
  enablePersistence?: boolean;
  /** Persistence key prefix */
  persistenceKeyPrefix?: string;
  /** Enable performance monitoring */
  enablePerformanceMonitoring?: boolean;
  /** Enable debug mode */
  enableDebugMode?: boolean;
  /** Custom theme defaults */
  defaults?: Partial<ThemeState>;
}

/**
 * Theme selector function type
 */
export type ThemeSelector<T> = (theme: ComputedTheme) => T;

/**
 * Theme memoization options
 */
export interface ThemeMemoOptions {
  /** Dependencies for memoization */
  dependencies?: any[];
  /** Custom equality function */
  isEqual?: (a: any, b: any) => boolean;
  /** Cache size limit */
  cacheSize?: number;
}
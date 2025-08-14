/**
 * Unified Theme Engine
 * 
 * Core theme engine that consolidates all theme concerns into a single,
 * performant, and developer-friendly system. Manages theme state, computation,
 * and application with event-driven updates and performance optimization.
 */

import { type Domain } from '@/lib/constants/domains';
import { getDomainTheme } from '@/lib/config/domainThemes';
import { theme as baseTheme } from '@/lib/theme';
import {
  type ThemeMode,
  type ThemeState,
  type ThemeConfig,
  type ComputedTheme,
  type ThemeEvent,
  type ThemeEventType,
  type ThemeUpdate,
  type ThemeChangeCallback,
  type UnsubscribeFunction,
  type ThemeEngineConfig,
  type UserThemePreferences,
  type ThemeCustomizations,
  type ThemeColors,
  type ThemeError,
  type ThemePerformanceMetrics,
} from './types';

/**
 * Unified Theme Engine Class
 * 
 * Provides centralized theme management with:
 * - Unified state management
 * - Performance optimization
 * - Event-driven updates
 * - CSS custom property generation
 * - Domain and mode integration
 * - Persistence and caching
 */
export class ThemeEngine {
  private state: ThemeState;
  private listeners: Map<string, ThemeChangeCallback> = new Map();
  private config: ThemeEngineConfig;
  private updateQueue: ThemeUpdate[] = [];
  private isProcessingUpdates = false;
  private memoCache: Map<string, { value: any; dependencies: any[]; timestamp: number }> = new Map();
  private performanceStartTime = 0;

  constructor(config: ThemeEngineConfig = {}) {
    this.config = {
      initialMode: 'system',
      initialDomain: 'full-stack',
      enablePersistence: true,
      persistenceKeyPrefix: 'theme-engine',
      enablePerformanceMonitoring: true,
      enableDebugMode: false,
      ...config,
    };

    // Initialize state
    this.state = this.initializeState();

    // Bind methods
    this.setTheme = this.setTheme.bind(this);
    this.computeTheme = this.computeTheme.bind(this);
    this.applyTheme = this.applyTheme.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.emit = this.emit.bind(this);

    // Initialize theme
    this.initializeTheme();
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get current theme state
   */
  get currentTheme(): ComputedTheme {
    return this.state.computed;
  }

  /**
   * Get current theme mode
   */
  get mode(): ThemeMode {
    return this.state.mode;
  }

  /**
   * Get current domain
   */
  get domain(): Domain {
    return this.state.domain;
  }

  /**
   * Get loading state
   */
  get isLoading(): boolean {
    return this.state.isLoading;
  }

  /**
   * Get error state
   */
  get error(): ThemeError | null {
    return this.state.error;
  }

  /**
   * Get performance metrics
   */
  get performance(): ThemePerformanceMetrics {
    return this.state.performance;
  }

  /**
   * Set theme configuration
   */
  async setTheme(config: ThemeConfig): Promise<void> {
    this.startPerformanceTracking();

    try {
      const updates: ThemeUpdate[] = [];

      // Queue mode update
      if (config.mode && config.mode !== this.state.mode) {
        updates.push({
          type: 'mode',
          payload: config.mode,
        });
      }

      // Queue domain update
      if (config.domain && config.domain !== this.state.domain) {
        updates.push({
          type: 'domain',
          payload: config.domain,
        });
      }

      // Queue preferences update
      if (config.preferences) {
        updates.push({
          type: 'preferences',
          payload: { ...this.state.preferences, ...config.preferences },
        });
      }

      // Queue customizations update
      if (config.customizations) {
        updates.push({
          type: 'customizations',
          payload: { ...this.state.customizations, ...config.customizations },
        });
      }

      // Batch process updates
      await this.batchThemeUpdates(updates);
    } catch (error) {
      this.handleError('THEME_UPDATE_FAILED', 'Failed to update theme', error);
    } finally {
      this.endPerformanceTracking('setTheme');
    }
  }

  /**
   * Set theme mode
   */
  async setMode(mode: ThemeMode): Promise<void> {
    await this.setTheme({ mode });
  }

  /**
   * Set domain
   */
  async setDomain(domain: Domain): Promise<void> {
    await this.setTheme({ domain });
  }

  /**
   * Toggle theme mode between light and dark
   */
  async toggleMode(): Promise<void> {
    const newMode = this.state.mode === 'light' ? 'dark' : 'light';
    await this.setMode(newMode);
  }

  /**
   * Compute theme for given domain and mode
   */
  computeTheme(domain: Domain = this.state.domain, mode: ThemeMode = this.state.mode): ComputedTheme {
    const cacheKey = `${domain}-${mode}-${JSON.stringify(this.state.customizations)}`;
    
    // Check memo cache
    const cached = this.memoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5000) { // 5 second cache
      return cached.value;
    }

    this.startPerformanceTracking();

    try {
      // Resolve system mode
      const resolvedMode = this.resolveSystemMode(mode);
      
      // Get domain theme configuration
      const domainTheme = getDomainTheme(domain);
      if (!domainTheme) {
        throw new Error(`Domain theme not found: ${domain}`);
      }

      // Compute colors
      const colors = this.computeColors(domainTheme, resolvedMode);
      
      // Get typography, spacing, animations from base theme
      const typography = baseTheme.text; // Will be enhanced
      const spacing = this.computeSpacing();
      const animations = this.computeAnimations();
      const shadows = this.computeShadows(resolvedMode);

      // Generate CSS variables
      const cssVariables = this.generateCSSVariables(colors, typography, spacing, animations, shadows);

      // Create computed theme
      const computed: ComputedTheme = {
        mode: resolvedMode,
        domain,
        colors,
        typography: typography as any, // Type conversion for now
        spacing,
        animations,
        shadows,
        cssVariables,
        metadata: {
          version: '1.0.0',
          computedAt: Date.now(),
          hash: this.generateThemeHash(domain, resolvedMode, this.state.customizations),
        },
      };

      // Cache result
      this.memoCache.set(cacheKey, {
        value: computed,
        dependencies: [domain, resolvedMode, this.state.customizations],
        timestamp: Date.now(),
      });

      // Clean old cache entries
      this.cleanMemoCache();

      return computed;
    } catch (error) {
      this.handleError('THEME_COMPUTATION_FAILED', 'Failed to compute theme', error);
      return this.getFallbackTheme();
    } finally {
      this.endPerformanceTracking('computeTheme');
    }
  }

  /**
   * Apply theme to DOM
   */
  applyTheme(theme: ComputedTheme = this.state.computed): void {
    if (typeof window === 'undefined') return;

    this.startPerformanceTracking();

    try {
      const root = document.documentElement;

      // Apply CSS custom properties
      Object.entries(theme.cssVariables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Apply theme classes
      this.applyThemeClasses(theme);

      // Emit theme applied event
      this.emit({
        type: 'theme-changed',
        payload: {
          current: { computed: theme },
          metadata: {
            source: 'applyTheme',
            timestamp: Date.now(),
          },
        },
      });
    } catch (error) {
      this.handleError('THEME_APPLICATION_FAILED', 'Failed to apply theme', error);
    } finally {
      this.endPerformanceTracking('applyTheme');
    }
  }

  /**
   * Batch multiple theme updates for performance
   */
  async batchThemeUpdates(updates: ThemeUpdate[]): Promise<void> {
    // Add to queue
    this.updateQueue.push(...updates);

    // Process queue if not already processing
    if (!this.isProcessingUpdates) {
      await this.processUpdateQueue();
    }
  }

  /**
   * Preload themes for given domains
   */
  async preloadThemes(domains: Domain[]): Promise<void> {
    const modes: ThemeMode[] = ['light', 'dark'];
    
    for (const domain of domains) {
      for (const mode of modes) {
        // Compute and cache theme
        this.computeTheme(domain, mode);
      }
    }
  }

  /**
   * Subscribe to theme changes
   */
  subscribe(callback: ThemeChangeCallback): UnsubscribeFunction {
    const id = Math.random().toString(36).substr(2, 9);
    this.listeners.set(id, callback);

    return () => {
      this.listeners.delete(id);
    };
  }

  /**
   * Emit theme event
   */
  emit(event: ThemeEvent): void {
    if (this.config.enableDebugMode) {
      console.log('[ThemeEngine] Event:', event);
    }

    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('[ThemeEngine] Listener error:', error);
      }
    });
  }

  /**
   * Get theme selector for optimized access
   */
  createSelector<T>(selector: (theme: ComputedTheme) => T): () => T {
    return () => selector(this.currentTheme);
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.memoCache.clear();
  }

  /**
   * Destroy theme engine and cleanup
   */
  destroy(): void {
    this.listeners.clear();
    this.memoCache.clear();
    this.updateQueue.length = 0;
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Initialize theme state
   */
  private initializeState(): ThemeState {
    const mode = this.loadPersistedMode() || this.config.initialMode || 'system';
    const domain = this.loadPersistedDomain() || this.config.initialDomain || 'full-stack';
    
    const preferences: UserThemePreferences = {
      reducedMotion: this.detectReducedMotion(),
      highContrast: this.detectHighContrast(),
      fontSize: 'medium',
      customizations: {},
      autoDetectPreferences: true,
      ...this.config.defaults?.preferences,
    };

    const customizations: ThemeCustomizations = {
      ...this.config.defaults?.customizations,
    };

    const state: ThemeState = {
      mode,
      domain,
      preferences,
      customizations,
      computed: {} as ComputedTheme, // Will be computed in initializeTheme
      isLoading: true,
      error: null,
      performance: {
        lastUpdate: Date.now(),
        renderCount: 0,
        averageUpdateDuration: 0,
        computationTime: 0,
        cssApplicationTime: 0,
      },
    };

    return state;
  }

  /**
   * Initialize theme system
   */
  private async initializeTheme(): Promise<void> {
    try {
      // Compute initial theme
      const computed = this.computeTheme(this.state.domain, this.state.mode);
      
      // Update state
      this.state = {
        ...this.state,
        computed,
        isLoading: false,
      };

      // Apply theme
      this.applyTheme(computed);

      // Setup system preference listeners
      this.setupSystemListeners();

    } catch (error) {
      this.handleError('THEME_INITIALIZATION_FAILED', 'Failed to initialize theme', error);
    }
  }

  /**
   * Process update queue
   */
  private async processUpdateQueue(): Promise<void> {
    if (this.isProcessingUpdates || this.updateQueue.length === 0) return;

    this.isProcessingUpdates = true;
    const updates = [...this.updateQueue];
    this.updateQueue.length = 0;

    try {
      const previousState = { ...this.state };
      let hasChanges = false;

      // Process each update
      for (const update of updates) {
        switch (update.type) {
          case 'mode':
            if (this.state.mode !== update.payload) {
              this.state.mode = update.payload;
              hasChanges = true;
            }
            break;
          case 'domain':
            if (this.state.domain !== update.payload) {
              this.state.domain = update.payload;
              hasChanges = true;
            }
            break;
          case 'preferences':
            this.state.preferences = update.payload;
            hasChanges = true;
            break;
          case 'customizations':
            this.state.customizations = update.payload;
            hasChanges = true;
            break;
        }
      }

      // Recompute theme if changes occurred
      if (hasChanges) {
        const computed = this.computeTheme(this.state.domain, this.state.mode);
        this.state.computed = computed;

        // Apply theme
        this.applyTheme(computed);

        // Persist changes
        if (this.config.enablePersistence) {
          this.persistState();
        }

        // Emit change event
        this.emit({
          type: 'theme-changed',
          payload: {
            previous: previousState,
            current: this.state,
            metadata: {
              source: 'batchUpdate',
              timestamp: Date.now(),
            },
          },
        });
      }
    } catch (error) {
      this.handleError('UPDATE_PROCESSING_FAILED', 'Failed to process updates', error);
    } finally {
      this.isProcessingUpdates = false;
    }
  }

  /**
   * Compute theme colors
   */
  private computeColors(domainTheme: any, mode: 'light' | 'dark'): ThemeColors {
    const baseColors = baseTheme.colors;
    const modeColors = mode === 'dark' ? baseTheme.text.dark : baseTheme.text.light;
    const backgroundColors = mode === 'dark' ? baseTheme.background.dark : baseTheme.background.light;
    const borderColors = mode === 'dark' ? baseTheme.border.dark : baseTheme.border.light;

    return {
      // Primary colors from domain theme
      primary: domainTheme.primaryColor,
      secondary: domainTheme.secondaryColor,
      accent: domainTheme.accentColor,

      // Text colors
      textPrimary: modeColors.primary,
      textSecondary: modeColors.secondary,
      textTertiary: modeColors.tertiary,
      textInverse: modeColors.inverse,

      // Background colors
      backgroundPrimary: backgroundColors.primary,
      backgroundSecondary: backgroundColors.secondary,
      backgroundTertiary: backgroundColors.tertiary,
      backgroundElevated: backgroundColors.elevated,
      backgroundOverlay: backgroundColors.overlay,

      // Border colors
      borderPrimary: borderColors.primary,
      borderSecondary: borderColors.secondary,
      borderAccent: borderColors.accent,

      // Semantic colors
      success: baseColors.success[mode],
      warning: baseColors.warning[mode],
      error: baseColors.error[mode],
      info: baseColors.info[mode],

      // Domain-specific colors
      domainPrimary: domainTheme.primaryColor,
      domainSecondary: domainTheme.secondaryColor,
      domainAccent: domainTheme.accentColor,
      domainGradientStart: domainTheme.gradientColors[0],
      domainGradientEnd: domainTheme.gradientColors[1],
    };
  }

  /**
   * Compute spacing values
   */
  private computeSpacing() {
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
   * Compute animation values
   */
  private computeAnimations() {
    const reducedMotion = this.state.preferences.reducedMotion;
    
    return {
      duration: {
        fast: reducedMotion ? '0ms' : '150ms',
        normal: reducedMotion ? '0ms' : '300ms',
        slow: reducedMotion ? '0ms' : '500ms',
      },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitions: {
        colors: reducedMotion ? 'none' : 'color 300ms ease, background-color 300ms ease, border-color 300ms ease',
        transform: reducedMotion ? 'none' : 'transform 300ms ease',
        opacity: reducedMotion ? 'none' : 'opacity 300ms ease',
        all: reducedMotion ? 'none' : 'all 300ms ease',
      },
    };
  }

  /**
   * Compute shadow values
   */
  private computeShadows(mode: 'light' | 'dark') {
    return baseTheme.shadows[mode];
  }

  /**
   * Generate CSS custom properties
   */
  private generateCSSVariables(colors: ThemeColors, typography: any, spacing: any, animations: any, shadows: any): Record<string, string> {
    return {
      // Colors
      '--theme-primary': colors.primary,
      '--theme-secondary': colors.secondary,
      '--theme-accent': colors.accent,
      '--theme-text-primary': colors.textPrimary,
      '--theme-text-secondary': colors.textSecondary,
      '--theme-text-tertiary': colors.textTertiary,
      '--theme-bg-primary': colors.backgroundPrimary,
      '--theme-bg-secondary': colors.backgroundSecondary,
      '--theme-bg-tertiary': colors.backgroundTertiary,
      '--theme-border-primary': colors.borderPrimary,
      '--theme-border-secondary': colors.borderSecondary,
      '--theme-success': colors.success,
      '--theme-warning': colors.warning,
      '--theme-error': colors.error,
      '--theme-info': colors.info,
      
      // Domain colors
      '--domain-primary': colors.domainPrimary,
      '--domain-secondary': colors.domainSecondary,
      '--domain-accent': colors.domainAccent,
      '--domain-gradient': `linear-gradient(135deg, ${colors.domainGradientStart}, ${colors.domainGradientEnd})`,
      
      // Animations
      '--theme-duration-fast': animations.duration.fast,
      '--theme-duration-normal': animations.duration.normal,
      '--theme-duration-slow': animations.duration.slow,
      '--theme-transition-colors': animations.transitions.colors,
      '--theme-transition-transform': animations.transitions.transform,
      
      // Shadows
      '--theme-shadow-sm': shadows.sm,
      '--theme-shadow-md': shadows.md,
      '--theme-shadow-lg': shadows.lg,
      '--theme-shadow-glow': shadows.glow,
    };
  }

  /**
   * Apply theme classes to DOM
   */
  private applyThemeClasses(theme: ComputedTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'system');
    body.className = body.className.replace(/domain-[\w-]+/g, '').replace(/theme-[\w-]+/g, '');

    // Add new theme classes
    root.classList.add(theme.mode);
    body.classList.add(`domain-${theme.domain}`, `theme-${theme.mode}`);

    // Add accessibility classes
    if (this.state.preferences.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    if (this.state.preferences.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }

  /**
   * Resolve system theme mode
   */
  private resolveSystemMode(mode: ThemeMode): 'light' | 'dark' {
    if (mode !== 'system') return mode;
    
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return 'light';
  }

  /**
   * Setup system preference listeners
   */
  private setupSystemListeners(): void {
    if (typeof window === 'undefined') return;

    // Color scheme listener
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleColorSchemeChange = () => {
      if (this.state.mode === 'system') {
        const computed = this.computeTheme(this.state.domain, 'system');
        this.state.computed = computed;
        this.applyTheme(computed);
      }
    };

    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);

    // Reduced motion listener
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleReducedMotionChange = () => {
      if (this.state.preferences.autoDetectPreferences) {
        this.setTheme({
          preferences: {
            reducedMotion: reducedMotionQuery.matches,
          },
        });
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
  }

  /**
   * Detect reduced motion preference
   */
  private detectReducedMotion(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }

  /**
   * Detect high contrast preference
   */
  private detectHighContrast(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-contrast: high)').matches;
    }
    return false;
  }

  /**
   * Load persisted theme mode
   */
  private loadPersistedMode(): ThemeMode | null {
    if (!this.config.enablePersistence || typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`${this.config.persistenceKeyPrefix}-mode`);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as ThemeMode;
      }
    } catch (error) {
      console.warn('[ThemeEngine] Failed to load persisted mode:', error);
    }
    
    return null;
  }

  /**
   * Load persisted domain
   */
  private loadPersistedDomain(): Domain | null {
    if (!this.config.enablePersistence || typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`${this.config.persistenceKeyPrefix}-domain`);
      if (stored) {
        return stored as Domain;
      }
    } catch (error) {
      console.warn('[ThemeEngine] Failed to load persisted domain:', error);
    }
    
    return null;
  }

  /**
   * Persist current state
   */
  private persistState(): void {
    if (!this.config.enablePersistence || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`${this.config.persistenceKeyPrefix}-mode`, this.state.mode);
      localStorage.setItem(`${this.config.persistenceKeyPrefix}-domain`, this.state.domain);
      localStorage.setItem(`${this.config.persistenceKeyPrefix}-preferences`, JSON.stringify(this.state.preferences));
    } catch (error) {
      console.warn('[ThemeEngine] Failed to persist state:', error);
    }
  }

  /**
   * Generate theme hash for caching
   */
  private generateThemeHash(domain: Domain, mode: ThemeMode, customizations: ThemeCustomizations): string {
    const data = JSON.stringify({ domain, mode, customizations });
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Clean old memo cache entries
   */
  private cleanMemoCache(): void {
    const now = Date.now();
    const maxAge = 30000; // 30 seconds
    
    for (const [key, entry] of this.memoCache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.memoCache.delete(key);
      }
    }
  }

  /**
   * Get fallback theme for error recovery
   */
  private getFallbackTheme(): ComputedTheme {
    return {
      mode: 'light',
      domain: 'full-stack',
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
      typography: {} as any,
      spacing: this.computeSpacing(),
      animations: {
        duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
        easing: { linear: 'linear', easeIn: 'ease-in', easeOut: 'ease-out', easeInOut: 'ease-in-out', spring: 'ease' },
        transitions: { colors: 'color 300ms ease', transform: 'transform 300ms ease', opacity: 'opacity 300ms ease', all: 'all 300ms ease' },
      },
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
        computedAt: Date.now(),
        hash: 'fallback',
      },
    };
  }

  /**
   * Handle errors with recovery
   */
  private handleError(code: string, message: string, details?: any): void {
    const error: ThemeError = {
      code,
      message,
      details,
      timestamp: Date.now(),
      recovery: ['Try refreshing the page', 'Check browser console for details'],
    };

    this.state.error = error;

    if (this.config.enableDebugMode) {
      console.error('[ThemeEngine] Error:', error);
    }

    // Emit error event
    this.emit({
      type: 'theme-changed',
      payload: {
        current: { error },
        metadata: {
          source: 'error',
          timestamp: Date.now(),
        },
      },
    });
  }

  /**
   * Start performance tracking
   */
  private startPerformanceTracking(): void {
    if (this.config.enablePerformanceMonitoring) {
      this.performanceStartTime = performance.now();
    }
  }

  /**
   * End performance tracking
   */
  private endPerformanceTracking(operation: string): void {
    if (this.config.enablePerformanceMonitoring && this.performanceStartTime > 0) {
      const duration = performance.now() - this.performanceStartTime;
      
      // Update performance metrics
      this.state.performance.lastUpdate = Date.now();
      this.state.performance.renderCount++;
      this.state.performance.averageUpdateDuration = 
        (this.state.performance.averageUpdateDuration + duration) / 2;

      if (operation === 'computeTheme') {
        this.state.performance.computationTime = duration;
      } else if (operation === 'applyTheme') {
        this.state.performance.cssApplicationTime = duration;
      }

      if (this.config.enableDebugMode) {
        console.log(`[ThemeEngine] ${operation} took ${duration.toFixed(2)}ms`);
      }

      this.performanceStartTime = 0;
    }
  }
}

// Export singleton instance
export const themeEngine = new ThemeEngine();
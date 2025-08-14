/**
 * Theme State Management System
 * 
 * Robust state management for all theme-related data with:
 * - Persistence with localStorage and SSR compatibility
 * - Theme preloading and caching mechanisms
 * - Validation and error handling systems
 * - Performance optimization and monitoring
 */

import { type Domain } from '@/lib/constants/domains';
import {
  type ThemeMode,
  type ThemeState,
  type ThemeConfig,
  type ComputedTheme,
  type UserThemePreferences,
  type ThemeCustomizations,
  type ThemeError,
  type ThemePerformanceMetrics,
} from '../core/types';

/**
 * Theme state validation interface
 */
interface ThemeStateValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Theme state persistence interface
 */
interface ThemeStatePersistence {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * Theme state cache interface
 */
interface ThemeStateCache {
  get(key: string): any;
  set(key: string, value: any, ttl?: number): void;
  has(key: string): boolean;
  delete(key: string): void;
  clear(): void;
  size(): number;
}

/**
 * Theme State Manager
 * 
 * Centralized state management for theme system with:
 * - Comprehensive state structure
 * - Persistence and caching
 * - Validation and error handling
 * - Performance monitoring
 * - SSR compatibility
 */
export class ThemeStateManager {
  private state: ThemeState;
  private persistence: ThemeStatePersistence;
  private cache: ThemeStateCache;
  private validators: Map<string, (value: any) => ThemeStateValidation> = new Map();
  private subscribers: Set<(state: ThemeState) => void> = new Set();
  private isHydrated = false;
  private debugMode = false;

  constructor(
    initialState?: Partial<ThemeState>,
    persistence?: ThemeStatePersistence,
    cache?: ThemeStateCache,
    debugMode = false
  ) {
    this.debugMode = debugMode;
    this.persistence = persistence || new LocalStoragePersistence();
    this.cache = cache || new MemoryCache();
    
    // Initialize state
    this.state = this.createInitialState(initialState);
    
    // Setup validators
    this.setupValidators();
    
    // Initialize persistence
    this.initializePersistence();
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get current theme state
   */
  getState(): ThemeState {
    return { ...this.state };
  }

  /**
   * Get specific state property
   */
  getStateProperty<K extends keyof ThemeState>(key: K): ThemeState[K] {
    return this.state[key];
  }

  /**
   * Update theme state
   */
  async updateState(updates: Partial<ThemeState>): Promise<void> {
    const previousState = { ...this.state };
    
    try {
      // Validate updates
      const validation = this.validateStateUpdates(updates);
      if (!validation.isValid) {
        throw new Error(`State validation failed: ${validation.errors.join(', ')}`);
      }

      // Apply updates
      this.state = { ...this.state, ...updates };

      // Update performance metrics
      this.updatePerformanceMetrics();

      // Persist changes
      await this.persistState();

      // Cache updated state
      this.cacheState();

      // Notify subscribers
      this.notifySubscribers();

      if (this.debugMode) {
        console.log('[ThemeStateManager] State updated:', { previousState, currentState: this.state });
      }
    } catch (error) {
      // Rollback on error
      this.state = previousState;
      this.handleError('STATE_UPDATE_FAILED', 'Failed to update theme state', error);
      throw error;
    }
  }

  /**
   * Update theme mode
   */
  async updateMode(mode: ThemeMode): Promise<void> {
    await this.updateState({ mode });
  }

  /**
   * Update domain
   */
  async updateDomain(domain: Domain): Promise<void> {
    await this.updateState({ domain });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserThemePreferences>): Promise<void> {
    const updatedPreferences = { ...this.state.preferences, ...preferences };
    await this.updateState({ preferences: updatedPreferences });
  }

  /**
   * Update theme customizations
   */
  async updateCustomizations(customizations: Partial<ThemeCustomizations>): Promise<void> {
    const updatedCustomizations = { ...this.state.customizations, ...customizations };
    await this.updateState({ customizations: updatedCustomizations });
  }

  /**
   * Update computed theme
   */
  async updateComputedTheme(computed: ComputedTheme): Promise<void> {
    await this.updateState({ computed });
  }

  /**
   * Set loading state
   */
  async setLoading(isLoading: boolean): Promise<void> {
    await this.updateState({ isLoading });
  }

  /**
   * Set error state
   */
  async setError(error: ThemeError | null): Promise<void> {
    await this.updateState({ error });
  }

  /**
   * Reset state to defaults
   */
  async resetState(): Promise<void> {
    const defaultState = this.createInitialState();
    await this.updateState(defaultState);
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: ThemeState) => void): () => void {
    this.subscribers.add(callback);
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Preload theme configurations
   */
  async preloadThemes(domains: Domain[], modes: ThemeMode[]): Promise<void> {
    const preloadPromises: Promise<void>[] = [];

    for (const domain of domains) {
      for (const mode of modes) {
        const cacheKey = `preload-${domain}-${mode}`;
        
        if (!this.cache.has(cacheKey)) {
          preloadPromises.push(
            this.preloadThemeConfig(domain, mode).then(config => {
              this.cache.set(cacheKey, config, 300000); // 5 minute cache
            })
          );
        }
      }
    }

    await Promise.all(preloadPromises);

    if (this.debugMode) {
      console.log(`[ThemeStateManager] Preloaded ${preloadPromises.length} theme configurations`);
    }
  }

  /**
   * Get cached theme configuration
   */
  getCachedTheme(domain: Domain, mode: ThemeMode): any {
    const cacheKey = `preload-${domain}-${mode}`;
    return this.cache.get(cacheKey);
  }

  /**
   * Validate current state
   */
  validateState(): ThemeStateValidation {
    return this.validateStateUpdates(this.state);
  }

  /**
   * Hydrate state from persistence
   */
  async hydrate(): Promise<void> {
    if (this.isHydrated) return;

    try {
      // Load persisted state
      const persistedState = await this.loadPersistedState();
      
      if (persistedState) {
        // Validate persisted state
        const validation = this.validateStateUpdates(persistedState);
        
        if (validation.isValid) {
          // Merge with current state
          this.state = { ...this.state, ...persistedState };
          
          // Cache hydrated state
          this.cacheState();
          
          if (this.debugMode) {
            console.log('[ThemeStateManager] State hydrated from persistence');
          }
        } else {
          console.warn('[ThemeStateManager] Invalid persisted state, using defaults');
        }
      }

      this.isHydrated = true;
    } catch (error) {
      console.error('[ThemeStateManager] Failed to hydrate state:', error);
      this.isHydrated = true; // Continue with default state
    }
  }

  /**
   * Check if state is hydrated
   */
  isStateHydrated(): boolean {
    return this.isHydrated;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get state metrics
   */
  getMetrics() {
    return {
      isHydrated: this.isHydrated,
      subscriberCount: this.subscribers.size,
      cacheSize: this.cache.size(),
      performance: this.state.performance,
      hasError: this.state.error !== null,
      isLoading: this.state.isLoading,
    };
  }

  /**
   * Destroy state manager
   */
  destroy(): void {
    this.subscribers.clear();
    this.cache.clear();
    this.validators.clear();
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Create initial state
   */
  private createInitialState(overrides?: Partial<ThemeState>): ThemeState {
    const defaultPreferences: UserThemePreferences = {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      customizations: {},
      autoDetectPreferences: true,
    };

    const defaultCustomizations: ThemeCustomizations = {};

    const defaultPerformance: ThemePerformanceMetrics = {
      lastUpdate: Date.now(),
      renderCount: 0,
      averageUpdateDuration: 0,
      computationTime: 0,
      cssApplicationTime: 0,
    };

    return {
      mode: 'system',
      domain: 'full-stack',
      preferences: defaultPreferences,
      customizations: defaultCustomizations,
      computed: {} as ComputedTheme, // Will be set by theme engine
      isLoading: false,
      error: null,
      performance: defaultPerformance,
      ...overrides,
    };
  }

  /**
   * Setup state validators
   */
  private setupValidators(): void {
    // Mode validator
    this.validators.set('mode', (mode: ThemeMode) => {
      const validModes = ['light', 'dark', 'system'];
      const isValid = validModes.includes(mode);
      
      return {
        isValid,
        errors: isValid ? [] : [`Invalid theme mode: ${mode}`],
        warnings: [],
      };
    });

    // Domain validator
    this.validators.set('domain', (domain: Domain) => {
      const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];
      const isValid = validDomains.includes(domain);
      
      return {
        isValid,
        errors: isValid ? [] : [`Invalid domain: ${domain}`],
        warnings: [],
      };
    });

    // Preferences validator
    this.validators.set('preferences', (preferences: UserThemePreferences) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      if (typeof preferences.reducedMotion !== 'boolean') {
        errors.push('reducedMotion must be boolean');
      }

      if (typeof preferences.highContrast !== 'boolean') {
        errors.push('highContrast must be boolean');
      }

      if (!['small', 'medium', 'large'].includes(preferences.fontSize)) {
        errors.push('fontSize must be small, medium, or large');
      }

      if (typeof preferences.autoDetectPreferences !== 'boolean') {
        errors.push('autoDetectPreferences must be boolean');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    });
  }

  /**
   * Validate state updates
   */
  private validateStateUpdates(updates: Partial<ThemeState>): ThemeStateValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate each property
    Object.entries(updates).forEach(([key, value]) => {
      const validator = this.validators.get(key);
      if (validator) {
        const validation = validator(value);
        errors.push(...validation.errors);
        warnings.push(...validation.warnings);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Initialize persistence
   */
  private async initializePersistence(): Promise<void> {
    try {
      // Check if persistence is available
      if (typeof window !== 'undefined') {
        await this.hydrate();
      }
    } catch (error) {
      console.warn('[ThemeStateManager] Failed to initialize persistence:', error);
    }
  }

  /**
   * Persist current state
   */
  private async persistState(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const persistableState = {
        mode: this.state.mode,
        domain: this.state.domain,
        preferences: this.state.preferences,
        customizations: this.state.customizations,
      };

      await this.persistence.save('theme-state', persistableState);
    } catch (error) {
      console.warn('[ThemeStateManager] Failed to persist state:', error);
    }
  }

  /**
   * Load persisted state
   */
  private async loadPersistedState(): Promise<Partial<ThemeState> | null> {
    try {
      return await this.persistence.load('theme-state');
    } catch (error) {
      console.warn('[ThemeStateManager] Failed to load persisted state:', error);
      return null;
    }
  }

  /**
   * Cache current state
   */
  private cacheState(): void {
    this.cache.set('current-state', this.state, 60000); // 1 minute cache
  }

  /**
   * Preload theme configuration
   */
  private async preloadThemeConfig(domain: Domain, mode: ThemeMode): Promise<any> {
    // This would typically load theme configuration
    // For now, return a placeholder
    return {
      domain,
      mode,
      preloaded: true,
      timestamp: Date.now(),
    };
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(): void {
    const now = Date.now();
    const timeSinceLastUpdate = now - this.state.performance.lastUpdate;

    this.state.performance = {
      ...this.state.performance,
      lastUpdate: now,
      renderCount: this.state.performance.renderCount + 1,
      averageUpdateDuration: (this.state.performance.averageUpdateDuration + timeSinceLastUpdate) / 2,
    };
  }

  /**
   * Notify subscribers of state changes
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('[ThemeStateManager] Subscriber error:', error);
        // Remove problematic subscriber
        this.subscribers.delete(callback);
      }
    });
  }

  /**
   * Handle errors
   */
  private handleError(code: string, message: string, details?: any): void {
    const error: ThemeError = {
      code,
      message,
      details,
      timestamp: Date.now(),
      recovery: ['Try refreshing the page', 'Clear browser storage'],
    };

    this.state.error = error;

    if (this.debugMode) {
      console.error('[ThemeStateManager] Error:', error);
    }
  }
}

/**
 * Local Storage Persistence Implementation
 */
class LocalStoragePersistence implements ThemeStatePersistence {
  private prefix = 'theme-state-';

  async save(key: string, data: any): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      throw new Error(`Failed to save to localStorage: ${error}`);
    }
  }

  async load(key: string): Promise<any> {
    if (typeof window === 'undefined') return null;
    
    try {
      const serialized = localStorage.getItem(this.prefix + key);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      throw new Error(`Failed to load from localStorage: ${error}`);
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.prefix + key);
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Memory Cache Implementation
 */
class MemoryCache implements ThemeStateCache {
  private cache = new Map<string, { value: any; expires: number }>();
  private maxSize = 100;

  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  set(key: string, value: any, ttl = 60000): void {
    // Clean up if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + ttl,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    // Clean expired entries first
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
    
    return this.cache.size;
  }
}
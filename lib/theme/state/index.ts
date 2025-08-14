/**
 * Theme State Management Exports
 * 
 * Centralized exports for the theme state management system.
 * Provides state management, validation, and persistence utilities.
 */

// State management
export { ThemeStateManager } from './ThemeStateManager';

// Validation system
export { 
  ThemeValidator, 
  themeValidator,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
} from './validation';

// Persistence system
export { 
  ThemePersistenceManager, 
  themePersistenceManager 
} from './persistence';

// Utility functions
export const ThemeStateUtils = {
  /**
   * Create default theme state
   */
  createDefaultState: () => ({
    mode: 'system' as const,
    domain: 'full-stack' as const,
    preferences: {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium' as const,
      customizations: {},
      autoDetectPreferences: true,
    },
    customizations: {},
    computed: {} as any, // Will be set by theme engine
    isLoading: false,
    error: null,
    performance: {
      lastUpdate: Date.now(),
      renderCount: 0,
      averageUpdateDuration: 0,
      computationTime: 0,
      cssApplicationTime: 0,
    },
  }),

  /**
   * Merge theme states
   */
  mergeStates: (base: any, override: any) => ({
    ...base,
    ...override,
    preferences: {
      ...base.preferences,
      ...override.preferences,
    },
    customizations: {
      ...base.customizations,
      ...override.customizations,
    },
    performance: {
      ...base.performance,
      ...override.performance,
    },
  }),

  /**
   * Check if state is valid
   */
  isValidState: (state: any): boolean => {
    try {
      const requiredFields = ['mode', 'domain', 'preferences', 'customizations'];
      return requiredFields.every(field => field in state);
    } catch {
      return false;
    }
  },

  /**
   * Sanitize state for persistence
   */
  sanitizeForPersistence: (state: any) => ({
    mode: state.mode,
    domain: state.domain,
    preferences: state.preferences,
    customizations: state.customizations,
  }),

  /**
   * Calculate state size in bytes
   */
  calculateStateSize: (state: any): number => {
    try {
      return JSON.stringify(state).length * 2; // Approximate UTF-16 size
    } catch {
      return 0;
    }
  },

  /**
   * Deep clone state
   */
  cloneState: (state: any) => {
    try {
      return JSON.parse(JSON.stringify(state));
    } catch {
      return state;
    }
  },

  /**
   * Compare states for equality
   */
  areStatesEqual: (state1: any, state2: any): boolean => {
    try {
      return JSON.stringify(state1) === JSON.stringify(state2);
    } catch {
      return false;
    }
  },

  /**
   * Get state diff
   */
  getStateDiff: (oldState: any, newState: any) => {
    const diff: any = {};
    
    Object.keys(newState).forEach(key => {
      if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
        diff[key] = {
          old: oldState[key],
          new: newState[key],
        };
      }
    });

    return diff;
  },

  /**
   * Validate state transition
   */
  isValidTransition: (fromState: any, toState: any): boolean => {
    try {
      // Basic validation - can be enhanced
      const validModes = ['light', 'dark', 'system'];
      const validDomains = ['full-stack', 'cloud', 'data', 'ux-ui', 'consulting'];

      if (toState.mode && !validModes.includes(toState.mode)) {
        return false;
      }

      if (toState.domain && !validDomains.includes(toState.domain)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get state performance score
   */
  getPerformanceScore: (state: any): number => {
    if (!state.performance) return 0;

    const { renderCount, averageUpdateDuration, computationTime, cssApplicationTime } = state.performance;
    
    // Calculate score based on performance metrics
    const renderScore = Math.max(0, 100 - (renderCount / 100));
    const updateScore = Math.max(0, 100 - (averageUpdateDuration / 10));
    const computationScore = Math.max(0, 100 - (computationTime / 10));
    const applicationScore = Math.max(0, 100 - (cssApplicationTime / 5));

    return Math.round((renderScore + updateScore + computationScore + applicationScore) / 4);
  },
};

// Constants
export const THEME_STATE_CONSTANTS = {
  // Default values
  DEFAULT_MODE: 'system' as const,
  DEFAULT_DOMAIN: 'full-stack' as const,
  DEFAULT_FONT_SIZE: 'medium' as const,

  // Validation limits
  MAX_CUSTOMIZATIONS_SIZE: 1024 * 10, // 10KB
  MAX_PREFERENCES_SIZE: 1024 * 2,     // 2KB
  MAX_STATE_SIZE: 1024 * 50,          // 50KB

  // Performance thresholds
  MAX_RENDER_COUNT: 1000,
  MAX_UPDATE_DURATION: 100,    // ms
  MAX_COMPUTATION_TIME: 50,    // ms
  MAX_APPLICATION_TIME: 25,    // ms

  // Storage keys
  STORAGE_KEYS: {
    STATE: 'state',
    MODE: 'mode',
    DOMAIN: 'domain',
    PREFERENCES: 'preferences',
    CUSTOMIZATIONS: 'customizations',
  },

  // Validation error codes
  ERROR_CODES: {
    INVALID_MODE: 'INVALID_MODE',
    INVALID_DOMAIN: 'INVALID_DOMAIN',
    INVALID_PREFERENCES: 'INVALID_PREFERENCES',
    INVALID_CUSTOMIZATIONS: 'INVALID_CUSTOMIZATIONS',
    STATE_TOO_LARGE: 'STATE_TOO_LARGE',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
    INVALID_TRANSITION: 'INVALID_TRANSITION',
  },

  // Warning codes
  WARNING_CODES: {
    LARGE_STATE_SIZE: 'LARGE_STATE_SIZE',
    HIGH_RENDER_COUNT: 'HIGH_RENDER_COUNT',
    SLOW_UPDATES: 'SLOW_UPDATES',
    OUTDATED_VERSION: 'OUTDATED_VERSION',
  },
} as const;
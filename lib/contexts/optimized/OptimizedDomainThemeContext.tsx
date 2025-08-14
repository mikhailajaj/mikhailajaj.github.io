/**
 * Optimized Domain Theme Context
 * 
 * High-performance domain theme context with selective re-rendering,
 * domain persistence, SSR compatibility, and navigation integration.
 * 
 * Uses the ContextOptimizer framework for maximum performance.
 * 
 * @fileoverview Optimized domain theme context implementation
 */

"use client";

import React, { 
  createContext,
  useContext,
  useCallback, 
  useEffect, 
  useMemo,
  useRef,
  ReactNode,
  useState
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { 
  DOMAINS, 
  getDomain, 
  getDomainColor, 
  getDomainCSSVariables,
  type Domain, 
  type DomainConfig 
} from '@/lib/constants/domains';



/**
 * Performance metrics for domain theme operations
 */
export interface DomainThemePerformanceMetrics {
  renderCount: number;
  lastRender: number;
  averageRenderTime: number;
  themeApplicationTime: number;
  persistenceOperations: number;
}

/**
 * Domain theme state interface
 */
export interface DomainThemeState {
  currentDomain: Domain;
  previousDomain: Domain | null;
  isTransitioning: boolean;
  persistenceEnabled: boolean;
  ssrCompatible: boolean;
  navigationIntegrationEnabled: boolean;
  themeCache: Map<Domain, Record<string, string>>;
  lastThemeApplication: number;
}

/**
 * Optimized domain theme context value
 */
export interface OptimizedDomainThemeContextValue {
  // Core state
  state: DomainThemeState;
  
  // Domain operations
  setCurrentDomain: (domain: Domain) => void;
  setCurrentDomainWithTransition: (domain: Domain, transitionDuration?: number) => Promise<void>;
  
  // Domain utilities
  getDomainConfig: (domain: Domain) => DomainConfig;
  getDomainColor: (domain: Domain) => string;
  getCurrentDomainConfig: () => DomainConfig;
  getCurrentDomainColor: () => string;
  isDomainActive: (domain: Domain) => boolean;
  
  // Theme operations
  applyDomainTheme: (domain: Domain) => void;
  getDomainCSSVariables: (domain: Domain) => Record<string, string>;
  preloadDomainTheme: (domain: Domain) => Promise<void>;
  
  // Navigation integration
  navigateToDomain: (domain: Domain, path?: string) => Promise<void>;
  getDomainPath: (domain: Domain) => string;
  syncWithNavigation: () => void;
  
  // Performance and debugging
  performance: DomainThemePerformanceMetrics;
  clearPerformanceMetrics: () => void;
  
  // Error handling
  error: Error | null;
  clearError: () => void;
}

/**
 * Selector function type for selective re-rendering
 */
export type DomainThemeSelector<T> = (value: OptimizedDomainThemeContextValue) => T;

/**
 * Provider props
 */
interface OptimizedDomainThemeProviderProps {
  children: ReactNode;
  initialDomain?: Domain;
  persistSelection?: boolean;
  enableSSR?: boolean;
  enablePerformanceTracking?: boolean;
  enableNavigationIntegration?: boolean;
  onDomainChange?: (domain: Domain, previousDomain: Domain | null) => void;
  onError?: (error: Error) => void;
}

/**
 * Domain persistence utilities
 */
class DomainPersistence {
  private static readonly STORAGE_KEY = 'portfolio-domain-theme';
  private static readonly SSR_FALLBACK_DOMAIN: Domain = 'full-stack';

  /**
   * Save domain to localStorage with error handling
   */
  static save(domain: Domain): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, domain);
    } catch (error) {
      console.warn('Failed to persist domain selection:', error);
    }
  }

  /**
   * Load domain from localStorage with SSR compatibility
   */
  static load(fallback: Domain = this.SSR_FALLBACK_DOMAIN): Domain {
    if (typeof window === 'undefined') return fallback;
    
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved && DOMAINS.includes(saved as Domain)) {
        return saved as Domain;
      }
    } catch (error) {
      console.warn('Failed to load persisted domain:', error);
    }
    
    return fallback;
  }

  /**
   * Clear persisted domain
   */
  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear persisted domain:', error);
    }
  }
}

/**
 * Navigation integration utilities
 */
class DomainNavigation {
  private static readonly DOMAIN_PATHS: Record<Domain, string> = {
    'full-stack': '/full-stack',
    'cloud': '/cloud-engineering',
    'data': '/data-analytics',
    'ux-ui': '/ux-ui-design',
    'consulting': '/technical-consulting'
  };

  /**
   * Get path for domain
   */
  static getPath(domain: Domain): string {
    return this.DOMAIN_PATHS[domain] || '/';
  }

  /**
   * Extract domain from pathname
   */
  static extractDomain(pathname: string): Domain | null {
    for (const [domain, path] of Object.entries(this.DOMAIN_PATHS)) {
      if (pathname.startsWith(path)) {
        return domain as Domain;
      }
    }
    return null;
  }

  /**
   * Check if pathname matches domain
   */
  static matchesDomain(pathname: string, domain: Domain): boolean {
    const domainPath = this.getPath(domain);
    return pathname.startsWith(domainPath);
  }
}

/**
 * Domain theme context
 */
const OptimizedDomainThemeContext = createContext<OptimizedDomainThemeContextValue | undefined>(undefined);

/**
 * Optimized Domain Theme Provider
 */
export const OptimizedDomainThemeProvider: React.FC<OptimizedDomainThemeProviderProps> = ({
  children,
  initialDomain = 'full-stack',
  persistSelection = true,
  enableSSR = true,
  enablePerformanceTracking = process.env.NODE_ENV === 'development',
  enableNavigationIntegration = true,
  onDomainChange,
  onError
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state with SSR compatibility
  const [state, setState] = useState<DomainThemeState>(() => {
    // Priority: route domain > persisted domain > initial domain
    const routeDomain = enableNavigationIntegration ? DomainNavigation.extractDomain(pathname) : null;
    const persistedDomain = persistSelection ? DomainPersistence.load(initialDomain) : initialDomain;
    const currentDomain = routeDomain || persistedDomain;

    return {
      currentDomain,
      previousDomain: null,
      isTransitioning: false,
      persistenceEnabled: persistSelection,
      ssrCompatible: enableSSR,
      navigationIntegrationEnabled: enableNavigationIntegration,
      themeCache: new Map(),
      lastThemeApplication: 0
    };
  });

  const [error, setError] = useState<Error | null>(null);

  // Performance tracking
  const performanceRef = useRef<DomainThemePerformanceMetrics>({
    renderCount: 0,
    lastRender: Date.now(),
    averageRenderTime: 0,
    themeApplicationTime: 0,
    persistenceOperations: 0
  });

  // Track render performance
  useEffect(() => {
    if (enablePerformanceTracking) {
      const now = Date.now();
      const renderTime = now - performanceRef.current.lastRender;
      
      performanceRef.current.renderCount++;
      performanceRef.current.lastRender = now;
      performanceRef.current.averageRenderTime = 
        (performanceRef.current.averageRenderTime + renderTime) / 2;
    }
  });

  /**
   * Apply domain theme with performance tracking
   */
  const applyDomainTheme = useCallback((domain: Domain) => {
    if (typeof window === 'undefined') return;

    const startTime = performance.now();
    
    try {
      // Check cache first
      let variables = state.themeCache.get(domain);
      if (!variables) {
        variables = getDomainCSSVariables(domain);
        // Update cache asynchronously to avoid render issues
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            themeCache: new Map(prevState.themeCache).set(domain, variables!)
          }));
        }, 0);
      }

      const root = document.documentElement;
      
      // Apply CSS custom properties
      Object.entries(variables).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });
      
      // Update body class
      document.body.className = document.body.className
        .replace(/domain-[\w-]+/g, '')
        .concat(` domain-${domain}`);

      // Track performance
      if (enablePerformanceTracking) {
        performanceRef.current.themeApplicationTime = performance.now() - startTime;
        setTimeout(() => {
          setState(prevState => ({
            ...prevState,
            lastThemeApplication: performanceRef.current.themeApplicationTime
          }));
        }, 0);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Theme application failed');
      setError(error);
      onError?.(error);
    }
  }, [state.themeCache, enablePerformanceTracking, onError]);

  /**
   * Set current domain with optimizations
   */
  const setCurrentDomain = useCallback((domain: Domain) => {
    setState(prevState => {
      if (prevState.currentDomain === domain) return prevState;

      // Apply theme immediately
      applyDomainTheme(domain);

      // Persist if enabled
      if (persistSelection) {
        DomainPersistence.save(domain);
        performanceRef.current.persistenceOperations++;
      }

      // Notify change
      onDomainChange?.(domain, prevState.currentDomain);

      return {
        ...prevState,
        currentDomain: domain,
        previousDomain: prevState.currentDomain,
        isTransitioning: false
      };
    });
  }, [applyDomainTheme, persistSelection, onDomainChange]);

  /**
   * Set domain with transition animation
   */
  const setCurrentDomainWithTransition = useCallback(async (
    domain: Domain, 
    transitionDuration: number = 300
  ): Promise<void> => {
    return new Promise((resolve) => {
      setState(prevState => ({
        ...prevState,
        isTransitioning: true
      }));

      setTimeout(() => {
        setCurrentDomain(domain);
        setState(prevState => ({
          ...prevState,
          isTransitioning: false
        }));
        resolve();
      }, transitionDuration);
    });
  }, [setCurrentDomain]);

  /**
   * Navigate to domain with router integration
   */
  const navigateToDomain = useCallback(async (domain: Domain, path?: string): Promise<void> => {
    if (!enableNavigationIntegration) {
      setCurrentDomain(domain);
      return;
    }

    const targetPath = path || DomainNavigation.getPath(domain);
    
    try {
      router.push(targetPath);
      setCurrentDomain(domain);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Navigation failed');
      setError(error);
      onError?.(error);
    }
  }, [router, enableNavigationIntegration, setCurrentDomain, onError]);

  /**
   * Sync with navigation changes
   */
  const syncWithNavigation = useCallback(() => {
    if (!enableNavigationIntegration) return;

    const routeDomain = DomainNavigation.extractDomain(pathname);
    if (routeDomain && routeDomain !== state.currentDomain) {
      setCurrentDomain(routeDomain);
    }
  }, [pathname, state.currentDomain, enableNavigationIntegration, setCurrentDomain]);

  /**
   * Preload domain theme for performance
   */
  const preloadDomainTheme = useCallback(async (domain: Domain): Promise<void> => {
    if (state.themeCache.has(domain)) return;

    try {
      const variables = getDomainCSSVariables(domain);
      setState(prevState => ({
        ...prevState,
        themeCache: new Map(prevState.themeCache).set(domain, variables)
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Theme preload failed');
      setError(error);
      onError?.(error);
    }
  }, [state.themeCache, onError]);

  // Memoized utility functions
  const getDomainConfigValue = useCallback((domain: Domain): DomainConfig => {
    return getDomain(domain);
  }, []);

  const getDomainColorValue = useCallback((domain: Domain): string => {
    return getDomainColor(domain);
  }, []);

  const getCurrentDomainConfig = useCallback((): DomainConfig => {
    return getDomainConfigValue(state.currentDomain);
  }, [getDomainConfigValue, state.currentDomain]);

  const getCurrentDomainColor = useCallback((): string => {
    return getDomainColorValue(state.currentDomain);
  }, [getDomainColorValue, state.currentDomain]);

  const isDomainActive = useCallback((domain: Domain): boolean => {
    return state.currentDomain === domain;
  }, [state.currentDomain]);

  const getDomainCSSVariablesValue = useCallback((domain: Domain): Record<string, string> => {
    const cached = state.themeCache.get(domain);
    if (cached) return cached;
    
    const variables = getDomainCSSVariables(domain);
    // Use setTimeout to avoid state update during render
    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        themeCache: new Map(prevState.themeCache).set(domain, variables)
      }));
    }, 0);
    return variables;
  }, [state.themeCache]);

  const getDomainPath = useCallback((domain: Domain): string => {
    return DomainNavigation.getPath(domain);
  }, []);

  const clearPerformanceMetrics = useCallback(() => {
    performanceRef.current = {
      renderCount: 0,
      lastRender: Date.now(),
      averageRenderTime: 0,
      themeApplicationTime: 0,
      persistenceOperations: 0
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Sync with navigation on pathname changes
  useEffect(() => {
    syncWithNavigation();
  }, [syncWithNavigation]);

  // Apply initial theme
  useEffect(() => {
    applyDomainTheme(state.currentDomain);
  }, [state.currentDomain, applyDomainTheme]);

  // Preload common themes
  useEffect(() => {
    const commonDomains: Domain[] = ['full-stack', 'cloud', 'data'];
    commonDomains.forEach(domain => {
      if (domain !== state.currentDomain) {
        preloadDomainTheme(domain);
      }
    });
  }, [state.currentDomain, preloadDomainTheme]);

  // Memoized context value with selective re-rendering optimization
  const contextValue = useMemo<OptimizedDomainThemeContextValue>(() => ({
    state,
    setCurrentDomain,
    setCurrentDomainWithTransition,
    getDomainConfig: getDomainConfigValue,
    getDomainColor: getDomainColorValue,
    getCurrentDomainConfig,
    getCurrentDomainColor,
    isDomainActive,
    applyDomainTheme,
    getDomainCSSVariables: getDomainCSSVariablesValue,
    preloadDomainTheme,
    navigateToDomain,
    getDomainPath,
    syncWithNavigation,
    performance: performanceRef.current,
    clearPerformanceMetrics,
    error,
    clearError
  }), [
    state,
    setCurrentDomain,
    setCurrentDomainWithTransition,
    getDomainConfigValue,
    getDomainColorValue,
    getCurrentDomainConfig,
    getCurrentDomainColor,
    isDomainActive,
    applyDomainTheme,
    getDomainCSSVariablesValue,
    preloadDomainTheme,
    navigateToDomain,
    getDomainPath,
    syncWithNavigation,
    clearPerformanceMetrics,
    error,
    clearError
  ]);

  return (
    <OptimizedDomainThemeContext.Provider value={contextValue}>
      {children}
    </OptimizedDomainThemeContext.Provider>
  );
};

/**
 * Hook to use optimized domain theme context
 */
export const useOptimizedDomainTheme = (): OptimizedDomainThemeContextValue => {
  const context = useContext(OptimizedDomainThemeContext);
  
  if (context === undefined) {
    throw new Error('useOptimizedDomainTheme must be used within an OptimizedDomainThemeProvider');
  }
  
  return context;
};

/**
 * Hook with selector for selective re-rendering
 */
export const useOptimizedDomainThemeSelector = <T,>(
  selector: DomainThemeSelector<T>
): T => {
  const context = useOptimizedDomainTheme();
  return useMemo(() => selector(context), [context, selector]);
};

/**
 * Hook for current domain only (optimized)
 */
export const useCurrentDomain = (): Domain => {
  const context = useOptimizedDomainTheme();
  return context.state.currentDomain;
};

/**
 * Hook for domain operations only (optimized)
 */
export const useDomainOperations = () => {
  const context = useOptimizedDomainTheme();
  
  return useMemo(() => ({
    setCurrentDomain: context.setCurrentDomain,
    setCurrentDomainWithTransition: context.setCurrentDomainWithTransition,
    navigateToDomain: context.navigateToDomain,
    isDomainActive: context.isDomainActive
  }), [context.setCurrentDomain, context.setCurrentDomainWithTransition, context.navigateToDomain, context.isDomainActive]);
};

/**
 * Hook for domain styling utilities (optimized)
 */
export const useOptimizedDomainStyling = (domain?: Domain) => {
  const context = useOptimizedDomainTheme();
  const targetDomain = domain || context.state.currentDomain;
  
  return useMemo(() => {
    const domainColor = context.getDomainColor(targetDomain);
    const cssVariables = context.getDomainCSSVariables(targetDomain);
    
    const getThemeClasses = (baseClasses: string = '') => {
      return `${baseClasses} domain-${targetDomain}`.trim();
    };
    
    const getThemeStyles = (baseStyles: React.CSSProperties = {}) => {
      return {
        ...baseStyles,
        '--domain-color': domainColor,
      } as React.CSSProperties;
    };
    
    return {
      domain: targetDomain,
      domainColor,
      cssVariables,
      getThemeClasses,
      getThemeStyles,
    };
  }, [context, targetDomain]);
};

/**
 * Hook for performance monitoring (development only)
 */
export const useDomainThemePerformance = () => {
  const context = useOptimizedDomainTheme();
  
  // Extract values to avoid hooks dependency issues
  const { performance, clearPerformanceMetrics, state } = context;
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).__domainThemePerformance = {
        metrics: performance,
        clear: clearPerformanceMetrics,
        log: () => console.log('Domain Theme Performance:', performance),
        state: state
      };
    }
  }, [performance, clearPerformanceMetrics, state]);
  
  return process.env.NODE_ENV === 'development' ? {
    metrics: performance,
    clearMetrics: clearPerformanceMetrics,
    state: state
  } : null;
};

// Export types
export type { Domain, DomainConfig };
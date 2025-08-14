/**
 * Context Optimization Framework
 * 
 * Provides utilities for creating performance-optimized React contexts
 * with selective re-rendering, error boundaries, and state batching.
 * 
 * @fileoverview Context optimization utilities
 */

import React, { 
  createContext, 
  useContext, 
  useCallback, 
  useMemo, 
  useRef, 
  useState,
  useEffect,
  ReactNode,
  ComponentType
} from 'react';

/**
 * Performance metrics for context providers
 */
interface PerformanceMetrics {
  renderCount: number;
  lastRender: number;
  averageRenderTime: number;
  totalRenderTime: number;
}

/**
 * Context optimization configuration
 */
interface OptimizationConfig<T> {
  /** Enable performance tracking */
  enablePerformanceTracking?: boolean;
  /** Enable selective re-rendering */
  enableSelectiveRendering?: boolean;
  /** Enable state update batching */
  enableStateBatching?: boolean;
  /** Batch timeout in milliseconds */
  batchTimeout?: number;
  /** Context display name for debugging */
  displayName?: string;
  /** Initial state */
  initialState: T;
}

/**
 * State update batch item
 */
interface StateUpdate<T> {
  updater: (prevState: T) => T;
  timestamp: number;
}

/**
 * Optimized context value wrapper
 */
interface OptimizedContextValue<T> {
  state: T;
  setState: (updater: (prevState: T) => T) => void;
  batchUpdate: (updater: (prevState: T) => T) => void;
  performance: PerformanceMetrics;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Selector function type
 */
type Selector<T, K> = (state: T) => K;

/**
 * Context Optimizer Class
 * 
 * Provides utilities for creating optimized React contexts with:
 * - Performance monitoring
 * - Selective re-rendering
 * - State update batching
 * - Error boundaries
 */
export class ContextOptimizer {
  /**
   * Create an optimized context provider
   */
  static createOptimizedProvider<T>(config: OptimizationConfig<T>) {
    const Context = createContext<OptimizedContextValue<T> | undefined>(undefined);
    Context.displayName = config.displayName || 'OptimizedContext';

    const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
      const [state, setState] = useState<T>(config.initialState);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<Error | null>(null);
      
      // Performance tracking
      const performanceRef = useRef<PerformanceMetrics>({
        renderCount: 0,
        lastRender: Date.now(),
        averageRenderTime: 0,
        totalRenderTime: 0
      });

      // Batching state
      const batchRef = useRef<StateUpdate<T>[]>([]);
      const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

      // Track render performance
      useEffect(() => {
        if (config.enablePerformanceTracking) {
          const now = Date.now();
          const renderTime = now - performanceRef.current.lastRender;
          
          performanceRef.current.renderCount++;
          performanceRef.current.lastRender = now;
          performanceRef.current.totalRenderTime += renderTime;
          performanceRef.current.averageRenderTime = 
            performanceRef.current.totalRenderTime / performanceRef.current.renderCount;
        }
      });

      /**
       * Process batched updates
       */
      const processBatch = useCallback(() => {
        if (batchRef.current.length === 0) return;

        const updates = [...batchRef.current];
        batchRef.current = [];

        setState(prevState => {
          return updates.reduce((acc, update) => update.updater(acc), prevState);
        });
      }, []);

      /**
       * Optimized state setter with error handling
       */
      const optimizedSetState = useCallback((updater: (prevState: T) => T) => {
        try {
          setError(null);
          setState(updater);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      }, []);

      /**
       * Batched state update
       */
      const batchUpdate = useCallback((updater: (prevState: T) => T) => {
        if (!config.enableStateBatching) {
          optimizedSetState(updater);
          return;
        }

        batchRef.current.push({
          updater,
          timestamp: Date.now()
        });

        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }

        batchTimeoutRef.current = setTimeout(processBatch, config.batchTimeout || 16);
      }, [optimizedSetState, processBatch, config.batchTimeout, config.enableStateBatching]);

      // Memoized context value
      const contextValue = useMemo<OptimizedContextValue<T>>(() => ({
        state,
        setState: optimizedSetState,
        batchUpdate,
        performance: performanceRef.current,
        isLoading,
        error
      }), [state, optimizedSetState, batchUpdate, isLoading, error]);

      return (
        <Context.Provider value={contextValue}>
          {children}
        </Context.Provider>
      );
    };

    /**
     * Hook to use the optimized context
     */
    const useOptimizedContext = (): OptimizedContextValue<T> => {
      const context = useContext(Context);
      if (context === undefined) {
        throw new Error(`useOptimizedContext must be used within ${config.displayName || 'OptimizedProvider'}`);
      }
      return context;
    };

    /**
     * Hook with selector for selective re-rendering
     */
    const useSelector = <K>(selector: Selector<T, K>): K => {
      const { state } = useOptimizedContext();
      return useMemo(() => selector(state), [state, selector]);
    };

    /**
     * Hook with memoized value based on dependencies
     */
    const useMemoizedValue = <K>(selector: Selector<T, K>, deps: any[]): K => {
      const { state } = useOptimizedContext();
      return useMemo(() => selector(state), [state, ...deps]);
    };

    return {
      Provider,
      useContext: useOptimizedContext,
      useSelector,
      useMemoizedValue,
      Context
    };
  }

  /**
   * Create error boundary for context providers
   */
  static createErrorBoundary(displayName: string = 'ContextErrorBoundary') {
    return class extends React.Component<
      { children: ReactNode; fallback?: ComponentType<{ error: Error }> },
      { hasError: boolean; error: Error | null }
    > {
      static displayName = displayName;

      constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error(`${displayName} caught an error:`, error, errorInfo);
      }

      render() {
        if (this.state.hasError) {
          const FallbackComponent = this.props.fallback;
          if (FallbackComponent && this.state.error) {
            return <FallbackComponent error={this.state.error} />;
          }
          return <div>Something went wrong in {displayName}</div>;
        }

        return this.props.children;
      }
    };
  }

  /**
   * Performance monitoring utilities
   */
  static createPerformanceMonitor(contextName: string) {
    return {
      logMetrics: (metrics: PerformanceMetrics) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${contextName}] Performance Metrics:`, {
            renderCount: metrics.renderCount,
            averageRenderTime: `${metrics.averageRenderTime.toFixed(2)}ms`,
            lastRender: new Date(metrics.lastRender).toISOString()
          });
        }
      },
      
      trackRender: (callback: () => void) => {
        const start = performance.now();
        callback();
        const end = performance.now();
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[${contextName}] Render time: ${(end - start).toFixed(2)}ms`);
        }
      }
    };
  }
}

export type { 
  OptimizationConfig, 
  OptimizedContextValue, 
  PerformanceMetrics, 
  Selector 
};
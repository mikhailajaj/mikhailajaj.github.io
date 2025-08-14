"use client";

import React, { createContext, useContext, useCallback, useRef } from "react";
import { useNavigation, UseNavigationOptions, UseNavigationReturn } from "./useNavigation";
import { useMemoizedNavigation, UseMemoizedNavigationReturn } from "./useMemoizedNavigation";
import { useThrottledScroll, UseThrottledScrollReturn } from "./useThrottledScroll";
import { useHydrationSafeNavigation } from "./useHydrationSafe";
import { type Domain } from "@/lib/constants/domains";

export interface NavigationContextValue extends UseNavigationReturn {
  // Memoized navigation data
  navigationData: UseMemoizedNavigationReturn;
  
  // Scroll state
  scrollState: UseThrottledScrollReturn;
  
  // Hydration state
  isHydrationSafe: boolean;
  hydrationError: Error | null;
  
  // Debug utilities (development only)
  debug: {
    logState: () => void;
    logNavigationData: () => void;
    logPerformanceMetrics: () => void;
  };
}

export interface NavigationProviderProps extends UseNavigationOptions {
  children: React.ReactNode;
  enableDebug?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

/**
 * Error boundary for navigation context
 */
class NavigationErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Navigation Context Error:', error);
      console.error('Error Info:', errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultNavigationFallback;
      return <Fallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

/**
 * Default fallback component for navigation errors
 */
function DefaultNavigationFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <nav
      role="navigation"
      aria-label="Navigation (Error State)"
      className="fixed top-0 left-0 right-0 z-50 bg-red-900/90 backdrop-blur-md border-b border-red-500/20"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-white font-semibold">Navigation Error</div>
          <button
            onClick={retry}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Navigation context provider with error boundaries and debugging
 */
export function NavigationProvider({
  children,
  enableDebug = process.env.NODE_ENV === 'development',
  onError,
  ...navigationOptions
}: NavigationProviderProps) {
  const navigation = useNavigation(navigationOptions);
  const { mounted, hydrationError, isHydrationSafe } = useHydrationSafeNavigation();
  
  const navigationData = useMemoizedNavigation({
    currentPath: navigation.pathname,
    activeDomain: navigation.activeDomain,
  });

  const scrollState = useThrottledScroll({
    enabled: navigationOptions.enableScrollEffects !== false,
  });

  // Performance metrics tracking
  const performanceMetrics = useRef({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  // Update performance metrics
  React.useEffect(() => {
    const now = performance.now();
    performanceMetrics.current.renderCount++;
    performanceMetrics.current.lastRenderTime = now;
    
    if (performanceMetrics.current.renderCount > 1) {
      performanceMetrics.current.averageRenderTime = 
        (performanceMetrics.current.averageRenderTime + now) / 2;
    }
  });

  // Debug utilities
  const debug = React.useMemo(() => ({
    logState: () => {
      if (!enableDebug) return;
      console.group('Navigation State');
      console.log('Navigation:', navigation);
      console.log('Navigation Data:', navigationData);
      console.log('Scroll State:', scrollState);
      console.log('Hydration Safe:', isHydrationSafe);
      console.groupEnd();
    },
    
    logNavigationData: () => {
      if (!enableDebug) return;
      console.group('Navigation Data');
      console.log('Main Nav Items:', navigationData.mainNavItems);
      console.log('Domain Nav Items:', navigationData.domainNavItems);
      console.log('Active Main Item:', navigationData.activeMainNavItem);
      console.log('Active Domain Item:', navigationData.activeDomainNavItem);
      console.log('Navigation Map:', navigationData.navigationMap);
      console.groupEnd();
    },
    
    logPerformanceMetrics: () => {
      if (!enableDebug) return;
      console.group('Navigation Performance');
      console.log('Render Count:', performanceMetrics.current.renderCount);
      console.log('Last Render Time:', performanceMetrics.current.lastRenderTime);
      console.log('Average Render Time:', performanceMetrics.current.averageRenderTime);
      console.groupEnd();
    },
  }), [enableDebug, navigation, navigationData, scrollState, isHydrationSafe]);

  const contextValue: NavigationContextValue = React.useMemo(() => ({
    ...navigation,
    navigationData,
    scrollState,
    isHydrationSafe,
    hydrationError,
    debug,
  }), [navigation, navigationData, scrollState, isHydrationSafe, hydrationError, debug]);

  // Don't render until hydration is safe
  if (!mounted) {
    return null;
  }

  return (
    <NavigationErrorBoundary onError={onError}>
      <NavigationContext.Provider value={contextValue}>
        {children}
      </NavigationContext.Provider>
    </NavigationErrorBoundary>
  );
}

/**
 * Hook to use navigation context
 */
export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider. ' +
      'Make sure to wrap your component tree with <NavigationProvider>.'
    );
  }
  
  return context;
}

/**
 * Hook to use navigation context with error handling
 */
export function useNavigationContextSafe(): NavigationContextValue | null {
  const context = useContext(NavigationContext);
  return context;
}

/**
 * Higher-order component for navigation context
 */
export function withNavigationContext<P extends object>(
  Component: React.ComponentType<P>
) {
  const WrappedComponent = (props: P) => {
    const navigation = useNavigationContext();
    return <Component {...props} navigation={navigation} />;
  };
  
  WrappedComponent.displayName = `withNavigationContext(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Hook for navigation context debugging (development only)
 */
export function useNavigationDebug() {
  const context = useNavigationContextSafe();
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && context) {
      // Add debug methods to window for console access
      (window as any).__navigationDebug = context.debug;
    }
  }, [context]);
  
  return context?.debug || null;
}
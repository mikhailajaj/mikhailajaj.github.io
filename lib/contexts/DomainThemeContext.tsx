/**
 * Domain Theme Context
 * 
 * Provides domain-aware theming throughout the portfolio application.
 * Manages current domain state and provides utilities for domain-specific styling.
 * 
 * This file now uses the optimized implementation for better performance
 * while maintaining backward compatibility.
 * 
 * @fileoverview Domain theming context and provider (optimized)
 */

"use client";

import React, { useMemo } from 'react';

// Import types first to avoid circular dependencies
import type { Domain, DomainConfig } from '@/lib/constants/domains';

// Import optimized implementation
import { 
  OptimizedDomainThemeProvider,
  useOptimizedDomainTheme,
  useOptimizedDomainThemeSelector,
  useCurrentDomain as useCurrentDomainOptimized,
  useDomainOperations as useDomainOperationsOptimized,
  useOptimizedDomainStyling,
  useDomainThemePerformance,
  type OptimizedDomainThemeContextValue,
  type DomainThemeState,
  type DomainThemePerformanceMetrics,
  type DomainThemeSelector
} from './optimized/OptimizedDomainThemeContext';

/**
 * Legacy domain theme context value interface (for backward compatibility)
 */
export interface DomainThemeContextValue {
  /** Current active domain */
  currentDomain: Domain;
  /** Set the current domain */
  setCurrentDomain: (domain: Domain) => void;
  /** Get domain configuration */
  getDomainConfig: (domain: Domain) => DomainConfig;
  /** Get domain color */
  getDomainColor: (domain: Domain) => string;
  /** Get current domain configuration */
  currentDomainConfig: DomainConfig;
  /** Get current domain color */
  currentDomainColor: string;
  /** Apply domain theme to CSS custom properties */
  applyDomainTheme: (domain: Domain) => void;
  /** Get CSS variables for domain theming */
  getDomainCSSVariables: (domain: Domain) => Record<string, string>;
  /** Check if domain is currently active */
  isDomainActive: (domain: Domain) => boolean;
}

/**
 * Migration-compatible hook for domain theme context
 */
export const useDomainTheme = (): DomainThemeContextValue => {
  const optimizedContext = useOptimizedDomainTheme();
  
  return useMemo<DomainThemeContextValue>(() => ({
    currentDomain: optimizedContext.state.currentDomain,
    setCurrentDomain: optimizedContext.setCurrentDomain,
    getDomainConfig: optimizedContext.getDomainConfig,
    getDomainColor: optimizedContext.getDomainColor,
    currentDomainConfig: optimizedContext.getCurrentDomainConfig(),
    currentDomainColor: optimizedContext.getCurrentDomainColor(),
    applyDomainTheme: optimizedContext.applyDomainTheme,
    getDomainCSSVariables: optimizedContext.getDomainCSSVariables,
    isDomainActive: optimizedContext.isDomainActive,
  }), [optimizedContext]);
};

/**
 * Migration-compatible Domain Theme Provider
 */
export interface DomainThemeProviderProps {
  children: React.ReactNode;
  /** Initial domain (defaults to 'full-stack') */
  initialDomain?: Domain;
  /** Whether to persist domain selection in localStorage */
  persistSelection?: boolean;
}

export const DomainThemeProvider: React.FC<DomainThemeProviderProps> = ({
  children,
  initialDomain = 'full-stack',
  persistSelection = true
}) => {
  return (
    <OptimizedDomainThemeProvider
      initialDomain={initialDomain}
      persistSelection={persistSelection}
      enableSSR={true}
      enablePerformanceTracking={process.env.NODE_ENV === 'development'}
      enableNavigationIntegration={true}
    >
      {children}
    </OptimizedDomainThemeProvider>
  );
};

/**
 * Migration-compatible hook for domain styling utilities
 */
export const useDomainStyling = (domain?: Domain) => {
  const optimizedContext = useOptimizedDomainTheme();
  const targetDomain = domain || optimizedContext.state.currentDomain;
  
  return useMemo(() => {
    const domainColor = optimizedContext.getDomainColor(targetDomain);
    const cssVariables = optimizedContext.getDomainCSSVariables(targetDomain);
    
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
  }, [optimizedContext, targetDomain]);
};

// Re-export optimized hooks for components that want to use them directly
export const useCurrentDomain = useCurrentDomainOptimized;
export const useDomainOperations = useDomainOperationsOptimized;

// Re-export optimized components and types
export {
  OptimizedDomainThemeProvider,
  useOptimizedDomainTheme,
  useOptimizedDomainThemeSelector,
  useOptimizedDomainStyling,
  useDomainThemePerformance,
  type OptimizedDomainThemeContextValue,
  type DomainThemeState,
  type DomainThemePerformanceMetrics,
  type DomainThemeSelector
};

// Export types
export type { Domain, DomainConfig };


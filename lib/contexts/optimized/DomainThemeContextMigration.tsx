/**
 * Domain Theme Context Migration Adapter
 * 
 * Provides backward compatibility for existing DomainThemeContext usage
 * while migrating to the optimized implementation.
 * 
 * @fileoverview Migration adapter for domain theme context
 */

"use client";

import React, { useMemo } from 'react';
import { 
  OptimizedDomainThemeProvider,
  useOptimizedDomainTheme,
  type OptimizedDomainThemeContextValue 
} from './OptimizedDomainThemeContext';
import type { Domain, DomainConfig } from '@/lib/constants/domains';

/**
 * Legacy domain theme context value interface (for backward compatibility)
 */
interface LegacyDomainThemeContextValue {
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
 * Migration adapter hook that converts optimized context to legacy format
 */
const useLegacyDomainThemeAdapter = (): LegacyDomainThemeContextValue => {
  const optimizedContext = useOptimizedDomainTheme();
  
  return useMemo<LegacyDomainThemeContextValue>(() => ({
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
 * Legacy provider props (for backward compatibility)
 */
interface LegacyDomainThemeProviderProps {
  children: React.ReactNode;
  /** Initial domain (defaults to 'full-stack') */
  initialDomain?: Domain;
  /** Whether to persist domain selection in localStorage */
  persistSelection?: boolean;
}

/**
 * Migration-compatible Domain Theme Provider
 * 
 * Provides the same API as the original DomainThemeProvider but uses
 * the optimized implementation under the hood.
 */
export const DomainThemeProvider: React.FC<LegacyDomainThemeProviderProps> = ({
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
 * Migration-compatible hook for domain theme context
 * 
 * Provides the same API as the original useDomainTheme hook but uses
 * the optimized implementation under the hood.
 */
export const useDomainTheme = (): LegacyDomainThemeContextValue => {
  return useLegacyDomainThemeAdapter();
};

/**
 * Migration-compatible hook for domain styling utilities
 * 
 * Provides the same API as the original useDomainStyling hook but uses
 * the optimized implementation under the hood.
 */
export const useDomainStyling = (domain?: Domain) => {
  const optimizedContext = useOptimizedDomainTheme();
  const targetDomain = domain || optimizedContext.state.currentDomain;
  
  return useMemo(() => {
    const domainColor = optimizedContext.getDomainColor(targetDomain);
    const cssVariables = optimizedContext.getDomainCSSVariables(targetDomain);
    
    /**
     * Get theme-aware CSS classes
     */
    const getThemeClasses = (baseClasses: string = '') => {
      return `${baseClasses} domain-${targetDomain}`.trim();
    };
    
    /**
     * Get theme-aware inline styles
     */
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

// Export types for backward compatibility
export type { Domain, DomainConfig, LegacyDomainThemeContextValue as DomainThemeContextValue };
/**
 * Simple Unified Theme Provider
 * 
 * A simplified version of the unified theme system for Phase 1 migration.
 * This provides basic integration while the full system is being set up.
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useDomainTheme, useCurrentDomain } from '@/lib/contexts/DomainThemeContext';
import type { Domain } from '@/lib/constants/domains';

// Simple theme state interface
interface SimpleThemeState {
  mode: 'light' | 'dark' | 'system';
  domain: Domain;
  colors?: {
    domainPrimary?: string;
    backgroundPrimary?: string;
    textPrimary?: string;
    borderPrimary?: string;
    backgroundElevated?: string;
    textSecondary?: string;
    backgroundSecondary?: string;
    textOnPrimary?: string;
  };
  isLoading: boolean;
  error: string | null;
}

// Simple theme context
interface SimpleThemeContextValue extends SimpleThemeState {
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  setDomain: (domain: Domain) => void;
  toggleMode: () => void;
  system: 'simple-unified' | 'legacy';
}

const SimpleThemeContext = createContext<SimpleThemeContextValue | null>(null);

// Simple theme provider
export function SimpleUnifiedThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme: nextTheme, setTheme: setNextTheme } = useTheme();
  const { currentDomain, setDomain: setLegacyDomain } = useDomainTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Determine current state
  const currentMode = (nextTheme as 'light' | 'dark' | 'system') || 'system';
  const activeDomain = currentDomain || 'full-stack';
  
  // Simple color mapping based on domain
  const getDomainColors = useCallback((domain: Domain) => {
    const colorMap: Record<Domain, string> = {
      'full-stack': '#3b82f6', // blue
      'cloud': '#06b6d4', // cyan
      'data': '#f59e0b', // amber
      'ux-ui': '#ec4899', // pink
      'consulting': '#10b981', // emerald
    };
    
    return {
      domainPrimary: colorMap[domain],
      backgroundPrimary: currentMode === 'dark' ? '#0f172a' : '#ffffff',
      textPrimary: currentMode === 'dark' ? '#f8fafc' : '#0f172a',
      borderPrimary: currentMode === 'dark' ? '#334155' : '#e2e8f0',
      backgroundElevated: currentMode === 'dark' ? '#1e293b' : '#f8fafc',
      textSecondary: currentMode === 'dark' ? '#94a3b8' : '#64748b',
      backgroundSecondary: currentMode === 'dark' ? '#334155' : '#f1f5f9',
      textOnPrimary: '#ffffff',
    };
  }, [currentMode]);
  
  // Initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Theme operations
  const setMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    setNextTheme(mode);
  }, [setNextTheme]);
  
  const setDomain = useCallback((domain: Domain) => {
    if (setLegacyDomain) {
      setLegacyDomain(domain);
    }
  }, [setLegacyDomain]);
  
  const toggleMode = useCallback(() => {
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  }, [currentMode, setMode]);
  
  const value: SimpleThemeContextValue = {
    mode: currentMode,
    domain: activeDomain,
    colors: getDomainColors(activeDomain),
    isLoading,
    error,
    setMode,
    setDomain,
    toggleMode,
    system: 'simple-unified',
  };
  
  return (
    <SimpleThemeContext.Provider value={value}>
      {children}
    </SimpleThemeContext.Provider>
  );
}

// Hook to use simple unified theme
export function useSimpleUnifiedTheme() {
  const context = useContext(SimpleThemeContext);
  if (!context) {
    throw new Error('useSimpleUnifiedTheme must be used within SimpleUnifiedThemeProvider');
  }
  return context;
}

// Navigation-specific hook
export function useSimpleNavigationTheme() {
  const theme = useSimpleUnifiedTheme();
  
  const navigationTheme = {
    getNavBarStyles: () => ({
      backgroundColor: theme.colors?.backgroundPrimary || 'var(--background)',
      borderColor: theme.colors?.borderPrimary || 'var(--border)',
      color: theme.colors?.textPrimary || 'var(--foreground)',
      '--nav-accent': theme.colors?.domainPrimary || 'var(--primary)',
    }),
    
    getMenuItemStyles: (isActive: boolean = false) => ({
      color: isActive 
        ? theme.colors?.domainPrimary || 'var(--primary)'
        : theme.colors?.textPrimary || 'var(--foreground)',
      backgroundColor: isActive 
        ? theme.colors?.backgroundElevated || 'var(--muted)'
        : 'transparent',
      borderColor: isActive 
        ? theme.colors?.domainPrimary || 'var(--primary)'
        : 'transparent',
    }),
    
    getDomainIndicatorStyles: (domain: Domain, isActive: boolean) => ({
      backgroundColor: isActive
        ? theme.colors?.domainPrimary || 'var(--primary)'
        : theme.colors?.backgroundSecondary || 'var(--muted)',
      color: isActive
        ? theme.colors?.textOnPrimary || 'var(--primary-foreground)'
        : theme.colors?.textSecondary || 'var(--muted-foreground)',
    }),
  };

  return {
    ...theme,
    navigationTheme,
  };
}
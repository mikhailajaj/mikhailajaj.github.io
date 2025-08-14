/**
 * Unified Theme System
 * 
 * Consolidates all theme-related functionality into a single, cohesive system
 * that eliminates duplication and provides a consistent API.
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { type Domain } from "@/lib/constants/domains";
import { getDomainConfig } from "@/lib/config/domainConfig";

// Unified theme types
export interface UnifiedThemeConfig {
  mode: 'light' | 'dark' | 'system';
  domain: Domain;
  preferences: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'sm' | 'md' | 'lg';
  };
}

export interface UnifiedThemeContext {
  config: UnifiedThemeConfig;
  resolvedTheme: 'light' | 'dark';
  isLoading: boolean;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  setDomain: (domain: Domain) => void;
  updatePreferences: (preferences: Partial<UnifiedThemeConfig['preferences']>) => void;
  toggleMode: () => void;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
}

// Create unified theme context
const UnifiedThemeContext = createContext<UnifiedThemeContext | undefined>(undefined);

// Unified theme provider
export const UnifiedThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<UnifiedThemeConfig>({
    mode: 'system',
    domain: 'full-stack',
    preferences: {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'md',
    },
  });

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true);
    // Load saved preferences
    const saved = localStorage.getItem('unified-theme-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Failed to parse saved theme config:', error);
      }
    }
  }, []);

  // Save config changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('unified-theme-config', JSON.stringify(config));
    }
  }, [config, mounted]);

  // Theme mode handlers
  const setMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    setTheme(mode);
    setConfig(prev => ({ ...prev, mode }));
  }, [setTheme]);

  const setDomain = useCallback((domain: Domain) => {
    setConfig(prev => ({ ...prev, domain }));
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UnifiedThemeConfig['preferences']>) => {
    setConfig(prev => ({ 
      ...prev, 
      preferences: { ...prev.preferences, ...preferences } 
    }));
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = resolvedTheme === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [resolvedTheme, setMode]);

  // Generate theme colors based on current config
  const colors = React.useMemo(() => {
    const domainConfig = getDomainConfig(config.domain);
    const isDark = resolvedTheme === 'dark';
    
    return {
      primary: domainConfig.color,
      secondary: isDark ? '#64748b' : '#475569',
      accent: domainConfig.color,
      background: isDark ? '#0f172a' : '#ffffff',
      foreground: isDark ? '#f8fafc' : '#0f172a',
      muted: isDark ? '#1e293b' : '#f1f5f9',
      border: isDark ? '#334155' : '#e2e8f0',
    };
  }, [config.domain, resolvedTheme]);

  if (!mounted) {
    return null;
  }

  const contextValue: UnifiedThemeContext = {
    config,
    resolvedTheme: resolvedTheme as 'light' | 'dark',
    isLoading: !mounted,
    setMode,
    setDomain,
    updatePreferences,
    toggleMode,
    colors,
  };

  return (
    <UnifiedThemeContext.Provider value={contextValue}>
      <div className="min-h-screen transition-colors duration-300">
        {children}
      </div>
    </UnifiedThemeContext.Provider>
  );
};

// Unified theme hook
export const useUnifiedTheme = (): UnifiedThemeContext => {
  const context = useContext(UnifiedThemeContext);
  if (!context) {
    throw new Error('useUnifiedTheme must be used within UnifiedThemeProvider');
  }
  return context;
};

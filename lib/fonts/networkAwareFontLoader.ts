/**
 * Network-Aware Font Loader
 * 
 * Handles font loading with network connectivity awareness
 * and graceful degradation when Google Fonts are unavailable
 */

'use client';

import { Inter } from 'next/font/google';

/**
 * Primary Inter font with optimized configuration
 */
export const interFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Helvetica Neue',
    'sans-serif'
  ],
  variable: '--font-inter',
  adjustFontFallback: true,
});

/**
 * System font configuration as fallback
 */
export const systemFontConfig = {
  className: 'font-system',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
  },
  variable: '--font-system'
};

/**
 * Network connectivity checker
 */
export class NetworkConnectivityChecker {
  private static instance: NetworkConnectivityChecker;
  private isOnline: boolean = true;
  private googleFontsAccessible: boolean | null = null;
  private checkPromise: Promise<boolean> | null = null;

  static getInstance(): NetworkConnectivityChecker {
    if (!NetworkConnectivityChecker.instance) {
      NetworkConnectivityChecker.instance = new NetworkConnectivityChecker();
    }
    return NetworkConnectivityChecker.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.googleFontsAccessible = null; // Reset cache
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.googleFontsAccessible = false;
      });
    }
  }

  /**
   * Check if Google Fonts is accessible
   */
  async checkGoogleFontsAccessibility(): Promise<boolean> {
    if (!this.isOnline) {
      return false;
    }

    if (this.googleFontsAccessible !== null) {
      return this.googleFontsAccessible;
    }

    if (this.checkPromise) {
      return this.checkPromise;
    }

    this.checkPromise = this.performConnectivityCheck();
    const result = await this.checkPromise;
    this.checkPromise = null;
    return result;
  }

  private async performConnectivityCheck(): Promise<boolean> {
    try {
      // Try to fetch a small CSS file from Google Fonts
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap', {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // Avoid CORS issues
      });

      clearTimeout(timeoutId);
      this.googleFontsAccessible = true;
      return true;
    } catch (error) {
      console.warn('Google Fonts not accessible, using system fonts:', error);
      this.googleFontsAccessible = false;
      return false;
    }
  }

  /**
   * Get current connectivity status
   */
  getStatus(): { isOnline: boolean; googleFontsAccessible: boolean | null } {
    return {
      isOnline: this.isOnline,
      googleFontsAccessible: this.googleFontsAccessible
    };
  }
}

/**
 * Smart font strategy that adapts to network conditions
 */
export class SmartFontStrategy {
  private connectivityChecker: NetworkConnectivityChecker;

  constructor() {
    this.connectivityChecker = NetworkConnectivityChecker.getInstance();
  }

  /**
   * Get the best font configuration based on network conditions
   */
  async getBestFontConfig(): Promise<{
    className: string;
    style?: React.CSSProperties;
    variable: string;
    shouldUseGoogleFonts: boolean;
  }> {
    const isGoogleFontsAccessible = await this.connectivityChecker.checkGoogleFontsAccessibility();

    if (isGoogleFontsAccessible) {
      return {
        className: interFont.className,
        variable: interFont.variable,
        shouldUseGoogleFonts: true
      };
    }

    // Fallback to system fonts
    return {
      className: systemFontConfig.className,
      style: systemFontConfig.style,
      variable: systemFontConfig.variable,
      shouldUseGoogleFonts: false
    };
  }

  /**
   * Get CSS variables for the current font strategy
   */
  async getFontCSSVariables(): Promise<Record<string, string>> {
    const config = await this.getBestFontConfig();
    
    return {
      [config.variable]: config.style?.fontFamily || interFont.style.fontFamily,
      '--font-fallback': systemFontConfig.style.fontFamily
    };
  }
}

/**
 * React hook for smart font loading
 */
export function useSmartFontLoading() {
  const [fontConfig, setFontConfig] = React.useState<{
    className: string;
    style?: React.CSSProperties;
    variable: string;
    shouldUseGoogleFonts: boolean;
    isLoading: boolean;
  }>({
    className: systemFontConfig.className,
    style: systemFontConfig.style,
    variable: systemFontConfig.variable,
    shouldUseGoogleFonts: false,
    isLoading: true
  });

  React.useEffect(() => {
    const strategy = new SmartFontStrategy();
    
    strategy.getBestFontConfig().then(config => {
      setFontConfig({
        ...config,
        isLoading: false
      });
    }).catch(() => {
      // Fallback to system fonts on any error
      setFontConfig({
        className: systemFontConfig.className,
        style: systemFontConfig.style,
        variable: systemFontConfig.variable,
        shouldUseGoogleFonts: false,
        isLoading: false
      });
    });
  }, []);

  return fontConfig;
}

// React import (conditional)
let React: any;
try {
  React = require('react');
} catch {
  // React not available in this context
}
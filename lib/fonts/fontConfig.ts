/**
 * Font Configuration System
 * 
 * Provides type-safe font definitions with comprehensive fallback strategies
 * and optimized loading configurations for Next.js applications.
 */

import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Font loading strategy types
export type FontDisplay = 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type FontSubset = 'latin' | 'latin-ext' | 'cyrillic' | 'cyrillic-ext' | 'greek' | 'greek-ext' | 'vietnamese';

// Font configuration interfaces
export interface FontDefinition {
  family: string;
  weights: FontWeight[];
  subsets: FontSubset[];
  display: FontDisplay;
  preload: boolean;
  fallback?: string[];
  adjustFontFallback?: boolean;
}

export interface LocalFontDefinition {
  family: string;
  src: string | Array<{
    path: string;
    weight?: FontWeight;
    style?: 'normal' | 'italic';
  }>;
  display: FontDisplay;
  preload: boolean;
  fallback?: string[];
  adjustFontFallback?: boolean;
}

export interface FontConfig {
  primary: FontDefinition;
  fallbacks: LocalFontDefinition[];
  systemStack: string[];
  loadingStrategy: FontDisplay;
}

// System font stacks for different platforms
export const SYSTEM_FONT_STACKS = {
  sans: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji'
  ],
  serif: [
    'ui-serif',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif'
  ],
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    'SF Mono',
    'Consolas',
    'Liberation Mono',
    'Menlo',
    'monospace'
  ]
} as const;

// Optimized Inter font configuration with proper Next.js 15 setup
export const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif'
  ],
});

// Font configuration with comprehensive fallback strategy
export const fontConfig: FontConfig = {
  primary: {
    family: 'Inter',
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    fallback: SYSTEM_FONT_STACKS.sans,
    adjustFontFallback: true,
  },
  fallbacks: [
    {
      family: 'system-ui',
      src: 'system-ui',
      display: 'swap',
      preload: false,
      fallback: SYSTEM_FONT_STACKS.sans.slice(1),
    }
  ],
  systemStack: SYSTEM_FONT_STACKS.sans,
  loadingStrategy: 'swap',
};

// Font loading utilities
export const getFontClassName = () => {
  return interFont.className;
};

export const getFontVariable = () => {
  return interFont.variable;
};

export const getFontStyle = () => {
  return interFont.style;
};

// CSS custom properties for font families
export const getFontCSSVariables = (): React.CSSProperties => {
  return {
    '--font-primary': interFont.style.fontFamily,
    '--font-fallback': SYSTEM_FONT_STACKS.sans.join(', '),
    '--font-system': SYSTEM_FONT_STACKS.sans.join(', '),
  } as React.CSSProperties;
};

// Font loading error handling
export interface FontLoadingError {
  type: 'network' | 'timeout' | 'blocked' | 'unknown';
  message: string;
  fontFamily: string;
  timestamp: number;
}

export interface FontMetrics {
  loadTime: number;
  retryCount: number;
  fallbackUsed: boolean;
  cumulativeLayoutShift: number;
}

export interface FontLoadingState {
  status: 'loading' | 'loaded' | 'error' | 'fallback';
  currentFont: string;
  loadingTime: number;
  error?: FontLoadingError;
  metrics: FontMetrics;
}

// Default font loading state
export const defaultFontLoadingState: FontLoadingState = {
  status: 'loading',
  currentFont: 'Inter',
  loadingTime: 0,
  metrics: {
    loadTime: 0,
    retryCount: 0,
    fallbackUsed: false,
    cumulativeLayoutShift: 0,
  },
};

// Font loading configuration constants
export const FONT_LOADING_CONFIG = {
  timeout: 5000, // 5 seconds
  retryAttempts: 3,
  retryDelay: [1000, 2000, 4000], // Exponential backoff
  fallbackDelay: 100, // Switch to fallback after 100ms if primary font not loaded
} as const;

export default fontConfig;
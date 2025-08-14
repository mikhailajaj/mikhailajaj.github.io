/**
 * Enhanced Font Loader
 * 
 * Next.js compatible font loader with progressive loading strategy
 * and comprehensive fallback mechanisms.
 */

import { Inter } from 'next/font/google';
import { FONT_CONFIG, generateFontFamily } from './fontConfig';
import { fontLoadingService } from './fontLoader';

/**
 * Enhanced Inter font configuration with optimized settings
 * Using Next.js 13+ best practices for font loading
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

// Local font fallback removed - focusing on Google Fonts with system fallbacks

/**
 * Font loading strategy configuration
 */
export interface FontStrategy {
  primary: typeof interFont;
  fallback: string;
  className: string;
  variable: string;
}

/**
 * Create font strategy based on environment and preferences
 */
export function createFontStrategy(): FontStrategy {
  const fallbackFontFamily = generateFontFamily(FONT_CONFIG.primary);
  
  return {
    primary: interFont,
    fallback: fallbackFontFamily,
    className: interFont.className,
    variable: interFont.variable,
  };
}

/**
 * Font preconnect links for performance
 */
export function getFontPreconnectLinks(): Array<{ rel: string; href: string; crossOrigin?: string }> {
  if (!FONT_CONFIG.performance.preconnect) {
    return [];
  }

  return [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
  ];
}

/**
 * Font prefetch links for performance
 */
export function getFontPrefetchLinks(): Array<{ rel: string; href: string; as?: string; type?: string }> {
  if (!FONT_CONFIG.performance.prefetch) {
    return [];
  }

  const weights = FONT_CONFIG.primary.weights.join(';');
  
  return [
    {
      rel: 'prefetch',
      href: `https://fonts.googleapis.com/css2?family=${FONT_CONFIG.primary.name}:wght@${weights}&display=swap`,
      as: 'style',
    },
  ];
}

/**
 * Client-side font loading hook
 */
export function useFontLoading() {
  // Import React at the top level to avoid conditional imports
  const React = require('react');
  
  // Always call hooks in the same order
  const [state, setState] = React.useState(() => {
    if (typeof window === 'undefined') {
      return {
        isLoading: false,
        isLoaded: true,
        error: null,
        retryCount: 0,
      };
    }
    
    const currentState = fontLoadingService.getLoadingState(FONT_CONFIG.primary.name);
    return {
      isLoading: currentState?.status === 'loading',
      isLoaded: currentState?.status === 'loaded',
      error: currentState?.error || null,
      retryCount: currentState?.retryCount || 0,
    };
  }) || {
    isLoading: false,
    isLoaded: true,
    error: null,
    retryCount: 0,
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const unsubscribe = fontLoadingService.subscribe((fontName, loadingState) => {
      if (fontName === FONT_CONFIG.primary.name) {
        setState({
          isLoading: loadingState.status === 'loading',
          isLoaded: loadingState.status === 'loaded',
          error: loadingState.error || null,
          retryCount: loadingState.retryCount,
        });
      }
    });

    return unsubscribe;
  }, []);

  return state;
}

/**
 * CSS variables for font configuration
 */
export function getFontCSSVariables(): Record<string, string> {
  return {
    '--font-inter': interFont.style.fontFamily,
    '--font-fallback': FONT_CONFIG.fallbacks.system.join(', '),
    '--font-generic': FONT_CONFIG.fallbacks.generic.join(', '),
  };
}

/**
 * Generate font CSS classes
 */
export function generateFontClasses(): string {
  return `
    .font-inter {
      font-family: ${generateFontFamily(FONT_CONFIG.primary)};
    }
    
    .font-fallback {
      font-family: ${FONT_CONFIG.fallbacks.system.join(', ')};
    }
    
    .font-loading {
      font-family: ${FONT_CONFIG.fallbacks.system.join(', ')};
      font-display: swap;
    }
  `;
}

// React import moved to top of useFontLoading function
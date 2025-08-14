/**
 * Server-Safe Font Loader
 * 
 * Provides font loading that works on both server and client
 * with graceful fallbacks for Google Fonts connectivity issues
 */

import { Inter } from 'next/font/google';

/**
 * Primary Inter font configuration optimized for reliability
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
 * System font fallback configuration
 */
export const systemFontFallback = {
  className: 'font-system',
  variable: '--font-system',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif'
  }
};

/**
 * Get font configuration for server-side rendering
 */
export function getServerFontConfig() {
  return {
    className: interFont.className,
    variable: interFont.variable,
    style: interFont.style,
  };
}

/**
 * Get CSS variables for font configuration
 */
export function getFontCSSVariables() {
  return {
    '--font-inter': interFont.style.fontFamily,
    '--font-system': systemFontFallback.style.fontFamily,
  };
}

/**
 * Generate font preconnect links
 */
export function getFontPreconnectLinks() {
  return [
    {
      rel: 'preconnect' as const,
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect' as const,
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous' as const,
    },
  ];
}

/**
 * CSS for font loading states
 */
export const fontLoadingCSS = `
  .font-loading {
    font-family: ${systemFontFallback.style.fontFamily};
    font-display: swap;
  }
  
  .font-loaded {
    font-family: ${interFont.style.fontFamily};
  }
  
  .font-error {
    font-family: ${systemFontFallback.style.fontFamily};
  }
`;

/**
 * Client-side font loading detection
 */
export function createFontLoadingDetector() {
  if (typeof window === 'undefined') {
    return null;
  }

  return {
    async checkGoogleFontsAvailability(): Promise<boolean> {
      try {
        // Simple connectivity check
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap', {
          method: 'HEAD',
          signal: controller.signal,
          mode: 'no-cors'
        });

        clearTimeout(timeoutId);
        return true;
      } catch {
        return false;
      }
    },

    async waitForFontLoad(fontFamily: string = 'Inter', timeout: number = 3000): Promise<boolean> {
      if (!document.fonts) {
        return false;
      }

      try {
        await Promise.race([
          document.fonts.load(`1em ${fontFamily}`),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Font load timeout')), timeout)
          )
        ]);
        return true;
      } catch {
        return false;
      }
    }
  };
}
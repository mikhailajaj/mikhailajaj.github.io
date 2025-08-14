/**
 * Font Fallback Strategy
 * 
 * Implements a robust fallback strategy when Google Fonts fail to load
 * Based on Next.js best practices and network resilience patterns
 */

'use client';

import { useEffect, useState } from 'react';

export interface FontFallbackConfig {
  primaryFont: string;
  fallbackFonts: string[];
  timeout: number;
  enableLocalStorage: boolean;
}

export const DEFAULT_FONT_FALLBACK_CONFIG: FontFallbackConfig = {
  primaryFont: 'Inter',
  fallbackFonts: [
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
  timeout: 3000,
  enableLocalStorage: true,
};

export class FontFallbackStrategy {
  private config: FontFallbackConfig;
  private fontLoadAttempts: Map<string, number> = new Map();
  private maxRetries = 3;

  constructor(config: FontFallbackConfig = DEFAULT_FONT_FALLBACK_CONFIG) {
    this.config = config;
  }

  /**
   * Check if a font is available in the browser
   */
  private async isFontAvailable(fontFamily: string): Promise<boolean> {
    if (!document || !document.fonts) {
      return false;
    }

    try {
      // Use the Font Loading API if available
      const font = new FontFace(fontFamily, 'url()');
      await font.load();
      return true;
    } catch {
      // Fallback method using canvas
      return this.checkFontWithCanvas(fontFamily);
    }
  }

  /**
   * Fallback font detection using canvas
   */
  private checkFontWithCanvas(fontFamily: string): boolean {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return false;

    const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const testSize = '72px';
    const baselineFont = 'monospace';

    // Measure baseline font
    context.font = `${testSize} ${baselineFont}`;
    const baselineWidth = context.measureText(testString).width;

    // Measure test font
    context.font = `${testSize} ${fontFamily}, ${baselineFont}`;
    const testWidth = context.measureText(testString).width;

    return baselineWidth !== testWidth;
  }

  /**
   * Get the best available font from the fallback stack
   */
  async getBestAvailableFont(): Promise<string> {
    // Check if we have a cached result
    if (this.config.enableLocalStorage) {
      const cached = localStorage.getItem('font-fallback-result');
      if (cached) {
        const { font, timestamp } = JSON.parse(cached);
        // Use cached result for 1 hour
        if (Date.now() - timestamp < 3600000) {
          return font;
        }
      }
    }

    // Try primary font first
    const primaryAvailable = await this.isFontAvailable(this.config.primaryFont);
    if (primaryAvailable) {
      this.cacheResult(this.config.primaryFont);
      return this.config.primaryFont;
    }

    // Try fallback fonts
    for (const font of this.config.fallbackFonts) {
      const available = await this.isFontAvailable(font);
      if (available) {
        this.cacheResult(font);
        return font;
      }
    }

    // Return the first fallback as last resort
    const fallbackFont = this.config.fallbackFonts[0];
    this.cacheResult(fallbackFont);
    return fallbackFont;
  }

  /**
   * Cache the font result
   */
  private cacheResult(font: string): void {
    if (this.config.enableLocalStorage) {
      try {
        localStorage.setItem('font-fallback-result', JSON.stringify({
          font,
          timestamp: Date.now()
        }));
      } catch {
        // Ignore localStorage errors
      }
    }
  }

  /**
   * Generate CSS font-family string with detected fallbacks
   */
  async generateFontFamily(): Promise<string> {
    const bestFont = await this.getBestAvailableFont();
    
    if (bestFont === this.config.primaryFont) {
      return [this.config.primaryFont, ...this.config.fallbackFonts].join(', ');
    }
    
    return [bestFont, ...this.config.fallbackFonts.filter(f => f !== bestFont)].join(', ');
  }

  /**
   * Clear cached font results
   */
  clearCache(): void {
    if (this.config.enableLocalStorage) {
      localStorage.removeItem('font-fallback-result');
    }
  }
}

/**
 * React hook for font fallback strategy
 */
export function useFontFallback(config?: Partial<FontFallbackConfig>) {
  const [fontFamily, setFontFamily] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const strategy = new FontFallbackStrategy({
      ...DEFAULT_FONT_FALLBACK_CONFIG,
      ...config
    });

    strategy.generateFontFamily()
      .then(family => {
        setFontFamily(family);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setFontFamily(DEFAULT_FONT_FALLBACK_CONFIG.fallbackFonts.join(', '));
        setIsLoading(false);
      });
  }, []);

  return {
    fontFamily,
    isLoading,
    error,
    clearCache: () => {
      const strategy = new FontFallbackStrategy({
        ...DEFAULT_FONT_FALLBACK_CONFIG,
        ...config
      });
      strategy.clearCache();
    }
  };
}

/**
 * CSS-in-JS helper for font fallback
 */
export function createFontFallbackCSS(fontFamily: string): string {
  return `
    font-family: ${fontFamily};
    font-display: swap;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    font-variation-settings: normal;
  `;
}
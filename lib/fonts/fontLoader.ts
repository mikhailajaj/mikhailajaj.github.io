/**
 * Font Loading Service
 * 
 * Provides robust font loading with retry logic, error handling,
 * and performance monitoring for Next.js applications.
 */

import { fontConfig, FONT_LOADING_CONFIG, FontLoadingError, FontMetrics } from './fontConfig';

export interface FontLoadResult {
  success: boolean;
  fontFamily: string;
  loadTime: number;
  error?: FontLoadingError;
  metrics: FontMetrics;
}

export class FontLoader {
  private loadingPromises: Map<string, Promise<FontLoadResult>> = new Map();
  private loadedFonts: Set<string> = new Set();
  private metrics: Map<string, FontMetrics> = new Map();

  /**
   * Load primary font with retry logic
   */
  async loadPrimaryFont(): Promise<FontLoadResult> {
    const fontFamily = fontConfig.primary.family;
    
    // Return cached promise if already loading
    if (this.loadingPromises.has(fontFamily)) {
      return this.loadingPromises.get(fontFamily)!;
    }

    // Return success if already loaded
    if (this.loadedFonts.has(fontFamily)) {
      return {
        success: true,
        fontFamily,
        loadTime: this.metrics.get(fontFamily)?.loadTime || 0,
        metrics: this.metrics.get(fontFamily) || this.createDefaultMetrics(),
      };
    }

    const loadPromise = this.attemptFontLoad(fontFamily);
    this.loadingPromises.set(fontFamily, loadPromise);

    try {
      const result = await loadPromise;
      if (result.success) {
        this.loadedFonts.add(fontFamily);
      }
      return result;
    } finally {
      this.loadingPromises.delete(fontFamily);
    }
  }

  /**
   * Load fallback font
   */
  async loadFallbackFont(fontName: string): Promise<FontLoadResult> {
    const startTime = performance.now();
    
    try {
      // For system fonts, we assume they're always available
      if (this.isSystemFont(fontName)) {
        const loadTime = performance.now() - startTime;
        const metrics = this.createMetrics(loadTime, 0, true, 0);
        
        return {
          success: true,
          fontFamily: fontName,
          loadTime,
          metrics,
        };
      }

      // For other fallback fonts, attempt to load
      return await this.attemptFontLoad(fontName);
    } catch (error) {
      const loadTime = performance.now() - startTime;
      return {
        success: false,
        fontFamily: fontName,
        loadTime,
        error: this.createFontError('unknown', error instanceof Error ? error.message : 'Unknown error', fontName),
        metrics: this.createMetrics(loadTime, 1, true, 0),
      };
    }
  }

  /**
   * Detect font loading support
   */
  detectFontLoadingSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    return 'fonts' in document && 'load' in document.fonts;
  }

  /**
   * Get fallback font stack
   */
  getFallbackStack(): string[] {
    return fontConfig.systemStack;
  }

  /**
   * Check if font is loaded
   */
  isFontLoaded(fontFamily: string): boolean {
    return this.loadedFonts.has(fontFamily);
  }

  /**
   * Get font metrics
   */
  getFontMetrics(fontFamily: string): FontMetrics | undefined {
    return this.metrics.get(fontFamily);
  }

  /**
   * Clear font cache
   */
  clearCache(): void {
    this.loadingPromises.clear();
    this.loadedFonts.clear();
    this.metrics.clear();
  }

  /**
   * Attempt to load font with retry logic
   */
  private async attemptFontLoad(fontFamily: string): Promise<FontLoadResult> {
    const startTime = performance.now();
    let lastError: FontLoadingError | undefined;
    
    for (let attempt = 0; attempt < FONT_LOADING_CONFIG.retryAttempts; attempt++) {
      try {
        const result = await this.loadFontWithTimeout(fontFamily, FONT_LOADING_CONFIG.timeout);
        const loadTime = performance.now() - startTime;
        const metrics = this.createMetrics(loadTime, attempt, false, 0);
        
        this.metrics.set(fontFamily, metrics);
        
        return {
          success: true,
          fontFamily,
          loadTime,
          metrics,
        };
      } catch (error) {
        lastError = error instanceof Error 
          ? this.createFontError('network', error.message, fontFamily)
          : this.createFontError('unknown', 'Unknown error', fontFamily);

        // Wait before retry (exponential backoff)
        if (attempt < FONT_LOADING_CONFIG.retryAttempts - 1) {
          await this.delay(FONT_LOADING_CONFIG.retryDelay[attempt] || 1000);
        }
      }
    }

    const loadTime = performance.now() - startTime;
    const metrics = this.createMetrics(loadTime, FONT_LOADING_CONFIG.retryAttempts, true, 0);
    
    this.metrics.set(fontFamily, metrics);

    return {
      success: false,
      fontFamily,
      loadTime,
      error: lastError,
      metrics,
    };
  }

  /**
   * Load font with timeout
   */
  private async loadFontWithTimeout(fontFamily: string, timeout: number): Promise<void> {
    if (!this.detectFontLoadingSupport()) {
      throw new Error('Font loading API not supported');
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Font loading timeout after ${timeout}ms`));
      }, timeout);

      // Try to load the font using the Font Loading API
      document.fonts.load(`1em ${fontFamily}`)
        .then(() => {
          clearTimeout(timeoutId);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  /**
   * Check if font is a system font
   */
  private isSystemFont(fontName: string): boolean {
    const systemFonts = [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'serif',
      'monospace',
    ];
    
    return systemFonts.some(systemFont => 
      fontName.toLowerCase().includes(systemFont.toLowerCase())
    );
  }

  /**
   * Create font loading error
   */
  private createFontError(
    type: FontLoadingError['type'],
    message: string,
    fontFamily: string
  ): FontLoadingError {
    return {
      type,
      message,
      fontFamily,
      timestamp: Date.now(),
    };
  }

  /**
   * Create font metrics
   */
  private createMetrics(
    loadTime: number,
    retryCount: number,
    fallbackUsed: boolean,
    cumulativeLayoutShift: number
  ): FontMetrics {
    return {
      loadTime,
      retryCount,
      fallbackUsed,
      cumulativeLayoutShift,
    };
  }

  /**
   * Create default metrics
   */
  private createDefaultMetrics(): FontMetrics {
    return {
      loadTime: 0,
      retryCount: 0,
      fallbackUsed: false,
      cumulativeLayoutShift: 0,
    };
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const fontLoader = new FontLoader();

// Utility functions
export const loadPrimaryFont = () => fontLoader.loadPrimaryFont();
export const loadFallbackFont = (fontName: string) => fontLoader.loadFallbackFont(fontName);
export const isFontLoaded = (fontFamily: string) => fontLoader.isFontLoaded(fontFamily);
export const getFontMetrics = (fontFamily: string) => fontLoader.getFontMetrics(fontFamily);

export default FontLoader;
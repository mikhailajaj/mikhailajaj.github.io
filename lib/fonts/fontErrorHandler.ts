/**
 * Font Error Handler
 * 
 * Provides comprehensive error handling, retry logic, and metrics collection
 * for font loading failures in Next.js applications.
 */

import { FontLoadingError, FontMetrics, FONT_LOADING_CONFIG } from './fontConfig';

export interface ErrorRecoveryStrategy {
  retryAttempts: number;
  retryDelay: number[];
  fallbackAction: 'useSystemFonts' | 'useLocalFonts' | 'reportOnly';
  reportToConsole?: boolean;
  reportToService?: boolean;
}

export interface FontErrorReport {
  error: FontLoadingError;
  userAgent: string;
  url: string;
  timestamp: number;
  sessionId: string;
  additionalContext?: Record<string, any>;
}

export class FontErrorHandler {
  private errorCounts: Map<string, number> = new Map();
  private lastErrors: Map<string, FontLoadingError> = new Map();
  private sessionId: string;
  private errorReports: FontErrorReport[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Handle font loading error with appropriate recovery strategy
   */
  handleLoadingError(error: FontLoadingError): void {
    const errorKey = `${error.fontFamily}-${error.type}`;
    const currentCount = this.errorCounts.get(errorKey) || 0;
    
    this.errorCounts.set(errorKey, currentCount + 1);
    this.lastErrors.set(error.fontFamily, error);

    // Create error report
    const report = this.createErrorReport(error);
    this.errorReports.push(report);

    // Apply recovery strategy based on error type
    const strategy = this.getRecoveryStrategy(error.type);
    this.applyRecoveryStrategy(error, strategy);

    // Report error if configured
    if (strategy.reportToConsole) {
      this.reportToConsole(error, currentCount + 1);
    }

    if (strategy.reportToService) {
      this.reportToService(report);
    }
  }

  /**
   * Report font loading metrics
   */
  reportFontMetrics(fontFamily: string, metrics: FontMetrics): void {
    // Log metrics for monitoring
    if (process.env.NODE_ENV === 'development') {
      console.log(`Font Metrics for ${fontFamily}:`, {
        loadTime: `${metrics.loadTime.toFixed(2)}ms`,
        retryCount: metrics.retryCount,
        fallbackUsed: metrics.fallbackUsed,
        cumulativeLayoutShift: metrics.cumulativeLayoutShift,
      });
    }

    // Report to analytics service in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'font_load_metrics', {
        font_family: fontFamily,
        load_time: Math.round(metrics.loadTime),
        retry_count: metrics.retryCount,
        fallback_used: metrics.fallbackUsed,
        cls: metrics.cumulativeLayoutShift,
      });
    }
  }

  /**
   * Check if should retry loading based on attempt count and error type
   */
  shouldRetryLoading(fontFamily: string, attempt: number): boolean {
    const errorKey = `${fontFamily}-retry`;
    const totalAttempts = this.errorCounts.get(errorKey) || 0;
    
    // Don't retry if we've exceeded the maximum attempts
    if (totalAttempts >= FONT_LOADING_CONFIG.retryAttempts) {
      return false;
    }

    // Don't retry for certain error types
    const lastError = this.lastErrors.get(fontFamily);
    if (lastError?.type === 'blocked') {
      return false;
    }

    return attempt < FONT_LOADING_CONFIG.retryAttempts;
  }

  /**
   * Get error statistics
   */
  getErrorStats(): Record<string, any> {
    const stats = {
      totalErrors: this.errorReports.length,
      errorsByType: {} as Record<string, number>,
      errorsByFont: {} as Record<string, number>,
      sessionId: this.sessionId,
    };

    this.errorReports.forEach(report => {
      // Count by error type
      stats.errorsByType[report.error.type] = (stats.errorsByType[report.error.type] || 0) + 1;
      
      // Count by font family
      stats.errorsByFont[report.error.fontFamily] = (stats.errorsByFont[report.error.fontFamily] || 0) + 1;
    });

    return stats;
  }

  /**
   * Clear error history
   */
  clearErrorHistory(): void {
    this.errorCounts.clear();
    this.lastErrors.clear();
    this.errorReports.length = 0;
  }

  /**
   * Get recovery strategy based on error type
   */
  private getRecoveryStrategy(errorType: FontLoadingError['type']): ErrorRecoveryStrategy {
    const strategies: Record<FontLoadingError['type'], ErrorRecoveryStrategy> = {
      network: {
        retryAttempts: 3,
        retryDelay: [1000, 2000, 4000],
        fallbackAction: 'useSystemFonts',
        reportToConsole: process.env.NODE_ENV === 'development',
        reportToService: process.env.NODE_ENV === 'production',
      },
      timeout: {
        retryAttempts: 2,
        retryDelay: [2000, 4000],
        fallbackAction: 'useSystemFonts',
        reportToConsole: process.env.NODE_ENV === 'development',
        reportToService: process.env.NODE_ENV === 'production',
      },
      blocked: {
        retryAttempts: 0,
        retryDelay: [],
        fallbackAction: 'useLocalFonts',
        reportToConsole: true,
        reportToService: true,
      },
      unknown: {
        retryAttempts: 1,
        retryDelay: [1000],
        fallbackAction: 'useSystemFonts',
        reportToConsole: true,
        reportToService: true,
      },
    };

    return strategies[errorType];
  }

  /**
   * Apply recovery strategy
   */
  private applyRecoveryStrategy(error: FontLoadingError, strategy: ErrorRecoveryStrategy): void {
    switch (strategy.fallbackAction) {
      case 'useSystemFonts':
        this.activateSystemFonts();
        break;
      case 'useLocalFonts':
        this.activateLocalFonts();
        break;
      case 'reportOnly':
        // Just report, don't change fonts
        break;
    }
  }

  /**
   * Activate system fonts as fallback
   */
  private activateSystemFonts(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--font-primary',
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      );
    }
  }

  /**
   * Activate local fonts as fallback
   */
  private activateLocalFonts(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(
        '--font-primary',
        'Arial, Helvetica, sans-serif'
      );
    }
  }

  /**
   * Report error to console
   */
  private reportToConsole(error: FontLoadingError, attemptCount: number): void {
    const message = `Font loading error (attempt ${attemptCount}): ${error.message}`;
    
    if (error.type === 'blocked') {
      console.warn(`🚫 ${message}`, error);
    } else if (error.type === 'timeout') {
      console.warn(`⏱️ ${message}`, error);
    } else {
      console.error(`❌ ${message}`, error);
    }
  }

  /**
   * Report error to external service
   */
  private reportToService(report: FontErrorReport): void {
    // In a real application, you would send this to your error reporting service
    // For now, we'll just store it locally
    if (process.env.NODE_ENV === 'development') {
      console.log('Error report would be sent to service:', report);
    }

    // Example: Send to error reporting service
    // fetch('/api/error-report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report),
    // }).catch(console.error);
  }

  /**
   * Create error report
   */
  private createErrorReport(error: FontLoadingError): FontErrorReport {
    return {
      error,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      additionalContext: {
        fontLoadingSupport: typeof document !== 'undefined' && 'fonts' in document,
        connectionType: this.getConnectionType(),
        screenSize: this.getScreenSize(),
      },
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `font-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  /**
   * Get screen size
   */
  private getScreenSize(): string {
    if (typeof window !== 'undefined') {
      return `${window.screen.width}x${window.screen.height}`;
    }
    return 'unknown';
  }
}

// Singleton instance
export const fontErrorHandler = new FontErrorHandler();

// Utility functions
export const handleFontError = (error: FontLoadingError) => fontErrorHandler.handleLoadingError(error);
export const reportFontMetrics = (fontFamily: string, metrics: FontMetrics) => 
  fontErrorHandler.reportFontMetrics(fontFamily, metrics);
export const shouldRetryFontLoading = (fontFamily: string, attempt: number) => 
  fontErrorHandler.shouldRetryLoading(fontFamily, attempt);
export const getFontErrorStats = () => fontErrorHandler.getErrorStats();

export default FontErrorHandler;
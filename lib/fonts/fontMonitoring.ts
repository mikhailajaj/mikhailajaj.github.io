/**
 * Font Monitoring Service
 * 
 * Monitors font loading performance, errors, and provides analytics
 * for the font loading system.
 */

import { FontLoadingState } from './fontLoader';

export interface FontMetrics {
  loadTime: number;
  retryCount: number;
  fallbackUsed: boolean;
  errorType?: string;
  userAgent: string;
  timestamp: number;
}

export interface FontAnalytics {
  totalLoads: number;
  successfulLoads: number;
  failedLoads: number;
  averageLoadTime: number;
  fallbackUsageRate: number;
  commonErrors: Record<string, number>;
}

class FontMonitoringService {
  private metrics: FontMetrics[] = [];
  private readonly maxMetrics = 100; // Keep last 100 metrics

  /**
   * Record font loading metrics
   */
  recordMetrics(fontName: string, state: FontLoadingState): void {
    const metrics: FontMetrics = {
      loadTime: state.loadTime || 0,
      retryCount: state.retryCount,
      fallbackUsed: state.status === 'error' || state.status === 'fallback',
      errorType: state.error?.name,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    };

    this.metrics.push(metrics);

    // Keep only the most recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Report to analytics if available
    this.reportToAnalytics(fontName, metrics);
  }

  /**
   * Get font loading analytics
   */
  getAnalytics(): FontAnalytics {
    if (this.metrics.length === 0) {
      return {
        totalLoads: 0,
        successfulLoads: 0,
        failedLoads: 0,
        averageLoadTime: 0,
        fallbackUsageRate: 0,
        commonErrors: {},
      };
    }

    const successfulLoads = this.metrics.filter(m => !m.fallbackUsed).length;
    const failedLoads = this.metrics.length - successfulLoads;
    const totalLoadTime = this.metrics.reduce((sum, m) => sum + m.loadTime, 0);
    const fallbackUsage = this.metrics.filter(m => m.fallbackUsed).length;

    // Count common errors
    const commonErrors: Record<string, number> = {};
    this.metrics.forEach(m => {
      if (m.errorType) {
        commonErrors[m.errorType] = (commonErrors[m.errorType] || 0) + 1;
      }
    });

    return {
      totalLoads: this.metrics.length,
      successfulLoads,
      failedLoads,
      averageLoadTime: totalLoadTime / this.metrics.length,
      fallbackUsageRate: (fallbackUsage / this.metrics.length) * 100,
      commonErrors,
    };
  }

  /**
   * Report metrics to external analytics
   */
  private reportToAnalytics(fontName: string, metrics: FontMetrics): void {
    // Report to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', 'font_load', {
        font_name: fontName,
        load_time: metrics.loadTime,
        retry_count: metrics.retryCount,
        fallback_used: metrics.fallbackUsed,
        error_type: metrics.errorType,
      });
    }

    // Report to custom analytics endpoint
    this.reportToCustomAnalytics(fontName, metrics);
  }

  /**
   * Report to custom analytics endpoint
   */
  private async reportToCustomAnalytics(fontName: string, metrics: FontMetrics): Promise<void> {
    try {
      // Only report in production and if endpoint is available
      if (process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        return;
      }

      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'font_metrics',
          fontName,
          metrics,
        }),
      });
    } catch (error) {
      // Silently fail - don't impact user experience
      console.debug('Failed to report font metrics:', error);
    }
  }

  /**
   * Get performance insights
   */
  getPerformanceInsights(): {
    recommendations: string[];
    issues: string[];
    score: number;
  } {
    const analytics = this.getAnalytics();
    const recommendations: string[] = [];
    const issues: string[] = [];
    let score = 100;

    // Check average load time
    if (analytics.averageLoadTime > 3000) {
      issues.push('Font loading is slow (>3s average)');
      recommendations.push('Consider using font-display: swap or preloading fonts');
      score -= 20;
    }

    // Check fallback usage rate
    if (analytics.fallbackUsageRate > 10) {
      issues.push(`High fallback usage rate: ${analytics.fallbackUsageRate.toFixed(1)}%`);
      recommendations.push('Investigate font loading failures and improve CDN reliability');
      score -= 15;
    }

    // Check retry patterns
    const avgRetries = this.metrics.reduce((sum, m) => sum + m.retryCount, 0) / this.metrics.length;
    if (avgRetries > 1) {
      issues.push('Frequent retry attempts detected');
      recommendations.push('Check network connectivity and CDN performance');
      score -= 10;
    }

    // Check for common errors
    const errorTypes = Object.keys(analytics.commonErrors);
    if (errorTypes.length > 0) {
      issues.push(`Common errors: ${errorTypes.join(', ')}`);
      recommendations.push('Address the most frequent error types');
      score -= 10;
    }

    return {
      recommendations,
      issues,
      score: Math.max(0, score),
    };
  }

  /**
   * Export metrics for debugging
   */
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      analytics: this.getAnalytics(),
      insights: this.getPerformanceInsights(),
      timestamp: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Singleton instance
export const fontMonitoringService = new FontMonitoringService();

// Global error handler for font-related errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message && event.message.includes('font')) {
      console.warn('Font-related error detected:', event.message);
    }
  });
}
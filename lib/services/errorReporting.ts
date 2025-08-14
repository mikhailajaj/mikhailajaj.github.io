/**
 * Error Reporting Service
 * 
 * Comprehensive error reporting and monitoring service for the portfolio.
 * Handles client-side errors, performance issues, and user feedback.
 * 
 * @fileoverview Error reporting service with analytics integration
 */

// 1. React Imports
// (None in this file)

// 2. External Libraries
// (None in this file)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { performanceMonitor } from './performance';

// 4. Internal Relative Imports
// (None in this file)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this file)

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error types for categorization
 */
export type ErrorType = 
  | 'javascript-error'
  | 'promise-rejection'
  | 'network-error'
  | 'performance-error'
  | 'accessibility-error'
  | 'user-error'
  | 'system-error';

/**
 * Error context interface
 */
export interface ErrorContext {
  url: string;
  userAgent: string;
  timestamp: string;
  sessionId?: string;
  userId?: string;
  domain?: string;
  component?: string;
  action?: string;
  additionalData?: Record<string, any>;
}

/**
 * Error report interface
 */
export interface ErrorReport {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  context: ErrorContext;
  fingerprint: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  resolved: boolean;
}

/**
 * Error reporting configuration
 */
interface ErrorReportingConfig {
  enabled: boolean;
  endpoint?: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
  maxReports: number;
  throttleMs: number;
  enableConsoleLogging: boolean;
  enablePerformanceIntegration: boolean;
}

/**
 * Error Reporting Service Class
 */
class ErrorReportingService {
  private static instance: ErrorReportingService;
  private config: ErrorReportingConfig;
  private reportQueue: ErrorReport[] = [];
  private reportCache = new Map<string, ErrorReport>();
  private throttleMap = new Map<string, number>();
  private isInitialized = false;

  private constructor() {
    this.config = {
      enabled: true,
      endpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT,
      apiKey: process.env.NEXT_PUBLIC_ERROR_REPORTING_API_KEY,
      environment: (process.env.NODE_ENV as any) || 'development',
      maxReports: 100,
      throttleMs: 5000, // 5 seconds
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enablePerformanceIntegration: true,
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  /**
   * Initialize error reporting
   */
  public initialize(config?: Partial<ErrorReportingConfig>): void {
    if (this.isInitialized) return;

    // Update configuration
    this.config = { ...this.config, ...config };

    if (!this.config.enabled) return;

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    // Set up performance integration
    if (this.config.enablePerformanceIntegration) {
      this.setupPerformanceIntegration();
    }

    // Set up periodic reporting
    this.setupPeriodicReporting();

    this.isInitialized = true;

    if (this.config.enableConsoleLogging) {
      console.log('[ErrorReporting] Service initialized');
    }
  }

  /**
   * Report an error
   */
  public reportError(
    error: Error | string,
    type: ErrorType = 'javascript-error',
    severity: ErrorSeverity = 'medium',
    context?: Partial<ErrorContext>
  ): string {
    if (!this.config.enabled) return '';

    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;
    
    // Generate error fingerprint for deduplication
    const fingerprint = this.generateFingerprint(errorMessage, errorStack, type);
    
    // Check throttling
    if (this.isThrottled(fingerprint)) {
      return '';
    }

    // Create error context
    const fullContext: ErrorContext = {
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
      domain: this.getCurrentDomain(),
      ...context,
    };

    // Create or update error report
    const existingReport = this.reportCache.get(fingerprint);
    let report: ErrorReport;

    if (existingReport) {
      // Update existing report
      report = {
        ...existingReport,
        count: existingReport.count + 1,
        lastSeen: fullContext.timestamp,
        context: fullContext, // Update with latest context
      };
    } else {
      // Create new report
      report = {
        id: this.generateReportId(),
        type,
        severity,
        message: errorMessage,
        stack: errorStack,
        context: fullContext,
        fingerprint,
        count: 1,
        firstSeen: fullContext.timestamp,
        lastSeen: fullContext.timestamp,
        resolved: false,
      };
    }

    // Cache the report
    this.reportCache.set(fingerprint, report);

    // Add to queue for sending
    this.addToQueue(report);

    // Dispatch event for error tracking integration
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('error-reported', {
        detail: report,
      }));
    }

    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      console.error('[ErrorReporting] Error reported:', {
        id: report.id,
        type,
        severity,
        message: errorMessage,
        context: fullContext,
      });
    }

    // Update throttle map
    this.throttleMap.set(fingerprint, Date.now());

    return report.id;
  }

  /**
   * Report performance error
   */
  public reportPerformanceError(
    metric: string,
    value: number,
    threshold: number,
    context?: Partial<ErrorContext>
  ): string {
    return this.reportError(
      `Performance threshold exceeded: ${metric} (${value}ms > ${threshold}ms)`,
      'performance-error',
      value > threshold * 2 ? 'high' : 'medium',
      {
        ...context,
        additionalData: {
          metric,
          value,
          threshold,
          exceeded: value - threshold,
        },
      }
    );
  }

  /**
   * Report accessibility error
   */
  public reportAccessibilityError(
    violation: string,
    element?: string,
    context?: Partial<ErrorContext>
  ): string {
    return this.reportError(
      `Accessibility violation: ${violation}`,
      'accessibility-error',
      'medium',
      {
        ...context,
        additionalData: {
          violation,
          element,
        },
      }
    );
  }

  /**
   * Report network error
   */
  public reportNetworkError(
    url: string,
    status: number,
    statusText: string,
    context?: Partial<ErrorContext>
  ): string {
    return this.reportError(
      `Network error: ${status} ${statusText} for ${url}`,
      'network-error',
      status >= 500 ? 'high' : 'medium',
      {
        ...context,
        additionalData: {
          url,
          status,
          statusText,
        },
      }
    );
  }

  /**
   * Get error reports
   */
  public getReports(): ErrorReport[] {
    return Array.from(this.reportCache.values()).sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );
  }

  /**
   * Get error statistics
   */
  public getStatistics(): {
    totalErrors: number;
    errorsByType: Record<ErrorType, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
    recentErrors: number;
  } {
    const reports = this.getReports();
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    const errorsByType = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + report.count;
      return acc;
    }, {} as Record<ErrorType, number>);

    const errorsBySeverity = reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + report.count;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    const recentErrors = reports.filter(
      report => new Date(report.lastSeen).getTime() > oneHourAgo
    ).reduce((sum, report) => sum + report.count, 0);

    return {
      totalErrors: reports.reduce((sum, report) => sum + report.count, 0),
      errorsByType,
      errorsBySeverity,
      recentErrors,
    };
  }

  /**
   * Clear error reports
   */
  public clearReports(): void {
    this.reportCache.clear();
    this.reportQueue = [];
    this.throttleMap.clear();

    if (this.config.enableConsoleLogging) {
      console.log('[ErrorReporting] Reports cleared');
    }
  }

  /**
   * Export error reports
   */
  public exportReports(): string {
    const data = {
      reports: this.getReports(),
      statistics: this.getStatistics(),
      config: {
        environment: this.config.environment,
        timestamp: new Date().toISOString(),
      },
    };

    return JSON.stringify(data, null, 2);
  }

  // Private methods

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportError(
        event.error || new Error(event.message),
        'javascript-error',
        'high',
        {
          component: 'global',
          additionalData: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        }
      );
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError(
        new Error(`Unhandled promise rejection: ${event.reason}`),
        'promise-rejection',
        'high',
        {
          component: 'global',
          additionalData: {
            reason: event.reason,
          },
        }
      );
    });

    // Network errors (fetch failures)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.reportNetworkError(
            args[0] as string,
            response.status,
            response.statusText
          );
        }
        
        return response;
      } catch (error) {
        this.reportError(
          error as Error,
          'network-error',
          'medium',
          {
            additionalData: {
              url: args[0],
              method: (args[1] as RequestInit)?.method || 'GET',
            },
          }
        );
        throw error;
      }
    };
  }

  /**
   * Setup performance integration
   */
  private setupPerformanceIntegration(): void {
    // Listen for performance errors from the performance monitor
    if (typeof window !== 'undefined') {
      window.addEventListener('performance-budget-exceeded', ((event: CustomEvent) => {
        const { metric, value, budget } = event.detail;
        this.reportPerformanceError(metric, value, budget);
      }) as EventListener);
    }
  }

  /**
   * Setup periodic reporting
   */
  private setupPeriodicReporting(): void {
    // Send queued reports every 30 seconds
    setInterval(() => {
      this.sendQueuedReports();
    }, 30000);

    // Clean up old throttle entries every 5 minutes
    setInterval(() => {
      this.cleanupThrottleMap();
    }, 300000);
  }

  /**
   * Generate error fingerprint for deduplication
   */
  private generateFingerprint(message: string, stack?: string, type?: ErrorType): string {
    const key = `${type}-${message}-${stack?.split('\n')[0] || ''}`;
    return btoa(key).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  /**
   * Generate unique report ID
   */
  private generateReportId(): string {
    return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if error is throttled
   */
  private isThrottled(fingerprint: string): boolean {
    const lastReported = this.throttleMap.get(fingerprint);
    if (!lastReported) return false;
    
    return Date.now() - lastReported < this.config.throttleMs;
  }

  /**
   * Add report to queue
   */
  private addToQueue(report: ErrorReport): void {
    // Remove oldest reports if queue is full
    if (this.reportQueue.length >= this.config.maxReports) {
      this.reportQueue.shift();
    }
    
    this.reportQueue.push(report);
  }

  /**
   * Send queued reports
   */
  private async sendQueuedReports(): Promise<void> {
    if (!this.config.endpoint || this.reportQueue.length === 0) return;

    const reportsToSend = [...this.reportQueue];
    this.reportQueue = [];

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` }),
        },
        body: JSON.stringify({
          reports: reportsToSend,
          environment: this.config.environment,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send reports: ${response.status} ${response.statusText}`);
      }

      if (this.config.enableConsoleLogging) {
        console.log(`[ErrorReporting] Sent ${reportsToSend.length} reports`);
      }
    } catch (error) {
      // Re-queue reports on failure
      this.reportQueue.unshift(...reportsToSend);
      
      if (this.config.enableConsoleLogging) {
        console.warn('[ErrorReporting] Failed to send reports:', error);
      }
    }
  }

  /**
   * Clean up old throttle entries
   */
  private cleanupThrottleMap(): void {
    const now = Date.now();
    const cutoff = now - this.config.throttleMs * 2; // Keep entries for 2x throttle time
    
    for (const [fingerprint, timestamp] of this.throttleMap.entries()) {
      if (timestamp < cutoff) {
        this.throttleMap.delete(fingerprint);
      }
    }
  }

  /**
   * Get current domain from URL
   */
  private getCurrentDomain(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const path = window.location.pathname;
    if (path.includes('/full-stack')) return 'full-stack';
    if (path.includes('/cloud-engineering')) return 'cloud-engineering';
    if (path.includes('/data-analytics')) return 'data-analytics';
    if (path.includes('/ux-ui-design')) return 'ux-ui-design';
    if (path.includes('/technical-consulting')) return 'technical-consulting';
    return 'general';
  }
}

// Export singleton instance
export const errorReporting = ErrorReportingService.getInstance();

// Export utility functions
export const reportError = (
  error: Error | string,
  type?: ErrorType,
  severity?: ErrorSeverity,
  context?: Partial<ErrorContext>
) => errorReporting.reportError(error, type, severity, context);

export const reportPerformanceError = (
  metric: string,
  value: number,
  threshold: number,
  context?: Partial<ErrorContext>
) => errorReporting.reportPerformanceError(metric, value, threshold, context);

export const reportAccessibilityError = (
  violation: string,
  element?: string,
  context?: Partial<ErrorContext>
) => errorReporting.reportAccessibilityError(violation, element, context);

export const reportNetworkError = (
  url: string,
  status: number,
  statusText: string,
  context?: Partial<ErrorContext>
) => errorReporting.reportNetworkError(url, status, statusText, context);
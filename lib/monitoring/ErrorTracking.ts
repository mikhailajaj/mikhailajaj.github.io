/**
 * Error Tracking System
 * 
 * Advanced error tracking with analytics, trend analysis, and insights.
 * Integrates with the error reporting service for comprehensive monitoring.
 * 
 * @fileoverview Error tracking with analytics and insights
 */

// 1. React Imports
// (None in this file)

// 2. External Libraries
// (None in this file)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { errorReporting, type ErrorReport, type ErrorSeverity, type ErrorType } from '@/lib/services/errorReporting';
import { performanceMonitor } from '@/lib/services/performance';

// 4. Internal Relative Imports
// (None in this file)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this file)

/**
 * Error trend data interface
 */
export interface ErrorTrend {
  timestamp: string;
  count: number;
  severity: ErrorSeverity;
  type: ErrorType;
  domain?: string;
}

/**
 * Error analytics interface
 */
export interface ErrorAnalytics {
  totalErrors: number;
  errorRate: number;
  topErrors: Array<{
    fingerprint: string;
    message: string;
    count: number;
    severity: ErrorSeverity;
    lastSeen: string;
  }>;
  errorsByDomain: Record<string, number>;
  errorsByType: Record<ErrorType, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  trends: ErrorTrend[];
  resolution: {
    resolved: number;
    unresolved: number;
    averageResolutionTime: number;
  };
  impact: {
    affectedUsers: number;
    performanceImpact: number;
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
  };
}

/**
 * Error insight interface
 */
export interface ErrorInsight {
  id: string;
  type: 'pattern' | 'spike' | 'regression' | 'improvement';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  data: Record<string, any>;
  timestamp: string;
}

/**
 * Error tracking configuration
 */
interface ErrorTrackingConfig {
  enabled: boolean;
  retentionDays: number;
  analyticsInterval: number; // minutes
  insightGeneration: boolean;
  performanceIntegration: boolean;
  alertThresholds: {
    errorRate: number;
    criticalErrors: number;
    performanceImpact: number;
  };
}

/**
 * Error Tracking Service Class
 */
class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private config: ErrorTrackingConfig;
  private trends: ErrorTrend[] = [];
  private insights: ErrorInsight[] = [];
  private analytics: ErrorAnalytics | null = null;
  private lastAnalyticsUpdate = 0;
  private isInitialized = false;

  private constructor() {
    this.config = {
      enabled: true,
      retentionDays: 30,
      analyticsInterval: 5, // 5 minutes
      insightGeneration: true,
      performanceIntegration: true,
      alertThresholds: {
        errorRate: 0.05, // 5% error rate
        criticalErrors: 10, // 10 critical errors per hour
        performanceImpact: 0.2, // 20% performance degradation
      },
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  /**
   * Initialize error tracking
   */
  public initialize(config?: Partial<ErrorTrackingConfig>): void {
    if (this.isInitialized) return;

    // Update configuration
    this.config = { ...this.config, ...config };

    if (!this.config.enabled) return;

    // Initialize error reporting integration
    this.setupErrorReportingIntegration();

    // Setup periodic analytics updates
    this.setupPeriodicAnalytics();

    // Setup insight generation
    if (this.config.insightGeneration) {
      this.setupInsightGeneration();
    }

    // Setup performance integration
    if (this.config.performanceIntegration) {
      this.setupPerformanceIntegration();
    }

    this.isInitialized = true;
    console.log('[ErrorTracking] Service initialized');
  }

  /**
   * Get current analytics
   */
  public getAnalytics(): ErrorAnalytics | null {
    this.updateAnalyticsIfNeeded();
    return this.analytics;
  }

  /**
   * Get error trends
   */
  public getTrends(timeRange?: { start: Date; end: Date }): ErrorTrend[] {
    let trends = this.trends;

    if (timeRange) {
      trends = trends.filter(trend => {
        const trendTime = new Date(trend.timestamp);
        return trendTime >= timeRange.start && trendTime <= timeRange.end;
      });
    }

    return trends.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Get insights
   */
  public getInsights(): ErrorInsight[] {
    return this.insights.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Track error occurrence
   */
  public trackError(report: ErrorReport): void {
    if (!this.config.enabled) return;

    // Add to trends
    this.addToTrends(report);

    // Trigger analytics update
    this.scheduleAnalyticsUpdate();

    // Check for alerts
    this.checkAlerts(report);
  }

  /**
   * Mark error as resolved
   */
  public resolveError(fingerprint: string): void {
    const reports = errorReporting.getReports();
    const report = reports.find(r => r.fingerprint === fingerprint);
    
    if (report) {
      report.resolved = true;
      this.generateInsight({
        type: 'improvement',
        severity: 'info',
        title: 'Error Resolved',
        description: `Error "${report.message}" has been resolved`,
        recommendation: 'Monitor for recurrence and document the solution',
        data: { fingerprint, resolvedAt: new Date().toISOString() },
      });
    }
  }

  /**
   * Get error impact analysis
   */
  public getErrorImpact(fingerprint: string): {
    userImpact: number;
    performanceImpact: number;
    businessImpact: 'low' | 'medium' | 'high' | 'critical';
    affectedDomains: string[];
  } {
    const reports = errorReporting.getReports();
    const report = reports.find(r => r.fingerprint === fingerprint);
    
    if (!report) {
      return {
        userImpact: 0,
        performanceImpact: 0,
        businessImpact: 'low',
        affectedDomains: [],
      };
    }

    // Calculate user impact (simplified)
    const userImpact = Math.min(report.count * 0.1, 100);

    // Calculate performance impact
    const performanceImpact = this.calculatePerformanceImpact(report);

    // Determine business impact
    const businessImpact = this.calculateBusinessImpact(report, userImpact, performanceImpact);

    // Get affected domains
    const affectedDomains = this.getAffectedDomains(report);

    return {
      userImpact,
      performanceImpact,
      businessImpact,
      affectedDomains,
    };
  }

  /**
   * Export tracking data
   */
  public exportData(): string {
    const data = {
      analytics: this.analytics,
      trends: this.trends,
      insights: this.insights,
      config: this.config,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear tracking data
   */
  public clearData(): void {
    this.trends = [];
    this.insights = [];
    this.analytics = null;
    this.lastAnalyticsUpdate = 0;
    console.log('[ErrorTracking] Data cleared');
  }

  // Private methods

  /**
   * Setup error reporting integration
   */
  private setupErrorReportingIntegration(): void {
    // Listen for new error reports
    if (typeof window !== 'undefined') {
      window.addEventListener('error-reported', ((event: CustomEvent) => {
        this.trackError(event.detail);
      }) as EventListener);
    }
  }

  /**
   * Setup periodic analytics updates
   */
  private setupPeriodicAnalytics(): void {
    setInterval(() => {
      this.updateAnalytics();
    }, this.config.analyticsInterval * 60 * 1000);
  }

  /**
   * Setup insight generation
   */
  private setupInsightGeneration(): void {
    setInterval(() => {
      this.generateInsights();
    }, 10 * 60 * 1000); // Every 10 minutes
  }

  /**
   * Setup performance integration
   */
  private setupPerformanceIntegration(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('performance-degradation', ((event: CustomEvent) => {
        this.handlePerformanceDegradation(event.detail);
      }) as EventListener);
    }
  }

  /**
   * Add error to trends
   */
  private addToTrends(report: ErrorReport): void {
    const trend: ErrorTrend = {
      timestamp: new Date().toISOString(),
      count: 1,
      severity: report.severity,
      type: report.type,
      domain: report.context.domain,
    };

    this.trends.push(trend);

    // Clean up old trends
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - this.config.retentionDays);
    
    this.trends = this.trends.filter(
      t => new Date(t.timestamp) > cutoff
    );
  }

  /**
   * Update analytics if needed
   */
  private updateAnalyticsIfNeeded(): void {
    const now = Date.now();
    const updateInterval = this.config.analyticsInterval * 60 * 1000;
    
    if (now - this.lastAnalyticsUpdate > updateInterval) {
      this.updateAnalytics();
    }
  }

  /**
   * Update analytics
   */
  private updateAnalytics(): void {
    const reports = errorReporting.getReports();
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Calculate error rate (errors per session - simplified)
    const recentErrors = reports.filter(
      r => new Date(r.lastSeen) > oneHourAgo
    ).reduce((sum, r) => sum + r.count, 0);
    
    const errorRate = recentErrors / 100; // Simplified calculation

    // Get top errors
    const topErrors = reports
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(r => ({
        fingerprint: r.fingerprint,
        message: r.message,
        count: r.count,
        severity: r.severity,
        lastSeen: r.lastSeen,
      }));

    // Group by domain
    const errorsByDomain = reports.reduce((acc, report) => {
      const domain = report.context.domain || 'unknown';
      acc[domain] = (acc[domain] || 0) + report.count;
      return acc;
    }, {} as Record<string, number>);

    // Group by type
    const errorsByType = reports.reduce((acc, report) => {
      acc[report.type] = (acc[report.type] || 0) + report.count;
      return acc;
    }, {} as Record<ErrorType, number>);

    // Group by severity
    const errorsBySeverity = reports.reduce((acc, report) => {
      acc[report.severity] = (acc[report.severity] || 0) + report.count;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    // Calculate resolution metrics
    const resolvedCount = reports.filter(r => r.resolved).length;
    const unresolvedCount = reports.length - resolvedCount;
    
    // Simplified average resolution time calculation
    const averageResolutionTime = 24; // hours (placeholder)

    // Calculate impact metrics
    const affectedUsers = Math.min(reports.reduce((sum, r) => sum + r.count, 0) * 0.1, 1000);
    const performanceImpact = this.calculateOverallPerformanceImpact(reports);
    const businessImpact = this.calculateOverallBusinessImpact(reports);

    this.analytics = {
      totalErrors: reports.reduce((sum, r) => sum + r.count, 0),
      errorRate,
      topErrors,
      errorsByDomain,
      errorsByType,
      errorsBySeverity,
      trends: this.getTrends({ start: oneHourAgo, end: now }),
      resolution: {
        resolved: resolvedCount,
        unresolved: unresolvedCount,
        averageResolutionTime,
      },
      impact: {
        affectedUsers,
        performanceImpact,
        businessImpact,
      },
    };

    this.lastAnalyticsUpdate = Date.now();
  }

  /**
   * Generate insights
   */
  private generateInsights(): void {
    if (!this.analytics) return;

    // Check for error spikes
    this.checkForErrorSpikes();

    // Check for new error patterns
    this.checkForErrorPatterns();

    // Check for performance regressions
    this.checkForPerformanceRegressions();

    // Clean up old insights
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7); // Keep insights for 7 days
    
    this.insights = this.insights.filter(
      insight => new Date(insight.timestamp) > cutoff
    );
  }

  /**
   * Check for error spikes
   */
  private checkForErrorSpikes(): void {
    const recentTrends = this.getTrends({
      start: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      end: new Date(),
    });

    const errorCount = recentTrends.reduce((sum, trend) => sum + trend.count, 0);
    
    if (errorCount > this.config.alertThresholds.criticalErrors) {
      this.generateInsight({
        type: 'spike',
        severity: 'critical',
        title: 'Error Spike Detected',
        description: `Detected ${errorCount} errors in the last hour, exceeding threshold of ${this.config.alertThresholds.criticalErrors}`,
        recommendation: 'Investigate recent deployments and check system health',
        data: { errorCount, threshold: this.config.alertThresholds.criticalErrors },
      });
    }
  }

  /**
   * Check for error patterns
   */
  private checkForErrorPatterns(): void {
    const reports = errorReporting.getReports();
    const recentReports = reports.filter(
      r => new Date(r.lastSeen) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    // Check for domain-specific patterns
    const domainErrors = recentReports.reduce((acc, report) => {
      const domain = report.context.domain || 'unknown';
      acc[domain] = (acc[domain] || 0) + report.count;
      return acc;
    }, {} as Record<string, number>);

    for (const [domain, count] of Object.entries(domainErrors)) {
      if (count > 20) { // Threshold for domain-specific issues
        this.generateInsight({
          type: 'pattern',
          severity: 'warning',
          title: `High Error Rate in ${domain} Domain`,
          description: `Detected ${count} errors in the ${domain} domain in the last 24 hours`,
          recommendation: `Review ${domain} domain components and recent changes`,
          data: { domain, count },
        });
      }
    }
  }

  /**
   * Check for performance regressions
   */
  private checkForPerformanceRegressions(): void {
    if (!this.analytics) return;

    if (this.analytics.impact.performanceImpact > this.config.alertThresholds.performanceImpact) {
      this.generateInsight({
        type: 'regression',
        severity: 'warning',
        title: 'Performance Regression Detected',
        description: `Performance impact from errors exceeds ${this.config.alertThresholds.performanceImpact * 100}%`,
        recommendation: 'Review error-prone components and optimize performance',
        data: { 
          performanceImpact: this.analytics.impact.performanceImpact,
          threshold: this.config.alertThresholds.performanceImpact 
        },
      });
    }
  }

  /**
   * Generate insight
   */
  private generateInsight(insight: Omit<ErrorInsight, 'id' | 'timestamp'>): void {
    const newInsight: ErrorInsight = {
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...insight,
    };

    this.insights.push(newInsight);

    // Dispatch event for UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('error-insight-generated', {
        detail: newInsight,
      }));
    }
  }

  /**
   * Schedule analytics update
   */
  private scheduleAnalyticsUpdate(): void {
    // Debounced update
    setTimeout(() => {
      this.updateAnalytics();
    }, 1000);
  }

  /**
   * Check alerts
   */
  private checkAlerts(report: ErrorReport): void {
    if (report.severity === 'critical') {
      this.generateInsight({
        type: 'spike',
        severity: 'critical',
        title: 'Critical Error Detected',
        description: `Critical error: ${report.message}`,
        recommendation: 'Immediate investigation required',
        data: { report },
      });
    }
  }

  /**
   * Calculate performance impact for a specific error
   */
  private calculatePerformanceImpact(report: ErrorReport): number {
    // Simplified calculation based on error type and frequency
    const typeMultiplier = {
      'performance-error': 0.8,
      'network-error': 0.6,
      'javascript-error': 0.4,
      'promise-rejection': 0.3,
      'accessibility-error': 0.1,
      'user-error': 0.1,
      'system-error': 0.7,
    };

    const severityMultiplier = {
      'critical': 1.0,
      'high': 0.7,
      'medium': 0.4,
      'low': 0.1,
    };

    return Math.min(
      report.count * 
      (typeMultiplier[report.type] || 0.3) * 
      (severityMultiplier[report.severity] || 0.3) * 
      0.01,
      1.0
    );
  }

  /**
   * Calculate business impact for a specific error
   */
  private calculateBusinessImpact(
    report: ErrorReport, 
    userImpact: number, 
    performanceImpact: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    const impact = (userImpact + performanceImpact * 100) / 2;
    
    if (impact > 80 || report.severity === 'critical') return 'critical';
    if (impact > 50 || report.severity === 'high') return 'high';
    if (impact > 20 || report.severity === 'medium') return 'medium';
    return 'low';
  }

  /**
   * Get affected domains for an error
   */
  private getAffectedDomains(report: ErrorReport): string[] {
    return [report.context.domain || 'unknown'];
  }

  /**
   * Calculate overall performance impact
   */
  private calculateOverallPerformanceImpact(reports: ErrorReport[]): number {
    return reports.reduce((sum, report) => 
      sum + this.calculatePerformanceImpact(report), 0
    ) / reports.length;
  }

  /**
   * Calculate overall business impact
   */
  private calculateOverallBusinessImpact(reports: ErrorReport[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalCount = reports.filter(r => r.severity === 'critical').length;
    const highCount = reports.filter(r => r.severity === 'high').length;
    
    if (criticalCount > 5) return 'critical';
    if (criticalCount > 0 || highCount > 10) return 'high';
    if (highCount > 0) return 'medium';
    return 'low';
  }

  /**
   * Handle performance degradation
   */
  private handlePerformanceDegradation(data: any): void {
    this.generateInsight({
      type: 'regression',
      severity: 'warning',
      title: 'Performance Degradation Detected',
      description: `Performance degradation detected: ${data.metric}`,
      recommendation: 'Review recent changes and optimize performance',
      data,
    });
  }
}

// Export singleton instance
export const errorTracking = ErrorTrackingService.getInstance();

// Export types
export type { ErrorAnalytics, ErrorTrend, ErrorInsight };

// Export default
export default errorTracking;

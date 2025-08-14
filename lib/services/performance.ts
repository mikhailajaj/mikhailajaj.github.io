/**
 * Performance Monitoring Service
 * 
 * Comprehensive performance monitoring and analytics service for the portfolio.
 * Tracks Core Web Vitals, custom metrics, and provides real-time monitoring.
 * 
 * @fileoverview Performance monitoring service with admin dashboard support
 */

// 1. React Imports
// (None in this file)

// 2. External Libraries
// (None in this file)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { DOMAIN_COLORS } from '@/lib/constants/domains';

// 4. Internal Relative Imports
// (None in this file)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this file)

/**
 * Core Web Vitals metrics interface
 */
export interface CoreWebVitals {
  fcp: number;  // First Contentful Paint
  lcp: number;  // Largest Contentful Paint
  fid: number;  // First Input Delay
  cls: number;  // Cumulative Layout Shift
  inp: number;  // Interaction to Next Paint
  ttfb: number; // Time to First Byte
}

/**
 * Custom portfolio metrics interface
 */
export interface CustomMetrics {
  heroLoadTime: number;
  projectGalleryLoadTime: number;
  threeDComponentLoadTime: number;
  domainSwitchTime: number;
  navigationResponseTime: number;
  imageLoadTime: number;
  fontLoadTime: number;
  jsExecutionTime: number;
  cssParseTime: number;
}

/**
 * Resource timing metrics interface
 */
export interface ResourceMetrics {
  type: string;
  count: number;
  totalSize: number;
  averageLoadTime: number;
  cacheHitRate: number;
}

/**
 * Performance session data interface
 */
export interface PerformanceSession {
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  coreWebVitals: Partial<CoreWebVitals>;
  customMetrics: Partial<CustomMetrics>;
  resourceMetrics: ResourceMetrics[];
  errors: PerformanceError[];
  domain: string;
}

/**
 * Performance error interface
 */
export interface PerformanceError {
  type: 'budget-exceeded' | 'slow-resource' | 'layout-shift' | 'long-task';
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  details: Record<string, any>;
}

/**
 * Performance budget configuration
 */
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals targets (good thresholds)
  fcp: 1800,    // First Contentful Paint (ms)
  lcp: 2500,    // Largest Contentful Paint (ms)
  fid: 100,     // First Input Delay (ms)
  cls: 0.1,     // Cumulative Layout Shift
  inp: 200,     // Interaction to Next Paint (ms)
  ttfb: 800,    // Time to First Byte (ms)
  
  // Custom portfolio metrics
  heroLoadTime: 1000,
  projectGalleryLoadTime: 1500,
  threeDComponentLoadTime: 2000,
  domainSwitchTime: 300,
  navigationResponseTime: 200,
  
  // Resource budgets
  totalSize: 1000000,      // 1MB total
  imageSize: 500000,       // 500KB images
  jsSize: 300000,          // 300KB JavaScript
  cssSize: 100000,         // 100KB CSS
  fontSize: 100000,        // 100KB fonts
  
  // Performance scores
  lighthouseScore: 90,
  accessibilityScore: 95,
  seoScore: 95,
} as const;

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private sessions: PerformanceSession[] = [];
  private currentSession: PerformanceSession | null = null;
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  private constructor() {
    this.initializeSession();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize new performance session
   */
  private initializeSession(): void {
    if (typeof window === 'undefined') return;

    this.currentSession = {
      id: this.generateSessionId(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      deviceType: this.getDeviceType(),
      coreWebVitals: {},
      customMetrics: {},
      resourceMetrics: [],
      errors: [],
      domain: this.getCurrentDomain(),
    };
  }

  /**
   * Start monitoring performance
   */
  public startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;

    this.isMonitoring = true;
    this.setupCoreWebVitalsObservers();
    this.setupResourceObservers();
    this.setupCustomMetricTracking();
    this.setupErrorTracking();
    this.setupBudgetMonitoring();

    console.log('[PerformanceMonitor] Started monitoring');
  }

  /**
   * Stop monitoring performance
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;

    if (this.currentSession) {
      this.sessions.push(this.currentSession);
      this.saveSessionToStorage();
    }

    console.log('[PerformanceMonitor] Stopped monitoring');
  }

  /**
   * Setup Core Web Vitals observers
   */
  private setupCoreWebVitalsObservers(): void {
    // First Contentful Paint
    this.createObserver(['paint'], (entries) => {
      const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp && this.currentSession) {
        this.currentSession.coreWebVitals.fcp = fcp.startTime;
        this.checkBudget('fcp', fcp.startTime);
      }
    });

    // Largest Contentful Paint
    this.createObserver(['largest-contentful-paint'], (entries) => {
      const lcp = entries[entries.length - 1];
      if (lcp && this.currentSession) {
        this.currentSession.coreWebVitals.lcp = lcp.startTime;
        this.checkBudget('lcp', lcp.startTime);
      }
    });

    // First Input Delay
    this.createObserver(['first-input'], (entries) => {
      const fid = entries[0];
      if (fid && this.currentSession) {
        const fidValue = fid.processingStart - fid.startTime;
        this.currentSession.coreWebVitals.fid = fidValue;
        this.checkBudget('fid', fidValue);
      }
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.createObserver(['layout-shift'], (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      if (this.currentSession) {
        this.currentSession.coreWebVitals.cls = clsValue;
        this.checkBudget('cls', clsValue);
      }
    });

    // Time to First Byte
    if (performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation && this.currentSession) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        this.currentSession.coreWebVitals.ttfb = ttfb;
        this.checkBudget('ttfb', ttfb);
      }
    }
  }

  /**
   * Setup resource observers
   */
  private setupResourceObservers(): void {
    this.createObserver(['resource'], (entries) => {
      const resourceMetrics: Record<string, ResourceMetrics> = {};

      entries.forEach(entry => {
        const resource = entry as PerformanceResourceTiming;
        const type = resource.initiatorType || 'other';

        if (!resourceMetrics[type]) {
          resourceMetrics[type] = {
            type,
            count: 0,
            totalSize: 0,
            averageLoadTime: 0,
            cacheHitRate: 0,
          };
        }

        resourceMetrics[type].count++;
        resourceMetrics[type].totalSize += resource.transferSize || 0;
        resourceMetrics[type].averageLoadTime += resource.responseEnd - resource.startTime;
      });

      // Calculate averages and update session
      Object.values(resourceMetrics).forEach(metric => {
        metric.averageLoadTime = metric.averageLoadTime / metric.count;
        
        if (this.currentSession) {
          const existingIndex = this.currentSession.resourceMetrics.findIndex(m => m.type === metric.type);
          if (existingIndex >= 0) {
            this.currentSession.resourceMetrics[existingIndex] = metric;
          } else {
            this.currentSession.resourceMetrics.push(metric);
          }
        }
      });
    });
  }

  /**
   * Setup custom metric tracking
   */
  private setupCustomMetricTracking(): void {
    // Track hero load time
    this.trackCustomMetric('hero-load', (startTime, endTime) => {
      const loadTime = endTime - startTime;
      if (this.currentSession) {
        this.currentSession.customMetrics.heroLoadTime = loadTime;
        this.checkBudget('heroLoadTime', loadTime);
      }
    });

    // Track domain switch time
    this.trackCustomMetric('domain-switch', (startTime, endTime) => {
      const switchTime = endTime - startTime;
      if (this.currentSession) {
        this.currentSession.customMetrics.domainSwitchTime = switchTime;
        this.checkBudget('domainSwitchTime', switchTime);
      }
    });

    // Track navigation response time
    this.trackCustomMetric('navigation-response', (startTime, endTime) => {
      const responseTime = endTime - startTime;
      if (this.currentSession) {
        this.currentSession.customMetrics.navigationResponseTime = responseTime;
        this.checkBudget('navigationResponseTime', responseTime);
      }
    });
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.addError({
        type: 'long-task',
        message: `JavaScript error: ${event.message}`,
        timestamp: Date.now(),
        severity: 'high',
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.addError({
        type: 'long-task',
        message: `Unhandled promise rejection: ${event.reason}`,
        timestamp: Date.now(),
        severity: 'medium',
        details: {
          reason: event.reason,
        },
      });
    });
  }

  /**
   * Setup budget monitoring
   */
  private setupBudgetMonitoring(): void {
    // Monitor long tasks
    this.createObserver(['longtask'], (entries) => {
      entries.forEach(entry => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          this.addError({
            type: 'long-task',
            message: `Long task detected: ${entry.duration}ms`,
            timestamp: Date.now(),
            severity: entry.duration > 100 ? 'high' : 'medium',
            details: {
              duration: entry.duration,
              startTime: entry.startTime,
            },
          });
        }
      });
    });
  }

  /**
   * Create performance observer
   */
  private createObserver(entryTypes: string[], callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`[PerformanceMonitor] Observer not supported for: ${entryTypes.join(', ')}`);
    }
  }

  /**
   * Track custom metric
   */
  private trackCustomMetric(name: string, callback: (startTime: number, endTime: number) => void): void {
    // Listen for custom performance marks
    window.addEventListener(`performance-${name}-start`, (event: any) => {
      const startTime = performance.now();
      
      const endListener = (endEvent: any) => {
        const endTime = performance.now();
        callback(startTime, endTime);
        window.removeEventListener(`performance-${name}-end`, endListener);
      };
      
      window.addEventListener(`performance-${name}-end`, endListener);
    });
  }

  /**
   * Check performance budget
   */
  private checkBudget(metric: keyof typeof PERFORMANCE_BUDGETS, value: number): void {
    const budget = PERFORMANCE_BUDGETS[metric];
    if (value > budget) {
      this.addError({
        type: 'budget-exceeded',
        message: `Performance budget exceeded for ${metric}: ${value} > ${budget}`,
        timestamp: Date.now(),
        severity: value > budget * 1.5 ? 'high' : 'medium',
        details: {
          metric,
          actual: value,
          budget,
          exceeded: value - budget,
        },
      });
    }
  }

  /**
   * Add performance error
   */
  private addError(error: PerformanceError): void {
    if (this.currentSession) {
      this.currentSession.errors.push(error);
      console.warn('[PerformanceMonitor] Performance issue detected:', error);
    }
  }

  /**
   * Get all performance sessions
   */
  public getSessions(): PerformanceSession[] {
    return [...this.sessions];
  }

  /**
   * Get current session
   */
  public getCurrentSession(): PerformanceSession | null {
    return this.currentSession;
  }

  /**
   * Get performance summary
   */
  public getPerformanceSummary(): {
    averageMetrics: Partial<CoreWebVitals & CustomMetrics>;
    budgetCompliance: Record<string, { passed: number; total: number; percentage: number }>;
    errorSummary: Record<string, number>;
    deviceBreakdown: Record<string, number>;
  } {
    const allSessions = [...this.sessions];
    if (this.currentSession) allSessions.push(this.currentSession);

    // Calculate average metrics
    const averageMetrics: any = {};
    const metricCounts: any = {};

    allSessions.forEach(session => {
      Object.entries({ ...session.coreWebVitals, ...session.customMetrics }).forEach(([key, value]) => {
        if (typeof value === 'number') {
          averageMetrics[key] = (averageMetrics[key] || 0) + value;
          metricCounts[key] = (metricCounts[key] || 0) + 1;
        }
      });
    });

    Object.keys(averageMetrics).forEach(key => {
      averageMetrics[key] = averageMetrics[key] / metricCounts[key];
    });

    // Calculate budget compliance
    const budgetCompliance: any = {};
    Object.keys(PERFORMANCE_BUDGETS).forEach(metric => {
      const passed = allSessions.filter(session => {
        const value = (session.coreWebVitals as any)[metric] || (session.customMetrics as any)[metric];
        return value && value <= (PERFORMANCE_BUDGETS as any)[metric];
      }).length;
      
      budgetCompliance[metric] = {
        passed,
        total: allSessions.length,
        percentage: allSessions.length > 0 ? (passed / allSessions.length) * 100 : 0,
      };
    });

    // Error summary
    const errorSummary: Record<string, number> = {};
    allSessions.forEach(session => {
      session.errors.forEach(error => {
        errorSummary[error.type] = (errorSummary[error.type] || 0) + 1;
      });
    });

    // Device breakdown
    const deviceBreakdown: Record<string, number> = {};
    allSessions.forEach(session => {
      deviceBreakdown[session.deviceType] = (deviceBreakdown[session.deviceType] || 0) + 1;
    });

    return {
      averageMetrics,
      budgetCompliance,
      errorSummary,
      deviceBreakdown,
    };
  }

  /**
   * Export performance data
   */
  public exportData(): string {
    const data = {
      sessions: this.sessions,
      currentSession: this.currentSession,
      summary: this.getPerformanceSummary(),
      exportedAt: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear all performance data
   */
  public clearData(): void {
    this.sessions = [];
    this.currentSession = null;
    localStorage.removeItem('portfolio-performance-sessions');
    console.log('[PerformanceMonitor] Performance data cleared');
  }

  // Helper methods
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getCurrentDomain(): string {
    const path = window.location.pathname;
    if (path.includes('/full-stack')) return 'full-stack';
    if (path.includes('/cloud-engineering')) return 'cloud-engineering';
    if (path.includes('/data-analytics')) return 'data-analytics';
    if (path.includes('/ux-ui-design')) return 'ux-ui-design';
    if (path.includes('/technical-consulting')) return 'technical-consulting';
    return 'general';
  }

  private saveSessionToStorage(): void {
    try {
      const existingSessions = JSON.parse(localStorage.getItem('portfolio-performance-sessions') || '[]');
      const updatedSessions = [...existingSessions, this.currentSession].slice(-50); // Keep last 50 sessions
      localStorage.setItem('portfolio-performance-sessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to save session to storage:', error);
    }
  }
}

/**
 * Performance utility functions
 */
export const performanceUtils = {
  /**
   * Mark start of custom metric
   */
  markStart: (name: string) => {
    performance.mark(`${name}-start`);
    window.dispatchEvent(new CustomEvent(`performance-${name}-start`));
  },

  /**
   * Mark end of custom metric
   */
  markEnd: (name: string) => {
    performance.mark(`${name}-end`);
    window.dispatchEvent(new CustomEvent(`performance-${name}-end`));
  },

  /**
   * Measure custom metric
   */
  measure: (name: string, startMark?: string, endMark?: string) => {
    try {
      const measurement = performance.measure(name, startMark, endMark);
      return measurement.duration;
    } catch (error) {
      console.warn(`[PerformanceUtils] Failed to measure ${name}:`, error);
      return 0;
    }
  },

  /**
   * Get current performance score
   */
  getPerformanceScore: (): number => {
    const monitor = PerformanceMonitor.getInstance();
    const summary = monitor.getPerformanceSummary();
    
    // Calculate weighted score based on budget compliance
    const weights = {
      lcp: 0.25,
      fid: 0.25,
      cls: 0.25,
      fcp: 0.15,
      ttfb: 0.1,
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(weights).forEach(([metric, weight]) => {
      const compliance = summary.budgetCompliance[metric];
      if (compliance) {
        totalScore += compliance.percentage * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  },
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();
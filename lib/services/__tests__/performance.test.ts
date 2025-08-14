/**
 * Performance Monitoring Service Tests
 * 
 * Comprehensive test suite for the performance monitoring service including
 * Core Web Vitals tracking, custom metrics, and admin dashboard functionality.
 * 
 * @fileoverview Performance monitoring service test suite
 */

import { 
  PerformanceMonitor, 
  performanceUtils, 
  PERFORMANCE_BUDGETS,
  type PerformanceSession,
  type CoreWebVitals,
  type CustomMetrics 
} from '../performance';

// Mock performance APIs
const mockPerformanceObserver = jest.fn();
const mockPerformance = {
  now: jest.fn(() => 1000),
  mark: jest.fn(),
  measure: jest.fn(() => ({ duration: 100 })),
  getEntriesByType: jest.fn(() => []),
};

// Mock window and navigator
Object.defineProperty(global, 'window', {
  value: {
    performance: mockPerformance,
    navigator: {
      userAgent: 'test-agent',
      connection: { effectiveType: '4g' },
    },
    location: {
      href: 'https://test.com',
      pathname: '/test',
    },
    innerWidth: 1024,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    document: {
      readyState: 'complete',
      visibilityState: 'visible',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    localStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    },
  },
  writable: true,
});

Object.defineProperty(global, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true,
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset singleton instance
    (PerformanceMonitor as any).instance = undefined;
    monitor = PerformanceMonitor.getInstance();
    
    // Mock PerformanceObserver
    mockPerformanceObserver.mockImplementation((callback) => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = PerformanceMonitor.getInstance();
      const instance2 = PerformanceMonitor.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Session Management', () => {
    it('should initialize a new session', () => {
      const currentSession = monitor.getCurrentSession();
      
      expect(currentSession).toBeTruthy();
      expect(currentSession?.id).toMatch(/^session-\d+-[a-z0-9]+$/);
      expect(currentSession?.timestamp).toBeGreaterThan(0);
      expect(currentSession?.url).toBe('https://test.com');
      expect(currentSession?.deviceType).toBe('desktop');
    });

    it('should detect device type correctly', () => {
      // Test mobile
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      const mobileMonitor = PerformanceMonitor.getInstance();
      expect(mobileMonitor.getCurrentSession()?.deviceType).toBe('mobile');

      // Test tablet
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
      const tabletMonitor = PerformanceMonitor.getInstance();
      expect(tabletMonitor.getCurrentSession()?.deviceType).toBe('tablet');

      // Test desktop
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      const desktopMonitor = PerformanceMonitor.getInstance();
      expect(desktopMonitor.getCurrentSession()?.deviceType).toBe('desktop');
    });

    it('should detect current domain from URL', () => {
      Object.defineProperty(window.location, 'pathname', { 
        value: '/full-stack/projects', 
        writable: true 
      });
      
      const session = monitor.getCurrentSession();
      expect(session?.domain).toBe('full-stack');
    });
  });

  describe('Performance Monitoring', () => {
    it('should start monitoring', () => {
      monitor.startMonitoring();
      
      // Should create performance observers
      expect(mockPerformanceObserver).toHaveBeenCalled();
    });

    it('should stop monitoring', () => {
      monitor.startMonitoring();
      const sessions = monitor.getSessions();
      const initialCount = sessions.length;
      
      monitor.stopMonitoring();
      
      // Should save current session
      const updatedSessions = monitor.getSessions();
      expect(updatedSessions.length).toBeGreaterThan(initialCount);
    });

    it('should handle observer creation errors gracefully', () => {
      mockPerformanceObserver.mockImplementation(() => {
        throw new Error('Observer not supported');
      });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(() => monitor.startMonitoring()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Budget Monitoring', () => {
    it('should check performance budgets', () => {
      const session = monitor.getCurrentSession();
      if (session) {
        // Simulate budget violation
        session.coreWebVitals.lcp = 3000; // Exceeds 2500ms budget
        
        const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
        
        // Trigger budget check (this would normally be called internally)
        (monitor as any).checkBudget('lcp', 3000);
        
        expect(session.errors.length).toBeGreaterThan(0);
        expect(session.errors[0].type).toBe('budget-exceeded');
        
        consoleSpy.mockRestore();
      }
    });

    it('should categorize budget violations by severity', () => {
      const session = monitor.getCurrentSession();
      if (session) {
        // Medium severity (1.5x budget)
        (monitor as any).checkBudget('lcp', PERFORMANCE_BUDGETS.lcp * 1.3);
        expect(session.errors[session.errors.length - 1].severity).toBe('medium');
        
        // High severity (>1.5x budget)
        (monitor as any).checkBudget('fid', PERFORMANCE_BUDGETS.fid * 2);
        expect(session.errors[session.errors.length - 1].severity).toBe('high');
      }
    });
  });

  describe('Performance Summary', () => {
    it('should calculate performance summary', () => {
      // Add mock sessions with data
      const mockSession: PerformanceSession = {
        id: 'test-session',
        timestamp: Date.now(),
        url: 'https://test.com',
        userAgent: 'test',
        connectionType: '4g',
        deviceType: 'desktop',
        domain: 'full-stack',
        coreWebVitals: {
          lcp: 2000,
          fid: 50,
          cls: 0.05,
          fcp: 1500,
          inp: 150,
          ttfb: 500,
        },
        customMetrics: {
          heroLoadTime: 800,
          domainSwitchTime: 200,
          navigationResponseTime: 100,
          projectGalleryLoadTime: 1200,
          threeDComponentLoadTime: 1800,
          imageLoadTime: 600,
          fontLoadTime: 400,
          jsExecutionTime: 300,
          cssParseTime: 150,
        },
        resourceMetrics: [],
        errors: [],
      };
      
      (monitor as any).sessions = [mockSession];
      
      const summary = monitor.getPerformanceSummary();
      
      expect(summary.averageMetrics.lcp).toBe(2000);
      expect(summary.averageMetrics.fid).toBe(50);
      expect(summary.averageMetrics.heroLoadTime).toBe(800);
      expect(summary.budgetCompliance.lcp.passed).toBe(1);
      expect(summary.budgetCompliance.lcp.percentage).toBe(100);
      expect(summary.deviceBreakdown.desktop).toBe(1);
    });

    it('should handle empty sessions gracefully', () => {
      const summary = monitor.getPerformanceSummary();
      
      expect(summary.averageMetrics).toEqual({});
      expect(summary.errorSummary).toEqual({});
      expect(summary.deviceBreakdown).toEqual({});
    });
  });

  describe('Data Export and Management', () => {
    it('should export performance data', () => {
      const exportedData = monitor.exportData();
      const parsedData = JSON.parse(exportedData);
      
      expect(parsedData).toHaveProperty('sessions');
      expect(parsedData).toHaveProperty('currentSession');
      expect(parsedData).toHaveProperty('summary');
      expect(parsedData).toHaveProperty('exportedAt');
    });

    it('should clear all data', () => {
      // Add some mock data
      (monitor as any).sessions = [{ id: 'test' }];
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      monitor.clearData();
      
      expect(monitor.getSessions()).toEqual([]);
      expect(monitor.getCurrentSession()).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('[PerformanceMonitor] Performance data cleared');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Error Tracking', () => {
    it('should track JavaScript errors', () => {
      monitor.startMonitoring();
      
      // Simulate JavaScript error
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
      });
      
      window.dispatchEvent(errorEvent);
      
      const session = monitor.getCurrentSession();
      expect(session?.errors.length).toBeGreaterThan(0);
      expect(session?.errors[0].type).toBe('long-task');
      expect(session?.errors[0].severity).toBe('high');
    });

    it('should track unhandled promise rejections', () => {
      monitor.startMonitoring();
      
      // Simulate unhandled promise rejection
      const rejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
        promise: Promise.reject('Test rejection'),
        reason: 'Test rejection',
      });
      
      window.dispatchEvent(rejectionEvent);
      
      const session = monitor.getCurrentSession();
      expect(session?.errors.length).toBeGreaterThan(0);
      expect(session?.errors[0].type).toBe('long-task');
      expect(session?.errors[0].severity).toBe('medium');
    });
  });
});

describe('performanceUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Custom Metrics', () => {
    it('should mark start of custom metric', () => {
      performanceUtils.markStart('test-metric');
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-metric-start');
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'performance-test-metric-start'
        })
      );
    });

    it('should mark end of custom metric', () => {
      performanceUtils.markEnd('test-metric');
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-metric-end');
      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'performance-test-metric-end'
        })
      );
    });

    it('should measure custom metric', () => {
      const duration = performanceUtils.measure('test-metric', 'start', 'end');
      
      expect(mockPerformance.measure).toHaveBeenCalledWith('test-metric', 'start', 'end');
      expect(duration).toBe(100);
    });

    it('should handle measurement errors gracefully', () => {
      mockPerformance.measure.mockImplementation(() => {
        throw new Error('Measurement failed');
      });
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const duration = performanceUtils.measure('test-metric');
      
      expect(duration).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance Score', () => {
    it('should calculate performance score', () => {
      // Mock monitor with good performance data
      const mockSummary = {
        budgetCompliance: {
          lcp: { percentage: 90 },
          fid: { percentage: 95 },
          cls: { percentage: 85 },
          fcp: { percentage: 88 },
          ttfb: { percentage: 92 },
        }
      };
      
      jest.spyOn(PerformanceMonitor.prototype, 'getPerformanceSummary')
        .mockReturnValue(mockSummary as any);
      
      const score = performanceUtils.getPerformanceScore();
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should return 0 for empty data', () => {
      jest.spyOn(PerformanceMonitor.prototype, 'getPerformanceSummary')
        .mockReturnValue({
          budgetCompliance: {},
          averageMetrics: {},
          errorSummary: {},
          deviceBreakdown: {},
        });
      
      const score = performanceUtils.getPerformanceScore();
      
      expect(score).toBe(0);
    });
  });
});

describe('PERFORMANCE_BUDGETS', () => {
  it('should have all required budget values', () => {
    expect(PERFORMANCE_BUDGETS).toHaveProperty('fcp');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('lcp');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('fid');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('cls');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('inp');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('ttfb');
    
    // Custom metrics
    expect(PERFORMANCE_BUDGETS).toHaveProperty('heroLoadTime');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('domainSwitchTime');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('navigationResponseTime');
    
    // Resource budgets
    expect(PERFORMANCE_BUDGETS).toHaveProperty('totalSize');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('imageSize');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('jsSize');
    expect(PERFORMANCE_BUDGETS).toHaveProperty('cssSize');
  });

  it('should have reasonable budget values', () => {
    expect(PERFORMANCE_BUDGETS.lcp).toBeLessThanOrEqual(2500);
    expect(PERFORMANCE_BUDGETS.fid).toBeLessThanOrEqual(100);
    expect(PERFORMANCE_BUDGETS.cls).toBeLessThanOrEqual(0.1);
    expect(PERFORMANCE_BUDGETS.heroLoadTime).toBeLessThanOrEqual(1000);
    expect(PERFORMANCE_BUDGETS.domainSwitchTime).toBeLessThanOrEqual(300);
  });
});
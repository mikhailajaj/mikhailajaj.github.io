/**
 * Error Tracking Tests
 * 
 * Comprehensive tests for the error tracking system.
 * 
 * @fileoverview Error tracking test suite
 */

import { errorTracking } from '@/lib/monitoring/ErrorTracking';
import { errorReporting } from '@/lib/services/errorReporting';

// Mock window object for testing
const mockWindow = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  location: {
    href: 'https://example.com/full-stack',
    pathname: '/full-stack',
  },
};

// Mock global window
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Test Browser)',
  },
  writable: true,
});

describe('ErrorTracking', () => {
  beforeEach(() => {
    // Clear any existing data
    errorTracking.clearData();
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize successfully', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      errorTracking.initialize();
      
      expect(consoleSpy).toHaveBeenCalledWith('[ErrorTracking] Service initialized');
      consoleSpy.mockRestore();
    });

    it('should not initialize twice', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      errorTracking.initialize();
      errorTracking.initialize(); // Second call should be ignored
      
      expect(consoleSpy).toHaveBeenCalledTimes(1);
      consoleSpy.mockRestore();
    });

    it('should setup event listeners', () => {
      errorTracking.initialize();
      
      expect(mockWindow.addEventListener).toHaveBeenCalledWith(
        'error-reported',
        expect.any(Function)
      );
    });
  });

  describe('Analytics', () => {
    beforeEach(() => {
      errorTracking.initialize();
    });

    it('should return null analytics initially', () => {
      const analytics = errorTracking.getAnalytics();
      expect(analytics).toBeNull();
    });

    it('should generate analytics after tracking errors', () => {
      // Mock error report
      const mockReport = {
        id: 'test-error-1',
        type: 'javascript-error' as const,
        severity: 'medium' as const,
        message: 'Test error message',
        stack: 'Error stack trace',
        context: {
          url: 'https://example.com/test',
          userAgent: 'Test Browser',
          timestamp: new Date().toISOString(),
          domain: 'full-stack',
        },
        fingerprint: 'test-fingerprint',
        count: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        resolved: false,
      };

      // Track the error
      errorTracking.trackError(mockReport);

      // Get analytics (this should trigger analytics generation)
      const analytics = errorTracking.getAnalytics();
      
      expect(analytics).toBeDefined();
      if (analytics) {
        expect(analytics.totalErrors).toBeGreaterThan(0);
        expect(analytics.errorsByDomain).toHaveProperty('full-stack');
        expect(analytics.errorsByType).toHaveProperty('javascript-error');
        expect(analytics.errorsBySeverity).toHaveProperty('medium');
      }
    });
  });

  describe('Trends', () => {
    beforeEach(() => {
      errorTracking.initialize();
    });

    it('should track error trends', () => {
      const mockReport = {
        id: 'test-error-1',
        type: 'javascript-error' as const,
        severity: 'medium' as const,
        message: 'Test error message',
        context: {
          url: 'https://example.com/test',
          userAgent: 'Test Browser',
          timestamp: new Date().toISOString(),
          domain: 'full-stack',
        },
        fingerprint: 'test-fingerprint',
        count: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        resolved: false,
      };

      errorTracking.trackError(mockReport);

      const trends = errorTracking.getTrends();
      expect(trends).toHaveLength(1);
      expect(trends[0]).toMatchObject({
        count: 1,
        severity: 'medium',
        type: 'javascript-error',
        domain: 'full-stack',
      });
    });

    it('should filter trends by time range', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      // Create mock reports with different timestamps
      const oldReport = {
        id: 'old-error',
        type: 'javascript-error' as const,
        severity: 'low' as const,
        message: 'Old error',
        context: {
          url: 'https://example.com/test',
          userAgent: 'Test Browser',
          timestamp: twoHoursAgo.toISOString(),
          domain: 'general',
        },
        fingerprint: 'old-fingerprint',
        count: 1,
        firstSeen: twoHoursAgo.toISOString(),
        lastSeen: twoHoursAgo.toISOString(),
        resolved: false,
      };

      const recentReport = {
        id: 'recent-error',
        type: 'network-error' as const,
        severity: 'high' as const,
        message: 'Recent error',
        context: {
          url: 'https://example.com/test',
          userAgent: 'Test Browser',
          timestamp: now.toISOString(),
          domain: 'cloud-engineering',
        },
        fingerprint: 'recent-fingerprint',
        count: 1,
        firstSeen: now.toISOString(),
        lastSeen: now.toISOString(),
        resolved: false,
      };

      errorTracking.trackError(oldReport);
      errorTracking.trackError(recentReport);

      // Get trends for last hour only
      const recentTrends = errorTracking.getTrends({
        start: oneHourAgo,
        end: now,
      });

      expect(recentTrends).toHaveLength(1);
      expect(recentTrends[0].type).toBe('network-error');
    });
  });

  describe('Insights', () => {
    beforeEach(() => {
      errorTracking.initialize();
    });

    it('should start with no insights', () => {
      const insights = errorTracking.getInsights();
      expect(insights).toHaveLength(0);
    });

    it('should generate critical error insight', () => {
      const criticalReport = {
        id: 'critical-error',
        type: 'system-error' as const,
        severity: 'critical' as const,
        message: 'Critical system error',
        context: {
          url: 'https://example.com/test',
          userAgent: 'Test Browser',
          timestamp: new Date().toISOString(),
          domain: 'general',
        },
        fingerprint: 'critical-fingerprint',
        count: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        resolved: false,
      };

      errorTracking.trackError(criticalReport);

      // Wait for insight generation (async)
      setTimeout(() => {
        const insights = errorTracking.getInsights();
        expect(insights.length).toBeGreaterThan(0);
        
        const criticalInsight = insights.find(
          insight => insight.title === 'Critical Error Detected'
        );
        expect(criticalInsight).toBeDefined();
        expect(criticalInsight?.severity).toBe('critical');
      }, 100);
    });
  });

  describe('Error Resolution', () => {
    beforeEach(() => {
      errorTracking.initialize();
      
      // Mock errorReporting.getReports()
      jest.spyOn(errorReporting, 'getReports').mockReturnValue([
        {
          id: 'test-error-1',
          type: 'javascript-error',
          severity: 'medium',
          message: 'Test error message',
          context: {
            url: 'https://example.com/test',
            userAgent: 'Test Browser',
            timestamp: new Date().toISOString(),
            domain: 'full-stack',
          },
          fingerprint: 'test-fingerprint',
          count: 1,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          resolved: false,
        },
      ]);
    });

    it('should mark error as resolved', () => {
      errorTracking.resolveError('test-fingerprint');

      const insights = errorTracking.getInsights();
      const resolutionInsight = insights.find(
        insight => insight.title === 'Error Resolved'
      );
      
      expect(resolutionInsight).toBeDefined();
      expect(resolutionInsight?.type).toBe('improvement');
    });
  });

  describe('Error Impact Analysis', () => {
    beforeEach(() => {
      errorTracking.initialize();
      
      // Mock errorReporting.getReports()
      jest.spyOn(errorReporting, 'getReports').mockReturnValue([
        {
          id: 'test-error-1',
          type: 'performance-error',
          severity: 'high',
          message: 'Performance degradation',
          context: {
            url: 'https://example.com/test',
            userAgent: 'Test Browser',
            timestamp: new Date().toISOString(),
            domain: 'full-stack',
          },
          fingerprint: 'perf-fingerprint',
          count: 50,
          firstSeen: new Date().toISOString(),
          lastSeen: new Date().toISOString(),
          resolved: false,
        },
      ]);
    });

    it('should calculate error impact', () => {
      const impact = errorTracking.getErrorImpact('perf-fingerprint');
      
      expect(impact).toBeDefined();
      expect(impact.userImpact).toBeGreaterThan(0);
      expect(impact.performanceImpact).toBeGreaterThan(0);
      expect(impact.businessImpact).toBe('high');
      expect(impact.affectedDomains).toContain('full-stack');
    });

    it('should return zero impact for non-existent error', () => {
      const impact = errorTracking.getErrorImpact('non-existent-fingerprint');
      
      expect(impact.userImpact).toBe(0);
      expect(impact.performanceImpact).toBe(0);
      expect(impact.businessImpact).toBe('low');
      expect(impact.affectedDomains).toHaveLength(0);
    });
  });

  describe('Data Management', () => {
    beforeEach(() => {
      errorTracking.initialize();
    });

    it('should export data', () => {
      const exportedData = errorTracking.exportData();
      const data = JSON.parse(exportedData);
      
      expect(data).toHaveProperty('analytics');
      expect(data).toHaveProperty('trends');
      expect(data).toHaveProperty('insights');
      expect(data).toHaveProperty('config');
      expect(data).toHaveProperty('timestamp');
    });

    it('should clear data', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Add some data first
      const mockReport = {
        id: 'test-error-1',
        type: 'javascript-error' as const,
        severity: 'medium' as const,
        message: 'Test error message',
        context: {
          url: 'https://example.com/test',
          userAgent: 'Test Browser',
          timestamp: new Date().toISOString(),
          domain: 'full-stack',
        },
        fingerprint: 'test-fingerprint',
        count: 1,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        resolved: false,
      };

      errorTracking.trackError(mockReport);
      
      // Clear data
      errorTracking.clearData();
      
      // Verify data is cleared
      const trends = errorTracking.getTrends();
      const insights = errorTracking.getInsights();
      const analytics = errorTracking.getAnalytics();
      
      expect(trends).toHaveLength(0);
      expect(insights).toHaveLength(0);
      expect(analytics).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('[ErrorTracking] Data cleared');
      
      consoleSpy.mockRestore();
    });
  });
});

describe('Error Tracking Integration', () => {
  beforeEach(() => {
    errorTracking.clearData();
    jest.clearAllMocks();
  });

  it('should integrate with error reporting service', () => {
    errorTracking.initialize();
    
    // Simulate error report event
    const mockReport = {
      id: 'integration-test',
      type: 'javascript-error' as const,
      severity: 'medium' as const,
      message: 'Integration test error',
      context: {
        url: 'https://example.com/test',
        userAgent: 'Test Browser',
        timestamp: new Date().toISOString(),
        domain: 'full-stack',
      },
      fingerprint: 'integration-fingerprint',
      count: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      resolved: false,
    };

    // Simulate the event that would be dispatched by error reporting
    const event = new CustomEvent('error-reported', { detail: mockReport });
    
    // Get the event listener that was registered
    const addEventListenerCalls = mockWindow.addEventListener.mock.calls;
    const errorReportedListener = addEventListenerCalls.find(
      call => call[0] === 'error-reported'
    );
    
    expect(errorReportedListener).toBeDefined();
    
    // Call the listener directly
    if (errorReportedListener) {
      errorReportedListener[1](event);
      
      // Verify the error was tracked
      const trends = errorTracking.getTrends();
      expect(trends).toHaveLength(1);
      expect(trends[0].type).toBe('javascript-error');
    }
  });
});
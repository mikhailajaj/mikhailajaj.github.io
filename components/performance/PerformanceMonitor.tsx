/**
 * Performance Monitor Component
 * 
 * Enhanced performance monitoring component that integrates with the comprehensive
 * performance monitoring service and provides real-time tracking.
 * 
 * @fileoverview Enhanced performance monitor with admin dashboard integration
 */

"use client";

// 1. React Imports
import { useEffect } from 'react';

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { performanceMonitor, performanceUtils } from '@/lib/services/performance';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (None in this component)

// 6. Stylesheets
// (None in this component)

/**
 * Performance Monitor Hook
 * 
 * Initializes and manages performance monitoring throughout the application.
 * Integrates with the comprehensive performance monitoring service.
 */
export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Start comprehensive performance monitoring
    performanceMonitor.startMonitoring();

    // Track custom portfolio metrics
    const trackCustomMetrics = () => {
      // Track hero section load time
      const heroElement = document.querySelector('[data-testid="hero-loaded"]');
      if (heroElement) {
        performanceUtils.markStart('hero-load');
        
        const observer = new MutationObserver(() => {
          if (heroElement.getAttribute('data-loaded') === 'true') {
            performanceUtils.markEnd('hero-load');
            observer.disconnect();
          }
        });
        
        observer.observe(heroElement, { attributes: true });
      }

      // Track project gallery load time
      const projectGallery = document.querySelector('[data-testid="project-gallery"]');
      if (projectGallery) {
        performanceUtils.markStart('project-gallery-load');
        
        const images = projectGallery.querySelectorAll('img');
        let loadedImages = 0;
        
        const checkAllLoaded = () => {
          loadedImages++;
          if (loadedImages === images.length) {
            performanceUtils.markEnd('project-gallery-load');
          }
        };
        
        images.forEach(img => {
          if (img.complete) {
            checkAllLoaded();
          } else {
            img.addEventListener('load', checkAllLoaded);
            img.addEventListener('error', checkAllLoaded);
          }
        });
      }

      // Track 3D component load time
      const threeDComponent = document.querySelector('[data-testid="3d-component"]');
      if (threeDComponent) {
        performanceUtils.markStart('3d-component-load');
        
        // Listen for 3D component ready event
        window.addEventListener('3d-component-ready', () => {
          performanceUtils.markEnd('3d-component-load');
        });
      }
    };

    // Track domain switching performance
    const trackDomainSwitching = () => {
      let domainSwitchStart: number;
      
      // Listen for domain switch events
      window.addEventListener('domain-switch-start', () => {
        domainSwitchStart = performance.now();
        performanceUtils.markStart('domain-switch');
      });
      
      window.addEventListener('domain-switch-complete', () => {
        performanceUtils.markEnd('domain-switch');
      });
    };

    // Track navigation performance
    const trackNavigationPerformance = () => {
      // Track navigation timing
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function(...args) {
        performanceUtils.markStart('navigation-response');
        originalPushState.apply(history, args);
        
        // Mark end after next tick to capture navigation completion
        setTimeout(() => {
          performanceUtils.markEnd('navigation-response');
        }, 0);
      };
      
      history.replaceState = function(...args) {
        performanceUtils.markStart('navigation-response');
        originalReplaceState.apply(history, args);
        
        setTimeout(() => {
          performanceUtils.markEnd('navigation-response');
        }, 0);
      };
    };

    // Initialize custom tracking
    const initializeCustomTracking = () => {
      if (document.readyState === 'complete') {
        trackCustomMetrics();
        trackDomainSwitching();
        trackNavigationPerformance();
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => {
            trackCustomMetrics();
            trackDomainSwitching();
            trackNavigationPerformance();
          }, 100);
        });
      }
    };

    initializeCustomTracking();

    // Enhanced analytics integration
    const sendToAnalytics = (metric: string, value: number, category = 'Performance') => {
      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'performance_metric', {
          event_category: category,
          event_label: metric,
          value: Math.round(value),
        });
      }

      // Custom analytics endpoint (if available)
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'performance',
            metric,
            value,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        }).catch(error => {
          console.warn('[Performance] Failed to send analytics:', error);
        });
      }
    };

    // Listen for performance events from the monitoring service
    window.addEventListener('performance-metric-recorded', ((event: CustomEvent) => {
      const { metric, value } = event.detail;
      sendToAnalytics(metric, value);
    }) as EventListener);

    // Cleanup function
    return () => {
      performanceMonitor.stopMonitoring();
    };
  }, []);
}

/**
 * Performance Monitor Component
 * 
 * Invisible component that initializes performance monitoring.
 * Should be included once in the root layout.
 */
export const PerformanceMonitor: React.FC = () => {
  usePerformanceMonitor();
  return null; // This component doesn't render anything
};

/**
 * Performance Budget Checker
 * 
 * Enhanced budget checker that integrates with the monitoring service.
 */
export function checkPerformanceBudget() {
  if (typeof window === 'undefined') return;

  const summary = performanceMonitor.getPerformanceSummary();
  const currentSession = performanceMonitor.getCurrentSession();
  
  if (!currentSession) return;

  // Check Core Web Vitals against budgets
  const budgetResults = {
    lcp: {
      actual: currentSession.coreWebVitals.lcp || 0,
      budget: 2500,
      passed: (currentSession.coreWebVitals.lcp || 0) <= 2500,
    },
    fid: {
      actual: currentSession.coreWebVitals.fid || 0,
      budget: 100,
      passed: (currentSession.coreWebVitals.fid || 0) <= 100,
    },
    cls: {
      actual: currentSession.coreWebVitals.cls || 0,
      budget: 0.1,
      passed: (currentSession.coreWebVitals.cls || 0) <= 0.1,
    },
  };

  console.log('[Performance] Budget Check Results:', budgetResults);

  // Alert for budget violations
  Object.entries(budgetResults).forEach(([metric, result]) => {
    if (!result.passed) {
      console.warn(`[Performance] Budget exceeded for ${metric.toUpperCase()}:`, {
        actual: result.actual,
        budget: result.budget,
        exceeded: result.actual - result.budget,
      });
    }
  });

  return budgetResults;
}

/**
 * Performance Score Component
 * 
 * Displays current performance score (for development/admin use).
 */
export const PerformanceScore: React.FC<{ 
  className?: string;
  showDetails?: boolean;
}> = ({ className, showDetails = false }) => {
  const [score, setScore] = React.useState(0);
  const [details, setDetails] = React.useState<any>(null);

  React.useEffect(() => {
    const updateScore = () => {
      const currentScore = performanceUtils.getPerformanceScore();
      const summary = performanceMonitor.getPerformanceSummary();
      
      setScore(currentScore);
      if (showDetails) {
        setDetails(summary);
      }
    };

    updateScore();
    
    // Update score every 10 seconds
    const interval = setInterval(updateScore, 10000);
    return () => clearInterval(interval);
  }, [showDetails]);

  if (!showDetails) {
    return (
      <div className={`text-sm font-medium ${className}`}>
        Performance: {score}/100
      </div>
    );
  }

  return (
    <div className={`p-4 bg-muted/30 dark:bg-card rounded-lg ${className}`}>
      <div className="text-lg font-semibold mb-2">
        Performance Score: {score}/100
      </div>
      {details && (
        <div className="space-y-2 text-sm">
          <div>LCP: {Math.round(details.averageMetrics.lcp || 0)}ms</div>
          <div>FID: {Math.round(details.averageMetrics.fid || 0)}ms</div>
          <div>CLS: {(details.averageMetrics.cls || 0).toFixed(3)}</div>
          <div>Errors: {Object.values(details.errorSummary).reduce((a: any, b: any) => a + b, 0)}</div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
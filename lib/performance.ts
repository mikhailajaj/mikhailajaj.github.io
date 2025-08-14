// Define Metric type locally to avoid import issues
export interface Metric {
  name: string;
  value: number;
  id: string;
}

/**
 * Track Web Vitals metrics and send them to Google Analytics
 *
 * @param metric Web Vitals metric object
 */
export function trackWebVitals(metric: Metric) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value,
      ),
      non_interaction: true,
    });
  }
}

/**
 * Log Web Vitals metrics to console in development
 *
 * @param metric Web Vitals metric object
 */
export function logWebVitals(metric: Metric) {
  if (process.env.NODE_ENV === "development") {
    console.log(`Web Vitals: ${metric.name} = ${metric.value}`);
  }
}

/**
 * Format Web Vitals metrics for display
 *
 * @param metric Web Vitals metric object
 * @returns Formatted metric value with appropriate units
 */
export function formatWebVitalsMetric(metric: Metric): string {
  switch (metric.name) {
    case "CLS":
      return metric.value.toFixed(3);
    case "FID":
    case "TTFB":
    case "LCP":
      return `${Math.round(metric.value)}ms`;
    case "FCP":
      return `${Math.round(metric.value)}ms`;
    default:
      return `${metric.value}`;
  }
}

/**
 * Get rating for Web Vitals metrics (good, needs improvement, poor)
 * Based on https://web.dev/vitals/
 *
 * @param metric Web Vitals metric object
 * @returns Rating as 'good', 'needs-improvement', or 'poor'
 */
export function getWebVitalsRating(
  metric: Metric,
): "good" | "needs-improvement" | "poor" {
  switch (metric.name) {
    case "CLS":
      return metric.value <= 0.1
        ? "good"
        : metric.value <= 0.25
          ? "needs-improvement"
          : "poor";
    case "FID":
      return metric.value <= 100
        ? "good"
        : metric.value <= 300
          ? "needs-improvement"
          : "poor";
    case "LCP":
      return metric.value <= 2500
        ? "good"
        : metric.value <= 4000
          ? "needs-improvement"
          : "poor";
    case "FCP":
      return metric.value <= 1800
        ? "good"
        : metric.value <= 3000
          ? "needs-improvement"
          : "poor";
    case "TTFB":
      return metric.value <= 800
        ? "good"
        : metric.value <= 1800
          ? "needs-improvement"
          : "poor";
    default:
      return "needs-improvement";
  }
}

// Add type definition for window.gtag
declare global {
  interface Window {
    gtag: (command: string, action: string, params: object) => void;
  }
}

// Phase 3 Enhanced Performance Features

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export interface PageLoadMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint?: number;
}

// Web Vitals thresholds
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  constructor(private onMetric?: (name: string, value: number) => void) {
    if (typeof window !== "undefined") {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // LCP Observer
    if ("PerformanceObserver" in window) {
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime;
            this.onMetric?.("LCP", lastEntry.startTime);
          }
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn("LCP observer not supported");
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              this.metrics.fid = fid;
              this.onMetric?.("FID", fid);
            }
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn("FID observer not supported");
      }

      // CLS Observer
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
              this.onMetric?.("CLS", clsValue);
            }
          });
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn("CLS observer not supported");
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getPageLoadMetrics(): PageLoadMetrics | null {
    if (
      typeof window === "undefined" ||
      !window.performance ||
      !window.performance.timing
    ) {
      return null;
    }

    const timing = window.performance.timing;
    const navigation = timing.navigationStart;

    return {
      loadTime: timing.loadEventEnd - navigation,
      domContentLoaded: timing.domContentLoadedEventEnd - navigation,
      firstPaint: this.getFirstPaint() || 0,
      firstContentfulPaint: this.getFirstContentfulPaint() || 0,
      largestContentfulPaint: this.metrics.lcp,
    };
  }

  private getFirstPaint(): number | null {
    if (typeof window === "undefined") return null;
    const paintEntries = performance.getEntriesByType("paint");
    const firstPaint = paintEntries.find(
      (entry) => entry.name === "first-paint",
    );
    return firstPaint ? firstPaint.startTime : null;
  }

  private getFirstContentfulPaint(): number | null {
    if (typeof window === "undefined") return null;
    const paintEntries = performance.getEntriesByType("paint");
    const fcp = paintEntries.find(
      (entry) => entry.name === "first-contentful-paint",
    );
    return fcp ? fcp.startTime : null;
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Lazy loading utility
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver | null => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  });
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (typeof window === "undefined") return null;

  const resources = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const scripts = resources.filter(
    (resource) =>
      resource.name.includes(".js") || resource.name.includes(".ts"),
  );

  const totalSize = scripts.reduce((total, script) => {
    return total + (script.transferSize || 0);
  }, 0);

  return {
    totalScripts: scripts.length,
    totalSize: Math.round(totalSize / 1024), // KB
    largestScript: scripts.reduce((largest, current) =>
      (current.transferSize || 0) > (largest.transferSize || 0)
        ? current
        : largest,
    ),
    scripts: scripts.map((script) => ({
      name: script.name,
      size: Math.round((script.transferSize || 0) / 1024),
      loadTime: script.responseEnd - script.requestStart,
    })),
  };
};

// Performance score calculator
export const calculatePerformanceScore = (
  metrics: PerformanceMetrics,
): number => {
  let score = 100;

  // LCP scoring
  if (metrics.lcp) {
    if (metrics.lcp > WEB_VITALS_THRESHOLDS.LCP.needsImprovement) {
      score -= 30;
    } else if (metrics.lcp > WEB_VITALS_THRESHOLDS.LCP.good) {
      score -= 15;
    }
  }

  // FID scoring
  if (metrics.fid) {
    if (metrics.fid > WEB_VITALS_THRESHOLDS.FID.needsImprovement) {
      score -= 25;
    } else if (metrics.fid > WEB_VITALS_THRESHOLDS.FID.good) {
      score -= 10;
    }
  }

  // CLS scoring
  if (metrics.cls) {
    if (metrics.cls > WEB_VITALS_THRESHOLDS.CLS.needsImprovement) {
      score -= 25;
    } else if (metrics.cls > WEB_VITALS_THRESHOLDS.CLS.good) {
      score -= 10;
    }
  }

  return Math.max(0, Math.min(100, score));
};

// Resource hints utility
export const addResourceHints = (
  urls: string[],
  type: "preload" | "prefetch" | "dns-prefetch" = "prefetch",
) => {
  if (typeof document === "undefined") return;

  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = type;
    link.href = url;

    if (type === "preload") {
      // Determine resource type
      if (url.includes(".css")) link.as = "style";
      else if (url.includes(".js")) link.as = "script";
      else if (url.match(/\.(jpg|jpeg|png|webp|avif)$/)) link.as = "image";
    }

    document.head.appendChild(link);
  });
};

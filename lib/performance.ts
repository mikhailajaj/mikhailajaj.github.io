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
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
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
  if (process.env.NODE_ENV === 'development') {
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
    case 'CLS':
      return metric.value.toFixed(3);
    case 'FID':
    case 'TTFB':
    case 'LCP':
      return `${Math.round(metric.value)}ms`;
    case 'FCP':
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
export function getWebVitalsRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  switch (metric.name) {
    case 'CLS':
      return metric.value <= 0.1 ? 'good' : metric.value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return metric.value <= 100 ? 'good' : metric.value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return metric.value <= 2500 ? 'good' : metric.value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return metric.value <= 1800 ? 'good' : metric.value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return metric.value <= 800 ? 'good' : metric.value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
}

// Add type definition for window.gtag
declare global {
  interface Window {
    gtag: (command: string, action: string, params: object) => void;
  }
}
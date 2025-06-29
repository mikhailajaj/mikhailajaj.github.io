"use client";
import { useEffect } from 'react';
import { trackWebVitals, logWebVitals } from '@/lib/performance';

/**
 * Component that reports Web Vitals metrics
 * This component doesn't render anything visible
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // Dynamically import web-vitals to avoid SSR issues
    const loadWebVitals = async () => {
      try {
        const { onCLS, onFID, onLCP, onFCP, onTTFB } = await import('web-vitals');
        
        // Register web vitals reporting
        onCLS(metric => {
          trackWebVitals(metric);
          logWebVitals(metric);
        });
        
        onFID(metric => {
          trackWebVitals(metric);
          logWebVitals(metric);
        });
        
        onLCP(metric => {
          trackWebVitals(metric);
          logWebVitals(metric);
        });
        
        onFCP(metric => {
          trackWebVitals(metric);
          logWebVitals(metric);
        });
        
        onTTFB(metric => {
          trackWebVitals(metric);
          logWebVitals(metric);
        });
      } catch (error) {
        console.warn('Failed to load web-vitals:', error);
      }
    };

    // Only load web-vitals in the browser
    if (typeof window !== 'undefined') {
      loadWebVitals();
    }
  }, []);

  // This component doesn't render anything
  return null;
}
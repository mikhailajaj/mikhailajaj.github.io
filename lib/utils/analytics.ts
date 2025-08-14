/**
 * Analytics Utilities
 *
 * Centralized analytics tracking for user interactions and conversions
 */

export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

/**
 * Track user interaction events
 */
export const trackEvent = (eventData: AnalyticsEvent) => {
  // In a real implementation, this would send to your analytics service
  // For now, we'll log to console and prepare for future integration

  if (typeof window !== "undefined") {
    // Google Analytics 4 format
    if (window.gtag) {
      window.gtag("event", eventData.event, {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value,
        ...eventData.customParameters,
      });
    }

    // Console logging for development
    console.log("Analytics Event:", eventData);

    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem("analytics_events") || "[]");
    events.push({
      ...eventData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(
      "analytics_events",
      JSON.stringify(events.slice(-100)),
    ); // Keep last 100 events
  }
};

/**
 * Track CTA button clicks
 */
export const trackCTAClick = (
  ctaId: string,
  location: string,
  variant?: string,
) => {
  trackEvent({
    event: "cta_click",
    category: "conversion",
    label: `${ctaId}_${location}`,
    customParameters: {
      cta_id: ctaId,
      cta_location: location,
      cta_variant: variant,
    },
  });
};

/**
 * Track hero section interactions
 */
export const trackHeroInteraction = (action: string, element: string) => {
  trackEvent({
    event: "hero_interaction",
    category: "engagement",
    label: `${action}_${element}`,
    customParameters: {
      action,
      element,
      section: "hero",
    },
  });
};

/**
 * Track domain card interactions
 */
export const trackDomainInteraction = (
  domainId: string,
  action: "view" | "hover" | "click",
) => {
  trackEvent({
    event: "domain_interaction",
    category: "navigation",
    label: `${domainId}_${action}`,
    customParameters: {
      domain_id: domainId,
      action,
    },
  });
};

/**
 * Track accessibility feature usage
 */
export const trackAccessibilityUsage = (feature: string, enabled: boolean) => {
  trackEvent({
    event: "accessibility_feature",
    category: "accessibility",
    label: `${feature}_${enabled ? "enabled" : "disabled"}`,
    customParameters: {
      feature,
      enabled,
    },
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Phase 3 Analytics Integration
 * Advanced tracking for conversion optimization and user behavior analysis
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

export const event = (action: string, parameters?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, parameters);
  }
};

// Enhanced event tracking for business metrics
export const trackBusinessEvent = {
  // Portfolio engagement events
  viewProject: (projectId: string, domain: string) => {
    event("view_project", {
      event_category: "engagement",
      event_label: `${domain}:${projectId}`,
      custom_map: { custom_parameter_1: domain },
    });
  },

  // Service inquiry events
  contactFormSubmit: (service: string, estimatedValue: string) => {
    event("contact_form_submit", {
      event_category: "conversion",
      event_label: service,
      value: estimatedValue,
      currency: "USD",
    });
  },

  // Content engagement events
  blogPostView: (slug: string, category: string, readingTime: number) => {
    event("blog_post_view", {
      event_category: "content",
      event_label: `${category}:${slug}`,
      custom_map: { reading_time: readingTime },
    });
  },

  blogPostComplete: (slug: string, timeSpent: number) => {
    event("blog_post_complete", {
      event_category: "engagement",
      event_label: slug,
      value: timeSpent,
    });
  },

  // Domain navigation events
  domainSwitch: (fromDomain: string, toDomain: string) => {
    event("domain_navigation", {
      event_category: "navigation",
      event_label: `${fromDomain}_to_${toDomain}`,
    });
  },

  // Service page events
  serviceInquiry: (domain: string, serviceType: string, budget: string) => {
    event("service_inquiry", {
      event_category: "lead_generation",
      event_label: `${domain}:${serviceType}`,
      custom_map: { budget_range: budget },
    });
  },

  // Performance tracking
  coreWebVitals: (metric: any) => {
    event("core_web_vitals", {
      event_category: "performance",
      event_label: metric.name,
      value: Math.round(metric.value),
      custom_map: { metric_rating: metric.rating },
    });
  },

  // User journey tracking
  scrollDepth: (depth: number, page: string) => {
    event("scroll_depth", {
      event_category: "engagement",
      event_label: page,
      value: depth,
    });
  },

  // Feature usage tracking
  featureUsage: (feature: string, domain?: string) => {
    event("feature_usage", {
      event_category: "interaction",
      event_label: feature,
      custom_map: { domain: domain || "global" },
    });
  },

  // 3D visualization engagement
  threeDInteraction: (type: string, duration: number) => {
    event("3d_interaction", {
      event_category: "advanced_features",
      event_label: type,
      value: duration,
    });
  },

  // Download tracking
  downloadAsset: (assetType: string, fileName: string) => {
    event("download", {
      event_category: "engagement",
      event_label: `${assetType}:${fileName}`,
    });
  },

  // Social sharing
  socialShare: (platform: string, content: string) => {
    event("share", {
      method: platform,
      content_type: "article",
      content_id: content,
    });
  },

  // Enhanced ecommerce events for service offerings
  viewServiceOffering: (service: string, domain: string, value: number) => {
    event("view_item", {
      currency: "USD",
      value: value,
      items: [
        {
          item_id: service,
          item_name: service,
          item_category: domain,
          price: value,
          quantity: 1,
        },
      ],
    });
  },

  addToServiceInquiry: (service: string, domain: string, value: number) => {
    event("add_to_cart", {
      currency: "USD",
      value: value,
      items: [
        {
          item_id: service,
          item_name: service,
          item_category: domain,
          price: value,
          quantity: 1,
        },
      ],
    });
  },

  beginServiceCheckout: (services: any[], totalValue: number) => {
    event("begin_checkout", {
      currency: "USD",
      value: totalValue,
      items: services,
    });
  },
};

// User identification for personalization
export const identifyUser = (userId: string, properties: any = {}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      user_id: userId,
      custom_map: properties,
    });
  }
};

// Session tracking
export const trackSession = {
  start: (source?: string, medium?: string, campaign?: string) => {
    event("session_start", {
      event_category: "session",
      custom_map: {
        traffic_source: source || "direct",
        traffic_medium: medium || "none",
        traffic_campaign: campaign || "none",
      },
    });
  },

  end: (duration: number, pageViews: number) => {
    event("session_end", {
      event_category: "session",
      value: duration,
      custom_map: { page_views: pageViews },
    });
  },
};

// A/B testing support
export const trackExperiment = (experimentId: string, variant: string) => {
  event("experiment_impression", {
    event_category: "experiment",
    event_label: `${experimentId}:${variant}`,
  });
};

// Real-time performance monitoring
export const trackPerformance = {
  pageLoad: (url: string, loadTime: number) => {
    event("page_load_time", {
      event_category: "performance",
      event_label: url,
      value: Math.round(loadTime),
    });
  },

  apiCall: (endpoint: string, duration: number, status: number) => {
    event("api_performance", {
      event_category: "performance",
      event_label: endpoint,
      value: Math.round(duration),
      custom_map: { status_code: status },
    });
  },

  resourceLoad: (resourceType: string, size: number, duration: number) => {
    event("resource_load", {
      event_category: "performance",
      event_label: resourceType,
      value: Math.round(duration),
      custom_map: { resource_size: size },
    });
  },
};

// Error tracking
export const trackError = (error: Error, context: string) => {
  event("exception", {
    description: error.message,
    fatal: false,
    custom_map: {
      error_context: context,
      error_stack: error.stack?.substring(0, 500), // Limit stack trace length
    },
  });
};

// Business intelligence tracking
export const trackBusinessMetrics = {
  leadGenerated: (source: string, domain: string, estimatedValue: number) => {
    event("lead_generated", {
      event_category: "business",
      event_label: `${source}:${domain}`,
      value: estimatedValue,
      currency: "USD",
    });
  },

  proposalRequested: (domain: string, serviceType: string, budget: string) => {
    event("proposal_requested", {
      event_category: "business",
      event_label: `${domain}:${serviceType}`,
      custom_map: { budget_range: budget },
    });
  },

  consultationScheduled: (domain: string, meetingType: string) => {
    event("consultation_scheduled", {
      event_category: "business",
      event_label: `${domain}:${meetingType}`,
    });
  },
};

// Enhanced conversion tracking
export const trackConversion = {
  emailSignup: (source: string, context: string) => {
    event("sign_up", {
      method: "email",
      event_category: "conversion",
      event_label: `${source}:${context}`,
    });
  },

  newsletterSubscribe: (source: string) => {
    event("newsletter_subscribe", {
      event_category: "conversion",
      event_label: source,
    });
  },

  contactFormStart: (formType: string) => {
    event("contact_form_start", {
      event_category: "conversion",
      event_label: formType,
    });
  },

  contactFormComplete: (formType: string, responseTime: number) => {
    event("contact_form_complete", {
      event_category: "conversion",
      event_label: formType,
      value: Math.round(responseTime),
    });
  },
};

// Initialize analytics
export const initAnalytics = () => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Track initial session
    trackSession.start();

    // Set up scroll depth tracking
    let maxScrollDepth = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
          maxScrollDepth = scrollPercent;
          trackBusinessEvent.scrollDepth(
            scrollPercent,
            window.location.pathname,
          );
        }
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Track session end on page unload
    window.addEventListener("beforeunload", () => {
      const sessionDuration = performance.now();
      trackSession.end(
        sessionDuration,
        performance.getEntriesByType("navigation").length,
      );
    });
  }
};

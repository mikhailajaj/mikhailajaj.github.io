# Data Analytics Guidelines

## 🎯 Overview

This document outlines the standards and best practices for data analytics within the Mikhail Ajaj Portfolio, demonstrating expertise in data-driven solutions, performance monitoring, and business intelligence.

## 📊 Analytics Architecture

### Data Collection Strategy
- **User Behavior**: Comprehensive user interaction tracking
- **Performance Metrics**: Real-time performance monitoring
- **Business KPIs**: Conversion and engagement metrics
- **Technical Metrics**: System health and error tracking

### Technology Stack
```typescript
// Analytics technology stack
const analyticsStack = {
  collection: ['Google Analytics 4', 'Custom Events', 'Web Vitals API'],
  processing: ['Vercel Analytics', 'Custom Aggregation'],
  visualization: ['Recharts', 'Custom Dashboards'],
  storage: ['Local Analytics DB', 'Google Analytics'],
  realTime: ['WebSocket connections', 'Server-Sent Events']
};
```

## 📈 Performance Analytics

### Core Web Vitals Tracking
```typescript
// Performance monitoring implementation
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export class PerformanceAnalytics {
  private metrics: Map<string, number> = new Map();

  constructor() {
    this.initializeTracking();
  }

  private initializeTracking() {
    getCLS(this.handleMetric.bind(this, 'CLS'));
    getFID(this.handleMetric.bind(this, 'FID'));
    getFCP(this.handleMetric.bind(this, 'FCP'));
    getLCP(this.handleMetric.bind(this, 'LCP'));
    getTTFB(this.handleMetric.bind(this, 'TTFB'));
  }

  private handleMetric(name: string, metric: any) {
    this.metrics.set(name, metric.value);
    this.sendToAnalytics(name, metric);
  }

  private sendToAnalytics(name: string, metric: any) {
    // Send to Google Analytics
    gtag('event', 'web_vitals', {
      metric_name: name,
      metric_value: Math.round(metric.value),
      metric_delta: Math.round(metric.delta),
      metric_id: metric.id
    });

    // Send to custom analytics
    this.sendCustomMetric({
      name,
      value: metric.value,
      timestamp: Date.now(),
      url: window.location.pathname
    });
  }
}
```

### User Experience Analytics
```typescript
// User interaction tracking
export class UserExperienceAnalytics {
  private sessionData: SessionData = {
    startTime: Date.now(),
    pageViews: [],
    interactions: [],
    scrollDepth: 0,
    timeOnPage: 0
  };

  trackPageView(page: string) {
    this.sessionData.pageViews.push({
      page,
      timestamp: Date.now(),
      referrer: document.referrer
    });

    // Track page performance
    this.trackPagePerformance(page);
  }

  trackInteraction(element: string, action: string) {
    this.sessionData.interactions.push({
      element,
      action,
      timestamp: Date.now(),
      page: window.location.pathname
    });

    // Send interaction event
    gtag('event', 'user_interaction', {
      element_type: element,
      action_type: action,
      page_path: window.location.pathname
    });
  }

  trackScrollDepth() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );

    if (scrollPercent > this.sessionData.scrollDepth) {
      this.sessionData.scrollDepth = scrollPercent;

      // Track scroll milestones
      if (scrollPercent >= 25 && scrollPercent < 50) {
        gtag('event', 'scroll_depth', { depth: '25%' });
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        gtag('event', 'scroll_depth', { depth: '50%' });
      } else if (scrollPercent >= 75 && scrollPercent < 90) {
        gtag('event', 'scroll_depth', { depth: '75%' });
      } else if (scrollPercent >= 90) {
        gtag('event', 'scroll_depth', { depth: '90%' });
      }
    }
  }
}
```

## 📊 Business Intelligence

### Conversion Tracking
```typescript
// Lead generation and conversion analytics
export class ConversionAnalytics {
  trackLeadGeneration(source: string, method: string) {
    const leadData = {
      source,
      method,
      timestamp: Date.now(),
      page: window.location.pathname,
      sessionId: this.getSessionId()
    };

    // Send to analytics
    gtag('event', 'generate_lead', {
      source,
      method,
      value: 1
    });

    // Custom tracking
    this.sendLeadData(leadData);
  }

  trackProjectInquiry(projectType: string, contactMethod: string) {
    gtag('event', 'project_inquiry', {
      project_type: projectType,
      contact_method: contactMethod,
      value: 10 // Estimated lead value
    });
  }

  trackDownload(resource: string, type: string) {
    gtag('event', 'file_download', {
      file_name: resource,
      file_type: type,
      page_path: window.location.pathname
    });
  }

  trackExternalLink(url: string, context: string) {
    gtag('event', 'click', {
      event_category: 'external_link',
      event_label: url,
      transport_type: 'beacon'
    });
  }
}
```

### Portfolio Performance Metrics
```typescript
// Portfolio-specific analytics
export class PortfolioAnalytics {
  private readonly metrics = {
    projectViews: new Map<string, number>(),
    skillInteractions: new Map<string, number>(),
    contactAttempts: 0,
    resumeDownloads: 0
  };

  trackProjectView(projectId: string, domain: string) {
    const currentViews = this.metrics.projectViews.get(projectId) || 0;
    this.metrics.projectViews.set(projectId, currentViews + 1);

    gtag('event', 'view_item', {
      item_id: projectId,
      item_category: domain,
      content_type: 'project'
    });
  }

  trackSkillInteraction(skill: string, interactionType: string) {
    const key = `${skill}_${interactionType}`;
    const currentCount = this.metrics.skillInteractions.get(key) || 0;
    this.metrics.skillInteractions.set(key, currentCount + 1);

    gtag('event', 'skill_interaction', {
      skill_name: skill,
      interaction_type: interactionType
    });
  }

  trackContactAttempt(method: string, success: boolean) {
    this.metrics.contactAttempts++;

    gtag('event', 'contact_attempt', {
      method,
      success: success ? 'true' : 'false',
      value: success ? 5 : 0
    });
  }

  generatePortfolioReport(): PortfolioReport {
    return {
      totalProjectViews: Array.from(this.metrics.projectViews.values())
        .reduce((sum, views) => sum + views, 0),
      mostViewedProjects: this.getMostViewedProjects(),
      popularSkills: this.getPopularSkills(),
      conversionRate: this.calculateConversionRate(),
      engagementScore: this.calculateEngagementScore()
    };
  }
}
```

## 📈 Data Visualization

### Dashboard Components
```typescript
// Analytics dashboard implementation
export function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  useEffect(() => {
    loadAnalyticsData(timeRange).then(setMetrics);
  }, [timeRange]);

  if (!metrics) return <DashboardSkeleton />;

  return (
    <div className="analytics-dashboard">
      <MetricsOverview metrics={metrics.overview} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={metrics.performance} />
        <UserEngagementChart data={metrics.engagement} />
        <ConversionFunnel data={metrics.conversions} />
        <TopContent data={metrics.content} />
      </div>
      
      <RealTimeMetrics />
    </div>
  );
}

// Performance visualization
export function PerformanceChart({ data }: { data: PerformanceData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Web Vitals</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="lcp" stroke="#8884d8" name="LCP" />
            <Line type="monotone" dataKey="fid" stroke="#82ca9d" name="FID" />
            <Line type="monotone" dataKey="cls" stroke="#ffc658" name="CLS" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### Real-Time Analytics
```typescript
// Real-time analytics implementation
export class RealTimeAnalytics {
  private wsConnection: WebSocket | null = null;
  private eventQueue: AnalyticsEvent[] = [];

  constructor() {
    this.initializeConnection();
    this.startBatchProcessor();
  }

  private initializeConnection() {
    if (typeof window === 'undefined') return;

    this.wsConnection = new WebSocket(process.env.NEXT_PUBLIC_ANALYTICS_WS_URL!);
    
    this.wsConnection.onopen = () => {
      console.log('Real-time analytics connected');
      this.flushEventQueue();
    };

    this.wsConnection.onclose = () => {
      console.log('Real-time analytics disconnected');
      // Reconnect after 5 seconds
      setTimeout(() => this.initializeConnection(), 5000);
    };
  }

  sendEvent(event: AnalyticsEvent) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify(event));
    } else {
      this.eventQueue.push(event);
    }
  }

  private startBatchProcessor() {
    setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.processBatch();
      }
    }, 5000); // Process every 5 seconds
  }
}
```

## 🔍 Data Quality & Validation

### Data Validation
```typescript
// Analytics data validation
import { z } from 'zod';

const AnalyticsEventSchema = z.object({
  eventType: z.enum(['pageview', 'interaction', 'conversion', 'error']),
  timestamp: z.number(),
  userId: z.string().optional(),
  sessionId: z.string(),
  page: z.string(),
  data: z.record(z.any())
});

export function validateAnalyticsEvent(event: unknown): AnalyticsEvent {
  return AnalyticsEventSchema.parse(event);
}

// Data quality monitoring
export class DataQualityMonitor {
  private qualityMetrics = {
    totalEvents: 0,
    validEvents: 0,
    invalidEvents: 0,
    duplicateEvents: 0
  };

  validateEvent(event: unknown): boolean {
    this.qualityMetrics.totalEvents++;

    try {
      validateAnalyticsEvent(event);
      this.qualityMetrics.validEvents++;
      return true;
    } catch (error) {
      this.qualityMetrics.invalidEvents++;
      console.warn('Invalid analytics event:', error);
      return false;
    }
  }

  getQualityScore(): number {
    if (this.qualityMetrics.totalEvents === 0) return 100;
    
    return (this.qualityMetrics.validEvents / this.qualityMetrics.totalEvents) * 100;
  }
}
```

## 📊 Reporting & Insights

### Automated Reports
```typescript
// Automated analytics reporting
export class AnalyticsReporter {
  async generateWeeklyReport(): Promise<WeeklyReport> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const data = await this.fetchAnalyticsData(startDate, endDate);

    return {
      period: { start: startDate, end: endDate },
      metrics: {
        pageViews: data.pageViews,
        uniqueVisitors: data.uniqueVisitors,
        averageSessionDuration: data.avgSessionDuration,
        bounceRate: data.bounceRate,
        conversionRate: data.conversionRate
      },
      topPages: data.topPages,
      trafficSources: data.trafficSources,
      deviceBreakdown: data.deviceBreakdown,
      performanceMetrics: data.performance,
      insights: this.generateInsights(data)
    };
  }

  private generateInsights(data: AnalyticsData): Insight[] {
    const insights: Insight[] = [];

    // Performance insights
    if (data.performance.lcp > 2500) {
      insights.push({
        type: 'warning',
        category: 'performance',
        message: 'LCP is above recommended threshold',
        recommendation: 'Optimize images and reduce server response time'
      });
    }

    // Traffic insights
    const mobileTraffic = data.deviceBreakdown.mobile / data.totalVisitors;
    if (mobileTraffic > 0.6) {
      insights.push({
        type: 'info',
        category: 'traffic',
        message: 'High mobile traffic detected',
        recommendation: 'Ensure mobile experience is optimized'
      });
    }

    return insights;
  }
}
```

## 🎯 Privacy & Compliance

### GDPR Compliance
```typescript
// Privacy-compliant analytics
export class PrivacyCompliantAnalytics {
  private consentGiven = false;

  constructor() {
    this.checkConsent();
  }

  private checkConsent() {
    const consent = localStorage.getItem('analytics-consent');
    this.consentGiven = consent === 'granted';

    if (!this.consentGiven) {
      this.showConsentBanner();
    }
  }

  grantConsent() {
    this.consentGiven = true;
    localStorage.setItem('analytics-consent', 'granted');
    this.initializeTracking();
  }

  revokeConsent() {
    this.consentGiven = false;
    localStorage.removeItem('analytics-consent');
    this.clearTrackingData();
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.consentGiven) return;

    // Anonymize IP and remove PII
    const anonymizedEvent = this.anonymizeEvent(event);
    this.sendEvent(anonymizedEvent);
  }

  private anonymizeEvent(event: AnalyticsEvent): AnalyticsEvent {
    return {
      ...event,
      userId: undefined, // Remove user ID
      ip: this.anonymizeIP(event.ip),
      userAgent: this.anonymizeUserAgent(event.userAgent)
    };
  }
}
```

This data analytics approach ensures comprehensive tracking, meaningful insights, and privacy compliance while demonstrating professional expertise in data-driven decision making and business intelligence.
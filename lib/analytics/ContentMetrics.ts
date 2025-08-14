/**
 * Content Performance Metrics System
 * Tracks content engagement, performance scoring, and optimization recommendations
 */

export interface ContentMetrics {
  id: string;
  url: string;
  title: string;
  type: ContentType;
  category: string;
  publishDate: Date;
  lastUpdated: Date;
  performance: ContentPerformance;
  engagement: ContentEngagement;
  seo: SEOMetrics;
  conversion: ConversionMetrics;
  recommendations: ContentRecommendation[];
}

export interface ContentPerformance {
  views: {
    total: number;
    unique: number;
    returning: number;
    trend: "increasing" | "decreasing" | "stable";
  };
  timeOnPage: {
    average: number;
    median: number;
    bounceRate: number;
  };
  readingProgress: {
    averageCompletion: number;
    dropOffPoints: number[];
  };
  shareability: {
    totalShares: number;
    sharesByPlatform: Record<string, number>;
    viralCoefficient: number;
  };
}

export interface ContentEngagement {
  interactions: {
    likes: number;
    comments: number;
    shares: number;
    downloads: number;
    bookmarks: number;
  };
  userActions: {
    scrollDepth: number;
    clickThroughRate: number;
    conversionRate: number;
    returnVisitorRate: number;
  };
  qualitySignals: {
    dwellTime: number;
    pageValue: number;
    engagementScore: number;
  };
}

export interface SEOMetrics {
  rankings: {
    primaryKeyword: string;
    position: number;
    previousPosition: number;
    trend: "up" | "down" | "stable";
  }[];
  organic: {
    impressions: number;
    clicks: number;
    ctr: number;
    averagePosition: number;
  };
  technical: {
    loadTime: number;
    mobileScore: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
}

export interface ConversionMetrics {
  goals: {
    contactForm: number;
    newsletter: number;
    download: number;
    demo: number;
    consultation: number;
  };
  funnel: {
    awareness: number;
    interest: number;
    consideration: number;
    conversion: number;
  };
  attribution: {
    firstTouch: number;
    lastTouch: number;
    assisted: number;
  };
}

export interface ContentRecommendation {
  type: RecommendationType;
  priority: "high" | "medium" | "low";
  description: string;
  expectedImpact: string;
  effort: "low" | "medium" | "high";
  category: "seo" | "engagement" | "conversion" | "technical";
}

export type ContentType =
  | "blog_post"
  | "case_study"
  | "portfolio_item"
  | "landing_page"
  | "service_page"
  | "about_page"
  | "contact_page"
  | "tool_page"
  | "documentation";

export type RecommendationType =
  | "improve_headline"
  | "add_cta"
  | "optimize_images"
  | "improve_readability"
  | "add_internal_links"
  | "update_meta_description"
  | "improve_loading_speed"
  | "add_schema_markup"
  | "enhance_mobile_experience"
  | "improve_content_structure"
  | "add_social_proof"
  | "optimize_for_keywords";

export interface ContentAnalytics {
  overview: {
    totalContent: number;
    totalViews: number;
    averageEngagement: number;
    topPerformers: ContentMetrics[];
    underPerformers: ContentMetrics[];
  };
  trends: {
    viewsTrend: Array<{ date: string; views: number }>;
    engagementTrend: Array<{ date: string; engagement: number }>;
    conversionTrend: Array<{ date: string; conversions: number }>;
  };
  insights: {
    bestPerformingTypes: Array<{ type: ContentType; avgScore: number }>;
    topKeywords: Array<{ keyword: string; traffic: number; position: number }>;
    contentGaps: string[];
    optimizationOpportunities: ContentRecommendation[];
  };
}

class ContentMetricsService {
  private contentMetrics: Map<string, ContentMetrics> = new Map();
  private trackingData: Map<string, any[]> = new Map();

  /**
   * Track page view for content
   */
  async trackPageView(
    contentId: string,
    data: {
      url: string;
      referrer?: string;
      userAgent: string;
      sessionId: string;
      userId?: string;
      timestamp: Date;
    },
  ): Promise<void> {
    const content = this.contentMetrics.get(contentId);
    if (!content) return;

    // Update view metrics
    content.performance.views.total++;

    // Track unique views (simplified - in production, use proper session/user tracking)
    if (!this.hasRecentView(contentId, data.sessionId)) {
      content.performance.views.unique++;
    }

    // Store tracking data for analysis
    this.addTrackingData(contentId, "page_view", data);

    await this.updateContentMetrics(contentId, content);
  }

  /**
   * Track user engagement events
   */
  async trackEngagement(
    contentId: string,
    event: {
      type:
        | "scroll"
        | "click"
        | "share"
        | "comment"
        | "like"
        | "download"
        | "bookmark";
      data: Record<string, any>;
      timestamp: Date;
      sessionId: string;
    },
  ): Promise<void> {
    const content = this.contentMetrics.get(contentId);
    if (!content) return;

    switch (event.type) {
      case "scroll":
        this.updateScrollMetrics(content, event.data);
        break;
      case "click":
        this.updateClickMetrics(content, event.data);
        break;
      case "share":
        this.updateShareMetrics(content, event.data);
        break;
      case "comment":
        content.engagement.interactions.comments++;
        break;
      case "like":
        content.engagement.interactions.likes++;
        break;
      case "download":
        content.engagement.interactions.downloads++;
        break;
      case "bookmark":
        content.engagement.interactions.bookmarks++;
        break;
    }

    this.addTrackingData(contentId, event.type, event);
    await this.updateContentMetrics(contentId, content);
  }

  /**
   * Track conversion events
   */
  async trackConversion(
    contentId: string,
    conversion: {
      type: keyof ConversionMetrics["goals"];
      value?: number;
      attribution: "first_touch" | "last_touch" | "assisted";
      timestamp: Date;
      sessionId: string;
    },
  ): Promise<void> {
    const content = this.contentMetrics.get(contentId);
    if (!content) return;

    // Update conversion metrics
    content.conversion.goals[conversion.type]++;
    content.conversion.attribution[
      conversion.attribution === "first_touch"
        ? "firstTouch"
        : conversion.attribution === "last_touch"
          ? "lastTouch"
          : "assisted"
    ]++;

    this.addTrackingData(contentId, "conversion", conversion);
    await this.updateContentMetrics(contentId, content);
  }

  /**
   * Update SEO metrics for content
   */
  async updateSEOMetrics(
    contentId: string,
    seoData: {
      rankings?: Array<{
        keyword: string;
        position: number;
        previousPosition: number;
      }>;
      organic?: {
        impressions: number;
        clicks: number;
        ctr: number;
        averagePosition: number;
      };
      technical?: { loadTime: number; mobileScore: number; coreWebVitals: any };
    },
  ): Promise<void> {
    const content = this.contentMetrics.get(contentId);
    if (!content) return;

    if (seoData.rankings) {
      content.seo.rankings = seoData.rankings.map((ranking) => ({
        ...ranking,
        trend:
          ranking.position < ranking.previousPosition
            ? "up"
            : ranking.position > ranking.previousPosition
              ? "down"
              : "stable",
      }));
    }

    if (seoData.organic) {
      content.seo.organic = seoData.organic;
    }

    if (seoData.technical) {
      content.seo.technical = seoData.technical;
    }

    await this.updateContentMetrics(contentId, content);
  }

  /**
   * Calculate content performance score
   */
  calculatePerformanceScore(content: ContentMetrics): number {
    let score = 0;
    let maxScore = 0;

    // Engagement score (40% weight)
    const engagementScore = this.calculateEngagementScore(content);
    score += engagementScore * 0.4;
    maxScore += 100 * 0.4;

    // SEO score (30% weight)
    const seoScore = this.calculateSEOScore(content);
    score += seoScore * 0.3;
    maxScore += 100 * 0.3;

    // Conversion score (20% weight)
    const conversionScore = this.calculateConversionScore(content);
    score += conversionScore * 0.2;
    maxScore += 100 * 0.2;

    // Technical score (10% weight)
    const technicalScore = this.calculateTechnicalScore(content);
    score += technicalScore * 0.1;
    maxScore += 100 * 0.1;

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Generate content recommendations
   */
  generateRecommendations(content: ContentMetrics): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];

    // SEO recommendations
    if (content.seo.organic.ctr < 2) {
      recommendations.push({
        type: "improve_headline",
        priority: "high",
        description:
          "Low click-through rate suggests the title needs optimization",
        expectedImpact: "Increase CTR by 20-40%",
        effort: "low",
        category: "seo",
      });
    }

    if (content.seo.technical.loadTime > 3) {
      recommendations.push({
        type: "improve_loading_speed",
        priority: "high",
        description:
          "Page load time is above 3 seconds, affecting SEO and user experience",
        expectedImpact: "Improve rankings and reduce bounce rate",
        effort: "medium",
        category: "technical",
      });
    }

    // Engagement recommendations
    if (content.performance.timeOnPage.bounceRate > 70) {
      recommendations.push({
        type: "improve_content_structure",
        priority: "medium",
        description:
          "High bounce rate indicates content structure needs improvement",
        expectedImpact: "Reduce bounce rate by 15-25%",
        effort: "medium",
        category: "engagement",
      });
    }

    if (content.engagement.userActions.scrollDepth < 50) {
      recommendations.push({
        type: "improve_readability",
        priority: "medium",
        description: "Low scroll depth suggests content is not engaging enough",
        expectedImpact: "Increase engagement by 20%",
        effort: "medium",
        category: "engagement",
      });
    }

    // Conversion recommendations
    if (
      content.conversion.goals.contactForm === 0 &&
      content.type === "service_page"
    ) {
      recommendations.push({
        type: "add_cta",
        priority: "high",
        description:
          "Service page has no contact form conversions - add compelling CTAs",
        expectedImpact: "Generate 2-5 leads per month",
        effort: "low",
        category: "conversion",
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get content analytics overview
   */
  getContentAnalytics(
    timeframe: "week" | "month" | "quarter" = "month",
  ): ContentAnalytics {
    const contents = Array.from(this.contentMetrics.values());
    const now = new Date();
    const timeframeMs = this.getTimeframeMs(timeframe);

    // Filter content by timeframe
    const recentContents = contents.filter(
      (content) => now.getTime() - content.publishDate.getTime() <= timeframeMs,
    );

    const totalViews = recentContents.reduce(
      (sum, content) => sum + content.performance.views.total,
      0,
    );
    const averageEngagement =
      recentContents.reduce(
        (sum, content) =>
          sum + content.engagement.qualitySignals.engagementScore,
        0,
      ) / recentContents.length || 0;

    // Sort by performance score
    const sortedByPerformance = recentContents
      .map((content) => ({
        ...content,
        score: this.calculatePerformanceScore(content),
      }))
      .sort((a, b) => b.score - a.score);

    const topPerformers = sortedByPerformance.slice(0, 5);
    const underPerformers = sortedByPerformance.slice(-5).reverse();

    return {
      overview: {
        totalContent: recentContents.length,
        totalViews,
        averageEngagement,
        topPerformers,
        underPerformers,
      },
      trends: this.calculateTrends(recentContents, timeframe),
      insights: this.generateInsights(recentContents),
    };
  }

  /**
   * Create or update content metrics
   */
  async createOrUpdateContent(
    contentData: Partial<ContentMetrics>,
  ): Promise<ContentMetrics> {
    const contentId =
      contentData.id || this.generateContentId(contentData.url || "");

    const existingContent = this.contentMetrics.get(contentId);

    const content: ContentMetrics = {
      id: contentId,
      url: contentData.url || "",
      title: contentData.title || "",
      type: contentData.type || "blog_post",
      category: contentData.category || "general",
      publishDate: contentData.publishDate || new Date(),
      lastUpdated: new Date(),
      performance: existingContent?.performance || this.getDefaultPerformance(),
      engagement: existingContent?.engagement || this.getDefaultEngagement(),
      seo: existingContent?.seo || this.getDefaultSEO(),
      conversion: existingContent?.conversion || this.getDefaultConversion(),
      recommendations: [],
    };

    // Generate recommendations
    content.recommendations = this.generateRecommendations(content);

    this.contentMetrics.set(contentId, content);
    return content;
  }

  // Private helper methods
  private hasRecentView(contentId: string, sessionId: string): boolean {
    const trackingData = this.trackingData.get(contentId) || [];
    const recentViews = trackingData.filter(
      (data) =>
        data.type === "page_view" &&
        data.sessionId === sessionId &&
        Date.now() - data.timestamp.getTime() < 30 * 60 * 1000, // 30 minutes
    );
    return recentViews.length > 0;
  }

  private addTrackingData(contentId: string, type: string, data: any): void {
    if (!this.trackingData.has(contentId)) {
      this.trackingData.set(contentId, []);
    }
    this.trackingData.get(contentId)!.push({ type, ...data });
  }

  private updateScrollMetrics(content: ContentMetrics, data: any): void {
    if (data.scrollDepth) {
      content.engagement.userActions.scrollDepth = Math.max(
        content.engagement.userActions.scrollDepth,
        data.scrollDepth,
      );
    }
  }

  private updateClickMetrics(content: ContentMetrics, data: any): void {
    // Update click-through rate based on click data
    if (data.isInternalLink) {
      content.engagement.userActions.clickThroughRate += 0.1;
    }
  }

  private updateShareMetrics(content: ContentMetrics, data: any): void {
    content.performance.shareability.totalShares++;
    if (data.platform) {
      content.performance.shareability.sharesByPlatform[data.platform] =
        (content.performance.shareability.sharesByPlatform[data.platform] ||
          0) + 1;
    }
  }

  private calculateEngagementScore(content: ContentMetrics): number {
    const { engagement, performance } = content;
    let score = 0;

    // Time on page (30%)
    score += Math.min(performance.timeOnPage.average / 180, 1) * 30; // 3 minutes = 100%

    // Scroll depth (25%)
    score += (engagement.userActions.scrollDepth / 100) * 25;

    // Interactions (25%)
    const totalInteractions = Object.values(engagement.interactions).reduce(
      (sum, val) => sum + val,
      0,
    );
    score += Math.min(totalInteractions / 10, 1) * 25; // 10 interactions = 100%

    // Bounce rate (20% - inverse)
    score += (1 - Math.min(performance.timeOnPage.bounceRate / 100, 1)) * 20;

    return Math.round(score);
  }

  private calculateSEOScore(content: ContentMetrics): number {
    const { seo } = content;
    let score = 0;

    // Average position (40%)
    if (seo.organic.averagePosition > 0) {
      score +=
        Math.max(0, (11 - Math.min(seo.organic.averagePosition, 10)) / 10) * 40;
    }

    // CTR (30%)
    score += Math.min(seo.organic.ctr / 5, 1) * 30; // 5% CTR = 100%

    // Core Web Vitals (30%)
    const cwvScore = this.calculateCoreWebVitalsScore(
      seo.technical.coreWebVitals,
    );
    score += cwvScore * 0.3;

    return Math.round(score);
  }

  private calculateConversionScore(content: ContentMetrics): number {
    const { conversion } = content;
    const totalConversions = Object.values(conversion.goals).reduce(
      (sum, val) => sum + val,
      0,
    );

    // Simple conversion scoring - can be enhanced based on business goals
    return Math.min(totalConversions * 10, 100); // 10 conversions = 100%
  }

  private calculateTechnicalScore(content: ContentMetrics): number {
    const { seo } = content;
    let score = 0;

    // Load time (50%)
    score += Math.max(0, (5 - Math.min(seo.technical.loadTime, 5)) / 5) * 50;

    // Mobile score (50%)
    score += (seo.technical.mobileScore / 100) * 50;

    return Math.round(score);
  }

  private calculateCoreWebVitalsScore(cwv: any): number {
    if (!cwv) return 0;

    let score = 0;

    // LCP (Largest Contentful Paint)
    if (cwv.lcp <= 2.5) score += 33.33;
    else if (cwv.lcp <= 4) score += 16.67;

    // FID (First Input Delay)
    if (cwv.fid <= 100) score += 33.33;
    else if (cwv.fid <= 300) score += 16.67;

    // CLS (Cumulative Layout Shift)
    if (cwv.cls <= 0.1) score += 33.33;
    else if (cwv.cls <= 0.25) score += 16.67;

    return Math.round(score);
  }

  private calculateTrends(contents: ContentMetrics[], timeframe: string) {
    // Simplified trend calculation - in production, use time-series data
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 90;
    const trends = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      trends.unshift({
        date: date.toISOString().split("T")[0],
        views: Math.floor(Math.random() * 1000), // Mock data
        engagement: Math.floor(Math.random() * 100),
        conversions: Math.floor(Math.random() * 10),
      });
    }

    return {
      viewsTrend: trends.map((t) => ({ date: t.date, views: t.views })),
      engagementTrend: trends.map((t) => ({
        date: t.date,
        engagement: t.engagement,
      })),
      conversionTrend: trends.map((t) => ({
        date: t.date,
        conversions: t.conversions,
      })),
    };
  }

  private generateInsights(contents: ContentMetrics[]) {
    const typePerformance: Record<ContentType, number[]> = {} as any;

    contents.forEach((content) => {
      const score = this.calculatePerformanceScore(content);
      if (!typePerformance[content.type]) {
        typePerformance[content.type] = [];
      }
      typePerformance[content.type].push(score);
    });

    const bestPerformingTypes = Object.entries(typePerformance)
      .map(([type, scores]) => ({
        type: type as ContentType,
        avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    return {
      bestPerformingTypes,
      topKeywords: [], // Would be populated from SEO data
      contentGaps: [], // Would be identified through keyword analysis
      optimizationOpportunities: contents
        .flatMap((content) => content.recommendations)
        .filter((rec) => rec.priority === "high")
        .slice(0, 10),
    };
  }

  private getTimeframeMs(timeframe: string): number {
    const day = 24 * 60 * 60 * 1000;
    switch (timeframe) {
      case "week":
        return 7 * day;
      case "month":
        return 30 * day;
      case "quarter":
        return 90 * day;
      default:
        return 30 * day;
    }
  }

  private generateContentId(url: string): string {
    return `content_${url.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
  }

  private getDefaultPerformance(): ContentPerformance {
    return {
      views: { total: 0, unique: 0, returning: 0, trend: "stable" },
      timeOnPage: { average: 0, median: 0, bounceRate: 0 },
      readingProgress: { averageCompletion: 0, dropOffPoints: [] },
      shareability: {
        totalShares: 0,
        sharesByPlatform: {},
        viralCoefficient: 0,
      },
    };
  }

  private getDefaultEngagement(): ContentEngagement {
    return {
      interactions: {
        likes: 0,
        comments: 0,
        shares: 0,
        downloads: 0,
        bookmarks: 0,
      },
      userActions: {
        scrollDepth: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        returnVisitorRate: 0,
      },
      qualitySignals: { dwellTime: 0, pageValue: 0, engagementScore: 0 },
    };
  }

  private getDefaultSEO(): SEOMetrics {
    return {
      rankings: [],
      organic: { impressions: 0, clicks: 0, ctr: 0, averagePosition: 0 },
      technical: {
        loadTime: 0,
        mobileScore: 0,
        coreWebVitals: { lcp: 0, fid: 0, cls: 0 },
      },
    };
  }

  private getDefaultConversion(): ConversionMetrics {
    return {
      goals: {
        contactForm: 0,
        newsletter: 0,
        download: 0,
        demo: 0,
        consultation: 0,
      },
      funnel: { awareness: 0, interest: 0, consideration: 0, conversion: 0 },
      attribution: { firstTouch: 0, lastTouch: 0, assisted: 0 },
    };
  }

  private async updateContentMetrics(
    contentId: string,
    content: ContentMetrics,
  ): Promise<void> {
    content.lastUpdated = new Date();
    this.contentMetrics.set(contentId, content);

    // In production, save to database
    console.log(`Content metrics updated for: ${contentId}`);
  }
}

// Singleton instance
export const contentMetricsService = new ContentMetricsService();

// Utility functions
export const trackContentView = (
  contentId: string,
  data: Parameters<typeof contentMetricsService.trackPageView>[1],
) => contentMetricsService.trackPageView(contentId, data);

export const trackContentEngagement = (
  contentId: string,
  event: Parameters<typeof contentMetricsService.trackEngagement>[1],
) => contentMetricsService.trackEngagement(contentId, event);

export const trackContentConversion = (
  contentId: string,
  conversion: Parameters<typeof contentMetricsService.trackConversion>[1],
) => contentMetricsService.trackConversion(contentId, conversion);

export const getContentAnalytics = (timeframe?: "week" | "month" | "quarter") =>
  contentMetricsService.getContentAnalytics(timeframe);

export const createContent = (contentData: Partial<ContentMetrics>) =>
  contentMetricsService.createOrUpdateContent(contentData);

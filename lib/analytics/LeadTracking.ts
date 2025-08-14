/**
 * Lead Generation Tracking System
 * Implements lead scoring, source attribution, and quality metrics
 */

export interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  source: LeadSource;
  score: number;
  quality: LeadQuality;
  status: LeadStatus;
  touchpoints: TouchPoint[];
  metadata: LeadMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface TouchPoint {
  id: string;
  type: TouchPointType;
  source: string;
  timestamp: Date;
  data: Record<string, any>;
  score: number;
}

export interface LeadMetadata {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referrer?: string;
  userAgent: string;
  ipAddress: string;
  location?: {
    country: string;
    region: string;
    city: string;
  };
  device: {
    type: "desktop" | "mobile" | "tablet";
    os: string;
    browser: string;
  };
  sessionData: {
    duration: number;
    pageViews: number;
    bounceRate: number;
    engagementScore: number;
  };
}

export type LeadSource =
  | "organic_search"
  | "paid_search"
  | "social_media"
  | "direct"
  | "referral"
  | "email"
  | "content_marketing"
  | "portfolio_demo"
  | "calculator_tool"
  | "contact_form"
  | "newsletter"
  | "unknown";

export type LeadQuality = "hot" | "warm" | "cold" | "unqualified";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "negotiating"
  | "won"
  | "lost"
  | "nurturing";

export type TouchPointType =
  | "page_view"
  | "form_submission"
  | "download"
  | "demo_interaction"
  | "calculator_usage"
  | "email_open"
  | "email_click"
  | "social_engagement"
  | "chat_interaction";

export interface LeadScoringRules {
  demographic: {
    hasCompanyEmail: number;
    hasCompanyName: number;
    hasPhoneNumber: number;
    targetIndustry: number;
    targetCompanySize: number;
  };
  behavioral: {
    pageViews: number;
    sessionDuration: number;
    demoInteraction: number;
    calculatorUsage: number;
    downloadAction: number;
    formSubmission: number;
    returnVisitor: number;
  };
  engagement: {
    emailOpen: number;
    emailClick: number;
    socialShare: number;
    commentSubmission: number;
    newsletterSubscription: number;
  };
  intent: {
    pricingPageView: number;
    contactPageView: number;
    servicesPageView: number;
    caseStudyView: number;
    portfolioInteraction: number;
  };
}

export interface LeadAnalytics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageScore: number;
  sourceBreakdown: Record<LeadSource, number>;
  qualityDistribution: Record<LeadQuality, number>;
  monthlyTrends: Array<{
    month: string;
    leads: number;
    qualified: number;
    conversionRate: number;
  }>;
  topSources: Array<{
    source: LeadSource;
    leads: number;
    conversionRate: number;
    averageScore: number;
  }>;
}

class LeadTrackingService {
  private leads: Map<string, Lead> = new Map();
  private scoringRules: LeadScoringRules;

  constructor() {
    this.scoringRules = {
      demographic: {
        hasCompanyEmail: 15,
        hasCompanyName: 10,
        hasPhoneNumber: 8,
        targetIndustry: 20,
        targetCompanySize: 15,
      },
      behavioral: {
        pageViews: 2,
        sessionDuration: 1, // per minute
        demoInteraction: 25,
        calculatorUsage: 20,
        downloadAction: 15,
        formSubmission: 30,
        returnVisitor: 10,
      },
      engagement: {
        emailOpen: 5,
        emailClick: 10,
        socialShare: 8,
        commentSubmission: 12,
        newsletterSubscription: 15,
      },
      intent: {
        pricingPageView: 20,
        contactPageView: 25,
        servicesPageView: 15,
        caseStudyView: 10,
        portfolioInteraction: 12,
      },
    };
  }

  /**
   * Create a new lead from form submission or interaction
   */
  async createLead(data: Partial<Lead>): Promise<Lead> {
    const leadId = this.generateLeadId();

    const lead: Lead = {
      id: leadId,
      email: data.email || "",
      name: data.name,
      company: data.company,
      phone: data.phone,
      source: data.source || "unknown",
      score: 0,
      quality: "cold",
      status: "new",
      touchpoints: [],
      metadata: data.metadata || this.getDefaultMetadata(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Calculate initial score
    lead.score = this.calculateLeadScore(lead);
    lead.quality = this.determineLeadQuality(lead.score);

    this.leads.set(leadId, lead);

    // Track lead creation event
    await this.trackEvent("lead_created", {
      leadId,
      source: lead.source,
      score: lead.score,
      quality: lead.quality,
    });

    return lead;
  }

  /**
   * Add a touchpoint to an existing lead
   */
  async addTouchPoint(
    leadId: string,
    touchpoint: Omit<TouchPoint, "id" | "score">,
  ): Promise<void> {
    const lead = this.leads.get(leadId);
    if (!lead) return;

    const touchpointWithScore: TouchPoint = {
      ...touchpoint,
      id: this.generateTouchPointId(),
      score: this.calculateTouchPointScore(touchpoint.type, touchpoint.data),
    };

    lead.touchpoints.push(touchpointWithScore);
    lead.updatedAt = new Date();

    // Recalculate lead score
    lead.score = this.calculateLeadScore(lead);
    lead.quality = this.determineLeadQuality(lead.score);

    await this.trackEvent("touchpoint_added", {
      leadId,
      touchpointType: touchpoint.type,
      newScore: lead.score,
      quality: lead.quality,
    });
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
    const lead = this.leads.get(leadId);
    if (!lead) return;

    const previousStatus = lead.status;
    lead.status = status;
    lead.updatedAt = new Date();

    await this.trackEvent("lead_status_updated", {
      leadId,
      previousStatus,
      newStatus: status,
      score: lead.score,
    });
  }

  /**
   * Calculate lead score based on demographic, behavioral, and engagement data
   */
  private calculateLeadScore(lead: Lead): number {
    let score = 0;

    // Demographic scoring
    if (this.isCompanyEmail(lead.email)) {
      score += this.scoringRules.demographic.hasCompanyEmail;
    }
    if (lead.company) {
      score += this.scoringRules.demographic.hasCompanyName;
    }
    if (lead.phone) {
      score += this.scoringRules.demographic.hasPhoneNumber;
    }

    // Behavioral scoring from touchpoints
    const touchpointScores = lead.touchpoints.reduce(
      (total, tp) => total + tp.score,
      0,
    );
    score += touchpointScores;

    // Session data scoring
    if (lead.metadata.sessionData) {
      score += Math.min(
        lead.metadata.sessionData.pageViews *
          this.scoringRules.behavioral.pageViews,
        20,
      );
      score += Math.min(
        (lead.metadata.sessionData.duration *
          this.scoringRules.behavioral.sessionDuration) /
          60,
        30,
      );
      score += lead.metadata.sessionData.engagementScore;
    }

    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Calculate score for individual touchpoints
   */
  private calculateTouchPointScore(
    type: TouchPointType,
    data: Record<string, any>,
  ): number {
    switch (type) {
      case "page_view":
        if (data.page?.includes("pricing"))
          return this.scoringRules.intent.pricingPageView;
        if (data.page?.includes("contact"))
          return this.scoringRules.intent.contactPageView;
        if (data.page?.includes("services"))
          return this.scoringRules.intent.servicesPageView;
        return this.scoringRules.behavioral.pageViews;

      case "form_submission":
        return this.scoringRules.behavioral.formSubmission;

      case "demo_interaction":
        return this.scoringRules.behavioral.demoInteraction;

      case "calculator_usage":
        return this.scoringRules.behavioral.calculatorUsage;

      case "download":
        return this.scoringRules.behavioral.downloadAction;

      case "email_open":
        return this.scoringRules.engagement.emailOpen;

      case "email_click":
        return this.scoringRules.engagement.emailClick;

      case "social_engagement":
        return this.scoringRules.engagement.socialShare;

      default:
        return 1;
    }
  }

  /**
   * Determine lead quality based on score
   */
  private determineLeadQuality(score: number): LeadQuality {
    if (score >= 80) return "hot";
    if (score >= 60) return "warm";
    if (score >= 30) return "cold";
    return "unqualified";
  }

  /**
   * Get lead analytics and insights
   */
  getLeadAnalytics(
    timeframe: "week" | "month" | "quarter" | "year" = "month",
  ): LeadAnalytics {
    const leads = Array.from(this.leads.values());
    const now = new Date();
    const timeframeMs = this.getTimeframeMs(timeframe);
    const filteredLeads = leads.filter(
      (lead) => now.getTime() - lead.createdAt.getTime() <= timeframeMs,
    );

    const qualifiedLeads = filteredLeads.filter((lead) =>
      ["hot", "warm"].includes(lead.quality),
    );

    const sourceBreakdown = this.getSourceBreakdown(filteredLeads);
    const qualityDistribution = this.getQualityDistribution(filteredLeads);
    const monthlyTrends = this.getMonthlyTrends(leads);
    const topSources = this.getTopSources(filteredLeads);

    return {
      totalLeads: filteredLeads.length,
      qualifiedLeads: qualifiedLeads.length,
      conversionRate:
        filteredLeads.length > 0
          ? (qualifiedLeads.length / filteredLeads.length) * 100
          : 0,
      averageScore:
        filteredLeads.reduce((sum, lead) => sum + lead.score, 0) /
          filteredLeads.length || 0,
      sourceBreakdown,
      qualityDistribution,
      monthlyTrends,
      topSources,
    };
  }

  /**
   * Get lead by ID
   */
  getLead(leadId: string): Lead | undefined {
    return this.leads.get(leadId);
  }

  /**
   * Search leads by criteria
   */
  searchLeads(criteria: {
    source?: LeadSource;
    quality?: LeadQuality;
    status?: LeadStatus;
    minScore?: number;
    maxScore?: number;
  }): Lead[] {
    return Array.from(this.leads.values()).filter((lead) => {
      if (criteria.source && lead.source !== criteria.source) return false;
      if (criteria.quality && lead.quality !== criteria.quality) return false;
      if (criteria.status && lead.status !== criteria.status) return false;
      if (criteria.minScore && lead.score < criteria.minScore) return false;
      if (criteria.maxScore && lead.score > criteria.maxScore) return false;
      return true;
    });
  }

  // Helper methods
  private generateLeadId(): string {
    return `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTouchPointId(): string {
    return `tp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isCompanyEmail(email: string): boolean {
    const personalDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "icloud.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? !personalDomains.includes(domain) : false;
  }

  private getDefaultMetadata(): LeadMetadata {
    return {
      userAgent: navigator.userAgent,
      ipAddress: "unknown",
      device: {
        type: this.getDeviceType(),
        os: this.getOS(),
        browser: this.getBrowser(),
      },
      sessionData: {
        duration: 0,
        pageViews: 1,
        bounceRate: 0,
        engagementScore: 0,
      },
    };
  }

  private getDeviceType(): "desktop" | "mobile" | "tablet" {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return "tablet";
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent,
      )
    )
      return "mobile";
    return "desktop";
  }

  private getOS(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iOS")) return "iOS";
    return "Unknown";
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
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
      case "year":
        return 365 * day;
      default:
        return 30 * day;
    }
  }

  private getSourceBreakdown(leads: Lead[]): Record<LeadSource, number> {
    const breakdown: Record<LeadSource, number> = {} as Record<
      LeadSource,
      number
    >;
    leads.forEach((lead) => {
      breakdown[lead.source] = (breakdown[lead.source] || 0) + 1;
    });
    return breakdown;
  }

  private getQualityDistribution(leads: Lead[]): Record<LeadQuality, number> {
    const distribution: Record<LeadQuality, number> = {} as Record<
      LeadQuality,
      number
    >;
    leads.forEach((lead) => {
      distribution[lead.quality] = (distribution[lead.quality] || 0) + 1;
    });
    return distribution;
  }

  private getMonthlyTrends(leads: Lead[]): Array<{
    month: string;
    leads: number;
    qualified: number;
    conversionRate: number;
  }> {
    const monthlyData: Record<string, { leads: number; qualified: number }> =
      {};

    leads.forEach((lead) => {
      const month = lead.createdAt.toISOString().substr(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { leads: 0, qualified: 0 };
      }
      monthlyData[month].leads++;
      if (["hot", "warm"].includes(lead.quality)) {
        monthlyData[month].qualified++;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        leads: data.leads,
        qualified: data.qualified,
        conversionRate:
          data.leads > 0 ? (data.qualified / data.leads) * 100 : 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private getTopSources(leads: Lead[]): Array<{
    source: LeadSource;
    leads: number;
    conversionRate: number;
    averageScore: number;
  }> {
    const sourceData: Record<LeadSource, { leads: Lead[]; qualified: number }> =
      {} as any;

    leads.forEach((lead) => {
      if (!sourceData[lead.source]) {
        sourceData[lead.source] = { leads: [], qualified: 0 };
      }
      sourceData[lead.source].leads.push(lead);
      if (["hot", "warm"].includes(lead.quality)) {
        sourceData[lead.source].qualified++;
      }
    });

    return Object.entries(sourceData)
      .map(([source, data]) => ({
        source: source as LeadSource,
        leads: data.leads.length,
        conversionRate:
          data.leads.length > 0
            ? (data.qualified / data.leads.length) * 100
            : 0,
        averageScore:
          data.leads.reduce((sum, lead) => sum + lead.score, 0) /
          data.leads.length,
      }))
      .sort((a, b) => b.leads - a.leads);
  }

  private async trackEvent(
    eventName: string,
    data: Record<string, any>,
  ): Promise<void> {
    // Integration with analytics service
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", eventName, data);
    }

    // Log for debugging
    console.log(`Lead Tracking Event: ${eventName}`, data);
  }
}

// Singleton instance
export const leadTrackingService = new LeadTrackingService();

// Utility functions for easy integration
export const trackLead = (data: Partial<Lead>) =>
  leadTrackingService.createLead(data);
export const addLeadTouchPoint = (
  leadId: string,
  touchpoint: Omit<TouchPoint, "id" | "score">,
) => leadTrackingService.addTouchPoint(leadId, touchpoint);
export const updateLeadStatus = (leadId: string, status: LeadStatus) =>
  leadTrackingService.updateLeadStatus(leadId, status);
export const getLeadAnalytics = (
  timeframe?: "week" | "month" | "quarter" | "year",
) => leadTrackingService.getLeadAnalytics(timeframe);
export const searchLeads = (
  criteria: Parameters<typeof leadTrackingService.searchLeads>[0],
) => leadTrackingService.searchLeads(criteria);

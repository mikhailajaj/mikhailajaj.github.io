/**
 * Enhanced Data Types for Portfolio Architecture
 * Extends base types with domain-specific implementations
 */

import {
  BaseEntity,
  BaseContent,
  EntityMetadata,
  TechnicalDomain,
  TechnologyCategory,
  ProficiencyLevel,
  ProjectStatus,
  CompanySize,
  Currency,
  PricingType,
  ContactMethod,
  UrgencyLevel,
  BlogCategory,
  ContentFormat,
  Result,
  Optional,
  RequiredFields,
  Nullable,
  Maybe,
} from "@/lib/utils/base-types";

// ============================================================================
// ENHANCED PROJECT TYPES
// ============================================================================

/**
 * Technology interface with enhanced metadata
 */
export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
  icon?: string;
  description?: string;
  certifications?: string[];
  relatedTechnologies?: string[];
  lastUsed?: Date;
  metadata?: EntityMetadata;
}

/**
 * Project impact metrics with quantified business value
 */
export interface ProjectImpact {
  metrics: string[];
  roi?: string;
  performance?: string;
  userSatisfaction?: string;
  businessValue?: string;
  costSavings?: string;
  revenueIncrease?: string;
  efficiencyGains?: string;
  qualityImprovements?: string;
  timeToMarket?: string;
}

/**
 * Enhanced client information
 */
export interface ClientInfo {
  id: string;
  name: string;
  industry: string;
  size: CompanySize;
  location?: string;
  website?: string;
  logo?: string;
  contactPerson?: {
    name: string;
    role: string;
    email?: string;
    linkedin?: string;
  };
  testimonial?: {
    content: string;
    rating: number;
    date: Date;
    verified: boolean;
  };
  projectHistory?: string[];
  relationshipStatus: "active" | "completed" | "ongoing" | "potential";
}

/**
 * Enhanced image interface with optimization metadata
 */
export interface Image {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  format?: "jpg" | "png" | "webp" | "svg";
  optimized?: boolean;
  placeholder?: string;
  metadata?: {
    size: number;
    lastModified: Date;
    photographer?: string;
    license?: string;
  };
}

/**
 * Project timeline with milestones
 */
export interface ProjectTimeline {
  startDate: Date;
  endDate?: Date;
  estimatedDuration: string;
  actualDuration?: string;
  milestones: {
    id: string;
    title: string;
    description: string;
    targetDate: Date;
    completedDate?: Date;
    status: "pending" | "in-progress" | "completed" | "delayed";
  }[];
}

/**
 * Enhanced project interface
 */
export interface Project extends BaseContent {
  domain: TechnicalDomain;
  problem: string;
  solution: string;
  impact: ProjectImpact;
  techStack: Technology[];
  timeline: ProjectTimeline;
  status: ProjectStatus;
  client?: ClientInfo;
  gallery: Image[];
  liveDemo?: string;
  codeRepo?: string;
  caseStudyUrl?: string;
  documentation?: string;
  featured: boolean;
  tags: string[];
  complexity: "low" | "medium" | "high" | "enterprise";
  teamSize?: number;
  budget?: {
    range: string;
    currency: Currency;
  };
  challenges?: string[];
  lessons?: string[];
  futureEnhancements?: string[];
}

// ============================================================================
// ENHANCED SERVICE TYPES
// ============================================================================

/**
 * Service pricing with detailed breakdown
 */
export interface ServicePricing {
  type: PricingType;
  range: string;
  currency: Currency;
  description?: string;
  breakdown?: {
    item: string;
    cost: string;
    description?: string;
  }[];
  discounts?: {
    condition: string;
    percentage: number;
    description: string;
  }[];
}

/**
 * Service deliverable with acceptance criteria
 */
export interface ServiceDeliverable {
  id: string;
  name: string;
  description: string;
  timeline: string;
  included: boolean;
  acceptanceCriteria?: string[];
  dependencies?: string[];
  priority: "must-have" | "should-have" | "could-have" | "wont-have";
}

/**
 * Enhanced service testimonial
 */
export interface ServiceTestimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  content: string;
  rating: number;
  date: Date;
  projectId?: string;
  verified: boolean;
  featured: boolean;
  tags?: string[];
}

/**
 * Service process step
 */
export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
  duration: string;
  deliverables?: string[];
  tools?: string[];
  clientInvolvement: "low" | "medium" | "high";
}

/**
 * Enhanced service interface
 */
export interface Service extends BaseContent {
  domain: TechnicalDomain;
  shortDescription: string;
  capabilities: string[];
  deliverables: ServiceDeliverable[];
  timeline: string;
  pricing?: ServicePricing;
  technologies: Technology[];
  relatedProjects: string[];
  testimonials: ServiceTestimonial[];
  featured: boolean;
  available: boolean;
  ctaText: string;
  ctaUrl: string;
  benefits: string[];
  process: ServiceProcessStep[];
  prerequisites?: string[];
  guarantees?: string[];
  supportOptions?: {
    type: string;
    duration: string;
    description: string;
  }[];
}

// ============================================================================
// ENHANCED BLOG TYPES
// ============================================================================

/**
 * Blog author with social presence
 */
export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role?: string;
  expertise?: TechnicalDomain[];
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  stats?: {
    postsCount: number;
    totalViews: number;
    averageRating: number;
  };
}

/**
 * SEO metadata for blog posts
 */
export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
  focusKeyword?: string;
  readabilityScore?: number;
}

/**
 * Table of contents entry
 */
export interface TableOfContentsEntry {
  id: string;
  title: string;
  level: number;
  anchor: string;
  children?: TableOfContentsEntry[];
}

/**
 * Blog post analytics
 */
export interface BlogAnalytics {
  views: number;
  uniqueViews: number;
  averageTimeOnPage: number;
  bounceRate: number;
  socialShares: {
    platform: string;
    count: number;
  }[];
  comments: number;
  rating?: {
    average: number;
    count: number;
  };
}

/**
 * Enhanced blog post interface
 */
export interface BlogPost extends BaseContent {
  content: string;
  excerpt: string;
  category: BlogCategory;
  format: ContentFormat;
  domains: TechnicalDomain[];
  tags: string[];
  author: BlogAuthor;
  publishedAt: Date;
  readingTime: number;
  featured: boolean;
  draft: boolean;
  seo: BlogSEO;
  coverImage?: Image;
  tableOfContents?: TableOfContentsEntry[];
  relatedPosts?: string[];
  series?: {
    name: string;
    part: number;
    totalParts: number;
  };
  analytics?: BlogAnalytics;
  lastReviewed?: Date;
  reviewedBy?: string;
}

// ============================================================================
// TESTIMONIAL TYPES
// ============================================================================

/**
 * Enhanced testimonial interface
 */
export interface Testimonial extends BaseEntity {
  client: string;
  role: string;
  company: string;
  testimonial: string;
  project: string;
  projectId?: string;
  rating: number;
  image?: string;
  date: Date;
  featured: boolean;
  category: TechnicalDomain;
  verified: boolean;
  source: "direct" | "linkedin" | "email" | "survey" | "interview";
  permissions: {
    useFullName: boolean;
    useCompanyName: boolean;
    useImage: boolean;
    useForMarketing: boolean;
  };
  impact?: {
    metric: string;
    value: string;
    description: string;
  }[];
}

// ============================================================================
// GRID ITEM TYPES
// ============================================================================

/**
 * Grid item for UI components
 */
export interface GridItem {
  id: number;
  title: string;
  description: string;
  className: string;
  imgClassName?: string;
  titleClassName?: string;
  img?: string;
  spareImg?: string;
  domain?: TechnicalDomain;
  interactive?: boolean;
  link?: string;
  metadata?: EntityMetadata;
}

// ============================================================================
// FILTER AND QUERY TYPES
// ============================================================================

/**
 * Project filter interface
 */
export interface ProjectFilter {
  domain?: TechnicalDomain;
  technology?: string;
  status?: ProjectStatus;
  featured?: boolean;
  tags?: string[];
  complexity?: Project["complexity"];
  clientSize?: CompanySize;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Service filter interface
 */
export interface ServiceFilter {
  domain?: TechnicalDomain;
  available?: boolean;
  featured?: boolean;
  priceRange?: {
    min: number;
    max: number;
    currency: Currency;
  };
}

/**
 * Blog filter interface
 */
export interface BlogFilter {
  category?: BlogCategory;
  domain?: TechnicalDomain;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Testimonial filter interface
 */
export interface TestimonialFilter {
  category?: TechnicalDomain;
  featured?: boolean;
  verified?: boolean;
  rating?: {
    min: number;
    max: number;
  };
}

// ============================================================================
// SORT OPTIONS
// ============================================================================

/**
 * Project sort options
 */
export interface ProjectSortOptions {
  field: "createdAt" | "updatedAt" | "title" | "timeline" | "rating";
  direction: "asc" | "desc";
}

/**
 * Blog sort options
 */
export interface BlogSortOptions {
  field: "publishedAt" | "updatedAt" | "title" | "readingTime" | "views";
  direction: "asc" | "desc";
}

/**
 * Service sort options
 */
export interface ServiceSortOptions {
  field: "title" | "domain" | "pricing" | "featured";
  direction: "asc" | "desc";
}

// ============================================================================
// INQUIRY AND CONTACT TYPES
// ============================================================================

/**
 * Service inquiry interface
 */
export interface ServiceInquiry extends BaseEntity {
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientCompany?: string;
  projectDescription: string;
  budget?: string;
  timeline?: string;
  requirements: string[];
  contactMethod: ContactMethod;
  urgency: UrgencyLevel;
  source: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal-sent"
    | "closed-won"
    | "closed-lost";
  notes?: string[];
  followUpDate?: Date;
}

/**
 * Contact form submission
 */
export interface ContactSubmission extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  source: string;
  urgency: UrgencyLevel;
  preferredContact: ContactMethod;
  status: "new" | "responded" | "closed";
  responseTime?: number; // in hours
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Portfolio analytics interface
 */
export interface PortfolioAnalytics {
  pageViews: {
    total: number;
    unique: number;
    byPage: Record<string, number>;
  };
  userEngagement: {
    averageSessionDuration: number;
    bounceRate: number;
    pagesPerSession: number;
  };
  conversions: {
    contactForms: number;
    serviceInquiries: number;
    downloadRequests: number;
  };
  topContent: {
    projects: string[];
    blogPosts: string[];
    services: string[];
  };
  demographics: {
    countries: Record<string, number>;
    devices: Record<string, number>;
    referrers: Record<string, number>;
  };
}

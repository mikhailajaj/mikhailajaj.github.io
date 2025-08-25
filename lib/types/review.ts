/**
 * Review System Type Definitions
 * 
 * Core TypeScript interfaces and types for the review system
 */

// Review status enumeration
export type ReviewStatus = 'pending' | 'verified' | 'approved' | 'rejected' | 'archived';

// Reviewer relationship types
export type ReviewerRelationship = 'professor' | 'colleague' | 'supervisor' | 'collaborator' | 'client';

// Review source tracking
export type ReviewSource = 'direct' | 'linkedin' | 'email' | 'referral';

// Admin action types
export type AdminAction = 'approve' | 'reject' | 'feature' | 'unfeature' | 'archive' | 'edit';

/**
 * Core Review Interface
 * 
 * Represents a complete review with all metadata
 */
export interface Review {
  id: string;
  status: ReviewStatus;
  
  // Reviewer information
  reviewer: ReviewerProfile;
  
  // Review content
  content: ReviewContent;
  
  // System metadata
  metadata: ReviewMetadata;
  
  // Administrative fields
  admin: AdminFields;
}

/**
 * Reviewer Profile Information
 */
export interface ReviewerProfile {
  name: string;
  email: string;
  title?: string;
  organization?: string;
  relationship: ReviewerRelationship;
  linkedinUrl?: string;
  website?: string;
  verified: boolean;
  avatar?: string;
}

/**
 * Review Content Structure
 */
export interface ReviewContent {
  rating: number; // 1-5 scale
  testimonial: string;
  projectAssociation?: string;
  skills?: string[];
  recommendation: boolean;
  highlights?: string[]; // Key strengths mentioned
  workPeriod?: {
    start: string;
    end?: string;
  };
}

/**
 * System Metadata
 */
export interface ReviewMetadata {
  submittedAt: string;
  verifiedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  ipAddress: string;
  userAgent: string;
  source: ReviewSource;
  language: string;
  timezone: string;
}

/**
 * Administrative Fields
 */
export interface AdminFields {
  notes?: string;
  featured: boolean;
  displayOrder?: number;
  moderatedBy?: string;
  moderatedAt?: string;
  rejectionReason?: string;
  tags?: string[];
  internalRating?: number; // Admin quality rating
}

/**
 * Verification Token Structure
 */
export interface VerificationToken {
  token: string;
  email: string;
  reviewId: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
  attempts: number;
}

/**
 * Review Submission Form Data
 */
export interface ReviewSubmissionData {
  // Reviewer info
  name: string;
  email: string;
  title?: string;
  organization?: string;
  relationship: ReviewerRelationship;
  linkedinUrl?: string;
  
  // Review content
  rating: number;
  testimonial: string;
  projectAssociation?: string;
  skills?: string[];
  recommendation: boolean;
  
  // Optional fields
  workPeriod?: {
    start: string;
    end?: string;
  };
  
  // Security fields (hidden)
  honeypot?: string;
  timestamp?: number;
}

/**
 * Admin Action Log Entry
 */
export interface AdminActionLog {
  id: string;
  reviewId: string;
  action: AdminAction;
  performedBy: string;
  performedAt: string;
  previousState?: Partial<Review>;
  newState?: Partial<Review>;
  notes?: string;
  ipAddress: string;
}

/**
 * Review Statistics
 */
export interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
  verified: number;
  rejected: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  relationshipBreakdown: Record<ReviewerRelationship, number>;
  monthlySubmissions: Array<{
    month: string;
    count: number;
  }>;
}

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ReviewSubmissionResponse extends ApiResponse {
  data?: {
    reviewId: string;
    verificationSent: boolean;
    estimatedApprovalTime: string;
  };
}

export interface ReviewVerificationResponse extends ApiResponse {
  data?: {
    reviewId: string;
    verified: boolean;
    status: ReviewStatus;
  };
}

/**
 * Configuration Types
 */
export interface ReviewSystemConfig {
  maxReviewsPerEmail: number;
  verificationTokenExpiry: number; // hours
  maxTestimonialLength: number;
  minTestimonialLength: number;
  allowedDomains: string[];
  rateLimits: {
    submissionWindow: number; // milliseconds
    maxSubmissions: number;
    verificationWindow: number;
    maxVerificationAttempts: number;
  };
  email: {
    fromAddress: string;
    replyToAddress: string;
    templates: {
      verification: string;
      approved: string;
      rejected: string;
    };
  };
}

/**
 * File Storage Types
 */
export interface ReviewFileMetadata {
  id: string;
  filename: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  size: number;
  checksum: string;
}

export interface StorageIndex {
  reviews: ReviewFileMetadata[];
  lastUpdated: string;
  version: string;
}

/**
 * Error Types
 */
export class ReviewSystemError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ReviewSystemError';
  }
}

export class ValidationError extends ReviewSystemError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends ReviewSystemError {
  constructor(message: string, public retryAfter?: number) {
    super(message, 'RATE_LIMIT_ERROR', 429);
    this.name = 'RateLimitError';
  }
}

export class VerificationError extends ReviewSystemError {
  constructor(message: string) {
    super(message, 'VERIFICATION_ERROR', 400);
    this.name = 'VerificationError';
  }
}

/**
 * Utility Types
 */
export type ReviewWithoutId = Omit<Review, 'id'>;
export type ReviewUpdate = Partial<Pick<Review, 'content' | 'admin'>>;
export interface PublicReview {
  id: string;
  reviewer: Omit<ReviewerProfile, 'email'>;
  content: ReviewContent;
  metadata: Pick<ReviewMetadata, 'approvedAt' | 'source'>;
}

/**
 * Form Validation Types
 */
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: FormErrors;
  touched: Record<string, boolean>;
}
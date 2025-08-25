/**
 * Review System Validation Schemas
 * 
 * Zod schemas for validating review system data
 */

import { z } from 'zod';
import type { ReviewerRelationship, ReviewSource, ReviewStatus, AdminAction } from '@/lib/types/review';

// Constants for validation
const MIN_TESTIMONIAL_LENGTH = 50;
const MAX_TESTIMONIAL_LENGTH = 2000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MAX_SKILLS = 10;
const MAX_NAME_LENGTH = 100;
const MAX_TITLE_LENGTH = 150;
const MAX_ORGANIZATION_LENGTH = 200;

// Email domain validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LINKEDIN_URL_REGEX = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;

// Trusted domain patterns
const TRUSTED_DOMAINS = [
  /\.edu$/,           // Educational institutions
  /\.ac\.uk$/,        // UK academic institutions
  /\.edu\.au$/,       // Australian educational institutions
  /\.org$/,           // Non-profit organizations
  // Add more patterns as needed
];

/**
 * Reviewer Relationship Schema
 */
export const reviewerRelationshipSchema = z.enum([
  'professor',
  'colleague', 
  'supervisor',
  'collaborator',
  'client'
] as const);

/**
 * Review Source Schema
 */
export const reviewSourceSchema = z.enum([
  'direct',
  'linkedin',
  'email',
  'referral'
] as const);

/**
 * Review Status Schema
 */
export const reviewStatusSchema = z.enum([
  'pending',
  'verified',
  'approved',
  'rejected',
  'archived'
] as const);

/**
 * Admin Action Schema
 */
export const adminActionSchema = z.enum([
  'approve',
  'reject',
  'feature',
  'unfeature',
  'archive',
  'edit'
] as const);

/**
 * Email Validation with Domain Checking
 */
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(254, 'Email must not exceed 254 characters')
  .refine((email) => EMAIL_REGEX.test(email), {
    message: 'Please enter a valid email format'
  });

/**
 * Trusted Domain Email Validation
 */
export const trustedEmailSchema = emailSchema.refine(
  (email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    
    // Check against trusted domain patterns
    return TRUSTED_DOMAINS.some(pattern => pattern.test(domain));
  },
  {
    message: 'Please use an institutional or organizational email address'
  }
);

/**
 * LinkedIn URL Validation
 */
export const linkedinUrlSchema = z
  .string()
  .optional()
  .refine(
    (url) => !url || LINKEDIN_URL_REGEX.test(url),
    {
      message: 'Please enter a valid LinkedIn profile URL'
    }
  );

/**
 * Work Period Schema
 */
export const workPeriodSchema = z.object({
  start: z.string().min(1, 'Start date is required'),
  end: z.string().optional()
}).refine(
  (data) => {
    if (!data.end) return true;
    return new Date(data.start) <= new Date(data.end);
  },
  {
    message: 'End date must be after start date',
    path: ['end']
  }
);

/**
 * Reviewer Profile Schema
 */
export const reviewerProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(MAX_NAME_LENGTH, `Name must not exceed ${MAX_NAME_LENGTH} characters`)
    .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name contains invalid characters'),
  
  email: emailSchema,
  
  title: z
    .string()
    .max(MAX_TITLE_LENGTH, `Title must not exceed ${MAX_TITLE_LENGTH} characters`)
    .optional(),
  
  organization: z
    .string()
    .max(MAX_ORGANIZATION_LENGTH, `Organization must not exceed ${MAX_ORGANIZATION_LENGTH} characters`)
    .optional(),
  
  relationship: reviewerRelationshipSchema,
  
  linkedinUrl: linkedinUrlSchema,
  
  website: z
    .string()
    .url('Please enter a valid website URL')
    .optional(),
  
  verified: z.boolean().default(false),
  
  avatar: z.string().optional()
});

/**
 * Review Content Schema
 */
export const reviewContentSchema = z.object({
  rating: z
    .number()
    .min(MIN_RATING, `Rating must be at least ${MIN_RATING}`)
    .max(MAX_RATING, `Rating must not exceed ${MAX_RATING}`)
    .int('Rating must be a whole number'),
  
  testimonial: z
    .string()
    .min(MIN_TESTIMONIAL_LENGTH, `Testimonial must be at least ${MIN_TESTIMONIAL_LENGTH} characters`)
    .max(MAX_TESTIMONIAL_LENGTH, `Testimonial must not exceed ${MAX_TESTIMONIAL_LENGTH} characters`)
    .refine(
      (text) => text.trim().length >= MIN_TESTIMONIAL_LENGTH,
      'Testimonial must contain meaningful content'
    ),
  
  projectAssociation: z
    .string()
    .max(200, 'Project association must not exceed 200 characters')
    .optional(),
  
  skills: z
    .array(z.string().max(50, 'Skill name too long'))
    .max(MAX_SKILLS, `Maximum ${MAX_SKILLS} skills allowed`)
    .optional(),
  
  recommendation: z.boolean(),
  
  highlights: z
    .array(z.string().max(100, 'Highlight too long'))
    .max(5, 'Maximum 5 highlights allowed')
    .optional(),
  
  workPeriod: workPeriodSchema.optional()
});

/**
 * Review Submission Schema
 */
export const reviewSubmissionSchema = z.object({
  // Reviewer information
  name: reviewerProfileSchema.shape.name,
  email: reviewerProfileSchema.shape.email,
  title: reviewerProfileSchema.shape.title,
  organization: reviewerProfileSchema.shape.organization,
  relationship: reviewerProfileSchema.shape.relationship,
  linkedinUrl: reviewerProfileSchema.shape.linkedinUrl,
  
  // Review content
  rating: reviewContentSchema.shape.rating,
  testimonial: reviewContentSchema.shape.testimonial,
  projectAssociation: reviewContentSchema.shape.projectAssociation,
  skills: reviewContentSchema.shape.skills,
  recommendation: reviewContentSchema.shape.recommendation,
  workPeriod: reviewContentSchema.shape.workPeriod,
  
  // Security fields
  honeypot: z.string().max(0, 'Security validation failed').optional(),
  timestamp: z.number().optional()
});

/**
 * Trusted Domain Submission Schema (Stricter validation)
 */
export const trustedSubmissionSchema = reviewSubmissionSchema.extend({
  email: trustedEmailSchema
});

/**
 * Verification Token Schema
 */
export const verificationTokenSchema = z.object({
  token: z.string().min(32, 'Invalid token format'),
  email: emailSchema,
  reviewId: z.string().min(1, 'Review ID is required'),
  createdAt: z.string(),
  expiresAt: z.string(),
  used: z.boolean().default(false),
  attempts: z.number().min(0).default(0)
});

/**
 * Admin Action Log Schema
 */
export const adminActionLogSchema = z.object({
  id: z.string().min(1),
  reviewId: z.string().min(1),
  action: adminActionSchema,
  performedBy: z.string().min(1),
  performedAt: z.string(),
  notes: z.string().optional(),
  ipAddress: z.string().ip()
});

/**
 * Review Update Schema (for admin edits)
 */
export const reviewUpdateSchema = z.object({
  content: reviewContentSchema.partial().optional(),
  admin: z.object({
    notes: z.string().optional(),
    featured: z.boolean().optional(),
    displayOrder: z.number().optional(),
    tags: z.array(z.string()).optional(),
    internalRating: z.number().min(1).max(5).optional()
  }).optional()
});

/**
 * API Request Validation Schemas
 */
export const submitReviewRequestSchema = z.object({
  body: reviewSubmissionSchema
});

export const verifyReviewRequestSchema = z.object({
  query: z.object({
    token: z.string().min(32, 'Invalid token'),
    email: emailSchema.optional()
  })
});

export const adminActionRequestSchema = z.object({
  body: z.object({
    action: adminActionSchema,
    reviewId: z.string().min(1),
    notes: z.string().optional()
  })
});

/**
 * Configuration Schema
 */
export const reviewSystemConfigSchema = z.object({
  maxReviewsPerEmail: z.number().min(1).max(10),
  verificationTokenExpiry: z.number().min(1).max(168), // 1 hour to 1 week
  maxTestimonialLength: z.number().min(100).max(5000),
  minTestimonialLength: z.number().min(10).max(500),
  allowedDomains: z.array(z.string()),
  rateLimits: z.object({
    submissionWindow: z.number().min(60000), // Minimum 1 minute
    maxSubmissions: z.number().min(1).max(10),
    verificationWindow: z.number().min(60000),
    maxVerificationAttempts: z.number().min(1).max(10)
  }),
  email: z.object({
    fromAddress: emailSchema,
    replyToAddress: emailSchema,
    templates: z.object({
      verification: z.string().min(1),
      approved: z.string().min(1),
      rejected: z.string().min(1)
    })
  })
});

/**
 * Validation Helper Functions
 */

/**
 * Validate email domain against trusted patterns
 */
export function validateTrustedDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  
  return TRUSTED_DOMAINS.some(pattern => pattern.test(domain));
}

/**
 * Sanitize and validate testimonial content
 */
export function validateTestimonialContent(content: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  let sanitized = content.trim();
  
  // Check length
  if (sanitized.length < MIN_TESTIMONIAL_LENGTH) {
    errors.push(`Testimonial must be at least ${MIN_TESTIMONIAL_LENGTH} characters`);
  }
  
  if (sanitized.length > MAX_TESTIMONIAL_LENGTH) {
    errors.push(`Testimonial must not exceed ${MAX_TESTIMONIAL_LENGTH} characters`);
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /(.)\1{10,}/,  // Repeated characters
    /https?:\/\//i, // URLs (might be spam)
    /\$\d+/,       // Money amounts
    /\b(buy|sell|click|visit)\b/i // Commercial terms
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      errors.push('Content contains suspicious patterns');
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Rate limiting validation
 */
export function validateRateLimit(
  submissions: number,
  windowMs: number,
  maxSubmissions: number
): { allowed: boolean; retryAfter?: number } {
  if (submissions >= maxSubmissions) {
    return {
      allowed: false,
      retryAfter: Math.ceil(windowMs / 1000) // Convert to seconds
    };
  }
  
  return { allowed: true };
}

/**
 * Export all schemas for easy access
 */
export const schemas = {
  reviewerProfile: reviewerProfileSchema,
  reviewContent: reviewContentSchema,
  reviewSubmission: reviewSubmissionSchema,
  trustedSubmission: trustedSubmissionSchema,
  verificationToken: verificationTokenSchema,
  adminActionLog: adminActionLogSchema,
  reviewUpdate: reviewUpdateSchema,
  config: reviewSystemConfigSchema
} as const;
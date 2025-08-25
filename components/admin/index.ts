/**
 * Admin Components Index
 * 
 * Exports all admin interface components for the testimonial review system
 */

export { default as PendingReviews } from './PendingReviews';
export { default as ReviewManager } from './ReviewManager';
export { default as Analytics } from './Analytics';
export { default as AdminInterface } from './AdminInterface';

// Re-export types for convenience
export type { 
  Review, 
  ReviewStats, 
  AdminActionLog, 
  ApiResponse 
} from '@/lib/types/review';
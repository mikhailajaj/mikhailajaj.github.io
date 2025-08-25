/**
 * Tests for Static Review Data Access
 */

import { 
  getReviews, 
  getFeaturedReviews, 
  getReviewById, 
  getReviewStats,
  staticReviews 
} from '@/lib/data/reviews';

describe('Static Review Data Access', () => {
  describe('getReviews', () => {
    it('should return all reviews with default options', () => {
      const result = getReviews();
      
      expect(result.reviews).toHaveLength(3);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('should apply pagination correctly', () => {
      const result = getReviews({ limit: 2, offset: 0 });
      
      expect(result.reviews).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.hasMore).toBe(true);
      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should filter by minimum rating', () => {
      const result = getReviews({ minRating: 5 });
      
      expect(result.reviews).toHaveLength(2); // Only 5-star reviews
      expect(result.reviews.every(review => review.content.rating === 5)).toBe(true);
    });

    it('should filter by relationship', () => {
      const result = getReviews({ relationship: 'professor' });
      
      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].reviewer.relationship).toBe('professor');
    });

    it('should search in testimonial content', () => {
      const result = getReviews({ search: 'React' });
      
      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].content.testimonial.toLowerCase()).toContain('react');
    });

    it('should search in reviewer name', () => {
      const result = getReviews({ search: 'Sarah' });
      
      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].reviewer.name).toContain('Sarah');
    });

    it('should sort by rating descending', () => {
      const result = getReviews({ sortBy: 'rating', sortOrder: 'desc' });
      
      const ratings = result.reviews.map(r => r.content.rating);
      expect(ratings).toEqual([5, 5, 4]);
    });

    it('should sort by name ascending', () => {
      const result = getReviews({ sortBy: 'name', sortOrder: 'asc' });
      
      const names = result.reviews.map(r => r.reviewer.name);
      expect(names).toEqual(['Alex Chen', 'Dr. Sarah Johnson', 'Maria Rodriguez']);
    });

    it('should sort by approval date descending by default', () => {
      const result = getReviews();
      
      const dates = result.reviews.map(r => new Date(r.metadata.approvedAt!).getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i-1]).toBeGreaterThanOrEqual(dates[i]);
      }
    });
  });

  describe('getFeaturedReviews', () => {
    it('should return highest rated reviews as featured', () => {
      const featured = getFeaturedReviews(2);
      
      expect(featured).toHaveLength(2);
      expect(featured.every(review => review.content.rating >= 4)).toBe(true);
    });

    it('should respect the limit parameter', () => {
      const featured = getFeaturedReviews(1);
      
      expect(featured).toHaveLength(1);
    });
  });

  describe('getReviewById', () => {
    it('should return the correct review by ID', () => {
      const review = getReviewById('sample-review-1');
      
      expect(review).toBeDefined();
      expect(review?.id).toBe('sample-review-1');
      expect(review?.reviewer.name).toBe('Dr. Sarah Johnson');
    });

    it('should return undefined for non-existent ID', () => {
      const review = getReviewById('non-existent');
      
      expect(review).toBeUndefined();
    });
  });

  describe('getReviewStats', () => {
    it('should calculate correct statistics', () => {
      const stats = getReviewStats();
      
      expect(stats.total).toBe(3);
      expect(stats.averageRating).toBeCloseTo(4.7, 1); // (5+5+4)/3 = 4.67
      expect(stats.ratingDistribution[5]).toBe(2);
      expect(stats.ratingDistribution[4]).toBe(1);
      expect(stats.relationshipBreakdown.professor).toBe(1);
      expect(stats.relationshipBreakdown.colleague).toBe(1);
      expect(stats.relationshipBreakdown.client).toBe(1);
    });
  });

  describe('Complex filtering and sorting', () => {
    it('should combine multiple filters', () => {
      const result = getReviews({ 
        minRating: 4, 
        relationship: 'colleague',
        sortBy: 'rating',
        sortOrder: 'desc'
      });
      
      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].reviewer.relationship).toBe('colleague');
      expect(result.reviews[0].content.rating).toBeGreaterThanOrEqual(4);
    });

    it('should handle empty results gracefully', () => {
      const result = getReviews({ 
        minRating: 6 // No reviews have rating > 5
      });
      
      expect(result.reviews).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.pagination.hasMore).toBe(false);
    });

    it('should handle case-insensitive search', () => {
      const result = getReviews({ search: 'REACT' });
      
      expect(result.reviews).toHaveLength(1);
      expect(result.reviews[0].content.testimonial.toLowerCase()).toContain('react');
    });
  });
});
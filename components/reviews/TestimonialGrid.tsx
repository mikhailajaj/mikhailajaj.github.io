/**
 * TestimonialGrid Component
 * 
 * A flexible grid component for displaying testimonials with filtering,
 * pagination, and multiple layout options.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { MotionDiv } from '@/lib/motion-utils';
import { ReviewCard } from './ReviewCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Review, ReviewerRelationship } from '@/lib/types/review';

export interface TestimonialGridProps {
  /** Array of reviews to display */
  reviews: Review[];
  /** Layout variant for the grid */
  layout?: 'grid' | 'masonry' | 'list';
  /** Pagination configuration */
  pagination?: {
    enabled: boolean;
    itemsPerPage: number;
  };
  /** Filter configuration */
  filters?: {
    rating?: number;
    relationship?: ReviewerRelationship;
    featured?: boolean;
  };
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a review is clicked */
  onReviewClick?: (review: Review) => void;
}

/**
 * Filter Controls Component
 */
interface FilterControlsProps {
  filters: {
    rating?: number;
    relationship?: ReviewerRelationship;
    featured?: boolean;
  };
  onFiltersChange: (filters: any) => void;
  reviewCounts: {
    total: number;
    byRating: Record<number, number>;
    byRelationship: Record<ReviewerRelationship, number>;
    featured: number;
  };
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  reviewCounts
}) => {
  const relationships: ReviewerRelationship[] = ['professor', 'colleague', 'supervisor', 'collaborator', 'client'];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {/* Clear filters */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onFiltersChange({})}
          className="text-xs"
        >
          All ({reviewCounts.total})
        </Button>

        {/* Featured filter */}
        <Button
          variant={filters.featured ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({
            ...filters,
            featured: filters.featured ? undefined : true
          })}
          className="text-xs"
        >
          Featured ({reviewCounts.featured})
        </Button>
      </div>

      {/* Rating filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Filter by Rating</h4>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({
                ...filters,
                rating: filters.rating === rating ? undefined : rating
              })}
              className="text-xs"
              disabled={!reviewCounts.byRating[rating]}
            >
              {rating}★ ({reviewCounts.byRating[rating] || 0})
            </Button>
          ))}
        </div>
      </div>

      {/* Relationship filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Filter by Relationship</h4>
        <div className="flex flex-wrap gap-2">
          {relationships.map((relationship) => (
            <Button
              key={relationship}
              variant={filters.relationship === relationship ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({
                ...filters,
                relationship: filters.relationship === relationship ? undefined : relationship
              })}
              className="text-xs capitalize"
              disabled={!reviewCounts.byRelationship[relationship]}
            >
              {relationship} ({reviewCounts.byRelationship[relationship] || 0})
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Pagination Component
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-8">
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalItems} testimonials
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

/**
 * Loading Skeleton Component
 */
const LoadingSkeleton: React.FC<{ layout: 'grid' | 'masonry' | 'list'; count?: number }> = ({
  layout,
  count = 6
}) => {
  const skeletonClasses = cn(
    'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg',
    {
      'h-64': layout === 'grid',
      'h-48': layout === 'list',
    }
  );

  const gridClasses = cn({
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': layout === 'grid',
    'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6': layout === 'masonry',
    'space-y-4': layout === 'list'
  });

  return (
    <div className={gridClasses}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClasses} />
      ))}
    </div>
  );
};

/**
 * TestimonialGrid Component
 */
export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  reviews,
  layout = 'grid',
  pagination = { enabled: true, itemsPerPage: 9 },
  filters: initialFilters = {},
  loading = false,
  error,
  className,
  onReviewClick
}) => {
  const [currentFilters, setCurrentFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter reviews based on current filters
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      // Only show approved reviews
      if (review.status !== 'approved') return false;

      // Rating filter
      if (currentFilters.rating && review.content?.rating !== currentFilters.rating) {
        return false;
      }

      // Relationship filter
      if (currentFilters.relationship && review.reviewer?.relationship !== currentFilters.relationship) {
        return false;
      }

      // Featured filter
      if (currentFilters.featured && !review.admin?.featured) {
        return false;
      }

      return true;
    });
  }, [reviews, currentFilters]);

  // Calculate review counts for filters
  const reviewCounts = useMemo(() => {
    const approvedReviews = reviews.filter(r => r && r.status === 'approved' && r.content && typeof r.content.rating === 'number' && r.reviewer && (r.reviewer as any).relationship);

    return {
      total: approvedReviews.length,
      byRating: approvedReviews.reduce((acc, review) => {
        const rating = review?.content?.rating; if (typeof rating === 'number') { acc[rating] = (acc[rating] || 0) + 1; }
        return acc;
      }, {} as Record<number, number>),
      byRelationship: approvedReviews.reduce((acc, review) => {
        const rel = review?.reviewer?.relationship as ReviewerRelationship | undefined; if (rel) { acc[rel] = (acc[rel] || 0) + 1; }
        return acc;
      }, {} as Record<ReviewerRelationship, number>),
      featured: approvedReviews.filter(r => r.admin.featured).length
    };
  }, [reviews]);

  // Paginate filtered reviews
  const paginatedReviews = useMemo(() => {
    if (!pagination.enabled) return filteredReviews;

    const startIndex = (currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage, pagination]);

  const totalPages = Math.ceil(filteredReviews.length / pagination.itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [currentFilters]);

  // Grid layout classes
  const gridClasses = cn(
    {
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': layout === 'grid',
      'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6': layout === 'masonry',
      'space-y-6': layout === 'list'
    },
    className
  );

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold">Error Loading Testimonials</h3>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Filter Controls */}
      <FilterControls
        filters={currentFilters}
        onFiltersChange={setCurrentFilters}
        reviewCounts={reviewCounts}
      />

      {/* Loading State */}
      {loading && (
        <LoadingSkeleton layout={layout} count={pagination.itemsPerPage} />
      )}

      {/* Empty State */}
      {!loading && paginatedReviews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="text-lg font-semibold">No testimonials found</h3>
            <p className="text-sm mt-2">
              {Object.keys(currentFilters).length > 0
                ? 'Try adjusting your filters to see more results.'
                : 'No testimonials have been published yet.'
              }
            </p>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      {!loading && paginatedReviews.length > 0 && (
        <MotionDiv
          key={`grid-${currentPage}-${JSON.stringify(currentFilters)}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={gridClasses}
        >
          {paginatedReviews.map((review, index) => (
            <MotionDiv
              key={`review-${review.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={layout === 'masonry' ? 'break-inside-avoid' : ''}
            >
              <ReviewCard
                review={review}
                variant={review.admin.featured ? 'featured' : 'default'}
                onClick={onReviewClick ? () => onReviewClick(review) : undefined}
              />
            </MotionDiv>
          ))}
        </MotionDiv>
      )}

      {/* Pagination */}
      {!loading && pagination.enabled && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={filteredReviews.length}
        />
      )}
    </div>
  );
};

export default TestimonialGrid;
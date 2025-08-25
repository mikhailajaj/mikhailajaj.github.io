/**
 * PendingReviews Component
 * 
 * Displays list of reviews awaiting approval with search, filtering, and bulk actions
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { RatingDisplay } from '@/components/reviews/RatingDisplay';
import type { Review, ReviewerRelationship, ApiResponse } from '@/lib/types/review';
import { cn } from '@/lib/utils';
import { Search, Filter, CheckSquare, Square, Eye, Clock, User, Star } from 'lucide-react';

interface PendingReviewsProps {
  /** Initial pending reviews data */
  initialReviews?: Review[];
  /** Callback when review is selected for detailed view */
  onReviewSelect?: (review: Review) => void;
  /** Callback when bulk action is performed */
  onBulkAction?: (action: 'approve' | 'reject', reviewIds: string[]) => Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface PendingReviewsState {
  reviews: Review[];
  selectedReviews: Set<string>;
  searchQuery: string;
  relationshipFilter: ReviewerRelationship | 'all';
  ratingFilter: number | 'all';
  sortBy: 'newest' | 'oldest' | 'rating' | 'name';
  isLoading: boolean;
  error?: string;
}

/**
 * PendingReviews Component
 * 
 * Provides admin interface for managing reviews awaiting approval
 */
export const PendingReviews: React.FC<PendingReviewsProps> = ({
  initialReviews = [],
  onReviewSelect,
  onBulkAction,
  loading = false,
  className
}) => {
  const [state, setState] = useState<PendingReviewsState>({
    reviews: initialReviews,
    selectedReviews: new Set(),
    searchQuery: '',
    relationshipFilter: 'all',
    ratingFilter: 'all',
    sortBy: 'newest',
    isLoading: loading,
    error: undefined
  });

  // Fetch pending reviews on mount
  useEffect(() => {
    if (initialReviews.length === 0) {
      fetchPendingReviews();
    }
  }, []);

  /**
   * Fetch pending reviews from API
   */
  const fetchPendingReviews = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const response = await fetch('/api/reviews/admin?status=verified', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
        }
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setState(prev => ({
          ...prev,
          reviews: data.data.reviews || [],
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch reviews',
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Network error occurred',
        isLoading: false
      }));
    }
  };

  /**
   * Filter and sort reviews based on current state
   */
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = state.reviews.filter(review => {
      // Search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        const matchesSearch = 
          review.reviewer.name.toLowerCase().includes(query) ||
          review.reviewer.organization?.toLowerCase().includes(query) ||
          review.content.testimonial.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }

      // Relationship filter
      if (state.relationshipFilter !== 'all' && review.reviewer.relationship !== state.relationshipFilter) {
        return false;
      }

      // Rating filter
      if (state.ratingFilter !== 'all' && review.content.rating !== state.ratingFilter) {
        return false;
      }

      return true;
    });

    // Sort reviews
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'newest':
          return new Date(b.metadata.submittedAt).getTime() - new Date(a.metadata.submittedAt).getTime();
        case 'oldest':
          return new Date(a.metadata.submittedAt).getTime() - new Date(b.metadata.submittedAt).getTime();
        case 'rating':
          return b.content.rating - a.content.rating;
        case 'name':
          return a.reviewer.name.localeCompare(b.reviewer.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.reviews, state.searchQuery, state.relationshipFilter, state.ratingFilter, state.sortBy]);

  /**
   * Handle review selection toggle
   */
  const handleReviewToggle = (reviewId: string) => {
    setState(prev => {
      const newSelected = new Set(prev.selectedReviews);
      if (newSelected.has(reviewId)) {
        newSelected.delete(reviewId);
      } else {
        newSelected.add(reviewId);
      }
      return { ...prev, selectedReviews: newSelected };
    });
  };

  /**
   * Handle select all toggle
   */
  const handleSelectAll = () => {
    setState(prev => {
      const allSelected = prev.selectedReviews.size === filteredAndSortedReviews.length;
      const newSelected = allSelected 
        ? new Set<string>()
        : new Set(filteredAndSortedReviews.map(r => r.id));
      
      return { ...prev, selectedReviews: newSelected };
    });
  };

  /**
   * Handle bulk action
   */
  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (state.selectedReviews.size === 0 || !onBulkAction) return;
    
    try {
      await onBulkAction(action, Array.from(state.selectedReviews));
      
      // Refresh reviews after bulk action
      await fetchPendingReviews();
      
      // Clear selection
      setState(prev => ({ ...prev, selectedReviews: new Set() }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to ${action} selected reviews`
      }));
    }
  };

  /**
   * Get relationship badge variant
   */
  const getRelationshipBadgeVariant = (relationship: ReviewerRelationship) => {
    const variants = {
      professor: 'default',
      colleague: 'secondary',
      supervisor: 'outline',
      collaborator: 'secondary',
      client: 'default'
    } as const;
    
    return variants[relationship] || 'secondary';
  };

  const allSelected = state.selectedReviews.size === filteredAndSortedReviews.length && filteredAndSortedReviews.length > 0;
  const someSelected = state.selectedReviews.size > 0 && state.selectedReviews.size < filteredAndSortedReviews.length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Reviews ({filteredAndSortedReviews.length})
          </CardTitle>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchPendingReviews}
            disabled={state.isLoading}
          >
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="pl-10"
            />
          </div>

          {/* Relationship Filter */}
          <select
            value={state.relationshipFilter}
            onChange={(e) => setState(prev => ({ 
              ...prev, 
              relationshipFilter: e.target.value as ReviewerRelationship | 'all' 
            }))}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Relationships</option>
            <option value="professor">Professor</option>
            <option value="colleague">Colleague</option>
            <option value="supervisor">Supervisor</option>
            <option value="collaborator">Collaborator</option>
            <option value="client">Client</option>
          </select>

          {/* Rating Filter */}
          <select
            value={state.ratingFilter}
            onChange={(e) => setState(prev => ({ 
              ...prev, 
              ratingFilter: e.target.value === 'all' ? 'all' : parseInt(e.target.value) 
            }))}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Sort */}
          <select
            value={state.sortBy}
            onChange={(e) => setState(prev => ({ 
              ...prev, 
              sortBy: e.target.value as typeof state.sortBy 
            }))}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rating</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {filteredAndSortedReviews.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                {allSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : someSelected ? (
                  <Square className="h-4 w-4 opacity-50" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                {allSelected ? 'Deselect All' : 'Select All'}
              </Button>
              
              {state.selectedReviews.size > 0 && (
                <span className="text-sm text-muted-foreground">
                  {state.selectedReviews.size} selected
                </span>
              )}
            </div>

            {state.selectedReviews.size > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleBulkAction('approve')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve Selected
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('reject')}
                >
                  Reject Selected
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {state.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {state.error}
          </div>
        )}

        {/* Loading State */}
        {state.isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="status" aria-label="Loading"></div>
          </div>
        )}

        {/* Reviews List */}
        {!state.isLoading && filteredAndSortedReviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {state.reviews.length === 0 ? 'No pending reviews' : 'No reviews match your filters'}
          </div>
        )}

        {!state.isLoading && filteredAndSortedReviews.length > 0 && (
          <div className="space-y-4">
            {filteredAndSortedReviews.map((review) => (
              <div key={review.id} className="relative">
                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReviewToggle(review.id)}
                    className="h-6 w-6 p-0"
                  >
                    {state.selectedReviews.has(review.id) ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Review Card */}
                <div className="pl-12">
                  <ReviewCard
                    review={review}
                    variant="default"
                    showActions={false}
                    onClick={onReviewSelect ? () => onReviewSelect(review) : undefined}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  />
                  
                  {/* Additional Admin Info */}
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Submitted {new Date(review.metadata.submittedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {review.reviewer.email}
                    </span>
                    <Badge 
                      variant={getRelationshipBadgeVariant(review.reviewer.relationship)}
                      className="text-xs"
                    >
                      {review.reviewer.relationship}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <RatingDisplay rating={review.content.rating} size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingReviews;
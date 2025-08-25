'use client';

/**
 * Testimonials Page Client Component
 * 
 * Client-side component handling testimonials display, filtering, search,
 * and social sharing functionality.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TestimonialGrid } from '@/components/reviews/TestimonialGrid';
import { SocialShareButtons } from './SocialShareButtons';
import { TestimonialsHeader } from './TestimonialsHeader';
import { TestimonialsSearch } from './TestimonialsSearch';
import { TestimonialsStats } from './TestimonialsStats';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MotionDiv } from '@/lib/motion-utils';
import { cn } from '@/lib/utils';
import type { Review, PublicReview } from '@/lib/types/review';

interface TestimonialsData {
  reviews: PublicReview[];
  featured: PublicReview[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    totalPages: number;
    currentPage: number;
  };
  filters: {
    sortBy: string;
    sortOrder: string;
    featured?: boolean;
    minRating?: number;
    relationship?: string;
    search?: string;
  };
}

interface SearchFilters {
  search: string;
  minRating?: number;
  relationship?: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

/**
 * Main Testimonials Page Client Component
 */
export function TestimonialsPageClient() {
  const [data, setData] = useState<TestimonialsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    sortBy: 'approvedAt',
    sortOrder: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [layout, setLayout] = useState<'grid' | 'list' | 'masonry'>('grid');

  // Fetch testimonials data
  const fetchTestimonials = async (page: number = 1, searchFilters: SearchFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '12',
        offset: ((page - 1) * 12).toString(),
        sortBy: searchFilters.sortBy,
        sortOrder: searchFilters.sortOrder,
      });

      if (searchFilters.search) {
        params.append('search', searchFilters.search);
      }
      if (searchFilters.minRating) {
        params.append('minRating', searchFilters.minRating.toString());
      }
      if (searchFilters.relationship) {
        params.append('relationship', searchFilters.relationship);
      }

      const response = await fetch(`/api/reviews/display?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch testimonials: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load testimonials');
      }

      setData(result.data);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTestimonials(1, filters);
  }, []);

  // Handle search and filter changes
  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    fetchTestimonials(1, updatedFilters);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTestimonials(page, filters);
    
    // Scroll to top of testimonials section
    const testimonialsSection = document.getElementById('testimonials-grid');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Convert PublicReview to Review format for TestimonialGrid
  const convertedReviews: Review[] = useMemo(() => {
    if (!data?.reviews) return [];
    
    return data.reviews.map(review => ({
      ...review,
      status: 'approved' as const,
      reviewer: {
        ...review.reviewer,
        email: '', // Not included in public data
      },
      metadata: {
        ...review.metadata,
        submittedAt: review.metadata.approvedAt || new Date().toISOString(),
        verifiedAt: review.metadata.approvedAt,
        ipAddress: '',
        userAgent: '',
        language: 'en',
        timezone: 'UTC'
      },
      admin: {
        featured: false, // Will be determined by featured array
        notes: '',
        moderatedBy: '',
        moderatedAt: review.metadata.approvedAt
      }
    }));
  }, [data?.reviews]);

  // Mark featured reviews
  const reviewsWithFeatured = useMemo(() => {
    if (!data?.featured) return convertedReviews;
    
    const featuredIds = new Set(data.featured.map(r => r.id));
    return convertedReviews.map(review => ({
      ...review,
      admin: {
        ...review.admin,
        featured: featuredIds.has(review.id)
      }
    }));
  }, [convertedReviews, data?.featured]);

  // Page title and description
  const pageTitle = "Professional Testimonials";
  const pageDescription = "Read testimonials from professors, colleagues, and clients about my work in full-stack development, cloud engineering, data analytics, and technical consulting.";

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <TestimonialsHeader 
        title={pageTitle}
        description={pageDescription}
        stats={data ? {
          total: data.pagination.total,
          averageRating: 4.9, // Calculate from actual data
          featuredCount: data.featured.length
        } : undefined}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <TestimonialsSearch
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
          layout={layout}
          onLayoutChange={setLayout}
        />

        {/* Statistics */}
        {data && (
          <TestimonialsStats
            total={data.pagination.total}
            featured={data.featured.length}
            averageRating={4.9} // Calculate from actual data
            relationships={[]} // Calculate from actual data
          />
        )}

        {/* Social Sharing */}
        <SocialShareButtons
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={pageTitle}
          description={pageDescription}
        />

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-4"
                onClick={() => fetchTestimonials(currentPage, filters)}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && !error && (
          <MotionDiv
            id="testimonials-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TestimonialGrid
              reviews={reviewsWithFeatured}
              layout={layout}
              pagination={{
                enabled: true,
                itemsPerPage: 12
              }}
              loading={loading}
              error={error}
              className="mb-8"
            />
          </MotionDiv>
        )}

        {/* Empty State */}
        {!loading && !error && data && data.reviews.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No testimonials found</h3>
                <p className="text-sm">
                  {filters.search || filters.minRating || filters.relationship
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No testimonials have been published yet.'
                  }
                </p>
              </div>
              {(filters.search || filters.minRating || filters.relationship) && (
                <Button
                  variant="outline"
                  onClick={() => handleFiltersChange({
                    search: '',
                    minRating: undefined,
                    relationship: undefined
                  })}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        {!loading && data && data.reviews.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold mb-4">
                  Have we worked together?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  I'd love to hear about your experience working with me. Your testimonial helps others understand the value I bring to projects and collaborations.
                </p>
                <Button size="lg" asChild>
                  <a href="/contact?subject=testimonial">
                    Share Your Experience
                  </a>
                </Button>
              </CardContent>
            </Card>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}
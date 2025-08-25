/**
 * Static Review Data Access
 * 
 * Provides access to approved reviews for static builds
 */

import type { PublicReview } from '@/lib/types/review';

// Static review data - this would be generated at build time
// In a real implementation, this would be populated by a build script
export const staticReviews: PublicReview[] = [
  {
    id: 'sample-review-1',
    reviewer: {
      name: 'Dr. Sarah Johnson',
      title: 'Professor of Computer Science',
      organization: 'Tech University',
      relationship: 'professor',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Mikhail demonstrated exceptional technical skills and leadership during our collaborative research project on distributed systems. His ability to translate complex theoretical concepts into practical implementations was remarkable. I highly recommend him for any senior development role.',
      projectAssociation: 'Distributed Systems Research Project',
      skills: ['Distributed Systems', 'Leadership', 'Research', 'Problem Solving'],
      recommendation: true,
      highlights: ['Technical Excellence', 'Leadership Skills', 'Research Ability'],
      workPeriod: {
        start: '2023-01-01',
        end: '2023-12-31'
      }
    },
    metadata: {
      approvedAt: '2024-01-16T09:15:00Z',
      source: 'direct'
    }
  },
  {
    id: 'sample-review-2',
    reviewer: {
      name: 'Alex Chen',
      title: 'Senior Software Engineer',
      organization: 'TechCorp Solutions',
      relationship: 'colleague',
      linkedinUrl: 'https://linkedin.com/in/alexchen',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Working with Mikhail on the e-commerce platform was an incredible experience. His expertise in React and Node.js, combined with his attention to detail and collaborative approach, made our project a huge success. He consistently delivered high-quality code and was always willing to help team members.',
      projectAssociation: 'E-commerce Platform Development',
      skills: ['React', 'Node.js', 'Team Collaboration', 'Code Quality'],
      recommendation: true,
      highlights: ['Technical Expertise', 'Team Player', 'Quality Focus'],
      workPeriod: {
        start: '2023-06-01',
        end: '2023-11-30'
      }
    },
    metadata: {
      approvedAt: '2024-01-21T10:30:00Z',
      source: 'linkedin'
    }
  },
  {
    id: 'sample-review-3',
    reviewer: {
      name: 'Maria Rodriguez',
      title: 'Project Manager',
      organization: 'Digital Consulting Group',
      relationship: 'client',
      verified: true
    },
    content: {
      rating: 4,
      testimonial: 'Mikhail delivered our web application project on time and within budget. His communication skills and ability to understand business requirements were excellent. The final product exceeded our expectations in terms of both functionality and user experience.',
      projectAssociation: 'Corporate Web Application',
      skills: ['Project Management', 'Business Analysis', 'UX Design', 'Communication'],
      recommendation: true,
      highlights: ['On-time Delivery', 'Business Understanding', 'UX Excellence'],
      workPeriod: {
        start: '2023-03-01',
        end: '2023-08-31'
      }
    },
    metadata: {
      approvedAt: '2024-01-26T11:00:00Z',
      source: 'email'
    }
  }
];

/**
 * Interface for review query options
 */
export interface ReviewQueryOptions {
  limit?: number;
  offset?: number;
  sortBy?: 'approvedAt' | 'rating' | 'name' | 'organization';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  minRating?: number;
  relationship?: string;
  search?: string;
}

/**
 * Get reviews with filtering and pagination (static version)
 */
export function getReviews(options: ReviewQueryOptions = {}) {
  const {
    limit = 12,
    offset = 0,
    sortBy = 'approvedAt',
    sortOrder = 'desc',
    featured,
    minRating,
    relationship,
    search
  } = options;

  let filteredReviews = [...staticReviews];

  // Apply filters
  if (minRating) {
    filteredReviews = filteredReviews.filter(review => review.content.rating >= minRating);
  }

  if (relationship) {
    filteredReviews = filteredReviews.filter(review => review.reviewer.relationship === relationship);
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    filteredReviews = filteredReviews.filter(review => {
      const testimonial = review.content.testimonial.toLowerCase();
      const reviewerName = review.reviewer.name.toLowerCase();
      const organization = review.reviewer.organization?.toLowerCase() || '';
      
      return testimonial.includes(searchTerm) || 
             reviewerName.includes(searchTerm) || 
             organization.includes(searchTerm);
    });
  }

  // Apply sorting
  filteredReviews.sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'approvedAt':
        aValue = new Date(a.metadata.approvedAt || 0).getTime();
        bValue = new Date(b.metadata.approvedAt || 0).getTime();
        break;
      case 'rating':
        aValue = a.content.rating;
        bValue = b.content.rating;
        break;
      case 'name':
        aValue = a.reviewer.name.toLowerCase();
        bValue = b.reviewer.name.toLowerCase();
        break;
      case 'organization':
        aValue = (a.reviewer.organization || '').toLowerCase();
        bValue = (b.reviewer.organization || '').toLowerCase();
        break;
      default:
        aValue = new Date(a.metadata.approvedAt || 0).getTime();
        bValue = new Date(b.metadata.approvedAt || 0).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  const totalCount = filteredReviews.length;
  const paginatedReviews = filteredReviews.slice(offset, offset + limit);

  // Calculate pagination metadata
  const hasMore = offset + limit < totalCount;
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return {
    reviews: paginatedReviews,
    pagination: {
      total: totalCount,
      limit,
      offset,
      hasMore,
      totalPages,
      currentPage
    },
    filters: {
      sortBy,
      sortOrder,
      featured,
      minRating,
      relationship,
      search
    }
  };
}

/**
 * Get featured reviews
 */
export function getFeaturedReviews(limit: number = 4) {
  // For now, return the highest rated reviews as featured
  // In a real implementation, this would be based on admin-set featured flags
  const featured = [...staticReviews]
    .sort((a, b) => b.content.rating - a.content.rating)
    .slice(0, limit);

  return featured;
}

/**
 * Get review by ID
 */
export function getReviewById(id: string): PublicReview | undefined {
  return staticReviews.find(review => review.id === id);
}

/**
 * Get review statistics
 */
export function getReviewStats() {
  const totalReviews = staticReviews.length;
  const totalRating = staticReviews.reduce((sum, review) => sum + review.content.rating, 0);
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

  const ratingDistribution = staticReviews.reduce((dist, review) => {
    const rating = review.content.rating as keyof typeof dist;
    dist[rating] = (dist[rating] || 0) + 1;
    return dist;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  const relationshipBreakdown = staticReviews.reduce((breakdown, review) => {
    const relationship = review.reviewer.relationship;
    breakdown[relationship] = (breakdown[relationship] || 0) + 1;
    return breakdown;
  }, {} as Record<string, number>);

  return {
    total: totalReviews,
    averageRating: Math.round(averageRating * 10) / 10,
    ratingDistribution,
    relationshipBreakdown
  };
}

/**
 * Check if we're in a static build environment
 */
export function isStaticBuild(): boolean {
  return process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_STATIC_BUILD === 'true';
}

/**
 * Universal review fetcher that works in both static and dynamic environments
 */
export async function fetchReviews(options: ReviewQueryOptions = {}) {
  // In static builds, use the static data
  if (isStaticBuild() || typeof window === 'undefined') {
    return getReviews(options);
  }

  // In dynamic environments, try to use the API
  try {
    const params = new URLSearchParams();
    
    if (options.limit) params.set('limit', options.limit.toString());
    if (options.offset) params.set('offset', options.offset.toString());
    if (options.sortBy) params.set('sortBy', options.sortBy);
    if (options.sortOrder) params.set('sortOrder', options.sortOrder);
    if (options.featured) params.set('featured', 'true');
    if (options.minRating) params.set('minRating', options.minRating.toString());
    if (options.relationship) params.set('relationship', options.relationship);
    if (options.search) params.set('search', options.search);

    const response = await fetch(`/api/reviews/display?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'API request failed');
    }
  } catch (error) {
    console.warn('API request failed, falling back to static data:', error);
    return getReviews(options);
  }
}
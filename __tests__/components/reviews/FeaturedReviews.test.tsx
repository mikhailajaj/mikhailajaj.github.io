/**
 * FeaturedReviews Component Tests
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { FeaturedReviews } from '@/components/reviews/FeaturedReviews';
import type { PublicReview } from '@/lib/types/review';
import { it } from 'zod/v4/locales';

import { beforeEach } from 'node:test';
import { describe } from 'node:test';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>;
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockReviews: PublicReview[] = [
  {
    id: 'review-1',
    reviewer: {
      name: 'Dr. Sarah Johnson',
      title: 'Professor of Computer Science',
      organization: 'Tech University',
      relationship: 'professor',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Excellent work on distributed systems research. Highly recommended for senior development roles.',
      projectAssociation: 'Distributed Systems Research',
      skills: ['Distributed Systems', 'Leadership'],
      recommendation: true,
      highlights: ['Technical Excellence']
    },
    metadata: {
      approvedAt: '2024-01-16T09:15:00Z',
      source: 'direct'
    }
  },
  {
    id: 'review-2',
    reviewer: {
      name: 'John Smith',
      title: 'Senior Developer',
      organization: 'Tech Corp',
      relationship: 'colleague',
      verified: true
    },
    content: {
      rating: 4,
      testimonial: 'Great collaboration on cloud infrastructure projects. Strong technical skills.',
      projectAssociation: 'Cloud Migration',
      skills: ['AWS', 'DevOps'],
      recommendation: true,
      highlights: ['Problem Solving']
    },
    metadata: {
      approvedAt: '2024-01-15T14:30:00Z',
      source: 'direct'
    }
  }
];

describe('FeaturedReviews', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { container } = render(<FeaturedReviews />);
    
    // Check for loading skeleton elements
    const loadingElement = container.querySelector('.animate-pulse');
    expect(loadingElement).toBeTruthy();
  });

  it('fetches and displays featured reviews', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: mockReviews
        }
      })
    });

    render(<FeaturedReviews />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });

    expect(screen.getByText(/Excellent work on distributed systems/)).toBeInTheDocument();
    expect(screen.getByText(/Great collaboration on cloud/)).toBeInTheDocument();
  });

  it('displays empty state when no reviews available', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: []
        }
      })
    });

    render(<FeaturedReviews />);

    await waitFor(() => {
      expect(screen.getByText(/No Featured Reviews Yet/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Submit a Review/)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(<FeaturedReviews />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load featured reviews/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Try Again/)).toBeInTheDocument();
  });

  it('renders in grid layout by default', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: mockReviews
        }
      })
    });

    render(<FeaturedReviews layout="grid" />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    });

    // Should display both reviews in grid
    expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
  });

  it('renders in carousel layout with navigation', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: mockReviews
        }
      })
    });

    render(<FeaturedReviews layout="carousel" showControls={true} />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    });

    // Should show navigation buttons (they exist but may not have accessible names)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('shows view all link when enabled', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: mockReviews
        }
      })
    });

    render(<FeaturedReviews showViewAllLink={true} />);

    await waitFor(() => {
      expect(screen.getByText(/View All Testimonials/)).toBeInTheDocument();
    });

    const viewAllLink = screen.getByRole('link', { name: /View All Testimonials/i });
    expect(viewAllLink).toHaveAttribute('href', '/testimonials');
  });

  it('limits number of reviews based on maxReviews prop', async () => {
    const manyReviews = Array.from({ length: 10 }, (_, i) => ({
      ...mockReviews[0],
      id: `review-${i}`,
      reviewer: {
        ...mockReviews[0].reviewer,
        name: `Reviewer ${i}`
      }
    }));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: manyReviews
        }
      })
    });

    render(<FeaturedReviews maxReviews={3} />);

    await waitFor(() => {
      expect(screen.getByText('Reviewer 0')).toBeInTheDocument();
    });

    // Should only show first 3 reviews
    expect(screen.getByText('Reviewer 0')).toBeInTheDocument();
    expect(screen.getByText('Reviewer 1')).toBeInTheDocument();
    expect(screen.getByText('Reviewer 2')).toBeInTheDocument();
    expect(screen.queryByText('Reviewer 3')).not.toBeInTheDocument();
  });

  it('displays rating stars correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: [mockReviews[0]] // 5-star review
        }
      })
    });

    render(<FeaturedReviews />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    });

    // Should show star elements (using SVG icons)
    const starElements = document.querySelectorAll('.lucide-star');
    expect(starElements.length).toBe(5); // Should have 5 star elements
  });

  it('shows verified badge for verified reviewers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: [mockReviews[0]] // verified reviewer
        }
      })
    });

    render(<FeaturedReviews />);

    await waitFor(() => {
      expect(screen.getByText(/✓ Verified/)).toBeInTheDocument();
    });
  });

  it('truncates long testimonials appropriately', async () => {
    const longTestimonial = 'A'.repeat(200) + ' This should be truncated';
    const reviewWithLongTestimonial = {
      ...mockReviews[0],
      content: {
        ...mockReviews[0].content,
        testimonial: longTestimonial
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: [reviewWithLongTestimonial]
        }
      })
    });

    render(<FeaturedReviews />);

    await waitFor(() => {
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
    });

    // Should show truncated text with ellipsis
    const testimonialText = screen.getByText(/A{3,}.*\.\.\./);
    expect(testimonialText).toBeInTheDocument();
  });

  it('calls API with correct parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          reviews: mockReviews
        }
      })
    });

    render(<FeaturedReviews maxReviews={5} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/reviews/display?featured=true&limit=5&sortBy=approvedAt&sortOrder=desc',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
});
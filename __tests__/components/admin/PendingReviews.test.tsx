/**
 * PendingReviews Component Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PendingReviews } from '@/components/admin/PendingReviews';
import type { Review } from '@/lib/types/review';

// Mock fetch
global.fetch = jest.fn();

const mockReviews: Review[] = [
  {
    id: 'test-review-1',
    status: 'verified',
    reviewer: {
      name: 'John Doe',
      email: 'john@example.com',
      title: 'Software Engineer',
      organization: 'Tech Corp',
      relationship: 'colleague',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Great work on the project!',
      recommendation: true
    },
    metadata: {
      submittedAt: '2024-01-15T10:00:00Z',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
      source: 'direct',
      language: 'en',
      timezone: 'UTC'
    },
    admin: {
      featured: false,
      tags: ['test']
    }
  },
  {
    id: 'test-review-2',
    status: 'verified',
    reviewer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      title: 'Professor',
      organization: 'University',
      relationship: 'professor',
      verified: true
    },
    content: {
      rating: 4,
      testimonial: 'Excellent technical skills and collaboration.',
      recommendation: true
    },
    metadata: {
      submittedAt: '2024-01-16T10:00:00Z',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
      source: 'direct',
      language: 'en',
      timezone: 'UTC'
    },
    admin: {
      featured: false,
      tags: ['test']
    }
  }
];

describe('PendingReviews Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pending reviews list', () => {
    render(<PendingReviews initialReviews={mockReviews} />);
    
    expect(screen.getByText('Pending Reviews (2)')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('filters reviews by search query', async () => {
    render(<PendingReviews initialReviews={mockReviews} />);
    
    const searchInput = screen.getByPlaceholderText('Search reviews...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('filters reviews by relationship', async () => {
    render(<PendingReviews initialReviews={mockReviews} />);
    
    const relationshipFilter = screen.getByDisplayValue('All Relationships');
    fireEvent.change(relationshipFilter, { target: { value: 'professor' } });
    
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('handles review selection', () => {
    const mockOnSelect = jest.fn();
    render(
      <PendingReviews 
        initialReviews={mockReviews} 
        onReviewSelect={mockOnSelect}
      />
    );
    
    const reviewCard = screen.getByText('John Doe').closest('.cursor-pointer');
    if (reviewCard) {
      fireEvent.click(reviewCard);
      expect(mockOnSelect).toHaveBeenCalledWith(mockReviews[0]);
    }
  });

  it('handles bulk selection', () => {
    render(<PendingReviews initialReviews={mockReviews} />);
    
    const selectAllButton = screen.getByText('Select All');
    fireEvent.click(selectAllButton);
    
    expect(screen.getByText('Deselect All')).toBeInTheDocument();
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('handles bulk actions', async () => {
    const mockBulkAction = jest.fn().mockResolvedValue(undefined);
    render(
      <PendingReviews 
        initialReviews={mockReviews} 
        onBulkAction={mockBulkAction}
      />
    );
    
    // Select all reviews
    const selectAllButton = screen.getByText('Select All');
    fireEvent.click(selectAllButton);
    
    // Click approve selected
    const approveButton = screen.getByText('Approve Selected');
    fireEvent.click(approveButton);
    
    expect(mockBulkAction).toHaveBeenCalledWith('approve', expect.arrayContaining(['test-review-1', 'test-review-2']));
  });

  it('displays loading state', () => {
    render(<PendingReviews loading={true} />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays empty state when no reviews', async () => {
    render(<PendingReviews initialReviews={[]} />);
    
    // Wait for component to finish loading
    await waitFor(() => {
      expect(screen.getByText('No pending reviews')).toBeInTheDocument();
    });
  });

  it('displays filtered empty state', async () => {
    render(<PendingReviews initialReviews={mockReviews} />);
    
    const searchInput = screen.getByPlaceholderText('Search reviews...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No reviews match your filters')).toBeInTheDocument();
    });
  });

  it('sorts reviews correctly', async () => {
    render(<PendingReviews initialReviews={mockReviews} />);
    
    const sortSelect = screen.getByDisplayValue('Newest First');
    fireEvent.change(sortSelect, { target: { value: 'name' } });
    
    await waitFor(() => {
      const reviewCards = screen.getAllByText(/John Doe|Jane Smith/);
      expect(reviewCards[0]).toHaveTextContent('Jane Smith'); // Alphabetically first
    });
  });
});
/**
 * ReviewCard Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import type { Review } from '@/lib/types/review';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { it } from 'zod/v4/locales';
import { describe } from 'node:test';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, initial, animate, transition, ...props }: any) => 
      <div {...props}>{children}</div>,
    span: ({ children, whileHover, initial, animate, transition, ...props }: any) => 
      <span {...props}>{children}</span>,
  },
}));

const mockReview: Review = {
  id: 'test-review-1',
  status: 'approved',
  reviewer: {
    name: 'John Doe',
    email: 'john@example.com',
    title: 'Senior Developer',
    organization: 'Tech Corp',
    relationship: 'colleague',
    verified: true
  },
  content: {
    rating: 5,
    testimonial: 'Excellent work on the project. Highly recommended for any development role.',
    projectAssociation: 'E-commerce Platform',
    skills: ['React', 'TypeScript', 'Node.js'],
    recommendation: true,
    highlights: ['Technical Excellence', 'Team Leadership']
  },
  metadata: {
    submittedAt: '2024-01-15T10:30:00Z',
    verifiedAt: '2024-01-15T11:00:00Z',
    approvedAt: '2024-01-16T09:15:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0',
    source: 'direct',
    language: 'en',
    timezone: 'America/New_York'
  },
  admin: {
    notes: 'Great testimonial',
    featured: true,
    displayOrder: 1,
    moderatedBy: 'admin',
    moderatedAt: '2024-01-16T09:15:00Z',
    tags: ['technical', 'leadership'],
    internalRating: 5
  }
};

describe('ReviewCard', () => {
  it('renders review content correctly', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText(/Excellent work on the project/)).toBeInTheDocument();
  });

  it('displays rating correctly', () => {
    render(<ReviewCard review={mockReview} />);
    
    // Check for rating display (aria-label)
    expect(screen.getByRole('img', { name: /Rating: 5 out of 5 stars/ })).toBeInTheDocument();
  });

  it('shows relationship badge', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('Colleague')).toBeInTheDocument();
  });

  it('shows featured badge when review is featured', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('shows verified badge when reviewer is verified', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('✓ Verified')).toBeInTheDocument();
  });

  it('displays skills when provided', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('shows project association', () => {
    render(<ReviewCard review={mockReview} />);
    
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
  });

  it('renders compact variant correctly', () => {
    render(<ReviewCard review={mockReview} variant="compact" />);
    
    // In compact mode, some details should be hidden
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Senior Developer')).not.toBeInTheDocument();
  });

  it('renders featured variant with special styling', () => {
    const { container } = render(<ReviewCard review={mockReview} variant="featured" />);
    
    // Featured cards should have special border styling
    const card = container.querySelector('.border-yellow-200');
    expect(card).toBeInTheDocument();
  });

  it('shows admin actions when enabled', () => {
    render(<ReviewCard review={mockReview} showActions={true} />);
    
    expect(screen.getByText('Approve')).toBeInTheDocument();
    expect(screen.getByText('Reject')).toBeInTheDocument();
    expect(screen.getByText('Feature')).toBeInTheDocument();
  });
});
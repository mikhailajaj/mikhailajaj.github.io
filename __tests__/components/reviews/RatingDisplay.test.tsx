/**
 * RatingDisplay Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { RatingDisplay } from '@/components/reviews/RatingDisplay';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => 
      <div {...props}>{children}</div>,
    span: ({ children, initial, animate, transition, ...props }: any) => 
      <span {...props}>{children}</span>,
  },
}));

describe('RatingDisplay', () => {
  it('renders correct aria-label for rating', () => {
    render(<RatingDisplay rating={4.5} />);
    
    expect(screen.getByRole('img', { name: /Rating: 4.5 out of 5 stars/ })).toBeInTheDocument();
  });

  it('shows numeric rating when enabled', () => {
    render(<RatingDisplay rating={4.5} showNumeric />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('handles different sizes correctly', () => {
    const { rerender } = render(<RatingDisplay rating={5} size="sm" />);
    
    // Check for small size class
    const container = screen.getByRole('img');
    expect(container).toBeInTheDocument();
    
    rerender(<RatingDisplay rating={5} size="lg" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('clamps rating to valid range', () => {
    render(<RatingDisplay rating={6} maxRating={5} />);
    
    expect(screen.getByRole('img', { name: /Rating: 5 out of 5 stars/ })).toBeInTheDocument();
  });

  it('handles zero rating', () => {
    render(<RatingDisplay rating={0} />);
    
    expect(screen.getByRole('img', { name: /Rating: 0 out of 5 stars/ })).toBeInTheDocument();
  });

  it('uses custom aria-label when provided', () => {
    render(<RatingDisplay rating={4} ariaLabel="Custom rating label" />);
    
    expect(screen.getByRole('img', { name: 'Custom rating label' })).toBeInTheDocument();
  });

  it('handles different max ratings', () => {
    render(<RatingDisplay rating={8} maxRating={10} />);
    
    expect(screen.getByRole('img', { name: /Rating: 8 out of 10 stars/ })).toBeInTheDocument();
  });
});
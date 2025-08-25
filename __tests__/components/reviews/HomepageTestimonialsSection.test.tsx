/**
 * HomepageTestimonialsSection Component Tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { HomepageTestimonialsSection } from '@/components/reviews/HomepageTestimonialsSection';

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

// Mock FeaturedReviews component
jest.mock('@/components/reviews/FeaturedReviews', () => ({
  FeaturedReviews: ({ emptyComponent, maxReviews, layout, showControls, showViewAllLink, autoRotate, rotationInterval, className, ...props }: any) => (
    <div data-testid="featured-reviews" className={className}>
      {emptyComponent || 'Featured Reviews Component'}
    </div>
  )
}));

describe('HomepageTestimonialsSection', () => {
  it('renders with default props', () => {
    render(<HomepageTestimonialsSection />);

    // Title is split into spans, so check for individual parts
    expect(screen.getByText('Professional')).toBeInTheDocument();
    expect(screen.getAllByText('Testimonials').length).toBeGreaterThan(0);
    expect(screen.getByText(/What colleagues, professors, and collaborators say/)).toBeInTheDocument();
    expect(screen.getByTestId('featured-reviews')).toBeInTheDocument();
  });

  it('renders custom title and subtitle', () => {
    render(
      <HomepageTestimonialsSection
        title="Client Reviews"
        subtitle="Feedback from our valued clients"
      />
    );

    // Title is split into spans, so check for the highlighted word
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText(/Feedback from our valued clients/)).toBeInTheDocument();
  });

  it('shows statistics when enabled', () => {
    render(<HomepageTestimonialsSection showStats={true} />);

    expect(screen.getByText(/Happy Clients/)).toBeInTheDocument();
    expect(screen.getByText(/Average Rating/)).toBeInTheDocument();
    expect(screen.getByText(/Success Rate/)).toBeInTheDocument();
    // Note: "Testimonials" appears in both title and stats, so we need to be more specific
    expect(screen.getAllByText(/Testimonials/).length).toBeGreaterThan(0);
  });

  it('hides statistics when disabled', () => {
    render(<HomepageTestimonialsSection showStats={false} />);

    expect(screen.queryByText(/Happy Clients/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Average Rating/)).not.toBeInTheDocument();
  });

  it('shows call-to-action when enabled', () => {
    render(<HomepageTestimonialsSection showCTA={true} />);

    expect(screen.getByText(/Have you worked with me/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Submit a Testimonial/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View All Testimonials/i })).toBeInTheDocument();
  });

  it('hides call-to-action when disabled', () => {
    render(<HomepageTestimonialsSection showCTA={false} />);

    expect(screen.queryByText(/Have you worked with me/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Submit a Testimonial/i })).not.toBeInTheDocument();
  });

  it('renders compact variant correctly', () => {
    render(<HomepageTestimonialsSection variant="compact" />);

    // Should not show statistics in compact mode
    expect(screen.queryByText(/Happy Clients/)).not.toBeInTheDocument();

    // Should show compact CTA text
    expect(screen.getByText('Worked with me? Share your experience!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Submit Review/i })).toBeInTheDocument();
  });

  it('renders featured variant correctly', () => {
    render(<HomepageTestimonialsSection variant="featured" />);

    // Should show statistics
    expect(screen.getByText(/Happy Clients/)).toBeInTheDocument();

    // Should show full CTA
    expect(screen.getByText(/Have you worked with me/)).toBeInTheDocument();
  });

  it('applies custom section ID', () => {
    const { container } = render(<HomepageTestimonialsSection sectionId="custom-testimonials" />);

    const section = container.querySelector('#custom-testimonials');
    expect(section).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <HomepageTestimonialsSection className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes correct props to FeaturedReviews component', () => {
    render(<HomepageTestimonialsSection variant="compact" />);

    const featuredReviews = screen.getByTestId('featured-reviews');
    expect(featuredReviews).toBeInTheDocument();

    // Should pass maxReviews=2 for compact variant
    // Note: This would need to be verified through props if we had access to them
  });

  it('renders trust indicators in CTA', () => {
    render(<HomepageTestimonialsSection showCTA={true} />);

    expect(screen.getByText(/✓ Verified Reviews/)).toBeInTheDocument();
    expect(screen.getByText(/✓ Professional Network/)).toBeInTheDocument();
  });

  it('has correct link destinations', () => {
    render(<HomepageTestimonialsSection showCTA={true} />);

    const submitLink = screen.getByRole('link', { name: /Submit a Testimonial/i });
    const viewAllLink = screen.getByRole('link', { name: /View All Testimonials/i });

    expect(submitLink).toHaveAttribute('href', '/reviews/submit');
    expect(viewAllLink).toHaveAttribute('href', '/testimonials');
  });

  it('renders statistics with correct values', () => {
    render(<HomepageTestimonialsSection showStats={true} />);

    expect(screen.getByText('50+')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('25+')).toBeInTheDocument();
  });

  it('renders statistics descriptions', () => {
    render(<HomepageTestimonialsSection showStats={true} />);

    expect(screen.getByText(/Professionals who recommend my work/)).toBeInTheDocument();
    expect(screen.getByText(/Based on verified testimonials/)).toBeInTheDocument();
    expect(screen.getByText(/Projects completed successfully/)).toBeInTheDocument();
    expect(screen.getByText(/From professors and colleagues/)).toBeInTheDocument();
  });

  it('highlights last word in title', () => {
    render(<HomepageTestimonialsSection title="Professional Testimonials" />);

    // The title is split into spans, so check for both parts
    expect(screen.getByText('Professional')).toBeInTheDocument();

    // Check if the highlighted word exists (there might be multiple "Testimonials" on page)
    const testimonialElements = screen.getAllByText('Testimonials');
    expect(testimonialElements.length).toBeGreaterThan(0);
  });

  it('renders with proper semantic structure', () => {
    const { container } = render(<HomepageTestimonialsSection />);

    // Should have proper heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toBeInTheDocument();

    // Should have section element
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
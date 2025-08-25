/**
 * Review Components Demo
 * 
 * A demo component to showcase the review display components
 */

import React from 'react';
import { ReviewCard, TestimonialGrid, RatingDisplay } from './index';
import type { Review } from '@/lib/types/review';

// Sample review data for demo
const sampleReviews: Review[] = [
  {
    id: 'demo-review-1',
    status: 'approved',
    reviewer: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      title: 'Professor of Computer Science',
      organization: 'Tech University',
      relationship: 'professor',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Mikhail demonstrated exceptional technical skills and leadership during our collaborative research project on distributed systems. His ability to translate complex theoretical concepts into practical implementations was remarkable.',
      projectAssociation: 'Distributed Systems Research Project',
      skills: ['Distributed Systems', 'Leadership', 'Research', 'Problem Solving'],
      recommendation: true,
      highlights: ['Technical Excellence', 'Leadership Skills', 'Research Ability']
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
      notes: 'Excellent testimonial from respected academic',
      featured: true,
      displayOrder: 1,
      moderatedBy: 'admin',
      moderatedAt: '2024-01-16T09:15:00Z',
      tags: ['academic', 'research', 'leadership'],
      internalRating: 5
    }
  },
  {
    id: 'demo-review-2',
    status: 'approved',
    reviewer: {
      name: 'Alex Chen',
      email: 'alex.chen@techcorp.com',
      title: 'Senior Software Engineer',
      organization: 'TechCorp Inc.',
      relationship: 'colleague',
      verified: true
    },
    content: {
      rating: 4,
      testimonial: 'Working with Mikhail on the e-commerce platform was a great experience. His attention to detail and problem-solving skills really stood out.',
      projectAssociation: 'E-commerce Platform Redesign',
      skills: ['React', 'TypeScript', 'Node.js', 'Problem Solving'],
      recommendation: true
    },
    metadata: {
      submittedAt: '2024-01-20T14:20:00Z',
      verifiedAt: '2024-01-20T14:45:00Z',
      approvedAt: '2024-01-21T10:00:00Z',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0',
      source: 'direct',
      language: 'en',
      timezone: 'America/Los_Angeles'
    },
    admin: {
      notes: 'Good technical testimonial',
      featured: false,
      displayOrder: 2,
      moderatedBy: 'admin',
      moderatedAt: '2024-01-21T10:00:00Z',
      tags: ['technical', 'collaboration'],
      internalRating: 4
    }
  }
];

/**
 * ReviewDemo Component
 */
export const ReviewDemo: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Review Components Demo</h1>
        <p className="text-muted-foreground">
          Showcasing the testimonial review system components
        </p>
      </div>

      {/* Rating Display Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Rating Display</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="space-y-2">
            <h3 className="font-medium">Small Size</h3>
            <RatingDisplay rating={4.5} size="sm" showNumeric />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Medium Size (Default)</h3>
            <RatingDisplay rating={4.5} size="md" showNumeric />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Large Size with Animation</h3>
            <RatingDisplay rating={4.5} size="lg" showNumeric animated />
          </div>
        </div>
      </section>

      {/* Review Card Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Review Cards</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Featured Variant</h3>
            <ReviewCard review={sampleReviews[0]} variant="featured" />
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Default Variant</h3>
            <ReviewCard review={sampleReviews[1]} variant="default" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-medium">Compact Variant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReviewCard review={sampleReviews[0]} variant="compact" />
            <ReviewCard review={sampleReviews[1]} variant="compact" />
            <ReviewCard review={sampleReviews[0]} variant="compact" />
          </div>
        </div>
      </section>

      {/* Testimonial Grid Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Testimonial Grid</h2>
        <TestimonialGrid
          reviews={sampleReviews}
          layout="grid"
          pagination={{ enabled: true, itemsPerPage: 6 }}
        />
      </section>

      {/* Admin View Demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Admin View</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReviewCard review={sampleReviews[0]} showActions />
          <ReviewCard review={sampleReviews[1]} showActions />
        </div>
      </section>
    </div>
  );
};

export default ReviewDemo;
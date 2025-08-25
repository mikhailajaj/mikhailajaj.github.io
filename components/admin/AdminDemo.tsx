/**
 * AdminDemo Component
 * 
 * Demonstrates the admin interface components with sample data
 */

'use client';

import React from 'react';
import { AdminInterface } from './AdminInterface';
import type { Review, ReviewStats } from '@/lib/types/review';

// Sample data for demonstration
const samplePendingReviews: Review[] = [
  {
    id: 'demo-review-1',
    status: 'verified',
    reviewer: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      title: 'Professor of Computer Science',
      organization: 'Stanford University',
      relationship: 'professor',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Mikhail demonstrated exceptional technical leadership during our collaborative research project on distributed systems. His ability to architect scalable solutions while mentoring junior developers was truly impressive.',
      projectAssociation: 'Distributed Systems Research',
      skills: ['Leadership', 'System Architecture', 'Mentoring'],
      recommendation: true,
      highlights: ['Technical Excellence', 'Leadership Skills', 'Research Collaboration']
    },
    metadata: {
      submittedAt: '2024-01-15T10:30:00Z',
      verifiedAt: '2024-01-15T11:00:00Z',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      source: 'direct',
      language: 'en',
      timezone: 'America/New_York'
    },
    admin: {
      notes: '',
      featured: false,
      tags: ['academic', 'research', 'leadership']
    }
  },
  {
    id: 'demo-review-2',
    status: 'verified',
    reviewer: {
      name: 'Michael Chen',
      email: 'mchen@techcorp.com',
      title: 'Senior Software Engineer',
      organization: 'TechCorp Inc.',
      relationship: 'colleague',
      verified: true
    },
    content: {
      rating: 4,
      testimonial: 'Working with Mikhail on the cloud migration project was a great experience. He brought innovative solutions to complex problems and helped our team adopt modern DevOps practices.',
      projectAssociation: 'Cloud Migration Project',
      skills: ['DevOps', 'Cloud Architecture', 'Team Collaboration'],
      recommendation: true,
      highlights: ['Innovation', 'Problem Solving', 'DevOps Expertise']
    },
    metadata: {
      submittedAt: '2024-01-20T14:15:00Z',
      verifiedAt: '2024-01-20T14:45:00Z',
      ipAddress: '10.0.0.50',
      userAgent: 'Mozilla/5.0...',
      source: 'linkedin',
      language: 'en',
      timezone: 'America/Los_Angeles'
    },
    admin: {
      notes: '',
      featured: false,
      tags: ['technical', 'collaboration', 'devops']
    }
  },
  {
    id: 'demo-review-3',
    status: 'verified',
    reviewer: {
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@startup.io',
      title: 'CTO',
      organization: 'InnovateTech Startup',
      relationship: 'client',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Mikhail provided exceptional technical consulting for our startup. His expertise in full-stack development and system architecture helped us build a robust, scalable platform that exceeded our expectations.',
      projectAssociation: 'Platform Development Consulting',
      skills: ['Full-Stack Development', 'Technical Consulting', 'System Architecture'],
      recommendation: true,
      highlights: ['Technical Excellence', 'Consulting Skills', 'Scalable Solutions']
    },
    metadata: {
      submittedAt: '2024-01-25T09:00:00Z',
      verifiedAt: '2024-01-25T09:30:00Z',
      ipAddress: '172.16.0.10',
      userAgent: 'Mozilla/5.0...',
      source: 'referral',
      language: 'en',
      timezone: 'America/Chicago'
    },
    admin: {
      notes: '',
      featured: false,
      tags: ['consulting', 'startup', 'full-stack']
    }
  }
];

const sampleStats: ReviewStats = {
  total: 25,
  approved: 18,
  pending: 3,
  verified: 3,
  rejected: 4,
  averageRating: 4.6,
  ratingDistribution: {
    1: 0,
    2: 1,
    3: 2,
    4: 8,
    5: 14
  },
  relationshipBreakdown: {
    professor: 6,
    colleague: 8,
    supervisor: 2,
    collaborator: 4,
    client: 5
  },
  monthlySubmissions: [
    { month: '2024-01', count: 8 },
    { month: '2024-02', count: 12 },
    { month: '2024-03', count: 5 }
  ]
};

/**
 * AdminDemo Component
 * 
 * Provides a demonstration of the admin interface with sample data
 */
export const AdminDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Interface Demo</h1>
          <p className="text-muted-foreground">
            This demonstrates the testimonial review system admin interface with sample data.
          </p>
        </div>

        <AdminInterface
          initialData={{
            pendingCount: samplePendingReviews.length,
            recentActivity: [],
            stats: sampleStats
          }}
          permissions={{
            canApprove: true,
            canReject: true,
            canViewAnalytics: true,
            canExport: true
          }}
        />
      </div>
    </div>
  );
};

export default AdminDemo;
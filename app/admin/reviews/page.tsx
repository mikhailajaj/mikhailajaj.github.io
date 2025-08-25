/**
 * Admin Reviews Management Page
 * 
 * Interface for reviewing and managing submitted testimonials
 */

import { promises as fs } from 'fs';
import path from 'path';
import { AdminReviewsClient } from './AdminReviewsClient';
import { notFound } from 'next/navigation';

interface Review {
  id: string;
  status: string;
  reviewer: {
    name: string;
    email: string;
    title?: string;
    organization?: string;
    relationship: string;
    linkedinUrl?: string;
    verified: boolean;
    verifiedAt?: string;
  };
  content: {
    rating: number;
    testimonial: string;
    projectAssociation?: string;
    skills?: string[];
    recommendation: boolean;
    workPeriod?: {
      start: string;
      end?: string;
    };
  };
  metadata: {
    submittedAt: string;
    ipAddress: string;
    userAgent: string;
    source: string;
  };
  admin: {
    notes: string;
    reviewedBy: string;
    reviewedAt: string | null;
    featured: boolean;
  };
}

export default async function AdminReviewsPage() {
  // Simple authentication check
  // In production, implement proper authentication
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated) {
    notFound();
  }

  let reviews: Review[] = [];
  
  try {
    // For static export, we'll load reviews client-side
    // The AdminReviewsClient will fetch from Lambda API
    console.log('Admin page loaded - reviews will be fetched client-side from Lambda API');
  } catch (error) {
    console.error('Error in admin page:', error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Review Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage submitted testimonials and reviews
          </p>
        </div>
        
        <AdminReviewsClient reviews={reviews} />
      </div>
    </div>
  );
}

export async function generateMetadata() {
  return {
    title: 'Admin - Review Management',
    description: 'Manage submitted testimonials and reviews',
    robots: 'noindex, nofollow', // Prevent search engine indexing
  };
}
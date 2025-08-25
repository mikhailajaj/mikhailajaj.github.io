/**
 * Review Verification Page
 * 
 * Handles email verification for submitted reviews
 */

import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { VerificationClient } from './VerificationClient';

interface VerifyPageProps {
  params: {
    reviewId: string;
  };
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { reviewId } = params;

  // Validate review ID format
  if (!reviewId || reviewId.length !== 12) {
    notFound();
  }

  try {
    // Check if review exists
    const reviewFile = path.join(process.cwd(), 'data', 'reviews', `${reviewId}.json`);
    
    let reviewExists = false;
    try {
      await fs.access(reviewFile);
      reviewExists = true;
    } catch {
      reviewExists = false;
    }

    if (!reviewExists) {
      notFound();
    }

    return <VerificationClient reviewId={reviewId} />;
  } catch (error) {
    console.error('Error checking review:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: VerifyPageProps) {
  return {
    title: 'Verify Your Testimonial',
    description: 'Complete the verification process for your testimonial submission.',
  };
}
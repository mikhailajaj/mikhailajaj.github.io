/**
 * Client Component for Review Submission
 * 
 * Handles the interactive parts of the review submission page
 */

'use client';

import React from 'react';
import { ReviewSubmissionForm } from '@/components/reviews/forms/ReviewSubmissionForm';
import type { ReviewSubmissionData } from '@/lib/types/review';

interface SubmitReviewClientProps {
  className?: string;
}

export function SubmitReviewClient({ className }: SubmitReviewClientProps) {
  const handleSuccess = (reviewId: string) => {
    console.log('Review submitted successfully:', reviewId);
    // You can add more success handling here like:
    // - Show a success toast
    // - Redirect to a thank you page
    // - Track analytics event
  };

  const handleError = (error: Error) => {
    console.error('Review submission error:', error);
    // You can add more error handling here like:
    // - Show an error toast
    // - Track error analytics
    // - Offer retry options
  };

  const handleSubmit = async (data: ReviewSubmissionData) => {
    try {
      console.log('Submitting review data:', data);
      
      // Simple approach using Formspree (free tier: 50 submissions/month)
      // 1. Go to https://formspree.io
      // 2. Create a form and get your form ID
      // 3. Replace YOUR_FORM_ID below with your actual form ID
      
      const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID';
      
      // Prepare form data
      const formData = {
        name: data.name,
        email: data.email,
        title: data.title || '',
        organization: data.organization || '',
        relationship: data.relationship,
        linkedinUrl: data.linkedinUrl || '',
        rating: data.rating,
        testimonial: data.testimonial,
        projectAssociation: data.projectAssociation || '',
        skills: data.skills?.join(', ') || '',
        recommendation: data.recommendation ? 'Yes' : 'No',
        workPeriod: data.workPeriod ? `${data.workPeriod.start} - ${data.workPeriod.end || 'Present'}` : '',
        submittedAt: new Date().toISOString(),
        source: 'Website Testimonial Form',
        // Honeypot field for spam protection
        _gotcha: data.honeypot || ''
      };
      
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Submission failed');
      }

      const result = await response.json();
      
      // Generate a simple review ID for user feedback
      const reviewId = 'review-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      handleSuccess(reviewId);
      
    } catch (error) {
      console.error('Submission error:', error);
      handleError(error instanceof Error ? error : new Error('Submission failed'));
      throw error;
    }
  };

  return (
    <ReviewSubmissionForm 
      className={className}
      onSuccess={handleSuccess}
      onError={handleError}
      onSubmit={handleSubmit}
    />
  );
}
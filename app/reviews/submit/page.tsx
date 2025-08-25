/**
 * Review Submission Page
 * 
 * Allows users to submit testimonials and reviews with a multi-step form
 */

import React from 'react';
import { Metadata } from 'next';
import { SubmitReviewClient } from './SubmitReviewClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Submit a Review | Mikhail Ajaj',
  description: 'Share your experience working with Mikhail. Your feedback helps showcase the quality of work and builds trust with future clients.',
  keywords: ['testimonial', 'review', 'feedback', 'client experience', 'portfolio'],
  openGraph: {
    title: 'Submit a Review | Mikhail Ajaj',
    description: 'Share your experience working with Mikhail. Your feedback helps showcase the quality of work and builds trust with future clients.',
    type: 'website',
  },
};

export default function SubmitReviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Submit a Review
           
          </h1>
          <h2 className='bg-green-100 dark:bg-green-900'>UNDER-CONSTRUCTION template-only</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Share your experience working with me. Your feedback helps showcase the quality of work and builds trust with future clients.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Verified Reviews
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All reviews are verified via email to ensure authenticity
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Quality Focused
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your honest feedback helps maintain high service standards
            </p>
          </div>
          
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Quick Process
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Takes just 3-5 minutes to complete the review form
            </p>
          </div>
        </div>

        {/* Review Form */}
        <SubmitReviewClient className="mb-12" />

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Will my review be published immediately?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Reviews are moderated for quality and authenticity before being published. This typically takes 1-2 business days.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I edit my review after submission?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Yes, you can request edits by contacting me directly. I'll be happy to update your review as needed.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Is my personal information secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your email address is never displayed publicly. Only your name, title, and company (if provided) are shown with your review.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What if I have technical issues?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                If you encounter any problems, please contact me directly and I'll help you submit your review manually.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Have questions or need help with your review?
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">
              Contact Me Directly
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
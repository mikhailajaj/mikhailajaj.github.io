/**
 * Review Submission Demo Page
 * 
 * Demonstrates the review submission form with sample data
 */

'use client';

import React, { useState } from 'react';
import { ReviewSubmissionForm } from '@/components/reviews/forms/ReviewSubmissionForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import type { ReviewSubmissionData } from '@/lib/types/review';

export default function ReviewSubmissionDemoPage() {
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    reviewId?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (data: ReviewSubmissionData) => {
    try {
      // Simulate API call
      console.log('Submitting review:', data);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful submission
      const reviewId = `demo_${Date.now()}`;
      setSubmissionResult({
        success: true,
        reviewId
      });
      
      return Promise.resolve();
    } catch (error) {
      setSubmissionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  const handleSuccess = (reviewId: string) => {
    console.log('Review submitted successfully:', reviewId);
  };

  const handleError = (error: Error) => {
    console.error('Review submission error:', error);
    setSubmissionResult({
      success: false,
      error: error.message
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
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
          
          <Badge variant="secondary" className="mb-4">
            Demo Mode
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Review Submission Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Try out the review submission form. This is a demo version that doesn't actually submit data.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <ReviewSubmissionForm 
              onSubmit={handleSubmit}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Demo Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Demo Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">What happens in demo mode:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Form validation works normally</li>
                    <li>• No actual emails are sent</li>
                    <li>• No data is permanently stored</li>
                    <li>• All steps can be completed</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Form Features:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Multi-step form with validation</li>
                    <li>• Real-time error checking</li>
                    <li>• Professional relationship selection</li>
                    <li>• Star rating system</li>
                    <li>• Skills and highlights</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Sample Data */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  You can use this sample data to quickly test the form:
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Name:</strong> Sarah Johnson
                  </div>
                  <div>
                    <strong>Email:</strong> sarah.johnson@example.com
                  </div>
                  <div>
                    <strong>Title:</strong> Senior Developer
                  </div>
                  <div>
                    <strong>Organization:</strong> TechCorp Solutions
                  </div>
                  <div>
                    <strong>Relationship:</strong> Client
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submission Result */}
            {submissionResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {submissionResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    Submission Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submissionResult.success ? (
                    <div className="space-y-2">
                      <p className="text-green-600 dark:text-green-400">
                        ✅ Review submitted successfully!
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Review ID: {submissionResult.reviewId}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-red-600 dark:text-red-400">
                        ❌ Submission failed
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Error: {submissionResult.error}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to implement?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  To make this form functional in production:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Set up email service (Resend, SendGrid)</li>
                  <li>• Configure environment variables</li>
                  <li>• Enable file-based storage</li>
                  <li>• Set up admin approval workflow</li>
                </ul>
                <Button asChild className="mt-4 w-full">
                  <Link href="/contact">
                    Get Help Setting Up
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
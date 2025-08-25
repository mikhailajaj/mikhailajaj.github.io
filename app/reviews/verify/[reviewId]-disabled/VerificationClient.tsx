'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Mail, Clock } from 'lucide-react';

interface VerificationClientProps {
  reviewId: string;
}

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'already_verified' | 'expired';
  message: string;
}

export function VerificationClient({ reviewId }: VerificationClientProps) {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verifying your email...'
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Use Lambda API endpoint
        const API_ENDPOINT = process.env.NEXT_PUBLIC_LAMBDA_API_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';
        
        const response = await fetch(`${API_ENDPOINT}/reviews/verify/${reviewId}`, {
          method: 'POST',
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setVerificationState({
            status: 'success',
            message: result.message || 'Email verified successfully!'
          });
        } else if (result.error === 'ALREADY_VERIFIED') {
          setVerificationState({
            status: 'already_verified',
            message: 'This email has already been verified.'
          });
        } else if (result.error === 'EXPIRED') {
          setVerificationState({
            status: 'expired',
            message: 'This verification link has expired.'
          });
        } else {
          setVerificationState({
            status: 'error',
            message: result.message || 'Verification failed. Please try again.'
          });
        }
      } catch (error) {
        setVerificationState({
          status: 'error',
          message: 'An error occurred during verification. Please try again.'
        });
      }
    };

    verifyEmail();
  }, [reviewId]);

  const renderContent = () => {
    switch (verificationState.status) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{verificationState.message}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Verified!</h3>
            <p className="text-muted-foreground mb-6">{verificationState.message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-green-800 mb-2">What happens next?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Your testimonial will be reviewed for approval</li>
                <li>• This typically takes 1-2 business days</li>
                <li>• Once approved, it will be published on the website</li>
                <li>• You'll receive a notification when it's live</li>
              </ul>
            </div>
            <Button onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </div>
        );

      case 'already_verified':
        return (
          <div className="text-center py-8">
            <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Already Verified</h3>
            <p className="text-muted-foreground mb-6">{verificationState.message}</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700">
                Your testimonial is currently being reviewed and will be published once approved.
              </p>
            </div>
            <Button onClick={() => window.location.href = '/'}>
              Return to Homepage
            </Button>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Link Expired</h3>
            <p className="text-muted-foreground mb-6">{verificationState.message}</p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-700">
                Please submit your testimonial again to receive a new verification link.
              </p>
            </div>
            <Button onClick={() => window.location.href = '/reviews/submit'}>
              Submit New Testimonial
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verification Failed</h3>
            <p className="text-muted-foreground mb-6">{verificationState.message}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.href = '/reviews/submit'}
                variant="default"
              >
                Submit New Testimonial
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
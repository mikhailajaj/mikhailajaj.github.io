"use client";

import React, { useState } from 'react';
import { ReviewSubmissionForm } from './ReviewSubmissionForm';
import type { ReviewSubmissionData } from '@/lib/types/review';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  RefreshCw,
  Eye,
  Code
} from 'lucide-react';

interface DemoState {
  showForm: boolean;
  submissionResult?: {
    success: boolean;
    reviewId?: string;
    error?: string;
  };
  submittedData?: ReviewSubmissionData;
}

export function ReviewFormDemo() {
  const [demoState, setDemoState] = useState<DemoState>({
    showForm: true
  });

  const handleSubmit = async (data: ReviewSubmissionData) => {
    // Simulate API call
    console.log('Form submitted with data:', data);
    
    // Store submitted data for display
    setDemoState(prev => ({
      ...prev,
      submittedData: data
    }));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure for demo
    const success = Math.random() > 0.3; // 70% success rate
    
    if (success) {
      setDemoState(prev => ({
        ...prev,
        submissionResult: {
          success: true,
          reviewId: `demo-${Date.now()}`
        }
      }));
    } else {
      throw new Error('Demo submission failed - this is intentional for testing error handling');
    }
  };

  const handleSuccess = (reviewId: string) => {
    console.log('Submission successful:', reviewId);
    setDemoState(prev => ({
      ...prev,
      submissionResult: {
        success: true,
        reviewId
      }
    }));
  };

  const handleError = (error: Error) => {
    console.error('Submission error:', error);
    setDemoState(prev => ({
      ...prev,
      submissionResult: {
        success: false,
        error: error.message
      }
    }));
  };

  const resetDemo = () => {
    setDemoState({
      showForm: true,
      submissionResult: undefined,
      submittedData: undefined
    });
  };

  const toggleView = () => {
    setDemoState(prev => ({
      ...prev,
      showForm: !prev.showForm
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Demo Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>Review Submission Form Demo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This is a fully functional demo of the multi-step review submission form. 
              It includes real-time validation, progress tracking, error handling, and auto-save functionality.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Multi-step Navigation</Badge>
              <Badge variant="secondary">Real-time Validation</Badge>
              <Badge variant="secondary">Progress Tracking</Badge>
              <Badge variant="secondary">Error Handling</Badge>
              <Badge variant="secondary">Auto-save</Badge>
              <Badge variant="secondary">Accessibility</Badge>
            </div>

            <div className="flex space-x-2">
              <Button onClick={toggleView} variant="outline" size="sm">
                {demoState.showForm ? 'Hide Form' : 'Show Form'}
              </Button>
              <Button onClick={resetDemo} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Demo */}
      {demoState.showForm && (
        <ReviewSubmissionForm
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {/* Submission Result */}
      {demoState.submissionResult && (
        <Card className={demoState.submissionResult.success ? 'border-green-200' : 'border-red-200'}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {demoState.submissionResult.success ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600">Submission Successful</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-600">Submission Failed</span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {demoState.submissionResult.success ? (
              <div className="space-y-2">
                <p className="text-green-700">
                  Review submitted successfully! Review ID: 
                  <code className="ml-2 bg-green-100 px-2 py-1 rounded text-sm">
                    {demoState.submissionResult.reviewId}
                  </code>
                </p>
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Clock className="w-4 h-4" />
                  <span>Verification email sent. Please check your inbox.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-red-700">
                  Submission failed: {demoState.submissionResult.error}
                </p>
                <Button onClick={resetDemo} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Submitted Data Preview */}
      {demoState.submittedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Submitted Data Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Reviewer Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {demoState.submittedData.name}</div>
                    <div><strong>Email:</strong> {demoState.submittedData.email}</div>
                    {demoState.submittedData.title && (
                      <div><strong>Title:</strong> {demoState.submittedData.title}</div>
                    )}
                    {demoState.submittedData.organization && (
                      <div><strong>Organization:</strong> {demoState.submittedData.organization}</div>
                    )}
                    <div><strong>Relationship:</strong> {demoState.submittedData.relationship}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Review Content</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Rating:</strong> {demoState.submittedData.rating}/5 stars</div>
                    <div><strong>Recommendation:</strong> {demoState.submittedData.recommendation ? 'Yes' : 'No'}</div>
                    {demoState.submittedData.projectAssociation && (
                      <div><strong>Project:</strong> {demoState.submittedData.projectAssociation}</div>
                    )}
                    {demoState.submittedData.skills && demoState.submittedData.skills.length > 0 && (
                      <div>
                        <strong>Skills:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {demoState.submittedData.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Testimonial</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  {demoState.submittedData.testimonial}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {demoState.submittedData.testimonial.length} characters
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Features Implemented</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Multi-step form with progress tracking</li>
                <li>• Real-time validation using React Hook Form + Zod</li>
                <li>• Enhanced error handling with error boundaries</li>
                <li>• Auto-save functionality with localStorage</li>
                <li>• Responsive design with Tailwind CSS</li>
                <li>• Accessibility compliance (ARIA labels, keyboard navigation)</li>
                <li>• Loading states and user feedback</li>
                <li>• Form state management with custom hooks</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">API Integration</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Submits to <code>/api/reviews/submit</code> endpoint</li>
                <li>• Integrates with existing email verification system</li>
                <li>• Handles rate limiting and security measures</li>
                <li>• Provides detailed error messages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
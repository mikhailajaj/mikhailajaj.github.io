"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Mail, 
  Clock, 
  ArrowRight,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface SuccessStepProps {
  reviewId?: string;
  onStartNew: () => void;
}

export function SuccessStep({ reviewId, onStartNew }: SuccessStepProps) {
  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-2xl font-bold text-green-600 mb-2">
          Thank You!
        </h3>
        <p className="text-lg text-muted-foreground">
          Your testimonial has been submitted successfully.
        </p>
        {reviewId && (
          <p className="text-sm text-muted-foreground mt-2">
            Reference ID: <code className="bg-muted px-2 py-1 rounded text-xs">{reviewId}</code>
          </p>
        )}
      </div>

      {/* Next Steps */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 text-green-800">
            What happens next?
          </h4>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">1</span>
              </div>
              <div>
                <div className="font-medium text-green-800 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Verification
                </div>
                <div className="text-sm text-green-700">
                  Check your email for a verification link. Click it to confirm your review.
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">2</span>
              </div>
              <div>
                <div className="font-medium text-green-800 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Review Process
                </div>
                <div className="text-sm text-green-700">
                  Your testimonial will be reviewed for approval (typically 1-2 business days).
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-green-600">3</span>
              </div>
              <div>
                <div className="font-medium text-green-800 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publication
                </div>
                <div className="text-sm text-green-700">
                  Once approved, your testimonial will be published on the website.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="text-left space-y-2">
            <h5 className="font-medium text-blue-800 flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Important Notes
            </h5>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your spam/junk folder if you don't see the verification email</li>
              <li>• The verification link expires in 24 hours</li>
              <li>• You'll receive email notifications about your review status</li>
              <li>• Contact us if you need to make changes to your submitted review</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button 
          onClick={onStartNew}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Submit Another Review</span>
        </Button>
        
        <Button 
          asChild
          size="lg"
          className="flex items-center space-x-2"
        >
          <a href="/testimonials" className="flex items-center space-x-2">
            <span>View Testimonials</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>

      {/* Contact Information */}
      <div className="pt-6 border-t">
        <p className="text-sm text-muted-foreground">
          Questions or concerns? 
          <Button variant="link" className="p-0 ml-1 h-auto text-sm" asChild>
            <a href="/contact" className="inline-flex items-center">
              Contact us
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </p>
      </div>
    </div>
  );
}
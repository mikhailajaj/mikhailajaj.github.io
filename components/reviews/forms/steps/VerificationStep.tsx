"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import type { ReviewSubmissionData } from "@/lib/types/review";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  User,
  Building
} from "lucide-react";

interface VerificationStepProps {
  form: UseFormReturn<ReviewSubmissionData>;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  error?: string;
}

export function VerificationStep({ 
  form, 
  onSubmit, 
  onPrev, 
  isSubmitting, 
  error 
}: VerificationStepProps) {
  const formData = form.getValues();

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/5
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
        <p className="text-muted-foreground">
          Please review your information before submitting. We'll send a verification email to confirm your review.
        </p>
      </div>

      {/* Review Summary */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <User className="w-4 h-4 mr-2" />
            Reviewer Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <div className="font-medium">{formData.name}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <div className="font-medium">{formData.email}</div>
            </div>
            {formData.title && (
              <div>
                <span className="text-muted-foreground">Title:</span>
                <div className="font-medium">{formData.title}</div>
              </div>
            )}
            {formData.organization && (
              <div>
                <span className="text-muted-foreground">Organization:</span>
                <div className="font-medium flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {formData.organization}
                </div>
              </div>
            )}
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Relationship:</span>
              <div className="font-medium capitalize">
                {formData.relationship?.replace('_', ' ')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Content Summary */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center">
            <Star className="w-4 h-4 mr-2" />
            Review Content
          </h4>
          
          <div className="space-y-4">
            <div>
              <span className="text-muted-foreground text-sm">Rating:</span>
              {renderStars(formData.rating)}
            </div>
            
            <div>
              <span className="text-muted-foreground text-sm">Testimonial:</span>
              <div className="mt-1 p-3 bg-muted/50 rounded-md text-sm">
                {formData.testimonial?.length > 200 
                  ? `${formData.testimonial.substring(0, 200)}...`
                  : formData.testimonial
                }
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formData.testimonial?.length} characters
              </div>
            </div>

            {formData.projectAssociation && (
              <div>
                <span className="text-muted-foreground text-sm">Associated Project:</span>
                <div className="font-medium">{formData.projectAssociation}</div>
              </div>
            )}

            {formData.skills && formData.skills.length > 0 && (
              <div>
                <span className="text-muted-foreground text-sm">Skills Mentioned:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-muted-foreground text-sm">Recommendation:</span>
              <div className={cn(
                "font-medium flex items-center mt-1",
                formData.recommendation ? "text-green-600" : "text-red-600"
              )}>
                {formData.recommendation ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Would recommend
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Would not recommend
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Verification Process Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center text-primary">
            <Shield className="w-4 h-4 mr-2" />
            Verification Process
          </h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 mt-0.5 text-primary" />
              <div>
                <div className="font-medium">Email Verification</div>
                <div className="text-muted-foreground">
                  We'll send a verification link to <strong>{formData.email}</strong>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Clock className="w-4 h-4 mt-0.5 text-primary" />
              <div>
                <div className="font-medium">Review Process</div>
                <div className="text-muted-foreground">
                  After verification, your review will be reviewed for approval (typically 1-2 business days)
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
              <div>
                <div className="font-medium">Publication</div>
                <div className="text-muted-foreground">
                  Once approved, your testimonial will be published on the website
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Submission Error</span>
            </div>
            <p className="text-sm text-destructive mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          onClick={onPrev} 
          variant="outline" 
          size="lg"
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <Button 
          onClick={onSubmit} 
          size="lg"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>

      {/* Terms Notice */}
      <div className="text-xs text-muted-foreground text-center pt-4 border-t">
        By submitting this review, you confirm that the information provided is accurate and 
        you consent to its publication on this website after verification and approval.
      </div>
    </div>
  );
}
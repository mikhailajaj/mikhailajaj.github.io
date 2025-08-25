"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSubmissionSchema } from "@/lib/validation/review";
import type { ReviewSubmissionData } from "@/lib/types/review";
import { PersonalInfoStep } from "./steps/PersonalInfoStep";
import { ReviewContentStep } from "./steps/ReviewContentStep";
import { VerificationStep } from "./steps/VerificationStep";
import { SuccessStep } from "./steps/SuccessStep";
import { FormErrorBoundary } from "./components/FormErrorBoundary";
import { FormProgressIndicator, useFormSteps } from "./components/FormProgressIndicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReviewFormValidation } from "@/hooks/useReviewFormValidation";
import { useReviewFormState } from "@/hooks/useReviewFormState";
import { cn } from "@/lib/utils";

interface ReviewSubmissionFormProps {
  onSubmit?: (data: ReviewSubmissionData) => Promise<void>;
  onSuccess?: (reviewId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

interface FormState {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  isSuccess: boolean;
  reviewId?: string;
  error?: string;
}

export function ReviewSubmissionForm({
  onSubmit,
  onSuccess,
  onError,
  className
}: ReviewSubmissionFormProps) {
  const form = useForm<ReviewSubmissionData>({
    resolver: zodResolver(reviewSubmissionSchema),
    mode: "onBlur",
    defaultValues: {
      rating: 5,
      recommendation: true,
      skills: [],
      honeypot: "" // Security field
    }
  });

  // Enhanced form state management
  const formStateManager = useReviewFormState({
    form,
    onStepChange: (step) => {
      console.log(`Moved to step ${step}`);
    },
    onSubmissionSuccess: (reviewId) => {
      onSuccess?.(reviewId);
    },
    onSubmissionError: (error) => {
      onError?.(error);
    }
  });

  // Enhanced validation
  const validation = useReviewFormValidation({
    form,
    currentStep: formStateManager.progress.currentStep
  });

  // Generate step data for progress indicator
  const steps = useFormSteps(
    formStateManager.progress.currentStep,
    formStateManager.progress.completedSteps,
    // Map validation errors to step errors
    validation.stepValidations.reduce((acc, step) => {
      acc[step.step] = step.errors.length > 0;
      return acc;
    }, {} as Record<number, boolean>)
  );

  // Use the enhanced form state methods
  const { nextStep, prevStep } = formStateManager;

  // Use the enhanced submission method
  const handleFormSubmit = async () => {
    if (onSubmit) {
      // Custom submission handler
      const data = form.getValues();
      await onSubmit({ ...data, timestamp: Date.now() });
    } else {
      // Use built-in submission
      await formStateManager.submitForm();
    }
  };

  // Progress indicator is now handled by the FormProgressIndicator component

  const renderCurrentStep = () => {
    const { currentStep } = formStateManager.progress;
    const { isSubmitting, error, reviewId } = formStateManager.submission;
    
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            form={form}
            onNext={nextStep}
            errors={form.formState.errors}
            validation={validation}
          />
        );
      case 2:
        return (
          <ReviewContentStep
            form={form}
            onNext={nextStep}
            onPrev={prevStep}
            errors={form.formState.errors}
            validation={validation}
          />
        );
      case 3:
        return (
          <VerificationStep
            form={form}
            onSubmit={handleFormSubmit}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      case 4:
        return (
          <SuccessStep
            reviewId={reviewId}
            onStartNew={formStateManager.resetForm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormErrorBoundary>
      <Card className={cn("max-w-2xl mx-auto", className)}>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Submit a Testimonial
          </CardTitle>
          {formStateManager.progress.currentStep < 4 && (
            <FormProgressIndicator
              steps={steps}
              showDescriptions={false}
              className="mt-6"
            />
          )}
        </CardHeader>
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </FormErrorBoundary>
  );
}
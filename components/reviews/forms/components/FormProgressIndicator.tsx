"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  hasError?: boolean;
}

interface FormProgressIndicatorProps {
  steps: Step[];
  className?: string;
  variant?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
}

export function FormProgressIndicator({
  steps,
  className,
  variant = 'horizontal',
  showDescriptions = false
}: FormProgressIndicatorProps) {
  if (variant === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-start space-x-3">
            {/* Step Icon */}
            <div className="flex-shrink-0">
              {step.isCompleted ? (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              ) : step.isCurrent ? (
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  step.hasError 
                    ? "border-destructive bg-destructive/10" 
                    : "border-primary bg-primary/10"
                )}>
                  {step.hasError ? (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  ) : (
                    <span className="text-sm font-semibold text-primary">
                      {step.number}
                    </span>
                  )}
                </div>
              ) : (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Circle className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-medium",
                step.isCompleted 
                  ? "text-green-600" 
                  : step.isCurrent 
                    ? step.hasError 
                      ? "text-destructive" 
                      : "text-primary"
                    : "text-muted-foreground"
              )}>
                {step.title}
              </div>
              {showDescriptions && step.description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-4 mt-8 w-px h-6 bg-border" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={cn("w-full", className)}>
      {/* Step Labels */}
      <div className="flex justify-between mb-2">
        {steps.map((step) => (
          <div
            key={step.number}
            className={cn(
              "text-xs font-medium transition-colors text-center flex-1",
              step.isCompleted 
                ? "text-green-600" 
                : step.isCurrent 
                  ? step.hasError 
                    ? "text-destructive" 
                    : "text-primary"
                  : "text-muted-foreground"
            )}
          >
            <div className="truncate px-1">{step.title}</div>
            {showDescriptions && step.description && (
              <div className="text-xs text-muted-foreground mt-1 truncate px-1">
                {step.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          {/* Progress Fill */}
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300 ease-in-out",
              steps.some(s => s.isCurrent && s.hasError) 
                ? "bg-destructive" 
                : "bg-primary"
            )}
            style={{
              width: `${(steps.filter(s => s.isCompleted).length / steps.length) * 100}%`
            }}
          />
        </div>

        {/* Step Indicators */}
        <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                "w-4 h-4 rounded-full border-2 bg-background transition-colors",
                "transform -translate-y-1",
                step.isCompleted
                  ? "border-green-600 bg-green-600"
                  : step.isCurrent
                    ? step.hasError
                      ? "border-destructive bg-destructive"
                      : "border-primary bg-primary"
                    : "border-muted-foreground bg-background"
              )}
              style={{
                left: `${(index / (steps.length - 1)) * 100}%`,
                transform: 'translateX(-50%) translateY(-25%)'
              }}
            >
              {step.isCompleted && (
                <CheckCircle className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
              )}
              {step.isCurrent && step.hasError && (
                <AlertCircle className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      {showDescriptions && (
        <div className="mt-4 text-center">
          {steps.map((step) => {
            if (!step.isCurrent) return null;
            
            return (
              <div key={step.number} className="space-y-1">
                <div className={cn(
                  "text-sm font-medium",
                  step.hasError ? "text-destructive" : "text-primary"
                )}>
                  Step {step.number}: {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Hook to generate step data for the progress indicator
 */
export function useFormSteps(currentStep: number, completedSteps: number[], stepErrors?: Record<number, boolean>) {
  const stepDefinitions = [
    {
      number: 1,
      title: 'Personal Info',
      description: 'Your contact information and professional relationship'
    },
    {
      number: 2,
      title: 'Review Content',
      description: 'Your testimonial, rating, and feedback'
    },
    {
      number: 3,
      title: 'Verification',
      description: 'Review and submit your testimonial'
    },
    {
      number: 4,
      title: 'Complete',
      description: 'Confirmation and next steps'
    }
  ];

  return stepDefinitions.map(step => ({
    ...step,
    isCompleted: completedSteps.includes(step.number),
    isCurrent: currentStep === step.number,
    hasError: stepErrors?.[step.number] || false
  }));
}
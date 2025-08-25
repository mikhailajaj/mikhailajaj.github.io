"use client";

import React from "react";
import { UseFormReturn, FieldErrors } from "react-hook-form";
import type { ReviewSubmissionData, ReviewerRelationship } from "@/lib/types/review";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PersonalInfoStepProps {
  form: UseFormReturn<ReviewSubmissionData>;
  onNext: () => Promise<boolean>;
  errors: FieldErrors<ReviewSubmissionData>;
  validation?: any; // Enhanced validation hook
}

const relationshipOptions: { value: ReviewerRelationship; label: string; description: string }[] = [
  {
    value: 'professor',
    label: 'Professor/Instructor',
    description: 'Academic supervisor or course instructor'
  },
  {
    value: 'colleague',
    label: 'Colleague',
    description: 'Peer or team member'
  },
  {
    value: 'supervisor',
    label: 'Supervisor/Manager',
    description: 'Direct supervisor or manager'
  },
  {
    value: 'collaborator',
    label: 'Collaborator',
    description: 'Project partner or collaborator'
  },
  {
    value: 'client',
    label: 'Client',
    description: 'Client or customer'
  }
];

export function PersonalInfoStep({ form, onNext, errors, validation }: PersonalInfoStepProps) {
  const { register, watch, setValue } = form;
  const selectedRelationship = watch('relationship');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
        <p className="text-muted-foreground">
          Please provide your contact information and professional relationship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="required">
            Full Name *
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            {...register('name')}
            className={cn(errors.name && "border-destructive")}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="required">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register('email')}
            className={cn(errors.email && "border-destructive")}
            aria-describedby={errors.email ? "email-error" : "email-help"}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
          <p id="email-help" className="text-xs text-muted-foreground">
            We'll send a verification email to this address
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Job Title
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Senior Developer, Professor"
            {...register('title')}
            className={cn(errors.title && "border-destructive")}
            aria-describedby={errors.title ? "title-error" : undefined}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p id="title-error" className="text-sm text-destructive" role="alert">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">
            Organization
          </Label>
          <Input
            id="organization"
            type="text"
            placeholder="e.g., University, Company Name"
            {...register('organization')}
            className={cn(errors.organization && "border-destructive")}
            aria-describedby={errors.organization ? "organization-error" : undefined}
            aria-invalid={!!errors.organization}
          />
          {errors.organization && (
            <p id="organization-error" className="text-sm text-destructive" role="alert">
              {errors.organization.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="required">
          Professional Relationship *
        </Label>
        <fieldset 
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          aria-describedby={errors.relationship ? "relationship-error" : undefined}
          aria-invalid={!!errors.relationship}
        >
          <legend className="sr-only">Select your professional relationship</legend>
          {relationshipOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "relative cursor-pointer rounded-lg border p-4 transition-colors hover:bg-muted/50",
                selectedRelationship === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
              onClick={() => setValue('relationship', option.value)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  value={option.value}
                  {...register('relationship')}
                  className="mt-1"
                  id={`relationship-${option.value}`}
                  aria-describedby={`relationship-${option.value}-desc`}
                />
                <div className="flex-1">
                  <label htmlFor={`relationship-${option.value}`} className="font-medium cursor-pointer">
                    {option.label}
                  </label>
                  <div id={`relationship-${option.value}-desc`} className="text-sm text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </fieldset>
        {errors.relationship && (
          <p id="relationship-error" className="text-sm text-destructive" role="alert">
            {errors.relationship.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedinUrl">
          LinkedIn Profile (Optional)
        </Label>
        <Input
          id="linkedinUrl"
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          {...register('linkedinUrl')}
          className={cn(errors.linkedinUrl && "border-destructive")}
          aria-describedby={errors.linkedinUrl ? "linkedin-error" : "linkedin-help"}
          aria-invalid={!!errors.linkedinUrl}
        />
        {errors.linkedinUrl && (
          <p id="linkedin-error" className="text-sm text-destructive" role="alert">
            {errors.linkedinUrl.message}
          </p>
        )}
        <p id="linkedin-help" className="text-xs text-muted-foreground">
          Adding your LinkedIn profile helps verify your professional identity
        </p>
      </div>

      {/* Hidden honeypot field for spam protection */}
      <input
        type="text"
        {...register('honeypot')}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex justify-end pt-4">
        <Button 
          onClick={async () => {
            const success = await onNext();
            if (!success) {
              // Handle validation failure if needed
              console.log('Validation failed for step 1');
            }
          }} 
          size="lg"
          disabled={validation?.isStepValid ? !validation.isStepValid(1) : false}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}
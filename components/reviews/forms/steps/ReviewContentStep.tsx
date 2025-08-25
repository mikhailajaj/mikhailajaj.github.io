"use client";

import React, { useState } from "react";
import { UseFormReturn, FieldErrors } from "react-hook-form";
import type { ReviewSubmissionData } from "@/lib/types/review";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Star, Plus, X } from "lucide-react";

interface ReviewContentStepProps {
  form: UseFormReturn<ReviewSubmissionData>;
  onNext: () => Promise<boolean>;
  onPrev: () => void;
  errors: FieldErrors<ReviewSubmissionData>;
  validation?: any; // Enhanced validation hook
}

export function ReviewContentStep({ form, onNext, onPrev, errors, validation }: ReviewContentStepProps) {
  const { register, watch, setValue, getValues } = form;
  const [newSkill, setNewSkill] = useState("");
  
  const rating = watch('rating');
  const testimonial = watch('testimonial');
  const skills = watch('skills') || [];
  const recommendation = watch('recommendation');

  const handleRatingChange = (newRating: number) => {
    setValue('rating', newRating);
  };

  const addSkill = () => {
    if (newSkill.trim() && skills.length < 10) {
      const updatedSkills = [...skills, newSkill.trim()];
      setValue('skills', updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setValue('skills', updatedSkills);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const characterCount = testimonial?.length || 0;
  const minLength = 50;
  const maxLength = 2000;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Review</h3>
        <p className="text-muted-foreground">
          Share your experience and provide a rating for the work quality.
        </p>
      </div>

      {/* Rating Section */}
      <div className="space-y-3">
        <Label className="required">Overall Rating *</Label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={cn(
                "p-1 rounded transition-colors hover:bg-muted",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              <Star
                className={cn(
                  "w-8 h-8 transition-colors",
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground hover:text-yellow-400"
                )}
              />
            </button>
          ))}
          <span className="ml-4 text-sm text-muted-foreground">
            {rating}/5 stars
          </span>
        </div>
        {errors.rating && (
          <p className="text-sm text-destructive">{errors.rating.message}</p>
        )}
      </div>

      <Separator />

      {/* Testimonial Section */}
      <div className="space-y-3">
        <Label htmlFor="testimonial" className="required">
          Your Testimonial *
        </Label>
        <Textarea
          id="testimonial"
          placeholder="Share your experience working with Mikhail. What projects did you collaborate on? What skills and qualities stood out? How would you describe the quality of work and professionalism?"
          rows={6}
          {...register('testimonial')}
          className={cn(
            "resize-none",
            errors.testimonial && "border-destructive",
            characterCount < minLength && "border-yellow-500",
            characterCount >= minLength && characterCount <= maxLength && "border-green-500"
          )}
        />
        <div className="flex justify-between text-xs">
          <div className={cn(
            "transition-colors",
            characterCount < minLength ? "text-yellow-600" : 
            characterCount > maxLength ? "text-destructive" : "text-green-600"
          )}>
            {characterCount < minLength 
              ? `${minLength - characterCount} more characters needed`
              : characterCount > maxLength
              ? `${characterCount - maxLength} characters over limit`
              : "Good length"
            }
          </div>
          <div className={cn(
            "transition-colors",
            characterCount > maxLength ? "text-destructive" : "text-muted-foreground"
          )}>
            {characterCount}/{maxLength}
          </div>
        </div>
        {errors.testimonial && (
          <p className="text-sm text-destructive">{errors.testimonial.message}</p>
        )}
      </div>

      {/* Project Association */}
      <div className="space-y-2">
        <Label htmlFor="projectAssociation">
          Associated Project (Optional)
        </Label>
        <Input
          id="projectAssociation"
          type="text"
          placeholder="e.g., E-commerce Platform, Data Analysis Dashboard"
          {...register('projectAssociation')}
          className={cn(errors.projectAssociation && "border-destructive")}
        />
        {errors.projectAssociation && (
          <p className="text-sm text-destructive">{errors.projectAssociation.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Mention any specific project you worked on together
        </p>
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <Label>
          Key Skills Observed (Optional)
        </Label>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="e.g., React, Problem Solving, Leadership"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={skills.length >= 10}
          />
          <Button
            type="button"
            onClick={addSkill}
            disabled={!newSkill.trim() || skills.length >= 10}
            size="icon"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground">
          Add up to 10 skills you observed. Press Enter or click + to add.
        </p>
      </div>

      <Separator />

      {/* Recommendation Section */}
      <div className="space-y-3">
        <Label className="required">
          Would you recommend Mikhail for similar work? *
        </Label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="true"
              checked={recommendation === true}
              onChange={() => setValue('recommendation', true)}
              className="text-primary focus:ring-primary"
            />
            <span>Yes, I would recommend</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="false"
              checked={recommendation === false}
              onChange={() => setValue('recommendation', false)}
              className="text-primary focus:ring-primary"
            />
            <span>No, I would not recommend</span>
          </label>
        </div>
        {errors.recommendation && (
          <p className="text-sm text-destructive">{errors.recommendation.message}</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrev} variant="outline" size="lg">
          Previous
        </Button>
        <Button 
          onClick={async () => {
            const success = await onNext();
            if (!success) {
              console.log('Validation failed for step 2');
            }
          }} 
          size="lg"
          disabled={validation?.isStepValid ? !validation.isStepValid(2) : false}
        >
          Continue to Verification
        </Button>
      </div>
    </div>
  );
}
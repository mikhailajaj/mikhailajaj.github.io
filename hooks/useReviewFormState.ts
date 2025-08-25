/**
 * Review Form State Management Hook
 * 
 * Custom hook for managing the overall state of the review submission form,
 * including step navigation, progress tracking, and submission state
 */

import { useState, useCallback, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { ReviewSubmissionData } from '@/lib/types/review';

interface FormProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  canProceed: boolean;
  canGoBack: boolean;
  progressPercentage: number;
}

interface SubmissionState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error?: string;
  reviewId?: string;
  retryCount: number;
  lastAttempt?: Date;
}

interface FormStateConfig {
  totalSteps?: number;
  maxRetries?: number;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

interface UseReviewFormStateProps {
  form: UseFormReturn<ReviewSubmissionData>;
  config?: FormStateConfig;
  onStepChange?: (step: number) => void;
  onSubmissionSuccess?: (reviewId: string) => void;
  onSubmissionError?: (error: Error) => void;
}

interface UseReviewFormStateReturn {
  progress: FormProgress;
  submission: SubmissionState;
  nextStep: () => Promise<boolean>;
  prevStep: () => void;
  goToStep: (step: number) => Promise<boolean>;
  submitForm: () => Promise<boolean>;
  retrySubmission: () => Promise<boolean>;
  resetForm: () => void;
  saveProgress: () => void;
  loadProgress: () => boolean;
  clearSavedProgress: () => void;
}

const DEFAULT_CONFIG: Required<FormStateConfig> = {
  totalSteps: 4,
  maxRetries: 3,
  autoSave: true,
  autoSaveInterval: 30000 // 30 seconds
};

const STORAGE_KEY = 'review-form-progress';

export function useReviewFormState({
  form,
  config = {},
  onStepChange,
  onSubmissionSuccess,
  onSubmissionError
}: UseReviewFormStateProps): UseReviewFormStateReturn {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [progress, setProgress] = useState<FormProgress>({
    currentStep: 1,
    totalSteps: finalConfig.totalSteps,
    completedSteps: [],
    canProceed: false,
    canGoBack: false,
    progressPercentage: 0
  });

  const [submission, setSubmission] = useState<SubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    retryCount: 0
  });

  const { trigger, handleSubmit, reset, getValues, formState: { isValid } } = form;

  // Calculate progress percentage
  const calculateProgress = useCallback((currentStep: number, completedSteps: number[]) => {
    const baseProgress = ((currentStep - 1) / finalConfig.totalSteps) * 100;
    const completionBonus = (completedSteps.length / finalConfig.totalSteps) * 10;
    return Math.min(100, Math.round(baseProgress + completionBonus));
  }, [finalConfig.totalSteps]);

  // Update progress state
  const updateProgress = useCallback((updates: Partial<FormProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...updates };
      newProgress.progressPercentage = calculateProgress(
        newProgress.currentStep, 
        newProgress.completedSteps
      );
      newProgress.canGoBack = newProgress.currentStep > 1;
      newProgress.canProceed = newProgress.currentStep < newProgress.totalSteps;
      
      return newProgress;
    });
  }, [calculateProgress]);

  // Validate current step
  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const stepFields: Record<number, (keyof ReviewSubmissionData)[]> = {
      1: ['name', 'email', 'title', 'organization', 'relationship', 'linkedinUrl'],
      2: ['rating', 'testimonial', 'projectAssociation', 'skills', 'recommendation'],
      3: [] // Verification step
    };

    const fieldsToValidate = stepFields[progress.currentStep];
    if (!fieldsToValidate || fieldsToValidate.length === 0) {
      return true;
    }

    return await trigger(fieldsToValidate);
  }, [progress.currentStep, trigger]);

  // Move to next step
  const nextStep = useCallback(async (): Promise<boolean> => {
    const isCurrentStepValid = await validateCurrentStep();
    
    if (!isCurrentStepValid) {
      return false;
    }

    const newStep = progress.currentStep + 1;
    const newCompletedSteps = [...progress.completedSteps];
    
    if (!newCompletedSteps.includes(progress.currentStep)) {
      newCompletedSteps.push(progress.currentStep);
    }

    updateProgress({
      currentStep: newStep,
      completedSteps: newCompletedSteps
    });

    onStepChange?.(newStep);
    return true;
  }, [progress.currentStep, progress.completedSteps, validateCurrentStep, updateProgress, onStepChange]);

  // Move to previous step
  const prevStep = useCallback(() => {
    if (progress.currentStep > 1) {
      const newStep = progress.currentStep - 1;
      updateProgress({ currentStep: newStep });
      onStepChange?.(newStep);
    }
  }, [progress.currentStep, updateProgress, onStepChange]);

  // Go to specific step
  const goToStep = useCallback(async (step: number): Promise<boolean> => {
    if (step < 1 || step > finalConfig.totalSteps) {
      return false;
    }

    // If going forward, validate all steps in between
    if (step > progress.currentStep) {
      for (let i = progress.currentStep; i < step; i++) {
        const tempStep = progress.currentStep;
        updateProgress({ currentStep: i });
        const isValid = await validateCurrentStep();
        updateProgress({ currentStep: tempStep });
        
        if (!isValid) {
          return false;
        }
      }
    }

    updateProgress({ currentStep: step });
    onStepChange?.(step);
    return true;
  }, [finalConfig.totalSteps, progress.currentStep, validateCurrentStep, updateProgress, onStepChange]);

  // Submit form
  const submitForm = useCallback(async (): Promise<boolean> => {
    if (submission.isSubmitting) {
      return false;
    }

    setSubmission(prev => ({
      ...prev,
      isSubmitting: true,
      error: undefined,
      lastAttempt: new Date()
    }));

    try {
      const formData = getValues();
      
      // Add security timestamp
      const submissionData = {
        ...formData,
        timestamp: Date.now()
      };

      const response = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Submission failed');
      }

      const result = await response.json();
      
      setSubmission(prev => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        reviewId: result.data?.reviewId,
        retryCount: 0
      }));

      // Move to success step
      updateProgress({ currentStep: finalConfig.totalSteps });
      
      // Clear saved progress on successful submission
      clearSavedProgress();

      if (onSubmissionSuccess && result.data?.reviewId) {
        onSubmissionSuccess(result.data.reviewId);
      }

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setSubmission(prev => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));

      if (onSubmissionError) {
        onSubmissionError(error instanceof Error ? error : new Error(errorMessage));
      }

      return false;
    }
  }, [submission.isSubmitting, getValues, finalConfig.totalSteps, updateProgress, onSubmissionSuccess, onSubmissionError]);

  // Retry submission
  const retrySubmission = useCallback(async (): Promise<boolean> => {
    if (submission.retryCount >= finalConfig.maxRetries) {
      return false;
    }

    return await submitForm();
  }, [submission.retryCount, finalConfig.maxRetries, submitForm]);

  // Reset form
  const resetForm = useCallback(() => {
    reset();
    setProgress({
      currentStep: 1,
      totalSteps: finalConfig.totalSteps,
      completedSteps: [],
      canProceed: true,
      canGoBack: false,
      progressPercentage: 0
    });
    setSubmission({
      isSubmitting: false,
      isSuccess: false,
      retryCount: 0
    });
    clearSavedProgress();
  }, [reset, finalConfig.totalSteps]);

  // Save progress to localStorage
  const saveProgress = useCallback(() => {
    if (!finalConfig.autoSave) return;

    try {
      const progressData = {
        formData: getValues(),
        progress,
        timestamp: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (error) {
      console.warn('Failed to save form progress:', error);
    }
  }, [finalConfig.autoSave, getValues, progress]);

  // Load progress from localStorage
  const loadProgress = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;

      const progressData = JSON.parse(saved);
      const age = Date.now() - progressData.timestamp;
      
      // Don't load progress older than 24 hours
      if (age > 24 * 60 * 60 * 1000) {
        clearSavedProgress();
        return false;
      }

      // Restore form data
      Object.entries(progressData.formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.setValue(key as keyof ReviewSubmissionData, value);
        }
      });

      // Restore progress state
      setProgress(progressData.progress);
      
      return true;
    } catch (error) {
      console.warn('Failed to load form progress:', error);
      clearSavedProgress();
      return false;
    }
  }, [form]);

  // Clear saved progress
  const clearSavedProgress = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear saved progress:', error);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!finalConfig.autoSave) return;

    const interval = setInterval(saveProgress, finalConfig.autoSaveInterval);
    return () => clearInterval(interval);
  }, [finalConfig.autoSave, finalConfig.autoSaveInterval, saveProgress]);

  // Save progress when form data changes
  useEffect(() => {
    if (finalConfig.autoSave) {
      const subscription = form.watch(() => {
        // Debounce auto-save
        const timeoutId = setTimeout(saveProgress, 1000);
        return () => clearTimeout(timeoutId);
      });
      
      return () => subscription.unsubscribe();
    }
  }, [form, finalConfig.autoSave, saveProgress]);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    submission,
    nextStep,
    prevStep,
    goToStep,
    submitForm,
    retrySubmission,
    resetForm,
    saveProgress,
    loadProgress,
    clearSavedProgress
  };
}
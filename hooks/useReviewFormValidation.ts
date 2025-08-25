/**
 * Review Form Validation Hook
 * 
 * Custom hook for managing form validation state and providing
 * real-time validation feedback for the review submission form
 */

import { useState, useCallback, useEffect } from 'react';
import { UseFormReturn, FieldErrors } from 'react-hook-form';
import type { ReviewSubmissionData } from '@/lib/types/review';
import { reviewSubmissionSchema } from '@/lib/validation/review';
import { z } from 'zod';

interface ValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValidating: boolean;
}

interface StepValidation {
  step: number;
  fields: (keyof ReviewSubmissionData)[];
  isValid: boolean;
  errors: string[];
}

interface UseReviewFormValidationProps {
  form: UseFormReturn<ReviewSubmissionData>;
  currentStep: number;
}

interface UseReviewFormValidationReturn {
  validationState: ValidationState;
  stepValidations: StepValidation[];
  validateStep: (step: number) => Promise<boolean>;
  validateField: (field: keyof ReviewSubmissionData) => Promise<boolean>;
  getFieldError: (field: keyof ReviewSubmissionData) => string | undefined;
  isStepValid: (step: number) => boolean;
  getStepProgress: (step: number) => number;
  markFieldTouched: (field: keyof ReviewSubmissionData) => void;
  resetValidation: () => void;
}

// Define which fields belong to each step
const STEP_FIELDS: Record<number, (keyof ReviewSubmissionData)[]> = {
  1: ['name', 'email', 'title', 'organization', 'relationship', 'linkedinUrl'],
  2: ['rating', 'testimonial', 'projectAssociation', 'skills', 'recommendation', 'workPeriod'],
  3: [] // Verification step - no additional fields to validate
};

// Field validation priorities (for real-time validation)
const VALIDATION_PRIORITIES: Record<keyof ReviewSubmissionData, number> = {
  name: 1,
  email: 1,
  relationship: 1,
  rating: 1,
  testimonial: 1,
  recommendation: 1,
  title: 2,
  organization: 2,
  linkedinUrl: 3,
  projectAssociation: 3,
  skills: 3,
  workPeriod: 3,
  honeypot: 0,
  timestamp: 0
};

export function useReviewFormValidation({
  form,
  currentStep
}: UseReviewFormValidationProps): UseReviewFormValidationReturn {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: false,
    errors: {},
    touched: {},
    isValidating: false
  });

  const { watch, formState: { errors } } = form;
  const formData = watch();

  // Convert React Hook Form errors to our format
  const convertErrors = useCallback((formErrors: FieldErrors<ReviewSubmissionData>) => {
    const errorMap: Record<string, string> = {};
    
    Object.entries(formErrors).forEach(([field, error]) => {
      if (error?.message) {
        errorMap[field] = error.message;
      }
    });
    
    return errorMap;
  }, []);

  // Validate a specific field
  const validateField = useCallback(async (field: keyof ReviewSubmissionData): Promise<boolean> => {
    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const isValid = await form.trigger(field);
      const currentErrors = form.formState.errors;
      
      setValidationState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: isValid ? '' : (currentErrors[field]?.message || 'Invalid value')
        },
        touched: {
          ...prev.touched,
          [field]: true
        },
        isValidating: false
      }));
      
      return isValid;
    } catch (error) {
      setValidationState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: 'Validation error occurred'
        },
        isValidating: false
      }));
      return false;
    }
  }, [form]);

  // Validate all fields for a specific step
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    const fieldsToValidate = STEP_FIELDS[step] || [];
    
    if (fieldsToValidate.length === 0) {
      return true;
    }

    setValidationState(prev => ({ ...prev, isValidating: true }));
    
    try {
      const isValid = await form.trigger(fieldsToValidate);
      const currentErrors = form.formState.errors;
      
      // Convert errors inline to avoid unstable dependencies
      const errorMap: Record<string, string> = {};
      Object.entries(currentErrors).forEach(([field, error]) => {
        if (error?.message) {
          errorMap[field] = error.message;
        }
      });
      
      setValidationState(prev => ({
        ...prev,
        errors: errorMap,
        isValidating: false
      }));
      
      return isValid;
    } catch (error) {
      setValidationState(prev => ({ ...prev, isValidating: false }));
      return false;
    }
  }, [form]);

  // Check if a step is valid
  const isStepValid = useCallback((step: number): boolean => {
    const fieldsToCheck = STEP_FIELDS[step] || [];
    
    if (fieldsToCheck.length === 0) {
      return true;
    }

    const currentFormData = form.getValues();
    
    return fieldsToCheck.every(field => {
      const value = currentFormData[field];
      
      // Check if field has a value (for required fields)
      if (['name', 'email', 'relationship', 'rating', 'testimonial', 'recommendation'].includes(field)) {
        if (value === undefined || value === null || value === '') {
          return false;
        }
      }
      
      // Check if field has validation errors
      return !errors[field];
    });
  }, [form, errors]);

  // Get validation progress for a step (0-100)
  const getStepProgress = useCallback((step: number): number => {
    const fieldsToCheck = STEP_FIELDS[step] || [];
    
    if (fieldsToCheck.length === 0) {
      return 100;
    }

    const currentFormData = form.getValues();
    
    const validFields = fieldsToCheck.filter(field => {
      const value = currentFormData[field];
      const hasValue = value !== undefined && value !== null && value !== '';
      const hasNoError = !errors[field];
      
      return hasValue && hasNoError;
    });

    return Math.round((validFields.length / fieldsToCheck.length) * 100);
  }, [form, errors]);

  // Get error message for a specific field
  const getFieldError = useCallback((field: keyof ReviewSubmissionData): string | undefined => {
    return validationState.errors[field] || errors[field]?.message;
  }, [validationState.errors, errors]);

  // Mark a field as touched
  const markFieldTouched = useCallback((field: keyof ReviewSubmissionData) => {
    setValidationState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: true
      }
    }));
  }, []);

  // Reset validation state
  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: false,
      errors: {},
      touched: {},
      isValidating: false
    });
  }, []);

  // Generate step validations
  const stepValidations: StepValidation[] = [1, 2, 3].map(step => {
    const fields = STEP_FIELDS[step] || [];
    const stepErrors = fields
      .map(field => getFieldError(field))
      .filter(Boolean) as string[];
    
    return {
      step,
      fields,
      isValid: isStepValid(step),
      errors: stepErrors
    };
  });

  // Update validation state when form errors change
  useEffect(() => {
    const currentErrors: Record<string, string> = {};
    
    // Convert errors without using the unstable convertErrors function
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        currentErrors[field] = error.message;
      }
    });

    const fieldsToCheck = STEP_FIELDS[currentStep] || [];
    
    // Calculate step validity based on current form values
    const currentFormData = form.getValues();
    const stepValid = fieldsToCheck.length === 0 || fieldsToCheck.every(field => {
      const value = currentFormData[field];
      
      // Check if field has a value (for required fields)
      if (['name', 'email', 'relationship', 'rating', 'testimonial', 'recommendation'].includes(field)) {
        if (value === undefined || value === null || value === '') {
          return false;
        }
      }
      
      // Check if field has validation errors
      return !errors[field];
    });
    
    const overallValid = Object.keys(currentErrors).length === 0 && stepValid;
    
    setValidationState(prev => {
      // Only update if something actually changed to prevent unnecessary re-renders
      const errorsChanged = JSON.stringify(prev.errors) !== JSON.stringify(currentErrors);
      const validityChanged = prev.isValid !== overallValid;
      
      if (!errorsChanged && !validityChanged) {
        return prev;
      }
      
      return {
        ...prev,
        errors: currentErrors,
        isValid: overallValid
      };
    });
  }, [errors, currentStep, form]);

  // Real-time validation for high-priority fields
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const subscription = form.watch((value, { name }) => {
      if (name && VALIDATION_PRIORITIES[name as keyof ReviewSubmissionData] <= 2) {
        // Clear previous timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Debounce validation for real-time fields
        timeoutId = setTimeout(async () => {
          try {
            const isValid = await form.trigger(name as keyof ReviewSubmissionData);
            const currentErrors = form.formState.errors;
            
            setValidationState(prev => ({
              ...prev,
              errors: {
                ...prev.errors,
                [name]: isValid ? '' : (currentErrors[name as keyof ReviewSubmissionData]?.message || 'Invalid value')
              },
              touched: {
                ...prev.touched,
                [name]: true
              },
              isValidating: false
            }));
          } catch (error) {
            setValidationState(prev => ({
              ...prev,
              errors: {
                ...prev.errors,
                [name]: 'Validation error occurred'
              },
              isValidating: false
            }));
          }
        }, 300);
      }
    });
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      subscription.unsubscribe();
    };
  }, [form]);

  return {
    validationState,
    stepValidations,
    validateStep,
    validateField,
    getFieldError,
    isStepValid,
    getStepProgress,
    markFieldTouched,
    resetValidation
  };
}
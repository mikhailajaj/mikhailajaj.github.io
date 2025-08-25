"use client";

import React, { useState, useEffect } from 'react';
import { UseFormReturn, FieldPath } from 'react-hook-form';
import type { ReviewSubmissionData } from '@/lib/types/review';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';

interface ValidatedFieldProps {
  form: UseFormReturn<ReviewSubmissionData>;
  name: FieldPath<ReviewSubmissionData>;
  label: string;
  type?: 'text' | 'email' | 'url' | 'textarea';
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

interface ValidationState {
  isValidating: boolean;
  isValid: boolean;
  error?: string;
  touched: boolean;
}

export function ValidatedField({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  helpText,
  rows = 4,
  maxLength,
  className,
  validateOnBlur = true,
  validateOnChange = false,
  debounceMs = 300
}: ValidatedFieldProps) {
  const [validationState, setValidationState] = useState<ValidationState>({
    isValidating: false,
    isValid: false,
    touched: false
  });

  const { register, watch, trigger, formState: { errors } } = form;
  const fieldValue = watch(name);
  const fieldError = errors[name];

  // Debounced validation
  useEffect(() => {
    if (!validateOnChange || !validationState.touched) return;

    const timeoutId = setTimeout(async () => {
      setValidationState(prev => ({ ...prev, isValidating: true }));
      
      try {
        const isValid = await trigger(name);
        setValidationState(prev => ({
          ...prev,
          isValidating: false,
          isValid,
          error: fieldError?.message
        }));
      } catch (error) {
        setValidationState(prev => ({
          ...prev,
          isValidating: false,
          isValid: false,
          error: 'Validation failed'
        }));
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [fieldValue, name, trigger, fieldError, validateOnChange, validationState.touched, debounceMs]);

  const handleBlur = async () => {
    if (!validateOnBlur) return;

    setValidationState(prev => ({ ...prev, touched: true, isValidating: true }));
    
    try {
      const isValid = await trigger(name);
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        isValid,
        error: fieldError?.message
      }));
    } catch (error) {
      setValidationState(prev => ({
        ...prev,
        isValidating: false,
        isValid: false,
        error: 'Validation failed'
      }));
    }
  };

  const handleFocus = () => {
    setValidationState(prev => ({ ...prev, touched: true }));
  };

  const getValidationIcon = () => {
    if (validationState.isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    }
    
    if (validationState.touched && fieldValue) {
      if (fieldError) {
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      } else {
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      }
    }
    
    return null;
  };

  const getFieldClassName = () => {
    const baseClasses = className || '';
    
    if (!validationState.touched) {
      return baseClasses;
    }
    
    if (validationState.isValidating) {
      return cn(baseClasses, 'border-blue-300 focus:border-blue-500');
    }
    
    if (fieldError) {
      return cn(baseClasses, 'border-destructive focus:border-destructive');
    }
    
    if (fieldValue && !fieldError) {
      return cn(baseClasses, 'border-green-500 focus:border-green-600');
    }
    
    return baseClasses;
  };

  const characterCount = typeof fieldValue === 'string' ? fieldValue.length : 0;
  const showCharacterCount = maxLength && type === 'textarea';

  const renderField = () => {
    const fieldProps = {
      id: name,
      placeholder,
      ...register(name),
      onBlur: handleBlur,
      onFocus: handleFocus,
      className: getFieldClassName(),
      maxLength
    };

    if (type === 'textarea') {
      return (
        <Textarea
          {...fieldProps}
          rows={rows}
        />
      );
    }

    return (
      <Input
        {...fieldProps}
        type={type}
      />
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
          {label}
        </Label>
        {getValidationIcon()}
      </div>
      
      <div className="relative">
        {renderField()}
      </div>

      {/* Character count for textarea */}
      {showCharacterCount && (
        <div className="flex justify-between text-xs">
          <div />
          <div className={cn(
            "transition-colors",
            maxLength && characterCount > maxLength * 0.9 
              ? characterCount > maxLength 
                ? "text-destructive" 
                : "text-yellow-600"
              : "text-muted-foreground"
          )}>
            {characterCount}{maxLength && `/${maxLength}`}
          </div>
        </div>
      )}

      {/* Error message */}
      {fieldError && validationState.touched && (
        <div className="flex items-start space-x-2 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{fieldError.message}</span>
        </div>
      )}

      {/* Help text */}
      {helpText && !fieldError && (
        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}

      {/* Validation success message */}
      {validationState.touched && fieldValue && !fieldError && !validationState.isValidating && (
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Looks good!</span>
        </div>
      )}
    </div>
  );
}
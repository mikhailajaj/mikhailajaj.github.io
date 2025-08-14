/**
 * Form Error Message Component
 * 
 * Accessible form error message component for displaying validation errors.
 * 
 * @fileoverview Form error message component with accessibility features
 */

// 1. React Imports
import React from 'react';

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { cn } from '@/lib/utils/cn';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this component)

/**
 * Form error message props
 */
export interface FormErrorMessageProps {
  /** Error message to display */
  message?: string;
  /** ID of the form field this error is associated with */
  fieldId?: string;
  /** Whether the error is visible */
  visible?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Whether to announce the error to screen readers */
  announce?: boolean;
}

/**
 * Form Error Message Component
 * 
 * Displays validation errors for form fields with proper accessibility attributes.
 * 
 * @example
 * ```tsx
 * <div>
 *   <label htmlFor="email">Email</label>
 *   <input 
 *     id="email"
 *     name="email"
 *     aria-invalid={errors.email ? 'true' : 'false'}
 *     aria-describedby={errors.email ? 'email-error' : undefined}
 *   />
 *   <FormErrorMessage 
 *     message={errors.email} 
 *     fieldId="email"
 *     visible={!!errors.email}
 *   />
 * </div>
 * ```
 */
export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  fieldId,
  visible = !!message,
  className,
  announce = true,
}) => {
  // Generate unique ID for the error message
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  
  // Don't render anything if there's no message or it's not visible
  if (!message || !visible) {
    return null;
  }

  return (
    <div
      id={errorId}
      className={cn(
        'flex items-center space-x-2 mt-1 text-sm text-red-600 dark:text-red-400',
        className
      )}
      role="alert"
      aria-live={announce ? 'assertive' : 'off'}
    >
      <svg 
        className="w-4 h-4 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path 
          fillRule="evenodd" 
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
          clipRule="evenodd" 
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};

/**
 * Form Errors Summary Component
 * 
 * Displays a summary of all form errors.
 */
export const FormErrorsSummary: React.FC<{
  /** List of error messages */
  errors: Record<string, string>;
  /** Whether the summary is visible */
  visible?: boolean;
  /** Additional CSS class names */
  className?: string;
}> = ({ errors, visible = true, className }) => {
  const errorMessages = Object.values(errors).filter(Boolean);
  
  if (!visible || errorMessages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'p-4 mb-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
        className
      )}
      role="alert"
      aria-labelledby="form-errors-heading"
    >
      <h3 id="form-errors-heading" className="text-sm font-medium text-red-800 dark:text-red-400">
        Please fix the following errors:
      </h3>
      <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside">
        {errorMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default FormErrorMessage;
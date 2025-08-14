/**
 * Error Handler Hook
 * 
 * Custom hook for handling errors in components with consistent reporting.
 * 
 * @fileoverview Error handling hook with context integration
 */

"use client";

// 1. React Imports
import { useCallback } from 'react';

// 2. External Libraries
// (None in this hook)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { useError, type ErrorSeverity, type ErrorSource } from './ErrorContext';

// 4. Internal Relative Imports
// (None in this hook)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this hook)

/**
 * Error handler options
 */
interface ErrorHandlerOptions {
  /** Component name for error reporting */
  componentName?: string;
  /** Default error severity */
  defaultSeverity?: ErrorSeverity;
  /** Default error source */
  defaultSource?: ErrorSource;
  /** Whether to show user-friendly messages */
  showUserMessage?: boolean;
  /** Custom error message transformer */
  messageTransformer?: (error: Error) => string;
}

/**
 * Error handler return type
 */
interface ErrorHandler {
  /** Handle an error with automatic reporting */
  handleError: (
    error: Error | unknown,
    options?: {
      severity?: ErrorSeverity;
      source?: ErrorSource;
      userMessage?: string;
      context?: Record<string, any>;
    }
  ) => void;
  /** Handle async operations with error catching */
  handleAsync: <T>(
    asyncFn: () => Promise<T>,
    options?: {
      severity?: ErrorSeverity;
      source?: ErrorSource;
      userMessage?: string;
      context?: Record<string, any>;
    }
  ) => Promise<T | null>;
  /** Create an error boundary wrapper */
  withErrorBoundary: <T extends any[]>(
    fn: (...args: T) => void,
    options?: {
      severity?: ErrorSeverity;
      source?: ErrorSource;
      userMessage?: string;
      context?: Record<string, any>;
    }
  ) => (...args: T) => void;
}

/**
 * Default error message transformer
 */
const defaultMessageTransformer = (error: Error): string => {
  // Common error message transformations
  if (error.message.includes('fetch')) {
    return 'Network error occurred. Please check your connection and try again.';
  }
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (error.message.includes('unauthorized') || error.message.includes('401')) {
    return 'You are not authorized to perform this action.';
  }
  
  if (error.message.includes('forbidden') || error.message.includes('403')) {
    return 'Access denied. You do not have permission to perform this action.';
  }
  
  if (error.message.includes('not found') || error.message.includes('404')) {
    return 'The requested resource was not found.';
  }
  
  if (error.message.includes('server') || error.message.includes('500')) {
    return 'Server error occurred. Please try again later.';
  }
  
  // Return original message if no transformation applies
  return error.message || 'An unexpected error occurred.';
};

/**
 * Use Error Handler Hook
 * 
 * Provides consistent error handling across components.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { handleError, handleAsync } = useErrorHandler({
 *     componentName: 'MyComponent',
 *     defaultSeverity: 'medium',
 *     defaultSource: 'component',
 *   });
 * 
 *   const fetchData = async () => {
 *     const data = await handleAsync(
 *       () => fetch('/api/data').then(res => res.json()),
 *       {
 *         source: 'data-fetch',
 *         userMessage: 'Failed to load data',
 *       }
 *     );
 *     
 *     if (data) {
 *       setData(data);
 *     }
 *   };
 * 
 *   const handleSubmit = withErrorBoundary(
 *     (formData) => {
 *       // Form submission logic
 *       submitForm(formData);
 *     },
 *     {
 *       source: 'form-validation',
 *       userMessage: 'Failed to submit form',
 *     }
 *   );
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       // Form content
 *     </form>
 *   );
 * };
 * ```
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}): ErrorHandler => {
  const { addError } = useError();
  
  const {
    componentName,
    defaultSeverity = 'medium',
    defaultSource = 'component',
    showUserMessage = true,
    messageTransformer = defaultMessageTransformer,
  } = options;

  // Handle error with automatic reporting
  const handleError = useCallback(
    (
      error: Error | unknown,
      errorOptions: {
        severity?: ErrorSeverity;
        source?: ErrorSource;
        userMessage?: string;
        context?: Record<string, any>;
      } = {}
    ) => {
      // Convert unknown error to Error object
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Get user-friendly message
      const userMessage = errorOptions.userMessage || 
        (showUserMessage ? messageTransformer(errorObj) : undefined);
      
      // Add error to context
      addError({
        message: errorObj.message,
        severity: errorOptions.severity || defaultSeverity,
        source: errorOptions.source || defaultSource,
        componentName,
        originalError: errorObj,
        userMessage,
        context: errorOptions.context,
      });
    },
    [addError, componentName, defaultSeverity, defaultSource, showUserMessage, messageTransformer]
  );

  // Handle async operations with error catching
  const handleAsync = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      errorOptions: {
        severity?: ErrorSeverity;
        source?: ErrorSource;
        userMessage?: string;
        context?: Record<string, any>;
      } = {}
    ): Promise<T | null> => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, errorOptions);
        return null;
      }
    },
    [handleError]
  );

  // Create error boundary wrapper
  const withErrorBoundary = useCallback(
    <T extends any[]>(
      fn: (...args: T) => void,
      errorOptions: {
        severity?: ErrorSeverity;
        source?: ErrorSource;
        userMessage?: string;
        context?: Record<string, any>;
      } = {}
    ) => {
      return (...args: T) => {
        try {
          fn(...args);
        } catch (error) {
          handleError(error, errorOptions);
        }
      };
    },
    [handleError]
  );

  return {
    handleError,
    handleAsync,
    withErrorBoundary,
  };
};

export default useErrorHandler;
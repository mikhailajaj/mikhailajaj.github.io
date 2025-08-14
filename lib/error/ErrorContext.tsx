/**
 * Error Context
 * 
 * Global error handling context for managing application-wide errors.
 * Provides error state, reporting, and recovery mechanisms.
 * 
 * @fileoverview Error context with Next.js integration
 */

"use client";

// 1. React Imports
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { announceUtils } from '@/lib/utils/accessibility';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this component)

/**
 * Error severity levels
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error source types
 */
export type ErrorSource = 
  | 'component' 
  | 'api' 
  | 'data-fetch' 
  | 'form-validation' 
  | 'authentication' 
  | 'navigation' 
  | 'resource-loading'
  | 'user-interaction'
  | 'system';

/**
 * Application error interface
 */
export interface AppError {
  /** Unique error ID */
  id: string;
  /** Error message */
  message: string;
  /** Original error object */
  originalError?: Error;
  /** Error code */
  code?: string;
  /** Error severity */
  severity: ErrorSeverity;
  /** Error source */
  source: ErrorSource;
  /** Component name where error occurred */
  componentName?: string;
  /** Route where error occurred */
  route?: string;
  /** Timestamp when error occurred */
  timestamp: number;
  /** User-friendly error message */
  userMessage?: string;
  /** Whether error has been seen by user */
  seen: boolean;
  /** Whether error has been reported */
  reported: boolean;
  /** Additional error context */
  context?: Record<string, any>;
}

/**
 * Error context interface
 */
interface ErrorContextType {
  /** Current errors */
  errors: AppError[];
  /** Whether there are any active errors */
  hasErrors: boolean;
  /** Whether there are any critical errors */
  hasCriticalErrors: boolean;
  /** Add a new error */
  addError: (error: Omit<AppError, 'id' | 'timestamp' | 'seen' | 'reported'>) => void;
  /** Remove an error by ID */
  removeError: (id: string) => void;
  /** Clear all errors */
  clearErrors: () => void;
  /** Mark error as seen */
  markErrorAsSeen: (id: string) => void;
  /** Mark error as reported */
  markErrorAsReported: (id: string) => void;
  /** Get errors by severity */
  getErrorsBySeverity: (severity: ErrorSeverity) => AppError[];
  /** Get errors by source */
  getErrorsBySource: (source: ErrorSource) => AppError[];
  /** Get most recent error */
  getMostRecentError: () => AppError | null;
  /** Report error to analytics */
  reportError: (error: AppError) => void;
}

/**
 * Error provider props
 */
interface ErrorProviderProps {
  children: React.ReactNode;
  /** Error reporting service URL */
  reportingEndpoint?: string;
  /** Whether to announce errors to screen readers */
  announceErrors?: boolean;
  /** Whether to persist errors in localStorage */
  persistErrors?: boolean;
}

// Create error context
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

/**
 * Error Provider Component
 * 
 * Provides global error state and management functions.
 * 
 * @example
 * ```tsx
 * <ErrorProvider reportingEndpoint="/api/errors" announceErrors persistErrors>
 *   <App />
 * </ErrorProvider>
 * ```
 */
export const ErrorProvider: React.FC<ErrorProviderProps> = ({
  children,
  reportingEndpoint,
  announceErrors = true,
  persistErrors = true,
}) => {
  // Initialize error state from localStorage if enabled
  const [errors, setErrors] = useState<AppError[]>(() => {
    if (typeof window !== 'undefined' && persistErrors) {
      try {
        const storedErrors = localStorage.getItem('portfolio-errors');
        return storedErrors ? JSON.parse(storedErrors) : [];
      } catch (e) {
        console.warn('Failed to parse stored errors:', e);
        return [];
      }
    }
    return [];
  });

  // Derived state
  const hasErrors = errors.length > 0;
  const hasCriticalErrors = errors.some(error => error.severity === 'critical');

  // Persist errors to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && persistErrors) {
      try {
        localStorage.setItem('portfolio-errors', JSON.stringify(errors));
      } catch (e) {
        console.warn('Failed to store errors:', e);
      }
    }
  }, [errors, persistErrors]);

  // Add a new error
  const addError = useCallback((error: Omit<AppError, 'id' | 'timestamp' | 'seen' | 'reported'>) => {
    const newError: AppError = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      seen: false,
      reported: false,
      route: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    setErrors(prevErrors => [...prevErrors, newError]);

    // Announce error to screen readers if enabled
    if (announceErrors && typeof window !== 'undefined') {
      const message = error.userMessage || error.message;
      announceUtils.announce(
        `Error: ${message}`,
        error.severity === 'critical' ? 'assertive' : 'polite'
      );
    }

    // Automatically report critical errors
    if (error.severity === 'critical') {
      reportErrorToService(newError);
    }

    return newError.id;
  }, [announceErrors]);

  // Remove an error by ID
  const removeError = useCallback((id: string) => {
    setErrors(prevErrors => prevErrors.filter(error => error.id !== id));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Mark error as seen
  const markErrorAsSeen = useCallback((id: string) => {
    setErrors(prevErrors =>
      prevErrors.map(error =>
        error.id === id ? { ...error, seen: true } : error
      )
    );
  }, []);

  // Mark error as reported
  const markErrorAsReported = useCallback((id: string) => {
    setErrors(prevErrors =>
      prevErrors.map(error =>
        error.id === id ? { ...error, reported: true } : error
      )
    );
  }, []);

  // Get errors by severity
  const getErrorsBySeverity = useCallback(
    (severity: ErrorSeverity) => errors.filter(error => error.severity === severity),
    [errors]
  );

  // Get errors by source
  const getErrorsBySource = useCallback(
    (source: ErrorSource) => errors.filter(error => error.source === source),
    [errors]
  );

  // Get most recent error
  const getMostRecentError = useCallback(() => {
    if (errors.length === 0) return null;
    return errors.reduce((latest, error) =>
      error.timestamp > latest.timestamp ? error : latest
    );
  }, [errors]);

  // Report error to service
  const reportErrorToService = useCallback(
    async (error: AppError) => {
      if (!reportingEndpoint || error.reported) return;

      try {
        const response = await fetch(reportingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...error,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          markErrorAsReported(error.id);
        }
      } catch (e) {
        console.error('Failed to report error:', e);
      }
    },
    [reportingEndpoint, markErrorAsReported]
  );

  // Report error (public method)
  const reportError = useCallback(
    (error: AppError) => {
      reportErrorToService(error);

      // Report to analytics if available
      if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'error', {
          event_category: 'Error',
          event_label: error.source,
          value: error.severity === 'critical' ? 1 : 0,
          error_message: error.message,
          error_code: error.code || 'unknown',
          component_name: error.componentName || 'unknown',
        });
      }
    },
    [reportErrorToService]
  );

  // Context value
  const contextValue: ErrorContextType = {
    errors,
    hasErrors,
    hasCriticalErrors,
    addError,
    removeError,
    clearErrors,
    markErrorAsSeen,
    markErrorAsReported,
    getErrorsBySeverity,
    getErrorsBySource,
    getMostRecentError,
    reportError,
  };

  return <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>;
};

/**
 * Use Error Hook
 * 
 * Hook for accessing the error context.
 * 
 * @example
 * ```tsx
 * const { addError, hasErrors } = useError();
 * 
 * const handleSubmit = async () => {
 *   try {
 *     await submitForm(data);
 *   } catch (error) {
 *     addError({
 *       message: error.message,
 *       severity: 'medium',
 *       source: 'form-validation',
 *       userMessage: 'Failed to submit form. Please try again.',
 *     });
 *   }
 * };
 * ```
 */
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
};

/**
 * Error Notification Component
 * 
 * Displays error notifications based on the error context.
 */
export const ErrorNotification: React.FC<{
  maxErrors?: number;
  autoHideDuration?: number;
}> = ({ maxErrors = 3, autoHideDuration = 5000 }) => {
  const { errors, removeError, markErrorAsSeen } = useError();
  const [visibleErrors, setVisibleErrors] = useState<AppError[]>([]);

  // Update visible errors when errors change
  useEffect(() => {
    const unseenErrors = errors
      .filter(error => !error.seen)
      .slice(0, maxErrors);
    
    if (unseenErrors.length > 0) {
      setVisibleErrors(unseenErrors);
      
      // Mark errors as seen
      unseenErrors.forEach(error => {
        markErrorAsSeen(error.id);
      });
    }
  }, [errors, maxErrors, markErrorAsSeen]);

  // Auto-hide errors after duration
  useEffect(() => {
    if (visibleErrors.length === 0) return;
    
    const timers = visibleErrors.map(error => {
      return setTimeout(() => {
        setVisibleErrors(prev => prev.filter(e => e.id !== error.id));
      }, autoHideDuration);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [visibleErrors, autoHideDuration]);

  if (visibleErrors.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {visibleErrors.map(error => (
        <div 
          key={error.id}
          className={`p-4 rounded-lg shadow-lg flex items-start space-x-3 ${
            error.severity === 'critical' ? 'bg-red-500 text-white' :
            error.severity === 'high' ? 'bg-orange-500 text-white' :
            error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}
          role="alert"
          aria-live={error.severity === 'critical' ? 'assertive' : 'polite'}
        >
          <div className="flex-1">
            <p className="font-medium">{error.userMessage || error.message}</p>
            {error.componentName && (
              <p className="text-sm opacity-75">Source: {error.componentName}</p>
            )}
          </div>
          <button 
            onClick={() => {
              setVisibleErrors(prev => prev.filter(e => e.id !== error.id));
              removeError(error.id);
            }}
            className="text-sm opacity-75 hover:opacity-100"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorProvider;
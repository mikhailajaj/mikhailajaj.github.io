/**
 * Data Fetching Error Fallback
 * 
 * Fallback component for handling data fetching errors.
 * Provides retry functionality and user-friendly error messages.
 * 
 * @fileoverview Data fetching error fallback component
 */

"use client";

// 1. React Imports
import React from 'react';

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { Button } from '@/components/ui/base/Button';
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';
import { useError } from '@/lib/error/ErrorContext';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this component)

/**
 * Data fetching error fallback props
 */
export interface DataFetchingErrorFallbackProps {
  /** Error object */
  error: Error;
  /** Function to retry the data fetch */
  retry?: () => void;
  /** Component name for error reporting */
  componentName?: string;
  /** Custom error message to display */
  message?: string;
  /** Whether to show technical details in development */
  showDetails?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Data Fetching Error Fallback Component
 * 
 * Displays a user-friendly error message when data fetching fails.
 * 
 * @example
 * ```tsx
 * // In a component that fetches data
 * const { data, error, retry } = useSWR('/api/data', fetcher);
 * 
 * if (error) {
 *   return (
 *     <DataFetchingErrorFallback
 *       error={error}
 *       retry={retry}
 *       componentName="ProductList"
 *     />
 *   );
 * }
 * ```
 */
export const DataFetchingErrorFallback: React.FC<DataFetchingErrorFallbackProps> = ({
  error,
  retry,
  componentName,
  message,
  showDetails = process.env.NODE_ENV === 'development',
  className,
}) => {
  const { currentDomainColor } = useDomainTheme();
  const { addError } = useError();
  
  // Report error to error context
  React.useEffect(() => {
    addError({
      message: error.message,
      severity: 'medium',
      source: 'data-fetch',
      componentName,
      originalError: error,
      userMessage: message || 'Failed to load data. Please try again.',
    });
  }, [error, componentName, message, addError]);

  return (
    <div 
      className={`p-6 rounded-lg border bg-white dark:bg-gray-800 shadow-sm ${className || ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${currentDomainColor}20` }}
        >
          <svg 
            className="text-xl"
            style={{ color: currentDomainColor }}
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            width="24"
            height="24"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">
          {message || 'Failed to load data'}
        </h3>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          {error.message || 'An error occurred while fetching data. Please try again.'}
        </p>
        
        {showDetails && error.stack && (
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer text-gray-500 dark:text-gray-400">
              Technical Details
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
      
      {retry && (
        <Button 
          onClick={retry}
          aria-label="Retry loading data"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default DataFetchingErrorFallback;
/**
 * Error Boundary Component
 * 
 * Comprehensive error boundary for catching and handling React component errors.
 * Provides fallback UI, error reporting, and recovery options.
 * 
 * @fileoverview React Error Boundary with Next.js integration
 */

"use client";

// 1. React Imports
import React, { Component, ErrorInfo, ReactNode } from 'react';

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
// import { Button } from '@/components/ui/base/Button'; // Removed - using native buttons to avoid hook dependencies
// import { useDomainTheme } from '@/lib/contexts/DomainThemeContext'; // Removed - can't use hooks in class components
import { announceUtils } from '@/lib/utils/accessibility';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this component)

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: ReactNode;
  /** Error reporting callback */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Component name for error reporting */
  componentName?: string;
  /** Whether to reset error state on route change */
  resetOnRouteChange?: boolean;
}

/**
 * Error boundary state interface
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Additional error information */
  errorInfo: ErrorInfo | null;
}

/**
 * Default fallback component props
 */
interface DefaultFallbackProps {
  /** The error that occurred */
  error: Error | null;
  /** Reset error state */
  resetError: () => void;
  /** Component name for error reporting */
  componentName?: string;
}

/**
 * Default fallback component
 */
const DefaultFallback: React.FC<DefaultFallbackProps> = ({ 
  error, 
  resetError,
  componentName 
}) => {
  React.useEffect(() => {
    // Announce error to screen readers
    if (typeof window !== 'undefined') {
      announceUtils.announce(
        `Error occurred${componentName ? ` in ${componentName}` : ''}. ${error?.message || 'Unknown error'}`,
        'assertive'
      );
    }
  }, [error, componentName]);

  return (
    <div 
      className="p-6 rounded-lg border bg-white dark:bg-gray-800 shadow-md" 
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-red-600 dark:text-red-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold">
          {componentName ? `Error in ${componentName}` : 'Something went wrong'}
        </h3>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300">
          {error?.message || 'An unexpected error occurred'}
        </p>
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-auto max-h-40">
            {error.stack}
          </pre>
        )}
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

/**
 * Error Boundary Component
 * 
 * React error boundary that catches errors in child components
 * and displays a fallback UI.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary componentName="ProductGallery" onError={reportError}>
 *   <ProductGallery products={products} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo,
    });
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Report to analytics if available
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'error', {
        'event_category': 'Error',
        'event_label': this.props.componentName || 'Unknown Component',
        'value': error.message,
      });
    }
  }

  componentDidMount(): void {
    // Reset error state on route change if enabled
    if (this.props.resetOnRouteChange && typeof window !== 'undefined') {
      window.addEventListener('popstate', this.resetErrorState);
    }
  }

  componentWillUnmount(): void {
    // Clean up event listener
    if (this.props.resetOnRouteChange && typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.resetErrorState);
    }
  }

  resetErrorState = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, componentName } = this.props;

    if (hasError) {
      // Render custom fallback or default fallback
      return fallback || (
        <DefaultFallback 
          error={error} 
          resetError={this.resetErrorState} 
          componentName={componentName}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
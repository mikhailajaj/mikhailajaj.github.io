/**
 * Global Error Boundary
 * 
 * Next.js App Router error boundary that handles runtime errors
 * with graceful fallbacks and professional error reporting.
 * 
 * @fileoverview Global error boundary with domain-aware theming
 */

"use client";

// 1. React Imports
import React, { useEffect } from 'react';

// 2. External Libraries
import { FaExclamationTriangle, FaRedo, FaHome, FaBug } from 'react-icons/fa';

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';
import { performanceMonitor } from '@/lib/services/performance';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (None in this component)

// 6. Stylesheets
// (None in this component)

/**
 * Error boundary props interface
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary Component
 * 
 * Handles runtime errors with graceful fallbacks and professional error reporting.
 * Integrates with performance monitoring and provides recovery options.
 * 
 * @component
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router
 * // Place in app/error.tsx for global error handling
 * ```
 * 
 * Features:
 * - Professional error display with domain theming
 * - Error reporting to performance monitoring system
 * - Multiple recovery options (retry, home, report)
 * - Accessibility compliant error messages
 * - Development vs production error details
 * - Performance impact tracking
 * 
 * @param props - Error boundary props
 * @returns JSX.Element - Error fallback UI
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  const { currentDomainColor, currentDomainConfig } = useDomainTheme();

  // Report error to monitoring system
  useEffect(() => {
    // Report to performance monitoring
    try {
      performanceMonitor.getCurrentSession()?.errors.push({
        type: 'long-task',
        message: `Runtime error: ${error.message}`,
        timestamp: Date.now(),
        severity: 'high',
        details: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
      });
    } catch (monitoringError) {
      console.warn('[ErrorBoundary] Failed to report to monitoring:', monitoringError);
    }

    // Report to external error tracking (if available)
    if (process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'runtime-error',
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          domain: currentDomainConfig?.id || 'unknown',
        }),
      }).catch(reportingError => {
        console.warn('[ErrorBoundary] Failed to report error:', reportingError);
      });
    }

    // Console error for development
    console.error('[ErrorBoundary] Runtime error caught:', error);
  }, [error, currentDomainConfig]);

  // Handle retry with error tracking
  const handleRetry = () => {
    try {
      reset();
    } catch (retryError) {
      console.error('[ErrorBoundary] Retry failed:', retryError);
      // Fallback to page reload
      window.location.reload();
    }
  };

  // Handle navigation to home
  const handleGoHome = () => {
    try {
      window.location.href = '/';
    } catch (navigationError) {
      console.error('[ErrorBoundary] Navigation failed:', navigationError);
      window.location.reload();
    }
  };

  // Handle error reporting
  const handleReportError = () => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Copy to clipboard
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => {
        alert('Error details copied to clipboard. Please share with support.');
      })
      .catch(() => {
        // Fallback: show error details in alert
        alert(`Error Details:\n${JSON.stringify(errorReport, null, 2)}`);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${currentDomainColor}20` }}
          >
            <FaExclamationTriangle 
              className="text-3xl"
              style={{ color: currentDomainColor }}
            />
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Something went wrong
        </h1>

        {/* Error Description */}
        <div className="text-gray-600 dark:text-gray-400 mb-6 space-y-2">
          <p>
            We encountered an unexpected error while loading this page. 
            This has been automatically reported and we&apos;re working to fix it.
          </p>
          
          {/* Development error details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer font-medium text-red-600 dark:text-red-400">
                Error Details (Development)
              </summary>
              <div className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-mono text-sm">
                  <div className="font-semibold">Message:</div>
                  <div className="mb-2">{error.message}</div>
                  
                  {error.digest && (
                    <>
                      <div className="font-semibold">Digest:</div>
                      <div className="mb-2">{error.digest}</div>
                    </>
                  )}
                  
                  {error.stack && (
                    <>
                      <div className="font-semibold">Stack Trace:</div>
                      <pre className="text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            </details>
          )}
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetry}
            leftIcon={<FaRedo />}
            style={{ backgroundColor: currentDomainColor }}
            className="text-white"
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={handleGoHome}
            leftIcon={<FaHome />}
            style={{ borderColor: currentDomainColor, color: currentDomainColor }}
          >
            Go Home
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleReportError}
            leftIcon={<FaBug />}
            className="text-gray-600 dark:text-gray-400"
          >
            Report Issue
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please try:
          </p>
          <ul className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1">
            <li>• Refreshing the page</li>
            <li>• Clearing your browser cache</li>
            <li>• Trying a different browser</li>
            <li>• Checking your internet connection</li>
          </ul>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
            Error ID: {error.digest}
          </div>
        )}
      </Card>
    </div>
  );
}
/**
 * Global Error Handler
 * 
 * Next.js App Router global error boundary that handles errors
 * in the root layout and provides the most basic fallback UI.
 * 
 * @fileoverview Root-level error boundary for critical failures
 */

"use client";

// 1. React Imports
import React from 'react';

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
// (Minimal imports to avoid circular dependencies)

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (None in this component)

// 6. Stylesheets
// (None in this component)

/**
 * Global error props interface
 */
interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Handler Component
 * 
 * Handles critical errors that occur in the root layout.
 * Provides minimal, dependency-free error UI to avoid cascading failures.
 * 
 * @component
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router
 * // Place in app/global-error.tsx for root-level error handling
 * ```
 * 
 * Features:
 * - Minimal dependencies to avoid cascading failures
 * - Basic error reporting and recovery options
 * - Accessible error interface
 * - Development vs production error details
 * - Fallback styling without external dependencies
 * 
 * @param props - Global error props
 * @returns JSX.Element - Minimal error fallback UI
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Report critical error
  React.useEffect(() => {
    // Basic error reporting without dependencies
    console.error('[GlobalError] Critical error:', error);
    
    // Report to external service if available
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'critical-error',
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      }).catch(reportingError => {
        console.warn('[GlobalError] Failed to report critical error:', reportingError);
      });
    }
  }, [error]);

  // Handle retry with fallback
  const handleRetry = () => {
    try {
      reset();
    } catch (retryError) {
      console.error('[GlobalError] Reset failed, reloading page:', retryError);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  // Handle navigation to home
  const handleGoHome = () => {
    try {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (navigationError) {
      console.error('[GlobalError] Navigation failed:', navigationError);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f9fafb',
        color: '#111827',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          width: '100%',
          padding: '2rem',
          textAlign: 'center'
        }}>
          {/* Error Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 2rem',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            ⚠️
          </div>

          {/* Error Title */}
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#111827'
          }}>
            Critical Error
          </h1>

          {/* Error Description */}
          <div style={{
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            <p>
              A critical error occurred that prevented the application from loading properly. 
              This issue has been automatically reported.
            </p>
            
            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && (
              <details style={{ 
                marginTop: '1rem', 
                textAlign: 'left',
                backgroundColor: '#fef2f2',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: '500',
                  color: '#dc2626',
                  marginBottom: '0.5rem'
                }}>
                  Error Details (Development)
                </summary>
                <div style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  <strong>Message:</strong> {error.message}
                  {error.digest && (
                    <>
                      <br /><br />
                      <strong>Digest:</strong> {error.digest}
                    </>
                  )}
                  {error.stack && (
                    <>
                      <br /><br />
                      <strong>Stack:</strong>
                      <br />
                      {error.stack}
                    </>
                  )}
                </div>
              </details>
            )}
          </div>

          {/* Recovery Actions */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleRetry}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#2563eb';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#3b82f6';
              }}
            >
              🔄 Try Again
            </button>
            
            <button
              onClick={handleGoHome}
              style={{
                backgroundColor: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.backgroundColor = '#3b82f6';
                btn.style.color = 'white';
              }}
              onMouseOut={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = '#3b82f6';
              }}
            >
              🏠 Go Home
            </button>
          </div>

          {/* Additional Help */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <p>If this problem persists, please try:</p>
            <ul style={{
              textAlign: 'left',
              marginTop: '0.5rem',
              paddingLeft: '1rem'
            }}>
              <li>Refreshing the page</li>
              <li>Clearing your browser cache</li>
              <li>Trying a different browser</li>
              <li>Checking your internet connection</li>
            </ul>
          </div>

          {/* Error ID */}
          {error.digest && (
            <div style={{
              marginTop: '1rem',
              fontSize: '0.75rem',
              color: '#9ca3af'
            }}>
              Error ID: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
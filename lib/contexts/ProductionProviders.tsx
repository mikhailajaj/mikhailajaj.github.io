/**
 * Production-Ready Provider Architecture
 * Clean, optimized providers for production deployment
 */

"use client";

import React, { Suspense } from "react";
import { ProjectProvider } from "./ProjectContextOptimized";
import { TestimonialProvider } from "./TestimonialContext";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";
import { SimpleUnifiedThemeProvider } from "@/lib/theme/simple/SimpleUnifiedTheme";
import { OptimizedDomainThemeProvider } from "./optimized/OptimizedDomainThemeContext";

// Loading components
function ProjectsLoadingFallback() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

function TestimonialsLoadingFallback() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-20 bg-gray-200 rounded"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
    </div>
  );
}

// Error fallback
function ContextErrorFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50 m-4">
      <h3 className="text-red-800 font-semibold">Application Error</h3>
      <p className="text-red-600 text-sm mt-1">{error.message}</p>
      <button
        onClick={resetError}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
      >
        Retry Application
      </button>
    </div>
  );
}

// Use Simple Unified Theme Provider for Phase 1

// Theme loading fallback
function ThemeLoadingFallback() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="text-sm text-gray-500">Initializing theme system...</div>
    </div>
  );
}

// Main production provider
export function ProductionDataProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<ThemeLoadingFallback />}>
        <OptimizedDomainThemeProvider
          enablePerformanceTracking={process.env.NODE_ENV === 'development'}
          enableNavigationIntegration={true}
          persistSelection={true}
        >
          <SimpleUnifiedThemeProvider>
            <Suspense fallback={<ProjectsLoadingFallback />}>
              <ProjectProvider>
                <Suspense fallback={<TestimonialsLoadingFallback />}>
                  <TestimonialProvider>{children}</TestimonialProvider>
                </Suspense>
              </ProjectProvider>
            </Suspense>
          </SimpleUnifiedThemeProvider>
        </OptimizedDomainThemeProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

// Backward compatibility alias
export const OptimizedDataProviders = ProductionDataProviders;

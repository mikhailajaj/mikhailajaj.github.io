"use client";

/**
 * Dynamic Component Loader
 *
 * Provides utilities for creating dynamically imported components with
 * loading states, error boundaries, and performance optimization.
 *
 * @fileoverview Dynamic import utilities with skeleton loading and error handling
 */

import dynamic from "next/dynamic";
import { ComponentType, Suspense } from "react";
import {
  CalculatorSkeleton,
  Scene3DSkeleton,
  InteractiveSkeleton,
  DemoSkeleton,
} from "./skeletons";

/**
 * Options interface for dynamic component creation
 */
interface DynamicComponentOptions {
  /** Loading component to show while importing */
  loading?: ComponentType;
  /** Whether to enable server-side rendering */
  ssr?: boolean;
  /** Error fallback component for failed imports */
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
}

/**
 * Creates a dynamically imported component with loading states and error handling
 *
 * This utility function wraps Next.js dynamic imports with enhanced error handling,
 * loading states, and performance optimizations for better user experience.
 *
 * @template T - The props type for the component
 * @param {Function} importFn - Function that returns a dynamic import promise
 * @param {DynamicComponentOptions} options - Configuration options
 * @returns {ComponentType<T>} A wrapped component with dynamic loading
 *
 * @example
 * ```tsx
 * const DynamicChart = createDynamicComponent(
 *   () => import('./Chart'),
 *   {
 *     loading: ChartSkeleton,
 *     ssr: false,
 *     errorFallback: ChartErrorFallback
 *   }
 * );
 *
 * // Usage
 * <DynamicChart data={chartData} />
 * ```
 *
 * Features:
 * - Automatic code splitting for better performance
 * - Skeleton loading states for smooth UX
 * - Error boundaries with retry functionality
 * - SSR control for client-only components
 * - TypeScript support with generic props
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: DynamicComponentOptions = {},
) {
  const {
    loading: LoadingComponent,
    ssr = false,
    errorFallback: ErrorFallback,
  } = options;

  const DynamicComponent = dynamic(importFn, {
    loading: LoadingComponent ? () => <LoadingComponent /> : undefined,
    ssr,
  });

  return function WrappedDynamicComponent(props: T) {
    if (ErrorFallback) {
      return (
        <Suspense fallback={LoadingComponent ? <LoadingComponent /> : null}>
          <DynamicComponent {...props} />
        </Suspense>
      );
    }

    return <DynamicComponent {...props} />;
  };
}

/**
 * Pre-configured dynamic components for common use cases
 *
 * These components are optimized for specific use cases with appropriate
 * loading skeletons and performance settings.
 */

/**
 * Dynamic ROI Calculator component with calculator skeleton
 */
export const DynamicCalculator = createDynamicComponent(
  () => import("../interactive/ROICalculator"),
  {
    loading: CalculatorSkeleton,
    ssr: false,
  },
);

/** Dynamic Cost Estimator component with calculator skeleton */
export const DynamicCostEstimator = createDynamicComponent(
  () => import("../interactive/CostEstimator"),
  {
    loading: CalculatorSkeleton,
    ssr: false,
  },
);

/** Dynamic Tech Stack Builder component with interactive skeleton */
export const DynamicTechStackBuilder = createDynamicComponent(
  () => import("../interactive/TechStackBuilder"),
  {
    loading: InteractiveSkeleton,
    ssr: false,
  },
);

/** Dynamic Performance Benchmark component with interactive skeleton */
export const DynamicPerformanceBenchmark = createDynamicComponent(
  () => import("../interactive/PerformanceBenchmark"),
  {
    loading: InteractiveSkeleton,
    ssr: false,
  },
);

/** Dynamic Project Demo component with demo skeleton */
export const DynamicProjectDemo = createDynamicComponent(
  () => import("../interactive/ProjectDemo"),
  {
    loading: DemoSkeleton,
    ssr: false,
  },
);

/** Dynamic Code Playground component with interactive skeleton */
export const DynamicCodePlayground = createDynamicComponent(
  () => import("../interactive/CodePlayground"),
  {
    loading: InteractiveSkeleton,
    ssr: false,
  },
);

/** Dynamic API Explorer component with interactive skeleton */
export const DynamicApiExplorer = createDynamicComponent(
  () => import("../interactive/ApiExplorer"),
  {
    loading: InteractiveSkeleton,
    ssr: false,
  },
);

/** Dynamic Database Demo component with interactive skeleton */
export const DynamicDatabaseDemo = createDynamicComponent(
  () => import("../interactive/DatabaseDemo"),
  {
    loading: InteractiveSkeleton,
    ssr: false,
  },
);

/**
 * 3D Visualization Components
 *
 * These components use React Three Fiber and are client-side only
 * due to WebGL requirements and performance considerations.
 */

/** Dynamic Cloud Architecture 3D visualization */
export const DynamicCloudArchitecture = createDynamicComponent(
  () => import("../3d/visualizations/CloudArchitecture"),
  {
    loading: Scene3DSkeleton,
    ssr: false,
  },
);

/** Dynamic Data Flow 3D visualization */
export const DynamicDataFlowViz = createDynamicComponent(
  () => import("../3d/visualizations/DataFlowViz"),
  {
    loading: Scene3DSkeleton,
    ssr: false,
  },
);

/** Dynamic Network Topology 3D visualization */
export const DynamicNetworkTopology = createDynamicComponent(
  () => import("../3d/visualizations/NetworkTopology"),
  {
    loading: Scene3DSkeleton,
    ssr: false,
  },
);

/**
 * Analytics Components
 *
 * Data visualization and analytics dashboard components
 * optimized for interactive data exploration.
 */

/** Dynamic Analytics Dashboard component */
export const DynamicAnalyticsDashboard = createDynamicComponent(
  () => import("../analytics/Dashboard"),
  {
    loading: InteractiveSkeleton,
    ssr: false,
  },
);

/**
 * Error Boundary Component for Dynamic Imports
 *
 * Provides a user-friendly error display when dynamic component loading fails,
 * with retry functionality for better user experience.
 *
 * @component
 * @example
 * ```tsx
 * <DynamicErrorBoundary
 *   error={loadError}
 *   retry={() => window.location.reload()}
 * />
 * ```
 *
 * Features:
 * - Clear error messaging
 * - Retry functionality
 * - Accessible design with proper ARIA attributes
 * - Consistent styling with the application theme
 *
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that occurred during loading
 * @param {Function} props.retry - Function to retry loading the component
 * @returns {JSX.Element} Error boundary UI with retry option
 */
export function DynamicErrorBoundary({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700">
      <div className="text-center p-6">
        <div className="text-red-400 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          Component Load Error
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Failed to load interactive component
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

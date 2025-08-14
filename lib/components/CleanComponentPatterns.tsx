/**
 * Clean Component Patterns
 *
 * Core interfaces and patterns for building clean, reusable components
 * following the documented architecture principles.
 */

import React from "react";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

// ✅ Base component interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
  "aria-label"?: string;
  id?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-describedby"?: string;
}

export interface CompoundComponentProps extends BaseComponentProps {
  variant?: string;
  size?: string;
}

// ✅ Component type definitions
export type CardComponent = React.FC<any>;

// ✅ Higher-order component for performance tracking
export function withPerformanceTracking<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string,
) {
  const WrappedComponent = React.forwardRef<any, T>((props, ref) => {
    const startTime = React.useRef<number>();

    React.useEffect(() => {
      startTime.current = performance.now();

      return () => {
        if (startTime.current) {
          const renderTime = performance.now() - startTime.current;
          console.log(
            `[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`,
          );
        }
      };
    });

    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
}

// ✅ Clean error boundary wrapper
interface CleanErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError?: () => void }>;
}

export const CleanErrorBoundary: React.FC<CleanErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
};

// ✅ Component composition utilities
export function createCompoundComponent<T extends object>(
  BaseComponent: React.ComponentType<T>,
  subComponents: Record<string, React.ComponentType<any>>,
) {
  const CompoundComponent = BaseComponent as typeof BaseComponent &
    typeof subComponents;

  Object.keys(subComponents).forEach((key) => {
    (CompoundComponent as any)[key] = subComponents[key];
  });

  return CompoundComponent;
}

// ✅ Safe component creation utility
export function createSafeComponent<T extends object>(
  componentFactory: () => React.ComponentType<T>,
  fallback: React.ComponentType<T>,
) {
  try {
    return componentFactory();
  } catch (error) {
    console.warn("Component creation failed, using fallback:", error);
    return fallback;
  }
}

// ✅ Component validation utilities
export function validateProps<T extends object>(
  props: T,
  requiredProps: (keyof T)[],
  componentName: string,
): boolean {
  const missingProps = requiredProps.filter((prop) => !(prop in props));

  if (missingProps.length > 0) {
    console.error(`[${componentName}] Missing required props:`, missingProps);
    return false;
  }

  return true;
}

// ✅ Default export for convenience
const CleanComponentPatterns = {
  BaseComponentProps,
  InteractiveComponentProps,
  CompoundComponentProps,
  withPerformanceTracking,
  CleanErrorBoundary,
  createCompoundComponent,
  createSafeComponent,
  validateProps,
};

export default CleanComponentPatterns;

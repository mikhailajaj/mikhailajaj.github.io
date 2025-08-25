/**
 * Loading Spinner Component
 * 
 * A reusable loading spinner with different sizes and variants.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse';
  className?: string;
  label?: string;
}

/**
 * Default Spinner Component
 */
const DefaultSpinner: React.FC<{ className: string }> = ({ className }) => (
  <svg
    className={cn('animate-spin', className)}
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Dots Spinner Component
 */
const DotsSpinner: React.FC<{ className: string }> = ({ className }) => (
  <div className={cn('flex space-x-1', className)}>
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

/**
 * Pulse Spinner Component
 */
const PulseSpinner: React.FC<{ className: string }> = ({ className }) => (
  <div className={cn('relative', className)}>
    <div className="w-full h-full bg-current rounded-full animate-ping opacity-75" />
    <div className="absolute inset-0 w-full h-full bg-current rounded-full animate-pulse" />
  </div>
);

/**
 * Loading Spinner Component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  label = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const spinnerClassName = cn(
    'text-primary',
    sizeClasses[size],
    className
  );

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner className={spinnerClassName} />;
      case 'pulse':
        return <PulseSpinner className={spinnerClassName} />;
      default:
        return <DefaultSpinner className={spinnerClassName} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2" role="status" aria-label={label}>
      {renderSpinner()}
      {label && (
        <span className="text-sm text-muted-foreground sr-only">
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
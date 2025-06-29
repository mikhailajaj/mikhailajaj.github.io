"use client";
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 dark:border-gray-600 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-500",
        ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-500",
        link: "text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500 dark:text-blue-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        success: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-lg",
        xl: "h-14 px-8 text-xl",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface AccessibleButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ariaLabel?: string;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * AccessibleButton component with WCAG 2.1 AA compliance
 * 
 * Features:
 * - Proper ARIA attributes
 * - Keyboard navigation support
 * - Focus indicators
 * - Loading state
 * - Icon support
 * - Multiple variants and sizes
 */
export function AccessibleButton({
  children,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  ariaLabel,
  loading = false,
  startIcon,
  endIcon,
  fullWidth,
  ...props
}: AccessibleButtonProps) {
  // Use aria-label if provided, otherwise use the button text content
  const accessibilityLabel = ariaLabel || (typeof children === 'string' ? children : undefined);
  
  return (
    <button
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        loading && "relative !text-transparent",
        className
      )}
      disabled={disabled || loading}
      aria-label={accessibilityLabel}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="sr-only">Loading</span>
        </div>
      )}
      
      {/* Start Icon */}
      {startIcon && <span className={cn("mr-2", loading && "opacity-0")}>{startIcon}</span>}
      
      {/* Button Content */}
      <span className={loading ? "opacity-0" : ""}>{children}</span>
      
      {/* End Icon */}
      {endIcon && <span className={cn("ml-2", loading && "opacity-0")}>{endIcon}</span>}
    </button>
  );
}

export { buttonVariants };
export default AccessibleButton;
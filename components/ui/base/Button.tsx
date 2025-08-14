/**
 * Button Component - shadcn/ui v4 Compatible
 *
 * A versatile button component following shadcn/ui design patterns.
 * Built with class-variance-authority for consistent styling.
 *
 * @fileoverview Modern button component with shadcn/ui v4 patterns
 */

"use client";

// 1. React Imports
import * as React from "react";

// 2. External Libraries
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { cn } from "@/lib/utils/cn";
import { announceUtils } from "@/lib/utils/accessibility";
import { DOMAIN_COLORS, type Domain } from "@/lib/constants/domains";

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline above)

// 6. Stylesheets
// (None in this component)

/**
 * Button variant styles using class-variance-authority
 * Following shadcn/ui v4 design system patterns
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px] min-w-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants for your portfolio
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg hover:shadow-xl",
        info: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl",
        // Domain-specific variants (WCAG AA compliant)
        "full-stack": "text-white shadow-lg hover:shadow-xl transition-all duration-200",
        "cloud-engineering": "text-white shadow-lg hover:shadow-xl transition-all duration-200",
        "data-analytics": "text-white shadow-lg hover:shadow-xl transition-all duration-200",
        "ux-ui-design": "text-white shadow-lg hover:shadow-xl transition-all duration-200",
        "technical-consulting": "text-white shadow-lg hover:shadow-xl transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 min-h-[44px]", // Ensure touch target size
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]", // Touch-friendly icon buttons
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Button component props interface
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  /** Domain-specific theming */
  domain?: Domain;
  /** Render as a child component (for composition patterns) */
  asChild?: boolean;
  /** Loading state indicator */
  loading?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Accessible label for screen readers */
  "aria-label"?: string;
  /** Describes the button for screen readers */
  "aria-describedby"?: string;
  /** Indicates if button controls expanded content */
  "aria-expanded"?: boolean;
  /** Indicates if button controls a popup */
  "aria-haspopup"?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
  /** Indicates pressed state for toggle buttons */
  "aria-pressed"?: boolean;
  /** Callback for click events with accessibility announcements */
  onAccessibleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Message to announce to screen readers on click */
  clickAnnouncement?: string;
}

/**
 * Loading Spinner Component - shadcn/ui compatible
 */
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin h-4 w-4", className)}
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
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/**
 * Button Component - shadcn/ui v4 Compatible
 *
 * A flexible, accessible button component following shadcn/ui design patterns.
 * Supports composition patterns, loading states, and comprehensive styling.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Button>Click me</Button>
 *
 * // With variants and sizes
 * <Button variant="gradient" size="lg">
 *   Get Started
 * </Button>
 *
 * // With icons
 * <Button leftIcon={<User />} rightIcon={<ArrowRight />}>
 *   Continue
 * </Button>
 *
 * // Loading state
 * <Button loading disabled>
 *   Processing...
 * </Button>
 *
 * // As child (composition pattern)
 * <Button asChild>
 *   <Link href="/about">About</Link>
 * </Button>
 * ```
 *
 * Features:
 * - shadcn/ui v4 compatible design system
 * - Class-variance-authority for consistent styling
 * - Composition patterns with asChild prop
 * - Loading states with accessible spinner
 * - Icon support with proper spacing
 * - Full accessibility compliance
 * - Dark mode support
 * - Custom portfolio variants (gradient, success, warning, info)
 *
 * @param props - Button component props
 * @returns JSX.Element - The rendered button
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      domain,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      onAccessibleClick,
      clickAnnouncement,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Enhanced click handler with accessibility announcements
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      // Call the accessible click handler if provided
      if (onAccessibleClick) {
        onAccessibleClick(event);
      }
      
      // Call the regular click handler
      if (onClick) {
        onClick(event);
      }
      
      // Announce to screen readers if message provided
      if (clickAnnouncement && !loading && !disabled) {
        announceUtils.announce(clickAnnouncement, 'polite');
      }
    }, [onAccessibleClick, onClick, clickAnnouncement, loading, disabled]);

    // Generate accessible loading message
    const loadingMessage = loading ? 'Loading, please wait' : undefined;

    // Apply domain-specific styling
    const domainStyles = React.useMemo(() => {
      if (!domain || variant !== 'default') return {};
      
      const domainColor = DOMAIN_COLORS[domain];
      return {
        backgroundColor: domainColor,
        '--tw-shadow-color': domainColor,
        '--hover-bg': `${domainColor}dd`, // Slightly transparent for hover
      } as React.CSSProperties;
    }, [domain, variant]);

    // Determine final variant (use domain as variant if specified)
    const finalVariant = domain && variant === 'default' ? domain : variant;

    return (
      <Comp
        className={cn(buttonVariants({ variant: finalVariant, size, className }))}
        style={domainStyles}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-busy={loading}
        aria-live={loading ? 'polite' : undefined}
        {...props}
      >
        {loading && (
          <>
            <LoadingSpinner className="mr-2" />
            <span className="sr-only">{loadingMessage}</span>
          </>
        )}
        {leftIcon && !loading && (
          <span className="mr-2 flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && !loading && (
          <span className="ml-2 flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

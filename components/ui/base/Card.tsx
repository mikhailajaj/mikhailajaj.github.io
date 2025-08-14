/**
 * Card Component - shadcn/ui Compatible
 *
 * A versatile card component following shadcn/ui design patterns.
 * Built with class-variance-authority for consistent styling.
 *
 * @fileoverview Modern card component with shadcn/ui patterns
 */

"use client";

// 1. React Imports
import * as React from "react";

// 2. External Libraries
import { cva, type VariantProps } from "class-variance-authority";

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { cn } from "@/lib/utils/cn";

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline above)

// 6. Stylesheets
// (None in this component)

/**
 * Card variant styles using class-variance-authority
 */
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        elevated: "shadow-md hover:shadow-lg transition-shadow duration-200",
        outlined: "border-2 shadow-none",
        ghost: "border-transparent shadow-none bg-transparent",
      },
      padding: {
        none: "",
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

/**
 * Card component props interface
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Render as a different element */
  asChild?: boolean;
}

/**
 * Card Component
 *
 * A flexible card component that provides a consistent container
 * for content with various styling options.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 *
 * // With variants
 * <Card variant="elevated" padding="lg">
 *   <h3>Elevated Card</h3>
 * </Card>
 *
 * // Custom styling
 * <Card className="max-w-md mx-auto">
 *   Content
 * </Card>
 * ```
 *
 * Features:
 * - Multiple visual variants (default, elevated, outlined, ghost)
 * - Flexible padding options
 * - Consistent styling with design system
 * - Full accessibility support
 * - TypeScript support with proper types
 *
 * @param props - Card component props
 * @returns JSX.Element - The rendered card
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);

Card.displayName = "Card";

/**
 * Card Header Component
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Card Title Component
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Card Description Component
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Card Content Component
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Card Footer Component
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
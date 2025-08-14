"use client";

import React, { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Philosophical Design: Balance, Consistency, Accessibility

const buttonVariants = cva(
  // Base styles - Kantian universal principles
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      // Aristotelian balance - not too many, not too few variants
      variant: {
        primary: "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/95",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/85",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95",
        magic: "relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95",
        interactive: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 hover:from-blue-600 hover:to-purple-700"
      },
      // Utilitarian size system - serves greatest number of use cases
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9"
      },
      // Animation support for human flourishing
      animation: {
        none: "",
        hover: "hover:animate-pulse",
        press: "active:animate-ping",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      animation: "none"
    }
  }
);

export interface UniversalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Core philosophical principles
  asChild?: boolean;
  
  // State management (Kantian predictability)
  loading?: boolean;
  active?: boolean;
  
  // Accessibility (Universal respect for users)
  ariaLabel?: string;
  
  // Theme integration (Consistent experience)
  domainColor?: string;
  
  // Icon support (Practical wisdom)
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Advanced features (Balanced complexity)
  tooltip?: string;
  badge?: string | number;
}

const UniversalButton = forwardRef<HTMLButtonElement, UniversalButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    active = false,
    ariaLabel,
    domainColor,
    leftIcon,
    rightIcon,
    tooltip,
    badge,
    children,
    disabled,
    style,
    ...props 
  }, ref) => {
    // Hydration safety (learned from domain hero experience)
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
      setIsMounted(true);
    }, []);

    const Comp = asChild ? Slot : "button";
    
    // Domain color integration
    const customStyle = domainColor ? {
      '--button-primary': domainColor,
      '--button-primary-hover': `${domainColor}dd`,
      ...style
    } : style;

    // Accessibility enhancements
    const accessibilityProps = {
      'aria-label': ariaLabel || (typeof children === 'string' ? children : undefined),
      'aria-disabled': disabled || loading,
      'aria-pressed': active,
      'title': tooltip
    };

    return (
      <div className="relative inline-flex">
        <Comp
          className={cn(
            buttonVariants({ variant, size, animation, className }),
            // Domain color override
            domainColor && variant === 'primary' && "bg-[var(--button-primary)] hover:bg-[var(--button-primary-hover)]",
            // Active state
            active && "ring-2 ring-ring ring-offset-2",
            // Loading state
            loading && "cursor-not-allowed"
          )}
          ref={ref}
          disabled={disabled || loading}
          style={customStyle}
          {...accessibilityProps}
          {...props}
        >
          {/* Left Icon */}
          {leftIcon && !loading && (
            <span className="mr-1">{leftIcon}</span>
          )}
          
          {/* Loading Spinner */}
          <AnimatePresence>
            {loading && isMounted && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="mr-2"
              >
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Button Content */}
          <span className={loading ? "opacity-70" : ""}>
            {children}
          </span>
          
          {/* Right Icon */}
          {rightIcon && !loading && (
            <span className="ml-1">{rightIcon}</span>
          )}
        </Comp>
        
        {/* Badge */}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
            {badge}
          </span>
        )}
      </div>
    );
  }
);

UniversalButton.displayName = "UniversalButton";

export { UniversalButton, buttonVariants };
export default UniversalButton;

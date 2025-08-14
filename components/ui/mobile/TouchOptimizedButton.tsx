/**
 * TouchOptimizedButton Component
 * 
 * Button component optimized for mobile touch interactions with proper
 * touch targets, feedback, and accessibility features.
 */

"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface TouchOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  touchFeedback?: boolean;
  className?: string;
}

export const TouchOptimizedButton = forwardRef<HTMLButtonElement, TouchOptimizedButtonProps>(
  ({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    touchFeedback = true,
    className,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = cn(
      // Base styling
      "relative inline-flex items-center justify-center font-medium rounded-lg",
      "transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      
      // Touch optimization
      "touch-manipulation", // Optimizes touch events
      "select-none", // Prevents text selection on touch
      
      // Enhanced touch targets (minimum 44px as per WCAG)
      size === "sm" && "min-h-[44px] px-4 text-sm",
      size === "md" && "min-h-[48px] px-6 text-base",
      size === "lg" && "min-h-[52px] px-8 text-lg",
      size === "xl" && "min-h-[56px] px-10 text-xl",
      
      // Variant styling
      variant === "primary" && [
        "bg-primary text-primary-foreground",
        "hover:bg-primary/90 active:bg-primary/80",
        "focus:ring-primary/50",
      ],
      variant === "secondary" && [
        "bg-secondary text-secondary-foreground",
        "hover:bg-secondary/90 active:bg-secondary/80",
        "focus:ring-secondary/50",
      ],
      variant === "ghost" && [
        "bg-transparent text-foreground",
        "hover:bg-accent active:bg-accent/80",
        "focus:ring-accent/50",
      ],
      variant === "outline" && [
        "border border-input bg-background text-foreground",
        "hover:bg-accent active:bg-accent/80",
        "focus:ring-accent/50",
      ],
      
      className
    );

    const buttonContent = (
      <>
        {isLoading && (
          <motion.div
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        {children}
      </>
    );

    if (touchFeedback) {
      return (
        <motion.button
          ref={ref}
          className={baseClasses}
          disabled={disabled || isLoading}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.1 }}
          style={{
            WebkitTapHighlightColor: 'transparent', // Remove default mobile tap highlight
          }}
          {...props}
        >
          {buttonContent}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={disabled || isLoading}
        style={{
          WebkitTapHighlightColor: 'transparent',
        }}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

TouchOptimizedButton.displayName = "TouchOptimizedButton";

export default TouchOptimizedButton;
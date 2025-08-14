"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useAccessibility } from "../context/AccessibilityContext";
import { ACCESSIBILITY_TIMING, TOUCH_TARGETS } from "../constants";
import type { AccessibleButtonProps } from "../types";

/**
 * Universal Accessible Button Component
 * WCAG 2.1 AA compliant with cognitive optimization
 */
export function AccessibleButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  ariaLabel,
  ariaDescribedBy,
  announceOnClick,
  className,
  onClick,
  disabled,
  ...props
}: AccessibleButtonProps) {
  const { highContrast, announce } = useAccessibility();
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // WCAG 2.1 AA compliant sizing (minimum 44x44px for touch targets)
  const sizeClasses = {
    sm: `min-h-[${TOUCH_TARGETS.minimum}px] min-w-[${TOUCH_TARGETS.minimum}px] px-3 py-2 text-sm`,
    md: `min-h-[${TOUCH_TARGETS.minimum}px] min-w-[${TOUCH_TARGETS.minimum}px] px-4 py-2 text-base`,
    lg: `min-h-[${TOUCH_TARGETS.comfortable}px] min-w-[${TOUCH_TARGETS.comfortable}px] px-6 py-3 text-lg`,
    xl: `min-h-[${TOUCH_TARGETS.large}px] min-w-[${TOUCH_TARGETS.large}px] px-8 py-4 text-xl`,
  };

  // High contrast mode styling
  const variantClasses = {
    primary: cn(
      "bg-blue-600 text-white border-2 border-blue-600",
      "hover:bg-blue-700 hover:border-blue-700",
      "focus:bg-blue-700 focus:border-blue-700",
      highContrast && "border-4 border-blue-800 bg-blue-800",
    ),
    secondary: cn(
      "bg-green-600 text-white border-2 border-green-600",
      "hover:bg-green-700 hover:border-green-700",
      "focus:bg-green-700 focus:border-green-700",
      highContrast && "border-4 border-green-800 bg-green-800",
    ),
    outline: cn(
      "bg-transparent text-blue-600 border-2 border-blue-600",
      "hover:bg-blue-50 hover:text-blue-700",
      "focus:bg-blue-50 focus:text-blue-700",
      "dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950",
      highContrast && "border-4 border-blue-800 text-blue-800",
    ),
    ghost: cn(
      "bg-transparent text-gray-700 border-2 border-transparent",
      "hover:bg-gray-100 hover:text-gray-900",
      "focus:bg-gray-100 focus:text-gray-900",
      "dark:text-gray-300 dark:hover:bg-gray-800",
      highContrast && "border-gray-800 text-gray-900",
    ),
    danger: cn(
      "bg-red-600 text-white border-2 border-red-600",
      "hover:bg-red-700 hover:border-red-700",
      "focus:bg-red-700 focus:border-red-700",
      highContrast && "border-4 border-red-800 bg-red-800",
    ),
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (announceOnClick) {
      announce(announceOnClick);
    }
    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        // Base styles
        "relative inline-flex items-center justify-center gap-2",
        "font-medium rounded-lg transition-all duration-200",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "active:scale-95",

        // Size and variant classes
        sizeClasses[size],
        variantClasses[variant],

        // Loading state
        loading && "cursor-wait",

        className,
      )}
      whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
      whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
      transition={{ duration: ACCESSIBILITY_TIMING.micro }}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        </div>
      )}

      {/* Content */}
      <div className={cn("flex items-center gap-2", loading && "opacity-0")}>
        {icon && iconPosition === "left" && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        <span>{children}</span>

        {icon && iconPosition === "right" && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
    </motion.button>
  );
}
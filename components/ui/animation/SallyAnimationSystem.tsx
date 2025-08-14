"use client";

import React from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Sally's HCI-Enhanced Animation System
 * Based on cognitive psychology principles and human factors research
 */

// Sally's Cognitive Load Optimized Animation Durations
export const SALLY_TIMING = {
  // Based on human reaction times and cognitive processing
  micro: 150, // Visual reaction time (~200ms) - micro-interactions
  quick: 250, // Short-term memory processing
  standard: 350, // Comfortable cognitive processing
  deliberate: 500, // Complex state changes
  narrative: 800, // Storytelling and context changes
} as const;

// Sally's Easing Functions - Based on Natural Movement Patterns
export const SALLY_EASING = {
  // Natural acceleration/deceleration mimicking human movement
  natural: [0.25, 0.46, 0.45, 0.94],
  // Gentle entrance - reduces cognitive load
  enter: [0.25, 0.46, 0.45, 0.94],
  // Quick exit - maintains user control feeling
  exit: [0.55, 0.06, 0.68, 0.19],
  // Bouncy for positive feedback
  celebrate: [0.68, -0.55, 0.265, 1.55],
  // Sharp for error states
  alert: [0.95, 0.05, 0.795, 0.035],
} as const;

// Sally's Animation Variants - Cognitive Psychology Based
export const SALLY_VARIANTS = {
  // Reduces Gulf of Execution - clear action feedback
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  // Maintains spatial relationships - reduces cognitive load
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },

  // Scale animations - Fitts' Law compliant (target size awareness)
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Stagger for progressive disclosure - reduces memory load
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  // Error state - immediate attention (based on pain reaction time ~700ms)
  errorShake: {
    initial: { x: 0 },
    animate: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: SALLY_TIMING.quick / 1000 },
    },
  },

  // Success state - positive reinforcement
  successPulse: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: { duration: SALLY_TIMING.standard / 1000 },
    },
  },
} as const;

interface SallyAnimatedProps {
  children: React.ReactNode;
  variant?: keyof typeof SALLY_VARIANTS;
  duration?: keyof typeof SALLY_TIMING;
  delay?: number;
  className?: string;
  respectReducedMotion?: boolean;
  onAnimationComplete?: () => void;
}

/**
 * Core Sally Animation Component
 * Implements HCI principles for cognitive load optimization
 */
export function SallyAnimated({
  children,
  variant = "fadeInUp",
  duration = "standard",
  delay = 0,
  className,
  respectReducedMotion = true,
  onAnimationComplete,
}: SallyAnimatedProps) {
  const shouldReduceMotion = useReducedMotion();
  const variantConfig = SALLY_VARIANTS[variant];
  const durationMs = SALLY_TIMING[duration];

  // Respect user's motion preferences (accessibility)
  if (respectReducedMotion && shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variantConfig}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: durationMs / 1000,
        delay,
        ease: SALLY_EASING.natural,
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {children}
    </motion.div>
  );
}

/**
 * Sally's Stagger Container - Progressive Disclosure
 * Reduces cognitive load by revealing information incrementally
 */
interface SallyStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function SallyStagger({
  children,
  className,
  staggerDelay = 0.1,
}: SallyStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

/**
 * Sally's Feedback Animation - Based on Human Error Patterns
 * Distinguishes between slips (execution errors) and mistakes (intention errors)
 */
interface SallyFeedbackProps {
  type: "success" | "error" | "warning" | "info";
  children: React.ReactNode;
  className?: string;
  autoReset?: boolean;
  resetDelay?: number;
}

export function SallyFeedback({
  type,
  children,
  className,
  autoReset = true,
  resetDelay = 3000,
}: SallyFeedbackProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (autoReset) {
      const timer = setTimeout(() => setIsVisible(false), resetDelay);
      return () => clearTimeout(timer);
    }
  }, [autoReset, resetDelay]);

  const getVariant = () => {
    switch (type) {
      case "error":
        return "errorShake";
      case "success":
        return "successPulse";
      default:
        return "fadeInUp";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    }
  };

  if (shouldReduceMotion) {
    return isVisible ? (
      <div className={cn("p-4 rounded-lg border", getColors(), className)}>
        {children}
      </div>
    ) : null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <SallyAnimated
          variant={getVariant()}
          duration="quick"
          className={cn("p-4 rounded-lg border", getColors(), className)}
        >
          {children}
        </SallyAnimated>
      )}
    </AnimatePresence>
  );
}

/**
 * Sally's Hover Enhancement - Fitts' Law Compliant
 * Optimizes target acquisition based on distance and size relationships
 */
interface SallyHoverProps {
  children: React.ReactNode;
  className?: string;
  scaleOnHover?: number;
  glowOnHover?: boolean;
}

export function SallyHover({
  children,
  className,
  scaleOnHover = 1.02,
  glowOnHover = false,
}: SallyHoverProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{
        scale: scaleOnHover,
        boxShadow: glowOnHover ? "0 0 20px rgba(59, 130, 246, 0.3)" : undefined,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Sally's Page Transition - Maintains Mental Model
 * Reduces Gulf of Evaluation by providing clear state transitions
 */
interface SallyPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function SallyPageTransition({
  children,
  className,
}: SallyPageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: SALLY_TIMING.standard / 1000,
        ease: SALLY_EASING.natural,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Sally's Loading Animation - Memory Load Optimization
 * Provides clear feedback during system processing
 */
interface SallyLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function SallyLoading({
  size = "md",
  className,
  label,
}: SallyLoadingProps) {
  const shouldReduceMotion = useReducedMotion();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  if (shouldReduceMotion) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            "border-2 border-primary-200 border-t-primary-600 rounded-full",
            sizeClasses[size],
          )}
        />
        {label && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <motion.div
        className={cn(
          "border-2 border-primary-200 border-t-primary-600 rounded-full",
          sizeClasses[size],
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {label && (
        <motion.span
          className="text-sm text-gray-600 dark:text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}

// All exports are already declared above with individual export statements

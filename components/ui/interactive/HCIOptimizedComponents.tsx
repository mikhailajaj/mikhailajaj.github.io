"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  SallyAnimated,
  SallyFeedback,
  SallyHover,
  SallyLoading,
  SALLY_TIMING,
} from "@/components/ui/animation/SallyAnimationSystem";
import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaInfo,
} from "react-icons/fa";

/**
 * Sally's HCI-Enhanced Button
 * Implements Fitts' Law, cognitive load optimization, and error prevention
 */
interface SallyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  cognitiveLoad?: "low" | "medium" | "high";
  fittsOptimized?: boolean;
}

export function SallyButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  cognitiveLoad = "low",
  fittsOptimized = true,
  className,
  disabled,
  onClick,
  ...props
}: SallyButtonProps) {
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Fitts' Law optimized sizes (minimum 44x44px for touch)
  const sizeClasses = {
    sm: fittsOptimized
      ? "px-4 py-3 text-sm min-h-[44px]"
      : "px-3 py-1.5 text-sm",
    md: fittsOptimized ? "px-6 py-3 min-h-[48px]" : "px-4 py-2",
    lg: fittsOptimized ? "px-8 py-4 text-lg min-h-[52px]" : "px-6 py-3 text-lg",
    xl: fittsOptimized
      ? "px-10 py-5 text-xl min-h-[56px]"
      : "px-8 py-4 text-xl",
  };

  // Cognitive load aware styling
  const cognitiveStyles = {
    low: "shadow-sm hover:shadow-md",
    medium: "shadow-md hover:shadow-lg border-2",
    high: "shadow-lg hover:shadow-xl border-2 ring-2 ring-offset-2",
  };

  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
    ghost: "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Provide immediate feedback (reduces Gulf of Evaluation)
    if (!shouldReduceMotion) {
      setFeedback("success");
      setTimeout(() => setFeedback(null), SALLY_TIMING.standard);
    }

    if (onClick) {
      try {
        await onClick(e);
      } catch (error) {
        setFeedback("error");
        setTimeout(() => setFeedback(null), SALLY_TIMING.deliberate);
      }
    }
  };

  return (
    <SallyHover
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizeClasses[size],
        cognitiveStyles[cognitiveLoad],
        fullWidth && "w-full",
        className,
      )}
      scaleOnHover={1.02}
      glowOnHover={cognitiveLoad === "high"}
    >
      <motion.button
        onClick={handleClick}
        disabled={disabled || loading}
        className="w-full h-full flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading ? (
          <SallyLoading size="sm" />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </motion.button>

      {/* Feedback overlay */}
      {feedback && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-lg flex items-center justify-center",
            feedback === "success" && "bg-green-500",
            feedback === "error" && "bg-red-500",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0 }}
        >
          {feedback === "success" && <FaCheck className="text-white" />}
          {feedback === "error" && <FaTimes className="text-white" />}
        </motion.div>
      )}
    </SallyHover>
  );
}

/**
 * Sally's Memory-Optimized Form Input
 * Implements recognition over recall and error prevention
 */
interface SallyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: string;
  hint?: string;
  showCharacterCount?: boolean;
  maxLength?: number;
  cognitiveAid?: "placeholder" | "example" | "format";
}

export function SallyInput({
  label,
  error,
  success,
  hint,
  showCharacterCount = false,
  maxLength,
  cognitiveAid = "placeholder",
  className,
  ...props
}: SallyInputProps) {
  const [value, setValue] = useState(props.value || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCognitiveAidText = () => {
    switch (cognitiveAid) {
      case "example":
        return props.type === "email"
          ? "e.g., john@example.com"
          : "Example input";
      case "format":
        return props.type === "tel"
          ? "Format: (123) 456-7890"
          : "Required format";
      default:
        return props.placeholder;
    }
  };

  return (
    <div className="space-y-2">
      {/* Label with cognitive load optimization */}
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input container with visual feedback */}
      <div className="relative">
        <input
          ref={inputRef}
          className={cn(
            "w-full px-4 py-3 rounded-lg border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "placeholder-gray-400 dark:placeholder-gray-500",
            error && "border-red-500 focus:ring-red-500",
            success && "border-green-500 focus:ring-green-500",
            !error && !success && "border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            className,
          )}
          placeholder={getCognitiveAidText()}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            props.onChange?.(e);
          }}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          maxLength={maxLength}
          {...props}
        />

        {/* Status icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {error && <FaTimes className="text-red-500 w-4 h-4" />}
          {success && <FaCheck className="text-green-500 w-4 h-4" />}
        </div>
      </div>

      {/* Feedback and hints */}
      <div className="space-y-1">
        {error && (
          <SallyFeedback type="error" autoReset={false}>
            <div className="flex items-center gap-2 text-sm">
              <FaExclamationTriangle className="w-4 h-4" />
              {error}
            </div>
          </SallyFeedback>
        )}

        {success && (
          <SallyFeedback type="success" autoReset={false}>
            <div className="flex items-center gap-2 text-sm">
              <FaCheck className="w-4 h-4" />
              {success}
            </div>
          </SallyFeedback>
        )}

        {hint && !error && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FaInfo className="w-3 h-3" />
            {hint}
          </div>
        )}

        {/* Character count for memory aid */}
        {showCharacterCount && maxLength && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {String(value).length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sally's Progressive Disclosure Card
 * Implements chunking and memory load optimization
 */
interface SallyProgressiveCardProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  defaultExpanded?: boolean;
  cognitiveComplexity?: "simple" | "moderate" | "complex";
}

export function SallyProgressiveCard({
  title,
  summary,
  children,
  icon,
  defaultExpanded = false,
  cognitiveComplexity = "simple",
}: SallyProgressiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(defaultExpanded);

  const complexityStyles = {
    simple: "border border-gray-200 dark:border-gray-700",
    moderate: "border-2 border-gray-300 dark:border-gray-600 shadow-md",
    complex:
      "border-2 border-primary-200 dark:border-primary-800 shadow-lg ring-1 ring-primary-100 dark:ring-primary-900",
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (!hasBeenExpanded) {
      setHasBeenExpanded(true);
    }
  };

  return (
    <SallyAnimated variant="fadeInUp" className="w-full">
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl overflow-hidden",
          complexityStyles[cognitiveComplexity],
        )}
      >
        {/* Header - Always visible for recognition over recall */}
        <SallyHover>
          <button
            onClick={handleToggle}
            className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          >
            <div className="flex items-start gap-4">
              {icon && (
                <div className="flex-shrink-0 p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  {icon}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* Expansion indicator */}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: SALLY_TIMING.quick / 1000 }}
                className="flex-shrink-0 text-gray-400"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            </div>
          </button>
        </SallyHover>

        {/* Expandable content */}
        {(isExpanded || hasBeenExpanded) && (
          <motion.div
            initial={hasBeenExpanded ? false : { height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{
              duration: SALLY_TIMING.standard / 1000,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </div>
    </SallyAnimated>
  );
}

/**
 * Sally's Cognitive Load Indicator
 * Visual feedback for system processing and user guidance
 */
interface SallyCognitiveLoadProps {
  level: "low" | "medium" | "high";
  label?: string;
  showProgress?: boolean;
  progress?: number;
}

export function SallyCognitiveLoad({
  level,
  label,
  showProgress = false,
  progress = 0,
}: SallyCognitiveLoadProps) {
  const colors = {
    low: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
    medium:
      "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
    high: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
  };

  const indicators = {
    low: "●",
    medium: "●●",
    high: "●●●",
  };

  return (
    <SallyAnimated variant="fadeInUp">
      <div
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
          colors[level],
        )}
      >
        <span>{indicators[level]}</span>
        {label && <span>{label}</span>}
        {showProgress && (
          <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-current"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </div>
    </SallyAnimated>
  );
}

// All exports are already declared above with individual export statements

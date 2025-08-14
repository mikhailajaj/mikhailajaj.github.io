"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { FaSpinner } from "react-icons/fa";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

const variants = {
  primary:
    "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl",
  secondary:
    "bg-secondary-600 hover:bg-secondary-700 text-white shadow-lg hover:shadow-xl",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white",
  ghost: "text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
};

export function AnimatedButton({
  children,
  loading = false,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  className,
  disabled,
  onClick,
  ...props
}: AnimatedButtonProps) {
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        "relative overflow-hidden rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-current opacity-20 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <FaSpinner className="w-4 h-4 animate-spin" />
        </motion.div>
      )}

      {/* Button content */}
      <span
        className={cn(
          "flex items-center justify-center gap-2",
          loading && "opacity-0",
        )}
      >
        {icon && iconPosition === "left" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
        style={{ transform: "skewX(-45deg)" }}
      />
    </motion.button>
  );
}

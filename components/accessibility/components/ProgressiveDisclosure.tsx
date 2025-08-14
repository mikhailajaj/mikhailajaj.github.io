"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { ACCESSIBILITY_TIMING, COGNITIVE_THRESHOLDS } from "../constants";
import type { ProgressiveDisclosureProps } from "../types";

/**
 * Progressive Disclosure Component
 * Implements Miller's Rule (7±2 items) for optimal cognitive load
 */
export function ProgressiveDisclosure({
  title,
  preview,
  fullContent,
  maxPreviewItems = 3,
  cognitiveLoad = "medium",
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Miller's Rule implementation (7±2 items)
  const optimalItemCount =
    cognitiveLoad === "low" 
      ? COGNITIVE_THRESHOLDS.millerRule.low 
      : cognitiveLoad === "medium" 
        ? COGNITIVE_THRESHOLDS.millerRule.medium 
        : COGNITIVE_THRESHOLDS.millerRule.high;

  return (
    <motion.section
      className="accessibility-progressive-disclosure"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : ACCESSIBILITY_TIMING.standard,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>

        {/* Cognitive load indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Cognitive Load: {cognitiveLoad}
          </span>
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              cognitiveLoad === "low" && "bg-green-500",
              cognitiveLoad === "medium" && "bg-yellow-500",
              cognitiveLoad === "high" && "bg-red-500",
            )}
          />
        </div>
      </div>

      {/* Preview content */}
      <motion.div layout className="accessibility-preview-content">
        {preview}
      </motion.div>

      {/* Expand/Collapse button with accessibility principles */}
      <motion.button
        className={cn(
          "mt-4 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600",
          "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "min-h-[44px] min-w-[44px]", // Fitts' Law compliance
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={`${title.replace(/\s+/g, "-").toLowerCase()}-content`}
        whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
        whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
      >
        {isExpanded
          ? "Show Less"
          : `Show More (${optimalItemCount - maxPreviewItems} items)`}

        {/* Visual affordance */}
        <motion.span
          className="ml-2 inline-block"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: ACCESSIBILITY_TIMING.micro }}
        >
          ↓
        </motion.span>
      </motion.button>

      {/* Full content with smooth animation */}
      <motion.div
        id={`${title.replace(/\s+/g, "-").toLowerCase()}-content`}
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : ACCESSIBILITY_TIMING.standard,
          ease: "easeInOut",
        }}
        className="overflow-hidden"
      >
        <div className="pt-4">{fullContent}</div>
      </motion.div>

      {/* Accessibility announcement */}
      <div role="status" aria-live="polite" className="sr-only">
        {isExpanded
          ? `${title} expanded. Showing full content.`
          : `${title} collapsed. Showing preview only.`}
      </div>
    </motion.section>
  );
}
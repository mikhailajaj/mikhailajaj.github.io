"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useAccessibility } from "../context/AccessibilityContext";
import { ACCESSIBILITY_TIMING, COGNITIVE_THRESHOLDS } from "../constants";
import type { AdaptiveHeroProps, AdaptiveSettings } from "../types";

/**
 * Adaptive Hero Component
 * Adjusts complexity based on user preferences and device capabilities
 */
export function AdaptiveHero({
  children,
  className,
  cognitiveComplexity = "medium",
}: AdaptiveHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const { userPreference, deviceCapability, cognitiveCapacity } = useAccessibility();
  const [adaptedProps, setAdaptedProps] = useState<AdaptiveSettings>({
    animationDuration: ACCESSIBILITY_TIMING.standard,
    staggerDelay: 150,
    particleCount: 50,
    complexity: "standard",
  });

  useEffect(() => {
    // Cognitive Load Calculation
    const calculateOptimalSettings = (): AdaptiveSettings => {
      const complexityScore = {
        low: 1,
        medium: 2,
        high: 3,
      }[cognitiveComplexity];

      const userScore = {
        minimal: 1,
        standard: 2,
        enhanced: 3,
      }[userPreference];

      const deviceScore = {
        low: 1,
        medium: 2,
        high: 3,
      }[deviceCapability];

      // Adaptive algorithm based on HCI research
      const totalLoad = (complexityScore + userScore + deviceScore) / 3;

      if (totalLoad <= COGNITIVE_THRESHOLDS.complexity.low || prefersReducedMotion) {
        return {
          animationDuration: ACCESSIBILITY_TIMING.micro,
          staggerDelay: 50,
          particleCount: 20,
          complexity: "minimal",
        };
      } else if (totalLoad <= COGNITIVE_THRESHOLDS.complexity.medium) {
        return {
          animationDuration: ACCESSIBILITY_TIMING.standard,
          staggerDelay: 150,
          particleCount: 50,
          complexity: "standard",
        };
      } else {
        return {
          animationDuration: ACCESSIBILITY_TIMING.deliberate,
          staggerDelay: 200,
          particleCount: 100,
          complexity: "enhanced",
        };
      }
    };

    setAdaptedProps(calculateOptimalSettings());
  }, [cognitiveComplexity, userPreference, deviceCapability, cognitiveCapacity, prefersReducedMotion]);

  return (
    <motion.div
      className={cn(
        "accessibility-adaptive-hero relative min-h-screen flex items-center justify-center",
        "overflow-hidden",
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: adaptedProps.animationDuration,
      }}
      data-cognitive-complexity={adaptedProps.complexity}
    >
      {children}
    </motion.div>
  );
}
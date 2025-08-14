"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useAccessibility } from "../context/AccessibilityContext";
import { ACCESSIBILITY_TIMING, COGNITIVE_THRESHOLDS } from "../constants";
import type { LazySectionProps } from "../types";

/**
 * Lazy Section Component
 * Performance-optimized lazy loading with cognitive load monitoring
 */
export function LazySection({
  children,
  priority = "low",
  className,
  performanceThreshold = COGNITIVE_THRESHOLDS.performance.optimal,
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(priority === "high");
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderTime: 0,
    isOptimal: true,
  });
  const prefersReducedMotion = useReducedMotion();
  const { performanceMetrics: globalMetrics } = useAccessibility();

  useEffect(() => {
    if (priority === "high") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Performance monitoring
            const startTime = performance.now();

            setIsVisible(true);

            // Measure render performance
            requestAnimationFrame(() => {
              const endTime = performance.now();
              const renderTime = endTime - startTime;

              setPerformanceMetrics({
                renderTime,
                isOptimal: renderTime <= performanceThreshold,
              });

              // Adaptive optimization warning
              if (renderTime > performanceThreshold) {
                console.warn(
                  `Accessibility System: Slow render detected (${renderTime.toFixed(2)}ms). Consider optimizing this section.`,
                );
              }
            });

            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: priority === "medium" ? "100px" : "200px",
        threshold: 0.1,
      },
    );

    const element = document.querySelector(`[data-accessibility-lazy="${priority}"]`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [priority, performanceThreshold]);

  return (
    <motion.section
      data-accessibility-lazy={priority}
      className={cn("accessibility-lazy-section", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
      }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : ACCESSIBILITY_TIMING.standard,
        ease: "easeOut",
      }}
    >
      {isVisible ? (
        children
      ) : (
        <div className="accessibility-lazy-placeholder min-h-[200px] flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading content...</div>
        </div>
      )}

      {/* Performance indicator (dev mode only) */}
      {process.env.NODE_ENV === "development" && isVisible && (
        <div
          className={cn(
            "fixed bottom-4 right-4 px-2 py-1 rounded text-xs",
            performanceMetrics.isOptimal ? "bg-green-500" : "bg-red-500",
            "text-white z-50",
          )}
        >
          Render: {performanceMetrics.renderTime.toFixed(1)}ms
        </div>
      )}
    </motion.section>
  );
}
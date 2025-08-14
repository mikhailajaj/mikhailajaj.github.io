"use client";

import React, { useRef, useState, useEffect } from "react";
import { useIntersectionProgressiveLoading } from "@/hooks/useProgressiveLoading";

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  priority?: "high" | "medium" | "low";
  delay?: number;
  className?: string;
  onLoad?: () => void;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "50px",
  priority = "medium",
  delay = 0,
  className = "",
  onLoad,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const priorityDelays = {
    high: 0,
    medium: 100,
    low: 300,
  };

  const { isIntersecting } = useIntersectionProgressiveLoading(ref, {
    threshold,
    rootMargin,
    stages: [
      {
        id: "content",
        priority: 1,
        delay: delay + priorityDelays[priority],
      },
    ],
    onStageLoad: () => {
      setShouldLoad(true);
      onLoad?.();
    },
  });

  return (
    <div ref={ref} className={className}>
      {shouldLoad
        ? children
        : fallback || (
            <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          )}
    </div>
  );
};

// Specialized lazy loading for interactive components
export const LazyInteractiveSection: React.FC<{
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}> = ({ children, title, description, className = "" }) => {
  return (
    <LazySection
      priority="medium"
      delay={200}
      className={className}
      fallback={
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-700 rounded"></div>
            <div>
              <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
              {description && (
                <div className="h-4 bg-gray-700 rounded w-64"></div>
              )}
            </div>
          </div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      }
    >
      {children}
    </LazySection>
  );
};

// Specialized lazy loading for 3D components
export const Lazy3DSection: React.FC<{
  children: React.ReactNode;
  title: string;
  className?: string;
}> = ({ children, title, className = "" }) => {
  return (
    <LazySection
      priority="low"
      delay={500}
      threshold={0.2}
      rootMargin="100px"
      className={className}
      fallback={
        <div className="relative w-full h-64 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-white text-sm">Loading {title}</div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </LazySection>
  );
};

// Progressive loading container for multiple components
export const ProgressiveContainer: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 150, className = "" }) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadedCount((prev) => {
        if (prev < children.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, staggerDelay);

    return () => clearInterval(timer);
  }, [children.length, staggerDelay]);

  return (
    <div className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={`transition-opacity duration-500 ${
            index < loadedCount ? "opacity-100" : "opacity-0"
          }`}
        >
          {index < loadedCount ? child : null}
        </div>
      ))}
    </div>
  );
};

"use client";

import { useState, useEffect, useRef } from "react";

interface LoadingStage {
  id: string;
  priority: number;
  delay?: number;
  condition?: () => boolean;
}

interface UseProgressiveLoadingOptions {
  stages: LoadingStage[];
  onStageLoad?: (stageId: string) => void;
  onComplete?: () => void;
}

export function useProgressiveLoading({
  stages,
  onStageLoad,
  onComplete,
}: UseProgressiveLoadingOptions) {
  const [loadedStages, setLoadedStages] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Sort stages by priority
    const sortedStages = [...stages].sort((a, b) => a.priority - b.priority);

    // Clear existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // Schedule stage loading
    sortedStages.forEach((stage, index) => {
      const baseDelay = index * 100; // Stagger by 100ms
      const customDelay = stage.delay || 0;
      const totalDelay = baseDelay + customDelay;

      const timeout = setTimeout(() => {
        // Check condition if provided
        if (stage.condition && !stage.condition()) {
          return;
        }

        setLoadedStages((prev) => {
          const newSet = new Set([...prev, stage.id]);
          onStageLoad?.(stage.id);

          // Check if all stages are loaded
          if (newSet.size === stages.length) {
            setIsComplete(true);
            onComplete?.();
          }

          return newSet;
        });
      }, totalDelay);

      timeoutsRef.current.push(timeout);
    });

    // Cleanup on unmount
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [stages, onStageLoad, onComplete]);

  const isStageLoaded = (stageId: string) => loadedStages.has(stageId);

  const loadStage = (stageId: string) => {
    setLoadedStages((prev) => new Set([...prev, stageId]));
    onStageLoad?.(stageId);
  };

  const resetLoading = () => {
    setLoadedStages(new Set());
    setIsComplete(false);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  return {
    loadedStages,
    isStageLoaded,
    loadStage,
    isComplete,
    resetLoading,
    progress: (loadedStages.size / stages.length) * 100,
  };
}

// Hook for intersection-based progressive loading
export function useIntersectionProgressiveLoading(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit & {
    stages: LoadingStage[];
    onStageLoad?: (stageId: string) => void;
  },
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { stages, onStageLoad, ...intersectionOptions } = options;

  const progressiveLoading = useProgressiveLoading({
    stages,
    onStageLoad,
  });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, intersectionOptions);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, intersectionOptions]);

  // Start progressive loading when component comes into view
  useEffect(() => {
    if (isIntersecting && progressiveLoading.loadedStages.size === 0) {
      // Trigger the first stage manually to start the cascade
      if (stages.length > 0) {
        progressiveLoading.loadStage(stages[0].id);
      }
    }
  }, [isIntersecting, stages, progressiveLoading]);

  return {
    ...progressiveLoading,
    isIntersecting,
  };
}

// Hook for performance-based progressive loading
export function usePerformanceProgressiveLoading(
  stages: LoadingStage[],
  performanceThreshold: number = 60, // FPS threshold
) {
  const [currentFPS, setCurrentFPS] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  // Monitor performance
  useEffect(() => {
    let animationFrame: number;

    const measurePerformance = () => {
      frameCountRef.current++;
      const currentTime = performance.now();

      if (currentTime - lastTimeRef.current >= 1000) {
        const fps =
          (frameCountRef.current * 1000) / (currentTime - lastTimeRef.current);
        setCurrentFPS(fps);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationFrame = requestAnimationFrame(measurePerformance);
    };

    animationFrame = requestAnimationFrame(measurePerformance);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Adjust stages based on performance
  const adjustedStages = stages.map((stage) => ({
    ...stage,
    condition: () => currentFPS >= performanceThreshold,
    delay:
      currentFPS < performanceThreshold ? (stage.delay || 0) * 2 : stage.delay,
  }));

  return useProgressiveLoading({
    stages: adjustedStages,
    onStageLoad: (stageId) => {
      console.log(`Loaded stage ${stageId} at ${currentFPS.toFixed(1)} FPS`);
    },
  });
}

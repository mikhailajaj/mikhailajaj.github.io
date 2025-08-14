"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Types for real-time preview hook
interface RealtimePreviewConfig {
  debounceMs?: number;
  autoUpdate?: boolean;
  errorRetryCount?: number;
  retryDelayMs?: number;
  enableHotReload?: boolean;
}

interface PreviewState {
  isUpdating: boolean;
  lastUpdate: Date | null;
  error: string | null;
  updateCount: number;
  content: any;
}

interface UseRealtimePreviewReturn {
  previewState: PreviewState;
  updatePreview: (content: string) => Promise<void>;
  clearError: () => void;
  forceUpdate: () => Promise<void>;
  isDebouncing: boolean;
}

export const useRealtimePreview = (
  initialContent: string,
  updateFunction: (content: string) => Promise<any>,
  config: RealtimePreviewConfig = {},
): UseRealtimePreviewReturn => {
  const {
    debounceMs = 1000,
    autoUpdate = true,
    errorRetryCount = 3,
    retryDelayMs = 1000,
    enableHotReload = true,
  } = config;

  const [previewState, setPreviewState] = useState<PreviewState>({
    isUpdating: false,
    lastUpdate: null,
    error: null,
    updateCount: 0,
    content: null,
  });

  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const lastContentRef = useRef(initialContent);
  const currentContentRef = useRef(initialContent);

  // Debounced update function
  const debouncedUpdate = useCallback(
    async (content: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      setIsDebouncing(true);

      debounceTimerRef.current = setTimeout(async () => {
        setIsDebouncing(false);
        await executeUpdate(content);
      }, debounceMs);
    },
    [debounceMs],
  );

  // Execute the actual update
  const executeUpdate = async (content: string) => {
    if (content === lastContentRef.current) return;

    setPreviewState((prev) => ({
      ...prev,
      isUpdating: true,
      error: null,
    }));

    try {
      const result = await updateFunction(content);

      setPreviewState((prev) => ({
        ...prev,
        isUpdating: false,
        lastUpdate: new Date(),
        error: null,
        updateCount: prev.updateCount + 1,
        content: result,
      }));

      lastContentRef.current = content;
      retryCountRef.current = 0;

      // Hot reload simulation
      if (enableHotReload && typeof window !== "undefined") {
        // Dispatch custom event for hot reload
        window.dispatchEvent(
          new CustomEvent("previewUpdated", {
            detail: { content: result, timestamp: new Date() },
          }),
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Preview update failed";

      // Retry logic
      if (retryCountRef.current < errorRetryCount) {
        retryCountRef.current++;

        setTimeout(() => {
          executeUpdate(content);
        }, retryDelayMs * retryCountRef.current);

        setPreviewState((prev) => ({
          ...prev,
          isUpdating: true,
          error: `Retrying... (${retryCountRef.current}/${errorRetryCount})`,
        }));
      } else {
        setPreviewState((prev) => ({
          ...prev,
          isUpdating: false,
          error: errorMessage,
        }));

        retryCountRef.current = 0;
      }
    }
  };

  // Update preview function
  const updatePreview = useCallback(
    async (content: string) => {
      currentContentRef.current = content;

      if (autoUpdate) {
        await debouncedUpdate(content);
      }
    },
    [autoUpdate, debouncedUpdate],
  );

  // Force immediate update
  const forceUpdate = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      setIsDebouncing(false);
    }
    await executeUpdate(currentContentRef.current);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setPreviewState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Auto-update when content changes
  useEffect(() => {
    if (autoUpdate && initialContent !== lastContentRef.current) {
      updatePreview(initialContent);
    }
  }, [initialContent, autoUpdate, updatePreview]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Hot reload event listener
  useEffect(() => {
    if (!enableHotReload || typeof window === "undefined") return;

    const handleHotReload = (event: CustomEvent) => {
      // Handle hot reload events from other components
      console.log("Hot reload triggered:", event.detail);
    };

    window.addEventListener("previewUpdated", handleHotReload as EventListener);

    return () => {
      window.removeEventListener(
        "previewUpdated",
        handleHotReload as EventListener,
      );
    };
  }, [enableHotReload]);

  return {
    previewState,
    updatePreview,
    clearError,
    forceUpdate,
    isDebouncing,
  };
};

// Error handling utilities
export const createPreviewError = (message: string, code?: string): Error => {
  const error = new Error(message);
  error.name = "PreviewError";
  (error as any).code = code;
  return error;
};

// Validation utilities
export const validateContent = (
  content: string,
  language: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content.trim()) {
    errors.push("Content cannot be empty");
  }

  // Language-specific validation
  switch (language) {
    case "javascript":
    case "typescript":
      try {
        // Basic syntax check (this is simplified)
        if (content.includes("function") && !content.includes("{")) {
          errors.push("Function declaration appears incomplete");
        }
      } catch (e) {
        errors.push("JavaScript syntax error detected");
      }
      break;

    case "json":
      try {
        JSON.parse(content);
      } catch (e) {
        errors.push("Invalid JSON format");
      }
      break;

    case "sql":
      if (
        !content.toLowerCase().includes("select") &&
        !content.toLowerCase().includes("insert") &&
        !content.toLowerCase().includes("update") &&
        !content.toLowerCase().includes("delete")
      ) {
        errors.push("SQL statement type not recognized");
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Performance monitoring
export const usePreviewPerformance = () => {
  const [metrics, setMetrics] = useState({
    averageUpdateTime: 0,
    totalUpdates: 0,
    errorRate: 0,
    lastUpdateTime: 0,
  });

  const recordUpdate = useCallback((duration: number, hasError: boolean) => {
    setMetrics((prev) => {
      const newTotalUpdates = prev.totalUpdates + 1;
      const newAverageUpdateTime =
        (prev.averageUpdateTime * prev.totalUpdates + duration) /
        newTotalUpdates;
      const newErrorRate = hasError
        ? (prev.errorRate * prev.totalUpdates + 1) / newTotalUpdates
        : (prev.errorRate * prev.totalUpdates) / newTotalUpdates;

      return {
        averageUpdateTime: newAverageUpdateTime,
        totalUpdates: newTotalUpdates,
        errorRate: newErrorRate,
        lastUpdateTime: duration,
      };
    });
  }, []);

  return { metrics, recordUpdate };
};

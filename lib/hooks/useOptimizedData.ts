/**
 * Production-Ready Data Hooks
 * Optimized hooks for efficient data fetching and state management
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { dataService } from "@/lib/services/DataService";
import { Project, Testimonial, Technology } from "@/data/types";

// Generic optimized data hook
function useOptimizedData<T>(
  fetchFunction: (forceRefresh?: boolean) => Promise<T>,
  dependencies: any[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(forceRefresh);
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      console.error("Data fetch error:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => fetchData(true), [fetchData]);

  return useMemo(
    () => ({
      data,
      loading,
      error,
      refresh,
      refetch: fetchData,
    }),
    [data, loading, error, refresh, fetchData],
  );
}

// Specialized hooks for each data type
export function useOptimizedProjects() {
  return useOptimizedData(() => dataService.fetchProjects());
}

export function useOptimizedTestimonials() {
  return useOptimizedData(() => dataService.fetchTestimonials());
}

export function useOptimizedTechnologies() {
  return useOptimizedData(() => dataService.fetchTechnologies());
}

// Project-specific hooks
export function useOptimizedProject(id: string) {
  return useOptimizedData(() => dataService.fetchProjectById(id), [id]);
}

// Performance monitoring hook
export function useDataServicePerformance() {
  const [metrics, setMetrics] = useState(dataService.getPerformanceMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(dataService.getPerformanceMetrics());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}

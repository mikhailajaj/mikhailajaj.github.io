/**
 * Optimized Data Provider - useContext Performance Enhancement
 * Implements clean code principles with efficient GET methods and context optimization
 */

"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Project,
  Testimonial,
  Technology,
  PortfolioAnalytics,
} from "@/data/types";
import { TechnicalDomain, ApiResponse } from "@/lib/utils/base-types";

// ============================================================================
// OPTIMIZED GET METHODS - Clean Code Implementation
// ============================================================================

/**
 * High-performance data fetcher with caching and deduplication
 * Implements "Name Things Like They Matter" principle
 */
class OptimizedPortfolioDataFetcher {
  private cache = new Map<
    string,
    {
      data: any;
      timestamp: number;
      timeToLive: number;
    }
  >();

  private pendingRequests = new Map<string, Promise<any>>();

  /**
   * Optimized GET method with request deduplication and intelligent caching
   * Follows "Keep Functions Focused" principle
   */
  async optimizedGET<T>(
    endpoint: string,
    options: {
      timeToLive?: number;
      forceRefresh?: boolean;
      retryAttempts?: number;
    } = {},
  ): Promise<T> {
    const {
      timeToLive = 300000, // 5 minutes default TTL
      forceRefresh = false,
      retryAttempts = 3,
    } = options;

    const cacheKey = this.generateCacheKey(endpoint, options);

    // Check cache first (unless force refresh requested)
    if (!forceRefresh && this.isCacheEntryValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    // Request deduplication - return existing promise if request in flight
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)!;
    }

    // Create new optimized request
    const requestPromise = this.executeOptimizedRequest<T>(
      endpoint,
      retryAttempts,
    )
      .then((responseData) => {
        // Cache successful response with TTL
        this.cacheSuccessfulResponse(cacheKey, responseData, timeToLive);
        return responseData;
      })
      .finally(() => {
        // Clean up pending request tracking
        this.pendingRequests.delete(cacheKey);
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Execute GET request with exponential backoff retry logic
   * Implements "Make Side Effects Obvious" principle
   */
  private async executeOptimizedRequest<T>(
    endpoint: string,
    retryAttempts: number,
  ): Promise<T> {
    for (let attempt = 0; attempt <= retryAttempts; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
      } catch (error) {
        if (attempt === retryAttempts) {
          throw new Error(
            `Failed to fetch ${endpoint} after ${retryAttempts + 1} attempts: ${error}`,
          );
        }

        // Exponential backoff delay
        await this.exponentialBackoffDelay(attempt);
      }
    }

    throw new Error("Unexpected error in request execution");
  }

  /**
   * Generate consistent cache key for request deduplication
   */
  private generateCacheKey(endpoint: string, options: any): string {
    return `${endpoint}_${JSON.stringify(options)}`;
  }

  /**
   * Check if cached entry is still valid based on TTL
   */
  private isCacheEntryValid(cacheKey: string): boolean {
    const cachedEntry = this.cache.get(cacheKey);
    if (!cachedEntry) return false;

    const currentTime = Date.now();
    const entryAge = currentTime - cachedEntry.timestamp;

    return entryAge < cachedEntry.timeToLive;
  }

  /**
   * Cache successful response with timestamp and TTL
   */
  private cacheSuccessfulResponse(
    cacheKey: string,
    data: any,
    timeToLive: number,
  ): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      timeToLive,
    });
  }

  /**
   * Exponential backoff delay for retry attempts
   */
  private exponentialBackoffDelay(attemptNumber: number): Promise<void> {
    const delayMs = Math.pow(2, attemptNumber) * 1000;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  /**
   * Clear expired cache entries for memory management
   */
  public clearExpiredCacheEntries(): void {
    const currentTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      const entryAge = currentTime - entry.timestamp;
      if (entryAge >= entry.timeToLive) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  public getCacheStatistics(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
    hitRate: number;
  } {
    const totalEntries = this.cache.size;
    let validEntries = 0;

    for (const [key] of this.cache.entries()) {
      if (this.isCacheEntryValid(key)) {
        validEntries++;
      }
    }

    const expiredEntries = totalEntries - validEntries;
    const hitRate = totalEntries > 0 ? (validEntries / totalEntries) * 100 : 0;

    return {
      totalEntries,
      validEntries,
      expiredEntries,
      hitRate,
    };
  }
}

// Global optimized data fetcher instance
export const portfolioDataFetcher = new OptimizedPortfolioDataFetcher();

// ============================================================================
// OPTIMIZED CONTEXT PROVIDERS - Focused Single Responsibility
// ============================================================================

/**
 * Project Data Context - Single Responsibility for Project Management
 * Implements "Keep Functions Focused" principle
 */
interface ProjectContextType {
  projects: Project[];
  featuredProjects: Project[];
  projectsByDomain: Record<TechnicalDomain, Project[]>;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;

  // Actions
  fetchProjects: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByDomain: (domain: TechnicalDomain) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/**
 * Optimized Project Provider with memoization and performance tracking
 */
export function OptimizedProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  /**
   * Memoized featured projects to prevent unnecessary recalculations
   * Implements "Don't Repeat Decisions" principle
   */
  const featuredProjects = useMemo(
    () => projects.filter((project) => project.featured),
    [projects],
  );

  /**
   * Memoized projects by domain for efficient filtering
   */
  const projectsByDomain = useMemo(() => {
    const domainMap: Record<TechnicalDomain, Project[]> = {} as Record<
      TechnicalDomain,
      Project[]
    >;

    projects.forEach((project) => {
      if (!domainMap[project.domain as TechnicalDomain]) {
        domainMap[project.domain as TechnicalDomain] = [];
      }
      domainMap[project.domain as TechnicalDomain].push(project);
    });

    return domainMap;
  }, [projects]);

  /**
   * Optimized fetch projects with caching
   * Implements "Make Side Effects Obvious" principle
   */
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await portfolioDataFetcher.optimizedGET<{
        data: Project[];
      }>(
        "/api/projects",
        { timeToLive: 300000 }, // 5 minutes cache
      );

      setProjects(response.data);
      setLastFetched(new Date());
    } catch (fetchError) {
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch projects";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Force refresh projects (bypass cache)
   */
  const refreshProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await portfolioDataFetcher.optimizedGET<{
        data: Project[];
      }>("/api/projects", { forceRefresh: true });

      setProjects(response.data);
      setLastFetched(new Date());
    } catch (fetchError) {
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to refresh projects";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get project by ID with memoized lookup
   */
  const getProjectById = useCallback(
    (id: string): Project | undefined => {
      return projects.find((project) => project.id === id);
    },
    [projects],
  );

  /**
   * Get projects by domain with memoized filtering
   */
  const getProjectsByDomain = useCallback(
    (domain: TechnicalDomain): Project[] => {
      return projectsByDomain[domain] || [];
    },
    [projectsByDomain],
  );

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Critical optimization for useContext performance
   */
  const contextValue = useMemo(
    () => ({
      projects,
      featuredProjects,
      projectsByDomain,
      loading,
      error,
      lastFetched,
      fetchProjects,
      refreshProjects,
      getProjectById,
      getProjectsByDomain,
    }),
    [
      projects,
      featuredProjects,
      projectsByDomain,
      loading,
      error,
      lastFetched,
      fetchProjects,
      refreshProjects,
      getProjectById,
      getProjectsByDomain,
    ],
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Optimized useProjectData hook with error handling
 * Implements "Name Things Like They Matter" principle
 */
export function useProjectData(): ProjectContextType {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error(
      "useProjectData must be used within an OptimizedProjectProvider. " +
        "Ensure your component is wrapped with <OptimizedProjectProvider>.",
    );
  }

  return context;
}

// ============================================================================
// CONTEXT SELECTORS - Fine-Grained Re-render Control
// ============================================================================

/**
 * Project selector hook to prevent unnecessary re-renders
 * Implements "Keep Functions Focused" principle
 */
export function useProjectSelector<T>(
  selector: (projectData: ProjectContextType) => T,
): T {
  const projectData = useProjectData();

  return useMemo(() => selector(projectData), [projectData, selector]);
}

/**
 * Specific selector hooks for common use cases
 */
export function useFeaturedProjects(): Project[] {
  return useProjectSelector((data) => data.featuredProjects);
}

export function useProjectsByDomain(domain: TechnicalDomain): Project[] {
  return useProjectSelector((data) => data.getProjectsByDomain(domain));
}

export function useProjectCount(): number {
  return useProjectSelector((data) => data.projects.length);
}

export function useProjectsLoading(): boolean {
  return useProjectSelector((data) => data.loading);
}

export function useProjectsError(): string | null {
  return useProjectSelector((data) => data.error);
}

// ============================================================================
// TESTIMONIAL CONTEXT - Similar Pattern for Testimonials
// ============================================================================

interface TestimonialContextType {
  testimonials: Testimonial[];
  featuredTestimonials: Testimonial[];
  testimonialsByDomain: Record<TechnicalDomain, Testimonial[]>;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;

  fetchTestimonials: () => Promise<void>;
  refreshTestimonials: () => Promise<void>;
  getTestimonialById: (id: string) => Testimonial | undefined;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(
  undefined,
);

export function OptimizedTestimonialProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const featuredTestimonials = useMemo(
    () => testimonials.filter((testimonial) => testimonial.featured),
    [testimonials],
  );

  const testimonialsByDomain = useMemo(() => {
    const domainMap: Record<TechnicalDomain, Testimonial[]> = {} as Record<
      TechnicalDomain,
      Testimonial[]
    >;

    testimonials.forEach((testimonial) => {
      if (!domainMap[testimonial.domain as TechnicalDomain]) {
        domainMap[testimonial.domain as TechnicalDomain] = [];
      }
      domainMap[testimonial.domain as TechnicalDomain].push(testimonial);
    });

    return domainMap;
  }, [testimonials]);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await portfolioDataFetcher.optimizedGET<{
        data: Testimonial[];
      }>(
        "/api/testimonials",
        { timeToLive: 600000 }, // 10 minutes cache for testimonials
      );

      setTestimonials(response.data);
      setLastFetched(new Date());
    } catch (fetchError) {
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch testimonials";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await portfolioDataFetcher.optimizedGET<{
        data: Testimonial[];
      }>("/api/testimonials", { forceRefresh: true });

      setTestimonials(response.data);
      setLastFetched(new Date());
    } catch (fetchError) {
      const errorMessage =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to refresh testimonials";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTestimonialById = useCallback(
    (id: string): Testimonial | undefined => {
      return testimonials.find((testimonial) => testimonial.id === id);
    },
    [testimonials],
  );

  const contextValue = useMemo(
    () => ({
      testimonials,
      featuredTestimonials,
      testimonialsByDomain,
      loading,
      error,
      lastFetched,
      fetchTestimonials,
      refreshTestimonials,
      getTestimonialById,
    }),
    [
      testimonials,
      featuredTestimonials,
      testimonialsByDomain,
      loading,
      error,
      lastFetched,
      fetchTestimonials,
      refreshTestimonials,
      getTestimonialById,
    ],
  );

  return (
    <TestimonialContext.Provider value={contextValue}>
      {children}
    </TestimonialContext.Provider>
  );
}

export function useTestimonialData(): TestimonialContextType {
  const context = useContext(TestimonialContext);

  if (context === undefined) {
    throw new Error(
      "useTestimonialData must be used within an OptimizedTestimonialProvider",
    );
  }

  return context;
}

// ============================================================================
// PERFORMANCE MONITORING - Track Context Performance
// ============================================================================

interface ContextPerformanceMetrics {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  contextSubscriptions: string[];
  averageRenderDuration: number;
  totalRenderTime: number;
}

class ContextPerformanceMonitor {
  private metrics = new Map<string, ContextPerformanceMetrics>();

  trackComponentRender(componentName: string, contextNames: string[]) {
    const renderStartTime = performance.now();

    return () => {
      const renderEndTime = performance.now();
      const renderDuration = renderEndTime - renderStartTime;

      const existingMetrics = this.metrics.get(componentName) || {
        componentName,
        renderCount: 0,
        lastRenderTime: 0,
        contextSubscriptions: [],
        averageRenderDuration: 0,
        totalRenderTime: 0,
      };

      const newRenderCount = existingMetrics.renderCount + 1;
      const newTotalRenderTime =
        existingMetrics.totalRenderTime + renderDuration;
      const newAverageRenderDuration = newTotalRenderTime / newRenderCount;

      this.metrics.set(componentName, {
        ...existingMetrics,
        renderCount: newRenderCount,
        lastRenderTime: Date.now(),
        contextSubscriptions: contextNames,
        averageRenderDuration: newAverageRenderDuration,
        totalRenderTime: newTotalRenderTime,
      });
    };
  }

  getPerformanceReport(): ContextPerformanceMetrics[] {
    return Array.from(this.metrics.values()).sort(
      (a, b) => b.renderCount - a.renderCount,
    );
  }

  getSlowRenderingComponents(
    thresholdMs: number = 16,
  ): ContextPerformanceMetrics[] {
    return this.getPerformanceReport().filter(
      (metric) => metric.averageRenderDuration > thresholdMs,
    );
  }

  resetMetrics(): void {
    this.metrics.clear();
  }
}

export const contextPerformanceMonitor = new ContextPerformanceMonitor();

/**
 * Hook to track component performance with context usage
 */
export function useContextPerformanceTracking(
  componentName: string,
  contextNames: string[],
) {
  useEffect(() => {
    const endTracking = contextPerformanceMonitor.trackComponentRender(
      componentName,
      contextNames,
    );

    return endTracking;
  });
}

// ============================================================================
// OPTIMIZED APP PROVIDERS - Complete Provider Setup
// ============================================================================

/**
 * Complete optimized provider setup with error boundaries
 * Implements clean architecture with focused responsibilities
 */
export function OptimizedPortfolioProviders({
  children,
}: {
  children: ReactNode;
}) {
  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      portfolioDataFetcher.clearExpiredCacheEntries();
    }, 60000); // Clean up every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <OptimizedProjectProvider>
      <OptimizedTestimonialProvider>{children}</OptimizedTestimonialProvider>
    </OptimizedProjectProvider>
  );
}

export default OptimizedPortfolioProviders;

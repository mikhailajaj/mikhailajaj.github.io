/**
 * Centralized Data Hooks
 * React hooks for accessing portfolio data with caching and state management
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { dataService, DataService } from "./DataService";
import {
  Project,
  Testimonial,
  Technology,
  ProjectFilter,
  TestimonialFilter,
  ProjectSortOptions,
  ProjectQueryOptions,
  TestimonialQueryOptions,
} from "@/data/types";
import { TechnicalDomain, ApiResponse, Result } from "@/lib/utils/base-types";

// ============================================================================
// HOOK TYPES AND INTERFACES
// ============================================================================

/**
 * Base hook state interface
 */
interface BaseHookState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

/**
 * Hook options interface
 */
interface HookOptions {
  enabled?: boolean;
  refetchOnMount?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

/**
 * Paginated hook state
 */
interface PaginatedHookState<T> extends BaseHookState<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================================================
// PROJECT HOOKS
// ============================================================================

/**
 * Hook to get all projects with filtering and sorting
 */
export function useProjects(
  options: ProjectQueryOptions = {},
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<Project[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const {
    enabled = true,
    refetchOnMount = true,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 1 * 60 * 1000, // 1 minute
  } = hookOptions;

  const fetchProjects = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getProjects(options);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch projects",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, JSON.stringify(options)]);

  const refetch = useCallback(() => {
    return fetchProjects();
  }, [fetchProjects]);

  const isStale = useMemo(() => {
    if (!state.lastFetched) return true;
    return Date.now() - state.lastFetched.getTime() > staleTime;
  }, [state.lastFetched, staleTime]);

  useEffect(() => {
    if (enabled && (refetchOnMount || isStale)) {
      fetchProjects();
    }
  }, [enabled, refetchOnMount, isStale, fetchProjects]);

  return {
    ...state,
    refetch,
    isStale,
  };
}

/**
 * Hook to get a single project by ID
 */
export function useProject(id: string, hookOptions: HookOptions = {}) {
  const [state, setState] = useState<BaseHookState<Project>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchProject = useCallback(async () => {
    if (!enabled || !id) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getProject(id);

      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch project",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, id]);

  const refetch = useCallback(() => {
    return fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    if (enabled && refetchOnMount && id) {
      fetchProject();
    }
  }, [enabled, refetchOnMount, id, fetchProject]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook to get featured projects
 */
export function useFeaturedProjects(
  limit: number = 6,
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<Project[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchFeaturedProjects = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getFeaturedProjects(limit);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch featured projects",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, limit]);

  const refetch = useCallback(() => {
    return fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchFeaturedProjects();
    }
  }, [enabled, refetchOnMount, fetchFeaturedProjects]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook to get projects by domain
 */
export function useProjectsByDomain(
  domain: TechnicalDomain,
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<Project[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchProjectsByDomain = useCallback(async () => {
    if (!enabled || !domain) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getProjectsByDomain(domain);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch domain projects",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, domain]);

  const refetch = useCallback(() => {
    return fetchProjectsByDomain();
  }, [fetchProjectsByDomain]);

  useEffect(() => {
    if (enabled && refetchOnMount && domain) {
      fetchProjectsByDomain();
    }
  }, [enabled, refetchOnMount, domain, fetchProjectsByDomain]);

  return {
    ...state,
    refetch,
  };
}

// ============================================================================
// TESTIMONIAL HOOKS
// ============================================================================

/**
 * Hook to get testimonials with filtering and sorting
 */
export function useTestimonials(
  options: TestimonialQueryOptions = {},
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<Testimonial[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchTestimonials = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getTestimonials(options);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch testimonials",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, JSON.stringify(options)]);

  const refetch = useCallback(() => {
    return fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchTestimonials();
    }
  }, [enabled, refetchOnMount, fetchTestimonials]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook to get featured testimonials
 */
export function useFeaturedTestimonials(
  limit: number = 3,
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<Testimonial[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchFeaturedTestimonials = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getFeaturedTestimonials(limit);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            response.error?.message || "Failed to fetch featured testimonials",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, limit]);

  const refetch = useCallback(() => {
    return fetchFeaturedTestimonials();
  }, [fetchFeaturedTestimonials]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchFeaturedTestimonials();
    }
  }, [enabled, refetchOnMount, fetchFeaturedTestimonials]);

  return {
    ...state,
    refetch,
  };
}

// ============================================================================
// TECHNOLOGY HOOKS
// ============================================================================

/**
 * Hook to get all technologies
 */
export function useTechnologies(hookOptions: HookOptions = {}) {
  const [state, setState] = useState<BaseHookState<Technology[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchTechnologies = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getTechnologies();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch technologies",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled]);

  const refetch = useCallback(() => {
    return fetchTechnologies();
  }, [fetchTechnologies]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchTechnologies();
    }
  }, [enabled, refetchOnMount, fetchTechnologies]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook to get technologies by domain
 */
export function useTechnologiesByDomain(
  domain: TechnicalDomain,
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<Technology[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchTechnologiesByDomain = useCallback(async () => {
    if (!enabled || !domain) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getTechnologiesByDomain(domain);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            response.error?.message || "Failed to fetch domain technologies",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, domain]);

  const refetch = useCallback(() => {
    return fetchTechnologiesByDomain();
  }, [fetchTechnologiesByDomain]);

  useEffect(() => {
    if (enabled && refetchOnMount && domain) {
      fetchTechnologiesByDomain();
    }
  }, [enabled, refetchOnMount, domain, fetchTechnologiesByDomain]);

  return {
    ...state,
    refetch,
  };
}

// ============================================================================
// SEARCH HOOKS
// ============================================================================

/**
 * Hook for project search with debouncing
 */
export function useProjectSearch(query: string, debounceMs: number = 300) {
  const [state, setState] = useState<BaseHookState<Project[]>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const searchProjects = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setState({
        data: [],
        loading: false,
        error: null,
        lastFetched: new Date(),
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.searchProjects(searchQuery);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to search projects",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, []);

  useEffect(() => {
    searchProjects(debouncedQuery);
  }, [debouncedQuery, searchProjects]);

  return {
    ...state,
    query: debouncedQuery,
  };
}

// ============================================================================
// ANALYTICS HOOKS
// ============================================================================

/**
 * Hook to get portfolio statistics
 */
export function usePortfolioStats(hookOptions: HookOptions = {}) {
  const [state, setState] = useState<BaseHookState<any>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchPortfolioStats = useCallback(async () => {
    if (!enabled) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getPortfolioStats();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            response.error?.message || "Failed to fetch portfolio statistics",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled]);

  const refetch = useCallback(() => {
    return fetchPortfolioStats();
  }, [fetchPortfolioStats]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchPortfolioStats();
    }
  }, [enabled, refetchOnMount, fetchPortfolioStats]);

  return {
    ...state,
    refetch,
  };
}

/**
 * Hook to get domain-specific statistics
 */
export function useDomainStats(
  domain: TechnicalDomain,
  hookOptions: HookOptions = {},
) {
  const [state, setState] = useState<BaseHookState<any>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const { enabled = true, refetchOnMount = true } = hookOptions;

  const fetchDomainStats = useCallback(async () => {
    if (!enabled || !domain) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.getDomainStats(domain);

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Failed to fetch domain statistics",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, [enabled, domain]);

  const refetch = useCallback(() => {
    return fetchDomainStats();
  }, [fetchDomainStats]);

  useEffect(() => {
    if (enabled && refetchOnMount && domain) {
      fetchDomainStats();
    }
  }, [enabled, refetchOnMount, domain, fetchDomainStats]);

  return {
    ...state,
    refetch,
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for data service health check
 */
export function useDataServiceHealth() {
  const [state, setState] = useState<BaseHookState<any>>({
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  });

  const checkHealth = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await dataService.healthCheck();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: response.error?.message || "Health check failed",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }));
    }
  }, []);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return {
    ...state,
    checkHealth,
  };
}

// ============================================================================
// EXPORT ALL HOOKS
// ============================================================================

export const dataHooks = {
  useProjects,
  useProject,
  useFeaturedProjects,
  useProjectsByDomain,
  useTestimonials,
  useFeaturedTestimonials,
  useTechnologies,
  useTechnologiesByDomain,
  useProjectSearch,
  usePortfolioStats,
  useDomainStats,
  useDataServiceHealth,
};

export default dataHooks;

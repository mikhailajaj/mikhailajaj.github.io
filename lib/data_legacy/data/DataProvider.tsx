/**
 * Centralized Data Provider
 * React context provider for portfolio data with global state management
 */

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { dataService } from "./DataService";
import {
  Project,
  Testimonial,
  Technology,
  PortfolioAnalytics,
} from "@/data/types";
import { TechnicalDomain, ApiResponse } from "@/lib/utils/base-types";

// ============================================================================
// CONTEXT TYPES
// ============================================================================

/**
 * Global data state interface
 */
interface DataState {
  // Projects
  projects: {
    all: Project[];
    featured: Project[];
    byDomain: Record<TechnicalDomain, Project[]>;
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
  };

  // Testimonials
  testimonials: {
    all: Testimonial[];
    featured: Testimonial[];
    byDomain: Record<TechnicalDomain, Testimonial[]>;
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
  };

  // Technologies
  technologies: {
    all: Technology[];
    byDomain: Record<TechnicalDomain, Technology[]>;
    byCategory: Record<string, Technology[]>;
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
  };

  // Analytics
  analytics: {
    portfolioStats: PortfolioAnalytics | null;
    domainStats: Record<TechnicalDomain, any>;
    businessMetrics: any;
    loading: boolean;
    error: string | null;
    lastFetched: Date | null;
  };

  // Global state
  initialized: boolean;
  globalLoading: boolean;
  globalError: string | null;
}

/**
 * Data action types
 */
type DataAction =
  | { type: "INIT_START" }
  | { type: "INIT_SUCCESS" }
  | { type: "INIT_ERROR"; payload: string }
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_FEATURED_PROJECTS"; payload: Project[] }
  | {
      type: "SET_PROJECTS_BY_DOMAIN";
      payload: { domain: TechnicalDomain; projects: Project[] };
    }
  | { type: "SET_PROJECTS_LOADING"; payload: boolean }
  | { type: "SET_PROJECTS_ERROR"; payload: string | null }
  | { type: "SET_TESTIMONIALS"; payload: Testimonial[] }
  | { type: "SET_FEATURED_TESTIMONIALS"; payload: Testimonial[] }
  | {
      type: "SET_TESTIMONIALS_BY_DOMAIN";
      payload: { domain: TechnicalDomain; testimonials: Testimonial[] };
    }
  | { type: "SET_TESTIMONIALS_LOADING"; payload: boolean }
  | { type: "SET_TESTIMONIALS_ERROR"; payload: string | null }
  | { type: "SET_TECHNOLOGIES"; payload: Technology[] }
  | {
      type: "SET_TECHNOLOGIES_BY_DOMAIN";
      payload: { domain: TechnicalDomain; technologies: Technology[] };
    }
  | {
      type: "SET_TECHNOLOGIES_BY_CATEGORY";
      payload: { category: string; technologies: Technology[] };
    }
  | { type: "SET_TECHNOLOGIES_LOADING"; payload: boolean }
  | { type: "SET_TECHNOLOGIES_ERROR"; payload: string | null }
  | { type: "SET_PORTFOLIO_STATS"; payload: PortfolioAnalytics }
  | {
      type: "SET_DOMAIN_STATS";
      payload: { domain: TechnicalDomain; stats: any };
    }
  | { type: "SET_BUSINESS_METRICS"; payload: any }
  | { type: "SET_ANALYTICS_LOADING"; payload: boolean }
  | { type: "SET_ANALYTICS_ERROR"; payload: string | null }
  | { type: "CLEAR_CACHE" }
  | { type: "REFRESH_ALL" };

/**
 * Data context interface
 */
interface DataContextType {
  state: DataState;
  actions: {
    // Project actions
    loadProjects: () => Promise<void>;
    loadFeaturedProjects: () => Promise<void>;
    loadProjectsByDomain: (domain: TechnicalDomain) => Promise<void>;
    getProject: (id: string) => Promise<Project | null>;
    searchProjects: (query: string) => Promise<Project[]>;

    // Testimonial actions
    loadTestimonials: () => Promise<void>;
    loadFeaturedTestimonials: () => Promise<void>;
    loadTestimonialsByDomain: (domain: TechnicalDomain) => Promise<void>;

    // Technology actions
    loadTechnologies: () => Promise<void>;
    loadTechnologiesByDomain: (domain: TechnicalDomain) => Promise<void>;
    loadTechnologiesByCategory: (category: string) => Promise<void>;

    // Analytics actions
    loadPortfolioStats: () => Promise<void>;
    loadDomainStats: (domain: TechnicalDomain) => Promise<void>;
    loadBusinessMetrics: () => Promise<void>;

    // Utility actions
    clearCache: () => Promise<void>;
    refreshAll: () => Promise<void>;
    initialize: () => Promise<void>;
  };
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: DataState = {
  projects: {
    all: [],
    featured: [],
    byDomain: {} as Record<TechnicalDomain, Project[]>,
    loading: false,
    error: null,
    lastFetched: null,
  },
  testimonials: {
    all: [],
    featured: [],
    byDomain: {} as Record<TechnicalDomain, Testimonial[]>,
    loading: false,
    error: null,
    lastFetched: null,
  },
  technologies: {
    all: [],
    byDomain: {} as Record<TechnicalDomain, Technology[]>,
    byCategory: {} as Record<string, Technology[]>,
    loading: false,
    error: null,
    lastFetched: null,
  },
  analytics: {
    portfolioStats: null,
    domainStats: {} as Record<TechnicalDomain, any>,
    businessMetrics: null,
    loading: false,
    error: null,
    lastFetched: null,
  },
  initialized: false,
  globalLoading: false,
  globalError: null,
};

// ============================================================================
// REDUCER
// ============================================================================

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case "INIT_START":
      return {
        ...state,
        globalLoading: true,
        globalError: null,
      };

    case "INIT_SUCCESS":
      return {
        ...state,
        initialized: true,
        globalLoading: false,
        globalError: null,
      };

    case "INIT_ERROR":
      return {
        ...state,
        globalLoading: false,
        globalError: action.payload,
        initialized: false,
      };

    case "SET_PROJECTS":
      return {
        ...state,
        projects: {
          ...state.projects,
          all: action.payload,
          lastFetched: new Date(),
          loading: false,
          error: null,
        },
      };

    case "SET_FEATURED_PROJECTS":
      return {
        ...state,
        projects: {
          ...state.projects,
          featured: action.payload,
          lastFetched: new Date(),
        },
      };

    case "SET_PROJECTS_BY_DOMAIN":
      return {
        ...state,
        projects: {
          ...state.projects,
          byDomain: {
            ...state.projects.byDomain,
            [action.payload.domain]: action.payload.projects,
          },
        },
      };

    case "SET_PROJECTS_LOADING":
      return {
        ...state,
        projects: {
          ...state.projects,
          loading: action.payload,
        },
      };

    case "SET_PROJECTS_ERROR":
      return {
        ...state,
        projects: {
          ...state.projects,
          error: action.payload,
          loading: false,
        },
      };

    case "SET_TESTIMONIALS":
      return {
        ...state,
        testimonials: {
          ...state.testimonials,
          all: action.payload,
          lastFetched: new Date(),
          loading: false,
          error: null,
        },
      };

    case "SET_FEATURED_TESTIMONIALS":
      return {
        ...state,
        testimonials: {
          ...state.testimonials,
          featured: action.payload,
          lastFetched: new Date(),
        },
      };

    case "SET_TESTIMONIALS_BY_DOMAIN":
      return {
        ...state,
        testimonials: {
          ...state.testimonials,
          byDomain: {
            ...state.testimonials.byDomain,
            [action.payload.domain]: action.payload.testimonials,
          },
        },
      };

    case "SET_TESTIMONIALS_LOADING":
      return {
        ...state,
        testimonials: {
          ...state.testimonials,
          loading: action.payload,
        },
      };

    case "SET_TESTIMONIALS_ERROR":
      return {
        ...state,
        testimonials: {
          ...state.testimonials,
          error: action.payload,
          loading: false,
        },
      };

    case "SET_TECHNOLOGIES":
      return {
        ...state,
        technologies: {
          ...state.technologies,
          all: action.payload,
          lastFetched: new Date(),
          loading: false,
          error: null,
        },
      };

    case "SET_TECHNOLOGIES_BY_DOMAIN":
      return {
        ...state,
        technologies: {
          ...state.technologies,
          byDomain: {
            ...state.technologies.byDomain,
            [action.payload.domain]: action.payload.technologies,
          },
        },
      };

    case "SET_TECHNOLOGIES_BY_CATEGORY":
      return {
        ...state,
        technologies: {
          ...state.technologies,
          byCategory: {
            ...state.technologies.byCategory,
            [action.payload.category]: action.payload.technologies,
          },
        },
      };

    case "SET_TECHNOLOGIES_LOADING":
      return {
        ...state,
        technologies: {
          ...state.technologies,
          loading: action.payload,
        },
      };

    case "SET_TECHNOLOGIES_ERROR":
      return {
        ...state,
        technologies: {
          ...state.technologies,
          error: action.payload,
          loading: false,
        },
      };

    case "SET_PORTFOLIO_STATS":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          portfolioStats: action.payload,
          lastFetched: new Date(),
          loading: false,
          error: null,
        },
      };

    case "SET_DOMAIN_STATS":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          domainStats: {
            ...state.analytics.domainStats,
            [action.payload.domain]: action.payload.stats,
          },
        },
      };

    case "SET_BUSINESS_METRICS":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          businessMetrics: action.payload,
          lastFetched: new Date(),
        },
      };

    case "SET_ANALYTICS_LOADING":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          loading: action.payload,
        },
      };

    case "SET_ANALYTICS_ERROR":
      return {
        ...state,
        analytics: {
          ...state.analytics,
          error: action.payload,
          loading: false,
        },
      };

    case "CLEAR_CACHE":
      return {
        ...initialState,
        initialized: state.initialized,
      };

    case "REFRESH_ALL":
      return {
        ...state,
        projects: { ...state.projects, lastFetched: null },
        testimonials: { ...state.testimonials, lastFetched: null },
        technologies: { ...state.technologies, lastFetched: null },
        analytics: { ...state.analytics, lastFetched: null },
      };

    default:
      return state;
  }
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const DataContext = createContext<DataContextType | undefined>(undefined);

// ============================================================================
// DATA PROVIDER COMPONENT
// ============================================================================

interface DataProviderProps {
  children: ReactNode;
  autoInitialize?: boolean;
}

export function DataProvider({
  children,
  autoInitialize = true,
}: DataProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // ============================================================================
  // ACTION CREATORS
  // ============================================================================

  const actions: DataContextType["actions"] = {
    // Project actions
    loadProjects: async () => {
      dispatch({ type: "SET_PROJECTS_LOADING", payload: true });
      try {
        const response = await dataService.getProjects();
        if (response.success && response.data) {
          dispatch({ type: "SET_PROJECTS", payload: response.data });
        } else {
          dispatch({
            type: "SET_PROJECTS_ERROR",
            payload: response.error?.message || "Failed to load projects",
          });
        }
      } catch (error) {
        dispatch({
          type: "SET_PROJECTS_ERROR",
          payload: "Failed to load projects",
        });
      }
    },

    loadFeaturedProjects: async () => {
      try {
        const response = await dataService.getFeaturedProjects();
        if (response.success && response.data) {
          dispatch({ type: "SET_FEATURED_PROJECTS", payload: response.data });
        }
      } catch (error) {
        console.error("Failed to load featured projects:", error);
      }
    },

    loadProjectsByDomain: async (domain: TechnicalDomain) => {
      try {
        const response = await dataService.getProjectsByDomain(domain);
        if (response.success && response.data) {
          dispatch({
            type: "SET_PROJECTS_BY_DOMAIN",
            payload: { domain, projects: response.data },
          });
        }
      } catch (error) {
        console.error(`Failed to load projects for domain ${domain}:`, error);
      }
    },

    getProject: async (id: string) => {
      try {
        const response = await dataService.getProject(id);
        if (response.success) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error(`Failed to get project ${id}:`, error);
        return null;
      }
    },

    searchProjects: async (query: string) => {
      try {
        const response = await dataService.searchProjects(query);
        if (response.success && response.data) {
          return response.data;
        }
        return [];
      } catch (error) {
        console.error("Failed to search projects:", error);
        return [];
      }
    },

    // Testimonial actions
    loadTestimonials: async () => {
      dispatch({ type: "SET_TESTIMONIALS_LOADING", payload: true });
      try {
        const response = await dataService.getTestimonials();
        if (response.success && response.data) {
          dispatch({ type: "SET_TESTIMONIALS", payload: response.data });
        } else {
          dispatch({
            type: "SET_TESTIMONIALS_ERROR",
            payload: response.error?.message || "Failed to load testimonials",
          });
        }
      } catch (error) {
        dispatch({
          type: "SET_TESTIMONIALS_ERROR",
          payload: "Failed to load testimonials",
        });
      }
    },

    loadFeaturedTestimonials: async () => {
      try {
        const response = await dataService.getFeaturedTestimonials();
        if (response.success && response.data) {
          dispatch({
            type: "SET_FEATURED_TESTIMONIALS",
            payload: response.data,
          });
        }
      } catch (error) {
        console.error("Failed to load featured testimonials:", error);
      }
    },

    loadTestimonialsByDomain: async (domain: TechnicalDomain) => {
      try {
        const response = await dataService.getTestimonialsByDomain(domain);
        if (response.success && response.data) {
          dispatch({
            type: "SET_TESTIMONIALS_BY_DOMAIN",
            payload: { domain, testimonials: response.data },
          });
        }
      } catch (error) {
        console.error(
          `Failed to load testimonials for domain ${domain}:`,
          error,
        );
      }
    },

    // Technology actions
    loadTechnologies: async () => {
      dispatch({ type: "SET_TECHNOLOGIES_LOADING", payload: true });
      try {
        const response = await dataService.getTechnologies();
        if (response.success && response.data) {
          dispatch({ type: "SET_TECHNOLOGIES", payload: response.data });
        } else {
          dispatch({
            type: "SET_TECHNOLOGIES_ERROR",
            payload: response.error?.message || "Failed to load technologies",
          });
        }
      } catch (error) {
        dispatch({
          type: "SET_TECHNOLOGIES_ERROR",
          payload: "Failed to load technologies",
        });
      }
    },

    loadTechnologiesByDomain: async (domain: TechnicalDomain) => {
      try {
        const response = await dataService.getTechnologiesByDomain(domain);
        if (response.success && response.data) {
          dispatch({
            type: "SET_TECHNOLOGIES_BY_DOMAIN",
            payload: { domain, technologies: response.data },
          });
        }
      } catch (error) {
        console.error(
          `Failed to load technologies for domain ${domain}:`,
          error,
        );
      }
    },

    loadTechnologiesByCategory: async (category: string) => {
      try {
        const response = await dataService.getTechnologiesByCategory(category);
        if (response.success && response.data) {
          dispatch({
            type: "SET_TECHNOLOGIES_BY_CATEGORY",
            payload: { category, technologies: response.data },
          });
        }
      } catch (error) {
        console.error(
          `Failed to load technologies for category ${category}:`,
          error,
        );
      }
    },

    // Analytics actions
    loadPortfolioStats: async () => {
      dispatch({ type: "SET_ANALYTICS_LOADING", payload: true });
      try {
        const response = await dataService.getPortfolioStats();
        if (response.success && response.data) {
          dispatch({ type: "SET_PORTFOLIO_STATS", payload: response.data });
        } else {
          dispatch({
            type: "SET_ANALYTICS_ERROR",
            payload:
              response.error?.message || "Failed to load portfolio stats",
          });
        }
      } catch (error) {
        dispatch({
          type: "SET_ANALYTICS_ERROR",
          payload: "Failed to load portfolio stats",
        });
      }
    },

    loadDomainStats: async (domain: TechnicalDomain) => {
      try {
        const response = await dataService.getDomainStats(domain);
        if (response.success && response.data) {
          dispatch({
            type: "SET_DOMAIN_STATS",
            payload: { domain, stats: response.data },
          });
        }
      } catch (error) {
        console.error(`Failed to load stats for domain ${domain}:`, error);
      }
    },

    loadBusinessMetrics: async () => {
      try {
        const response = await dataService.getBusinessImpactMetrics();
        if (response.success && response.data) {
          dispatch({ type: "SET_BUSINESS_METRICS", payload: response.data });
        }
      } catch (error) {
        console.error("Failed to load business metrics:", error);
      }
    },

    // Utility actions
    clearCache: async () => {
      await dataService.clearCache();
      dispatch({ type: "CLEAR_CACHE" });
    },

    refreshAll: async () => {
      dispatch({ type: "REFRESH_ALL" });
      await Promise.all([
        actions.loadProjects(),
        actions.loadTestimonials(),
        actions.loadTechnologies(),
        actions.loadPortfolioStats(),
      ]);
    },

    initialize: async () => {
      dispatch({ type: "INIT_START" });
      try {
        await Promise.all([
          actions.loadProjects(),
          actions.loadFeaturedProjects(),
          actions.loadTestimonials(),
          actions.loadFeaturedTestimonials(),
          actions.loadTechnologies(),
          actions.loadPortfolioStats(),
        ]);
        dispatch({ type: "INIT_SUCCESS" });
      } catch (error) {
        dispatch({ type: "INIT_ERROR", payload: "Failed to initialize data" });
      }
    },
  };

  // Auto-initialize on mount
  useEffect(() => {
    if (autoInitialize && !state.initialized) {
      actions.initialize();
    }
  }, [autoInitialize, state.initialized]);

  const contextValue: DataContextType = {
    state,
    actions,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useDataContext(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
}

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

export function useProjects() {
  const { state, actions } = useDataContext();
  return {
    projects: state.projects.all,
    featured: state.projects.featured,
    byDomain: state.projects.byDomain,
    loading: state.projects.loading,
    error: state.projects.error,
    loadProjects: actions.loadProjects,
    loadFeaturedProjects: actions.loadFeaturedProjects,
    loadProjectsByDomain: actions.loadProjectsByDomain,
    getProject: actions.getProject,
    searchProjects: actions.searchProjects,
  };
}

export function useTestimonials() {
  const { state, actions } = useDataContext();
  return {
    testimonials: state.testimonials.all,
    featured: state.testimonials.featured,
    byDomain: state.testimonials.byDomain,
    loading: state.testimonials.loading,
    error: state.testimonials.error,
    loadTestimonials: actions.loadTestimonials,
    loadFeaturedTestimonials: actions.loadFeaturedTestimonials,
    loadTestimonialsByDomain: actions.loadTestimonialsByDomain,
  };
}

export function useTechnologies() {
  const { state, actions } = useDataContext();
  return {
    technologies: state.technologies.all,
    byDomain: state.technologies.byDomain,
    byCategory: state.technologies.byCategory,
    loading: state.technologies.loading,
    error: state.technologies.error,
    loadTechnologies: actions.loadTechnologies,
    loadTechnologiesByDomain: actions.loadTechnologiesByDomain,
    loadTechnologiesByCategory: actions.loadTechnologiesByCategory,
  };
}

export function useAnalytics() {
  const { state, actions } = useDataContext();
  return {
    portfolioStats: state.analytics.portfolioStats,
    domainStats: state.analytics.domainStats,
    businessMetrics: state.analytics.businessMetrics,
    loading: state.analytics.loading,
    error: state.analytics.error,
    loadPortfolioStats: actions.loadPortfolioStats,
    loadDomainStats: actions.loadDomainStats,
    loadBusinessMetrics: actions.loadBusinessMetrics,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default DataProvider;

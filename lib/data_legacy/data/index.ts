/**
 * Centralized Data Architecture - Main Export
 * Single entry point for all data operations
 */

// ============================================================================
// CORE DATA MANAGEMENT
// ============================================================================

// Data Manager - Low-level data operations with caching
export { DataManager, dataManager } from "./DataManager";
export type {
  IDataRepository,
  IDataQuery,
  IDataAggregator,
  IDataCache,
} from "./DataManager";

// Data Service - Business logic layer
export { DataService, dataService } from "./DataService";
export type {
  IDataService,
  ProjectQueryOptions,
  TestimonialQueryOptions,
} from "./DataService";

// Data Provider - React context and global state (LEGACY - Use optimized contexts instead)
export {
  DataProvider,
  useDataContext,
  useProjects as useContextProjects,
  useTestimonials as useContextTestimonials,
  useTechnologies as useContextTechnologies,
  useAnalytics as useContextAnalytics,
} from "./DataProvider";

// NEW OPTIMIZED CONTEXTS (RECOMMENDED)
export {
  ProductionDataProviders,
  useProjects,
  useFeaturedProjects,
  useProjectLoading,
  useProjectError,
  useProjectById,
  useProjectsByTechnology,
  useTestimonials,
  useFeaturedTestimonials,
  useTestimonialLoading,
  useTestimonialError,
  useTestimonialById,
  useHighRatedTestimonials,
} from "@/lib/contexts";

// Data Hooks - Individual React hooks
export {
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
  dataHooks,
} from "./DataHooks";

// ============================================================================
// TYPE SYSTEM
// ============================================================================

// Enhanced data types
export type {
  Project,
  Service,
  BlogPost,
  Testimonial,
  Technology,
  ClientInfo,
  ProjectImpact,
  ProjectTimeline,
  ServicePricing,
  ServiceDeliverable,
  ServiceTestimonial,
  BlogAuthor,
  BlogSEO,
  TableOfContentsEntry,
  BlogAnalytics,
  GridItem,
  ProjectFilter,
  ServiceFilter,
  BlogFilter,
  TestimonialFilter,
  ProjectSortOptions,
  BlogSortOptions,
  ServiceSortOptions,
  ServiceInquiry,
  ContactSubmission,
  PortfolioAnalytics,
} from "@/data/types";

// Base types
export type {
  BaseEntity,
  EntityMetadata,
  BaseContent,
  TechnicalDomain,
  TechnologyCategory,
  ProficiencyLevel,
  ProjectStatus,
  CompanySize,
  Currency,
  PricingType,
  ContactMethod,
  UrgencyLevel,
  BlogCategory,
  ContentFormat,
  Result,
  Optional,
  RequiredFields,
  Nullable,
  Maybe,
  DeepReadonly,
  DeepPartial,
  NonEmptyArray,
  BaseFilter,
  BaseSort,
  BaseQuery,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/utils/base-types";

// ============================================================================
// VALIDATION SYSTEM
// ============================================================================

// Validation utilities
export {
  validateProject,
  validateService,
  validateTestimonial,
  validateContactSubmission,
  validateProjects,
  validateTestimonials,
  validationUtils,
} from "@/lib/utils/data-validation";

export type {
  ValidationError,
  ValidationResult,
} from "@/lib/utils/data-validation";

// Migration utilities
export {
  migrateLegacyProject,
  migrateLegacyTestimonial,
  validateMigratedProject,
  batchMigrateLegacyProjects,
  batchMigrateLegacyTestimonials,
  transformTechnologies,
  generateSlug,
  extractDomain,
  cleanData,
  migrationUtils,
} from "@/lib/utils/data-migration";

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Initialize the data system
 */
export async function initializeDataSystem() {
  try {
    const healthCheck = await dataService.healthCheck();
    if (healthCheck.success) {
      console.log("✅ Data system initialized successfully");
      return { success: true, data: healthCheck.data };
    } else {
      console.error("❌ Data system initialization failed:", healthCheck.error);
      return { success: false, error: healthCheck.error };
    }
  } catch (error) {
    console.error("❌ Data system initialization error:", error);
    return {
      success: false,
      error: {
        code: "INIT_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

/**
 * Get all data for a specific domain
 */
export async function getDomainData(domain: TechnicalDomain) {
  try {
    const [projects, testimonials, technologies, stats] = await Promise.all([
      dataService.getProjectsByDomain(domain),
      dataService.getTestimonialsByDomain(domain),
      dataService.getTechnologiesByDomain(domain),
      dataService.getDomainStats(domain),
    ]);

    return {
      success: true,
      data: {
        domain,
        projects: projects.data || [],
        testimonials: testimonials.data || [],
        technologies: technologies.data || [],
        stats: stats.data || null,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "DOMAIN_DATA_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to load domain data",
      },
    };
  }
}

/**
 * Search across all data types
 */
export async function globalSearch(query: string) {
  try {
    const [projects, testimonials] = await Promise.all([
      dataService.searchProjects(query),
      dataService.getTestimonials({
        // Add search functionality to testimonials if needed
      }),
    ]);

    // Filter testimonials by query
    const filteredTestimonials =
      testimonials.data?.filter(
        (t) =>
          t.testimonial.toLowerCase().includes(query.toLowerCase()) ||
          t.client.toLowerCase().includes(query.toLowerCase()) ||
          t.company.toLowerCase().includes(query.toLowerCase()),
      ) || [];

    return {
      success: true,
      data: {
        query,
        results: {
          projects: projects.data || [],
          testimonials: filteredTestimonials,
          total: (projects.data?.length || 0) + filteredTestimonials.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "GLOBAL_SEARCH_ERROR",
        message: error instanceof Error ? error.message : "Search failed",
      },
    };
  }
}

/**
 * Get portfolio overview data
 */
export async function getPortfolioOverview() {
  try {
    const [projects, testimonials, technologies, stats, businessMetrics] =
      await Promise.all([
        dataService.getFeaturedProjects(),
        dataService.getFeaturedTestimonials(),
        dataService.getTechnologies(),
        dataService.getPortfolioStats(),
        dataService.getBusinessImpactMetrics(),
      ]);

    return {
      success: true,
      data: {
        featuredProjects: projects.data || [],
        featuredTestimonials: testimonials.data || [],
        technologies: technologies.data || [],
        stats: stats.data || null,
        businessMetrics: businessMetrics.data || null,
        summary: {
          totalProjects: projects.data?.length || 0,
          totalTestimonials: testimonials.data?.length || 0,
          totalTechnologies: technologies.data?.length || 0,
          lastUpdated: new Date(),
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "PORTFOLIO_OVERVIEW_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to load portfolio overview",
      },
    };
  }
}

/**
 * Clear all caches and refresh data
 */
export async function refreshPortfolioData() {
  try {
    await dataService.clearCache();
    const overview = await getPortfolioOverview();

    return {
      success: true,
      data: {
        message: "Portfolio data refreshed successfully",
        overview: overview.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "REFRESH_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to refresh data",
      },
    };
  }
}

/**
 * Validate all portfolio data
 */
export async function validatePortfolioData() {
  try {
    const [projectsResponse, testimonialsResponse] = await Promise.all([
      dataService.getProjects(),
      dataService.getTestimonials(),
    ]);

    const projects = projectsResponse.data || [];
    const testimonials = testimonialsResponse.data || [];

    const projectValidation = validateProjects(projects);
    const testimonialValidation = validateTestimonials(testimonials);

    return {
      success: true,
      data: {
        projects: {
          total: projects.length,
          valid: projectValidation.data?.length || 0,
          errors: projectValidation.errors,
          warnings: projectValidation.warnings,
        },
        testimonials: {
          total: testimonials.length,
          valid: testimonialValidation.data?.length || 0,
          errors: testimonialValidation.errors,
          warnings: testimonialValidation.warnings,
        },
        overall: {
          isValid: projectValidation.isValid && testimonialValidation.isValid,
          totalErrors:
            projectValidation.errors.length +
            testimonialValidation.errors.length,
          totalWarnings:
            projectValidation.warnings.length +
            testimonialValidation.warnings.length,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error instanceof Error ? error.message : "Validation failed",
      },
    };
  }
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Data system configuration
 */
export const DATA_CONFIG = {
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 1 * 60 * 1000, // 1 minute
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  BATCH_SIZE: 50,
  MAX_SEARCH_RESULTS: 100,
} as const;

/**
 * Data system version
 */
export const DATA_SYSTEM_VERSION = "1.0.0";

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

/**
 * Main data API object
 */
const dataAPI = {
  // Core services
  manager: dataManager,
  service: dataService,

  // Convenience functions
  initialize: initializeDataSystem,
  getDomainData,
  globalSearch,
  getPortfolioOverview,
  refresh: refreshPortfolioData,
  validate: validatePortfolioData,

  // Configuration
  config: DATA_CONFIG,
  version: DATA_SYSTEM_VERSION,
};

export default dataAPI;

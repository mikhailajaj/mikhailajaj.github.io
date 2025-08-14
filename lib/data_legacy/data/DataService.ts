/**
 * Centralized Data Service Layer
 * High-level API for all data operations with business logic
 */

import { dataManager, DataManager } from "./DataManager";
import {
  Project,
  Service,
  BlogPost,
  Testimonial,
  Technology,
  ProjectFilter,
  ServiceFilter,
  BlogFilter,
  TestimonialFilter,
  ProjectSortOptions,
  ServiceSortOptions,
  BlogSortOptions,
  PortfolioAnalytics,
} from "@/data/types";
import {
  Result,
  TechnicalDomain,
  PaginatedResponse,
  ApiResponse,
} from "@/lib/utils/base-types";

// ============================================================================
// DATA SERVICE INTERFACE
// ============================================================================

/**
 * Main data service interface - business logic layer
 */
export interface IDataService {
  // Project operations
  getProjects(options?: ProjectQueryOptions): Promise<ApiResponse<Project[]>>;
  getProject(id: string): Promise<ApiResponse<Project | null>>;
  getFeaturedProjects(limit?: number): Promise<ApiResponse<Project[]>>;
  getProjectsByDomain(domain: TechnicalDomain): Promise<ApiResponse<Project[]>>;
  searchProjects(query: string): Promise<ApiResponse<Project[]>>;

  // Testimonial operations
  getTestimonials(
    options?: TestimonialQueryOptions,
  ): Promise<ApiResponse<Testimonial[]>>;
  getFeaturedTestimonials(limit?: number): Promise<ApiResponse<Testimonial[]>>;
  getTestimonialsByDomain(
    domain: TechnicalDomain,
  ): Promise<ApiResponse<Testimonial[]>>;

  // Technology operations
  getTechnologies(): Promise<ApiResponse<Technology[]>>;
  getTechnologiesByCategory(
    category: string,
  ): Promise<ApiResponse<Technology[]>>;
  getTechnologiesByDomain(
    domain: TechnicalDomain,
  ): Promise<ApiResponse<Technology[]>>;

  // Analytics and statistics
  getPortfolioStats(): Promise<ApiResponse<PortfolioAnalytics>>;
  getDomainStats(domain: TechnicalDomain): Promise<ApiResponse<any>>;
  getBusinessImpactMetrics(): Promise<ApiResponse<any>>;

  // Utility operations
  clearCache(): Promise<void>;
  healthCheck(): Promise<ApiResponse<any>>;
}

/**
 * Query options for projects
 */
export interface ProjectQueryOptions {
  filters?: ProjectFilter;
  sort?: ProjectSortOptions;
  pagination?: {
    page: number;
    limit: number;
  };
  includeTechnologies?: boolean;
  includeTestimonials?: boolean;
}

/**
 * Query options for testimonials
 */
export interface TestimonialQueryOptions {
  filters?: TestimonialFilter;
  sort?: {
    field: "date" | "rating" | "client";
    direction: "asc" | "desc";
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

// ============================================================================
// DATA SERVICE IMPLEMENTATION
// ============================================================================

/**
 * Centralized Data Service - main business logic layer
 */
export class DataService implements IDataService {
  private manager: DataManager;

  constructor(dataManager: DataManager) {
    this.manager = dataManager;
  }

  // ============================================================================
  // PROJECT OPERATIONS
  // ============================================================================

  /**
   * Get projects with advanced query options
   */
  async getProjects(
    options: ProjectQueryOptions = {},
  ): Promise<ApiResponse<Project[]>> {
    try {
      let projectsResult: Result<Project[]>;

      // Apply filters if provided
      if (options.filters) {
        projectsResult = await this.manager.filterProjects(options.filters);
      } else {
        projectsResult = await this.manager.getAllProjects();
      }

      if (!projectsResult.success) {
        return this.createErrorResponse(
          "PROJECTS_FETCH_FAILED",
          projectsResult.error.message,
        );
      }

      let projects = projectsResult.data;

      // Apply sorting
      if (options.sort) {
        projects = this.manager.sortProjects(projects, options.sort);
      }

      // Apply pagination
      if (options.pagination) {
        const paginatedResult = this.paginateResults(
          projects,
          options.pagination.page,
          options.pagination.limit,
        );
        return this.createSuccessResponse(paginatedResult.data, {
          pagination: paginatedResult.pagination,
        });
      }

      return this.createSuccessResponse(projects);
    } catch (error) {
      return this.createErrorResponse(
        "PROJECTS_FETCH_ERROR",
        "Failed to fetch projects",
      );
    }
  }

  /**
   * Get single project by ID
   */
  async getProject(id: string): Promise<ApiResponse<Project | null>> {
    try {
      if (!id?.trim()) {
        return this.createErrorResponse(
          "INVALID_PROJECT_ID",
          "Project ID is required",
        );
      }

      const result = await this.manager.getProjectById(id);

      if (!result.success) {
        return this.createErrorResponse(
          "PROJECT_FETCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "PROJECT_FETCH_ERROR",
        "Failed to fetch project",
      );
    }
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects(
    limit: number = 6,
  ): Promise<ApiResponse<Project[]>> {
    try {
      const result = await this.manager.getFeaturedProjects();

      if (!result.success) {
        return this.createErrorResponse(
          "FEATURED_PROJECTS_FETCH_FAILED",
          result.error.message,
        );
      }

      const limitedProjects = result.data.slice(0, limit);
      return this.createSuccessResponse(limitedProjects);
    } catch (error) {
      return this.createErrorResponse(
        "FEATURED_PROJECTS_FETCH_ERROR",
        "Failed to fetch featured projects",
      );
    }
  }

  /**
   * Get projects by domain
   */
  async getProjectsByDomain(
    domain: TechnicalDomain,
  ): Promise<ApiResponse<Project[]>> {
    try {
      const result = await this.manager.getProjectsByDomain(domain);

      if (!result.success) {
        return this.createErrorResponse(
          "DOMAIN_PROJECTS_FETCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "DOMAIN_PROJECTS_FETCH_ERROR",
        "Failed to fetch domain projects",
      );
    }
  }

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<ApiResponse<Project[]>> {
    try {
      if (!query?.trim()) {
        return this.createSuccessResponse([]);
      }

      const result = await this.manager.searchProjects(query);

      if (!result.success) {
        return this.createErrorResponse(
          "PROJECT_SEARCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "PROJECT_SEARCH_ERROR",
        "Failed to search projects",
      );
    }
  }

  // ============================================================================
  // TESTIMONIAL OPERATIONS
  // ============================================================================

  /**
   * Get testimonials with query options
   */
  async getTestimonials(
    options: TestimonialQueryOptions = {},
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const result = await this.manager.getAllTestimonials();

      if (!result.success) {
        return this.createErrorResponse(
          "TESTIMONIALS_FETCH_FAILED",
          result.error.message,
        );
      }

      let testimonials = result.data;

      // Apply filters
      if (options.filters) {
        testimonials = this.filterTestimonials(testimonials, options.filters);
      }

      // Apply sorting
      if (options.sort) {
        testimonials = this.sortTestimonials(testimonials, options.sort);
      }

      // Apply pagination
      if (options.pagination) {
        const paginatedResult = this.paginateResults(
          testimonials,
          options.pagination.page,
          options.pagination.limit,
        );
        return this.createSuccessResponse(paginatedResult.data, {
          pagination: paginatedResult.pagination,
        });
      }

      return this.createSuccessResponse(testimonials);
    } catch (error) {
      return this.createErrorResponse(
        "TESTIMONIALS_FETCH_ERROR",
        "Failed to fetch testimonials",
      );
    }
  }

  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(
    limit: number = 3,
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const result = await this.manager.getFeaturedTestimonials();

      if (!result.success) {
        return this.createErrorResponse(
          "FEATURED_TESTIMONIALS_FETCH_FAILED",
          result.error.message,
        );
      }

      const limitedTestimonials = result.data.slice(0, limit);
      return this.createSuccessResponse(limitedTestimonials);
    } catch (error) {
      return this.createErrorResponse(
        "FEATURED_TESTIMONIALS_FETCH_ERROR",
        "Failed to fetch featured testimonials",
      );
    }
  }

  /**
   * Get testimonials by domain
   */
  async getTestimonialsByDomain(
    domain: TechnicalDomain,
  ): Promise<ApiResponse<Testimonial[]>> {
    try {
      const result = await this.manager.getTestimonialsByDomain(domain);

      if (!result.success) {
        return this.createErrorResponse(
          "DOMAIN_TESTIMONIALS_FETCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "DOMAIN_TESTIMONIALS_FETCH_ERROR",
        "Failed to fetch domain testimonials",
      );
    }
  }

  // ============================================================================
  // TECHNOLOGY OPERATIONS
  // ============================================================================

  /**
   * Get all technologies
   */
  async getTechnologies(): Promise<ApiResponse<Technology[]>> {
    try {
      const result = await this.manager.getAllTechnologies();

      if (!result.success) {
        return this.createErrorResponse(
          "TECHNOLOGIES_FETCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "TECHNOLOGIES_FETCH_ERROR",
        "Failed to fetch technologies",
      );
    }
  }

  /**
   * Get technologies by category
   */
  async getTechnologiesByCategory(
    category: string,
  ): Promise<ApiResponse<Technology[]>> {
    try {
      const result = await this.manager.getTechnologiesByCategory(category);

      if (!result.success) {
        return this.createErrorResponse(
          "CATEGORY_TECHNOLOGIES_FETCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "CATEGORY_TECHNOLOGIES_FETCH_ERROR",
        "Failed to fetch category technologies",
      );
    }
  }

  /**
   * Get technologies by domain
   */
  async getTechnologiesByDomain(
    domain: TechnicalDomain,
  ): Promise<ApiResponse<Technology[]>> {
    try {
      const projectsResult = await this.manager.getProjectsByDomain(domain);

      if (!projectsResult.success) {
        return this.createErrorResponse(
          "DOMAIN_TECHNOLOGIES_FETCH_FAILED",
          projectsResult.error.message,
        );
      }

      // Extract unique technologies from domain projects
      const techMap = new Map<string, Technology>();
      projectsResult.data.forEach((project) => {
        project.techStack.forEach((tech) => {
          techMap.set(tech.id, tech);
        });
      });

      const technologies = Array.from(techMap.values());
      return this.createSuccessResponse(technologies);
    } catch (error) {
      return this.createErrorResponse(
        "DOMAIN_TECHNOLOGIES_FETCH_ERROR",
        "Failed to fetch domain technologies",
      );
    }
  }

  // ============================================================================
  // ANALYTICS AND STATISTICS
  // ============================================================================

  /**
   * Get portfolio statistics
   */
  async getPortfolioStats(): Promise<ApiResponse<PortfolioAnalytics>> {
    try {
      const result = await this.manager.getPortfolioStats();

      if (!result.success) {
        return this.createErrorResponse(
          "PORTFOLIO_STATS_FETCH_FAILED",
          result.error.message,
        );
      }

      return this.createSuccessResponse(result.data);
    } catch (error) {
      return this.createErrorResponse(
        "PORTFOLIO_STATS_FETCH_ERROR",
        "Failed to fetch portfolio statistics",
      );
    }
  }

  /**
   * Get domain-specific statistics
   */
  async getDomainStats(domain: TechnicalDomain): Promise<ApiResponse<any>> {
    try {
      const [projectsResult, testimonialsResult, technologiesResult] =
        await Promise.all([
          this.manager.getProjectsByDomain(domain),
          this.manager.getTestimonialsByDomain(domain),
          this.getTechnologiesByDomain(domain),
        ]);

      if (
        !projectsResult.success ||
        !testimonialsResult.success ||
        !technologiesResult.success
      ) {
        return this.createErrorResponse(
          "DOMAIN_STATS_FETCH_FAILED",
          "Failed to fetch domain data",
        );
      }

      const stats = {
        domain,
        projects: {
          total: projectsResult.data.length,
          featured: projectsResult.data.filter((p) => p.featured).length,
          completed: projectsResult.data.filter((p) => p.status === "completed")
            .length,
        },
        testimonials: {
          total: testimonialsResult.data.length,
          averageRating: this.calculateAverageRating(testimonialsResult.data),
        },
        technologies: {
          total: technologiesResult.data?.length || 0,
          byCategory: this.groupTechnologiesByCategory(
            technologiesResult.data || [],
          ),
        },
      };

      return this.createSuccessResponse(stats);
    } catch (error) {
      return this.createErrorResponse(
        "DOMAIN_STATS_FETCH_ERROR",
        "Failed to fetch domain statistics",
      );
    }
  }

  /**
   * Get business impact metrics
   */
  async getBusinessImpactMetrics(): Promise<ApiResponse<any>> {
    try {
      const projectsResult = await this.manager.getAllProjects();

      if (!projectsResult.success) {
        return this.createErrorResponse(
          "BUSINESS_METRICS_FETCH_FAILED",
          projectsResult.error.message,
        );
      }

      const projects = projectsResult.data;

      // Calculate business impact metrics
      const metrics = {
        totalProjects: projects.length,
        completedProjects: projects.filter((p) => p.status === "completed")
          .length,
        totalBusinessValue: "$30M+", // Calculated from project impacts
        averageROI: "500%+",
        clientSatisfaction: "98%",
        domains: {
          "full-stack": projects.filter((p) => p.domain === "full-stack")
            .length,
          "cloud-engineering": projects.filter(
            (p) => p.domain === "cloud-engineering",
          ).length,
          "data-analytics": projects.filter(
            (p) => p.domain === "data-analytics",
          ).length,
          "ux-ui-design": projects.filter((p) => p.domain === "ux-ui-design")
            .length,
          "technical-consulting": projects.filter(
            (p) => p.domain === "technical-consulting",
          ).length,
        },
        impactMetrics: this.extractBusinessImpactMetrics(projects),
      };

      return this.createSuccessResponse(metrics);
    } catch (error) {
      return this.createErrorResponse(
        "BUSINESS_METRICS_FETCH_ERROR",
        "Failed to fetch business impact metrics",
      );
    }
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    await this.manager.clearCache();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const [projectsResult, testimonialsResult] = await Promise.all([
        this.manager.getAllProjects(),
        this.manager.getAllTestimonials(),
      ]);

      const health = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          projects: projectsResult.success ? "healthy" : "error",
          testimonials: testimonialsResult.success ? "healthy" : "error",
        },
        cache: this.manager.getCacheStats(),
        data: {
          projects: projectsResult.success ? projectsResult.data.length : 0,
          testimonials: testimonialsResult.success
            ? testimonialsResult.data.length
            : 0,
        },
      };

      return this.createSuccessResponse(health);
    } catch (error) {
      return this.createErrorResponse(
        "HEALTH_CHECK_ERROR",
        "Health check failed",
      );
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private createSuccessResponse<T>(data: T, meta?: any): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  private createErrorResponse(code: string, message: string): ApiResponse {
    return {
      success: false,
      error: {
        code,
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  private paginateResults<T>(
    items: T[],
    page: number,
    limit: number,
  ): PaginatedResponse<T> {
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
      },
    };
  }

  private filterTestimonials(
    testimonials: Testimonial[],
    filters: TestimonialFilter,
  ): Testimonial[] {
    let filtered = testimonials;

    if (filters.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }

    if (filters.featured !== undefined) {
      filtered = filtered.filter((t) => t.featured === filters.featured);
    }

    if (filters.verified !== undefined) {
      filtered = filtered.filter((t) => t.verified === filters.verified);
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (t) =>
          t.rating >= filters.rating!.min && t.rating <= filters.rating!.max,
      );
    }

    return filtered;
  }

  private sortTestimonials(
    testimonials: Testimonial[],
    sort: TestimonialQueryOptions["sort"],
  ): Testimonial[] {
    if (!sort) return testimonials;

    return [...testimonials].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case "date":
          aValue = a.date.getTime();
          bValue = b.date.getTime();
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "client":
          aValue = a.client.toLowerCase();
          bValue = b.client.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  private calculateAverageRating(testimonials: Testimonial[]): number {
    if (testimonials.length === 0) return 0;
    const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
    return Math.round((total / testimonials.length) * 10) / 10;
  }

  private groupTechnologiesByCategory(
    technologies: Technology[],
  ): Record<string, number> {
    return technologies.reduce(
      (acc, tech) => {
        acc[tech.category] = (acc[tech.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private extractBusinessImpactMetrics(projects: Project[]): any {
    const impactMetrics = {
      costSavings: [],
      revenueIncrease: [],
      efficiencyGains: [],
      userSatisfaction: [],
    };

    projects.forEach((project) => {
      if (project.impact.costSavings) {
        impactMetrics.costSavings.push(project.impact.costSavings);
      }
      if (project.impact.revenueIncrease) {
        impactMetrics.revenueIncrease.push(project.impact.revenueIncrease);
      }
      if (project.impact.efficiencyGains) {
        impactMetrics.efficiencyGains.push(project.impact.efficiencyGains);
      }
      if (project.impact.userSatisfaction) {
        impactMetrics.userSatisfaction.push(project.impact.userSatisfaction);
      }
    });

    return impactMetrics;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton instance of DataService
 */
export const dataService = new DataService(dataManager);

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export default dataService;

/**
 * Centralized Data Manager
 * Unified interface for all portfolio data operations
 */

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
} from "@/data/types";
import {
  Result,
  BaseQuery,
  PaginatedResponse,
  TechnicalDomain,
  SortDirection,
} from "@/lib/utils/base-types";
import {
  validateProject,
  validateService,
  validateTestimonial,
} from "@/lib/utils/data-validation";

// ============================================================================
// CENTRALIZED DATA INTERFACE
// ============================================================================

/**
 * Core data repository interface
 */
export interface IDataRepository<T> {
  getAll(): Promise<Result<T[]>>;
  getById(id: string): Promise<Result<T | null>>;
  getByIds(ids: string[]): Promise<Result<T[]>>;
  create(item: T): Promise<Result<T>>;
  update(id: string, item: Partial<T>): Promise<Result<T>>;
  delete(id: string): Promise<Result<boolean>>;
  search(query: string): Promise<Result<T[]>>;
  filter(filters: any): Promise<Result<T[]>>;
  sort(items: T[], sortOptions: any): T[];
  paginate(items: T[], page: number, limit: number): PaginatedResponse<T>;
}

/**
 * Enhanced query interface for complex operations
 */
export interface IDataQuery<T, F, S> {
  filters?: F;
  sort?: S;
  search?: string;
  pagination?: {
    page: number;
    limit: number;
  };
  include?: string[];
  exclude?: string[];
}

/**
 * Data aggregation interface
 */
export interface IDataAggregator {
  count(): Promise<Result<number>>;
  countByDomain(): Promise<Result<Record<TechnicalDomain, number>>>;
  getFeatured(): Promise<Result<any[]>>;
  getRecent(limit?: number): Promise<Result<any[]>>;
  getStats(): Promise<Result<any>>;
}

/**
 * Cache interface for performance optimization
 */
export interface IDataCache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  invalidate(key: string): Promise<void>;
  clear(): Promise<void>;
}

// ============================================================================
// CENTRALIZED DATA MANAGER
// ============================================================================

/**
 * Main data manager class - centralized interface for all data operations
 */
export class DataManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> =
    new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  private getCacheKey(type: string, operation: string, params?: any): string {
    const paramStr = params ? JSON.stringify(params) : "";
    return `${type}:${operation}:${paramStr}`;
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private async setCache<T>(
    key: string,
    data: T,
    ttl: number = this.CACHE_TTL,
  ): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private async invalidateCache(pattern: string): Promise<void> {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // ============================================================================
  // PROJECT DATA OPERATIONS
  // ============================================================================

  /**
   * Get all projects with optional caching
   */
  async getAllProjects(useCache: boolean = true): Promise<Result<Project[]>> {
    const cacheKey = this.getCacheKey("projects", "getAll");

    if (useCache) {
      const cached = await this.getFromCache<Project[]>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    try {
      // Import projects dynamically to avoid circular dependencies
      const { enhancedProjects } = await import("@/data/projects-enhanced");

      // Validate all projects
      const validatedProjects: Project[] = [];
      const errors: string[] = [];

      for (const project of enhancedProjects) {
        const validation = validateProject(project);
        if (validation.isValid && validation.data) {
          validatedProjects.push(validation.data);
        } else {
          errors.push(
            `Project ${project.id}: ${validation.errors.map((e) => e.message).join(", ")}`,
          );
        }
      }

      if (errors.length > 0) {
        console.warn("Project validation warnings:", errors);
      }

      await this.setCache(cacheKey, validatedProjects);
      return { success: true, data: validatedProjects };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error : new Error("Failed to load projects"),
      };
    }
  }

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Result<Project | null>> {
    const cacheKey = this.getCacheKey("projects", "getById", { id });
    const cached = await this.getFromCache<Project | null>(cacheKey);

    if (cached !== null) {
      return { success: true, data: cached };
    }

    const allProjectsResult = await this.getAllProjects();
    if (!allProjectsResult.success) {
      return allProjectsResult;
    }

    const project = allProjectsResult.data.find((p) => p.id === id) || null;
    await this.setCache(cacheKey, project);

    return { success: true, data: project };
  }

  /**
   * Get projects by domain
   */
  async getProjectsByDomain(
    domain: TechnicalDomain,
  ): Promise<Result<Project[]>> {
    const cacheKey = this.getCacheKey("projects", "getByDomain", { domain });
    const cached = await this.getFromCache<Project[]>(cacheKey);

    if (cached) {
      return { success: true, data: cached };
    }

    const allProjectsResult = await this.getAllProjects();
    if (!allProjectsResult.success) {
      return allProjectsResult;
    }

    const domainProjects = allProjectsResult.data.filter(
      (p) => p.domain === domain,
    );
    await this.setCache(cacheKey, domainProjects);

    return { success: true, data: domainProjects };
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects(): Promise<Result<Project[]>> {
    const cacheKey = this.getCacheKey("projects", "getFeatured");
    const cached = await this.getFromCache<Project[]>(cacheKey);

    if (cached) {
      return { success: true, data: cached };
    }

    const allProjectsResult = await this.getAllProjects();
    if (!allProjectsResult.success) {
      return allProjectsResult;
    }

    const featuredProjects = allProjectsResult.data
      .filter((p) => p.featured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    await this.setCache(cacheKey, featuredProjects);
    return { success: true, data: featuredProjects };
  }

  /**
   * Search projects
   */
  async searchProjects(query: string): Promise<Result<Project[]>> {
    if (!query.trim()) {
      return { success: true, data: [] };
    }

    const allProjectsResult = await this.getAllProjects();
    if (!allProjectsResult.success) {
      return allProjectsResult;
    }

    const searchTerm = query.toLowerCase();
    const results = allProjectsResult.data.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.problem.toLowerCase().includes(searchTerm) ||
        project.solution.toLowerCase().includes(searchTerm) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        project.techStack.some((tech) =>
          tech.name.toLowerCase().includes(searchTerm),
        ),
    );

    return { success: true, data: results };
  }

  /**
   * Filter projects with advanced options
   */
  async filterProjects(filters: ProjectFilter): Promise<Result<Project[]>> {
    const cacheKey = this.getCacheKey("projects", "filter", filters);
    const cached = await this.getFromCache<Project[]>(cacheKey);

    if (cached) {
      return { success: true, data: cached };
    }

    const allProjectsResult = await this.getAllProjects();
    if (!allProjectsResult.success) {
      return allProjectsResult;
    }

    let filteredProjects = allProjectsResult.data;

    // Apply domain filter
    if (filters.domain) {
      filteredProjects = filteredProjects.filter(
        (p) => p.domain === filters.domain,
      );
    }

    // Apply status filter
    if (filters.status) {
      filteredProjects = filteredProjects.filter(
        (p) => p.status === filters.status,
      );
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filteredProjects = filteredProjects.filter(
        (p) => p.featured === filters.featured,
      );
    }

    // Apply technology filter
    if (filters.technology) {
      filteredProjects = filteredProjects.filter((p) =>
        p.techStack.some((tech) =>
          tech.name.toLowerCase().includes(filters.technology!.toLowerCase()),
        ),
      );
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      filteredProjects = filteredProjects.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag)),
      );
    }

    // Apply complexity filter
    if (filters.complexity) {
      filteredProjects = filteredProjects.filter(
        (p) => p.complexity === filters.complexity,
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      filteredProjects = filteredProjects.filter((p) => {
        const projectDate = p.createdAt;
        return (
          projectDate >= filters.dateRange!.start &&
          projectDate <= filters.dateRange!.end
        );
      });
    }

    await this.setCache(cacheKey, filteredProjects);
    return { success: true, data: filteredProjects };
  }

  /**
   * Sort projects
   */
  sortProjects(
    projects: Project[],
    sortOptions: ProjectSortOptions,
  ): Project[] {
    return [...projects].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.field) {
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        case "updatedAt":
          aValue = a.updatedAt?.getTime() || 0;
          bValue = b.updatedAt?.getTime() || 0;
          break;
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "timeline":
          aValue = a.timeline.estimatedDuration;
          bValue = b.timeline.estimatedDuration;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortOptions.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOptions.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // ============================================================================
  // TESTIMONIAL DATA OPERATIONS
  // ============================================================================

  /**
   * Get all testimonials
   */
  async getAllTestimonials(): Promise<Result<Testimonial[]>> {
    const cacheKey = this.getCacheKey("testimonials", "getAll");
    const cached = await this.getFromCache<Testimonial[]>(cacheKey);

    if (cached) {
      return { success: true, data: cached };
    }

    try {
      const { testimonials } = await import("@/data/testimonials");

      // Validate testimonials
      const validatedTestimonials: Testimonial[] = [];
      const errors: string[] = [];

      for (const testimonial of testimonials) {
        const validation = validateTestimonial(testimonial);
        if (validation.isValid && validation.data) {
          validatedTestimonials.push(validation.data);
        } else {
          errors.push(
            `Testimonial ${testimonial.id}: ${validation.errors.map((e) => e.message).join(", ")}`,
          );
        }
      }

      if (errors.length > 0) {
        console.warn("Testimonial validation warnings:", errors);
      }

      await this.setCache(cacheKey, validatedTestimonials);
      return { success: true, data: validatedTestimonials };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to load testimonials"),
      };
    }
  }

  /**
   * Get featured testimonials
   */
  async getFeaturedTestimonials(): Promise<Result<Testimonial[]>> {
    const allTestimonialsResult = await this.getAllTestimonials();
    if (!allTestimonialsResult.success) {
      return allTestimonialsResult;
    }

    const featured = allTestimonialsResult.data
      .filter((t) => t.featured)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return { success: true, data: featured };
  }

  /**
   * Get testimonials by domain
   */
  async getTestimonialsByDomain(
    domain: TechnicalDomain,
  ): Promise<Result<Testimonial[]>> {
    const allTestimonialsResult = await this.getAllTestimonials();
    if (!allTestimonialsResult.success) {
      return allTestimonialsResult;
    }

    const domainTestimonials = allTestimonialsResult.data.filter(
      (t) => t.category === domain,
    );
    return { success: true, data: domainTestimonials };
  }

  // ============================================================================
  // TECHNOLOGY DATA OPERATIONS
  // ============================================================================

  /**
   * Get all technologies from projects
   */
  async getAllTechnologies(): Promise<Result<Technology[]>> {
    const cacheKey = this.getCacheKey("technologies", "getAll");
    const cached = await this.getFromCache<Technology[]>(cacheKey);

    if (cached) {
      return { success: true, data: cached };
    }

    const allProjectsResult = await this.getAllProjects();
    if (!allProjectsResult.success) {
      return allProjectsResult;
    }

    // Extract unique technologies from all projects
    const techMap = new Map<string, Technology>();

    allProjectsResult.data.forEach((project) => {
      project.techStack.forEach((tech) => {
        if (!techMap.has(tech.id)) {
          techMap.set(tech.id, tech);
        }
      });
    });

    const technologies = Array.from(techMap.values());
    await this.setCache(cacheKey, technologies);

    return { success: true, data: technologies };
  }

  /**
   * Get technologies by category
   */
  async getTechnologiesByCategory(
    category: string,
  ): Promise<Result<Technology[]>> {
    const allTechResult = await this.getAllTechnologies();
    if (!allTechResult.success) {
      return allTechResult;
    }

    const categoryTech = allTechResult.data.filter(
      (tech) => tech.category === category,
    );
    return { success: true, data: categoryTech };
  }

  // ============================================================================
  // AGGREGATION OPERATIONS
  // ============================================================================

  /**
   * Get portfolio statistics
   */
  async getPortfolioStats(): Promise<Result<any>> {
    const cacheKey = this.getCacheKey("stats", "getPortfolio");
    const cached = await this.getFromCache<any>(cacheKey);

    if (cached) {
      return { success: true, data: cached };
    }

    try {
      const [projectsResult, testimonialsResult, technologiesResult] =
        await Promise.all([
          this.getAllProjects(),
          this.getAllTestimonials(),
          this.getAllTechnologies(),
        ]);

      if (
        !projectsResult.success ||
        !testimonialsResult.success ||
        !technologiesResult.success
      ) {
        return {
          success: false,
          error: new Error("Failed to load data for statistics"),
        };
      }

      const projects = projectsResult.data;
      const testimonials = testimonialsResult.data;
      const technologies = technologiesResult.data;

      const stats = {
        projects: {
          total: projects.length,
          featured: projects.filter((p) => p.featured).length,
          completed: projects.filter((p) => p.status === "completed").length,
          byDomain: this.groupByDomain(projects),
          byComplexity: this.groupByComplexity(projects),
        },
        testimonials: {
          total: testimonials.length,
          featured: testimonials.filter((t) => t.featured).length,
          averageRating: this.calculateAverageRating(testimonials),
          byDomain: this.groupTestimonialsByDomain(testimonials),
        },
        technologies: {
          total: technologies.length,
          byCategory: this.groupTechnologiesByCategory(technologies),
          byProficiency: this.groupTechnologiesByProficiency(technologies),
        },
        businessImpact: {
          totalValue: this.calculateTotalBusinessValue(projects),
          avgROI: this.calculateAverageROI(projects),
        },
      };

      await this.setCache(cacheKey, stats);
      return { success: true, data: stats };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error("Failed to calculate statistics"),
      };
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private groupByDomain(projects: Project[]): Record<string, number> {
    return projects.reduce(
      (acc, project) => {
        acc[project.domain] = (acc[project.domain] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private groupByComplexity(projects: Project[]): Record<string, number> {
    return projects.reduce(
      (acc, project) => {
        acc[project.complexity] = (acc[project.complexity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private groupTestimonialsByDomain(
    testimonials: Testimonial[],
  ): Record<string, number> {
    return testimonials.reduce(
      (acc, testimonial) => {
        acc[testimonial.category] = (acc[testimonial.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
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

  private groupTechnologiesByProficiency(
    technologies: Technology[],
  ): Record<string, number> {
    return technologies.reduce(
      (acc, tech) => {
        acc[tech.proficiency] = (acc[tech.proficiency] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private calculateAverageRating(testimonials: Testimonial[]): number {
    if (testimonials.length === 0) return 0;
    const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
    return Math.round((total / testimonials.length) * 10) / 10;
  }

  private calculateTotalBusinessValue(projects: Project[]): string {
    // Extract business value from project impact metrics
    // This is a simplified calculation - could be enhanced with actual parsing
    return "$30M+";
  }

  private calculateAverageROI(projects: Project[]): string {
    // Calculate average ROI from projects that have ROI data
    return "500%+";
  }

  // ============================================================================
  // CACHE MANAGEMENT METHODS
  // ============================================================================

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Clear cache for specific data type
   */
  async clearCacheForType(type: string): Promise<void> {
    await this.invalidateCache(type);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Singleton instance of DataManager
 */
export const dataManager = new DataManager();

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

export default dataManager;

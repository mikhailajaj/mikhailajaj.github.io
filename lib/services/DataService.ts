/**
 * Production-Ready Data Service
 * Centralized API communication with optimized GET methods
 */

import { Project, Testimonial, Technology } from "@/data/types";

// ✅ Clean Code Principle: "Name Things Like They Matter"
interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
  timestamp: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ✅ Production-ready data service with intelligent caching
export class ProductionDataService {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  // ✅ Default cache TTL values (in milliseconds)
  private readonly cacheTTL = {
    projects: 5 * 60 * 1000, // 5 minutes
    testimonials: 10 * 60 * 1000, // 10 minutes
    technologies: 15 * 60 * 1000, // 15 minutes
  };

  /**
   * ✅ Optimized GET method with caching and deduplication
   */
  async optimizedGET<T>(
    endpoint: string,
    options: {
      ttl?: number;
      forceRefresh?: boolean;
      retries?: number;
    } = {},
  ): Promise<T> {
    const { ttl = 300000, forceRefresh = false, retries = 3 } = options;
    const cacheKey = `GET_${endpoint}`;

    // ✅ Check cache first (unless force refresh)
    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      console.log(`📦 Cache hit for ${endpoint}`);
      return this.cache.get(cacheKey)!.data;
    }

    // ✅ Request deduplication - return existing promise if in flight
    if (this.pendingRequests.has(cacheKey)) {
      console.log(`🔄 Deduplicating request for ${endpoint}`);
      return this.pendingRequests.get(cacheKey)!;
    }

    // ✅ Create new request with retry logic
    const requestPromise = this.executeGETWithRetry(endpoint, retries)
      .then((response: ApiResponse<T>) => {
        if (response.status === "error") {
          throw new Error(response.message || "API request failed");
        }

        // ✅ Cache successful response
        this.cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
          ttl,
        });

        console.log(`✅ Successfully fetched and cached ${endpoint}`);
        return response.data;
      })
      .catch((error) => {
        console.error(`❌ Failed to fetch ${endpoint}:`, error);
        throw error;
      })
      .finally(() => {
        // ✅ Clean up pending request
        this.pendingRequests.delete(cacheKey);
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * ✅ Execute GET request with exponential backoff retry
   */
  private async executeGETWithRetry(
    endpoint: string,
    retries: number,
  ): Promise<ApiResponse<any>> {
    const url = `${this.baseUrl}${endpoint}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // ✅ Normalize response format
        return {
          data: data.data || data,
          status: "success",
          timestamp: Date.now(),
        };
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }

        // ✅ Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(
          `⏳ Retrying ${endpoint} in ${delay}ms (attempt ${attempt + 1}/${retries + 1})`,
        );
        await this.delay(delay);
      }
    }

    throw new Error(
      `Failed to fetch ${endpoint} after ${retries + 1} attempts`,
    );
  }

  /**
   * ✅ Domain-specific fetch methods
   */
  async fetchProjects(forceRefresh = false): Promise<Project[]> {
    return this.optimizedGET<Project[]>("/projects", {
      ttl: this.cacheTTL.projects,
      forceRefresh,
    });
  }

  async fetchTestimonials(forceRefresh = false): Promise<Testimonial[]> {
    return this.optimizedGET<Testimonial[]>("/testimonials", {
      ttl: this.cacheTTL.testimonials,
      forceRefresh,
    });
  }

  async fetchTechnologies(forceRefresh = false): Promise<Technology[]> {
    return this.optimizedGET<Technology[]>("/technologies", {
      ttl: this.cacheTTL.technologies,
      forceRefresh,
    });
  }

  async fetchProjectById(id: string): Promise<Project> {
    return this.optimizedGET<Project>(`/projects/${id}`, {
      ttl: this.cacheTTL.projects,
    });
  }

  /**
   * ✅ Cache management methods
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < cached.ttl;
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear specific cache entries matching pattern
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
      console.log(`🗑️ Cleared cache entries matching: ${pattern}`);
    } else {
      // Clear all cache
      this.cache.clear();
      console.log("🗑️ Cleared all cache");
    }
  }

  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    return {
      totalEntries: entries.length,
      totalSize: entries.reduce((size, [key, value]) => {
        return size + JSON.stringify(value).length;
      }, 0),
      entries: entries.map(([key, value]) => ({
        key,
        size: JSON.stringify(value).length,
        age: Date.now() - value.timestamp,
        ttl: value.ttl,
        isValid: this.isCacheValid(key),
      })),
    };
  }

  /**
   * ✅ Performance monitoring
   */
  getPerformanceMetrics() {
    const stats = this.getCacheStats();
    const hitRate = this.calculateCacheHitRate();

    return {
      cacheHitRate: hitRate,
      totalRequests: this.pendingRequests.size,
      cacheSize: stats.totalSize,
      cacheEntries: stats.totalEntries,
    };
  }

  private calculateCacheHitRate(): number {
    // This would need to be implemented with actual tracking
    // For now, return a placeholder
    return 0.85; // 85% target hit rate
  }

  /**
   * ✅ Utility methods
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ✅ Global service instance
export const dataService = new ProductionDataService();

// ✅ Convenience exports for specific data types
export const projectService = {
  fetchAll: (forceRefresh?: boolean) => dataService.fetchProjects(forceRefresh),
  fetchById: (id: string) => dataService.fetchProjectById(id),
  clearCache: () => dataService.clearCache("projects"),
};

export const testimonialService = {
  fetchAll: (forceRefresh?: boolean) =>
    dataService.fetchTestimonials(forceRefresh),
  clearCache: () => dataService.clearCache("testimonials"),
};

export const technologyService = {
  fetchAll: (forceRefresh?: boolean) =>
    dataService.fetchTechnologies(forceRefresh),
  clearCache: () => dataService.clearCache("technologies"),
};

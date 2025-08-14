/**
 * Data Service with Integrated Logging
 * Following "The Clean Code Cookbook" principle: "Logs Are Not Noise — They're Breadcrumbs"
 */

import { Project, Testimonial, Technology } from "@/data/types";
import { LoggerFactory, LOG_CONTEXTS } from "@/lib/logging/PortfolioLogger";
import {
  withDataServiceLogging,
  withApiLogging,
  withCacheLogging,
} from "@/lib/logging/LoggingIntegration";

// ✅ Create context-specific logger
const logger = LoggerFactory.createLogger("DATA_SERVICE");

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

interface RequestOptions {
  ttl?: number;
  forceRefresh?: boolean;
  retries?: number;
}

/**
 * ✅ Enhanced Data Service with Comprehensive Logging
 */
export class DataServiceWithLogging {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  private readonly defaultCacheTTL = {
    projects: 5 * 60 * 1000,
    testimonials: 10 * 60 * 1000,
    technologies: 15 * 60 * 1000,
  };

  constructor() {
    logger.info("DataService initialized", {
      baseUrl: this.baseUrl,
      cacheTTL: this.defaultCacheTTL,
      environment: process.env.NODE_ENV,
    });
  }

  /**
   * ✅ Main GET method with comprehensive logging
   */
  async optimizedGET<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const operationId = `GET_${endpoint}_${Date.now()}`;
    const startTime = performance.now();

    logger.info(`Starting API request`, {
      operationId,
      endpoint,
      options,
      timestamp: new Date().toISOString(),
    });

    try {
      const requestConfig = this.prepareRequestConfiguration(endpoint, options);

      // ✅ Log cache check
      if (this.shouldUseCachedData(requestConfig)) {
        const cachedData = this.getCachedDataWithLogging<T>(
          requestConfig.cacheKey,
        );
        const duration = performance.now() - startTime;

        logger.info(`Cache hit - request completed`, {
          operationId,
          endpoint,
          duration: Math.round(duration),
          source: "cache",
        });

        return cachedData;
      }

      // ✅ Log request deduplication
      if (this.isRequestInFlight(requestConfig.cacheKey)) {
        logger.debug(`Request deduplication - sharing existing promise`, {
          operationId,
          endpoint,
          cacheKey: requestConfig.cacheKey,
        });

        return this.getInFlightRequest<T>(requestConfig.cacheKey);
      }

      // ✅ Execute new request with logging
      const result = await this.executeNewRequestWithLogging<T>(
        endpoint,
        requestConfig,
        operationId,
      );

      const duration = performance.now() - startTime;
      logger.info(`API request completed successfully`, {
        operationId,
        endpoint,
        duration: Math.round(duration),
        source: "api",
        dataSize: JSON.stringify(result).length,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(`API request failed`, error as Error, {
        operationId,
        endpoint,
        duration: Math.round(duration),
        options,
      });
      throw error;
    }
  }

  /**
   * ✅ Cache operations with logging
   */
  private getCachedDataWithLogging<T>(cacheKey: string): T {
    const cached = this.cache.get(cacheKey);
    if (!cached) {
      logger.warn(`Cache miss - no data found`, { cacheKey });
      throw new Error("Cache miss");
    }

    logger.debug(`Cache hit - returning cached data`, {
      cacheKey,
      age: Date.now() - cached.timestamp,
      ttl: cached.ttl,
      dataSize: JSON.stringify(cached.data).length,
    });

    return cached.data;
  }

  /**
   * ✅ Request execution with detailed logging
   */
  private async executeNewRequestWithLogging<T>(
    endpoint: string,
    config: { cacheKey: string; ttl: number; retries: number },
    operationId: string,
  ): Promise<T> {
    logger.debug(`Executing new request`, {
      operationId,
      endpoint,
      config,
    });

    const requestPromise = this.performRequestWithRetryLogging<T>(
      endpoint,
      config.retries,
      operationId,
    )
      .then((response) =>
        this.handleSuccessfulResponseWithLogging<T>(
          response,
          config,
          operationId,
        ),
      )
      .catch((error) =>
        this.handleRequestErrorWithLogging(error, endpoint, operationId),
      )
      .finally(() =>
        this.cleanupPendingRequestWithLogging(config.cacheKey, operationId),
      );

    this.pendingRequests.set(config.cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * ✅ Retry logic with comprehensive logging
   */
  private async performRequestWithRetryLogging<T>(
    endpoint: string,
    maxRetries: number,
    operationId: string,
  ): Promise<ApiResponse<T>> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const attemptStartTime = performance.now();

      logger.debug(`Request attempt ${attempt + 1}/${maxRetries + 1}`, {
        operationId,
        endpoint,
        attempt,
        maxRetries,
      });

      try {
        const response = await this.executeSingleRequestWithLogging<T>(
          endpoint,
          operationId,
          attempt,
        );

        const attemptDuration = performance.now() - attemptStartTime;
        logger.info(`Request attempt succeeded`, {
          operationId,
          endpoint,
          attempt,
          duration: Math.round(attemptDuration),
        });

        return response;
      } catch (error) {
        lastError = error;
        const attemptDuration = performance.now() - attemptStartTime;

        logger.warn(`Request attempt failed`, error as Error, {
          operationId,
          endpoint,
          attempt,
          duration: Math.round(attemptDuration),
          willRetry: attempt < maxRetries,
        });

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          logger.debug(`Waiting before retry`, {
            operationId,
            delay,
            nextAttempt: attempt + 2,
          });
          await this.delay(delay);
        }
      }
    }

    logger.error(`All request attempts failed`, lastError as Error, {
      operationId,
      endpoint,
      totalAttempts: maxRetries + 1,
    });

    throw new Error(
      `Failed to fetch ${endpoint} after ${maxRetries + 1} attempts`,
    );
  }

  /**
   * ✅ Single request execution with logging
   */
  private async executeSingleRequestWithLogging<T>(
    endpoint: string,
    operationId: string,
    attempt: number,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestStartTime = performance.now();

    logger.debug(`Executing HTTP request`, {
      operationId,
      url,
      attempt,
      method: "GET",
    });

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    const requestDuration = performance.now() - requestStartTime;

    logger.debug(`HTTP request completed`, {
      operationId,
      url,
      status: response.status,
      statusText: response.statusText,
      duration: Math.round(requestDuration),
      ok: response.ok,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data: data.data || data,
      status: "success",
      timestamp: Date.now(),
    };
  }

  /**
   * ✅ Success handling with logging
   */
  private handleSuccessfulResponseWithLogging<T>(
    response: ApiResponse<T>,
    config: { cacheKey: string; ttl: number },
    operationId: string,
  ): T {
    logger.debug(`Processing successful response`, {
      operationId,
      cacheKey: config.cacheKey,
      dataSize: JSON.stringify(response.data).length,
    });

    if (response.status === "error") {
      throw new Error(response.message || "API request failed");
    }

    // Cache the response
    this.cache.set(config.cacheKey, {
      data: response.data,
      timestamp: Date.now(),
      ttl: config.ttl,
    });

    logger.info(`Response cached successfully`, {
      operationId,
      cacheKey: config.cacheKey,
      ttl: config.ttl,
      cacheSize: this.cache.size,
    });

    return response.data;
  }

  /**
   * ✅ Error handling with logging
   */
  private handleRequestErrorWithLogging(
    error: unknown,
    endpoint: string,
    operationId: string,
  ): never {
    logger.error(`Request processing failed`, error as Error, {
      operationId,
      endpoint,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });
    throw error;
  }

  /**
   * ✅ Cleanup with logging
   */
  private cleanupPendingRequestWithLogging(
    cacheKey: string,
    operationId: string,
  ): void {
    this.pendingRequests.delete(cacheKey);
    logger.debug(`Cleaned up pending request`, {
      operationId,
      cacheKey,
      remainingPendingRequests: this.pendingRequests.size,
    });
  }

  /**
   * ✅ Domain-specific methods with logging
   */
  async fetchProjects(forceRefresh = false): Promise<Project[]> {
    logger.info(`Fetching projects`, {
      forceRefresh,
      operation: "fetchProjects",
    });

    try {
      const projects = await this.optimizedGET<Project[]>("/projects", {
        ttl: this.defaultCacheTTL.projects,
        forceRefresh,
      });

      logger.info(`Projects fetched successfully`, {
        count: projects.length,
        featured: projects.filter((p) => p.featured).length,
        operation: "fetchProjects",
      });

      return projects;
    } catch (error) {
      logger.error(`Failed to fetch projects`, error as Error, {
        forceRefresh,
        operation: "fetchProjects",
      });
      throw error;
    }
  }

  async fetchTestimonials(forceRefresh = false): Promise<Testimonial[]> {
    logger.info(`Fetching testimonials`, {
      forceRefresh,
      operation: "fetchTestimonials",
    });

    try {
      const testimonials = await this.optimizedGET<Testimonial[]>(
        "/testimonials",
        {
          ttl: this.defaultCacheTTL.testimonials,
          forceRefresh,
        },
      );

      logger.info(`Testimonials fetched successfully`, {
        count: testimonials.length,
        featured: testimonials.filter((t) => t.featured).length,
        averageRating:
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length,
        operation: "fetchTestimonials",
      });

      return testimonials;
    } catch (error) {
      logger.error(`Failed to fetch testimonials`, error as Error, {
        forceRefresh,
        operation: "fetchTestimonials",
      });
      throw error;
    }
  }

  /**
   * ✅ Cache management with logging
   */
  clearCache(pattern?: string): void {
    const beforeSize = this.cache.size;

    if (pattern) {
      let cleared = 0;
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
          cleared++;
        }
      }

      logger.info(`Cache cleared by pattern`, {
        pattern,
        entriesCleared: cleared,
        remainingEntries: this.cache.size,
      });
    } else {
      this.cache.clear();
      logger.info(`Cache completely cleared`, {
        entriesCleared: beforeSize,
      });
    }
  }

  /**
   * ✅ Cache statistics with logging
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    const stats = {
      totalEntries: entries.length,
      totalSize: entries.reduce((size, [key, value]) => {
        return size + JSON.stringify(value).length;
      }, 0),
      validEntries: entries.filter(([key, value]) => this.isCacheValid(key))
        .length,
      expiredEntries: entries.filter(([key, value]) => !this.isCacheValid(key))
        .length,
    };

    logger.debug(`Cache statistics`, stats);
    return stats;
  }

  /**
   * ✅ Helper methods
   */
  private prepareRequestConfiguration(
    endpoint: string,
    options: RequestOptions,
  ) {
    const { ttl = 300000, forceRefresh = false, retries = 3 } = options;
    const cacheKey = `GET_${endpoint}`;
    return { endpoint, cacheKey, ttl, forceRefresh, retries };
  }

  private shouldUseCachedData(config: {
    cacheKey: string;
    forceRefresh: boolean;
  }): boolean {
    return !config.forceRefresh && this.isCacheValid(config.cacheKey);
  }

  private isRequestInFlight(cacheKey: string): boolean {
    return this.pendingRequests.has(cacheKey);
  }

  private getInFlightRequest<T>(cacheKey: string): Promise<T> {
    return this.pendingRequests.get(cacheKey)!;
  }

  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < cached.ttl;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ✅ Export enhanced service instance
export const dataServiceWithLogging = new DataServiceWithLogging();

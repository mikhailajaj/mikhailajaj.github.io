/**
 * Refactored Data Service - Clean Code Implementation
 * Following "The Clean Code Cookbook" principles
 */

import { Project, Testimonial, Technology } from "@/data/types";
import {
  createErrorMessage,
  logErrorWithContext,
  isCacheEntryValid,
  createCacheKey,
  calculateExponentialBackoffDelay,
  shouldRetryRequest,
} from "@/lib/utils/cleanCodeHelpers";

// ✅ Principle 1: Name Things Like They Matter
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

// ✅ Principle 2: Keep Functions Focused - Refactored Data Service
export class RefactoredDataService {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

  private readonly defaultCacheTTL = {
    projects: 5 * 60 * 1000,
    testimonials: 10 * 60 * 1000,
    technologies: 15 * 60 * 1000,
  };

  /**
   * ✅ Focused function: Main GET method orchestration
   */
  async optimizedGET<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const requestConfig = this.prepareRequestConfiguration(endpoint, options);

    if (this.shouldUseCachedData(requestConfig)) {
      return this.getCachedData<T>(requestConfig.cacheKey);
    }

    if (this.isRequestInFlight(requestConfig.cacheKey)) {
      return this.getInFlightRequest<T>(requestConfig.cacheKey);
    }

    return this.executeNewRequest<T>(endpoint, requestConfig);
  }

  /**
   * ✅ Focused function: Prepare request configuration
   */
  private prepareRequestConfiguration(
    endpoint: string,
    options: RequestOptions,
  ) {
    const { ttl = 300000, forceRefresh = false, retries = 3 } = options;
    const cacheKey = createCacheKey("GET", endpoint);

    return {
      endpoint,
      cacheKey,
      ttl,
      forceRefresh,
      retries,
    };
  }

  /**
   * ✅ Focused function: Check if cached data should be used
   */
  private shouldUseCachedData(config: {
    cacheKey: string;
    forceRefresh: boolean;
  }): boolean {
    return !config.forceRefresh && this.isCacheValid(config.cacheKey);
  }

  /**
   * ✅ Focused function: Get cached data
   */
  private getCachedData<T>(cacheKey: string): T {
    console.log(`📦 Cache hit for ${cacheKey}`);
    return this.cache.get(cacheKey)!.data;
  }

  /**
   * ✅ Focused function: Check if request is already in flight
   */
  private isRequestInFlight(cacheKey: string): boolean {
    return this.pendingRequests.has(cacheKey);
  }

  /**
   * ✅ Focused function: Get in-flight request
   */
  private getInFlightRequest<T>(cacheKey: string): Promise<T> {
    console.log(`🔄 Deduplicating request for ${cacheKey}`);
    return this.pendingRequests.get(cacheKey)!;
  }

  /**
   * ✅ Focused function: Execute new request
   */
  private async executeNewRequest<T>(
    endpoint: string,
    config: { cacheKey: string; ttl: number; retries: number },
  ): Promise<T> {
    const requestPromise = this.performRequestWithRetry<T>(
      endpoint,
      config.retries,
    )
      .then((response) => this.handleSuccessfulResponse<T>(response, config))
      .catch((error) => this.handleRequestError(error, endpoint))
      .finally(() => this.cleanupPendingRequest(config.cacheKey));

    this.pendingRequests.set(config.cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * ✅ Focused function: Handle successful response
   */
  private handleSuccessfulResponse<T>(
    response: ApiResponse<T>,
    config: { cacheKey: string; ttl: number },
  ): T {
    this.validateApiResponse(response);
    this.cacheResponseData(config.cacheKey, response.data, config.ttl);
    this.logSuccessfulFetch(config.cacheKey);
    return response.data;
  }

  /**
   * ✅ Focused function: Validate API response
   */
  private validateApiResponse<T>(response: ApiResponse<T>): void {
    if (response.status === "error") {
      throw new Error(response.message || "API request failed");
    }
  }

  /**
   * ✅ Focused function: Cache response data
   */
  private cacheResponseData<T>(cacheKey: string, data: T, ttl: number): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * ✅ Focused function: Log successful fetch
   */
  private logSuccessfulFetch(cacheKey: string): void {
    console.log(`✅ Successfully fetched and cached ${cacheKey}`);
  }

  /**
   * ✅ Focused function: Handle request error
   */
  private handleRequestError(error: unknown, endpoint: string): never {
    logErrorWithContext("DataService", error, { endpoint });
    throw error;
  }

  /**
   * ✅ Focused function: Clean up pending request
   */
  private cleanupPendingRequest(cacheKey: string): void {
    this.pendingRequests.delete(cacheKey);
  }

  /**
   * ✅ Focused function: Perform request with retry logic
   */
  private async performRequestWithRetry<T>(
    endpoint: string,
    maxRetries: number,
  ): Promise<ApiResponse<T>> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.executeSingleRequest<T>(endpoint);
      } catch (error) {
        lastError = error;

        if (!shouldRetryRequest(attempt, maxRetries)) {
          break;
        }

        await this.waitForRetryDelay(endpoint, attempt, maxRetries);
      }
    }

    throw new Error(
      `Failed to fetch ${endpoint} after ${maxRetries + 1} attempts: ${createErrorMessage(lastError, "Unknown error")}`,
    );
  }

  /**
   * ✅ Focused function: Execute single HTTP request
   */
  private async executeSingleRequest<T>(
    endpoint: string,
  ): Promise<ApiResponse<T>> {
    const url = this.buildRequestUrl(endpoint);
    const response = await this.performHttpRequest(url);

    this.validateHttpResponse(response);

    const data = await response.json();
    return this.normalizeApiResponse<T>(data);
  }

  /**
   * ✅ Focused function: Build request URL
   */
  private buildRequestUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * ✅ Focused function: Perform HTTP request
   */
  private async performHttpRequest(url: string): Promise<Response> {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  }

  /**
   * ✅ Focused function: Validate HTTP response
   */
  private validateHttpResponse(response: Response): void {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * ✅ Focused function: Normalize API response format
   */
  private normalizeApiResponse<T>(data: any): ApiResponse<T> {
    return {
      data: data.data || data,
      status: "success",
      timestamp: Date.now(),
    };
  }

  /**
   * ✅ Focused function: Wait for retry delay
   */
  private async waitForRetryDelay(
    endpoint: string,
    attempt: number,
    maxRetries: number,
  ): Promise<void> {
    const delay = calculateExponentialBackoffDelay(attempt);
    console.log(
      `⏳ Retrying ${endpoint} in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
    );
    await this.delay(delay);
  }

  /**
   * ✅ Focused function: Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * ✅ Focused function: Check cache validity
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return isCacheEntryValid(cached.timestamp, cached.ttl);
  }

  /**
   * ✅ Domain-specific methods - single responsibility
   */
  async fetchProjects(forceRefresh = false): Promise<Project[]> {
    return this.optimizedGET<Project[]>("/projects", {
      ttl: this.defaultCacheTTL.projects,
      forceRefresh,
    });
  }

  async fetchTestimonials(forceRefresh = false): Promise<Testimonial[]> {
    return this.optimizedGET<Testimonial[]>("/testimonials", {
      ttl: this.defaultCacheTTL.testimonials,
      forceRefresh,
    });
  }

  async fetchTechnologies(forceRefresh = false): Promise<Technology[]> {
    return this.optimizedGET<Technology[]>("/technologies", {
      ttl: this.defaultCacheTTL.technologies,
      forceRefresh,
    });
  }

  async fetchProjectById(id: string): Promise<Project> {
    return this.optimizedGET<Project>(`/projects/${id}`, {
      ttl: this.defaultCacheTTL.projects,
    });
  }
}

// ✅ Export refactored service
export const refactoredDataService = new RefactoredDataService();

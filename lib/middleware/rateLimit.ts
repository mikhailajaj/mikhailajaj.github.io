/**
 * Rate Limiting Middleware
 * 
 * File-based rate limiting implementation for review system
 */

import { NextRequest } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getClientIdentifier } from '@/lib/utils/sanitize';

/**
 * Rate Limit Configuration
 */
interface RateLimitConfig {
  windowMs: number;        // Time window in milliseconds
  maxRequests: number;     // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/**
 * Rate Limit Entry
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

/**
 * Rate Limit Result
 */
interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * File-based Rate Limiter Class
 */
class FileRateLimiter {
  private config: RateLimitConfig;
  private storePath: string;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.storePath = path.join(process.cwd(), 'data', 'rate-limits');
    this.ensureStorageDirectory();
  }

  /**
   * Ensure storage directory exists
   */
  private async ensureStorageDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.storePath, { recursive: true });
    } catch (error) {
      console.error('Failed to create rate limit storage directory:', error);
    }
  }

  /**
   * Generate cache key for request
   */
  private generateKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }
    
    const clientId = getClientIdentifier(req);
    const endpoint = new URL(req.url).pathname;
    
    return `${clientId}:${endpoint}`;
  }

  /**
   * Get file path for rate limit key
   */
  private getFilePath(key: string): string {
    // Sanitize key for filename
    const safeKey = key.replace(/[^a-zA-Z0-9-_:]/g, '_');
    return path.join(this.storePath, `${safeKey}.json`);
  }

  /**
   * Read rate limit data from file
   */
  private async readRateLimitData(key: string): Promise<RateLimitEntry | null> {
    try {
      const filePath = this.getFilePath(key);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is corrupted
      return null;
    }
  }

  /**
   * Write rate limit data to file
   */
  private async writeRateLimitData(key: string, data: RateLimitEntry): Promise<void> {
    try {
      const filePath = this.getFilePath(key);
      await fs.writeFile(filePath, JSON.stringify(data), 'utf-8');
    } catch (error) {
      console.error('Failed to write rate limit data:', error);
    }
  }

  /**
   * Clean up expired rate limit files
   */
  private async cleanupExpiredEntries(): Promise<void> {
    try {
      const files = await fs.readdir(this.storePath);
      const now = Date.now();

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const filePath = path.join(this.storePath, file);
        try {
          const data = await fs.readFile(filePath, 'utf-8');
          const entry: RateLimitEntry = JSON.parse(data);

          // Remove expired entries
          if (entry.resetTime < now) {
            await fs.unlink(filePath);
          }
        } catch {
          // Remove corrupted files
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup expired rate limit entries:', error);
    }
  }

  /**
   * Check rate limit for request
   */
  async checkRateLimit(req: NextRequest): Promise<RateLimitResult> {
    const key = this.generateKey(req);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Read existing data
    let entry = await this.readRateLimitData(key);

    // Initialize or reset if window expired
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
        firstRequest: now
      };
    }

    // Check if request is allowed
    const allowed = entry.count < this.config.maxRequests;
    
    if (allowed) {
      entry.count++;
      await this.writeRateLimitData(key, entry);
    }

    // Calculate remaining requests
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    
    // Calculate retry after (in seconds)
    const retryAfter = allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000);

    // Cleanup expired entries periodically (1% chance)
    if (Math.random() < 0.01) {
      this.cleanupExpiredEntries().catch(console.error);
    }

    return {
      allowed,
      limit: this.config.maxRequests,
      remaining,
      resetTime: entry.resetTime,
      retryAfter
    };
  }
}

/**
 * Predefined Rate Limiters
 */

// Review submission rate limiter (1 per day per IP/email)
export const reviewSubmissionLimiter = new FileRateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  maxRequests: 1,
  keyGenerator: (req) => {
    const clientId = getClientIdentifier(req);
    return `review_submission:${clientId}`;
  }
});

// Email verification rate limiter (3 attempts per hour)
export const emailVerificationLimiter = new FileRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  keyGenerator: (req) => {
    const clientId = getClientIdentifier(req);
    return `email_verification:${clientId}`;
  }
});

// General API rate limiter (100 requests per hour)
export const generalApiLimiter = new FileRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 100,
  keyGenerator: (req) => {
    const clientId = getClientIdentifier(req);
    const endpoint = new URL(req.url).pathname;
    return `api:${clientId}:${endpoint}`;
  }
});

// Admin API rate limiter (stricter limits)
export const adminApiLimiter = new FileRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 50,
  keyGenerator: (req) => {
    const clientId = getClientIdentifier(req);
    return `admin_api:${clientId}`;
  }
});

/**
 * Rate Limit Middleware Factory
 */
export function createRateLimitMiddleware(limiter: FileRateLimiter) {
  return async (req: NextRequest): Promise<Response | null> => {
    try {
      const result = await limiter.checkRateLimit(req);

      // Add rate limit headers
      const headers = new Headers({
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      });

      if (!result.allowed) {
        headers.set('Retry-After', result.retryAfter?.toString() || '3600');
        
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again in ${result.retryAfter} seconds.`,
            retryAfter: result.retryAfter
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              ...Object.fromEntries(headers.entries())
            }
          }
        );
      }

      // Request is allowed, but we can't modify the request object
      // The calling code should check the rate limit separately
      return null;
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow request on rate limiter failure (fail open)
      return null;
    }
  };
}

/**
 * Email-based Rate Limiter
 */
export class EmailRateLimiter {
  private limiter: FileRateLimiter;

  constructor(windowMs: number = 24 * 60 * 60 * 1000, maxRequests: number = 1) {
    this.limiter = new FileRateLimiter({
      windowMs,
      maxRequests,
      keyGenerator: () => 'email' // Will be overridden
    });
  }

  async checkEmailRateLimit(email: string): Promise<RateLimitResult> {
    // Create a mock request with email as identifier
    const mockReq = {
      headers: new Headers(),
      url: 'http://localhost/api/reviews/submit'
    } as NextRequest;

    // Override key generation for email-based limiting
    const originalKeyGen = this.limiter['config'].keyGenerator;
    this.limiter['config'].keyGenerator = () => `email:${email.toLowerCase()}`;

    try {
      const result = await this.limiter.checkRateLimit(mockReq);
      return result;
    } finally {
      // Restore original key generator
      this.limiter['config'].keyGenerator = originalKeyGen;
    }
  }
}

/**
 * Utility Functions
 */

/**
 * Check if IP address is in whitelist
 */
export function isWhitelistedIp(ip: string, whitelist: string[] = []): boolean {
  // Add localhost and common development IPs
  const defaultWhitelist = ['127.0.0.1', '::1', 'localhost'];
  const allWhitelisted = [...defaultWhitelist, ...whitelist];
  
  return allWhitelisted.includes(ip);
}

/**
 * Get rate limit status for display
 */
export function formatRateLimitStatus(result: RateLimitResult): string {
  if (result.allowed) {
    return `${result.remaining}/${result.limit} requests remaining`;
  } else {
    const resetDate = new Date(result.resetTime);
    return `Rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`;
  }
}

/**
 * Rate limit error response helper
 */
export function createRateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
      retryAfter: result.retryAfter,
      resetTime: result.resetTime
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': result.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        'Retry-After': result.retryAfter?.toString() || '3600'
      }
    }
  );
}
/**
 * Token Management Utilities
 * 
 * Secure token generation, validation, and management for email verification
 */

import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import type { VerificationToken } from '@/lib/types/review';

/**
 * Token Configuration
 */
const TOKEN_CONFIG = {
  // Token settings
  tokenLength: 32, // 32 bytes = 64 hex characters
  expirationHours: 24, // 24 hours default expiration
  maxAttempts: 5, // Maximum verification attempts per token
  
  // Cleanup settings
  cleanupInterval: 60 * 60 * 1000, // 1 hour in milliseconds
  maxTokenAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  
  // Security settings
  algorithm: 'sha256',
  encoding: 'hex' as const
};

/**
 * Token Generation and Validation Class
 */
export class TokenManager {
  private static instance: TokenManager;
  private tokensDir: string;

  private constructor() {
    this.tokensDir = path.join(process.cwd(), 'data', 'verification', 'tokens');
    this.ensureTokensDirectory();
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Ensure tokens directory exists
   */
  private async ensureTokensDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.tokensDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create tokens directory:', error);
    }
  }

  /**
   * Generate a cryptographically secure token
   */
  generateSecureToken(): string {
    return crypto.randomBytes(TOKEN_CONFIG.tokenLength).toString(TOKEN_CONFIG.encoding);
  }

  /**
   * Create a verification token
   */
  async createVerificationToken(
    email: string,
    reviewId: string,
    expirationHours: number = TOKEN_CONFIG.expirationHours
  ): Promise<{ token: string; tokenData: VerificationToken }> {
    const token = this.generateSecureToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

    const tokenData: VerificationToken = {
      token,
      email: email.toLowerCase().trim(),
      reviewId,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      used: false,
      attempts: 0
    };

    // Save token to file
    const tokenPath = path.join(this.tokensDir, `${token}.json`);
    await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2));

    // Log token creation
    await this.logTokenAction('created', token, email);

    return { token, tokenData };
  }

  /**
   * Validate and retrieve token data
   */
  async validateToken(token: string): Promise<{
    valid: boolean;
    tokenData?: VerificationToken;
    error?: string;
  }> {
    try {
      // Validate token format
      if (!this.isValidTokenFormat(token)) {
        return { valid: false, error: 'Invalid token format' };
      }

      // Load token data
      const tokenPath = path.join(this.tokensDir, `${token}.json`);
      const tokenFile = await fs.readFile(tokenPath, 'utf-8');
      const tokenData: VerificationToken = JSON.parse(tokenFile);

      // Check if token is already used
      if (tokenData.used) {
        return { valid: false, error: 'Token already used' };
      }

      // Check if token is expired
      const now = new Date();
      const expiresAt = new Date(tokenData.expiresAt);
      if (now > expiresAt) {
        return { valid: false, error: 'Token expired' };
      }

      // Check attempt limits
      if (tokenData.attempts >= TOKEN_CONFIG.maxAttempts) {
        return { valid: false, error: 'Too many attempts' };
      }

      return { valid: true, tokenData };

    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return { valid: false, error: 'Token not found' };
      }
      console.error('Token validation error:', error);
      return { valid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Mark token as used
   */
  async markTokenAsUsed(token: string): Promise<boolean> {
    try {
      const tokenPath = path.join(this.tokensDir, `${token}.json`);
      const tokenFile = await fs.readFile(tokenPath, 'utf-8');
      const tokenData: VerificationToken = JSON.parse(tokenFile);

      tokenData.used = true;
      tokenData.attempts += 1;

      await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2));
      await this.logTokenAction('used', token, tokenData.email);

      return true;
    } catch (error) {
      console.error('Failed to mark token as used:', error);
      return false;
    }
  }

  /**
   * Increment token attempt count
   */
  async incrementTokenAttempts(token: string): Promise<boolean> {
    try {
      const tokenPath = path.join(this.tokensDir, `${token}.json`);
      const tokenFile = await fs.readFile(tokenPath, 'utf-8');
      const tokenData: VerificationToken = JSON.parse(tokenFile);

      tokenData.attempts += 1;

      await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2));
      await this.logTokenAction('attempt', token, tokenData.email);

      return true;
    } catch (error) {
      console.error('Failed to increment token attempts:', error);
      return false;
    }
  }

  /**
   * Validate token format
   */
  private isValidTokenFormat(token: string): boolean {
    // Check length (32 bytes = 64 hex characters)
    if (token.length !== TOKEN_CONFIG.tokenLength * 2) {
      return false;
    }

    // Check if it's valid hexadecimal
    const hexRegex = /^[a-f0-9]+$/i;
    return hexRegex.test(token);
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<{
    cleaned: number;
    errors: number;
  }> {
    let cleaned = 0;
    let errors = 0;

    try {
      const files = await fs.readdir(this.tokensDir);
      const now = new Date();

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const tokenPath = path.join(this.tokensDir, file);
        
        try {
          const tokenData = JSON.parse(await fs.readFile(tokenPath, 'utf-8'));
          const expiresAt = new Date(tokenData.expiresAt);
          const createdAt = new Date(tokenData.createdAt);
          
          // Remove if expired or too old
          const isExpired = now > expiresAt;
          const isTooOld = (now.getTime() - createdAt.getTime()) > TOKEN_CONFIG.maxTokenAge;
          
          if (isExpired || isTooOld) {
            await fs.unlink(tokenPath);
            cleaned++;
            
            // Also remove associated pending review if it exists
            const reviewToken = file.replace('.json', '');
            const pendingReviewPath = path.join(
              process.cwd(), 
              'data', 
              'reviews', 
              'pending', 
              `${reviewToken}.json`
            );
            
            try {
              await fs.unlink(pendingReviewPath);
            } catch {
              // File might not exist, ignore
            }
          }
        } catch (error) {
          // Remove corrupted token files
          try {
            await fs.unlink(tokenPath);
            cleaned++;
          } catch {
            errors++;
          }
        }
      }

      // Log cleanup results
      await this.logCleanup(cleaned, errors);

    } catch (error) {
      console.error('Token cleanup error:', error);
      errors++;
    }

    return { cleaned, errors };
  }

  /**
   * Get token statistics
   */
  async getTokenStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    used: number;
  }> {
    let total = 0;
    let active = 0;
    let expired = 0;
    let used = 0;

    try {
      const files = await fs.readdir(this.tokensDir);
      const now = new Date();

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
          const tokenData = JSON.parse(
            await fs.readFile(path.join(this.tokensDir, file), 'utf-8')
          );
          
          total++;
          
          if (tokenData.used) {
            used++;
          } else {
            const expiresAt = new Date(tokenData.expiresAt);
            if (now > expiresAt) {
              expired++;
            } else {
              active++;
            }
          }
        } catch {
          // Ignore corrupted files
        }
      }
    } catch (error) {
      console.error('Failed to get token stats:', error);
    }

    return { total, active, expired, used };
  }

  /**
   * Revoke a specific token
   */
  async revokeToken(token: string, reason: string = 'Manual revocation'): Promise<boolean> {
    try {
      const tokenPath = path.join(this.tokensDir, `${token}.json`);
      const tokenFile = await fs.readFile(tokenPath, 'utf-8');
      const tokenData: VerificationToken = JSON.parse(tokenFile);

      tokenData.used = true;
      tokenData.attempts = TOKEN_CONFIG.maxAttempts;

      await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2));
      await this.logTokenAction('revoked', token, tokenData.email, reason);

      return true;
    } catch (error) {
      console.error('Failed to revoke token:', error);
      return false;
    }
  }

  /**
   * Find tokens by email
   */
  async findTokensByEmail(email: string): Promise<VerificationToken[]> {
    const tokens: VerificationToken[] = [];
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const files = await fs.readdir(this.tokensDir);

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
          const tokenData = JSON.parse(
            await fs.readFile(path.join(this.tokensDir, file), 'utf-8')
          );
          
          if (tokenData.email === normalizedEmail) {
            tokens.push(tokenData);
          }
        } catch {
          // Ignore corrupted files
        }
      }
    } catch (error) {
      console.error('Failed to find tokens by email:', error);
    }

    return tokens.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Log token actions for audit trail
   */
  private async logTokenAction(
    action: string,
    token: string,
    email: string,
    details?: string
  ): Promise<void> {
    try {
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      await fs.mkdir(auditDir, { recursive: true });

      const logPath = path.join(auditDir, 'tokens.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        action,
        token: token.substring(0, 8) + '...', // Only log first 8 characters for security
        email: email.toLowerCase(),
        details
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      console.error('Failed to log token action:', error);
    }
  }

  /**
   * Log cleanup operations
   */
  private async logCleanup(cleaned: number, errors: number): Promise<void> {
    try {
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      await fs.mkdir(auditDir, { recursive: true });

      const logPath = path.join(auditDir, 'token-cleanup.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'cleanup',
        cleaned,
        errors,
        totalProcessed: cleaned + errors
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      console.error('Failed to log cleanup:', error);
    }
  }
}

/**
 * Convenience functions for easy usage
 */
export const tokenManager = TokenManager.getInstance();

export async function createVerificationToken(email: string, reviewId: string, expirationHours?: number) {
  return tokenManager.createVerificationToken(email, reviewId, expirationHours);
}

export async function validateToken(token: string) {
  return tokenManager.validateToken(token);
}

export async function markTokenAsUsed(token: string) {
  return tokenManager.markTokenAsUsed(token);
}

export async function cleanupExpiredTokens() {
  return tokenManager.cleanupExpiredTokens();
}

export async function getTokenStats() {
  return tokenManager.getTokenStats();
}

/**
 * Scheduled cleanup function (call this periodically)
 */
export async function scheduleTokenCleanup(): Promise<void> {
  try {
    const stats = await getTokenStats();
    
    // Only run cleanup if there are expired tokens
    if (stats.expired > 0) {
      const result = await cleanupExpiredTokens();
      console.log(`Token cleanup completed: ${result.cleaned} cleaned, ${result.errors} errors`);
    }
  } catch (error) {
    console.error('Scheduled token cleanup failed:', error);
  }
}

/**
 * Generate a secure random string for various purposes
 */
export function generateSecureRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a string using SHA-256
 */
export function hashString(input: string): string {
  return crypto.createHash(TOKEN_CONFIG.algorithm).update(input).digest(TOKEN_CONFIG.encoding);
}

/**
 * Verify if a token matches its hash
 */
export function verifyTokenHash(token: string, hash: string): boolean {
  return hashString(token) === hash;
}
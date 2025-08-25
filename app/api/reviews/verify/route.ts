/**
 * Review Verification API Route
 * 
 * Handles email verification for submitted reviews
 */

// Configure route for dynamic behavior
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { verificationTokenSchema } from '@/lib/validation/review';
import { SECURITY_HEADERS } from '@/lib/utils/sanitize';
import { emailVerificationLimiter } from '@/lib/middleware/rateLimit';
import type { Review, VerificationToken, ApiResponse } from '@/lib/types/review';

/**
 * GET /api/reviews/verify?token=xxx&email=xxx
 * 
 * Verify email address and move review from pending to verified status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Apply security headers
    const headers = new Headers(SECURITY_HEADERS);
    headers.set('Content-Type', 'application/json');

    // Rate limiting check
    const rateLimitResult = await emailVerificationLimiter.checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many verification attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        } as ApiResponse,
        { 
          status: 429,
          headers: {
            ...Object.fromEntries(headers.entries()),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          }
        }
      );
    }

    // Extract query parameters
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_TOKEN',
          message: 'Verification token is required.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Validate token format
    if (token.length !== 64 || !/^[a-f0-9]+$/.test(token)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN_FORMAT',
          message: 'Invalid verification token format.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Load verification token data
    const tokensDir = path.join(process.cwd(), 'data', 'verification', 'tokens');
    const tokenPath = path.join(tokensDir, `${token}.json`);

    let tokenData: VerificationToken;
    try {
      const tokenFile = await fs.readFile(tokenPath, 'utf-8');
      tokenData = JSON.parse(tokenFile);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_NOT_FOUND',
          message: 'Verification token not found or expired.'
        } as ApiResponse,
        { status: 404, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Validate token data structure
    const tokenValidation = verificationTokenSchema.safeParse(tokenData);
    if (!tokenValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_TOKEN_DATA',
          message: 'Invalid token data structure.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Check if token is already used
    if (tokenData.used) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_ALREADY_USED',
          message: 'This verification link has already been used.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(tokenData.expiresAt);
    if (now > expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'Verification token has expired. Please submit a new review.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Verify email matches (if provided)
    if (email && email.toLowerCase() !== tokenData.email.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: 'EMAIL_MISMATCH',
          message: 'Email address does not match the verification token.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Load pending review
    const pendingDir = path.join(process.cwd(), 'data', 'reviews', 'pending');
    const pendingReviewPath = path.join(pendingDir, `${token}.json`);

    let review: Review;
    try {
      const reviewFile = await fs.readFile(pendingReviewPath, 'utf-8');
      review = JSON.parse(reviewFile);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'REVIEW_NOT_FOUND',
          message: 'Associated review not found.'
        } as ApiResponse,
        { status: 404, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Update review status and metadata
    review.status = 'verified';
    review.metadata.verifiedAt = new Date().toISOString();
    review.reviewer.verified = true;

    // Ensure verified directory exists
    const verifiedDir = path.join(process.cwd(), 'data', 'reviews', 'verified');
    await fs.mkdir(verifiedDir, { recursive: true });

    // Move review to verified directory with new filename (review ID)
    const verifiedReviewPath = path.join(verifiedDir, `${review.id}.json`);
    await fs.writeFile(verifiedReviewPath, JSON.stringify(review, null, 2));

    // Mark token as used and increment attempts
    tokenData.used = true;
    tokenData.attempts += 1;
    await fs.writeFile(tokenPath, JSON.stringify(tokenData, null, 2));

    // Remove from pending directory
    try {
      await fs.unlink(pendingReviewPath);
    } catch (error) {
      console.error('Failed to remove pending review file:', error);
    }

    // Update verified index
    await updateVerifiedIndex(review);

    // Log verification
    await logVerification(review.id, tokenData.email, 'success');

    // Process verification through workflow
    const { processVerification } = await import('@/lib/workflows/verification');
    const workflowResult = await processVerification(token);
    
    if (!workflowResult.success) {
      console.error('Workflow verification failed:', workflowResult.error);
      // Continue with the verification process even if workflow fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! Your review is now pending approval.',
        data: {
          reviewId: review.id,
          verified: true,
          status: review.status
        }
      } as ApiResponse,
      { 
        status: 200,
        headers: Object.fromEntries(headers.entries())
      }
    );

  } catch (error) {
    console.error('Email verification error:', error);

    // Log failed verification
    try {
      const url = new URL(request.url);
      const token = url.searchParams.get('token');
      await logVerification(token || 'unknown', 'unknown', 'error', error instanceof Error ? error.message : 'Unknown error');
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred during verification. Please try again later.'
      } as ApiResponse,
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...SECURITY_HEADERS
        }
      }
    );
  }
}

/**
 * Update verified reviews index for admin interface
 */
async function updateVerifiedIndex(review: Review): Promise<void> {
  try {
    const verifiedDir = path.join(process.cwd(), 'data', 'reviews', 'verified');
    const indexPath = path.join(verifiedDir, 'index.json');

    let index: any = {};
    try {
      const existingIndex = await fs.readFile(indexPath, 'utf-8');
      index = JSON.parse(existingIndex);
    } catch {
      // File doesn't exist, start fresh
    }

    if (!index.reviews) {
      index.reviews = [];
    }

    // Add review to index
    index.reviews.push({
      id: review.id,
      reviewerName: review.reviewer.name,
      reviewerEmail: review.reviewer.email,
      organization: review.reviewer.organization,
      relationship: review.reviewer.relationship,
      rating: review.content.rating,
      verifiedAt: review.metadata.verifiedAt,
      submittedAt: review.metadata.submittedAt
    });

    // Sort by verification date (newest first)
    index.reviews.sort((a: any, b: any) => 
      new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime()
    );

    // Keep only last 100 entries in index for performance
    if (index.reviews.length > 100) {
      index.reviews = index.reviews.slice(0, 100);
    }

    index.lastUpdated = new Date().toISOString();
    index.totalVerified = (index.totalVerified || 0) + 1;

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  } catch (error) {
    console.error('Failed to update verified index:', error);
  }
}

/**
 * Log verification attempt for audit trail
 */
async function logVerification(
  reviewId: string,
  email: string,
  status: 'success' | 'error' | 'expired' | 'invalid',
  errorMessage?: string
): Promise<void> {
  try {
    const auditDir = path.join(process.cwd(), 'data', 'audit');
    await fs.mkdir(auditDir, { recursive: true });

    const logPath = path.join(auditDir, 'verifications.log');
    const logEntry = {
      timestamp: new Date().toISOString(),
      reviewId,
      email: email.toLowerCase(),
      status,
      errorMessage
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(logPath, logLine);
  } catch (error) {
    console.error('Failed to log verification:', error);
  }
}

/**
 * Clean up expired tokens (called periodically)
 */
async function cleanupExpiredTokens(): Promise<void> {
  try {
    const tokensDir = path.join(process.cwd(), 'data', 'verification', 'tokens');
    const files = await fs.readdir(tokensDir);
    const now = new Date();

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const tokenPath = path.join(tokensDir, file);
      try {
        const tokenData = JSON.parse(await fs.readFile(tokenPath, 'utf-8'));
        const expiresAt = new Date(tokenData.expiresAt);

        if (now > expiresAt) {
          await fs.unlink(tokenPath);
          
          // Also remove associated pending review if it exists
          const pendingReviewPath = path.join(
            process.cwd(), 
            'data', 
            'reviews', 
            'pending', 
            file
          );
          try {
            await fs.unlink(pendingReviewPath);
          } catch {
            // File might not exist, ignore
          }
        }
      } catch {
        // Remove corrupted token files
        await fs.unlink(tokenPath);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup expired tokens:', error);
  }
}

// Run cleanup on 1% of requests to avoid performance impact
if (Math.random() < 0.01) {
  cleanupExpiredTokens().catch(console.error);
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      ...SECURITY_HEADERS
    }
  });
}
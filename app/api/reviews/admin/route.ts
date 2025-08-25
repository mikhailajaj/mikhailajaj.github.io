/**
 * Admin Review Management API Route
 * 
 * Handles admin operations for review approval, rejection, and management
 */

// Configure route for dynamic behavior
// Dynamic flags disabled for static export compatibility

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { adminActionSchema, reviewUpdateSchema } from '@/lib/validation/review';
import { SECURITY_HEADERS, sanitizeRequestBody } from '@/lib/utils/sanitize';
import { adminApiLimiter } from '@/lib/middleware/rateLimit';
import type { Review, AdminActionLog, ApiResponse, ReviewStats } from '@/lib/types/review';

/**
 * GET /api/reviews/admin
 * 
 * Get pending reviews for admin approval
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Apply security headers
    const headers = new Headers(SECURITY_HEADERS);
    headers.set('Content-Type', 'application/json');

    // Basic admin authentication check (TODO: Implement proper auth in Phase 2)
    const authHeader = request.headers.get('authorization');
    if (!isValidAdminAuth(authHeader)) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Admin authentication required.'
        } as ApiResponse,
        { status: 401, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Rate limiting check
    const rateLimitResult = await adminApiLimiter.checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many admin requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        } as ApiResponse,
        { status: 429, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || 'verified';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Get reviews based on status
    let reviews: Review[] = [];
    let totalCount = 0;

    switch (status) {
      case 'verified':
        ({ reviews, totalCount } = await getVerifiedReviews(limit, offset));
        break;
      case 'approved':
        ({ reviews, totalCount } = await getApprovedReviews(limit, offset));
        break;
      case 'rejected':
        ({ reviews, totalCount } = await getRejectedReviews(limit, offset));
        break;
      case 'all':
        ({ reviews, totalCount } = await getAllReviews(limit, offset));
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'INVALID_STATUS',
            message: 'Invalid status parameter.'
          } as ApiResponse,
          { status: 400, headers: Object.fromEntries(headers.entries()) }
        );
    }

    // Get review statistics
    const stats = await getReviewStats();

    return NextResponse.json(
      {
        success: true,
        data: {
          reviews,
          pagination: {
            total: totalCount,
            limit,
            offset,
            hasMore: offset + limit < totalCount
          },
          stats
        }
      } as ApiResponse,
      { status: 200, headers: Object.fromEntries(headers.entries()) }
    );

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching reviews.'
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
 * POST /api/reviews/admin
 * 
 * Perform admin actions on reviews (approve, reject, feature, etc.)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Apply security headers
    const headers = new Headers(SECURITY_HEADERS);
    headers.set('Content-Type', 'application/json');

    // Basic admin authentication check
    const authHeader = request.headers.get('authorization');
    if (!isValidAdminAuth(authHeader)) {
      return NextResponse.json(
        {
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Admin authentication required.'
        } as ApiResponse,
        { status: 401, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Rate limiting check
    const rateLimitResult = await adminApiLimiter.checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many admin requests. Please try again later.'
        } as ApiResponse,
        { status: 429, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Parse and sanitize request body
    const rawBody = await request.json();
    const sanitizedBody = sanitizeRequestBody(rawBody);

    // Validate action data
    const actionValidation = adminActionSchema.safeParse(sanitizedBody.action);
    if (!actionValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_ACTION',
          message: 'Invalid admin action specified.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    const { reviewId, action, notes } = sanitizedBody;
    
    if (!reviewId) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_REVIEW_ID',
          message: 'Review ID is required.'
        } as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    // Perform the admin action
    const result = await performAdminAction(reviewId, action, notes, request);

    if (!result.success) {
      return NextResponse.json(
        result as ApiResponse,
        { status: 400, headers: Object.fromEntries(headers.entries()) }
      );
    }

    return NextResponse.json(
      result as ApiResponse,
      { status: 200, headers: Object.fromEntries(headers.entries()) }
    );

  } catch (error) {
    console.error('Admin action error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while performing the admin action.'
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
 * Basic admin authentication (TODO: Replace with proper auth system)
 */
function isValidAdminAuth(authHeader: string | null): boolean {
  // For now, use a simple token-based auth
  // In production, implement proper JWT or session-based auth
  const expectedToken = process.env.ADMIN_API_TOKEN || 'admin-dev-token';
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token === expectedToken;
}

/**
 * Get verified reviews awaiting approval
 */
async function getVerifiedReviews(limit: number, offset: number): Promise<{ reviews: Review[], totalCount: number }> {
  const verifiedDir = path.join(process.cwd(), 'data', 'reviews', 'verified');
  
  try {
    const files = await fs.readdir(verifiedDir);
    const reviewFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
    
    const totalCount = reviewFiles.length;
    const paginatedFiles = reviewFiles
      .sort((a, b) => b.localeCompare(a)) // Sort by filename (newest first)
      .slice(offset, offset + limit);

    const reviews: Review[] = [];
    for (const file of paginatedFiles) {
      try {
        const reviewData = await fs.readFile(path.join(verifiedDir, file), 'utf-8');
        reviews.push(JSON.parse(reviewData));
      } catch (error) {
        console.error(`Failed to read review file ${file}:`, error);
      }
    }

    return { reviews, totalCount };
  } catch (error) {
    console.error('Failed to get verified reviews:', error);
    return { reviews: [], totalCount: 0 };
  }
}

/**
 * Get approved reviews
 */
async function getApprovedReviews(limit: number, offset: number): Promise<{ reviews: Review[], totalCount: number }> {
  const approvedDir = path.join(process.cwd(), 'data', 'reviews', 'approved');
  
  try {
    const files = await fs.readdir(approvedDir);
    const reviewFiles = files.filter(f => f.endsWith('.json') && !['index.json', 'featured.json', 'stats.json'].includes(f));
    
    const totalCount = reviewFiles.length;
    const paginatedFiles = reviewFiles
      .sort((a, b) => b.localeCompare(a))
      .slice(offset, offset + limit);

    const reviews: Review[] = [];
    for (const file of paginatedFiles) {
      try {
        const reviewData = await fs.readFile(path.join(approvedDir, file), 'utf-8');
        reviews.push(JSON.parse(reviewData));
      } catch (error) {
        console.error(`Failed to read approved review file ${file}:`, error);
      }
    }

    return { reviews, totalCount };
  } catch (error) {
    console.error('Failed to get approved reviews:', error);
    return { reviews: [], totalCount: 0 };
  }
}

/**
 * Get rejected reviews
 */
async function getRejectedReviews(limit: number, offset: number): Promise<{ reviews: Review[], totalCount: number }> {
  const rejectedDir = path.join(process.cwd(), 'data', 'reviews', 'rejected');
  
  try {
    const files = await fs.readdir(rejectedDir);
    const reviewFiles = files.filter(f => f.endsWith('.json'));
    
    const totalCount = reviewFiles.length;
    const paginatedFiles = reviewFiles
      .sort((a, b) => b.localeCompare(a))
      .slice(offset, offset + limit);

    const reviews: Review[] = [];
    for (const file of paginatedFiles) {
      try {
        const reviewData = await fs.readFile(path.join(rejectedDir, file), 'utf-8');
        reviews.push(JSON.parse(reviewData));
      } catch (error) {
        console.error(`Failed to read rejected review file ${file}:`, error);
      }
    }

    return { reviews, totalCount };
  } catch (error) {
    console.error('Failed to get rejected reviews:', error);
    return { reviews: [], totalCount: 0 };
  }
}

/**
 * Get all reviews across all statuses
 */
async function getAllReviews(limit: number, offset: number): Promise<{ reviews: Review[], totalCount: number }> {
  const allReviews: Review[] = [];
  
  // Get from all directories
  const { reviews: verified } = await getVerifiedReviews(1000, 0);
  const { reviews: approved } = await getApprovedReviews(1000, 0);
  const { reviews: rejected } = await getRejectedReviews(1000, 0);
  
  allReviews.push(...verified, ...approved, ...rejected);
  
  // Sort by submission date (newest first)
  allReviews.sort((a, b) => 
    new Date(b.metadata.submittedAt).getTime() - new Date(a.metadata.submittedAt).getTime()
  );
  
  const totalCount = allReviews.length;
  const paginatedReviews = allReviews.slice(offset, offset + limit);
  
  return { reviews: paginatedReviews, totalCount };
}

/**
 * Get review statistics
 */
async function getReviewStats(): Promise<ReviewStats> {
  try {
    const { reviews: verified } = await getVerifiedReviews(1000, 0);
    const { reviews: approved } = await getApprovedReviews(1000, 0);
    const { reviews: rejected } = await getRejectedReviews(1000, 0);
    
    const allReviews = [...verified, ...approved, ...rejected];
    
    const stats: ReviewStats = {
      total: allReviews.length,
      approved: approved.length,
      pending: verified.length,
      verified: verified.length,
      rejected: rejected.length,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      relationshipBreakdown: {
        professor: 0,
        colleague: 0,
        supervisor: 0,
        collaborator: 0,
        client: 0
      },
      monthlySubmissions: []
    };
    
    // Calculate statistics from approved reviews
    if (approved.length > 0) {
      const totalRating = approved.reduce((sum, review) => sum + review.content.rating, 0);
      stats.averageRating = totalRating / approved.length;
      
      // Rating distribution
      approved.forEach(review => {
        const rating = review.content.rating as keyof typeof stats.ratingDistribution;
        stats.ratingDistribution[rating]++;
      });
      
      // Relationship breakdown
      approved.forEach(review => {
        const relationship = review.reviewer.relationship;
        stats.relationshipBreakdown[relationship]++;
      });
    }
    
    return stats;
  } catch (error) {
    console.error('Failed to calculate review stats:', error);
    return {
      total: 0,
      approved: 0,
      pending: 0,
      verified: 0,
      rejected: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      relationshipBreakdown: {
        professor: 0,
        colleague: 0,
        supervisor: 0,
        collaborator: 0,
        client: 0
      },
      monthlySubmissions: []
    };
  }
}

/**
 * Perform admin action on a review
 */
async function performAdminAction(
  reviewId: string,
  action: string,
  notes?: string,
  request?: NextRequest
): Promise<ApiResponse> {
  try {
    // Find the review in verified directory
    const verifiedDir = path.join(process.cwd(), 'data', 'reviews', 'verified');
    const reviewPath = path.join(verifiedDir, `${reviewId}.json`);
    
    let review: Review;
    try {
      const reviewData = await fs.readFile(reviewPath, 'utf-8');
      review = JSON.parse(reviewData);
    } catch (error) {
      return {
        success: false,
        error: 'REVIEW_NOT_FOUND',
        message: 'Review not found in verified directory.'
      };
    }

    const previousState = { ...review };
    const now = new Date().toISOString();
    const clientIp = request?.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    switch (action) {
      case 'approve':
        review.status = 'approved';
        review.metadata.approvedAt = now;
        review.admin.moderatedAt = now;
        review.admin.moderatedBy = 'admin'; // TODO: Get actual admin user
        if (notes) review.admin.notes = notes;
        
        // Move to approved directory
        const approvedDir = path.join(process.cwd(), 'data', 'reviews', 'approved');
        await fs.mkdir(approvedDir, { recursive: true });
        await fs.writeFile(path.join(approvedDir, `${reviewId}.json`), JSON.stringify(review, null, 2));
        await fs.unlink(reviewPath);
        
        // Update approved index
        await updateApprovedIndex(review);
        
        // Process approval through workflow
        const { processApproval: processApprovalWorkflow } = await import('@/lib/workflows/verification');
        await processApprovalWorkflow(reviewId, true, notes);
        break;

      case 'reject':
        review.status = 'rejected';
        review.metadata.rejectedAt = now;
        review.admin.moderatedAt = now;
        review.admin.moderatedBy = 'admin';
        review.admin.rejectionReason = notes || 'No reason provided';
        
        // Move to rejected directory
        const rejectedDir = path.join(process.cwd(), 'data', 'reviews', 'rejected');
        await fs.mkdir(rejectedDir, { recursive: true });
        await fs.writeFile(path.join(rejectedDir, `${reviewId}.json`), JSON.stringify(review, null, 2));
        await fs.unlink(reviewPath);
        
        // Process rejection through workflow
        const { processApproval: processRejectionWorkflow } = await import('@/lib/workflows/verification');
        await processRejectionWorkflow(reviewId, false, notes);
        break;

      case 'feature':
        review.admin.featured = true;
        review.admin.moderatedAt = now;
        if (notes) review.admin.notes = notes;
        await fs.writeFile(reviewPath, JSON.stringify(review, null, 2));
        break;

      case 'unfeature':
        review.admin.featured = false;
        review.admin.moderatedAt = now;
        if (notes) review.admin.notes = notes;
        await fs.writeFile(reviewPath, JSON.stringify(review, null, 2));
        break;

      default:
        return {
          success: false,
          error: 'INVALID_ACTION',
          message: 'Invalid admin action specified.'
        };
    }

    // Log admin action
    await logAdminAction(reviewId, action, 'admin', clientIp, previousState, review, notes);

    return {
      success: true,
      message: `Review ${action}ed successfully.`,
      data: {
        reviewId,
        action,
        newStatus: review.status
      }
    };

  } catch (error) {
    console.error('Admin action error:', error);
    return {
      success: false,
      error: 'ACTION_FAILED',
      message: 'Failed to perform admin action.'
    };
  }
}

/**
 * Update approved reviews index
 */
async function updateApprovedIndex(review: Review): Promise<void> {
  try {
    const approvedDir = path.join(process.cwd(), 'data', 'reviews', 'approved');
    const indexPath = path.join(approvedDir, 'index.json');

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
      organization: review.reviewer.organization,
      relationship: review.reviewer.relationship,
      rating: review.content.rating,
      featured: review.admin.featured,
      approvedAt: review.metadata.approvedAt,
      submittedAt: review.metadata.submittedAt
    });

    // Sort by approval date (newest first)
    index.reviews.sort((a: any, b: any) => 
      new Date(b.approvedAt).getTime() - new Date(a.approvedAt).getTime()
    );

    index.lastUpdated = new Date().toISOString();
    index.totalApproved = index.reviews.length;

    await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
  } catch (error) {
    console.error('Failed to update approved index:', error);
  }
}

/**
 * Log admin action for audit trail
 */
async function logAdminAction(
  reviewId: string,
  action: string,
  performedBy: string,
  ipAddress: string,
  previousState: Review,
  newState: Review,
  notes?: string
): Promise<void> {
  try {
    const auditDir = path.join(process.cwd(), 'data', 'audit');
    await fs.mkdir(auditDir, { recursive: true });

    const logPath = path.join(auditDir, 'admin-actions.log');
    const logEntry: AdminActionLog = {
      id: crypto.randomUUID(),
      reviewId,
      action: action as any,
      performedBy,
      performedAt: new Date().toISOString(),
      previousState,
      newState,
      notes,
      ipAddress
    };

    const logLine = JSON.stringify(logEntry) + '\n';
    await fs.appendFile(logPath, logLine);
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      ...SECURITY_HEADERS
    }
  });
}
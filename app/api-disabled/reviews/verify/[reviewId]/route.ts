/**
 * Review Verification API Route
 * 
 * Handles email verification for submitted reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Configure for dynamic API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/reviews/verify/[reviewId]
 * 
 * Verify a review submission via email verification
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
): Promise<NextResponse> {
  try {
    const { reviewId } = params;

    // Validate review ID format
    if (!reviewId || reviewId.length !== 12) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_REVIEW_ID',
          message: 'Invalid review ID format'
        },
        { status: 400 }
      );
    }

    // Load review data
    const reviewFile = path.join(process.cwd(), 'data', 'reviews', `${reviewId}.json`);
    
    let reviewData;
    try {
      const fileContent = await fs.readFile(reviewFile, 'utf-8');
      reviewData = JSON.parse(fileContent);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'REVIEW_NOT_FOUND',
          message: 'Review not found or has been removed'
        },
        { status: 404 }
      );
    }

    // Check if already verified
    if (reviewData.reviewer.verified) {
      return NextResponse.json(
        {
          success: false,
          error: 'ALREADY_VERIFIED',
          message: 'This review has already been verified'
        },
        { status: 400 }
      );
    }

    // Check if verification has expired (7 days)
    const submissionDate = new Date(reviewData.metadata.submittedAt);
    const expirationDate = new Date(submissionDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    if (new Date() > expirationDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'EXPIRED',
          message: 'This verification link has expired. Please submit your review again.'
        },
        { status: 400 }
      );
    }

    // Mark as verified
    reviewData.reviewer.verified = true;
    reviewData.reviewer.verifiedAt = new Date().toISOString();
    reviewData.status = 'verified';

    // Save updated review
    await fs.writeFile(reviewFile, JSON.stringify(reviewData, null, 2));

    // Send notification to admin
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      if (process.env.REVIEW_ADMIN_EMAIL) {
        await resend.emails.send({
          from: process.env.REVIEW_FROM_EMAIL || 'noreply@resend.dev',
          to: process.env.REVIEW_ADMIN_EMAIL,
          subject: `Testimonial verified and ready for review - ${reviewData.reviewer.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Testimonial Verified ✅</h2>
              <p><strong>Review ID:</strong> ${reviewId}</p>
              <p><strong>From:</strong> ${reviewData.reviewer.name} (${reviewData.reviewer.email})</p>
              <p><strong>Rating:</strong> ${reviewData.content.rating}/5 stars</p>
              <p><strong>Relationship:</strong> ${reviewData.reviewer.relationship}</p>
              ${reviewData.reviewer.organization ? `<p><strong>Organization:</strong> ${reviewData.reviewer.organization}</p>` : ''}
              <p><strong>Testimonial:</strong></p>
              <blockquote style="border-left: 3px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666;">
                ${reviewData.content.testimonial}
              </blockquote>
              <p><strong>Recommendation:</strong> ${reviewData.content.recommendation ? 'Yes' : 'No'}</p>
              <hr>
              <p style="color: #666; font-size: 14px;">
                This testimonial is now verified and ready for admin review and approval.
              </p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/reviews" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Review in Admin Panel
                </a>
              </div>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the verification if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! Your testimonial will be reviewed and published within 1-2 business days.',
        data: {
          reviewId,
          verifiedAt: reviewData.reviewer.verifiedAt,
          status: reviewData.status
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Review verification error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred during verification. Please try again later.'
      },
      { status: 500 }
    );
  }
}
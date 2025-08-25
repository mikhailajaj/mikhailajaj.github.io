/**
 * Admin Review Management API Route
 * 
 * Handles admin operations on submitted reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Resend } from 'resend';

// Configure for dynamic API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * PATCH /api/admin/reviews/[reviewId]
 * 
 * Update review status and admin notes
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { reviewId: string } }
): Promise<NextResponse> {
  try {
    const { reviewId } = params;
    const body = await request.json();

    // Simple authentication check
    // In production, implement proper admin authentication
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;
    
    // For now, skip auth check in development
    // if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
    //   return NextResponse.json(
    //     { success: false, error: 'UNAUTHORIZED', message: 'Admin access required' },
    //     { status: 401 }
    //   );
    // }

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

    // Validate request body
    const { status, notes, reviewedBy } = body;
    
    if (!status || !['approved', 'rejected', 'published'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_STATUS',
          message: 'Status must be one of: approved, rejected, published'
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
          message: 'Review not found'
        },
        { status: 404 }
      );
    }

    // Update review data
    reviewData.status = status;
    reviewData.admin.notes = notes || '';
    reviewData.admin.reviewedBy = reviewedBy || 'Admin';
    reviewData.admin.reviewedAt = new Date().toISOString();

    // Save updated review
    await fs.writeFile(reviewFile, JSON.stringify(reviewData, null, 2));

    // Send notification emails
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      if (status === 'approved') {
        // Notify reviewer of approval
        await resend.emails.send({
          from: process.env.REVIEW_FROM_EMAIL || 'noreply@resend.dev',
          to: reviewData.reviewer.email,
          replyTo: process.env.REVIEW_REPLY_TO_EMAIL,
          subject: 'Your testimonial has been approved! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Great news, ${reviewData.reviewer.name}!</h2>
              <p>Your testimonial has been approved and will be published on the website soon.</p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #28a745;">Your Testimonial</h3>
                <p style="margin: 0; font-style: italic;">"${reviewData.content.testimonial}"</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                  Rating: ${reviewData.content.rating}/5 stars
                </p>
              </div>
              
              <p>Thank you for taking the time to share your experience. Your feedback is greatly appreciated!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Visit Website
                </a>
              </div>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">
                If you have any questions, feel free to reply to this email.
              </p>
            </div>
          `
        });
      } else if (status === 'rejected') {
        // Notify reviewer of rejection
        await resend.emails.send({
          from: process.env.REVIEW_FROM_EMAIL || 'noreply@resend.dev',
          to: reviewData.reviewer.email,
          replyTo: process.env.REVIEW_REPLY_TO_EMAIL,
          subject: 'Update on your testimonial submission',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Thank you for your submission, ${reviewData.reviewer.name}</h2>
              <p>We appreciate you taking the time to submit a testimonial.</p>
              
              <p>After review, we're unable to publish your testimonial at this time. This could be due to various reasons such as content guidelines or verification requirements.</p>
              
              ${notes ? `
                <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0;">
                  <h3 style="margin: 0 0 10px 0; color: #6c757d;">Additional Notes</h3>
                  <p style="margin: 0;">${notes}</p>
                </div>
              ` : ''}
              
              <p>If you have any questions or would like to discuss this further, please feel free to reply to this email.</p>
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px;">
                Thank you for your understanding.
              </p>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the status update if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: `Review ${status} successfully`,
        data: {
          reviewId,
          status,
          reviewedAt: reviewData.admin.reviewedAt,
          reviewedBy: reviewData.admin.reviewedBy
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin review update error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while updating the review'
      },
      { status: 500 }
    );
  }
}
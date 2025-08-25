/**
 * Review Submission API Route
 * 
 * Handles review submissions with validation and email verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { reviewSubmissionSchema } from '@/lib/validation/review';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';

// Note: This API route won't work with static export
// This is kept for reference but won't be used in production

/**
 * POST /api/reviews/submit
 * 
 * Submit a new review for verification and approval
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Validate the submission data
    const validationResult = reviewSubmissionSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid submission data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    
    // Check honeypot field for spam protection
    if (data.honeypot && data.honeypot.trim() !== '') {
      return NextResponse.json(
        {
          success: false,
          error: 'SPAM_DETECTED',
          message: 'Submission rejected'
        },
        { status: 400 }
      );
    }

    // Generate unique review ID
    const reviewId = nanoid(12);
    
    // Create review object
    const review = {
      id: reviewId,
      status: 'pending',
      reviewer: {
        name: data.name,
        email: data.email,
        title: data.title || '',
        organization: data.organization || '',
        relationship: data.relationship,
        linkedinUrl: data.linkedinUrl || '',
        verified: false
      },
      content: {
        rating: data.rating,
        testimonial: data.testimonial,
        projectAssociation: data.projectAssociation || '',
        skills: data.skills || [],
        recommendation: data.recommendation,
        highlights: data.highlights || [],
        workPeriod: data.workPeriod
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        source: 'direct' as const,
        language: 'en',
        timezone: 'UTC'
      },
      admin: {
        notes: '',
        reviewedBy: '',
        reviewedAt: null,
        featured: false
      }
    };

    // Save review to file system (for static deployment)
    try {
      const reviewsDir = path.join(process.cwd(), 'data', 'reviews');
      await fs.mkdir(reviewsDir, { recursive: true });
      
      const reviewFile = path.join(reviewsDir, `${reviewId}.json`);
      await fs.writeFile(reviewFile, JSON.stringify(review, null, 2));
      
      console.log('Review saved to file:', reviewFile);
    } catch (error) {
      console.error('Failed to save review to file:', error);
      // Continue with the process even if file save fails
    }

    // Send verification email using Resend
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reviews/verify/${reviewId}`;
      
      const emailResult = await resend.emails.send({
        from: process.env.REVIEW_FROM_EMAIL || 'noreply@resend.dev',
        to: data.email,
        replyTo: process.env.REVIEW_REPLY_TO_EMAIL,
        subject: 'Please verify your testimonial submission',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Thank you for your testimonial!</h2>
            <p>Hi ${data.name},</p>
            <p>Thank you for submitting a testimonial. To complete the process, please verify your email address by clicking the link below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email & Confirm Testimonial
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              This verification link will expire in 7 days. If you didn't submit this testimonial, you can safely ignore this email.
            </p>
          </div>
        `
      });
      
      console.log('Verification email sent:', emailResult);
      
      // Also notify admin
      if (process.env.REVIEW_ADMIN_EMAIL) {
        await resend.emails.send({
          from: process.env.REVIEW_FROM_EMAIL || 'noreply@resend.dev',
          to: process.env.REVIEW_ADMIN_EMAIL,
          subject: `New testimonial submission from ${data.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>New Testimonial Submission</h2>
              <p><strong>Review ID:</strong> ${reviewId}</p>
              <p><strong>From:</strong> ${data.name} (${data.email})</p>
              <p><strong>Rating:</strong> ${data.rating}/5 stars</p>
              <p><strong>Relationship:</strong> ${data.relationship}</p>
              ${data.organization ? `<p><strong>Organization:</strong> ${data.organization}</p>` : ''}
              <p><strong>Testimonial:</strong></p>
              <blockquote style="border-left: 3px solid #007bff; padding-left: 15px; margin: 15px 0; color: #666;">
                ${data.testimonial}
              </blockquote>
              <p><strong>Recommendation:</strong> ${data.recommendation ? 'Yes' : 'No'}</p>
              <hr>
              <p style="color: #666; font-size: 14px;">
                The user will need to verify their email before the testimonial can be reviewed for approval.
              </p>
            </div>
          `
        });
      }
      
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          reviewId,
          message: 'Review submitted successfully! Please check your email to verify your submission.',
          nextSteps: [
            'Check your email for a verification link',
            'Click the verification link to confirm your review',
            'Your review will be reviewed and published within 1-2 business days'
          ]
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Review submission error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while processing your submission. Please try again later.'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }
  });
}
/**
 * Email Service Integration
 * 
 * Handles email sending for review verification and notifications using Resend
 */

import { Resend } from 'resend';
import type { VerificationToken, Review } from '@/lib/types/review';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Email Configuration
 */
const EMAIL_CONFIG = {
  fromAddress: process.env.REVIEW_FROM_EMAIL || 'noreply@resend.dev',
  replyToAddress: process.env.REVIEW_REPLY_TO_EMAIL || 'mikhailajaj@gmail.com',
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://mikhailajaj.github.io',
  
  // Email limits (Resend free tier: 3,000 emails/month, 100/day)
  dailyLimit: 90, // Conservative limit
  monthlyLimit: 2800, // Conservative limit
  
  // Template settings
  templates: {
    verification: 'review-verification',
    approved: 'review-approved',
    rejected: 'review-rejected',
    adminNotification: 'admin-notification'
  }
};

/**
 * Email Templates
 */
const EMAIL_TEMPLATES = {
  verification: {
    subject: 'Verify Your Review Submission - Mikhail Ajaj Portfolio',
    getHtml: (data: { name: string; verificationUrl: string; expiresIn: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Review</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .content { background: #f8fafc; padding: 30px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .button:hover { background: #2563eb; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
            .security-note { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Mikhail Ajaj</div>
              <p>Full-Stack, Cloud & Data Engineer</p>
              <p><a href="https://mikhailajaj.github.io" style="color: #3b82f6; text-decoration: none;">mikhailajaj.github.io</a></p>
            </div>
            
            <div class="content">
              <h2>Thank you for your review, ${data.name}!</h2>
              
              <p>I appreciate you taking the time to share your feedback about our work together. To ensure the authenticity of all reviews, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>This verification link will expire in ${data.expiresIn}. After verification, your review will be reviewed and published within 2-3 business days.</p>
              
              <div class="security-note">
                <strong>Security Note:</strong> This email was sent because someone submitted a review using your email address. If you didn't submit a review, you can safely ignore this email.
              </div>
            </div>
            
            <div class="footer">
              <p>If you have any questions, please reply to this email at mikhailajaj@gmail.com</p>
              <p>© ${new Date().getFullYear()} Mikhail Ajaj. All rights reserved.</p>
              <p><a href="https://mikhailajaj.github.io" style="color: #6b7280;">Visit Portfolio</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    getText: (data: { name: string; verificationUrl: string; expiresIn: string }) => `
      Thank you for your review, ${data.name}!

      I appreciate you taking the time to share your feedback about our work together. 
      
      To verify your email address, please visit: ${data.verificationUrl}
      
      This link expires in ${data.expiresIn}.
      
      After verification, your review will be reviewed and published within 2-3 business days.
      
      If you didn't submit a review, you can safely ignore this email.
      
      Best regards,
      Mikhail Ajaj
      mikhailajaj@gmail.com
      Portfolio: https://mikhailajaj.github.io
    `
  },

  approved: {
    subject: 'Your Review Has Been Published - Thank You!',
    getHtml: (data: { name: string; reviewUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Review Published</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #3b82f6; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
            .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Mikhail Ajaj</div>
              <p>Full-Stack, Cloud & Data Engineer</p>
              <p><a href="https://mikhailajaj.github.io" style="color: #3b82f6; text-decoration: none;">mikhailajaj.github.io</a></p>
            </div>
            
            <div class="content">
              <h2>🎉 Your Review is Now Live!</h2>
              
              <p>Dear ${data.name},</p>
              
              <p>Thank you so much for your thoughtful review! It has been approved and is now published on my portfolio website.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.reviewUrl}" class="button">View Your Review</a>
              </div>
              
              <p>Your feedback means a lot to me and helps others understand the quality of work and collaboration they can expect. I truly appreciate you taking the time to share your experience.</p>
              
              <p>Thank you again for your support!</p>
            </div>
            
            <div class="footer">
              <p>Best regards,<br>Mikhail Ajaj<br>mikhailajaj@gmail.com</p>
              <p>© ${new Date().getFullYear()} Mikhail Ajaj. All rights reserved.</p>
              <p><a href="https://mikhailajaj.github.io" style="color: #6b7280;">Visit Portfolio</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    getText: (data: { name: string; reviewUrl: string }) => `
      Your Review is Now Live!

      Dear ${data.name},

      Thank you so much for your thoughtful review! It has been approved and is now published on my portfolio website.

      You can view your review at: ${data.reviewUrl}

      Your feedback means a lot to me and helps others understand the quality of work and collaboration they can expect.

      Thank you again for your support!

      Best regards,
      Mikhail Ajaj
      mikhailajaj@gmail.com
      Portfolio: https://mikhailajaj.github.io
    `
  },

  adminNotification: {
    subject: 'New Review Awaiting Approval',
    getHtml: (data: { reviewerName: string; organization: string; rating: number; adminUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Review Pending</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .content { background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
            .stars { color: #fbbf24; font-size: 18px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h3>📝 New Review Awaiting Approval</h3>
              
              <p><strong>Reviewer:</strong> ${data.reviewerName}</p>
              <p><strong>Organization:</strong> ${data.organization || 'Not specified'}</p>
              <p><strong>Rating:</strong> <span class="${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}">${data.rating}/5</span></p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${data.adminUrl}" class="button">Review & Approve</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  }
};

/**
 * Email Service Class
 */
export class EmailService {
  private static instance: EmailService;
  private dailyCount: number = 0;
  private monthlyCount: number = 0;
  private lastResetDate: string = '';

  private constructor() {
    this.loadEmailCounts();
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Load email counts from storage
   */
  private async loadEmailCounts(): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      const countsPath = path.join(process.cwd(), 'data', 'email-counts.json');
      const data = await fs.readFile(countsPath, 'utf-8');
      const counts = JSON.parse(data);
      
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().substring(0, 7);
      
      // Reset daily count if it's a new day
      if (counts.lastDate !== today) {
        this.dailyCount = 0;
      } else {
        this.dailyCount = counts.dailyCount || 0;
      }
      
      // Reset monthly count if it's a new month
      if (counts.lastMonth !== thisMonth) {
        this.monthlyCount = 0;
      } else {
        this.monthlyCount = counts.monthlyCount || 0;
      }
      
      this.lastResetDate = today;
    } catch (error) {
      // File doesn't exist or is corrupted, start fresh
      this.dailyCount = 0;
      this.monthlyCount = 0;
      this.lastResetDate = new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Save email counts to storage
   */
  private async saveEmailCounts(): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });
      
      const countsPath = path.join(dataDir, 'email-counts.json');
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().toISOString().substring(0, 7);
      
      const counts = {
        dailyCount: this.dailyCount,
        monthlyCount: this.monthlyCount,
        lastDate: today,
        lastMonth: thisMonth,
        updatedAt: new Date().toISOString()
      };
      
      await fs.writeFile(countsPath, JSON.stringify(counts, null, 2));
    } catch (error) {
      console.error('Failed to save email counts:', error);
    }
  }

  /**
   * Check if email sending is within limits
   */
  private checkLimits(): { allowed: boolean; reason?: string } {
    if (this.dailyCount >= EMAIL_CONFIG.dailyLimit) {
      return { allowed: false, reason: 'Daily email limit exceeded' };
    }
    
    if (this.monthlyCount >= EMAIL_CONFIG.monthlyLimit) {
      return { allowed: false, reason: 'Monthly email limit exceeded' };
    }
    
    return { allowed: true };
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Check limits
      const limitCheck = this.checkLimits();
      if (!limitCheck.allowed) {
        return { success: false, error: limitCheck.reason };
      }

      const verificationUrl = `${EMAIL_CONFIG.baseUrl}/api/reviews/verify?token=${token}&email=${encodeURIComponent(email)}`;
      const expiresIn = '24 hours';

      const templateData = { name, verificationUrl, expiresIn };

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.fromAddress,
        to: email,
        replyTo: EMAIL_CONFIG.replyToAddress,
        subject: EMAIL_TEMPLATES.verification.subject,
        html: EMAIL_TEMPLATES.verification.getHtml(templateData),
        text: EMAIL_TEMPLATES.verification.getText(templateData),
        tags: [
          { name: 'category', value: 'review-verification' },
          { name: 'environment', value: process.env.NODE_ENV || 'development' }
        ]
      });

      // Update counts
      this.dailyCount++;
      this.monthlyCount++;
      await this.saveEmailCounts();

      // Log email sending
      await this.logEmailSent('verification', email, result.data?.id);

      return { success: true, messageId: result.data?.id };

    } catch (error) {
      console.error('Failed to send verification email:', error);
      await this.logEmailError('verification', email, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send approval notification email
   */
  async sendApprovalEmail(
    email: string,
    name: string,
    reviewId: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Check limits
      const limitCheck = this.checkLimits();
      if (!limitCheck.allowed) {
        return { success: false, error: limitCheck.reason };
      }

      const reviewUrl = `${EMAIL_CONFIG.baseUrl}/testimonials#review-${reviewId}`;
      const templateData = { name, reviewUrl };

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.fromAddress,
        to: email,
        replyTo: EMAIL_CONFIG.replyToAddress,
        subject: EMAIL_TEMPLATES.approved.subject,
        html: EMAIL_TEMPLATES.approved.getHtml(templateData),
        text: EMAIL_TEMPLATES.approved.getText(templateData),
        tags: [
          { name: 'category', value: 'review-approved' },
          { name: 'environment', value: process.env.NODE_ENV || 'development' }
        ]
      });

      // Update counts
      this.dailyCount++;
      this.monthlyCount++;
      await this.saveEmailCounts();

      // Log email sending
      await this.logEmailSent('approval', email, result.data?.id);

      return { success: true, messageId: result.data?.id };

    } catch (error) {
      console.error('Failed to send approval email:', error);
      await this.logEmailError('approval', email, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(
    review: Review
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const adminEmail = process.env.REVIEW_ADMIN_EMAIL || EMAIL_CONFIG.replyToAddress;
      
      // Check limits
      const limitCheck = this.checkLimits();
      if (!limitCheck.allowed) {
        console.warn('Admin notification skipped due to email limits');
        return { success: false, error: limitCheck.reason };
      }

      const adminUrl = `${EMAIL_CONFIG.baseUrl}/admin/reviews?id=${review.id}`;
      const templateData = {
        reviewerName: review.reviewer.name,
        organization: review.reviewer.organization || 'Not specified',
        rating: review.content.rating,
        adminUrl
      };

      const result = await resend.emails.send({
        from: EMAIL_CONFIG.fromAddress,
        to: adminEmail,
        subject: EMAIL_TEMPLATES.adminNotification.subject,
        html: EMAIL_TEMPLATES.adminNotification.getHtml(templateData),
        tags: [
          { name: 'category', value: 'admin-notification' },
          { name: 'environment', value: process.env.NODE_ENV || 'development' }
        ]
      });

      // Update counts
      this.dailyCount++;
      this.monthlyCount++;
      await this.saveEmailCounts();

      // Log email sending
      await this.logEmailSent('admin-notification', adminEmail, result.data?.id);

      return { success: true, messageId: result.data?.id };

    } catch (error) {
      console.error('Failed to send admin notification:', error);
      await this.logEmailError('admin-notification', 'admin', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Log successful email sending
   */
  private async logEmailSent(type: string, recipient: string, messageId?: string): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      await fs.mkdir(auditDir, { recursive: true });
      
      const logPath = path.join(auditDir, 'emails.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        type,
        recipient: recipient.toLowerCase(),
        messageId,
        status: 'sent',
        dailyCount: this.dailyCount,
        monthlyCount: this.monthlyCount
      };
      
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      console.error('Failed to log email sending:', error);
    }
  }

  /**
   * Log email sending errors
   */
  private async logEmailError(type: string, recipient: string, error: any): Promise<void> {
    try {
      const { promises: fs } = await import('fs');
      const path = await import('path');
      
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      await fs.mkdir(auditDir, { recursive: true });
      
      const logPath = path.join(auditDir, 'email-errors.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        type,
        recipient: recipient.toLowerCase(),
        error: error instanceof Error ? error.message : String(error),
        status: 'failed'
      };
      
      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (logError) {
      console.error('Failed to log email error:', logError);
    }
  }

  /**
   * Get email statistics
   */
  async getEmailStats(): Promise<{
    dailyCount: number;
    monthlyCount: number;
    dailyLimit: number;
    monthlyLimit: number;
    dailyRemaining: number;
    monthlyRemaining: number;
  }> {
    await this.loadEmailCounts();
    
    return {
      dailyCount: this.dailyCount,
      monthlyCount: this.monthlyCount,
      dailyLimit: EMAIL_CONFIG.dailyLimit,
      monthlyLimit: EMAIL_CONFIG.monthlyLimit,
      dailyRemaining: Math.max(0, EMAIL_CONFIG.dailyLimit - this.dailyCount),
      monthlyRemaining: Math.max(0, EMAIL_CONFIG.monthlyLimit - this.monthlyCount)
    };
  }
}

/**
 * Convenience functions for easy usage
 */
export const emailService = EmailService.getInstance();

export async function sendVerificationEmail(email: string, name: string, token: string) {
  return emailService.sendVerificationEmail(email, name, token);
}

export async function sendApprovalEmail(email: string, name: string, reviewId: string) {
  return emailService.sendApprovalEmail(email, name, reviewId);
}

export async function sendAdminNotification(review: Review) {
  return emailService.sendAdminNotification(review);
}

export async function getEmailStats() {
  return emailService.getEmailStats();
}
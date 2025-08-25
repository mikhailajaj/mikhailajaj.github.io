/**
 * Verification Workflow Management
 * 
 * Orchestrates the complete verification process from submission to approval
 */

import { promises as fs } from 'fs';
import path from 'path';
import { createVerificationToken, validateToken, markTokenAsUsed } from '@/lib/utils/tokens';
import { sendVerificationEmail, sendApprovalEmail, sendAdminNotification } from '@/lib/services/email';
import type { Review, VerificationToken, ReviewSubmissionData } from '@/lib/types/review';

/**
 * Verification Workflow Configuration
 */
const WORKFLOW_CONFIG = {
  // Timing settings
  verificationExpiry: 24, // hours
  approvalTimeout: 7 * 24, // 7 days in hours
  
  // Notification settings
  sendAdminNotifications: true,
  sendApprovalNotifications: true,
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
  
  // Status tracking
  statusUpdateInterval: 60 * 60 * 1000, // 1 hour
};

/**
 * Workflow Status Types
 */
export type WorkflowStatus = 
  | 'initiated'
  | 'email_sent'
  | 'email_failed'
  | 'verified'
  | 'admin_notified'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'error';

/**
 * Workflow State Interface
 */
export interface WorkflowState {
  reviewId: string;
  email: string;
  status: WorkflowStatus;
  currentStep: string;
  startedAt: string;
  lastUpdated: string;
  attempts: number;
  errors: string[];
  metadata: {
    verificationToken?: string;
    emailMessageId?: string;
    adminNotified?: boolean;
    approvalSent?: boolean;
  };
}

/**
 * Verification Workflow Manager
 */
export class VerificationWorkflow {
  private static instance: VerificationWorkflow;
  private workflowsDir: string;

  private constructor() {
    this.workflowsDir = path.join(process.cwd(), 'data', 'workflows');
    this.ensureWorkflowsDirectory();
  }

  public static getInstance(): VerificationWorkflow {
    if (!VerificationWorkflow.instance) {
      VerificationWorkflow.instance = new VerificationWorkflow();
    }
    return VerificationWorkflow.instance;
  }

  /**
   * Ensure workflows directory exists
   */
  private async ensureWorkflowsDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.workflowsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create workflows directory:', error);
    }
  }

  /**
   * Initiate verification workflow for a new review submission
   */
  async initiateVerification(
    submissionData: ReviewSubmissionData,
    review: Review
  ): Promise<{
    success: boolean;
    workflowId: string;
    verificationToken?: string;
    error?: string;
  }> {
    const workflowId = review.id;
    
    try {
      // Create workflow state
      const workflowState: WorkflowState = {
        reviewId: review.id,
        email: submissionData.email,
        status: 'initiated',
        currentStep: 'creating_token',
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        attempts: 0,
        errors: [],
        metadata: {}
      };

      // Save initial workflow state
      await this.saveWorkflowState(workflowId, workflowState);

      // Create verification token
      const tokenResult = await createVerificationToken(
        submissionData.email,
        review.id,
        WORKFLOW_CONFIG.verificationExpiry
      );

      workflowState.metadata.verificationToken = tokenResult.token;
      workflowState.currentStep = 'sending_email';
      await this.updateWorkflowState(workflowId, workflowState);

      // Send verification email
      const emailResult = await sendVerificationEmail(
        submissionData.email,
        submissionData.name,
        tokenResult.token
      );

      if (emailResult.success) {
        workflowState.status = 'email_sent';
        workflowState.currentStep = 'awaiting_verification';
        workflowState.metadata.emailMessageId = emailResult.messageId;
        workflowState.lastUpdated = new Date().toISOString();
        
        await this.updateWorkflowState(workflowId, workflowState);
        
        // Log successful initiation
        await this.logWorkflowEvent(workflowId, 'verification_initiated', {
          email: submissionData.email,
          token: tokenResult.token.substring(0, 8) + '...',
          messageId: emailResult.messageId
        });

        return {
          success: true,
          workflowId,
          verificationToken: tokenResult.token
        };
      } else {
        workflowState.status = 'email_failed';
        workflowState.currentStep = 'error';
        workflowState.errors.push(emailResult.error || 'Email sending failed');
        workflowState.lastUpdated = new Date().toISOString();
        
        await this.updateWorkflowState(workflowId, workflowState);
        
        return {
          success: false,
          workflowId,
          error: emailResult.error || 'Failed to send verification email'
        };
      }

    } catch (error) {
      console.error('Verification workflow initiation failed:', error);
      
      // Update workflow state with error
      try {
        const workflowState = await this.getWorkflowState(workflowId);
        if (workflowState) {
          workflowState.status = 'error';
          workflowState.currentStep = 'error';
          workflowState.errors.push(error instanceof Error ? error.message : 'Unknown error');
          workflowState.lastUpdated = new Date().toISOString();
          await this.updateWorkflowState(workflowId, workflowState);
        }
      } catch {
        // Ignore workflow update errors
      }

      return {
        success: false,
        workflowId,
        error: error instanceof Error ? error.message : 'Workflow initiation failed'
      };
    }
  }

  /**
   * Process email verification
   */
  async processVerification(
    token: string
  ): Promise<{
    success: boolean;
    reviewId?: string;
    workflowId?: string;
    error?: string;
  }> {
    try {
      // Validate token
      const tokenValidation = await validateToken(token);
      
      if (!tokenValidation.valid || !tokenValidation.tokenData) {
        return {
          success: false,
          error: tokenValidation.error || 'Invalid token'
        };
      }

      const reviewId = tokenValidation.tokenData.reviewId;
      const workflowState = await this.getWorkflowState(reviewId);

      if (!workflowState) {
        return {
          success: false,
          error: 'Workflow not found'
        };
      }

      // Mark token as used
      await markTokenAsUsed(token);

      // Update workflow state
      workflowState.status = 'verified';
      workflowState.currentStep = 'awaiting_approval';
      workflowState.lastUpdated = new Date().toISOString();
      await this.updateWorkflowState(reviewId, workflowState);

      // Send admin notification if enabled
      if (WORKFLOW_CONFIG.sendAdminNotifications) {
        await this.notifyAdmin(reviewId);
      }

      // Log verification
      await this.logWorkflowEvent(reviewId, 'email_verified', {
        email: tokenValidation.tokenData.email,
        token: token.substring(0, 8) + '...'
      });

      return {
        success: true,
        reviewId,
        workflowId: reviewId
      };

    } catch (error) {
      console.error('Verification processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  /**
   * Process admin approval
   */
  async processApproval(
    reviewId: string,
    approved: boolean,
    notes?: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const workflowState = await this.getWorkflowState(reviewId);
      
      if (!workflowState) {
        return {
          success: false,
          error: 'Workflow not found'
        };
      }

      if (approved) {
        workflowState.status = 'approved';
        workflowState.currentStep = 'completed';
        
        // Send approval notification if enabled
        if (WORKFLOW_CONFIG.sendApprovalNotifications) {
          await this.sendApprovalNotification(reviewId, workflowState.email);
        }
        
        await this.logWorkflowEvent(reviewId, 'review_approved', { notes });
      } else {
        workflowState.status = 'rejected';
        workflowState.currentStep = 'completed';
        
        await this.logWorkflowEvent(reviewId, 'review_rejected', { notes });
      }

      workflowState.lastUpdated = new Date().toISOString();
      await this.updateWorkflowState(reviewId, workflowState);

      return { success: true };

    } catch (error) {
      console.error('Approval processing failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Approval processing failed'
      };
    }
  }

  /**
   * Send admin notification
   */
  private async notifyAdmin(reviewId: string): Promise<void> {
    try {
      // Load review data
      const verifiedDir = path.join(process.cwd(), 'data', 'reviews', 'verified');
      const reviewPath = path.join(verifiedDir, `${reviewId}.json`);
      const reviewData = JSON.parse(await fs.readFile(reviewPath, 'utf-8'));

      // Send notification
      const result = await sendAdminNotification(reviewData);
      
      // Update workflow state
      const workflowState = await this.getWorkflowState(reviewId);
      if (workflowState) {
        workflowState.metadata.adminNotified = result.success;
        workflowState.currentStep = 'admin_notified';
        if (result.success) {
          workflowState.status = 'admin_notified';
        }
        await this.updateWorkflowState(reviewId, workflowState);
      }

      await this.logWorkflowEvent(reviewId, 'admin_notified', {
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });

    } catch (error) {
      console.error('Admin notification failed:', error);
      await this.logWorkflowEvent(reviewId, 'admin_notification_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Send approval notification
   */
  private async sendApprovalNotification(reviewId: string, email: string): Promise<void> {
    try {
      // Load review data to get reviewer name
      const approvedDir = path.join(process.cwd(), 'data', 'reviews', 'approved');
      const reviewPath = path.join(approvedDir, `${reviewId}.json`);
      const reviewData = JSON.parse(await fs.readFile(reviewPath, 'utf-8'));

      // Send approval email
      const result = await sendApprovalEmail(
        email,
        reviewData.reviewer.name,
        reviewId
      );

      // Update workflow state
      const workflowState = await this.getWorkflowState(reviewId);
      if (workflowState) {
        workflowState.metadata.approvalSent = result.success;
        await this.updateWorkflowState(reviewId, workflowState);
      }

      await this.logWorkflowEvent(reviewId, 'approval_notification_sent', {
        success: result.success,
        messageId: result.messageId,
        error: result.error
      });

    } catch (error) {
      console.error('Approval notification failed:', error);
      await this.logWorkflowEvent(reviewId, 'approval_notification_failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get workflow state
   */
  async getWorkflowState(workflowId: string): Promise<WorkflowState | null> {
    try {
      const workflowPath = path.join(this.workflowsDir, `${workflowId}.json`);
      const workflowData = await fs.readFile(workflowPath, 'utf-8');
      return JSON.parse(workflowData);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return null;
      }
      console.error('Failed to get workflow state:', error);
      return null;
    }
  }

  /**
   * Save workflow state
   */
  private async saveWorkflowState(workflowId: string, state: WorkflowState): Promise<void> {
    try {
      await this.ensureWorkflowsDirectory();
      const workflowPath = path.join(this.workflowsDir, `${workflowId}.json`);
      await fs.writeFile(workflowPath, JSON.stringify(state, null, 2));
    } catch (error) {
      console.error('Failed to save workflow state:', error);
      throw error;
    }
  }

  /**
   * Update workflow state
   */
  private async updateWorkflowState(workflowId: string, updates: Partial<WorkflowState>): Promise<void> {
    try {
      const currentState = await this.getWorkflowState(workflowId);
      if (!currentState) {
        throw new Error('Workflow state not found');
      }

      const updatedState = { ...currentState, ...updates };
      updatedState.lastUpdated = new Date().toISOString();
      
      await this.saveWorkflowState(workflowId, updatedState);
    } catch (error) {
      console.error('Failed to update workflow state:', error);
      throw error;
    }
  }

  /**
   * Get workflow statistics
   */
  async getWorkflowStats(): Promise<{
    total: number;
    byStatus: Record<WorkflowStatus, number>;
    averageCompletionTime: number;
    successRate: number;
  }> {
    const stats = {
      total: 0,
      byStatus: {} as Record<WorkflowStatus, number>,
      averageCompletionTime: 0,
      successRate: 0
    };

    try {
      const files = await fs.readdir(this.workflowsDir);
      const completionTimes: number[] = [];
      let successCount = 0;

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
          const workflowData = JSON.parse(
            await fs.readFile(path.join(this.workflowsDir, file), 'utf-8')
          );
          
          stats.total++;
          
          const status = workflowData.status as WorkflowStatus;
          stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
          
          // Calculate completion time for completed workflows
          if (status === 'approved' || status === 'rejected') {
            const startTime = new Date(workflowData.startedAt).getTime();
            const endTime = new Date(workflowData.lastUpdated).getTime();
            completionTimes.push(endTime - startTime);
            
            if (status === 'approved') {
              successCount++;
            }
          }
        } catch {
          // Ignore corrupted files
        }
      }

      // Calculate averages
      if (completionTimes.length > 0) {
        stats.averageCompletionTime = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
      }

      if (stats.total > 0) {
        stats.successRate = successCount / stats.total;
      }

    } catch (error) {
      console.error('Failed to get workflow stats:', error);
    }

    return stats;
  }

  /**
   * Clean up old workflows
   */
  async cleanupOldWorkflows(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<number> {
    let cleaned = 0;

    try {
      const files = await fs.readdir(this.workflowsDir);
      const now = new Date().getTime();

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        try {
          const workflowPath = path.join(this.workflowsDir, file);
          const workflowData = JSON.parse(await fs.readFile(workflowPath, 'utf-8'));
          
          const startTime = new Date(workflowData.startedAt).getTime();
          const age = now - startTime;
          
          // Remove old completed or failed workflows
          if (age > maxAge && ['approved', 'rejected', 'expired', 'error'].includes(workflowData.status)) {
            await fs.unlink(workflowPath);
            cleaned++;
          }
        } catch {
          // Remove corrupted files
          try {
            await fs.unlink(path.join(this.workflowsDir, file));
            cleaned++;
          } catch {
            // Ignore deletion errors
          }
        }
      }
    } catch (error) {
      console.error('Workflow cleanup failed:', error);
    }

    return cleaned;
  }

  /**
   * Log workflow events
   */
  private async logWorkflowEvent(
    workflowId: string,
    event: string,
    data?: any
  ): Promise<void> {
    try {
      const auditDir = path.join(process.cwd(), 'data', 'audit');
      await fs.mkdir(auditDir, { recursive: true });

      const logPath = path.join(auditDir, 'workflows.log');
      const logEntry = {
        timestamp: new Date().toISOString(),
        workflowId,
        event,
        data
      };

      const logLine = JSON.stringify(logEntry) + '\n';
      await fs.appendFile(logPath, logLine);
    } catch (error) {
      console.error('Failed to log workflow event:', error);
    }
  }
}

/**
 * Convenience functions for easy usage
 */
export const verificationWorkflow = VerificationWorkflow.getInstance();

export async function initiateVerification(submissionData: ReviewSubmissionData, review: Review) {
  return verificationWorkflow.initiateVerification(submissionData, review);
}

export async function processVerification(token: string) {
  return verificationWorkflow.processVerification(token);
}

export async function processApproval(reviewId: string, approved: boolean, notes?: string) {
  return verificationWorkflow.processApproval(reviewId, approved, notes);
}

export async function getWorkflowState(workflowId: string) {
  return verificationWorkflow.getWorkflowState(workflowId);
}

export async function getWorkflowStats() {
  return verificationWorkflow.getWorkflowStats();
}

export async function cleanupOldWorkflows(maxAge?: number) {
  return verificationWorkflow.cleanupOldWorkflows(maxAge);
}
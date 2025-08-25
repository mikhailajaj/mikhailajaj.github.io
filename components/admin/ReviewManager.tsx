/**
 * ReviewManager Component
 * 
 * Handles approve/reject workflow with existing API, reason fields, and audit trail
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { RatingDisplay } from '@/components/reviews/RatingDisplay';
import type { Review, AdminActionLog, ApiResponse } from '@/lib/types/review';
import { cn } from '@/lib/utils';
import { 
  Check, 
  X, 
  Star, 
  Clock, 
  User, 
  Mail, 
  Building, 
  Calendar,
  MessageSquare,
  History,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ReviewManagerProps {
  /** Review to manage */
  review?: Review;
  /** Callback when review action is completed */
  onActionComplete?: (action: 'approve' | 'reject', reviewId: string) => void;
  /** Callback when review is closed */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
}

interface ReviewManagerState {
  isSubmitting: boolean;
  actionType?: 'approve' | 'reject';
  notes: string;
  rejectionReason: string;
  featured: boolean;
  displayOrder?: number;
  error?: string;
  success?: string;
  auditTrail: AdminActionLog[];
  loadingAudit: boolean;
}

/**
 * ReviewManager Component
 * 
 * Provides detailed review management interface for admin approval/rejection
 */
export const ReviewManager: React.FC<ReviewManagerProps> = ({
  review,
  onActionComplete,
  onClose,
  className
}) => {
  const [state, setState] = useState<ReviewManagerState>({
    isSubmitting: false,
    notes: '',
    rejectionReason: '',
    featured: review?.admin.featured || false,
    displayOrder: review?.admin.displayOrder,
    auditTrail: [],
    loadingAudit: false
  });

  // Load audit trail when review changes
  useEffect(() => {
    if (review) {
      loadAuditTrail(review.id);
      setState(prev => ({
        ...prev,
        featured: review.admin.featured || false,
        displayOrder: review.admin.displayOrder,
        notes: review.admin.notes || ''
      }));
    }
  }, [review]);

  /**
   * Load audit trail for the review
   */
  const loadAuditTrail = async (reviewId: string) => {
    setState(prev => ({ ...prev, loadingAudit: true }));
    
    try {
      const response = await fetch(`/api/reviews/admin/audit?reviewId=${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
        }
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setState(prev => ({
          ...prev,
          auditTrail: data.data.auditTrail || [],
          loadingAudit: false
        }));
      } else {
        setState(prev => ({ ...prev, loadingAudit: false }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, loadingAudit: false }));
    }
  };

  /**
   * Handle review approval
   */
  const handleApprove = async () => {
    if (!review) return;
    
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      actionType: 'approve',
      error: undefined,
      success: undefined
    }));
    
    try {
      const response = await fetch('/api/reviews/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
        },
        body: JSON.stringify({
          reviewId: review.id,
          action: 'approve',
          notes: state.notes,
          featured: state.featured,
          displayOrder: state.displayOrder
        })
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          success: 'Review approved successfully',
          isSubmitting: false
        }));
        
        // Notify parent component
        onActionComplete?.('approve', review.id);
        
        // Auto-close after success
        setTimeout(() => {
          onClose?.();
        }, 1500);
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || 'Failed to approve review',
          isSubmitting: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Network error occurred',
        isSubmitting: false
      }));
    }
  };

  /**
   * Handle review rejection
   */
  const handleReject = async () => {
    if (!review || !state.rejectionReason.trim()) {
      setState(prev => ({
        ...prev,
        error: 'Rejection reason is required'
      }));
      return;
    }
    
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      actionType: 'reject',
      error: undefined,
      success: undefined
    }));
    
    try {
      const response = await fetch('/api/reviews/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
        },
        body: JSON.stringify({
          reviewId: review.id,
          action: 'reject',
          notes: state.rejectionReason
        })
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          success: 'Review rejected successfully',
          isSubmitting: false
        }));
        
        // Notify parent component
        onActionComplete?.('reject', review.id);
        
        // Auto-close after success
        setTimeout(() => {
          onClose?.();
        }, 1500);
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || 'Failed to reject review',
          isSubmitting: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Network error occurred',
        isSubmitting: false
      }));
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  /**
   * Get action icon
   */
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approve':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reject':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'feature':
        return <Star className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  if (!review) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Select a review to manage</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Review Management
          </CardTitle>
          
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close review manager">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Messages */}
        {state.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {state.success}
          </div>
        )}

        {/* Review Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Review Details</h3>
          
          {/* Reviewer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{review.reviewer.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{review.reviewer.email}</span>
              </div>
              
              {review.reviewer.organization && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{review.reviewer.organization}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Submitted: {formatDate(review.metadata.submittedAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <RatingDisplay rating={review.content.rating} size="sm" />
              </div>
              
              <Badge variant="secondary">
                {review.reviewer.relationship}
              </Badge>
            </div>
          </div>

          {/* Review Content */}
          <ReviewCard 
            review={review} 
            variant="default"
            showActions={false}
            className="border-2"
          />
        </div>

        {/* Management Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Management Actions</h3>
          
          {/* Approval Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium text-green-700">Approve Review</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Admin Notes (Optional)
                </label>
                <Textarea
                  value={state.notes}
                  onChange={(e) => setState(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add internal notes about this review..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={state.featured}
                    onChange={(e) => setState(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Feature this review</span>
                </label>
                
                {state.featured && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Display Order:</label>
                    <Input
                      type="number"
                      value={state.displayOrder || ''}
                      onChange={(e) => setState(prev => ({ 
                        ...prev, 
                        displayOrder: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="1"
                      className="w-20"
                      min="1"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={handleApprove}
              disabled={state.isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {state.isSubmitting && state.actionType === 'approve' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Approving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approve Review
                </>
              )}
            </Button>
          </div>

          {/* Rejection Section */}
          <div className="space-y-4 p-4 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-700">Reject Review</h4>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-red-700">
                Rejection Reason (Required)
              </label>
              <Textarea
                value={state.rejectionReason}
                onChange={(e) => setState(prev => ({ ...prev, rejectionReason: e.target.value }))}
                placeholder="Explain why this review is being rejected..."
                rows={3}
                className="border-red-200 focus:border-red-300"
              />
            </div>
            
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={state.isSubmitting || !state.rejectionReason.trim()}
            >
              {state.isSubmitting && state.actionType === 'reject' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Reject Review
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Audit Trail */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Audit Trail
          </h3>
          
          {state.loadingAudit ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : state.auditTrail.length === 0 ? (
            <p className="text-muted-foreground text-sm">No audit trail available</p>
          ) : (
            <div className="space-y-2">
              {state.auditTrail.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  {getActionIcon(entry.action)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{entry.action}</span>
                      <span className="text-muted-foreground">by {entry.performedBy}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{formatDate(entry.performedAt)}</span>
                    </div>
                    
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewManager;
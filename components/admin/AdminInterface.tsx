/**
 * AdminInterface Component
 * 
 * Main admin dashboard that integrates all admin components
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Using custom tab implementation since Tabs component is not available
import { PendingReviews } from './PendingReviews';
import { ReviewManager } from './ReviewManager';
import { Analytics } from './Analytics';
import type { Review, ReviewStats, ApiResponse } from '@/lib/types/review';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Clock, 
  BarChart3, 
  Settings, 
  Bell,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AdminInterfaceProps {
  /** Initial data for the admin interface */
  initialData?: {
    pendingCount: number;
    recentActivity: any[];
    stats: ReviewStats;
  };
  /** Admin permissions */
  permissions?: {
    canApprove: boolean;
    canReject: boolean;
    canViewAnalytics: boolean;
    canExport: boolean;
  };
  /** Additional CSS classes */
  className?: string;
}

interface AdminInterfaceState {
  selectedReview?: Review;
  activeTab: 'pending' | 'analytics' | 'settings';
  pendingReviews: Review[];
  stats: ReviewStats | null;
  isLoading: boolean;
  error?: string;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>;
}

/**
 * AdminInterface Component
 * 
 * Comprehensive admin dashboard for managing the testimonial review system
 */
export const AdminInterface: React.FC<AdminInterfaceProps> = ({
  initialData,
  permissions = {
    canApprove: true,
    canReject: true,
    canViewAnalytics: true,
    canExport: true
  },
  className
}) => {
  const [state, setState] = useState<AdminInterfaceState>({
    activeTab: 'pending',
    pendingReviews: [],
    stats: initialData?.stats || null,
    isLoading: false,
    notifications: []
  });

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load dashboard data
   */
  const loadDashboardData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      // Load pending reviews and stats in parallel
      const [pendingResponse, statsResponse] = await Promise.all([
        fetch('/api/reviews/admin?status=verified', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
          }
        }),
        fetch('/api/reviews/admin/stats', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
          }
        })
      ]);

      const [pendingData, statsData]: [ApiResponse, ApiResponse] = await Promise.all([
        pendingResponse.json(),
        statsResponse.json()
      ]);

      setState(prev => ({
        ...prev,
        pendingReviews: pendingData.success ? pendingData.data?.reviews || [] : [],
        stats: statsData.success ? statsData.data?.stats || null : null,
        isLoading: false
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load dashboard data',
        isLoading: false
      }));
    }
  };

  /**
   * Handle review selection
   */
  const handleReviewSelect = (review: Review) => {
    setState(prev => ({ ...prev, selectedReview: review }));
  };

  /**
   * Handle review action completion
   */
  const handleActionComplete = (action: 'approve' | 'reject', reviewId: string) => {
    // Add notification
    const notification = {
      id: Date.now().toString(),
      type: action === 'approve' ? 'success' : 'info' as const,
      message: `Review ${action}ed successfully`,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications.slice(0, 4)], // Keep last 5
      selectedReview: undefined // Close review manager
    }));

    // Reload dashboard data
    loadDashboardData();
  };

  /**
   * Handle bulk action
   */
  const handleBulkAction = async (action: 'approve' | 'reject', reviewIds: string[]) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const promises = reviewIds.map(reviewId =>
        fetch('/api/reviews/admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
          },
          body: JSON.stringify({
            reviewId,
            action,
            notes: `Bulk ${action} action`
          })
        })
      );

      await Promise.all(promises);

      // Add notification
      const notification = {
        id: Date.now().toString(),
        type: 'success' as const,
        message: `${reviewIds.length} reviews ${action}ed successfully`,
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        notifications: [notification, ...prev.notifications.slice(0, 4)],
        isLoading: false
      }));

      // Reload data
      loadDashboardData();

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Failed to ${action} selected reviews`,
        isLoading: false
      }));
    }
  };

  /**
   * Dismiss notification
   */
  const dismissNotification = (notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
    }));
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage testimonial reviews and system analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          {state.notifications.length > 0 && (
            <div className="relative">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">
                  {state.notifications.length}
                </Badge>
              </Button>
            </div>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={state.isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", state.isLoading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {state.notifications.length > 0 && (
        <div className="space-y-2">
          {state.notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                notification.type === 'success' && "bg-green-50 border-green-200 text-green-800",
                notification.type === 'error' && "bg-red-50 border-red-200 text-red-800",
                notification.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800"
              )}
            >
              <span className="text-sm">{notification.message}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {state.error}
        </div>
      )}

      {/* Quick Stats */}
      {state.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{state.stats.pending}</p>
                </div>
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{state.stats.approved}</p>
                </div>
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold text-blue-600">{state.stats.averageRating.toFixed(1)}</p>
                </div>
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{state.stats.total}</p>
                </div>
                <Settings className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Custom Tabs */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setState(prev => ({ ...prev, activeTab: 'pending' }))}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
                state.activeTab === 'pending' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
              Pending Reviews
              {state.pendingReviews.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {state.pendingReviews.length}
                </Badge>
              )}
            </button>
            
            {permissions.canViewAnalytics && (
              <button
                onClick={() => setState(prev => ({ ...prev, activeTab: 'analytics' }))}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
                  state.activeTab === 'analytics' 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
            )}
          </div>

          {/* Tab Content */}
          {state.activeTab === 'pending' && (
            <PendingReviews
              initialReviews={state.pendingReviews}
              onReviewSelect={handleReviewSelect}
              onBulkAction={permissions.canApprove || permissions.canReject ? handleBulkAction : undefined}
              loading={state.isLoading}
            />
          )}

          {permissions.canViewAnalytics && state.activeTab === 'analytics' && (
            <Analytics initialStats={state.stats || undefined} />
          )}
        </div>

        {/* Right Column - Review Manager */}
        <div className="lg:col-span-1">
          <ReviewManager
            review={state.selectedReview}
            onActionComplete={handleActionComplete}
            onClose={() => setState(prev => ({ ...prev, selectedReview: undefined }))}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminInterface;
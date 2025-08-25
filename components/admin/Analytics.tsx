/**
 * Analytics Component
 * 
 * Displays review statistics, approval rates, demographics, and trends with export functionality
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ReviewStats, Review, ReviewerRelationship, ApiResponse } from '@/lib/types/review';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Star, 
  Clock, 
  Download,
  Calendar,
  PieChart,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface AnalyticsProps {
  /** Initial statistics data */
  initialStats?: ReviewStats;
  /** Additional CSS classes */
  className?: string;
}

interface AnalyticsState {
  stats: ReviewStats | null;
  isLoading: boolean;
  error?: string;
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  selectedMetric: 'submissions' | 'approvals' | 'ratings' | 'relationships';
}

interface ChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

/**
 * Analytics Component
 * 
 * Provides comprehensive analytics dashboard for review system
 */
export const Analytics: React.FC<AnalyticsProps> = ({
  initialStats,
  className
}) => {
  const [state, setState] = useState<AnalyticsState>({
    stats: initialStats || null,
    isLoading: !initialStats,
    timeRange: '30d',
    selectedMetric: 'submissions'
  });

  // Fetch analytics data on mount and when time range changes
  useEffect(() => {
    if (!initialStats) {
      fetchAnalytics();
    }
  }, [state.timeRange]);

  /**
   * Fetch analytics data from API
   */
  const fetchAnalytics = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const response = await fetch(`/api/reviews/admin/analytics?timeRange=${state.timeRange}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
        }
      });
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setState(prev => ({
          ...prev,
          stats: data.data.stats,
          isLoading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: data.error || 'Failed to fetch analytics',
          isLoading: false
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Network error occurred',
        isLoading: false
      }));
    }
  };

  /**
   * Calculate approval rate
   */
  const approvalRate = useMemo(() => {
    if (!state.stats) return 0;
    const total = state.stats.approved + state.stats.rejected;
    return total > 0 ? (state.stats.approved / total) * 100 : 0;
  }, [state.stats]);

  /**
   * Get rating distribution chart data
   */
  const ratingChartData = useMemo((): ChartData[] => {
    if (!state.stats) return [];
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const total = Object.values(state.stats.ratingDistribution).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(state.stats.ratingDistribution)
      .map(([rating, count], index) => ({
        label: `${rating} Star${rating !== '1' ? 's' : ''}`,
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: colors[index] || '#6b7280'
      }))
      .reverse(); // Show 5 stars first
  }, [state.stats]);

  /**
   * Get relationship distribution chart data
   */
  const relationshipChartData = useMemo((): ChartData[] => {
    if (!state.stats) return [];
    
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
    const total = Object.values(state.stats.relationshipBreakdown).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(state.stats.relationshipBreakdown)
      .map(([relationship, count], index) => ({
        label: relationship.charAt(0).toUpperCase() + relationship.slice(1),
        value: count,
        percentage: total > 0 ? (count / total) * 100 : 0,
        color: colors[index] || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value); // Sort by count descending
  }, [state.stats]);

  /**
   * Export analytics data
   */
  const exportData = async (format: 'csv' | 'json') => {
    if (!state.stats) return;
    
    try {
      const response = await fetch(`/api/reviews/admin/export?format=${format}&timeRange=${state.timeRange}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN || 'admin-dev-token'}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `review-analytics-${state.timeRange}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  /**
   * Simple bar chart component
   */
  const SimpleBarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">{title}</h4>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-right">{item.label}</div>
            <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
            <div className="w-12 text-sm text-muted-foreground text-right">
              {item.value}
            </div>
            <div className="w-12 text-xs text-muted-foreground text-right">
              {item.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Review Analytics
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={state.timeRange}
            onChange={(e) => setState(prev => ({ 
              ...prev, 
              timeRange: e.target.value as typeof state.timeRange 
            }))}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="all">All time</option>
          </select>
          
          {/* Export Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('csv')}
            disabled={!state.stats}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('json')}
            disabled={!state.stats}
          >
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {state.error}
        </div>
      )}

      {/* Loading State */}
      {state.isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" role="status" aria-label="Loading"></div>
        </div>
      )}

      {/* Analytics Dashboard */}
      {!state.isLoading && state.stats && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{state.stats.total}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{state.stats.approved}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{state.stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                    <p className="text-2xl font-bold text-blue-600">{approvalRate.toFixed(1)}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Average Rating</span>
                    <span className="font-semibold">{state.stats.averageRating.toFixed(1)} / 5.0</span>
                  </div>
                  
                  <SimpleBarChart 
                    data={ratingChartData} 
                    title="Reviews by Rating"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Relationship Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Reviewer Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={relationshipChartData} 
                  title="Reviews by Relationship"
                />
              </CardContent>
            </Card>
          </div>

          {/* Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Review Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{state.stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{state.stats.approved}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{state.stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{state.stats.rejected}</div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {state.stats.approved > 0 ? Math.round((state.stats.approved / state.stats.total) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Submissions Trend */}
          {state.stats.monthlySubmissions && state.stats.monthlySubmissions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Submission Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.stats.monthlySubmissions.map((month, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-right">{month.month}</div>
                      <div className="flex-1 bg-muted rounded-full h-2 relative overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max((month.count / Math.max(...state.stats!.monthlySubmissions.map(m => m.count))) * 100, 5)}%`
                          }}
                        />
                      </div>
                      <div className="w-12 text-sm text-muted-foreground text-right">
                        {month.count}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* No Data State */}
      {!state.isLoading && !state.stats && !state.error && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No analytics data available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
/**
 * Error Analytics Dashboard
 * 
 * Comprehensive dashboard for error tracking, analytics, and insights.
 * Provides real-time monitoring and management capabilities.
 * 
 * @fileoverview Error analytics dashboard component
 */

"use client";

// 1. React Imports
import React, { useState, useEffect } from 'react';

// 2. External Libraries
import { 
  FaExclamationTriangle, 
  FaChartLine, 
  FaLightbulb, 
  FaUsers, 
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaSync
} from 'react-icons/fa';

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { Card } from '@/components/ui/base/Card';
import { Button } from '@/components/ui/base/Button';
import { errorTracking, type ErrorAnalytics, type ErrorInsight, type ErrorTrend } from '@/lib/monitoring/ErrorTracking';
import { errorReporting } from '@/lib/services/errorReporting';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline below)

// 6. Stylesheets
// (None in this component)

/**
 * Error Analytics Dashboard Component
 */
export const ErrorAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<ErrorAnalytics | null>(null);
  const [insights, setInsights] = useState<ErrorInsight[]>([]);
  const [trends, setTrends] = useState<ErrorTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load data
  useEffect(() => {
    loadData();
    
    // Set up auto-refresh
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    
    // Listen for real-time updates
    const handleInsightGenerated = (event: CustomEvent) => {
      setInsights(prev => [event.detail, ...prev]);
    };

    window.addEventListener('error-insight-generated', handleInsightGenerated as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('error-insight-generated', handleInsightGenerated as EventListener);
    };
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Initialize if needed
      errorTracking.initialize();
      
      // Load analytics
      const currentAnalytics = errorTracking.getAnalytics();
      setAnalytics(currentAnalytics);
      
      // Load insights
      const currentInsights = errorTracking.getInsights();
      setInsights(currentInsights);
      
      // Load trends (last 24 hours)
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const currentTrends = errorTracking.getTrends({ start: yesterday, end: now });
      setTrends(currentTrends);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load error analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const data = errorTracking.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResolveError = (fingerprint: string) => {
    errorTracking.resolveError(fingerprint);
    loadData(); // Refresh data
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spike': return <FaExclamationTriangle className="text-red-500" />;
      case 'pattern': return <FaChartLine className="text-blue-500" />;
      case 'regression': return <FaTimesCircle className="text-orange-500" />;
      case 'improvement': return <FaCheckCircle className="text-green-500" />;
      default: return <FaLightbulb className="text-yellow-500" />;
    }
  };

  if (isLoading && !analytics) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading error analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Error Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time error monitoring and insights
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
          >
            <FaDownload className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Errors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.totalErrors.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FaChartLine className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {(analytics.errorRate * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FaUsers className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Affected Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.impact.affectedUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FaClock className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analytics.resolution.averageResolutionTime}h
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Errors */}
        {analytics && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Top Errors
            </h2>
            <div className="space-y-3">
              {analytics.topErrors.slice(0, 5).map((error, index) => (
                <div
                  key={error.fingerprint}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {error.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                      <span className="text-sm text-gray-500">
                        {error.count} occurrences
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleResolveError(error.fingerprint)}
                    size="sm"
                    variant="outline"
                  >
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Insights */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recent Insights
          </h2>
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight) => (
              <div
                key={insight.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-shrink-0 mt-1">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.description}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    💡 {insight.recommendation}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(insight.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {insights.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No insights available yet
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Error Distribution */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Errors by Severity
            </h2>
            <div className="space-y-2">
              {Object.entries(analytics.errorsBySeverity).map(([severity, count]) => (
                <div key={severity} className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Errors by Domain
            </h2>
            <div className="space-y-2">
              {Object.entries(analytics.errorsByDomain).map(([domain, count]) => (
                <div key={domain} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {domain.replace('-', ' ')}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Resolution Status
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600 dark:text-green-400">
                  Resolved
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analytics.resolution.resolved}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600 dark:text-red-400">
                  Unresolved
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {analytics.resolution.unresolved}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ErrorAnalyticsDashboard;
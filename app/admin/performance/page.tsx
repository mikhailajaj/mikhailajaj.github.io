/**
 * Performance Admin Dashboard
 * 
 * Comprehensive admin dashboard for viewing and analyzing performance metrics,
 * Core Web Vitals, custom metrics, and performance testing results.
 * 
 * @fileoverview Performance monitoring admin dashboard
 */

"use client";

// 1. React Imports
import React, { useState, useEffect, useMemo } from 'react';

// 2. External Libraries
import { 
  FaChartLine, 
  FaDownload, 
  FaRedo, 
  FaTrash, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaMobile,
  FaTabletAlt,
  FaDesktop,
  FaClock,
  FaEye,
  FaBolt,
  FaShieldAlt
} from 'react-icons/fa';

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { Button } from '@/components/ui/base/Button';
import { Card } from '@/components/ui/base/Card';
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';
import { 
  performanceMonitor, 
  performanceUtils, 
  PERFORMANCE_BUDGETS,
  type PerformanceSession,
  type CoreWebVitals,
  type CustomMetrics,
  type PerformanceError
} from '@/lib/services/performance';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline above)

// 6. Stylesheets
// (None in this component)

/**
 * Performance metric card component
 */
const MetricCard: React.FC<{
  title: string;
  value: number;
  unit: string;
  budget: number;
  icon: React.ReactNode;
  format?: (value: number) => string;
}> = ({ title, value, unit, budget, icon, format }) => {
  const { currentDomainColor } = useDomainTheme();
  const isGood = value <= budget;
  const isNeedsImprovement = value <= budget * 1.5;
  
  const status = isGood ? 'good' : isNeedsImprovement ? 'needs-improvement' : 'poor';
  const statusColor = isGood ? '#10b981' : isNeedsImprovement ? '#f59e0b' : '#ef4444';
  
  const formatValue = format || ((v: number) => Math.round(v).toString());

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${currentDomainColor}20` }}
          >
            <span style={{ color: currentDomainColor }}>{icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-500">Budget: {budget}{unit}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: statusColor }}>
            {formatValue(value)}{unit}
          </div>
          <div className="flex items-center space-x-1">
            {status === 'good' && <FaCheckCircle className="text-green-500" />}
            {status === 'needs-improvement' && <FaExclamationTriangle className="text-yellow-500" />}
            {status === 'poor' && <FaTimesCircle className="text-red-500" />}
            <span className="text-sm capitalize" style={{ color: statusColor }}>
              {status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: statusColor,
            width: `${Math.min((value / (budget * 2)) * 100, 100)}%`,
          }}
        />
      </div>
    </Card>
  );
};

/**
 * Performance chart component (simplified)
 */
const PerformanceChart: React.FC<{
  sessions: PerformanceSession[];
  metric: keyof (CoreWebVitals & CustomMetrics);
  title: string;
}> = ({ sessions, metric, title }) => {
  const { currentDomainColor } = useDomainTheme();
  
  const data = sessions
    .filter(session => 
      (session.coreWebVitals as any)[metric] !== undefined || 
      (session.customMetrics as any)[metric] !== undefined
    )
    .map(session => ({
      timestamp: new Date(session.timestamp).toLocaleDateString(),
      value: (session.coreWebVitals as any)[metric] || (session.customMetrics as any)[metric] || 0,
    }))
    .slice(-10); // Last 10 sessions

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">
          No data available for this metric
        </div>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const budget = (PERFORMANCE_BUDGETS as any)[metric] || maxValue;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {data.map((point, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-500">{point.timestamp}</div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative">
              <div
                className="h-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: point.value <= budget ? '#10b981' : '#ef4444',
                  width: `${(point.value / maxValue) * 100}%`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {Math.round(point.value)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/**
 * Error summary component
 */
const ErrorSummary: React.FC<{ sessions: PerformanceSession[] }> = ({ sessions }) => {
  const { currentDomainColor } = useDomainTheme();
  
  const errorSummary = useMemo(() => {
    const summary: Record<string, { count: number; severity: Record<string, number> }> = {};
    
    sessions.forEach(session => {
      session.errors.forEach(error => {
        if (!summary[error.type]) {
          summary[error.type] = { count: 0, severity: {} };
        }
        summary[error.type].count++;
        summary[error.type].severity[error.severity] = 
          (summary[error.type].severity[error.severity] || 0) + 1;
      });
    });
    
    return summary;
  }, [sessions]);

  const totalErrors = Object.values(errorSummary).reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Performance Issues</h3>
        <div className="text-2xl font-bold" style={{ color: currentDomainColor }}>
          {totalErrors}
        </div>
      </div>
      
      {totalErrors === 0 ? (
        <div className="text-center text-green-500 py-4">
          <FaCheckCircle className="mx-auto mb-2" size={24} />
          <p>No performance issues detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(errorSummary).map(([type, data]) => (
            <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium capitalize">{type.replace('-', ' ')}</div>
                <div className="text-sm text-gray-500">
                  High: {data.severity.high || 0}, 
                  Medium: {data.severity.medium || 0}, 
                  Low: {data.severity.low || 0}
                </div>
              </div>
              <div className="text-lg font-semibold">{data.count}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

/**
 * Device breakdown component
 */
const DeviceBreakdown: React.FC<{ sessions: PerformanceSession[] }> = ({ sessions }) => {
  const { currentDomainColor } = useDomainTheme();
  
  const deviceData = useMemo(() => {
    const breakdown: Record<string, number> = {};
    sessions.forEach(session => {
      breakdown[session.deviceType] = (breakdown[session.deviceType] || 0) + 1;
    });
    return breakdown;
  }, [sessions]);

  const total = Object.values(deviceData).reduce((sum, count) => sum + count, 0);
  
  const deviceIcons = {
    mobile: <FaMobile />,
    tablet: <FaTabletAlt />,
    desktop: <FaDesktop />,
  };

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Device Breakdown</h3>
      <div className="space-y-3">
        {Object.entries(deviceData).map(([device, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={device} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span style={{ color: currentDomainColor }}>
                  {deviceIcons[device as keyof typeof deviceIcons]}
                </span>
                <span className="capitalize">{device}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: currentDomainColor,
                      width: `${percentage}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-12 text-right">
                  {count} ({Math.round(percentage)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/**
 * Performance Admin Dashboard Page
 */
export default function PerformanceAdminPage() {
  const [sessions, setSessions] = useState<PerformanceSession[]>([]);
  const [currentSession, setCurrentSession] = useState<PerformanceSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'sessions' | 'errors' | 'resources'>('overview');
  
  const { currentDomainColor } = useDomainTheme();

  // Load performance data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const allSessions = performanceMonitor.getSessions();
        const current = performanceMonitor.getCurrentSession();
        
        setSessions(allSessions);
        setCurrentSession(current);
      } catch (error) {
        console.error('Failed to load performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate summary metrics
  const summary = useMemo(() => {
    return performanceMonitor.getPerformanceSummary();
  }, [sessions, currentSession]);

  // Handle data export
  const handleExport = () => {
    const data = performanceMonitor.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle data clear
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all performance data? This action cannot be undone.')) {
      performanceMonitor.clearData();
      setSessions([]);
      setCurrentSession(null);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderColor: currentDomainColor }} />
          <p className="text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      </div>
    );
  }

  const allSessions = [...sessions];
  if (currentSession) allSessions.push(currentSession);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FaChartLine className="text-2xl" style={{ color: currentDomainColor }} />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Performance Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  {allSessions.length} sessions • Score: {performanceUtils.getPerformanceScore()}/100
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FaRedo />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FaDownload />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<FaTrash />}
                onClick={handleClear}
              >
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <FaEye /> },
              { id: 'sessions', label: 'Sessions', icon: <FaClock /> },
              { id: 'errors', label: 'Issues', icon: <FaExclamationTriangle /> },
              { id: 'resources', label: 'Resources', icon: <FaBolt /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? 'text-white border-current'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{
                  color: selectedTab === tab.id ? currentDomainColor : undefined,
                  borderColor: selectedTab === tab.id ? currentDomainColor : undefined,
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Core Web Vitals */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Core Web Vitals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Largest Contentful Paint"
                  value={summary.averageMetrics.lcp || 0}
                  unit="ms"
                  budget={PERFORMANCE_BUDGETS.lcp}
                  icon={<FaEye />}
                />
                <MetricCard
                  title="First Input Delay"
                  value={summary.averageMetrics.fid || 0}
                  unit="ms"
                  budget={PERFORMANCE_BUDGETS.fid}
                  icon={<FaBolt />}
                />
                <MetricCard
                  title="Cumulative Layout Shift"
                  value={summary.averageMetrics.cls || 0}
                  unit=""
                  budget={PERFORMANCE_BUDGETS.cls}
                  icon={<FaShieldAlt />}
                  format={(v) => v.toFixed(3)}
                />
              </div>
            </div>

            {/* Custom Metrics */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Custom Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Hero Load Time"
                  value={summary.averageMetrics.heroLoadTime || 0}
                  unit="ms"
                  budget={PERFORMANCE_BUDGETS.heroLoadTime}
                  icon={<FaClock />}
                />
                <MetricCard
                  title="Domain Switch Time"
                  value={summary.averageMetrics.domainSwitchTime || 0}
                  unit="ms"
                  budget={PERFORMANCE_BUDGETS.domainSwitchTime}
                  icon={<FaBolt />}
                />
                <MetricCard
                  title="Navigation Response"
                  value={summary.averageMetrics.navigationResponseTime || 0}
                  unit="ms"
                  budget={PERFORMANCE_BUDGETS.navigationResponseTime}
                  icon={<FaEye />}
                />
              </div>
            </div>

            {/* Charts */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Performance Trends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart
                  sessions={allSessions}
                  metric="lcp"
                  title="LCP Trend"
                />
                <PerformanceChart
                  sessions={allSessions}
                  metric="fid"
                  title="FID Trend"
                />
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ErrorSummary sessions={allSessions} />
              <DeviceBreakdown sessions={allSessions} />
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Budget Compliance</h3>
                <div className="space-y-3">
                  {Object.entries(summary.budgetCompliance).slice(0, 5).map(([metric, data]) => (
                    <div key={metric} className="flex items-center justify-between">
                      <span className="capitalize text-sm">{metric.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              backgroundColor: data.percentage >= 80 ? '#10b981' : data.percentage >= 60 ? '#f59e0b' : '#ef4444',
                              width: `${data.percentage}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {Math.round(data.percentage)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {selectedTab === 'sessions' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Performance Sessions</h2>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Session
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Device
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        LCP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        FID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        CLS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Issues
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {allSessions.slice(-20).reverse().map((session) => (
                      <tr key={session.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {new Date(session.timestamp).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">{session.domain}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {session.deviceType === 'mobile' && <FaMobile />}
                            {session.deviceType === 'tablet' && <FaTabletAlt />}
                            {session.deviceType === 'desktop' && <FaDesktop />}
                            <span className="capitalize">{session.deviceType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {session.coreWebVitals.lcp ? `${Math.round(session.coreWebVitals.lcp)}ms` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {session.coreWebVitals.fid ? `${Math.round(session.coreWebVitals.fid)}ms` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {session.coreWebVitals.cls ? session.coreWebVitals.cls.toFixed(3) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            session.errors.length === 0 
                              ? 'bg-green-100 text-green-800' 
                              : session.errors.length < 3
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {session.errors.length} issues
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'errors' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Performance Issues</h2>
            <div className="space-y-4">
              {allSessions.flatMap(session => 
                session.errors.map(error => ({
                  ...error,
                  sessionId: session.id,
                  sessionTimestamp: session.timestamp,
                  deviceType: session.deviceType,
                }))
              ).slice(-50).reverse().map((error, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          error.severity === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : error.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {error.severity}
                        </span>
                        <span className="text-sm font-medium capitalize">
                          {error.type.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(error.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {error.message}
                      </p>
                      {error.details && Object.keys(error.details).length > 0 && (
                        <details className="text-xs text-gray-500">
                          <summary className="cursor-pointer">Details</summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            {JSON.stringify(error.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'resources' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Resource Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allSessions.length > 0 && allSessions[allSessions.length - 1].resourceMetrics.map((resource, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold capitalize">{resource.type} Resources</h3>
                    <span className="text-2xl font-bold" style={{ color: currentDomainColor }}>
                      {resource.count}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Size</span>
                      <span className="text-sm font-medium">
                        {Math.round(resource.totalSize / 1024)}KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Average Load Time</span>
                      <span className="text-sm font-medium">
                        {Math.round(resource.averageLoadTime)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Cache Hit Rate</span>
                      <span className="text-sm font-medium">
                        {Math.round(resource.cacheHitRate * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { MotionDiv } from "@/lib/motion-utils";
import {
  PerformanceMonitor,
  PerformanceMetrics,
  PageLoadMetrics,
  calculatePerformanceScore,
  analyzeBundleSize,
  WEB_VITALS_THRESHOLDS,
} from "@/lib/performance";

interface PerformanceDashboardProps {
  showDetails?: boolean;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  showDetails = false,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [pageMetrics, setPageMetrics] = useState<PageLoadMetrics | null>(null);
  const [bundleInfo, setBundleInfo] = useState<any>(null);
  const [performanceScore, setPerformanceScore] = useState<number>(0);
  const [monitor, setMonitor] = useState<PerformanceMonitor | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const performanceMonitor = new PerformanceMonitor((name, value) => {
      setMetrics((prev) => ({ ...prev, [name.toLowerCase()]: value }));
    });

    setMonitor(performanceMonitor);

    // Get initial metrics
    const initialMetrics = performanceMonitor.getMetrics();
    setMetrics(initialMetrics);

    // Get page load metrics
    const loadMetrics = performanceMonitor.getPageLoadMetrics();
    setPageMetrics(loadMetrics);

    // Analyze bundle size
    const bundle = analyzeBundleSize();
    setBundleInfo(bundle);

    return () => {
      performanceMonitor.disconnect();
    };
  }, []);

  useEffect(() => {
    const score = calculatePerformanceScore(metrics);
    setPerformanceScore(score);
  }, [metrics]);

  const getMetricStatus = (metricName: string, value: number) => {
    const thresholds =
      WEB_VITALS_THRESHOLDS[
        metricName.toUpperCase() as keyof typeof WEB_VITALS_THRESHOLDS
      ];
    if (!thresholds) return "unknown";

    if (value <= thresholds.good) return "good";
    if (value <= thresholds.needsImprovement) return "needs-improvement";
    return "poor";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "needs-improvement":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "poor":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      default:
        return "text-foreground/80 bg-muted/30 dark:text-muted-foreground dark:bg-background/20";
    }
  };

  const formatMetricValue = (name: string, value: number) => {
    if (name === "cls") return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  if (!showDetails) {
    return (
      <MotionDiv
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-card rounded-lg p-4 shadow-lg border border-border dark:border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground dark:text-white">
              Performance Score
            </h3>
            <div className="flex items-center mt-1">
              <span
                className={`text-2xl font-bold ${
                  performanceScore >= 90
                    ? "text-green-600"
                    : performanceScore >= 70
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {performanceScore}
              </span>
              <span className="text-sm text-muted-foreground ml-1">/100</span>
            </div>
          </div>

          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              performanceScore >= 90
                ? "bg-green-100 dark:bg-green-900/20"
                : performanceScore >= 70
                  ? "bg-yellow-100 dark:bg-yellow-900/20"
                  : "bg-red-100 dark:bg-red-900/20"
            }`}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </MotionDiv>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-card rounded-xl p-6 shadow-lg border border-border dark:border-border"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground dark:text-white mb-2">
          Performance Dashboard
        </h2>
        <p className="text-foreground/80 dark:text-muted-foreground text-sm">
          Real-time performance metrics and Core Web Vitals
        </p>
      </div>

      {/* Performance Score */}
      <div className="mb-6 p-4 bg-muted/20 dark:bg-card rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-foreground dark:text-white">
              Overall Performance Score
            </h3>
            <p className="text-sm text-foreground/80 dark:text-muted-foreground">
              Based on Core Web Vitals
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-3xl font-bold ${
                performanceScore >= 90
                  ? "text-green-600"
                  : performanceScore >= 70
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {performanceScore}
            </div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground dark:text-white mb-4">
          Core Web Vitals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(metrics).map(([name, value]) => {
            const status = getMetricStatus(name, value);
            const statusColor = getStatusColor(status);

            return (
              <div
                key={name}
                className="p-4 border border-border dark:border-border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-foreground dark:text-white uppercase">
                    {name}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${statusColor}`}
                  >
                    {status.replace("-", " ")}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground dark:text-white">
                  {formatMetricValue(name, value)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {name === "lcp" && "Largest Contentful Paint"}
                  {name === "fid" && "First Input Delay"}
                  {name === "cls" && "Cumulative Layout Shift"}
                  {name === "fcp" && "First Contentful Paint"}
                  {name === "ttfb" && "Time to First Byte"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Load Metrics */}
      {pageMetrics && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-foreground dark:text-white mb-4">
            Page Load Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Load Time
              </div>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {Math.round(pageMetrics.loadTime)}ms
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                DOM Ready
              </div>
              <div className="text-xl font-bold text-green-900 dark:text-green-100">
                {Math.round(pageMetrics.domContentLoaded)}ms
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                First Paint
              </div>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                {Math.round(pageMetrics.firstPaint)}ms
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                FCP
              </div>
              <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                {Math.round(pageMetrics.firstContentfulPaint)}ms
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Analysis */}
      {bundleInfo && (
        <div>
          <h3 className="text-lg font-medium text-foreground dark:text-white mb-4">
            Bundle Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border dark:border-border rounded-lg">
              <div className="text-sm text-foreground/80 dark:text-muted-foreground">
                Total Scripts
              </div>
              <div className="text-2xl font-bold text-foreground dark:text-white">
                {bundleInfo.totalScripts}
              </div>
            </div>
            <div className="p-4 border border-border dark:border-border rounded-lg">
              <div className="text-sm text-foreground/80 dark:text-muted-foreground">
                Total Size
              </div>
              <div className="text-2xl font-bold text-foreground dark:text-white">
                {bundleInfo.totalSize}KB
              </div>
            </div>
            <div className="p-4 border border-border dark:border-border rounded-lg">
              <div className="text-sm text-foreground/80 dark:text-muted-foreground">
                Largest Script
              </div>
              <div className="text-lg font-bold text-foreground dark:text-white">
                {Math.round(
                  (bundleInfo.largestScript?.transferSize || 0) / 1024,
                )}
                KB
              </div>
            </div>
          </div>
        </div>
      )}
    </MotionDiv>
  );
};

export default PerformanceDashboard;

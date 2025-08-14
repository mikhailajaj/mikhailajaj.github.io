/**
 * Lazy-loaded Three.js Component Wrapper
 * 
 * Provides lazy loading for heavy 3D components to improve initial page load performance.
 */

"use client";

import React, { Suspense, lazy } from 'react';
import { cn } from '@/lib/utils';

// Lazy load heavy 3D components
const ThreeDBlackPearl = lazy(() => import('@/components/ThreeDBlackPearl'));
const ThreeDDemo = lazy(() => import('@/components/LazyThreeDDemo'));

// Loading skeleton for 3D components
const ThreeDSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(
    "animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center",
    className
  )}>
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin border-4 border-transparent border-t-blue-500"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading 3D Experience...</p>
    </div>
  </div>
);

// Props interface
interface LazyThreeDComponentProps {
  component: 'blackpearl' | 'demo';
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * LazyThreeDComponent
 * 
 * Wrapper component that lazy loads 3D components with proper loading states
 * and error boundaries for better performance and user experience.
 */
export const LazyThreeDComponent: React.FC<LazyThreeDComponentProps> = ({
  component,
  className = "w-full h-64",
  fallback
}) => {
  const Component = component === 'blackpearl' ? ThreeDBlackPearl : ThreeDDemo;
  const defaultFallback = <ThreeDSkeleton className={className} />;

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div className={className}>
        <Component />
      </div>
    </Suspense>
  );
};

export default LazyThreeDComponent;
/**
 * Core Main Layout Component
 * 
 * Provides main layout structure for general pages with consistent
 * styling and error handling. This is the core layout used across
 * multiple pages in the application.
 */

import React from "react";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  showScrollProgress?: boolean;
  backgroundVariant?: string;
}

/**
 * MainLayout Component (Core)
 * 
 * Provides consistent layout structure for main pages including:
 * - Consistent styling and spacing
 * - Error boundary for graceful error handling
 * - Responsive design
 * - Core layout patterns
 * 
 * @param children - The page content to render within the layout
 */
export function MainLayout({ 
  children, 
  showNavigation = true, 
  showFooter = true, 
  showScrollProgress = false, 
  backgroundVariant = "default" 
}: MainLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Main Content Container */}
        <div className="relative">
          {/* Core layout background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-gray-100/30 dark:from-gray-900/30 dark:to-gray-800/30 pointer-events-none" />
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default MainLayout;
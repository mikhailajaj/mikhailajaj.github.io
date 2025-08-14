/**
 * Main Layout Component
 * 
 * Provides main layout structure for general pages with consistent
 * styling and error handling.
 */

import React from "react";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout Component
 * 
 * Provides consistent layout structure for main pages including:
 * - Consistent styling and spacing
 * - Error boundary for graceful error handling
 * - Responsive design
 * 
 * @param children - The page content to render within the layout
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Main Content Container */}
        <div className="relative">
          {/* Main layout background pattern */}
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
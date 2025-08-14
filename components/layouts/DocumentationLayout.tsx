/**
 * Documentation Layout Component
 * 
 * Provides documentation-specific layout with navigation, search,
 * and content structure optimized for technical documentation.
 */

import React from "react";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

interface DocumentationLayoutProps {
  children: React.ReactNode;
}

/**
 * DocumentationLayout Component
 * 
 * Provides consistent layout structure for documentation pages including:
 * - Documentation-specific navigation
 * - Search functionality
 * - Content structure optimized for docs
 * - Error boundary for graceful error handling
 * 
 * @param children - The page content to render within the layout
 */
export function DocumentationLayout({ children }: DocumentationLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Documentation Content Container */}
        <div className="relative">
          {/* Documentation-specific background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-100/30 dark:from-gray-900/30 dark:to-gray-800/30 pointer-events-none" />
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default DocumentationLayout;
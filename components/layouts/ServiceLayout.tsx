/**
 * Service Layout Component
 * 
 * Provides service-specific layout with navigation, service-focused
 * styling, and content structure optimized for service pages.
 */

import React from "react";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

interface ServiceLayoutProps {
  children: React.ReactNode;
}

/**
 * ServiceLayout Component
 * 
 * Provides consistent layout structure for service pages including:
 * - Service-specific navigation and styling
 * - Call-to-action optimization
 * - Content structure optimized for services
 * - Error boundary for graceful error handling
 * 
 * @param children - The page content to render within the layout
 */
export function ServiceLayout({ children }: ServiceLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Service Content Container */}
        <div className="relative">
          {/* Service-specific background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-100/30 dark:from-gray-900/30 dark:to-gray-800/30 pointer-events-none" />
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ServiceLayout;
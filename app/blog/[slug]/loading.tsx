import React from 'react';
import EnhancedLayout from '@/components/layouts/EnhancedLayout';

export default function BlogPostLoading() {
  return (
    <EnhancedLayout showBreadcrumbs={false}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <header className="mb-8">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
            
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
              
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 animate-pulse"></div>
              
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>
            
            {/* Image Skeleton */}
            <div className="w-full h-64 md:h-96 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 animate-pulse"></div>
          </header>

          {/* Content Skeleton */}
          <div className="mb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2 w-4/5"></div>
                {i % 3 === 0 && <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4 w-1/2"></div>}
              </div>
            ))}
          </div>

          {/* Footer Skeleton */}
          <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full mr-4 animate-pulse"></div>
                <div>
                  <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </footer>

          {/* Navigation Skeleton */}
          <nav className="flex justify-between items-center py-8 border-t border-gray-200 dark:border-gray-700">
            <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </nav>
        </article>
      </div>
    </EnhancedLayout>
  );
}
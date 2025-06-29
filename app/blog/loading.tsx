import React from 'react';
import EnhancedLayout from '@/components/layouts/EnhancedLayout';

export default function BlogLoading() {
  return (
    <EnhancedLayout showBreadcrumbs={false}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section Skeleton */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg mb-6 mx-auto max-w-md animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4 mx-auto max-w-2xl animate-pulse"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg mb-8 mx-auto max-w-xl animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-24 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Search and Filter Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg flex-1 max-w-md animate-pulse"></div>
              <div className="h-12 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Blog Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                {/* Image Skeleton */}
                <div className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
                
                {/* Content Skeleton */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4 animate-pulse"></div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EnhancedLayout>
  );
}
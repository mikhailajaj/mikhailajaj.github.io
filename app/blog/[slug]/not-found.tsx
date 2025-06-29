import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import EnhancedLayout from '@/components/layouts/EnhancedLayout';

export default function BlogPostNotFound() {
  return (
    <EnhancedLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="text-6xl mb-6">📝</div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            
            <div>
              <Link
                href="/blog"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
              >
                <FaSearch className="mr-2" />
                Browse All Articles
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>Looking for something specific?</p>
            <Link 
              href="/contact" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
            >
              Contact me
            </Link>
          </div>
        </div>
      </div>
    </EnhancedLayout>
  );
}
/**
 * Admin Layout
 * 
 * Layout component for admin pages with navigation and authentication.
 * Provides a consistent admin interface for performance monitoring and other admin tools.
 * 
 * @fileoverview Admin layout with navigation and security
 */

// 1. React Imports
import React from 'react';

// 2. External Libraries
import Link from 'next/link';
import { FaChartLine, FaHome, FaCog, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { Button } from '@/components/ui/base/Button';
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
import type { Metadata } from 'next';

// 6. Stylesheets
// (None in this component)

export const metadata: Metadata = {
  title: 'Admin Dashboard | Mikhail Ajaj Portfolio',
  description: 'Admin dashboard for portfolio management and performance monitoring',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

/**
 * Admin navigation items
 */
const adminNavItems = [
  {
    name: 'Performance',
    href: '/admin/performance',
    icon: <FaChartLine />,
    description: 'Performance monitoring and analytics',
  },
  {
    name: 'Error Analytics',
    href: '/admin/error-analytics',
    icon: <FaExclamationTriangle />,
    description: 'Error tracking and analytics dashboard',
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: <FaCog />,
    description: 'System settings and configuration',
  },
  {
    name: 'Security',
    href: '/admin/security',
    icon: <FaShieldAlt />,
    description: 'Security logs and monitoring',
  },
];

/**
 * Admin Layout Component
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <FaHome className="text-xl" />
                <span className="font-semibold">Back to Portfolio</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
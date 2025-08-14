/**
 * Admin Dashboard Home Page
 * 
 * Main admin dashboard with overview and quick access to admin tools.
 * 
 * @fileoverview Admin dashboard home page
 */

import React from 'react';
import Link from 'next/link';
import { 
  FaChartLine, 
  FaExclamationTriangle, 
  FaCog, 
  FaShieldAlt,
  FaArrowRight,
  FaServer,
  FaUsers,
  FaClock
} from 'react-icons/fa';

export default function AdminDashboard() {
  const adminTools = [
    {
      name: 'Performance Monitor',
      href: '/admin/performance',
      icon: <FaChartLine className="text-2xl" />,
      description: 'Monitor Core Web Vitals and performance metrics',
      color: 'bg-blue-500',
      stats: 'Real-time monitoring',
    },
    {
      name: 'Error Analytics',
      href: '/admin/error-analytics',
      icon: <FaExclamationTriangle className="text-2xl" />,
      description: 'Track errors, analyze trends, and get insights',
      color: 'bg-red-500',
      stats: 'Advanced analytics',
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: <FaCog className="text-2xl" />,
      description: 'Configure system settings and preferences',
      color: 'bg-gray-500',
      stats: 'Configuration',
    },
    {
      name: 'Security Monitor',
      href: '/admin/security',
      icon: <FaShieldAlt className="text-2xl" />,
      description: 'Security logs and access monitoring',
      color: 'bg-green-500',
      stats: 'Security tracking',
    },
  ];

  const quickStats = [
    {
      label: 'System Status',
      value: 'Operational',
      icon: <FaServer />,
      color: 'text-green-600',
    },
    {
      label: 'Active Sessions',
      value: '1',
      icon: <FaUsers />,
      color: 'text-blue-600',
    },
    {
      label: 'Uptime',
      value: '99.9%',
      icon: <FaClock />,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage your portfolio system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center">
                <div className={`${stat.color} text-xl mr-3`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`${tool.color} text-white p-3 rounded-lg`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {tool.description}
                    </p>
                    <span className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {tool.stats}
                    </span>
                  </div>
                </div>
                <FaArrowRight className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Error tracking system initialized
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Performance monitoring active
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Admin dashboard accessed
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Admin Dashboard - Portfolio Management',
  description: 'Admin dashboard for portfolio monitoring and management',
  robots: 'noindex, nofollow',
};
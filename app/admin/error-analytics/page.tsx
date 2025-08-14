/**
 * Error Analytics Admin Page
 * 
 * Admin page for error analytics dashboard.
 * 
 * @fileoverview Error analytics admin page
 */

import React from 'react';
import { ErrorAnalyticsDashboard } from '@/components/admin/ErrorAnalyticsDashboard';

export default function ErrorAnalyticsPage() {
  return (
    <div className="p-6">
      <ErrorAnalyticsDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Error Analytics - Admin Dashboard',
  description: 'Real-time error monitoring and analytics dashboard',
};
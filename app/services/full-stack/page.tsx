import React from 'react';
import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card } from '@/components/ui/base/Card';

export const metadata: Metadata = {
  title: 'Full-Stack Development Services | Mikhail Ajaj',
  description: 'Professional full-stack development services including React, Next.js, Node.js, mobile apps, and database solutions. End-to-end web application development.',
  keywords: ['Full-Stack Development', 'React', 'Next.js', 'Node.js', 'TypeScript', 'Mobile Development', 'Web Applications'],
};

const capabilities = [
  {
    title: 'Frontend Development',
    description: 'Modern, responsive user interfaces using React, Next.js, and TypeScript',
    features: [
      'React & Next.js Applications',
      'TypeScript Implementation',
      'Responsive Design',
      'Performance Optimization',
      'SEO Optimization',
      'Progressive Web Apps'
    ]
  },
  {
    title: 'Backend Development',
    description: 'Scalable server-side solutions with robust APIs and database integration',
    features: [
      'RESTful API Development',
      'GraphQL Implementation',
      'Database Design & Optimization',
      'Authentication & Authorization',
      'Real-time Features',
      'Microservices Architecture'
    ]
  },
  {
    title: 'Mobile Development',
    description: 'Cross-platform mobile applications for iOS and Android',
    features: [
      'React Native Development',
      'Native iOS (Swift) Development',
      'Cross-platform Solutions',
      'App Store Deployment',
      'Push Notifications',
      'Offline Functionality'
    ]
  }
];

export default function FullStackPage() {
  return (
    <MainLayout domain="full-stack">
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card variant="glass" className="p-8">
            <div className="text-center text-gray-300">
              <h1 className="text-3xl font-bold mb-4">Full-Stack Development Services</h1>
              <p>This page will be redirected to /full-stack in the new SoC structure</p>
              <p className="text-sm text-gray-500 mt-2">
                Legacy service page - Being migrated to domain-specific structure
              </p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
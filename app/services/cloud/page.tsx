import React from 'react';
import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Card } from '@/components/ui/base/Card';

export const metadata: Metadata = {
  title: 'Service Page | Mikhail Ajaj',
  description: 'Legacy service page being migrated to new SoC structure.',
};

export default function ServicePage() {
  return (
    <MainLayout>
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card variant="glass" className="p-8">
            <div className="text-center text-gray-300">
              <h1 className="text-3xl font-bold mb-4">Service Page</h1>
              <p>Legacy service page - Being migrated to domain-specific structure</p>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

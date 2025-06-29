import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DataHero } from '@/components/domain-specific/data/DataHero';
import { DataProjects } from '@/components/domain-specific/data/DataProjects';
import { DataSkills } from '@/components/domain-specific/data/DataSkills';
import { DataServices } from '@/components/domain-specific/data/DataServices';

export const metadata: Metadata = {
  title: 'Data Analytics | Mikhail Ajaj',
  description: 'Machine learning, business intelligence, and data visualization solutions. Expert in Python, R, SQL, and modern analytics platforms.',
  keywords: ['Data Analyst', 'Machine Learning', 'Python', 'R', 'SQL', 'Business Intelligence', 'Data Visualization'],
};

export default function DataAnalyticsPage() {
  return (
    <MainLayout domain="data">
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-slate-900">
        <DataHero />
        <DataSkills />
        <DataProjects />
        <DataServices />
      </div>
    </MainLayout>
  );
}
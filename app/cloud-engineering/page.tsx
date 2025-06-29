import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { CloudHero } from '@/components/domain-specific/cloud/CloudHero';
import { CloudProjects } from '@/components/domain-specific/cloud/CloudProjects';
import { CloudSkills } from '@/components/domain-specific/cloud/CloudSkills';
import { CloudServices } from '@/components/domain-specific/cloud/CloudServices';

export const metadata: Metadata = {
  title: 'Cloud Engineering | Mikhail Ajaj',
  description: 'AWS cloud architecture, DevOps automation, and scalable infrastructure solutions. Expert in containerization, CI/CD, and cloud migration.',
  keywords: ['Cloud Engineer', 'AWS', 'DevOps', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
};

export default function CloudEngineeringPage() {
  return (
    <MainLayout domain="cloud">
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
        <CloudHero />
        <CloudSkills />
        <CloudProjects />
        <CloudServices />
      </div>
    </MainLayout>
  );
}
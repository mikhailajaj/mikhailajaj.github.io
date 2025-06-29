import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ConsultingHero } from '@/components/domain-specific/consulting/ConsultingHero';
import { ConsultingProjects } from '@/components/domain-specific/consulting/ConsultingProjects';
import { ConsultingSkills } from '@/components/domain-specific/consulting/ConsultingSkills';
import { ConsultingServices } from '@/components/domain-specific/consulting/ConsultingServices';

export const metadata: Metadata = {
  title: 'Technical Consulting | Mikhail Ajaj',
  description: 'Strategic technology consulting, architecture reviews, and digital transformation guidance. Expert in technical leadership and process optimization.',
  keywords: ['Technical Consultant', 'Architecture Review', 'Digital Transformation', 'Technical Leadership', 'Process Optimization'],
};

export default function TechnicalConsultingPage() {
  return (
    <MainLayout domain="consulting">
      <div className="min-h-screen bg-gradient-to-b from-orange-900 to-slate-900">
        <ConsultingHero />
        <ConsultingSkills />
        <ConsultingProjects />
        <ConsultingServices />
      </div>
    </MainLayout>
  );
}
import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { EducationTimeline } from '@/components/features/education/EducationTimeline';
import { CertificationGallery } from '@/components/features/education/CertificationGallery';
import { ContinuousLearning } from '@/components/features/education/ContinuousLearning';

export const metadata: Metadata = {
  title: 'Education & Certifications | Mikhail Ajaj',
  description: 'Academic background, professional certifications, and continuous learning journey in technology and software engineering.',
  keywords: ['Education', 'Certifications', 'AWS Certified', 'Computer Science', 'Professional Development'],
};

export default function EducationPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        <EducationTimeline />
        <CertificationGallery />
        <ContinuousLearning />
      </div>
    </MainLayout>
  );
}
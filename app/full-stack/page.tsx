import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { FullStackHero } from '@/components/domain-specific/full-stack/FullStackHero';
import { FullStackProjects } from '@/components/domain-specific/full-stack/FullStackProjects';
import { FullStackSkills } from '@/components/domain-specific/full-stack/FullStackSkills';
import { FullStackServices } from '@/components/domain-specific/full-stack/FullStackServices';

export const metadata: Metadata = {
  title: 'Full-Stack Development | Mikhail Ajaj',
  description: 'Comprehensive full-stack development services using React, Node.js, TypeScript, and modern databases. End-to-end web application development.',
  keywords: ['Full-Stack Developer', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Next.js'],
};

export default function FullStackPage() {
  return (
    <MainLayout domain="full-stack">
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        <FullStackHero />
        <FullStackSkills />
        <FullStackProjects />
        <FullStackServices />
      </div>
    </MainLayout>
  );
}
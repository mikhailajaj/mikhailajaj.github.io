import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { UXUIHero } from '@/components/domain-specific/ux-ui/UXUIHero';
import { UXUIProjects } from '@/components/domain-specific/ux-ui/UXUIProjects';
import { UXUISkills } from '@/components/domain-specific/ux-ui/UXUISkills';
import { UXUIServices } from '@/components/domain-specific/ux-ui/UXUIServices';

export const metadata: Metadata = {
  title: 'UX/UI Design | Mikhail Ajaj',
  description: 'User experience design, interface optimization, and design system creation. Expert in Figma, user research, and accessibility design.',
  keywords: ['UX Designer', 'UI Designer', 'Figma', 'User Research', 'Design Systems', 'Accessibility', 'Prototyping'],
};

export default function UXUIDesignPage() {
  return (
    <MainLayout domain="ux-ui">
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900">
        <UXUIHero />
        <UXUISkills />
        <UXUIProjects />
        <UXUIServices />
      </div>
    </MainLayout>
  );
}
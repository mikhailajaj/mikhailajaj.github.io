import { Metadata } from 'next';
import { MainLayout } from '@/components/layouts/MainLayout';
import { AchievementGallery } from '@/components/features/achievements/AchievementGallery';
import { RecognitionTimeline } from '@/components/features/achievements/RecognitionTimeline';
import { PublicationsAndTalks } from '@/components/features/achievements/PublicationsAndTalks';

export const metadata: Metadata = {
  title: 'Achievements & Recognition | Mikhail Ajaj',
  description: 'Professional achievements, industry recognition, publications, and speaking engagements in technology and software engineering.',
  keywords: ['Achievements', 'Awards', 'Recognition', 'Publications', 'Speaking Engagements', 'Industry Leadership'],
};

export default function AchievementsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black">
        <AchievementGallery />
        <RecognitionTimeline />
        <PublicationsAndTalks />
      </div>
    </MainLayout>
  );
}
import { Metadata } from "next";
// MainLayout removed - using app/layout.tsx structure
import { AchievementGallery } from "@/components/features/achievements/AchievementGallery";
import { RecognitionTimeline } from "@/components/features/achievements/RecognitionTimeline";
import { PublicationsAndTalks } from "@/components/features/achievements/PublicationsAndTalks";

export const metadata: Metadata = {
  title: "Achievements & Recognition | Mikhail Ajaj",
  description:
    "Professional achievements, industry recognition, publications, and speaking engagements in technology and software engineering.",
  keywords: [
    "Achievements",
    "Awards",
    "Recognition",
    "Publications",
    "Speaking Engagements",
    "Industry Leadership",
  ],
};

export default function AchievementsPage() {
  return (
    <div className="pt-10 min-h-screen bg-gradient-theme">
      <AchievementGallery />
      <RecognitionTimeline />
      <PublicationsAndTalks />
    </div>
  );
}

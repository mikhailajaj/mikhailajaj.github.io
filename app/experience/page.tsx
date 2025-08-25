import { Metadata } from "next";
// MainLayout removed - using app/layout.tsx structure
import { ExperienceTimeline } from "@/components/features/experience/ExperienceTimeline";
import { ProfessionalSummary } from "@/components/features/experience/ProfessionalSummary";
import { SkillsOverview } from "@/components/features/experience/SkillsOverview";
import { DevelopmentBanner } from "@/components/ui/DevelopmentBanner";

export const metadata: Metadata = {
  title: "Professional Experience | Mikhail Ajaj",
  description:
    "Comprehensive professional timeline showcasing career progression, key achievements, and technical leadership across multiple domains.",
  keywords: [
    "Professional Experience",
    "Career Timeline",
    "Technical Leadership",
    "Software Engineering",
    "Project Management",
  ],
};

export default function ExperiencePage() {
  return (
    <div className="pt-10 min-h-screen bg-gradient-theme">
      <div className="px-4 py-4">
        <DevelopmentBanner 
          variant="template" 
          message="Experience timeline and achievements are being updated with detailed information"
        />
      </div>
      <ProfessionalSummary />
      <ExperienceTimeline />
      <SkillsOverview />
    </div>
  );
}
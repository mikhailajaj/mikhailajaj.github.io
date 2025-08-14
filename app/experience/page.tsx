import { Metadata } from "next";
// MainLayout removed - using app/layout.tsx structure
import { ExperienceTimeline } from "@/components/features/experience/ExperienceTimeline";
import { ProfessionalSummary } from "@/components/features/experience/ProfessionalSummary";
import { SkillsOverview } from "@/components/features/experience/SkillsOverview";

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
      <ProfessionalSummary />
      <ExperienceTimeline />
      <SkillsOverview />
    </div>
  );
}
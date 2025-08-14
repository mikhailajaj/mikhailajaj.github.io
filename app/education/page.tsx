import { Metadata } from "next";
// MainLayout removed - using app/layout.tsx structure
import EducationHero from "@/components/features/education/EducationHero";
import { EducationTimeline } from "@/components/features/education/EducationTimeline";
import { CertificationGallery } from "@/components/features/education/CertificationGallery";
import DualTimelineClient from "@/components/features/education/DualTimelineClient";
import TranscriptCourses from "@/components/features/education/TranscriptCourses";
import { SelfEducation } from "@/components/features/education/SelfEducation";

export const metadata: Metadata = {
  title: "Education & Certifications | Mikhail Ajaj",
  description:
    "Academic background, professional certifications, and continuous learning journey in technology and software engineering.",
  keywords: [
    "Education",
    "Certifications",
    "AWS Certified",
    "Computer Science",
    "Professional Development",
  ],
};

import { EducationProvider } from "@/lib/contexts";

import { TimelineProvider } from "@/lib/contexts";

export default function EducationPage() {
  return (
    <EducationProvider>
      <TimelineProvider>
        <div className="pt-10 min-h-screen bg-gradient-theme">
          <EducationHero />
          <EducationTimeline />
          {/* Dual-track unified timeline */}
          <DualTimelineClient />
          {/* Transcript-driven courses (filters out W/F) */}
          <TranscriptCourses transcriptUrl="/docs/Education/official-transcript.txt" title="Selected Courses" />
          <CertificationGallery />
          <SelfEducation />
        </div>
      </TimelineProvider>
    </EducationProvider>
  );
}

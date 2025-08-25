import { Metadata } from "next";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DomainHero } from "@/components/ui/DomainHero";
import { DOMAIN_CONFIGS } from "@/lib/constants/domains";
import { domainAchievements, domainTechnologies } from "@/lib/data/domainData";
// ServiceGrid component removed as requested
import { domainServices } from "@/lib/data/serviceData";
import { ConsultingProjects } from "@/components/domain-specific/consulting/ConsultingProjects";
import { ConsultingSkills } from "@/components/domain-specific/consulting/ConsultingSkills";
import { ConsultingServices } from "@/components/domain-specific/consulting/ConsultingServices";

export const metadata: Metadata = {
  title: "Technical Consulting | Mikhail Ajaj",
  description: "Strategic technology consultant. Architecture design, digital transformation, and technical leadership for growing businesses.",
};

export default function TechnicalConsultingPage() {
  return (
    <MainLayout domain="consulting">
      <div className="min-h-screen bg-gradient-to-b from-orange-900 to-slate-900">
        <DomainHero 
          domain={DOMAIN_CONFIGS['consulting']} 
          achievements={domainAchievements['consulting']} 
          technologies={domainTechnologies['consulting']} 
        />
        <ConsultingSkills />
        <ConsultingProjects />
        {/* ServiceGrid component removed as requested */}
      </div>
    </MainLayout>
  );
}

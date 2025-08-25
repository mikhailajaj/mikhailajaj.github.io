import { Metadata } from "next";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DomainHero } from "@/components/ui/DomainHero";
import { DOMAIN_CONFIGS } from "@/lib/constants/domains";
import { domainAchievements, domainTechnologies } from "@/lib/data/domainData";
// ServiceGrid component removed as requested
import { domainServices } from "@/lib/data/serviceData";
import { CloudProjects } from "@/components/domain-specific/cloud/CloudProjects";
import { CloudSkills } from "@/components/domain-specific/cloud/CloudSkills";
// import { CloudServices } from "@/components/domain-specific/cloud/CloudServices"; // Replaced with ServiceGrid

export const metadata: Metadata = {
  title: "Cloud Engineering | Mikhail Ajaj",
  description: "AWS cloud architect and DevOps engineer. Specializing in scalable infrastructure, containerization, and cloud-native solutions.",
};

export default function CloudEngineeringPage() {
  return (
    <MainLayout domain="cloud">
      <div className="min-h-screen bg-gradient-to-b from-teal-900 to-slate-900">
        <DomainHero 
          domain={DOMAIN_CONFIGS['cloud']} 
          achievements={domainAchievements['cloud']} 
          technologies={domainTechnologies['cloud']} 
        />
        <CloudSkills />
        <CloudProjects />
        {/* ServiceGrid component removed as requested */}
      </div>
    </MainLayout>
  );
}

import { Metadata } from "next";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DomainHero } from "@/components/ui/DomainHero";
import { DOMAIN_CONFIGS } from "@/lib/constants/domains";
import { domainAchievements, domainTechnologies } from "@/lib/data/domainData";
import { ServiceGrid } from "@/components/ui/ServiceGrid";
import { domainServices } from "@/lib/data/serviceData";
import { UXUIProjects } from "@/components/domain-specific/ux-ui/UXUIProjects";
import { UXUISkills } from "@/components/domain-specific/ux-ui/UXUISkills";
import { UXUIServices } from "@/components/domain-specific/ux-ui/UXUIServices";

export const metadata: Metadata = {
  title: "UX/UI Design | Mikhail Ajaj",
  description: "User experience designer and interface specialist. Creating intuitive, accessible, and beautiful digital experiences.",
};

export default function UXUIDesignPage() {
  return (
    <MainLayout domain="ux-ui">
      <div className="min-h-screen bg-gradient-to-b from-pink-900 to-slate-900">
        <DomainHero 
          domain={DOMAIN_CONFIGS['ux-ui']} 
          achievements={domainAchievements['ux-ui']} 
          technologies={domainTechnologies['ux-ui']} 
        />
        <UXUISkills />
        <UXUIProjects />
        <ServiceGrid domain={DOMAIN_CONFIGS['ux-ui']} services={domainServices['ux-ui']} />
      </div>
    </MainLayout>
  );
}

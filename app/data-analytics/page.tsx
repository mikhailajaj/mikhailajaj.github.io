import { Metadata } from "next";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DomainHero } from "@/components/ui/DomainHero";
import { DOMAIN_CONFIGS } from "@/lib/constants/domains";
import { domainAchievements, domainTechnologies } from "@/lib/data/domainData";
import { ServiceGrid } from "@/components/ui/ServiceGrid";
import { domainServices } from "@/lib/data/serviceData";
import { DataProjects } from "@/components/domain-specific/data/DataProjects";
import { DataSkills } from "@/components/domain-specific/data/DataSkills";
import { DataServices } from "@/components/domain-specific/data/DataServices";

export const metadata: Metadata = {
  title: "Data Analytics | Mikhail Ajaj",
  description: "Data scientist and analytics expert. Machine learning, business intelligence, and data-driven insights for strategic decision making.",
};

export default function DataAnalyticsPage() {
  return (
    <MainLayout domain="data">
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-slate-900">
        <DomainHero 
          domain={DOMAIN_CONFIGS['data']} 
          achievements={domainAchievements['data']} 
          technologies={domainTechnologies['data']} 
        />
        <DataSkills />
        <DataProjects />
        <ServiceGrid domain={DOMAIN_CONFIGS['data']} services={domainServices['data']} />
      </div>
    </MainLayout>
  );
}

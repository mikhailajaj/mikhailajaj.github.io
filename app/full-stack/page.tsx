import { Metadata } from "next";
import { MainLayout } from "@/components/layouts/MainLayout";
import { DomainHero } from "@/components/ui/DomainHero";
import { DOMAIN_CONFIGS } from "@/lib/constants/domains";
import { domainAchievements, domainTechnologies } from "@/lib/data/domainData";
// ServiceGrid component removed as requested
import { domainServices } from "@/lib/data/serviceData";import { FullStackProjects } from "@/components/domain-specific/full-stack/FullStackProjects";
import { FullStackSkills } from "@/components/domain-specific/full-stack/FullStackSkills";
import { FullStackServices } from "@/components/domain-specific/full-stack/FullStackServices";

export const metadata: Metadata = {
  title: "Full-Stack Development | Mikhail Ajaj",
  description: "Expert full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. Building scalable applications with exceptional user experiences.",
};

export default function FullStackPage() {
  return (
    <MainLayout domain="full-stack">
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-900">
        <DomainHero 
          domain={DOMAIN_CONFIGS['full-stack']} 
          achievements={domainAchievements['full-stack']} 
          technologies={domainTechnologies['full-stack']} 
        />
        <FullStackSkills />
        <FullStackProjects />
        {/* ServiceGrid component removed as requested */}
      </div>
    </MainLayout>
  );
}

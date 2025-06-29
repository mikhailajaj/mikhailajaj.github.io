import { StrictMode } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { DomainOverviewHero } from '@/components/features/homepage/DomainOverviewHero';
import { FeaturedProjects } from '@/components/features/homepage/FeaturedProjects';
import { SkillsOverview } from '@/components/features/homepage/SkillsOverview';
import { ProfessionalHighlights } from '@/components/features/homepage/ProfessionalHighlights';
import { CallToAction } from '@/components/features/homepage/CallToAction';
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

// Keep existing components for now during transition
import EnhancedHero from "@/components/EnhancedHero";
import EnhancedGrid from "@/components/EnhancedGrid";
import RecentProjects from "@/components/RecentProjects";
import SpecializedSkills from "@/components/SpecializedSkills";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <StrictMode>
      <MainLayout showNavigation={true} showFooter={true} showScrollProgress={true}>
        <div id="main-content" className="relative">
          <ShootingStars />
          <StarsBackground className="z-10" />
          
          <div className="relative z-20">
            {/* New SoC-based components */}
            <DomainOverviewHero />
            <SkillsOverview />
            <FeaturedProjects />
            <ProfessionalHighlights />
            
            {/* Existing components during transition */}
            <div className="max-w-7xl mx-auto">
              <EnhancedGrid />
              <SpecializedSkills />
              <RecentProjects />
              <TestimonialsSection />
              <ContactForm />
            </div>
            
            <CallToAction />
          </div>
        </div>
      </MainLayout>
    </StrictMode>
  );
}

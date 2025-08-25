/**
 * Homepage Component
 *
 * The main homepage of the Mikhail Ajaj Portfolio showcasing multi-domain expertise
 * with advanced HCI (Human-Computer Interaction) optimization and cognitive load management.
 *
 * @fileoverview Homepage with Sally's HCI framework and progressive disclosure patterns
 */

/**
 * Force static rendering for optimal performance and SEO
 * This ensures the page is pre-rendered at build time for faster loading
 */
export const dynamic = "force-static";

// 1. React Imports
import React from "react";

// 2. External Libraries
// (None in this component)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
// MainLayout removed - using app/layout.tsx navigation structure
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";
import LocationAwareMoonBackground from "@/components/ui/LocationAwareMoonBackground";

import { CallToAction } from "@/components/features/homepage/CallToAction";

import ContactForm from "@/components/ContactForm";
import AboutMeGrid from "@/components/AboutMeGrid";
import InteractiveHero from "@/components/InteractiveHero";
import RecentProjects from "@/components/RecentProjects";
import SpecializedSkills from "@/components/SpecializedSkills";
import { HomepageTestimonialsSection } from "@/components/reviews";

// 4. Internal Relative Imports
// (None in this component)
import BalloonGame from "@/components/balloon-game/BalloonGame";

import ResumeDownloads from "@/components/ResumeDownloads";
// 5. Type Imports
// (None in this component)

// 6. Stylesheets
// (None in this component)

/**
 * Home Page Component
 *
 * The main homepage component implementing Sally's HCI framework for optimal
 * user experience through cognitive load optimization and progressive disclosure.
 *
 * @component
 * @example
 * ```tsx
 * // Rendered automatically at the root route "/"
 * <Home />
 * ```
 *
 * Architecture Features:
 * - Sally's Cognitive Framework: Reduces cognitive load through progressive disclosure
 * - HCI Optimization: Evidence-based design patterns for better usability
 * - Performance Optimization: Lazy loading and priority-based content delivery
 * - Accessibility: WCAG 2.1 AA compliance with enhanced navigation
 * - Responsive Design: Optimized for all device types and screen sizes
 *
 * Content Sections:
 * 1. Adaptive Hero: Domain expertise showcase with cognitive complexity management
 * 2. Technical Skills: Progressive disclosure using Miller's Rule (7+/-2 items)
 * 3. Featured Projects: Lazy-loaded project showcase with performance metrics
 * 4. Professional Highlights: Career achievements and business impact
 * 5. Testimonials: Client feedback and social proof
 * 6. Contact Integration: HCI-enhanced contact forms and newsletter signup
 *
 * Performance Optimizations:
 * - Static rendering for faster initial load
 * - Progressive image loading
 * - Component-level code splitting
 * - Optimized animation timing
 * - Reduced cognitive load through staged content reveal
 *
 * @returns {JSX.Element} The complete homepage with all sections and optimizations
 */
export default function Home() {
  return (
    <>
      <PerformanceMonitor />
      
      {/* Main Content - Navigation/Footer handled by app/layout.tsx */}
      <div id="main-content" className="relative pt-10"> {/* pt-10 for fixed navigation */}
        {/* Revolutionary Location-Aware Moon Theme */}
        <LocationAwareMoonBackground intensity="normal" enableLocationTracking={true} />
        
        {/* Fallback to Galaxy Theme for Dark Mode */}
        {/* <AdaptiveGalaxyBackground intensity="normal" /> */}

        <div className="relative z-20">
          {/* Enhanced Impact Hero */}
          {/* <EnhancedImpactHero /> */}
          <InteractiveHero />

          {/* Simplified sections without Sally framework */}
          <div className="max-w-7xl mx-auto px-4 space-y-16">
            <AboutMeGrid />
            <SpecializedSkills />
            <ResumeDownloads />
            <HomepageTestimonialsSection />
            
            <BalloonGame />
            <ContactForm />
          </div>

          <CallToAction />
        </div>
      </div>
    </>
  );
}

export const dynamic = "force-static";

import React from "react";
import type { Metadata } from "next";

import AboutMeGrid from "@/components/AboutMeGrid";

import { FeaturedReviews } from "@/components/reviews/FeaturedReviews";

export const metadata: Metadata = {
  title: "About | Mikhail Ajaj",
  description:
    "Learn about Mikhail Ajaj – full‑stack, cloud, and data engineer with $30M+ business impact across five domains.",
  openGraph: {
    title: "About | Mikhail Ajaj",
    description:
      "Learn about Mikhail Ajaj – full‑stack, cloud, and data engineer with $30M+ business impact across five domains.",
    url: "https://mikhailajaj.github.io/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div id="about-page" className="relative">
      {/* Page header */}
      <section className="relative isolate overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/0 via-muted/40 to-background" />
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500 bg-clip-text text-transparent">
              About Mikhail Ajaj
            </span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            Multi‑domain problem solver focused on measurable outcomes: shipping
            reliable software, operating in the cloud at scale, and unlocking
            data‑driven decisions with delightful UX. 
          </p>
        </div>
      </section>

      

      {/* About content grid */}
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        <AboutMeGrid />

        {/* Skills and resumes */}
        <section aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="sr-only">
            Specialized skills and resumes
          </h2>
          
        </section>

        {/* Social proof */}
        <section aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="sr-only">
            Testimonials
          </h2>
          <FeaturedReviews maxReviews={4} autoRotate={true} showControls={true} showViewAllLink={true} />
        </section>
      </div>
    </div>
  );
}

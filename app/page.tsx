import { StrictMode } from 'react';

import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

import {FloatingNav} from "@/components/ui/FloatingNav";

import Grid from "@/components/Grid";
import RecentProjects from "@/components/RecentProjects";
import { navItems } from "@/data";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

export default function Home() {
  
  return (
    <StrictMode>
    <main>
      <ShootingStars/>
      <StarsBackground className="z-10"/>
      <div className="max-w-7xk w-full z-20">
        <FloatingNav navItems={navItems} />
        <Hero/>
        <Grid/>
        <RecentProjects/>
        <Clients />
        <Experience />
        <Approach />
        <Footer />
      </div>
      
    </main>
    </StrictMode>
  );
}

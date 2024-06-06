import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

import {FloatingNav} from "@/components/ui/FloatingNav";

import Grid from "@/components/Grid";
import RecentProjects from "@/components/RecentProjects";
import { navItems } from "@/data";
import Clients from "@/components/Clients";
import Approach from "@/components/Approach";
export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col mx-auto sm:px-10 px-5 overflow-hidden">
      <div className="max-w-7xk w-full">
        <FloatingNav navItems={navItems} className="flex-col lg:flex-row bg-opacity-85" />
        <Hero/>
        <Grid/>
        <RecentProjects/>
        <Clients />
        <Experience />
        <Approach />
        <Footer />
      </div>
      
    </main>
  );
}

import React from 'react';
import { EnhancedFloatingNav } from '@/components/ui/EnhancedFloatingNav';
import { navItems } from '@/data';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

interface ServiceLayoutProps {
  children: React.ReactNode;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ScrollProgress />
      <ShootingStars />
      <StarsBackground className="z-10" />
      <div className="relative z-20">
        <EnhancedFloatingNav navItems={navItems} />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ServiceLayout;

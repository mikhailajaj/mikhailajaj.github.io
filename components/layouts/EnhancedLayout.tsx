import React from 'react';
import { MainNavigation } from '@/components/navigation/MainNavigation';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { navItems } from '@/data';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

interface EnhancedLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  showBackground?: boolean;
}

const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ 
  children, 
  showBreadcrumbs = true,
  showBackground = true 
}) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ScrollProgress />
      {showBackground && (
        <>
          <ShootingStars />
          <StarsBackground className="z-10" />
        </>
      )}
      
      <div className="relative z-20">
        <MainNavigation navItems={navItems} />
        
        {/* Add top padding to account for fixed navigation */}
        <div className="pt-16">
          {showBreadcrumbs && <Breadcrumbs />}
          <main>
            {children}
          </main>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default EnhancedLayout;
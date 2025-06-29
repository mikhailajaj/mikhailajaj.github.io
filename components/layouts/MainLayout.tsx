'use client';

import React from 'react';
import { Domain } from '@/data/schemas/project';
import { DomainAwareNavigation } from '@/components/ui/navigation/DomainAwareNavigation';
import { Footer } from '@/components/ui/layout/Footer';
import { ScrollProgress } from '@/components/ui/feedback/ScrollProgress';
import { AccessibilityFeatures } from '@/components/features/accessibility/AccessibilityFeatures';

interface MainLayoutProps {
  children: React.ReactNode;
  domain?: Domain;
  showNavigation?: boolean;
  showFooter?: boolean;
  showScrollProgress?: boolean;
  className?: string;
}

export function MainLayout({
  children,
  domain,
  showNavigation = true,
  showFooter = true,
  showScrollProgress = true,
  className = '',
}: MainLayoutProps) {
  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {showScrollProgress && <ScrollProgress />}
      
      {showNavigation && (
        <DomainAwareNavigation currentDomain={domain} />
      )}
      
      <main className="relative z-10">
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      <AccessibilityFeatures />
    </div>
  );
}
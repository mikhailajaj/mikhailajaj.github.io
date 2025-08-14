"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/layout/Footer";
import { DomainAwareNavigation } from "@/components/ui/navigation/DomainAwareNavigation";
import type { DomainConfig } from "@/lib/constants/domains";

interface UniversalLayoutProps {
  children: React.ReactNode;
  
  // Layout configuration
  layout?: 'main' | 'service' | 'documentation' | 'minimal';
  
  // Domain integration
  domain?: string | DomainConfig;
  
  // Navigation options
  showNavigation?: boolean;
  showFooter?: boolean;
  
  // Content options
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  // Background options
  background?: 'default' | 'gradient' | 'pattern' | 'transparent';
  
  // Additional customization
  className?: string;
  contentClassName?: string;
}

export const UniversalLayout: React.FC<UniversalLayoutProps> = ({
  children,
  layout = 'main',
  domain,
  showNavigation = true,
  showFooter = true,
  maxWidth = 'full',
  padding = 'md',
  background = 'default',
  className,
  contentClassName
}) => {
  // Hydration safety
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Layout-specific configurations
  const layoutConfigs = {
    main: {
      navigation: true,
      footer: true,
      maxWidth: 'full',
      padding: 'md'
    },
    service: {
      navigation: true,
      footer: true,
      maxWidth: '2xl',
      padding: 'lg'
    },
    documentation: {
      navigation: true,
      footer: false,
      maxWidth: 'xl',
      padding: 'lg'
    },
    minimal: {
      navigation: false,
      footer: false,
      maxWidth: 'lg',
      padding: 'sm'
    }
  };

  const config = layoutConfigs[layout];
  
  // Apply layout defaults with prop overrides
  const finalShowNavigation = showNavigation ?? config.navigation;
  const finalShowFooter = showFooter ?? config.footer;
  const finalMaxWidth = maxWidth !== 'full' ? maxWidth : config.maxWidth;
  const finalPadding = padding !== 'md' ? padding : config.padding;

  // Background styles
  const backgroundStyles = {
    default: "bg-background",
    gradient: "bg-gradient-to-br from-background to-muted",
    pattern: "bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-background to-gray-50",
    transparent: "bg-transparent"
  };

  // Max width classes
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    '2xl': "max-w-2xl",
    full: "max-w-none"
  };

  // Padding classes
  const paddingClasses = {
    none: "",
    sm: "px-4 py-2",
    md: "px-4 py-4 md:px-6 md:py-6",
    lg: "px-6 py-8 md:px-8 md:py-12"
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      backgroundStyles[background],
      className
    )}>
      {/* Navigation */}
      {finalShowNavigation && (
        <motion.header
          initial={isMounted ? { opacity: 0, y: -20 } : false}
          animate={isMounted ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3 }}
        >
          <DomainAwareNavigation domain={domain} />
        </motion.header>
      )}

      {/* Main Content */}
      <motion.main
        initial={isMounted ? { opacity: 0 } : false}
        animate={isMounted ? { opacity: 1 } : false}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={cn(
          "flex-1",
          finalMaxWidth !== 'full' && "mx-auto w-full",
          maxWidthClasses[finalMaxWidth],
          paddingClasses[finalPadding],
          contentClassName
        )}
      >
        {children}
      </motion.main>

      {/* Footer */}
      {finalShowFooter && (
        <motion.footer
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={isMounted ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Footer />
        </motion.footer>
      )}
    </div>
  );
};

export default UniversalLayout;

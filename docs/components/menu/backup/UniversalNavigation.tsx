"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { DOMAIN_CONFIGS } from "@/lib/constants/domains";
import type { DomainConfig } from "@/lib/constants/domains";

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  children?: NavigationItem[];
}

interface UniversalNavigationProps {
  // Navigation configuration
  variant?: 'header' | 'mobile' | 'sidebar' | 'breadcrumb';
  
  // Domain integration
  domain?: string | DomainConfig;
  
  // Navigation items
  items?: NavigationItem[];
  
  // Behavior options
  showLogo?: boolean;
  showDomainSwitcher?: boolean;
  showMobileMenu?: boolean;
  
  // Styling options
  background?: 'transparent' | 'blur' | 'solid';
  position?: 'static' | 'sticky' | 'fixed';
  
  // Additional customization
  className?: string;
}

const defaultNavigationItems: NavigationItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" }
];

const domainNavigationItems: NavigationItem[] = [
  { name: "Full-Stack", href: "/full-stack" },
  { name: "Cloud Engineering", href: "/cloud-engineering" },
  { name: "Data Analytics", href: "/data-analytics" },
  { name: "UX/UI Design", href: "/ux-ui-design" },
  { name: "Technical Consulting", href: "/technical-consulting" }
];

export const UniversalNavigation: React.FC<UniversalNavigationProps> = ({
  variant = 'header',
  domain,
  items = defaultNavigationItems,
  showLogo = true,
  showDomainSwitcher = true,
  showMobileMenu = true,
  background = 'blur',
  position = 'sticky',
  className
}) => {
  // Hydration safety
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = usePathname();

  // Domain configuration
  const domainConfig = typeof domain === 'string' 
    ? DOMAIN_CONFIGS[domain] 
    : domain;

  // Background styles
  const backgroundStyles = {
    transparent: "bg-transparent",
    blur: "bg-background/80 backdrop-blur-md border-b border-border/40",
    solid: "bg-background border-b border-border"
  };

  // Position styles
  const positionStyles = {
    static: "relative",
    sticky: "sticky top-0 z-50",
    fixed: "fixed top-0 left-0 right-0 z-50"
  };

  // Variant-specific rendering
  const renderVariant = () => {
    switch (variant) {
      case 'breadcrumb':
        return renderBreadcrumb();
      case 'mobile':
        return renderMobileNavigation();
      case 'sidebar':
        return renderSidebarNavigation();
      default:
        return renderHeaderNavigation();
    }
  };

  const renderBreadcrumb = () => (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {pathname.split('/').filter(Boolean).map((segment, index, array) => {
        const href = '/' + array.slice(0, index + 1).join('/');
        const isLast = index === array.length - 1;
        
        return (
          <React.Fragment key={segment}>
            <span>/</span>
            {isLast ? (
              <span className="text-foreground capitalize">
                {segment.replace('-', ' ')}
              </span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-foreground transition-colors capitalize"
              >
                {segment.replace('-', ' ')}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );

  const renderMobileNavigation = () => (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span className={cn(
            "w-5 h-0.5 bg-current transition-all duration-300",
            isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
          )} />
          <span className={cn(
            "w-5 h-0.5 bg-current transition-all duration-300 mt-1",
            isMobileMenuOpen ? "opacity-0" : ""
          )} />
          <span className={cn(
            "w-5 h-0.5 bg-current transition-all duration-300 mt-1",
            isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
          )} />
        </div>
      </Button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-4">
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block py-2 text-lg transition-colors",
                      pathname === item.href 
                        ? "text-foreground font-medium" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderSidebarNavigation = () => (
    <aside className="w-64 h-screen bg-background border-r border-border">
      <div className="p-6">
        {showLogo && (
          <div className="mb-8">
            <Link href="/" className="text-xl font-bold">
              Portfolio
            </Link>
          </div>
        )}
        
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );

  const renderHeaderNavigation = () => (
    <header className={cn(
      positionStyles[position],
      backgroundStyles[background],
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {showLogo && (
            <motion.div
              initial={isMounted ? { opacity: 0, x: -20 } : false}
              animate={isMounted ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3 }}
            >
              <Link href="/" className="text-xl font-bold">
                {domainConfig?.name || "Portfolio"}
              </Link>
            </motion.div>
          )}

          {/* Desktop Navigation */}
          <motion.nav
            initial={isMounted ? { opacity: 0, y: -10 } : false}
            animate={isMounted ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </motion.nav>

          {/* Domain Switcher */}
          {showDomainSwitcher && (
            <motion.div
              initial={isMounted ? { opacity: 0, x: 20 } : false}
              animate={isMounted ? { opacity: 1, x: 0 } : false}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="hidden lg:flex items-center space-x-2"
            >
              {domainNavigationItems.map((domainItem) => (
                <Link
                  key={domainItem.href}
                  href={domainItem.href}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                    pathname === domainItem.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  {domainItem.name}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Mobile Menu */}
          {showMobileMenu && renderMobileNavigation()}
        </div>
      </div>
    </header>
  );

  return renderVariant();
};

export default UniversalNavigation;

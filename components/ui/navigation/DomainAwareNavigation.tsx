"use client";

// 1. React Imports
import React, { useState, useEffect } from "react";

// 2. External Libraries
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb,
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaGraduationCap,
  FaTrophy,
  FaBlog,
  FaEnvelope,
} from "react-icons/fa";

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { cn } from "@/lib/utils/cn";
import { useSafePathname } from "@/lib/utils/hydration";
import { useOptimizedDomainTheme, useCurrentDomain, useDomainOperations } from "@/lib/contexts/DomainThemeContext";
// import { useNavigationThemeMigration } from "@/lib/theme/migration/MenuMigrationBridge"; // Removed during cleanup
import { DOMAINS, DOMAIN_CONFIGS, getDomainConfig, type Domain } from "@/lib/constants/domains";
import { focusUtils, announceUtils, keyboardUtils } from "@/lib/utils/accessibility";
import { Button } from "@/components/ui/base/Button";
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { mainNavigationItems, domainIcons, type NavigationItem } from "@/data/navigation";
// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (Included inline above)

// 6. Stylesheets
// (None in this component)

// NavigationItem interface now imported from @/data/navigation

interface DomainAwareNavigationProps {
  currentDomain?: Domain;
  className?: string;
  /** Whether to show domain switching controls */
  showDomainSwitcher?: boolean;
  /** Callback when domain changes */
  onDomainChange?: (domain: Domain) => void;
  /** ARIA label for the navigation */
  ariaLabel?: string;
}

// Navigation data now imported from centralized data file
const mainNavItems = mainNavigationItems;

// Generate domain navigation items from constants
const domainNavItems: NavigationItem[] = DOMAINS.map(domainId => {
  const config = getDomainConfig(domainId);
  return {
    name: config.shortName,
    href: config.path,
    icon: domainIcons[domainId],
    domain: domainId,
    description: config.description,
  };
});

export function DomainAwareNavigation({
  currentDomain,
  className,
  showDomainSwitcher = true,
  onDomainChange,
  ariaLabel = "Main navigation",
}: DomainAwareNavigationProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const pathname = usePathname();
  const { isActiveLink } = useSafePathname(pathname);
  
  // Migration bridge - provides unified API for both old and new theme systems
  // const themeBridge = useNavigationThemeMigration(); // Removed during cleanup
  
  // Use single context access to avoid hooks conflicts
  const domainContext = useOptimizedDomainTheme();
  
  // Use domain context for theme data
  const activeDomain = currentDomain || domainContext?.state?.currentDomain;
  const currentDomainColor = domainContext?.getCurrentDomainColor?.() || '#3B82F6'; // Fallback color
  const setCurrentDomain = domainContext?.setCurrentDomain || (() => {});
  const isDomainActive = domainContext?.isDomainActive || (() => false);
  const currentDomainConfig = activeDomain ? getDomainConfig(activeDomain) : null;
  
  // Get navigation styles from migration bridge
  // Use domain context for navigation styles
  const navBarStyles = {}; // Fallback to default styles
  const isUsingUnifiedTheme = false; // Default to context-based theme

  // Refs for keyboard navigation
  const navRef = React.useRef<HTMLElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle domain change with migration bridge support
  const handleDomainChange = React.useCallback((domain: Domain) => {
    // Try unified theme system first
    // Use domain context for domain switching
    // (unified theme bridge removed during cleanup)
    setCurrentDomain(domain);
    
    onDomainChange?.(domain);
    announceUtils.announce(`Switched to ${getDomainConfig(domain).name} domain`, 'polite');
  }, [setCurrentDomain, onDomainChange]);

  // Keyboard navigation for main nav
  const handleMainNavKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    const navItems = navRef.current?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    if (!navItems) return;

    const newIndex = keyboardUtils.handleArrowNavigation(
      e.nativeEvent,
      Array.from(navItems),
      focusedIndex,
      { orientation: 'horizontal', wrap: true }
    );
    
    setFocusedIndex(newIndex);
  }, [focusedIndex]);

  // Handle dropdown keyboard navigation
  const handleDropdownKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      // Focus back to trigger
      const trigger = navRef.current?.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      trigger?.focus();
    }
  }, []);

  // Handle mobile menu toggle
  const handleMobileToggle = React.useCallback(() => {
    setIsOpen(!isOpen);
    announceUtils.announce(
      isOpen ? 'Navigation menu closed' : 'Navigation menu opened',
      'assertive'
    );
  }, [isOpen]);

  // Close mobile menu on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        announceUtils.announce('Navigation menu closed', 'assertive');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav
        role="navigation"
        aria-label={ariaLabel}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent",
          className,
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MA</span>
                </div>
                <span className="text-white font-semibold text-base">
                  Mikhail Ajaj
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {mainNavItems.map((item) => (
                <Link
                  key={`ssr-${item.href}`}
                  href={item.href}
                  className="px-2 py-1 rounded-md text-sm font-medium text-muted-foreground hover:text-white min-h-[32px] flex items-center"
                >
                  <span className="flex items-center space-x-2">
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>
            
            <div className="md:hidden">
              <div className="text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
                <FaBars />
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      role="navigation"
      aria-label={ariaLabel}
      onKeyDown={handleMainNavKeyDown}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent",
        className,
      )}
      style={{
        borderBottomColor: scrolled ? `${currentDomainColor}20` : 'transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-10">
          {/* Logo and Current Domain */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">MA</span>
              </div>
              <span className="text-white font-semibold text-base">
                Mikhail Ajaj
              </span>
            </Link>

            {currentDomainConfig && (
              <div 
                className="hidden md:flex items-center space-x-2 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm"
                role="status"
                aria-label={`Current domain: ${currentDomainConfig.name}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentDomainConfig.color }}
                  aria-hidden="true"
                />
                <span className="text-white text-xs font-medium">
                  {currentDomainConfig.name}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {/* Theme Button */}
            <ThemeSwitcher />
            {/* Main Navigation */}
            {mainNavItems.map((item, index) => (
              <Link
                key={`desktop-${item.href}`}
                href={item.href}
                role="menuitem"
                tabIndex={focusedIndex === index ? 0 : -1}
                aria-current={isActiveLink(item.href) ? 'page' : undefined}
                className={cn(
                  "px-2 py-1 rounded-md text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  "min-h-[32px] flex items-center", // Touch target size
                  isActiveLink(item.href)
                    ? "text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10",
                )}
                style={{
                  backgroundColor: isActiveLink(item.href) ? `${currentDomainColor}40` : undefined,
                  focusRingColor: currentDomainColor,
                }}
                onFocus={() => setFocusedIndex(index)}
              >
                <span className="flex items-center space-x-2">
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}

            {/* Domain Dropdown */}
            {showDomainSwitcher && (
              <div className="relative">
                <button
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-controls="domain-dropdown"
                  tabIndex={focusedIndex === mainNavItems.length ? 0 : -1}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onFocus={() => setFocusedIndex(mainNavItems.length)}
                  className={cn(
                    "px-2 py-1 rounded-md text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "min-h-[32px] flex items-center",
                    "text-muted-foreground hover:text-white hover:bg-white/10",
                  )}
                  style={{ focusRingColor: currentDomainColor }}
                >
                  Expertise
                  <motion.span
                    className="ml-1"
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    aria-hidden="true"
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      ref={dropdownRef}
                      id="domain-dropdown"
                      role="menu"
                      aria-labelledby="domain-dropdown-trigger"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      onKeyDown={handleDropdownKeyDown}
                      className="absolute top-full left-0 mt-1 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-50"
                      style={{ borderColor: `${currentDomainColor}30` }}
                    >
                      <div className="p-2">
                        {domainNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={() => {
                              setDropdownOpen(false);
                              if (item.domain) {
                                handleDomainChange(item.domain);
                              }
                            }}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                              "min-h-[44px]", // Touch target size
                              isActiveLink(item.href)
                                ? "text-white"
                                : "text-muted-foreground hover:text-white hover:bg-white/10",
                            )}
                            style={{
                              backgroundColor: isActiveLink(item.href) 
                                ? `${item.domain ? getDomainConfig(item.domain).color : currentDomainColor}40` 
                                : undefined,
                              focusRingColor: item.domain ? getDomainConfig(item.domain).color : currentDomainColor,
                            }}
                          >
                            <span
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                              style={{
                                backgroundColor: item.domain ? getDomainConfig(item.domain).color : currentDomainColor,
                              }}
                              aria-hidden="true"
                            >
                              {item.icon}
                            </span>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
           
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileToggle}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              className="text-white min-h-[44px] min-w-[44px]"
              style={{ focusRingColor: currentDomainColor }}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="menu"
            aria-labelledby="mobile-menu-button"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md border-t"
            style={{ borderTopColor: `${currentDomainColor}30` }}
          >
            <div className="px-4 py-2 space-y-2">
              {/* Theme Button for Mobile */}
              <div className="flex justify-center py-2 border-b border-white/20 mb-2">
                <ThemeSwitcher />
              </div>
              
              {/* Main Navigation */}
              {mainNavItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    announceUtils.announce(`Navigated to ${item.name}`, 'polite');
                  }}
                  aria-current={isActiveLink(item.href) ? 'page' : undefined}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    "min-h-[48px]", // Larger touch targets on mobile
                    isActiveLink(item.href)
                      ? "text-white"
                      : "text-muted-foreground hover:text-white hover:bg-white/10",
                  )}
                  style={{
                    backgroundColor: isActiveLink(item.href) ? `${currentDomainColor}40` : undefined,
                    focusRingColor: currentDomainColor,
                  }}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Domain Navigation */}
              {showDomainSwitcher && (
                <div className="pt-2 border-t" style={{ borderTopColor: `${currentDomainColor}30` }}>
                  <div 
                    className="text-muted-foreground text-xs font-medium uppercase tracking-wider px-3 py-2"
                    role="presentation"
                  >
                    Expertise Areas
                  </div>
                  {domainNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => {
                        setIsOpen(false);
                        if (item.domain) {
                          handleDomainChange(item.domain);
                        }
                        announceUtils.announce(`Navigated to ${item.name}`, 'polite');
                      }}
                      aria-current={isActiveLink(item.href) ? 'page' : undefined}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                        "min-h-[48px]", // Larger touch targets on mobile
                        isActiveLink(item.href)
                          ? "text-white"
                          : "text-muted-foreground hover:text-white hover:bg-white/10",
                      )}
                      style={{
                        backgroundColor: isActiveLink(item.href) 
                          ? `${item.domain ? getDomainConfig(item.domain).color : currentDomainColor}40` 
                          : undefined,
                        focusRingColor: item.domain ? getDomainConfig(item.domain).color : currentDomainColor,
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
                        style={{
                          backgroundColor: item.domain ? getDomainConfig(item.domain).color : currentDomainColor,
                        }}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSafePathname } from "@/lib/utils/hydration";
import { useDomainTheme } from "@/lib/contexts/DomainThemeContext";
import { getDomainConfig, type Domain } from "@/lib/constants/domains";
import { announceUtils, keyboardUtils } from "@/lib/utils/accessibility";

export interface UseNavigationOptions {
  initialDomain?: Domain;
  enableKeyboardNavigation?: boolean;
  enableScrollEffects?: boolean;
  mobileBreakpoint?: number;
  ariaLabel?: string;
}

export interface UseNavigationReturn {
  // State
  mounted: boolean;
  isOpen: boolean;
  scrolled: boolean;
  focusedIndex: number;
  dropdownOpen: boolean;
  
  // Domain state
  activeDomain: Domain | null;
  currentDomainConfig: ReturnType<typeof getDomainConfig> | null;
  currentDomainColor: string;
  
  // Navigation data
  pathname: string;
  
  // Refs
  navRef: React.RefObject<HTMLElement>;
  dropdownRef: React.RefObject<HTMLDivElement>;
  
  // Handlers
  handleMobileToggle: () => void;
  handleDomainChange: (domain: Domain) => void;
  handleMainNavKeyDown: (e: React.KeyboardEvent) => void;
  handleDropdownKeyDown: (e: React.KeyboardEvent) => void;
  
  // State setters
  setFocusedIndex: (index: number) => void;
  setDropdownOpen: (open: boolean) => void;
  
  // Utilities
  isActiveLink: (href: string) => boolean;
}

export function useNavigation(options: UseNavigationOptions = {}): UseNavigationReturn {
  const {
    initialDomain,
    enableKeyboardNavigation = true,
    enableScrollEffects = true,
    mobileBreakpoint = 768,
    ariaLabel = "Main navigation"
  } = options;

  // Core state
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Navigation utilities
  const pathname = usePathname();
  const { isActiveLink } = useSafePathname(pathname);
  const { 
    currentDomain: contextDomain, 
    setCurrentDomain, 
    currentDomainColor 
  } = useDomainTheme();

  // Domain state
  const activeDomain = initialDomain || contextDomain;
  const currentDomainConfig = activeDomain ? getDomainConfig(activeDomain) : null;

  // Refs for keyboard navigation
  const navRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll effect
  useEffect(() => {
    if (!enableScrollEffects || !mounted) return;
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableScrollEffects, mounted]);

  // Handle domain change
  const handleDomainChange = useCallback((domain: Domain) => {
    setCurrentDomain(domain);
    announceUtils.announce(`Switched to ${getDomainConfig(domain).name} domain`, 'polite');
  }, [setCurrentDomain]);

  // Keyboard navigation for main nav
  const handleMainNavKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;
    
    const navItems = navRef.current?.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLElement>;
    if (!navItems) return;

    const newIndex = keyboardUtils.handleArrowNavigation(
      e.nativeEvent,
      Array.from(navItems),
      focusedIndex,
      { orientation: 'horizontal', wrap: true }
    );
    
    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
    }
  }, [focusedIndex, enableKeyboardNavigation]);

  // Handle dropdown keyboard navigation
  const handleDropdownKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;
    
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      // Focus back to trigger
      const trigger = navRef.current?.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      trigger?.focus();
    }
  }, [enableKeyboardNavigation]);

  // Handle mobile menu toggle
  const handleMobileToggle = useCallback(() => {
    setIsOpen(!isOpen);
    announceUtils.announce(
      isOpen ? 'Navigation menu closed' : 'Navigation menu opened',
      'assertive'
    );
  }, [isOpen]);

  // Close mobile menu on escape
  useEffect(() => {
    if (!enableKeyboardNavigation) return;
    
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
  }, [isOpen, enableKeyboardNavigation]);

  return {
    // State
    mounted,
    isOpen,
    scrolled,
    focusedIndex,
    dropdownOpen,
    
    // Domain state
    activeDomain,
    currentDomainConfig,
    currentDomainColor,
    
    // Navigation data
    pathname,
    
    // Refs
    navRef,
    dropdownRef,
    
    // Handlers
    handleMobileToggle,
    handleDomainChange,
    handleMainNavKeyDown,
    handleDropdownKeyDown,
    
    // State setters
    setFocusedIndex,
    setDropdownOpen,
    
    // Utilities
    isActiveLink,
  };
}
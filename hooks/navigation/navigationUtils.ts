"use client";

import { cn } from "@/lib/utils/cn";
import { getDomainConfig, type Domain } from "@/lib/constants/domains";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  domain?: Domain;
  description?: string;
}

export interface NavigationItemStyleOptions {
  isActive: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  domainColor: string;
  variant?: 'desktop' | 'mobile' | 'dropdown';
}

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

// Navigation item utilities
export const navigationItemUtils = {
  /**
   * Get CSS classes for navigation items based on state
   */
  getItemClasses: (options: NavigationItemStyleOptions): string => {
    const { isActive, isHovered, isFocused, variant = 'desktop' } = options;
    
    const baseClasses = [
      "transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "flex items-center"
    ];

    const variantClasses = {
      desktop: [
        "px-2 py-1 rounded-md text-sm font-medium",
        "min-h-[32px]"
      ],
      mobile: [
        "px-3 py-2 rounded-md text-sm font-medium",
        "min-h-[48px]"
      ],
      dropdown: [
        "px-3 py-2 rounded-md text-sm",
        "min-h-[44px]"
      ]
    };

    const stateClasses = isActive
      ? ["text-white"]
      : ["text-muted-foreground hover:text-white hover:bg-white/10"];

    return cn([
      ...baseClasses,
      ...variantClasses[variant],
      ...stateClasses
    ]);
  },

  /**
   * Get inline styles for navigation items
   */
  getItemStyles: (options: NavigationItemStyleOptions): React.CSSProperties => {
    const { isActive, domainColor } = options;
    
    return {
      backgroundColor: isActive ? `${domainColor}40` : undefined,
      '--focus-ring-color': domainColor,
    } as React.CSSProperties;
  },

  /**
   * Check if a navigation item should be considered active
   */
  isItemActive: (itemHref: string, currentPath: string, isActiveLink: (href: string) => boolean): boolean => {
    return isActiveLink(itemHref);
  },

  /**
   * Get ARIA attributes for navigation items
   */
  getItemAriaAttributes: (item: NavigationItem, isActive: boolean, index?: number) => ({
    role: "menuitem" as const,
    tabIndex: index !== undefined ? (index === 0 ? 0 : -1) : undefined,
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-label': item.description ? `${item.name}: ${item.description}` : item.name,
  }),
};

// Domain-aware styling utilities
export const domainStylingUtils = {
  /**
   * Get domain-specific colors and styling
   */
  getDomainStyling: (domain: Domain | null) => {
    if (!domain) return { color: '#3b82f6', name: 'Default' };
    
    const config = getDomainConfig(domain);
    return {
      color: config.color,
      name: config.name,
      shortName: config.shortName,
      description: config.description,
    };
  },

  /**
   * Generate CSS custom properties for domain theming
   */
  getDomainCSSProperties: (domainColor: string) => ({
    '--domain-color': domainColor,
    '--domain-color-20': `${domainColor}20`,
    '--domain-color-30': `${domainColor}30`,
    '--domain-color-40': `${domainColor}40`,
  }),

  /**
   * Get border color for domain-aware components
   */
  getDomainBorderColor: (domainColor: string, opacity: number = 0.3): string => {
    return `${domainColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },
};

// Responsive utilities
export const responsiveUtils = {
  /**
   * Default breakpoints for navigation
   */
  defaultBreakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  } as ResponsiveBreakpoints,

  /**
   * Check if current viewport is mobile
   */
  isMobile: (breakpoint: number = 768): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  },

  /**
   * Get responsive classes based on viewport
   */
  getResponsiveClasses: (mobileClasses: string, desktopClasses: string): string => {
    return cn("md:hidden", mobileClasses, "md:flex", desktopClasses);
  },

  /**
   * Get touch-friendly sizing for mobile
   */
  getTouchTargetClasses: (variant: 'mobile' | 'desktop' = 'desktop'): string => {
    return variant === 'mobile' ? "min-h-[48px] min-w-[48px]" : "min-h-[32px] min-w-[32px]";
  },
};

// Accessibility utilities
export const accessibilityUtils = {
  /**
   * Generate ARIA labels for navigation components
   */
  getNavigationAriaLabel: (type: 'main' | 'mobile' | 'domain', isOpen?: boolean): string => {
    const labels = {
      main: "Main navigation",
      mobile: isOpen ? "Close navigation menu" : "Open navigation menu",
      domain: "Domain expertise navigation",
    };
    return labels[type];
  },

  /**
   * Get ARIA attributes for dropdown components
   */
  getDropdownAriaAttributes: (isOpen: boolean, dropdownId: string) => ({
    'aria-haspopup': 'menu' as const,
    'aria-expanded': isOpen,
    'aria-controls': dropdownId,
  }),

  /**
   * Get ARIA attributes for mobile menu button
   */
  getMobileMenuAriaAttributes: (isOpen: boolean, menuId: string) => ({
    'aria-expanded': isOpen,
    'aria-controls': menuId,
    'aria-label': isOpen ? "Close navigation menu" : "Open navigation menu",
  }),

  /**
   * Generate screen reader announcements for navigation actions
   */
  getNavigationAnnouncement: (action: 'open' | 'close' | 'navigate' | 'domain-switch', context?: string): string => {
    const announcements = {
      open: 'Navigation menu opened',
      close: 'Navigation menu closed',
      navigate: context ? `Navigated to ${context}` : 'Navigation completed',
      'domain-switch': context ? `Switched to ${context} domain` : 'Domain switched',
    };
    return announcements[action];
  },

  /**
   * Get keyboard navigation instructions
   */
  getKeyboardInstructions: (context: 'main' | 'dropdown' | 'mobile'): string => {
    const instructions = {
      main: "Use arrow keys to navigate, Enter to select",
      dropdown: "Use arrow keys to navigate, Enter to select, Escape to close",
      mobile: "Use Tab to navigate, Enter to select, Escape to close menu",
    };
    return instructions[context];
  },
};

// Animation and transition utilities
export const animationUtils = {
  /**
   * Get transition classes for smooth animations
   */
  getTransitionClasses: (duration: 'fast' | 'normal' | 'slow' = 'normal'): string => {
    const durations = {
      fast: "transition-all duration-150",
      normal: "transition-all duration-300",
      slow: "transition-all duration-500",
    };
    return durations[duration];
  },

  /**
   * Get hover animation classes
   */
  getHoverAnimationClasses: (): string => {
    return "transform hover:scale-105 transition-transform duration-200";
  },

  /**
   * Get focus animation classes
   */
  getFocusAnimationClasses: (): string => {
    return "focus-visible:scale-105 transition-transform duration-200";
  },
};

// Export all utilities as a single object for convenience
export const navigationUtils = {
  item: navigationItemUtils,
  domain: domainStylingUtils,
  responsive: responsiveUtils,
  accessibility: accessibilityUtils,
  animation: animationUtils,
};
/**
 * Navigation Data Configuration
 * 
 * Centralized navigation data separated from UI components.
 * This allows for easy maintenance and ensures all navigation
 * links point to existing pages.
 */

import React from "react";
import { 
  FaHome, 
  FaUser, 
  FaGraduationCap, 
  FaTrophy, 
  FaBlog, 
  FaEnvelope,
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb
} from "react-icons/fa";
import type { Domain } from "@/lib/constants/domains";

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  domain?: Domain;
  description?: string;
  isActive?: boolean; // Whether the page actually exists
}

/**
 * Main navigation items for the portfolio
 * All these pages exist and are functional
 */
export const mainNavigationItems: NavigationItem[] = [
  { 
    name: "Home", 
    href: "/", 
    icon: <FaHome />,
    isActive: true,
    description: "Portfolio homepage"
  },
  { 
    name: "About", 
    href: "/about", 
    icon: <FaUser />,
    isActive: true,
    description: "About Mikhail Ajaj"
  },
  { 
    name: "Experience", 
    href: "/experience", 
    icon: <FaUser />,
    isActive: true,
    description: "Professional experience timeline"
  },
  { 
    name: "Education", 
    href: "/education", 
    icon: <FaGraduationCap />,
    isActive: true,
    description: "Educational background and certifications"
  },
  { 
    name: "Achievements", 
    href: "/achievements", 
    icon: <FaTrophy />,
    isActive: true,
    description: "Awards, recognitions, and milestones"
  },
  { 
    name: "Projects", 
    href: "/projects", 
    icon: <FaTrophy />,
    isActive: true,
    description: "Project showcase and case studies"
  },
  { 
    name: "Services", 
    href: "/services", 
    icon: <FaCode />,
    isActive: true,
    description: "Professional services offered"
  },
  { 
    name: "Blog", 
    href: "/blog", 
    icon: <FaBlog />,
    isActive: true,
    description: "Technical articles and insights"
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: <FaEnvelope />,
    isActive: true,
    description: "Get in touch"
  }
];

/**
 * Secondary navigation items (future pages or alternative navigation)
 */
export const secondaryNavigationItems: NavigationItem[] = [
  // Currently empty - all main pages are active
];

/**
 * Mobile navigation items (simplified for mobile experience)
 */
export const mobileNavigationItems: NavigationItem[] = [
  { 
    name: "Home", 
    href: "/", 
    icon: <FaHome />,
    isActive: true
  },
  { 
    name: "About", 
    href: "/about", 
    icon: <FaUser />,
    isActive: true
  },
  { 
    name: "Projects", 
    href: "/projects", 
    icon: <FaTrophy />,
    isActive: true
  },
  { 
    name: "Services", 
    href: "/services", 
    icon: <FaCode />,
    isActive: true
  },
  { 
    name: "Blog", 
    href: "/blog", 
    icon: <FaBlog />,
    isActive: true
  },
  { 
    name: "Contact", 
    href: "/contact", 
    icon: <FaEnvelope />,
    isActive: true
  }
];

/**
 * Domain-specific navigation icons
 */
export const domainIcons: Record<Domain, React.ReactNode> = {
  'full-stack': <FaCode />,
  'cloud-engineering': <FaCloud />,
  'data-analytics': <FaChartBar />,
  'ux-ui-design': <FaPalette />,
  'technical-consulting': <FaLightbulb />,
};

/**
 * Get active navigation items only
 */
export const getActiveNavigationItems = (): NavigationItem[] => {
  return mainNavigationItems.filter(item => item.isActive);
};

/**
 * Get all navigation items (active and inactive)
 */
export const getAllNavigationItems = (): NavigationItem[] => {
  return [...mainNavigationItems, ...secondaryNavigationItems];
};

/**
 * Check if a navigation item exists and is active
 */
export const isNavigationItemActive = (href: string): boolean => {
  const allItems = getAllNavigationItems();
  const item = allItems.find(item => item.href === href);
  return item?.isActive ?? false;
};

/**
 * Get navigation item by href
 */
export const getNavigationItem = (href: string): NavigationItem | undefined => {
  const allItems = getAllNavigationItems();
  return allItems.find(item => item.href === href);
};
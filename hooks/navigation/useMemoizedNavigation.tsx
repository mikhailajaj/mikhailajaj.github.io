"use client";

import React, { useMemo } from "react";
import { 
  FaCode, FaCloud, FaChartBar, FaPalette, FaLightbulb,
  FaHome, FaUser, FaGraduationCap, FaTrophy, FaBlog, FaEnvelope
} from "react-icons/fa";
import { DOMAINS, getDomainConfig, type Domain } from "@/lib/constants/domains";
import { NavigationItem } from "./navigationUtils";

// Domain icon mapping
const domainIcons: Record<Domain, React.ReactNode> = {
  'full-stack': <FaCode />,
  'cloud': <FaCloud />,
  'data': <FaChartBar />,
  'ux-ui': <FaPalette />,
  'consulting': <FaLightbulb />,
};

// Static main navigation items
const staticMainNavItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: <FaHome /> },
  { name: "Experience", href: "/experience", icon: <FaUser /> },
  { name: "Education", href: "/education", icon: <FaGraduationCap /> },
  { name: "Achievements", href: "/achievements", icon: <FaTrophy /> },
  { name: "Blog", href: "/blog", icon: <FaBlog /> },
  { name: "Contact", href: "/contact", icon: <FaEnvelope /> },
  { name: "Tools", href: "/tools", icon: <FaLightbulb /> },
];

export interface UseMemoizedNavigationOptions {
  currentPath?: string;
  activeDomain?: Domain | null;
  includeMainNav?: boolean;
  includeDomainNav?: boolean;
}

export interface UseMemoizedNavigationReturn {
  mainNavItems: NavigationItem[];
  domainNavItems: NavigationItem[];
  allNavItems: NavigationItem[];
  activeMainNavItem: NavigationItem | null;
  activeDomainNavItem: NavigationItem | null;
  navigationMap: Map<string, NavigationItem>;
}

/**
 * Hook for memoized navigation data with performance optimization
 */
export function useMemoizedNavigation(options: UseMemoizedNavigationOptions = {}): UseMemoizedNavigationReturn {
  const {
    currentPath = "",
    activeDomain,
    includeMainNav = true,
    includeDomainNav = true
  } = options;

  // Memoize main navigation items
  const mainNavItems = useMemo(() => {
    if (!includeMainNav) return [];
    return staticMainNavItems;
  }, [includeMainNav]);

  // Memoize domain navigation items
  const domainNavItems = useMemo(() => {
    if (!includeDomainNav) return [];
    
    return DOMAINS.map(domainId => {
      const config = getDomainConfig(domainId);
      return {
        name: config.shortName,
        href: config.path,
        icon: domainIcons[domainId],
        domain: domainId,
        description: config.description,
      };
    });
  }, [includeDomainNav]);

  // Memoize combined navigation items
  const allNavItems = useMemo(() => {
    return [...mainNavItems, ...domainNavItems];
  }, [mainNavItems, domainNavItems]);

  // Memoize active navigation items
  const activeMainNavItem = useMemo(() => {
    return mainNavItems.find(item => {
      if (item.href === "/" && currentPath === "/") return true;
      if (item.href !== "/" && currentPath.startsWith(item.href)) return true;
      return false;
    }) || null;
  }, [mainNavItems, currentPath]);

  const activeDomainNavItem = useMemo(() => {
    return domainNavItems.find(item => {
      if (item.href === currentPath) return true;
      if (item.domain === activeDomain) return true;
      return false;
    }) || null;
  }, [domainNavItems, currentPath, activeDomain]);

  // Memoize navigation map for quick lookups
  const navigationMap = useMemo(() => {
    const map = new Map<string, NavigationItem>();
    allNavItems.forEach(item => {
      map.set(item.href, item);
      if (item.domain) {
        map.set(item.domain, item);
      }
    });
    return map;
  }, [allNavItems]);

  return {
    mainNavItems,
    domainNavItems,
    allNavItems,
    activeMainNavItem,
    activeDomainNavItem,
    navigationMap,
  };
}
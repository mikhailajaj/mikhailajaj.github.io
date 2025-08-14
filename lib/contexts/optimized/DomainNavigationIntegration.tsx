/**
 * Domain Navigation Integration
 * 
 * Provides seamless integration between domain theme context and Next.js navigation.
 * Handles automatic domain detection from routes and synchronization.
 * 
 * @fileoverview Domain navigation integration component
 */

"use client";

import React, { useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useOptimizedDomainTheme, type Domain } from './OptimizedDomainThemeContext';

/**
 * Domain navigation integration props
 */
interface DomainNavigationIntegrationProps {
  children: React.ReactNode;
  /** Whether to automatically sync domain with route changes */
  autoSync?: boolean;
  /** Whether to preload themes for route prefetching */
  enablePreloading?: boolean;
  /** Callback when domain changes via navigation */
  onNavigationDomainChange?: (domain: Domain, route: string) => void;
  /** Custom domain path mappings */
  customDomainPaths?: Partial<Record<Domain, string>>;
}

/**
 * Default domain path mappings
 */
const DEFAULT_DOMAIN_PATHS: Record<Domain, string> = {
  'full-stack': '/full-stack',
  'cloud': '/cloud-engineering',
  'data': '/data-analytics',
  'ux-ui': '/ux-ui-design',
  'consulting': '/technical-consulting'
};

/**
 * Domain Navigation Integration Component
 * 
 * Provides automatic synchronization between Next.js routing and domain theme context.
 * Handles route-based domain detection and theme preloading for better performance.
 */
export const DomainNavigationIntegration: React.FC<DomainNavigationIntegrationProps> = ({
  children,
  autoSync = true,
  enablePreloading = true,
  onNavigationDomainChange,
  customDomainPaths = {}
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const domainContext = useOptimizedDomainTheme();

  // Merge custom paths with defaults
  const domainPaths = useMemo(() => ({
    ...DEFAULT_DOMAIN_PATHS,
    ...customDomainPaths
  }), [customDomainPaths]);

  /**
   * Extract domain from current pathname
   */
  const extractDomainFromPath = useCallback((path: string): Domain | null => {
    for (const [domain, domainPath] of Object.entries(domainPaths)) {
      if (path.startsWith(domainPath)) {
        return domain as Domain;
      }
    }
    return null;
  }, [domainPaths]);

  /**
   * Get path for domain
   */
  const getPathForDomain = useCallback((domain: Domain): string => {
    return domainPaths[domain] || '/';
  }, [domainPaths]);

  /**
   * Navigate to domain with enhanced integration
   */
  const navigateToDomain = useCallback(async (
    domain: Domain, 
    specificPath?: string,
    options?: { replace?: boolean; scroll?: boolean }
  ): Promise<void> => {
    const targetPath = specificPath || getPathForDomain(domain);
    
    try {
      // Preload theme before navigation for smoother transition
      if (enablePreloading) {
        await domainContext.preloadDomainTheme(domain);
      }

      // Navigate using Next.js router
      if (options?.replace) {
        router.replace(targetPath, { scroll: options.scroll });
      } else {
        router.push(targetPath, { scroll: options.scroll });
      }

      // Update domain context
      domainContext.setCurrentDomain(domain);
      
      // Notify callback
      onNavigationDomainChange?.(domain, targetPath);
    } catch (error) {
      console.error('Navigation to domain failed:', error);
      // Fallback: just update domain without navigation
      domainContext.setCurrentDomain(domain);
    }
  }, [
    router, 
    domainContext, 
    getPathForDomain, 
    enablePreloading, 
    onNavigationDomainChange
  ]);

  /**
   * Sync domain with current pathname
   */
  const syncDomainWithPath = useCallback(() => {
    if (!autoSync) return;

    const routeDomain = extractDomainFromPath(pathname);
    if (routeDomain && routeDomain !== domainContext.state.currentDomain) {
      domainContext.setCurrentDomain(routeDomain);
      onNavigationDomainChange?.(routeDomain, pathname);
    }
  }, [
    autoSync, 
    pathname, 
    extractDomainFromPath, 
    domainContext, 
    onNavigationDomainChange
  ]);

  /**
   * Preload themes for likely navigation targets
   */
  const preloadLikelyThemes = useCallback(async () => {
    if (!enablePreloading) return;

    const currentDomain = domainContext.state.currentDomain;
    
    // Define likely navigation patterns
    const preloadCandidates: Domain[] = [];
    
    // Always preload main domains
    if (currentDomain !== 'full-stack') preloadCandidates.push('full-stack');
    if (currentDomain !== 'cloud') preloadCandidates.push('cloud');
    if (currentDomain !== 'data') preloadCandidates.push('data');
    
    // Preload themes in background
    preloadCandidates.forEach(domain => {
      domainContext.preloadDomainTheme(domain).catch(error => {
        console.warn(`Failed to preload theme for ${domain}:`, error);
      });
    });
  }, [enablePreloading, domainContext]);

  // Sync domain on pathname changes
  useEffect(() => {
    syncDomainWithPath();
  }, [syncDomainWithPath]);

  // Preload themes on mount and domain changes
  useEffect(() => {
    preloadLikelyThemes();
  }, [preloadLikelyThemes]);

  // Enhanced navigation methods available to children
  const navigationEnhancements = useMemo(() => ({
    navigateToDomain,
    extractDomainFromPath,
    getPathForDomain,
    syncDomainWithPath,
    currentDomainPath: getPathForDomain(domainContext.state.currentDomain),
    isCurrentPath: (path: string) => pathname.startsWith(path),
    getDomainFromCurrentPath: () => extractDomainFromPath(pathname)
  }), [
    navigateToDomain,
    extractDomainFromPath,
    getPathForDomain,
    syncDomainWithPath,
    domainContext.state.currentDomain,
    pathname
  ]);

  // Provide navigation enhancements through context if needed
  return (
    <DomainNavigationContext.Provider value={navigationEnhancements}>
      {children}
    </DomainNavigationContext.Provider>
  );
};

/**
 * Navigation enhancements context
 */
interface DomainNavigationContextValue {
  navigateToDomain: (domain: Domain, specificPath?: string, options?: { replace?: boolean; scroll?: boolean }) => Promise<void>;
  extractDomainFromPath: (path: string) => Domain | null;
  getPathForDomain: (domain: Domain) => string;
  syncDomainWithPath: () => void;
  currentDomainPath: string;
  isCurrentPath: (path: string) => boolean;
  getDomainFromCurrentPath: () => Domain | null;
}

const DomainNavigationContext = React.createContext<DomainNavigationContextValue | undefined>(undefined);

/**
 * Hook to use domain navigation enhancements
 */
export const useDomainNavigation = (): DomainNavigationContextValue => {
  const context = React.useContext(DomainNavigationContext);
  
  if (context === undefined) {
    throw new Error('useDomainNavigation must be used within a DomainNavigationIntegration');
  }
  
  return context;
};

/**
 * Hook for domain-aware link props
 */
export const useDomainLinkProps = (domain: Domain, specificPath?: string) => {
  const navigation = useDomainNavigation();
  const domainContext = useOptimizedDomainTheme();
  
  return useMemo(() => {
    const href = specificPath || navigation.getPathForDomain(domain);
    const isActive = domainContext.state.currentDomain === domain;
    
    return {
      href,
      'aria-current': isActive ? 'page' as const : undefined,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigation.navigateToDomain(domain, specificPath);
      },
      onMouseEnter: () => {
        // Preload theme on hover for better UX
        domainContext.preloadDomainTheme(domain);
      }
    };
  }, [domain, specificPath, navigation, domainContext]);
};

/**
 * Domain-aware Link component
 */
interface DomainLinkProps {
  domain: Domain;
  specificPath?: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
}

export const DomainLink: React.FC<DomainLinkProps> = ({
  domain,
  specificPath,
  children,
  className,
  replace = false,
  scroll = true
}) => {
  const navigation = useDomainNavigation();
  const domainContext = useOptimizedDomainTheme();
  
  const href = specificPath || navigation.getPathForDomain(domain);
  const isActive = domainContext.state.currentDomain === domain;
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigation.navigateToDomain(domain, specificPath, { replace, scroll });
  }, [navigation, domain, specificPath, replace, scroll]);
  
  const handleMouseEnter = useCallback(() => {
    // Preload theme on hover for better UX
    domainContext.preloadDomainTheme(domain);
  }, [domainContext, domain]);
  
  return (
    <a
      href={href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </a>
  );
};

export default DomainNavigationIntegration;
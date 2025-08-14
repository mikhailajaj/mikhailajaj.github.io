/**
 * Hydration Utilities
 * 
 * Utilities to prevent hydration mismatches in Next.js applications
 */

import React, { useState, useEffect } from 'react';

/**
 * Hook to safely handle client-side only operations
 * Prevents hydration mismatches by ensuring code only runs after hydration
 */
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook for safe pathname checking in navigation components
 * Prevents hydration mismatches when comparing pathnames
 */
export function useSafePathname(pathname: string) {
  const isHydrated = useIsHydrated();

  const isActiveLink = (href: string, exact = false) => {
    if (!isHydrated) return false;
    
    if (exact) {
      return pathname === href;
    }
    
    return pathname === href || (href !== "/" && pathname.startsWith(href));
  };

  return { isActiveLink, isHydrated };
}

/**
 * Component wrapper to prevent hydration mismatches
 * Only renders children after hydration is complete
 */
export function HydrationSafe({ 
  children, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Hook for safe window/document access
 * Prevents SSR errors when accessing browser APIs
 */
export function useSafeBrowser() {
  const isHydrated = useIsHydrated();

  const safeWindow = isHydrated ? window : undefined;
  const safeDocument = isHydrated ? document : undefined;
  const safeLocalStorage = isHydrated ? localStorage : undefined;
  const safeSessionStorage = isHydrated ? sessionStorage : undefined;

  return {
    window: safeWindow,
    document: safeDocument,
    localStorage: safeLocalStorage,
    sessionStorage: safeSessionStorage,
    isClient: isHydrated,
  };
}

/**
 * Hook for safe theme detection
 * Prevents hydration mismatches with theme-dependent rendering
 */
export function useSafeTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (isHydrated) {
      const detectTheme = () => {
        if (document.documentElement.classList.contains('dark')) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      };

      detectTheme();

      // Watch for theme changes
      const observer = new MutationObserver(detectTheme);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => observer.disconnect();
    }
  }, [isHydrated]);

  return { theme, isHydrated };
}

/**
 * Safe component for conditional rendering based on hydration
 */
export function ClientOnly({ 
  children, 
  fallback = <div style={{ minHeight: '1px' }} /> 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return <HydrationSafe fallback={fallback}>{children}</HydrationSafe>;
}

/**
 * Hook for safe media query matching
 * Prevents hydration mismatches with responsive components
 */
export function useSafeMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query, isHydrated]);

  return { matches, isHydrated };
}
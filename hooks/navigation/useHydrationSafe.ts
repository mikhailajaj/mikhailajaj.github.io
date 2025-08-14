"use client";

import { useState, useEffect, useRef } from "react";

export interface UseHydrationSafeOptions {
  fallbackValue?: any;
  onHydrated?: () => void;
  onHydrationError?: (error: Error) => void;
}

export interface UseHydrationSafeReturn<T> {
  isHydrated: boolean;
  value: T;
  error: Error | null;
}

/**
 * Hook for hydration-safe state management with error handling
 */
export function useHydrationSafe<T>(
  clientValue: T,
  options: UseHydrationSafeOptions = {}
): UseHydrationSafeReturn<T> {
  const {
    fallbackValue,
    onHydrated,
    onHydrationError
  } = options;

  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      if (!hasHydrated.current) {
        hasHydrated.current = true;
        setIsHydrated(true);
        onHydrated?.();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Hydration error');
      setError(error);
      onHydrationError?.(error);
    }
  }, [onHydrated, onHydrationError]);

  const value = isHydrated ? clientValue : (fallbackValue ?? clientValue);

  return {
    isHydrated,
    value,
    error,
  };
}

/**
 * Hook specifically for hydration-safe navigation state
 */
export function useHydrationSafeNavigation() {
  const [mounted, setMounted] = useState(false);
  const [hydrationError, setHydrationError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setMounted(true);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Navigation hydration error');
      setHydrationError(error);
    }
  }, []);

  return {
    mounted,
    hydrationError,
    isHydrationSafe: mounted && !hydrationError,
  };
}

/**
 * Hook for hydration-safe scroll state
 */
export function useHydrationSafeScroll() {
  const [scrollY, setScrollY] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setScrollY(window.scrollY);
  }, []);

  return {
    scrollY: isHydrated ? scrollY : 0,
    isHydrated,
  };
}

/**
 * Hook for hydration-safe viewport detection
 */
export function useHydrationSafeViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    isMobile: false,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
      });
    };

    setIsHydrated(true);
    updateViewport();

    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return {
    ...viewport,
    isHydrated,
  };
}
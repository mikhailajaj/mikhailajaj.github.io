"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseThrottledScrollOptions {
  delay?: number;
  threshold?: number;
  enabled?: boolean;
}

export interface UseThrottledScrollReturn {
  scrolled: boolean;
  scrollY: number;
  isScrollingDown: boolean;
  isScrollingUp: boolean;
}

/**
 * Hook for throttled scroll event handling with performance optimization
 */
export function useThrottledScroll(options: UseThrottledScrollOptions = {}): UseThrottledScrollReturn {
  const {
    delay = 16, // ~60fps
    threshold = 50,
    enabled = true
  } = options;

  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollState = useCallback(() => {
    const currentScrollY = window.scrollY;
    const previousScrollY = lastScrollY.current;

    setScrollY(currentScrollY);
    setScrolled(currentScrollY > threshold);
    setIsScrollingDown(currentScrollY > previousScrollY && currentScrollY > threshold);
    setIsScrollingUp(currentScrollY < previousScrollY && currentScrollY > threshold);

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, [threshold]);

  const requestTick = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(updateScrollState);
    }
  }, [updateScrollState]);

  const throttledScrollHandler = useCallback(() => {
    requestTick();
  }, [requestTick]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Set initial state
    setScrollY(window.scrollY);
    setScrolled(window.scrollY > threshold);
    lastScrollY.current = window.scrollY;

    // Add throttled scroll listener
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [enabled, threshold, throttledScrollHandler]);

  return {
    scrolled,
    scrollY,
    isScrollingDown,
    isScrollingUp,
  };
}
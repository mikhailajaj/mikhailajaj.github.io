'use client';
import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [supportsScrollTimeline, setSupportsScrollTimeline] = useState(true);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if browser supports scroll-driven animations
    const checkSupport = () => {
      try {
        // Check for CSS.supports
        if (typeof CSS !== 'undefined' && CSS.supports) {
          return CSS.supports('animation-timeline', 'scroll()');
        }
        return false;
      } catch {
        return false;
      }
    };

    setSupportsScrollTimeline(checkSupport());
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || supportsScrollTimeline) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, supportsScrollTimeline]);

  return {
    ref: elementRef,
    isVisible,
    supportsScrollTimeline,
  };
};

// Hook for scroll progress
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return scrollProgress;
};

// Hook for element scroll progress
export const useElementScrollProgress = (elementRef: React.RefObject<HTMLElement>) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateProgress = () => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate progress based on element position
      const startOffset = windowHeight;
      const endOffset = -elementHeight;
      const totalDistance = startOffset - endOffset;
      const currentDistance = startOffset - elementTop;
      
      const progress = Math.max(0, Math.min(1, currentDistance / totalDistance));
      setProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
};
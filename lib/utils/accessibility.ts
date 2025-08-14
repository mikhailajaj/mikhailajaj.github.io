/**
 * Accessibility Utilities
 * 
 * Comprehensive utilities for implementing WCAG 2.1 AA compliance
 * and enhancing accessibility throughout the portfolio.
 * 
 * @fileoverview Accessibility helper functions and utilities
 */

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Trap focus within a container element
   * Useful for modals, dropdowns, and other overlay components
   */
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },
  
  /**
   * Get all focusable elements within a container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.disabled && el.offsetParent !== null);
  },
  
  /**
   * Move focus to the next/previous focusable element
   */
  moveFocus: (direction: 'next' | 'previous', container?: HTMLElement) => {
    const root = container || document.body;
    const focusableElements = focusUtils.getFocusableElements(root);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    
    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    }
    
    focusableElements[nextIndex]?.focus();
  }
};

/**
 * Screen reader announcement utilities
 */
export const announceUtils = {
  /**
   * Announce a message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 1000);
  },
  
  /**
   * Create a live region for dynamic content updates
   */
  createLiveRegion: (id: string, priority: 'polite' | 'assertive' = 'polite'): HTMLElement => {
    let region = document.getElementById(id);
    
    if (!region) {
      region = document.createElement('div');
      region.id = id;
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }
    
    return region;
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardUtils = {
  /**
   * Handle arrow key navigation for lists and grids
   */
  handleArrowNavigation: (
    e: KeyboardEvent, 
    items: HTMLElement[], 
    currentIndex: number,
    options: {
      orientation?: 'horizontal' | 'vertical' | 'both';
      wrap?: boolean;
      columns?: number;
    } = {}
  ): number => {
    const { orientation = 'both', wrap = true, columns = 1 } = options;
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = wrap && currentIndex === items.length - 1 ? 0 : Math.min(currentIndex + 1, items.length - 1);
        }
        break;
        
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          e.preventDefault();
          newIndex = wrap && currentIndex === 0 ? items.length - 1 : Math.max(currentIndex - 1, 0);
        }
        break;
        
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          const nextRowIndex = currentIndex + columns;
          if (nextRowIndex < items.length) {
            newIndex = nextRowIndex;
          } else if (wrap) {
            newIndex = currentIndex % columns;
          }
        }
        break;
        
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          e.preventDefault();
          const prevRowIndex = currentIndex - columns;
          if (prevRowIndex >= 0) {
            newIndex = prevRowIndex;
          } else if (wrap) {
            const lastRowStart = Math.floor((items.length - 1) / columns) * columns;
            newIndex = Math.min(lastRowStart + (currentIndex % columns), items.length - 1);
          }
        }
        break;
        
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }
    
    if (newIndex !== currentIndex && items[newIndex]) {
      items[newIndex].focus();
    }
    
    return newIndex;
  }
};

/**
 * Color contrast utilities
 */
export const contrastUtils = {
  /**
   * Calculate relative luminance of a color
   */
  getLuminance: (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },
  
  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: string, color2: string): number => {
    const lum1 = contrastUtils.getLuminance(color1);
    const lum2 = contrastUtils.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  },
  
  /**
   * Check if color combination meets WCAG AA standards
   */
  meetsWCAGAA: (foreground: string, background: string, isLargeText = false): boolean => {
    const ratio = contrastUtils.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }
};

/**
 * Reduced motion utilities
 */
export const motionUtils = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  /**
   * Get animation duration based on user preference
   */
  getAnimationDuration: (normalDuration: number): number => {
    return motionUtils.prefersReducedMotion() ? 0 : normalDuration;
  },
  
  /**
   * Create a media query listener for reduced motion preference
   */
  onReducedMotionChange: (callback: (prefersReduced: boolean) => void): (() => void) => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    
    // Return cleanup function
    return () => mediaQuery.removeEventListener('change', handler);
  }
};

/**
 * ARIA utilities
 */
export const ariaUtils = {
  /**
   * Generate unique IDs for ARIA relationships
   */
  generateId: (prefix = 'aria'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },
  
  /**
   * Set up ARIA relationships between elements
   */
  linkElements: (
    trigger: HTMLElement, 
    target: HTMLElement, 
    relationship: 'describedby' | 'labelledby' | 'controls' | 'owns'
  ): void => {
    if (!target.id) {
      target.id = ariaUtils.generateId();
    }
    
    const existingIds = trigger.getAttribute(`aria-${relationship}`)?.split(' ') || [];
    if (!existingIds.includes(target.id)) {
      existingIds.push(target.id);
      trigger.setAttribute(`aria-${relationship}`, existingIds.join(' '));
    }
  }
};

/**
 * Touch accessibility utilities for mobile
 */
export const touchUtils = {
  /**
   * Ensure minimum touch target size (44px x 44px)
   */
  ensureTouchTargetSize: (element: HTMLElement): void => {
    const rect = element.getBoundingClientRect();
    const minSize = 44;
    
    if (rect.width < minSize || rect.height < minSize) {
      console.warn('Touch target too small:', element, `${rect.width}x${rect.height}px`);
    }
  },
  
  /**
   * Check if device supports touch
   */
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
};
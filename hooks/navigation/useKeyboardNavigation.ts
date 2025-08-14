"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { keyboardUtils } from "@/lib/utils/accessibility";

export interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  wrap?: boolean;
  itemSelector?: string;
  onNavigate?: (index: number, element: HTMLElement) => void;
  onActivate?: (index: number, element: HTMLElement) => void;
}

export interface UseKeyboardNavigationReturn {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  resetFocus: () => void;
  focusItem: (index: number) => void;
  containerRef: React.RefObject<HTMLElement>;
}

/**
 * Hook for efficient keyboard navigation with performance optimization
 */
export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}): UseKeyboardNavigationReturn {
  const {
    enabled = true,
    orientation = 'horizontal',
    wrap = true,
    itemSelector = '[role="menuitem"]',
    onNavigate,
    onActivate
  } = options;

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLElement>(null);
  const lastInteractionTime = useRef(0);

  // Throttle keyboard interactions to prevent excessive processing
  const throttleDelay = 50; // 50ms throttle

  const getNavigationItems = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    return Array.from(containerRef.current.querySelectorAll(itemSelector)) as HTMLElement[];
  }, [itemSelector]);

  const focusItem = useCallback((index: number) => {
    const items = getNavigationItems();
    if (index >= 0 && index < items.length) {
      const item = items[index];
      item.focus();
      setFocusedIndex(index);
      onNavigate?.(index, item);
    }
  }, [getNavigationItems, onNavigate]);

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!enabled) return;

    const now = Date.now();
    if (now - lastInteractionTime.current < throttleDelay) {
      return;
    }
    lastInteractionTime.current = now;

    const items = getNavigationItems();
    if (items.length === 0) return;

    const currentIndex = focusedIndex >= 0 ? focusedIndex : 0;

    // Handle navigation keys
    let newIndex = currentIndex;
    let handled = false;

    switch (e.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          newIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
          handled = true;
        }
        break;
      
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          newIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
          handled = true;
        }
        break;
      
      case 'ArrowDown':
        if (orientation === 'vertical') {
          newIndex = wrap ? (currentIndex + 1) % items.length : Math.min(currentIndex + 1, items.length - 1);
          handled = true;
        }
        break;
      
      case 'ArrowUp':
        if (orientation === 'vertical') {
          newIndex = wrap ? (currentIndex - 1 + items.length) % items.length : Math.max(currentIndex - 1, 0);
          handled = true;
        }
        break;
      
      case 'Home':
        newIndex = 0;
        handled = true;
        break;
      
      case 'End':
        newIndex = items.length - 1;
        handled = true;
        break;
      
      case 'Enter':
      case ' ':
        if (currentIndex >= 0 && currentIndex < items.length) {
          const item = items[currentIndex];
          onActivate?.(currentIndex, item);
          // Trigger click event
          item.click();
          handled = true;
        }
        break;
    }

    if (handled) {
      e.preventDefault();
      e.stopPropagation();
      
      if (newIndex !== currentIndex) {
        focusItem(newIndex);
      }
    }
  }, [enabled, focusedIndex, orientation, wrap, getNavigationItems, focusItem, onActivate]);

  // Reset focus when items change
  useEffect(() => {
    const items = getNavigationItems();
    if (focusedIndex >= items.length) {
      setFocusedIndex(items.length > 0 ? 0 : -1);
    }
  }, [focusedIndex, getNavigationItems]);

  return {
    focusedIndex,
    setFocusedIndex,
    handleKeyDown,
    resetFocus,
    focusItem,
    containerRef,
  };
}
/**
 * SwipeGestureHandler Component
 * 
 * Provides swipe gesture support for mobile navigation and content interaction.
 * Implements thumb-zone optimized gestures with accessibility support.
 */

"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SwipeGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventScroll?: boolean;
  className?: string;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function SwipeGestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  preventScroll = false,
  className = "",
}: SwipeGestureHandlerProps) {
  const touchStartRef = useRef<TouchPosition | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setIsScrolling(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Determine if user is scrolling vertically
    if (deltaY > deltaX && deltaY > 10) {
      setIsScrolling(true);
    }

    // Prevent scroll if horizontal swipe is detected and preventScroll is enabled
    if (preventScroll && deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  }, [preventScroll]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || isScrolling) {
      touchStartRef.current = null;
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Only trigger swipe if gesture is fast enough (within 300ms) and meets threshold
    if (deltaTime > 300) {
      touchStartRef.current = null;
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Horizontal swipes
    if (absDeltaX > threshold && absDeltaX > absDeltaY) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    // Vertical swipes
    else if (absDeltaY > threshold && absDeltaY > absDeltaX) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    touchStartRef.current = null;
  }, [isScrolling, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        touchAction: preventScroll ? 'pan-y' : 'auto',
      }}
    >
      {children}
    </div>
  );
}

/**
 * SwipeNavigationWrapper Component
 * 
 * Wrapper component that adds swipe navigation between pages.
 * Implements common navigation patterns for mobile users.
 */

interface SwipeNavigationWrapperProps {
  children: React.ReactNode;
  previousPage?: string;
  nextPage?: string;
  className?: string;
}

export function SwipeNavigationWrapper({
  children,
  previousPage,
  nextPage,
  className = "",
}: SwipeNavigationWrapperProps) {
  const router = useRouter();

  const handleSwipeLeft = useCallback(() => {
    if (nextPage) {
      router.push(nextPage);
    }
  }, [router, nextPage]);

  const handleSwipeRight = useCallback(() => {
    if (previousPage) {
      router.push(previousPage);
    }
  }, [router, previousPage]);

  return (
    <SwipeGestureHandler
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      className={className}
      threshold={100} // Higher threshold for page navigation
    >
      {children}
    </SwipeGestureHandler>
  );
}

export default SwipeGestureHandler;
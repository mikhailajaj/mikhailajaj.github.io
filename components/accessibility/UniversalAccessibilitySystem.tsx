"use client";

import React from "react";
import { AccessibilityProvider, useAccessibility } from "./context/AccessibilityContext";
import { SkipLink } from "./components/SkipLink";
import { ScreenReaderAnnouncer } from "./components/ScreenReaderAnnouncer";
import {
  AccessibleButton,
  AccessibleField,
  AccessibilityToolbar,
  AdaptiveHero,
  FocusTrap,
  LazySection,
  ProgressiveDisclosure,
} from "./components";

/**
 * Universal Accessibility System
 * 
 * Consolidated system combining:
 * - Sally's Accessibility Framework (WCAG 2.1 AA compliance)
 * - Sally's Cognitive Optimizer (HCI principles & cognitive psychology)
 * 
 * This replaces both sally-accessibility-framework.tsx and sally-cognitive-optimizer.tsx
 * with a unified, well-organized accessibility system.
 * 
 * Features:
 * - WCAG 2.1 AA compliance
 * - Cognitive load optimization
 * - Adaptive user interfaces
 * - Performance monitoring
 * - Screen reader support
 * - Keyboard navigation
 * - High contrast mode
 * - Font size adjustment
 * - Progressive disclosure
 * - Lazy loading with performance metrics
 */

interface UniversalAccessibilitySystemProps {
  children: React.ReactNode;
}

export function UniversalAccessibilitySystem({ 
  children 
}: UniversalAccessibilitySystemProps) {
  return (
    <AccessibilityProvider>
      <SkipLink />
      <ScreenReaderAnnouncer />
      {children}
    </AccessibilityProvider>
  );
}

// Re-export everything for easy access
export * from "./components";
export * from "./context/AccessibilityContext";
export * from "./types";
export * from "./constants";

// Legacy compatibility exports (for gradual migration)
export { UniversalAccessibilitySystem as SallyAccessibilityProvider };
export { useAccessibility as useSallyAccessibility };
export { AccessibleButton as SallyAccessibleButton };
export { AccessibleField as SallyAccessibleField };
export { AdaptiveHero as SallyAdaptiveHero };
export { ProgressiveDisclosure as SallyProgressiveDisclosure };
export { LazySection as SallyLazySection };
export { AccessibilityToolbar as SallyAccessibilityToolbar };
export { FocusTrap as SallyFocusTrap };
export { SkipLink as SallySkipLink };
export { ScreenReaderAnnouncer as SallyScreenReaderAnnouncer };

// Cognitive optimization exports
export { UniversalAccessibilitySystem as SallyCognitiveProvider };
export { useAccessibility as useSallyCognitive };
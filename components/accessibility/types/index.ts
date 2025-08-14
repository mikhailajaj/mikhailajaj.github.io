/**
 * Universal Accessibility System - Types
 * Consolidated type definitions for accessibility and cognitive optimization
 */

// Core Accessibility Context
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  announcements: string[];
}

// Cognitive Load Context
export interface CognitiveSettings {
  userPreference: "minimal" | "standard" | "enhanced";
  deviceCapability: "low" | "medium" | "high";
  cognitiveCapacity: "low" | "medium" | "high";
  adaptiveMode: boolean;
}

// Combined Universal Context
export interface UniversalAccessibilityContext extends AccessibilitySettings, CognitiveSettings {
  // Accessibility actions
  setHighContrast: (value: boolean) => void;
  setFontSize: (size: "small" | "medium" | "large" | "extra-large") => void;
  announce: (message: string) => void;
  clearAnnouncements: () => void;
  
  // Cognitive actions
  setCognitivePreference: (preference: "minimal" | "standard" | "enhanced") => void;
  setAdaptiveMode: (enabled: boolean) => void;
  
  // Performance metrics
  performanceMetrics: {
    renderTime: number;
    isOptimal: boolean;
    frameRate: number;
  };
}

// Component Props
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  ariaLabel?: string;
  ariaDescribedBy?: string;
  announceOnClick?: string;
}

export interface AccessibleFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
}

export interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  restoreFocus?: boolean;
}

export interface AdaptiveHeroProps {
  children: React.ReactNode;
  className?: string;
  cognitiveComplexity?: "low" | "medium" | "high";
}

export interface ProgressiveDisclosureProps {
  title: string;
  preview: React.ReactNode;
  fullContent: React.ReactNode;
  maxPreviewItems?: number;
  cognitiveLoad?: "low" | "medium" | "high";
}

export interface LazySectionProps {
  children: React.ReactNode;
  priority?: "low" | "medium" | "high";
  className?: string;
  performanceThreshold?: number;
}

// Performance Metrics
export interface PerformanceMetrics {
  renderTime: number;
  isOptimal: boolean;
  frameRate: number;
  memoryUsage?: number;
  interactionLatency?: number;
}

// Adaptive Settings
export interface AdaptiveSettings {
  animationDuration: number;
  staggerDelay: number;
  particleCount: number;
  complexity: "minimal" | "standard" | "enhanced";
}
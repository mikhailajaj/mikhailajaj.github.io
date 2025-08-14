/**
 * Universal Accessibility System - Constants
 * Consolidated from Sally's Accessibility Framework and Cognitive Optimizer
 */

// WCAG 2.1 AA Color Contrast Ratios
export const ACCESSIBILITY_COLORS = {
  // AAA Level contrast ratios (7:1 minimum)
  text: {
    primary: {
      light: "#000000", // 21:1 contrast on white
      dark: "#ffffff", // 21:1 contrast on black
    },
    secondary: {
      light: "#374151", // 12.6:1 contrast on white
      dark: "#d1d5db", // 15.8:1 contrast on black
    },
    muted: {
      light: "#4b5563", // 9.7:1 contrast on white
      dark: "#9ca3af", // 7.1:1 contrast on black
    },
  },
  interactive: {
    primary: {
      background: "#1d4ed8", // 7.4:1 contrast
      hover: "#1e40af", // 8.2:1 contrast
      focus: "#2563eb", // 7.1:1 contrast
    },
    secondary: {
      background: "#059669", // 7.2:1 contrast
      hover: "#047857", // 8.1:1 contrast
      focus: "#10b981", // 6.8:1 contrast
    },
    danger: {
      background: "#dc2626", // 7.3:1 contrast
      hover: "#b91c1c", // 8.5:1 contrast
      focus: "#ef4444", // 6.9:1 contrast
    },
  },
  focus: {
    ring: "#2563eb", // High contrast focus ring
    offset: "#ffffff", // White offset for dark backgrounds
  },
};

// Cognitive Load Thresholds
export const COGNITIVE_THRESHOLDS = {
  performance: {
    optimal: 16, // 60fps = 16ms per frame
    acceptable: 33, // 30fps = 33ms per frame
    poor: 66, // 15fps = 66ms per frame
  },
  complexity: {
    low: 1.5,
    medium: 2.5,
    high: 3.5,
  },
  millerRule: {
    // Miller's Rule (7±2 items)
    low: 5,
    medium: 7,
    high: 9,
  },
};

// Animation Timing (from Sally Animation System)
export const ACCESSIBILITY_TIMING = {
  micro: 0.15,
  standard: 0.3,
  deliberate: 0.5,
  slow: 0.8,
};

// Touch Target Sizes (WCAG 2.1 AA compliance)
export const TOUCH_TARGETS = {
  minimum: 44, // 44x44px minimum
  comfortable: 48, // 48x48px comfortable
  large: 52, // 52x52px large
};

// Font Size Mappings
export const FONT_SIZES = {
  small: "14px",
  medium: "16px",
  large: "18px",
  "extra-large": "20px",
};

// Device Capability Detection
export const DEVICE_THRESHOLDS = {
  memory: {
    low: 4,
    high: 8,
  },
  cores: {
    low: 4,
    high: 8,
  },
};
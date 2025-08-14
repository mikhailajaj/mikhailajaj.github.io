"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import type { UniversalAccessibilityContext, PerformanceMetrics } from "../types";
import { FONT_SIZES, DEVICE_THRESHOLDS } from "../constants";

/**
 * Universal Accessibility Context
 * Combines accessibility settings and cognitive optimization
 */

const defaultContext: UniversalAccessibilityContext = {
  // Accessibility settings
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: false,
  fontSize: "medium",
  announcements: [],
  
  // Cognitive settings
  userPreference: "standard",
  deviceCapability: "medium",
  cognitiveCapacity: "medium",
  adaptiveMode: true,
  
  // Performance metrics
  performanceMetrics: {
    renderTime: 0,
    isOptimal: true,
    frameRate: 60,
  },
  
  // Actions
  setHighContrast: () => {},
  setFontSize: () => {},
  announce: () => {},
  clearAnnouncements: () => {},
  setCognitivePreference: () => {},
  setAdaptiveMode: () => {},
};

const AccessibilityContext = createContext<UniversalAccessibilityContext>(defaultContext);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  // Accessibility state
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large" | "extra-large">("medium");
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [screenReader, setScreenReader] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  
  // Cognitive state
  const [userPreference, setUserPreference] = useState<"minimal" | "standard" | "enhanced">("standard");
  const [deviceCapability, setDeviceCapability] = useState<"low" | "medium" | "high">("medium");
  const [cognitiveCapacity, setCognitiveCapacity] = useState<"low" | "medium" | "high">("medium");
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  
  // Performance state
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    isOptimal: true,
    frameRate: 60,
  });
  
  const prefersReducedMotion = useReducedMotion();

  // Auto-detect device capabilities
  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectDeviceCapability = () => {
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;

      if (memory >= DEVICE_THRESHOLDS.memory.high && cores >= DEVICE_THRESHOLDS.cores.high) {
        return "high";
      }
      if (memory >= DEVICE_THRESHOLDS.memory.low && cores >= DEVICE_THRESHOLDS.cores.low) {
        return "medium";
      }
      return "low";
    };

    setDeviceCapability(detectDeviceCapability());
  }, []);

  // Detect screen reader and keyboard navigation
  useEffect(() => {
    const detectScreenReader = () => {
      const hasScreenReader =
        window.navigator.userAgent.includes("NVDA") ||
        window.navigator.userAgent.includes("JAWS") ||
        window.speechSynthesis?.getVoices().length > 0;

      setScreenReader(hasScreenReader);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setKeyboardNavigation(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardNavigation(false);
    };

    detectScreenReader();
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Load user preferences
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedPreference = localStorage.getItem("accessibility-cognitive-preference");
      if (storedPreference) {
        setUserPreference(storedPreference as "minimal" | "standard" | "enhanced");
      } else {
        // Default based on reduced motion preference
        const defaultPref = prefersReducedMotion ? "minimal" : "standard";
        setUserPreference(defaultPref);
      }

      const storedFontSize = localStorage.getItem("accessibility-font-size");
      if (storedFontSize) {
        setFontSize(storedFontSize as "small" | "medium" | "large" | "extra-large");
      }

      const storedHighContrast = localStorage.getItem("accessibility-high-contrast");
      if (storedHighContrast) {
        setHighContrast(storedHighContrast === "true");
      }
    } catch (error) {
      console.warn("Failed to load accessibility preferences:", error);
    }
  }, [prefersReducedMotion]);

  // Apply font size to document
  useEffect(() => {
    document.documentElement.style.fontSize = FONT_SIZES[fontSize];
    
    try {
      localStorage.setItem("accessibility-font-size", fontSize);
    } catch (error) {
      console.warn("Failed to save font size preference:", error);
    }
  }, [fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("sally-high-contrast");
    } else {
      document.documentElement.classList.remove("sally-high-contrast");
    }
    
    try {
      localStorage.setItem("accessibility-high-contrast", highContrast.toString());
    } catch (error) {
      console.warn("Failed to save high contrast preference:", error);
    }
  }, [highContrast]);

  // Save cognitive preferences
  useEffect(() => {
    try {
      localStorage.setItem("accessibility-cognitive-preference", userPreference);
    } catch (error) {
      console.warn("Failed to save cognitive preference:", error);
    }
  }, [userPreference]);

  // Actions
  const announce = (message: string) => {
    setAnnouncements((prev) => [...prev, message]);
  };

  const clearAnnouncements = () => {
    setAnnouncements([]);
  };

  const setCognitivePreference = (preference: "minimal" | "standard" | "enhanced") => {
    setUserPreference(preference);
  };

  const contextValue: UniversalAccessibilityContext = {
    // Accessibility settings
    highContrast,
    reducedMotion: prefersReducedMotion,
    screenReader,
    keyboardNavigation,
    fontSize,
    announcements,
    
    // Cognitive settings
    userPreference,
    deviceCapability,
    cognitiveCapacity,
    adaptiveMode,
    
    // Performance metrics
    performanceMetrics,
    
    // Actions
    setHighContrast,
    setFontSize,
    announce,
    clearAnnouncements,
    setCognitivePreference,
    setAdaptiveMode,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
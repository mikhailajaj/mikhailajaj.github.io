/**
 * Improved Theme System with Better Contrast & shadcn/ui Integration
 * Consolidates accessibility features and improves theme contrast
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUniversalAccess, 
  FaTimes, 
  FaSun, 
  FaMoon, 
  FaAdjust,
  FaTextHeight,
  FaEye,
  FaVolumeUp
} from "react-icons/fa";
import { Switch } from "./switch";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

// ============================================================================
// IMPROVED THEME CONFIGURATION WITH BETTER CONTRAST
// ============================================================================

const improvedThemeConfig = {
  light: {
    // High contrast colors for better accessibility
    colors: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      card: "hsl(0 0% 100%)",
      "card-foreground": "hsl(222.2 84% 4.9%)",
      popover: "hsl(0 0% 100%)",
      "popover-foreground": "hsl(222.2 84% 4.9%)",
      primary: "hsl(221.2 83.2% 53.3%)",
      "primary-foreground": "hsl(210 40% 98%)",
      secondary: "hsl(210 40% 96%)",
      "secondary-foreground": "hsl(222.2 84% 4.9%)",
      muted: "hsl(210 40% 96%)",
      "muted-foreground": "hsl(215.4 16.3% 46.9%)",
      accent: "hsl(210 40% 96%)",
      "accent-foreground": "hsl(222.2 84% 4.9%)",
      destructive: "hsl(0 84.2% 60.2%)",
      "destructive-foreground": "hsl(210 40% 98%)",
      border: "hsl(214.3 31.8% 91.4%)",
      input: "hsl(214.3 31.8% 91.4%)",
      ring: "hsl(221.2 83.2% 53.3%)",
    },
    // Enhanced contrast ratios
    contrast: {
      text: "hsl(0 0% 0%)",
      background: "hsl(0 0% 100%)",
      border: "hsl(0 0% 20%)",
    }
  },
  dark: {
    // Improved dark theme with better contrast
    colors: {
      background: "hsl(222.2 84% 4.9%)",
      foreground: "hsl(210 40% 98%)",
      card: "hsl(222.2 84% 4.9%)",
      "card-foreground": "hsl(210 40% 98%)",
      popover: "hsl(222.2 84% 4.9%)",
      "popover-foreground": "hsl(210 40% 98%)",
      primary: "hsl(217.2 91.2% 59.8%)",
      "primary-foreground": "hsl(222.2 84% 4.9%)",
      secondary: "hsl(217.2 32.6% 17.5%)",
      "secondary-foreground": "hsl(210 40% 98%)",
      muted: "hsl(217.2 32.6% 17.5%)",
      "muted-foreground": "hsl(215 20.2% 65.1%)",
      accent: "hsl(217.2 32.6% 17.5%)",
      "accent-foreground": "hsl(210 40% 98%)",
      destructive: "hsl(0 62.8% 30.6%)",
      "destructive-foreground": "hsl(210 40% 98%)",
      border: "hsl(217.2 32.6% 17.5%)",
      input: "hsl(217.2 32.6% 17.5%)",
      ring: "hsl(224.3 76.3% 94.1%)",
    },
    // Enhanced dark contrast
    contrast: {
      text: "hsl(0 0% 100%)",
      background: "hsl(222.2 84% 4.9%)",
      border: "hsl(0 0% 80%)",
    }
  }
};

// ============================================================================
// ACCESSIBILITY PREFERENCES INTERFACE
// ============================================================================

interface AccessibilityPreferences {
  fontSize: "small" | "medium" | "large" | "extra-large";
  contrast: "normal" | "high" | "low";
  reducedMotion: boolean;
  focusIndicators: boolean;
  textToSpeech: boolean;
  colorBlindMode: boolean;
  dyslexiaFont: boolean;
}

const DEFAULT_ACCESSIBILITY_PREFERENCES: AccessibilityPreferences = {
  fontSize: "medium",
  contrast: "normal",
  reducedMotion: false,
  focusIndicators: true,
  textToSpeech: false,
  colorBlindMode: false,
  dyslexiaFont: false,
};

// ============================================================================
// THEME CONTEXT WITH ACCESSIBILITY
// ============================================================================

interface ImprovedThemeContextType {
  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
  
  // Accessibility
  accessibility: AccessibilityPreferences;
  updateAccessibility: (updates: Partial<AccessibilityPreferences>) => void;
  resetAccessibility: () => void;
  
  // Theme utilities
  applyThemeVariables: () => void;
  getContrastColor: (background: string) => string;
}

const ImprovedThemeContext = createContext<ImprovedThemeContextType | undefined>(undefined);

export const useImprovedTheme = () => {
  const context = useContext(ImprovedThemeContext);
  if (!context) {
    throw new Error("useImprovedTheme must be used within ImprovedThemeProvider");
  }
  return context;
};

// ============================================================================
// IMPROVED THEME PROVIDER
// ============================================================================

interface ImprovedThemeProviderProps {
  children: React.ReactNode;
}

export const ImprovedThemeProvider: React.FC<ImprovedThemeProviderProps> = ({ children }) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accessibility, setAccessibility] = useState<AccessibilityPreferences>(
    DEFAULT_ACCESSIBILITY_PREFERENCES
  );

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true);
    
    // Load accessibility preferences from localStorage
    const saved = localStorage.getItem("accessibility-preferences");
    if (saved) {
      try {
        setAccessibility(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to load accessibility preferences:", error);
      }
    }
  }, []);

  // Save accessibility preferences
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("accessibility-preferences", JSON.stringify(accessibility));
    }
  }, [accessibility, mounted]);

  // Apply theme variables and accessibility settings
  const applyThemeVariables = React.useCallback(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const currentTheme = resolvedTheme as "light" | "dark";
    const themeColors = improvedThemeConfig[currentTheme].colors;

    // Apply CSS custom properties
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, value);
    });

    // Apply accessibility settings
    root.setAttribute("data-font-size", accessibility.fontSize);
    root.setAttribute("data-contrast", accessibility.contrast);
    root.setAttribute("data-reduced-motion", accessibility.reducedMotion.toString());
    root.setAttribute("data-dyslexia-font", accessibility.dyslexiaFont.toString());
    root.setAttribute("data-color-blind-mode", accessibility.colorBlindMode.toString());

    // Apply theme class
    root.classList.toggle("dark", currentTheme === "dark");
    root.classList.toggle("light", currentTheme === "light");

    // Apply high contrast if enabled
    if (accessibility.contrast === "high") {
      const contrastColors = improvedThemeConfig[currentTheme].contrast;
      root.style.setProperty("--foreground", contrastColors.text);
      root.style.setProperty("--background", contrastColors.background);
      root.style.setProperty("--border", contrastColors.border);
    }
  }, [resolvedTheme, accessibility, mounted]);

  // Apply theme variables when theme or accessibility changes
  useEffect(() => {
    applyThemeVariables();
  }, [applyThemeVariables]);

  const updateAccessibility = React.useCallback((updates: Partial<AccessibilityPreferences>) => {
    setAccessibility(prev => ({ ...prev, ...updates }));
  }, []);

  const resetAccessibility = React.useCallback(() => {
    setAccessibility(DEFAULT_ACCESSIBILITY_PREFERENCES);
  }, []);

  const getContrastColor = React.useCallback((background: string) => {
    // Simple contrast calculation - in production, use a proper contrast library
    const currentTheme = resolvedTheme as "light" | "dark";
    return currentTheme === "dark" ? "hsl(210 40% 98%)" : "hsl(222.2 84% 4.9%)";
  }, [resolvedTheme]);

  if (!mounted) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const contextValue: ImprovedThemeContextType = {
    theme: theme as "light" | "dark" | "system",
    setTheme,
    resolvedTheme: resolvedTheme as "light" | "dark",
    accessibility,
    updateAccessibility,
    resetAccessibility,
    applyThemeVariables,
    getContrastColor,
  };

  return (
    <ImprovedThemeContext.Provider value={contextValue}>
      <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
        {children}
      </div>
    </ImprovedThemeContext.Provider>
  );
};

// ============================================================================
// IMPROVED THEME SWITCHER WITH ACCESSIBILITY
// ============================================================================

export const ImprovedThemeSwitcher: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useImprovedTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <FaSun className="w-4 h-4" />;
      case "dark":
        return <FaMoon className="w-4 h-4" />;
      default:
        return <FaAdjust className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark theme";
      case "dark":
        return "Switch to system theme";
      default:
        return "Switch to light theme";
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      aria-label={getThemeLabel()}
      className="relative"
    >
      {getThemeIcon()}
      <span className="sr-only">{getThemeLabel()}</span>
    </Button>
  );
};

// ============================================================================
// CONSOLIDATED ACCESSIBILITY TOOLBAR
// ============================================================================

export const ConsolidatedAccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { accessibility, updateAccessibility, resetAccessibility } = useImprovedTheme();

  const fontSizeOptions = [
    { value: "small", label: "Small", size: "14px" },
    { value: "medium", label: "Medium", size: "16px" },
    { value: "large", label: "Large", size: "18px" },
    { value: "extra-large", label: "Extra Large", size: "20px" },
  ] as const;

  const contrastOptions = [
    { value: "normal", label: "Normal" },
    { value: "high", label: "High Contrast" },
    { value: "low", label: "Low Contrast" },
  ] as const;

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open accessibility menu"
          aria-expanded={isOpen}
          className="shadow-lg"
        >
          <FaUniversalAccess className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-16 right-4 z-40 w-80"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Accessibility Options</CardTitle>
                    <CardDescription>
                      Customize your viewing experience
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close accessibility menu"
                  >
                    <FaTimes className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Theme Switcher */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FaAdjust className="w-4 h-4" />
                    Theme
                  </label>
                  <ImprovedThemeSwitcher />
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FaTextHeight className="w-4 h-4" />
                    Font Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {fontSizeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={accessibility.fontSize === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAccessibility({ fontSize: option.value })}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Contrast */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <FaEye className="w-4 h-4" />
                    Contrast
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {contrastOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={accessibility.contrast === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateAccessibility({ contrast: option.value })}
                        className="text-xs"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Accessibility Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="reduced-motion" className="text-sm font-medium">
                      Reduced Motion
                    </label>
                    <Switch
                      id="reduced-motion"
                      checked={accessibility.reducedMotion}
                      onCheckedChange={(checked) => updateAccessibility({ reducedMotion: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="focus-indicators" className="text-sm font-medium">
                      Enhanced Focus
                    </label>
                    <Switch
                      id="focus-indicators"
                      checked={accessibility.focusIndicators}
                      onCheckedChange={(checked) => updateAccessibility({ focusIndicators: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="dyslexia-font" className="text-sm font-medium">
                      Dyslexia-Friendly Font
                    </label>
                    <Switch
                      id="dyslexia-font"
                      checked={accessibility.dyslexiaFont}
                      onCheckedChange={(checked) => updateAccessibility({ dyslexiaFont: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="color-blind-mode" className="text-sm font-medium">
                      Color Blind Mode
                    </label>
                    <Switch
                      id="color-blind-mode"
                      checked={accessibility.colorBlindMode}
                      onCheckedChange={(checked) => updateAccessibility({ colorBlindMode: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="text-to-speech" className="text-sm font-medium flex items-center gap-2">
                      <FaVolumeUp className="w-4 h-4" />
                      Text-to-Speech
                    </label>
                    <Switch
                      id="text-to-speech"
                      checked={accessibility.textToSpeech}
                      onCheckedChange={(checked) => updateAccessibility({ textToSpeech: checked })}
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={resetAccessibility}
                  className="w-full"
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// THEME-AWARE UTILITY HOOKS
// ============================================================================

export const useThemeAwareStyles = () => {
  const { resolvedTheme, accessibility } = useImprovedTheme();

  return React.useMemo(() => ({
    text: {
      primary: resolvedTheme === "dark" ? "text-white" : "text-gray-900",
      secondary: resolvedTheme === "dark" ? "text-gray-200" : "text-gray-700",
      muted: resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500",
      accent: resolvedTheme === "dark" ? "text-blue-400" : "text-blue-600",
    },
    background: {
      primary: resolvedTheme === "dark" ? "bg-gray-900" : "bg-white",
      secondary: resolvedTheme === "dark" ? "bg-gray-800" : "bg-gray-50",
      accent: resolvedTheme === "dark" ? "bg-blue-900/20" : "bg-blue-50",
    },
    border: {
      primary: resolvedTheme === "dark" ? "border-gray-700" : "border-gray-200",
      accent: resolvedTheme === "dark" ? "border-blue-500" : "border-blue-300",
    },
    // Accessibility-aware styles
    fontSize: {
      small: accessibility.fontSize === "small" ? "text-sm" : "",
      medium: accessibility.fontSize === "medium" ? "text-base" : "",
      large: accessibility.fontSize === "large" ? "text-lg" : "",
      "extra-large": accessibility.fontSize === "extra-large" ? "text-xl" : "",
    },
    contrast: accessibility.contrast === "high" ? "contrast-150 brightness-110" : "",
    motion: accessibility.reducedMotion ? "motion-reduce" : "",
  }), [resolvedTheme, accessibility]);
};
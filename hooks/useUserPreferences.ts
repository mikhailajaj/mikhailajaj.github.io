/**
 * User Preferences Hook
 *
 * Manages user preferences for accessibility, theme, and interaction settings
 */

import { useState, useEffect } from "react";
import { trackAccessibilityUsage } from "@/lib/utils/analytics";

export interface UserPreferences {
  theme: "light" | "dark" | "auto";
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";
  autoplay: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: "auto",
  reducedMotion: false,
  highContrast: false,
  fontSize: "medium",
  autoplay: true,
};

export const useUserPreferences = () => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage and system preferences
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load saved preferences
    const savedPreferences = localStorage.getItem("user_preferences");
    let loadedPreferences = defaultPreferences;

    if (savedPreferences) {
      try {
        loadedPreferences = {
          ...defaultPreferences,
          ...JSON.parse(savedPreferences),
        };
      } catch (error) {
        console.warn("Failed to parse saved preferences:", error);
      }
    }

    // Check system preferences
    const mediaQueries = {
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
      highContrast: window.matchMedia("(prefers-contrast: high)"),
      darkMode: window.matchMedia("(prefers-color-scheme: dark)"),
    };

    // Apply system preferences if not explicitly set
    if (!savedPreferences) {
      loadedPreferences.reducedMotion = mediaQueries.reducedMotion.matches;
      loadedPreferences.highContrast = mediaQueries.highContrast.matches;
      loadedPreferences.theme = mediaQueries.darkMode.matches
        ? "dark"
        : "light";
    }

    setPreferences(loadedPreferences);
    setIsLoaded(true);

    // Listen for system preference changes
    const handleMediaQueryChange = () => {
      setPreferences((prev) => ({
        ...prev,
        reducedMotion: mediaQueries.reducedMotion.matches,
        highContrast: mediaQueries.highContrast.matches,
      }));
    };

    mediaQueries.reducedMotion.addEventListener(
      "change",
      handleMediaQueryChange,
    );
    mediaQueries.highContrast.addEventListener(
      "change",
      handleMediaQueryChange,
    );

    return () => {
      mediaQueries.reducedMotion.removeEventListener(
        "change",
        handleMediaQueryChange,
      );
      mediaQueries.highContrast.removeEventListener(
        "change",
        handleMediaQueryChange,
      );
    };
  }, []);

  // Save preferences to localStorage
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    if (typeof window !== "undefined") {
      localStorage.setItem("user_preferences", JSON.stringify(newPreferences));

      // Track accessibility feature usage
      Object.entries(updates).forEach(([key, value]) => {
        if (key === "reducedMotion" || key === "highContrast") {
          trackAccessibilityUsage(key, value as boolean);
        }
      });
    }
  };

  // Individual preference setters
  const setTheme = (theme: UserPreferences["theme"]) => {
    updatePreferences({ theme });
  };

  const setReducedMotion = (reducedMotion: boolean) => {
    updatePreferences({ reducedMotion });
  };

  const setHighContrast = (highContrast: boolean) => {
    updatePreferences({ highContrast });
  };

  const setFontSize = (fontSize: UserPreferences["fontSize"]) => {
    updatePreferences({ fontSize });
  };

  const setAutoplay = (autoplay: boolean) => {
    updatePreferences({ autoplay });
  };

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_preferences");
    }
  };

  return {
    preferences,
    isLoaded,
    updatePreferences,
    setTheme,
    setReducedMotion,
    setHighContrast,
    setFontSize,
    setAutoplay,
    resetPreferences,
  };
};

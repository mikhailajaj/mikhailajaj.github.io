"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cssVariables } from "@/lib/theme";

interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useEnhancedTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useEnhancedTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const EnhancedThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply CSS custom properties based on theme
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const currentTheme = resolvedTheme as "light" | "dark";
    const variables = cssVariables[currentTheme];

    // Apply CSS custom properties
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Add theme-specific classes for better contrast
    if (currentTheme === "dark") {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return null;
  }

  const contextValue: ThemeContextType = {
    theme: theme as "light" | "dark" | "system",
    setTheme,
    resolvedTheme: resolvedTheme as "light" | "dark",
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className="min-h-screen transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Utility hook for getting theme-aware styles
export const useThemeStyles = () => {
  const { resolvedTheme } = useEnhancedTheme();

  return {
    text: {
      primary: resolvedTheme === "dark" ? "text-white" : "text-neutral-950",
      secondary:
        resolvedTheme === "dark" ? "text-neutral-200" : "text-neutral-700",
      tertiary:
        resolvedTheme === "dark" ? "text-neutral-300" : "text-neutral-600",
      accent:
        resolvedTheme === "dark" ? "text-primary-400" : "text-primary-600",
    },
    background: {
      primary: resolvedTheme === "dark" ? "bg-neutral-950" : "bg-white",
      secondary: resolvedTheme === "dark" ? "bg-neutral-900" : "bg-neutral-50",
      tertiary: resolvedTheme === "dark" ? "bg-neutral-800" : "bg-neutral-100",
      glass:
        resolvedTheme === "dark"
          ? "bg-neutral-950/80 backdrop-blur-xl border-neutral-800/50"
          : "bg-white/80 backdrop-blur-xl border-neutral-200/50",
    },
    border: {
      primary:
        resolvedTheme === "dark" ? "border-neutral-800" : "border-neutral-200",
      secondary:
        resolvedTheme === "dark" ? "border-neutral-700" : "border-neutral-300",
      accent:
        resolvedTheme === "dark" ? "border-primary-500" : "border-primary-600",
    },
    shadow: {
      sm:
        resolvedTheme === "dark" ? "shadow-black/30" : "shadow-neutral-900/10",
      md:
        resolvedTheme === "dark" ? "shadow-black/40" : "shadow-neutral-900/15",
      lg:
        resolvedTheme === "dark" ? "shadow-black/50" : "shadow-neutral-900/20",
      glow:
        resolvedTheme === "dark"
          ? "shadow-primary-500/40"
          : "shadow-primary-500/30",
    },
  };
};

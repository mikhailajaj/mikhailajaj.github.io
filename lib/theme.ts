// Enhanced Theme System with Better Contrast
export const theme = {
  colors: {
    // Primary colors with better contrast
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main blue
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },

    // Secondary colors
    secondary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7", // Main purple
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764",
    },

    // Accent colors
    accent: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981", // Main teal/green
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },

    // Neutral colors with better contrast
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },

    // Semantic colors
    success: {
      light: "#10b981",
      dark: "#34d399",
    },
    warning: {
      light: "#f59e0b",
      dark: "#fbbf24",
    },
    error: {
      light: "#ef4444",
      dark: "#f87171",
    },
    info: {
      light: "#3b82f6",
      dark: "#60a5fa",
    },
  },

  // Text colors with proper contrast ratios
  text: {
    light: {
      primary: "#0a0a0a", // 21:1 contrast ratio
      secondary: "#404040", // 10.7:1 contrast ratio
      tertiary: "#737373", // 4.5:1 contrast ratio
      inverse: "#ffffff",
    },
    dark: {
      primary: "#ffffff", // 21:1 contrast ratio
      secondary: "#e5e5e5", // 15.8:1 contrast ratio
      tertiary: "#a3a3a3", // 7.1:1 contrast ratio
      inverse: "#0a0a0a",
    },
  },

  // Background colors
  background: {
    light: {
      primary: "#ffffff",
      secondary: "#fafafa",
      tertiary: "#f5f5f5",
      elevated: "#ffffff",
      overlay: "rgba(255, 255, 255, 0.95)",
    },
    dark: {
      primary: "#0a0a0a",
      secondary: "#171717",
      tertiary: "#262626",
      elevated: "#171717",
      overlay: "rgba(10, 10, 10, 0.95)",
    },
  },

  // Border colors
  border: {
    light: {
      primary: "#e5e5e5",
      secondary: "#d4d4d4",
      accent: "#3b82f6",
    },
    dark: {
      primary: "#262626",
      secondary: "#404040",
      accent: "#60a5fa",
    },
  },

  // Glass/blur effects
  glass: {
    light: {
      background: "rgba(255, 255, 255, 0.8)",
      border: "rgba(255, 255, 255, 0.2)",
      shadow: "rgba(0, 0, 0, 0.1)",
    },
    dark: {
      background: "rgba(10, 10, 10, 0.8)",
      border: "rgba(255, 255, 255, 0.1)",
      shadow: "rgba(0, 0, 0, 0.3)",
    },
  },

  // Gradients
  gradients: {
    primary: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    secondary: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    accent: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    rainbow: "linear-gradient(135deg, #3b82f6 0%, #a855f7 50%, #10b981 100%)",
    mesh: "linear-gradient(45deg, #3b82f6 0%, #a855f7 25%, #10b981 50%, #f59e0b 75%, #ef4444 100%)",
  },

  // Shadows with better contrast
  shadows: {
    light: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      glow: "0 0 20px rgba(59, 130, 246, 0.3)",
    },
    dark: {
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
      glow: "0 0 20px rgba(96, 165, 250, 0.4)",
    },
  },
};

// Utility functions for theme usage
export const getTextColor = (
  variant: "primary" | "secondary" | "tertiary" | "inverse" = "primary",
) => ({
  light: theme.text.light[variant],
  dark: theme.text.dark[variant],
});

export const getBackgroundColor = (
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "elevated"
    | "overlay" = "primary",
) => ({
  light: theme.background.light[variant],
  dark: theme.background.dark[variant],
});

export const getBorderColor = (
  variant: "primary" | "secondary" | "accent" = "primary",
) => ({
  light: theme.border.light[variant],
  dark: theme.border.dark[variant],
});

export const getGlassEffect = () => ({
  light: theme.glass.light,
  dark: theme.glass.dark,
});

export const getShadow = (size: "sm" | "md" | "lg" | "xl" | "glow" = "md") => ({
  light: theme.shadows.light[size],
  dark: theme.shadows.dark[size],
});

// CSS custom properties for dynamic theming
export const cssVariables = {
  light: {
    "--color-text-primary": theme.text.light.primary,
    "--color-text-secondary": theme.text.light.secondary,
    "--color-text-tertiary": theme.text.light.tertiary,
    "--color-bg-primary": theme.background.light.primary,
    "--color-bg-secondary": theme.background.light.secondary,
    "--color-bg-tertiary": theme.background.light.tertiary,
    "--color-border-primary": theme.border.light.primary,
    "--color-border-secondary": theme.border.light.secondary,
    "--color-border-accent": theme.border.light.accent,
    "--shadow-sm": theme.shadows.light.sm,
    "--shadow-md": theme.shadows.light.md,
    "--shadow-lg": theme.shadows.light.lg,
    "--shadow-xl": theme.shadows.light.xl,
    "--shadow-glow": theme.shadows.light.glow,
  },
  dark: {
    "--color-text-primary": theme.text.dark.primary,
    "--color-text-secondary": theme.text.dark.secondary,
    "--color-text-tertiary": theme.text.dark.tertiary,
    "--color-bg-primary": theme.background.dark.primary,
    "--color-bg-secondary": theme.background.dark.secondary,
    "--color-bg-tertiary": theme.background.dark.tertiary,
    "--color-border-primary": theme.border.dark.primary,
    "--color-border-secondary": theme.border.dark.secondary,
    "--color-border-accent": theme.border.dark.accent,
    "--shadow-sm": theme.shadows.dark.sm,
    "--shadow-md": theme.shadows.dark.md,
    "--shadow-lg": theme.shadows.dark.lg,
    "--shadow-xl": theme.shadows.dark.xl,
    "--shadow-glow": theme.shadows.dark.glow,
  },
};

"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * ThemeSwitcher Component
 *
 * A toggle button that allows users to switch between light and dark themes.
 * Implements proper hydration handling to prevent SSR mismatches.
 *
 * @component
 * @example
 * ```tsx
 * <ThemeSwitcher />
 * ```
 *
 * Features:
 * - Seamless theme switching between light and dark modes
 * - Proper hydration handling to prevent SSR/client mismatches
 * - Accessible with proper ARIA labels
 * - Smooth transitions and hover effects
 * - Responsive design with proper contrast ratios
 *
 * @returns {JSX.Element | null} The theme switcher button or null during hydration
 */
const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // UseEffect to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 ml-3 rounded-lg bg-muted/50 dark:bg-card hover:bg-muted dark:hover:bg-card transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-foreground dark:text-muted-foreground" />
      ) : (
        <Sun className="w-5 h-5 text-foreground dark:text-muted-foreground" />
      )}
    </button>
  );
};

export default ThemeSwitcher;

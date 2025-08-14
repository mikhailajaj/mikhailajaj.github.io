/**
 * Enhanced Theme Button Component
 * 
 * A comprehensive theme switching button that integrates with:
 * - next-themes for light/dark mode
 * - Domain theming system
 * - User preferences and accessibility
 * - Modern UI with animations and feedback
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Palette, 
  Settings,
  Check,
  ChevronDown
} from "lucide-react";
import { useSimpleUnifiedTheme } from "@/lib/theme/simple/SimpleUnifiedTheme";
// import { useThemeMigrationBridge } from "@/lib/theme/migration/MenuMigrationBridge"; // Removed during cleanup
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Switch } from "./switch";
import { DOMAINS, getDomainConfig } from "@/lib/constants/domains";

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface ThemeOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface DomainOption {
  value: string;
  label: string;
  color: string;
  description?: string;
}

// ============================================================================
// THEME BUTTON COMPONENT
// ============================================================================

export const EnhancedThemeButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Use unified theme system with migration bridge
  const unifiedTheme = useSimpleUnifiedTheme();
  // const themeBridge = useThemeMigrationBridge(); // Removed during cleanup
  const { preferences, updatePreferences } = useUserPreferences();
  
  // Extract theme data from unified system
  const currentMode = unifiedTheme.mode;
  const currentDomain = unifiedTheme.domain;
  const isLoading = unifiedTheme.isLoading;
  const themeColors = unifiedTheme.colors;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  // Theme options
  const themeOptions: ThemeOption[] = [
    {
      value: "light",
      label: "Light",
      icon: <Sun className="w-4 h-4" />,
      description: "Light theme"
    },
    {
      value: "dark",
      label: "Dark",
      icon: <Moon className="w-4 h-4" />,
      description: "Dark theme"
    },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="w-4 h-4" />,
      description: "Follow system preference"
    }
  ];

  // Domain options from constants
  const domainOptions: DomainOption[] = DOMAINS.map(domainId => {
    const config = getDomainConfig(domainId);
    return {
      value: domainId,
      label: config.shortName,
      color: config.color,
      description: config.description,
    };
  });

  // Get current theme icon
  const getCurrentThemeIcon = () => {
    if (currentMode === "system") return <Monitor className="w-4 h-4" />;
    if (currentMode === "dark") return <Moon className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  // Handle theme change with unified system
  const handleThemeChange = (newTheme: string) => {
    unifiedTheme.setMode(newTheme as 'light' | 'dark' | 'system');
    updatePreferences({ theme: newTheme as any });
  };

  // Handle domain change with unified system
  const handleDomainChange = (newDomain: string) => {
    unifiedTheme.setDomain(newDomain as any);
  };

  // Toggle accessibility features
  const toggleReducedMotion = () => {
    updatePreferences({ reducedMotion: !preferences.reducedMotion });
  };

  const toggleHighContrast = () => {
    updatePreferences({ highContrast: !preferences.highContrast });
  };

  return (
    <div className="relative">
      {/* Main Theme Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 p-0 relative"
        aria-label="Theme settings"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {getCurrentThemeIcon()}
        </motion.div>
        
        {/* Domain indicator */}
        <div 
          className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
          style={{ backgroundColor: themeColors?.domainPrimary || '#3B82F6' }}
          aria-hidden="true"
        />
      </Button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 z-50 w-80"
            >
              <Card className="shadow-lg border">
                <CardContent className="p-4 space-y-4">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Theme Mode
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {themeOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={currentMode === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleThemeChange(option.value)}
                          className="flex flex-col items-center gap-1 h-auto py-2"
                        >
                          {option.icon}
                          <span className="text-xs">{option.label}</span>
                          {currentMode === option.value && (
                            <Check className="w-3 h-3 absolute top-1 right-1" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Domain Selection */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Domain Theme
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {domainOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={currentDomain === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDomainChange(option.value)}
                          className="flex items-center gap-2 justify-start h-auto py-2 px-3"
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                          <span className="text-xs truncate">{option.label}</span>
                          {currentDomain === option.value && (
                            <Check className="w-3 h-3 ml-auto" />
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility Options */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Accessibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label htmlFor="reduced-motion" className="text-sm">
                          Reduced Motion
                        </label>
                        <Switch
                          id="reduced-motion"
                          checked={preferences.reducedMotion}
                          onCheckedChange={toggleReducedMotion}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="high-contrast" className="text-sm">
                          High Contrast
                        </label>
                        <Switch
                          id="high-contrast"
                          checked={preferences.highContrast}
                          onCheckedChange={toggleHighContrast}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="pt-3 border-t text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Theme:</span>
                      <span className="capitalize">{currentMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domain:</span>
                      <span>{domainOptions.find(d => d.value === currentDomain)?.label || 'Default'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// SIMPLE THEME TOGGLE (Alternative)
// ============================================================================

export const SimpleThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
        <div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: resolvedTheme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </Button>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export default EnhancedThemeButton;
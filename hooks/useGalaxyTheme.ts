/**
 * Galaxy Theme Hook
 * 
 * Custom hook for managing galaxy theme state and user preferences
 * following the philosophical framework principles.
 */

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { galaxyThemeConfig, getUserGalaxyPreferences, type GalaxyThemeConfig } from '@/lib/config/galaxyThemeConfig';

interface UseGalaxyThemeReturn {
  galaxyConfig: GalaxyThemeConfig;
  isReducedMotion: boolean;
  isHighContrast: boolean;
  setIntensity: (intensity: 'minimal' | 'subtle' | 'normal' | 'full') => void;
  currentIntensity: string;
}

export const useGalaxyTheme = (): UseGalaxyThemeReturn => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [galaxyConfig, setGalaxyConfig] = useState<GalaxyThemeConfig>(galaxyThemeConfig.dark);
  const [currentIntensity, setCurrentIntensity] = useState<string>('normal');
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Monitor user preferences
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const updatePreferences = () => {
      setIsReducedMotion(reducedMotionQuery.matches);
      setIsHighContrast(highContrastQuery.matches);
    };

    updatePreferences();

    reducedMotionQuery.addEventListener('change', updatePreferences);
    highContrastQuery.addEventListener('change', updatePreferences);

    return () => {
      reducedMotionQuery.removeEventListener('change', updatePreferences);
      highContrastQuery.removeEventListener('change', updatePreferences);
    };
  }, [mounted]);

  // Update galaxy configuration
  useEffect(() => {
    if (!mounted) return;

    // Respect user accessibility preferences (Kantian duty)
    const userPreferences = getUserGalaxyPreferences();
    if (userPreferences) {
      setGalaxyConfig(userPreferences);
      return;
    }

    // Determine current theme (Utilitarian optimization)
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    const baseConfig = isDark ? galaxyThemeConfig.dark : galaxyThemeConfig.light;
    setGalaxyConfig(baseConfig);
  }, [theme, systemTheme, mounted, isReducedMotion, isHighContrast]);

  // Intensity control function
  const setIntensity = (intensity: 'minimal' | 'subtle' | 'normal' | 'full') => {
    setCurrentIntensity(intensity);
    
    if (!mounted) return;

    // Don't override accessibility preferences
    const userPreferences = getUserGalaxyPreferences();
    if (userPreferences) return;

    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';
    let baseConfig = isDark ? galaxyThemeConfig.dark : galaxyThemeConfig.light;

    // Apply intensity modifier (Aristotelian balance)
    switch (intensity) {
      case 'minimal':
        baseConfig = {
          ...baseConfig,
          starOpacity: baseConfig.starOpacity * 0.3,
          nebulaIntensity: baseConfig.nebulaIntensity * 0.2,
          particleDensity: baseConfig.particleDensity * 0.5,
          performance: {
            ...baseConfig.performance,
            particleCount: Math.floor(baseConfig.performance.particleCount * 0.3)
          }
        };
        break;
      case 'subtle':
        baseConfig = {
          ...baseConfig,
          starOpacity: baseConfig.starOpacity * 0.6,
          nebulaIntensity: baseConfig.nebulaIntensity * 0.5,
          particleDensity: baseConfig.particleDensity * 0.7,
          performance: {
            ...baseConfig.performance,
            particleCount: Math.floor(baseConfig.performance.particleCount * 0.6)
          }
        };
        break;
      case 'full':
        baseConfig = {
          ...baseConfig,
          starOpacity: Math.min(baseConfig.starOpacity * 1.3, 1.0),
          nebulaIntensity: Math.min(baseConfig.nebulaIntensity * 1.5, 0.5),
          particleDensity: baseConfig.particleDensity * 1.2,
          performance: {
            ...baseConfig.performance,
            particleCount: Math.floor(baseConfig.performance.particleCount * 1.2)
          }
        };
        break;
      default: // 'normal'
        break;
    }

    setGalaxyConfig(baseConfig);
  };

  return {
    galaxyConfig,
    isReducedMotion,
    isHighContrast,
    setIntensity,
    currentIntensity
  };
};

export default useGalaxyTheme;
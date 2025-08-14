"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ShootingStars } from "./shooting-stars";
import { StarsBackground } from "./stars-background";
import NebulaOverlay from "./NebulaOverlay";
import ParticleBackground from "./ParticleBackground";
import { galaxyThemeConfig, getUserGalaxyPreferences, domainGalaxyAdaptations } from "@/lib/config/galaxyThemeConfig";
import { cn } from "@/lib/utils";

interface AdaptiveGalaxyBackgroundProps {
  className?: string;
  domain?: keyof typeof domainGalaxyAdaptations;
  intensity?: 'minimal' | 'subtle' | 'normal' | 'full';
}

/**
 * Adaptive Galaxy Background Component
 * 
 * Implements philosophical design principles:
 * - Aristotelian: Balanced experience between light/dark modes
 * - Utilitarian: Maximum benefit for all users with accessibility
 * - Kantian: Respects user autonomy and preferences
 * 
 * Features:
 * - Automatic theme adaptation
 * - Domain-specific color schemes
 * - Accessibility-first design
 * - Performance optimization
 * - User preference respect
 */
export const AdaptiveGalaxyBackground: React.FC<AdaptiveGalaxyBackgroundProps> = ({
  className,
  domain,
  intensity = 'normal'
}) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [galaxyConfig, setGalaxyConfig] = useState(galaxyThemeConfig.dark);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update galaxy configuration based on theme and preferences
  useEffect(() => {
    if (!mounted) return;

    // Check user accessibility preferences first (Kantian duty)
    const userPreferences = getUserGalaxyPreferences();
    if (userPreferences) {
      setGalaxyConfig(userPreferences);
      return;
    }

    // Determine current theme
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const isDark = currentTheme === 'dark';

    // Apply intensity modifier (Aristotelian balance)
    let baseConfig = isDark ? galaxyThemeConfig.dark : galaxyThemeConfig.light;
    
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
  }, [theme, systemTheme, mounted, intensity]);

  // Don't render during SSR to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Get domain-specific adaptations
  const domainAdaptation = domain ? domainGalaxyAdaptations[domain] : null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      {/* Shooting Stars with theme adaptation */}
      <ShootingStars
        minDelay={1200 / galaxyConfig.shootingStarFrequency}
        maxDelay={4200 / galaxyConfig.shootingStarFrequency}
        starColor={domainAdaptation?.accentColor || galaxyConfig.cosmicColors.highlight}
        trailColor={galaxyConfig.cosmicColors.primary}
        className="z-0"
      />

      {/* Stars Background with adaptive density */}
      <StarsBackground
        starDensity={galaxyConfig.particleDensity}
        className={cn("z-10", `opacity-${Math.floor(galaxyConfig.starOpacity * 100)}`)}
        style={{ opacity: galaxyConfig.starOpacity }}
      />

      {/* Nebula Overlay with intensity control */}
      <NebulaOverlay 
        className={cn("z-5", `opacity-${Math.floor(galaxyConfig.nebulaIntensity * 100)}`)}
        style={{ opacity: galaxyConfig.nebulaIntensity }}
      />

      {/* Particle Background with performance optimization */}
      <div 
        className="z-1"
        style={{ opacity: galaxyConfig.starOpacity * 0.7 }}
      >
        <ParticleBackground />
      </div>

      {/* Domain-specific accent overlay */}
      {domainAdaptation && (
        <div 
          className="absolute inset-0 z-2 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${domainAdaptation.accentColor} 0%, transparent 70%)`,
            opacity: 0.1
          }}
        />
      )}
    </div>
  );
};

export default AdaptiveGalaxyBackground;
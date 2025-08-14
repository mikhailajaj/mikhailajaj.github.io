/**
 * Galaxy Theme Configuration
 * 
 * Integrates with the existing multi-layer theme system to provide
 * cosmic background effects that adapt to light/dark modes and
 * respect user preferences and accessibility settings.
 * 
 * Philosophy: Aristotelian balance between cosmic authenticity and usability
 */

export interface GalaxyThemeConfig {
  starOpacity: number;
  nebulaIntensity: number;
  particleDensity: number;
  shootingStarFrequency: number;
  cosmicColors: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
  };
  performance: {
    particleCount: number;
    animationSpeed: number;
    connectionDistance: number;
  };
}

/**
 * Galaxy theme configuration following philosophical principles:
 * - Kantian: Universal accessibility and user autonomy
 * - Utilitarian: Maximum benefit for all users
 * - Aristotelian: Balanced experience between modes
 */
export const galaxyThemeConfig = {
  light: {
    // Optimized cosmic visibility for light mode (Aristotelian balance)
    starOpacity: 0.75, // Increased for better visibility
    nebulaIntensity: 0.2, // More prominent cosmic clouds
    particleDensity: 0.00025, // More stars for richer experience
    shootingStarFrequency: 0.8, // More frequent cosmic activity
    cosmicColors: {
      primary: 'rgba(138, 43, 226, 0.35)', // Richer purple
      secondary: 'rgba(75, 0, 130, 0.25)', // More visible indigo
      accent: 'rgba(147, 112, 219, 0.2)', // Enhanced pale purple
      highlight: 'rgba(255, 20, 147, 0.15)' // More vibrant pink
    },
    performance: {
      particleCount: 100, // Balanced particle count
      animationSpeed: 0.7, // Slightly faster for more life
      connectionDistance: 90 // Better connectivity
    }
  } as GalaxyThemeConfig,
  
  dark: {
    // Full cosmic experience for dark mode (Utilitarian optimization)
    starOpacity: 0.8,
    nebulaIntensity: 0.3,
    particleDensity: 0.00025,
    shootingStarFrequency: 1.0, // Normal frequency
    cosmicColors: {
      primary: 'rgba(138, 43, 226, 0.6)', // Rich purple
      secondary: 'rgba(75, 0, 130, 0.5)', // Deep indigo
      accent: 'rgba(147, 112, 219, 0.4)', // Medium purple
      highlight: 'rgba(255, 20, 147, 0.3)' // Bright pink
    },
    performance: {
      particleCount: 150, // Full particle experience
      animationSpeed: 1.0,
      connectionDistance: 120
    }
  } as GalaxyThemeConfig,

  // Accessibility-first configurations (Kantian duty ethics)
  reducedMotion: {
    starOpacity: 0.6,
    nebulaIntensity: 0.1,
    particleDensity: 0.00005,
    shootingStarFrequency: 0.1, // Minimal animation
    cosmicColors: {
      primary: 'rgba(138, 43, 226, 0.3)',
      secondary: 'rgba(75, 0, 130, 0.2)',
      accent: 'rgba(147, 112, 219, 0.15)',
      highlight: 'rgba(255, 20, 147, 0.1)'
    },
    performance: {
      particleCount: 25, // Minimal particles
      animationSpeed: 0.2,
      connectionDistance: 60
    }
  } as GalaxyThemeConfig,

  // High contrast mode for accessibility
  highContrast: {
    starOpacity: 1.0,
    nebulaIntensity: 0.0, // No nebula for clarity
    particleDensity: 0.00015,
    shootingStarFrequency: 0.5,
    cosmicColors: {
      primary: 'rgba(255, 255, 255, 0.8)', // High contrast white
      secondary: 'rgba(255, 255, 255, 0.6)',
      accent: 'rgba(255, 255, 255, 0.4)',
      highlight: 'rgba(255, 255, 255, 0.9)'
    },
    performance: {
      particleCount: 50,
      animationSpeed: 0.8,
      connectionDistance: 100
    }
  } as GalaxyThemeConfig
};

/**
 * Domain-specific galaxy adaptations
 * Integrates with existing domain theming system
 */
export const domainGalaxyAdaptations = {
  'full-stack': {
    accentColor: 'rgba(59, 130, 246, 0.3)', // Blue accent
    starColors: ['#3B82F6', '#1E40AF', '#1D4ED8'] // Blue spectrum stars
  },
  'cloud-engineering': {
    accentColor: 'rgba(20, 184, 166, 0.3)', // Teal accent
    starColors: ['#14B8A6', '#0F766E', '#0D9488'] // Teal spectrum stars
  },
  'data-analytics': {
    accentColor: 'rgba(147, 51, 234, 0.3)', // Purple accent (default)
    starColors: ['#9333EA', '#7C3AED', '#8B5CF6'] // Purple spectrum stars
  },
  'ux-ui-design': {
    accentColor: 'rgba(236, 72, 153, 0.3)', // Pink accent
    starColors: ['#EC4899', '#DB2777', '#F472B6'] // Pink spectrum stars
  },
  'technical-consulting': {
    accentColor: 'rgba(34, 197, 94, 0.3)', // Green accent
    starColors: ['#22C55E', '#16A34A', '#15803D'] // Green spectrum stars
  }
};

/**
 * Performance budgets following framework guidelines
 */
export const galaxyPerformanceBudgets = {
  maxParticles: 200,
  maxAnimationFPS: 60,
  maxMemoryUsage: '10MB',
  targetFrameTime: '16ms', // 60fps
  bundleSizeImpact: '<5KB gzipped'
};

/**
 * User preference detection and adaptation
 */
export const getUserGalaxyPreferences = () => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  const prefersHighContrast = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-contrast: high)').matches
    : false;

  if (prefersHighContrast) return galaxyThemeConfig.highContrast;
  if (prefersReducedMotion) return galaxyThemeConfig.reducedMotion;
  
  return null; // Use theme-based config
};

export default galaxyThemeConfig;
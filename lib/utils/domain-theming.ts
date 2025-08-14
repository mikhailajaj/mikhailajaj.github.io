/**
 * Domain Theming Utilities
 * 
 * Utility functions for applying domain-aware theming throughout the portfolio.
 * Provides helpers for CSS classes, inline styles, and theme calculations.
 * 
 * @fileoverview Domain theming utility functions
 */

// 1. React Imports
// (None in this file)

// 2. External Libraries
// (None in this file)

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { DOMAIN_COLORS, DOMAINS, type Domain } from '@/lib/constants/domains';
import { cn } from '@/lib/utils/cn';

// 4. Internal Relative Imports
// (None in this file)

// 5. Type Imports
// (Included inline above)

// 6. Stylesheets
// (None in this file)

/**
 * Theme variant types for different component states
 */
export type ThemeVariant = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'muted' 
  | 'outline' 
  | 'ghost';

/**
 * Theme intensity levels
 */
export type ThemeIntensity = 'light' | 'medium' | 'normal' | 'dark';

/**
 * Domain theme configuration interface
 */
export interface DomainThemeConfig {
  domain: Domain;
  variant: ThemeVariant;
  intensity: ThemeIntensity;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Color manipulation utilities
 */
export const colorUtils = {
  /**
   * Convert hex color to RGB values
   */
  hexToRgb: (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  },

  /**
   * Convert RGB to hex color
   */
  rgbToHex: (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  },

  /**
   * Lighten a hex color by a percentage
   */
  lighten: (hex: string, percent: number): string => {
    const { r, g, b } = colorUtils.hexToRgb(hex);
    const factor = 1 + (percent / 100);
    
    return colorUtils.rgbToHex(
      Math.min(255, Math.round(r * factor)),
      Math.min(255, Math.round(g * factor)),
      Math.min(255, Math.round(b * factor))
    );
  },

  /**
   * Darken a hex color by a percentage
   */
  darken: (hex: string, percent: number): string => {
    const { r, g, b } = colorUtils.hexToRgb(hex);
    const factor = 1 - (percent / 100);
    
    return colorUtils.rgbToHex(
      Math.max(0, Math.round(r * factor)),
      Math.max(0, Math.round(g * factor)),
      Math.max(0, Math.round(b * factor))
    );
  },

  /**
   * Create RGBA color with opacity
   */
  withOpacity: (hex: string, opacity: number): string => {
    const { r, g, b } = colorUtils.hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * Get RGB string for CSS custom properties
   */
  getRgbString: (hex: string): string => {
    const { r, g, b } = colorUtils.hexToRgb(hex);
    return `${r}, ${g}, ${b}`;
  }
};

/**
 * Generate domain-specific CSS custom properties
 */
export const generateDomainCSSProperties = (domain: Domain): Record<string, string> => {
  const domainColor = DOMAIN_COLORS[domain];
  const domainConfig = DOMAINS[domain];
  const rgb = colorUtils.getRgbString(domainColor);
  
  return {
    // Primary color variations
    '--domain-primary': domainColor,
    '--domain-primary-rgb': rgb,
    '--domain-primary-50': colorUtils.withOpacity(domainColor, 0.05),
    '--domain-primary-100': colorUtils.withOpacity(domainColor, 0.1),
    '--domain-primary-200': colorUtils.withOpacity(domainColor, 0.2),
    '--domain-primary-300': colorUtils.withOpacity(domainColor, 0.3),
    '--domain-primary-400': colorUtils.withOpacity(domainColor, 0.4),
    '--domain-primary-500': domainColor,
    '--domain-primary-600': colorUtils.darken(domainColor, 10),
    '--domain-primary-700': colorUtils.darken(domainColor, 20),
    '--domain-primary-800': colorUtils.darken(domainColor, 30),
    '--domain-primary-900': colorUtils.darken(domainColor, 40),
    
    // Semantic variations
    '--domain-background': colorUtils.withOpacity(domainColor, 0.05),
    '--domain-foreground': domainColor,
    '--domain-muted': colorUtils.withOpacity(domainColor, 0.1),
    '--domain-accent': colorUtils.lighten(domainColor, 10),
    '--domain-border': colorUtils.withOpacity(domainColor, 0.2),
    
    // Hover and focus states
    '--domain-hover': colorUtils.darken(domainColor, 5),
    '--domain-focus': colorUtils.withOpacity(domainColor, 0.3),
    '--domain-active': colorUtils.darken(domainColor, 10),
    
    // Domain metadata
    '--domain-name': `"${domainConfig.name}"`,
    '--domain-short-name': `"${domainConfig.shortName}"`,
    '--domain-icon': `"${domainConfig.icon}"`,
  };
};

/**
 * Get domain-themed CSS classes
 */
export const getDomainClasses = (
  domain: Domain,
  variant: ThemeVariant = 'primary',
  intensity: ThemeIntensity = 'normal',
  additionalClasses?: string
): string => {
  const baseClasses = [
    `domain-${domain}`,
    `domain-variant-${variant}`,
    `domain-intensity-${intensity}`,
  ];
  
  return cn(...baseClasses, additionalClasses);
};

/**
 * Get domain-themed inline styles
 */
export const getDomainStyles = (
  domain: Domain,
  variant: ThemeVariant = 'primary',
  intensity: ThemeIntensity = 'normal',
  additionalStyles?: React.CSSProperties
): React.CSSProperties => {
  const domainColor = DOMAIN_COLORS[domain];
  const cssProperties = generateDomainCSSProperties(domain);
  
  // Base styles for different variants
  const variantStyles: Record<ThemeVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: domainColor,
      color: 'white',
      borderColor: domainColor,
    },
    secondary: {
      backgroundColor: colorUtils.withOpacity(domainColor, 0.1),
      color: domainColor,
      borderColor: colorUtils.withOpacity(domainColor, 0.2),
    },
    accent: {
      backgroundColor: colorUtils.lighten(domainColor, 10),
      color: 'white',
      borderColor: colorUtils.lighten(domainColor, 10),
    },
    muted: {
      backgroundColor: colorUtils.withOpacity(domainColor, 0.05),
      color: colorUtils.darken(domainColor, 20),
      borderColor: colorUtils.withOpacity(domainColor, 0.1),
    },
    outline: {
      backgroundColor: 'transparent',
      color: domainColor,
      borderColor: domainColor,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: domainColor,
      borderColor: 'transparent',
    },
  };
  
  // Intensity modifications
  const intensityModifiers: Record<ThemeIntensity, (style: React.CSSProperties) => React.CSSProperties> = {
    light: (style) => ({
      ...style,
      opacity: 0.7,
    }),
    medium: (style) => ({
      ...style,
      opacity: 0.85,
    }),
    normal: (style) => style,
    dark: (style) => ({
      ...style,
      filter: 'brightness(0.9)',
    }),
  };
  
  const baseStyle = variantStyles[variant];
  const modifiedStyle = intensityModifiers[intensity](baseStyle);
  
  return {
    ...cssProperties,
    ...modifiedStyle,
    ...additionalStyles,
  } as React.CSSProperties;
};

/**
 * Create a domain theme configuration
 */
export const createDomainTheme = (config: Partial<DomainThemeConfig> & { domain: Domain }): DomainThemeConfig => {
  const {
    domain,
    variant = 'primary',
    intensity = 'normal',
    className,
    style,
  } = config;
  
  return {
    domain,
    variant,
    intensity,
    className: getDomainClasses(domain, variant, intensity, className),
    style: getDomainStyles(domain, variant, intensity, style),
  };
};

/**
 * Apply domain theme to an element
 */
export const applyDomainTheme = (
  element: HTMLElement,
  domain: Domain,
  variant: ThemeVariant = 'primary',
  intensity: ThemeIntensity = 'normal'
): void => {
  const theme = createDomainTheme({ domain, variant, intensity });
  
  // Apply CSS classes
  if (theme.className) {
    element.className = cn(element.className, theme.className);
  }
  
  // Apply inline styles
  if (theme.style) {
    Object.assign(element.style, theme.style);
  }
};

/**
 * Remove domain theme from an element
 */
export const removeDomainTheme = (element: HTMLElement): void => {
  // Remove domain-related classes
  element.className = element.className
    .replace(/domain-[\w-]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Remove domain-related CSS custom properties
  const domainProperties = Object.keys(generateDomainCSSProperties('full-stack'));
  domainProperties.forEach(property => {
    element.style.removeProperty(property);
  });
};

/**
 * Get contrast-safe text color for a domain background
 */
export const getDomainTextColor = (domain: Domain, background: 'light' | 'dark' = 'light'): string => {
  const domainColor = DOMAIN_COLORS[domain];
  
  // For light backgrounds, use the domain color
  // For dark backgrounds, use a lighter version
  return background === 'light' ? domainColor : colorUtils.lighten(domainColor, 20);
};

/**
 * Check if a domain color meets WCAG contrast requirements
 */
export const checkDomainContrast = (domain: Domain, backgroundColor: string = '#ffffff'): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
} => {
  const domainColor = DOMAIN_COLORS[domain];
  
  // Calculate luminance for both colors
  const getLuminance = (hex: string): number => {
    const rgb = colorUtils.hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(domainColor);
  const lum2 = getLuminance(backgroundColor);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  
  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
};

/**
 * Generate domain-specific gradient
 */
export const getDomainGradient = (
  domain: Domain,
  direction: string = 'to right',
  opacity: number = 1
): string => {
  const domainColor = DOMAIN_COLORS[domain];
  const lighterColor = colorUtils.lighten(domainColor, 15);
  const darkerColor = colorUtils.darken(domainColor, 15);
  
  if (opacity < 1) {
    return `linear-gradient(${direction}, ${colorUtils.withOpacity(lighterColor, opacity)}, ${colorUtils.withOpacity(darkerColor, opacity)})`;
  }
  
  return `linear-gradient(${direction}, ${lighterColor}, ${darkerColor})`;
};

/**
 * Get domain-specific shadow
 */
export const getDomainShadow = (
  domain: Domain,
  intensity: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string => {
  const domainColor = DOMAIN_COLORS[domain];
  const shadowColor = colorUtils.withOpacity(domainColor, 0.25);
  
  const shadows = {
    sm: `0 1px 2px 0 ${shadowColor}`,
    md: `0 4px 6px -1px ${shadowColor}, 0 2px 4px -1px ${colorUtils.withOpacity(domainColor, 0.06)}`,
    lg: `0 10px 15px -3px ${shadowColor}, 0 4px 6px -2px ${colorUtils.withOpacity(domainColor, 0.05)}`,
    xl: `0 20px 25px -5px ${shadowColor}, 0 10px 10px -5px ${colorUtils.withOpacity(domainColor, 0.04)}`,
  };
  
  return shadows[intensity];
};
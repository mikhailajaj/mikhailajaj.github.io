/**
 * Domain Constants and Configuration
 * 
 * Provides domain-specific constants, types, and utility functions
 * for the portfolio application's domain-aware theming system.
 */

import { domainThemes, type DomainTheme } from '@/lib/config/domainThemes';

// ============================================================================
// DOMAIN TYPES
// ============================================================================

/**
 * Available technical domains in the portfolio
 */
export type Domain = 'full-stack' | 'cloud' | 'data' | 'ux-ui' | 'consulting';

/**
 * Domain configuration interface (alias for DomainTheme)
 */
export type DomainConfig = DomainTheme;

// ============================================================================
// DOMAIN CONSTANTS
// ============================================================================

/**
 * Domain configuration objects with navigation properties
 */
export const DOMAIN_CONFIGS = {
  'full-stack': {
    id: 'full-stack' as Domain,
    name: 'Full-Stack Development',
    shortName: 'Full-Stack',
    path: '/full-stack',
    color: '#3B82F6',
    description: 'End-to-end web applications'
  },
  'cloud': {
    id: 'cloud' as Domain,
    name: 'Cloud Engineering', 
    shortName: 'Cloud',
    path: '/cloud-engineering',
    color: '#06B6D4',
    description: 'AWS infrastructure and DevOps'
  },
  'data': {
    id: 'data' as Domain,
    name: 'Data Analytics',
    shortName: 'Data',
    path: '/data-analytics', 
    color: '#8B5CF6',
    description: 'ML and business intelligence'
  },
  'ux-ui': {
    id: 'ux-ui' as Domain,
    name: 'UX/UI Design',
    shortName: 'UX/UI',
    path: '/ux-ui-design',
    color: '#EC4899', 
    description: 'User experience design'
  },
  'consulting': {
    id: 'consulting' as Domain,
    name: 'Technical Consulting',
    shortName: 'Consulting', 
    path: '/technical-consulting',
    color: '#F97316',
    description: 'Strategic technology guidance'
  }
};

/**
 * Array of all available domains
 */
export const DOMAINS: Domain[] = [
  'full-stack',
  'cloud', 
  'data',
  'ux-ui',
  'consulting'
];

/**
 * Domain color mappings
 */
export const DOMAIN_COLORS: Record<Domain, string> = {
  'full-stack': '#3B82F6', // blue-500
  'cloud': '#06B6D4',      // cyan-500
  'data': '#8B5CF6',       // violet-500
  'ux-ui': '#EC4899',      // pink-500
  'consulting': '#F97316'   // orange-500
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get domain configuration by domain ID
 */
export const getDomain = (domain: Domain): DomainConfig => {
  const config = domainThemes[domain];
  if (!config) {
    throw new Error(`Domain configuration not found for: ${domain}`);
  }
  return config;
};

/**
 * Get domain navigation config by domain ID
 */
export const getDomainConfig = (domain: Domain) => {
  return DOMAIN_CONFIGS[domain];
};

/**
 * Get primary color for a domain
 */
export const getDomainColor = (domain: Domain): string => {
  return DOMAIN_COLORS[domain] || '#3B82F6';
};

/**
 * Generate CSS custom properties for a domain
 */
export const getDomainCSSVariables = (domain: Domain): Record<string, string> => {
  const config = getDomain(domain);
  
  return {
    '--domain-primary': config.primaryColor,
    '--domain-secondary': config.secondaryColor,
    '--domain-accent': config.accentColor,
    '--domain-gradient-start': config.gradientColors[0],
    '--domain-gradient-end': config.gradientColors[1],
    '--domain-gradient': `linear-gradient(135deg, ${config.gradientColors[0]}, ${config.gradientColors[1]})`,
    '--domain-pattern': config.backgroundPattern,
  };
};

/**
 * Check if a string is a valid domain
 */
export const isValidDomain = (domain: string): domain is Domain => {
  return DOMAINS.includes(domain as Domain);
};

/**
 * Get all domain configurations
 */
export const getAllDomains = (): DomainConfig[] => {
  return DOMAINS.map(domain => getDomain(domain));
};

/**
 * Get domains by category
 */
export const getDomainsByCategory = (category: string): DomainConfig[] => {
  return getAllDomains().filter(domain => domain.category === category);
};
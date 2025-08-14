/**
 * Tests for domain constants and utilities
 * 
 * These tests ensure domain configuration consistency and utility function reliability.
 */

import {
  DOMAINS,
  DOMAIN_CONFIGS,
  DOMAIN_COLORS,
  getDomain,
  getDomainConfig,
  getDomainColor,
  getDomainCSSVariables,
  isValidDomain,
  getAllDomains,
  getDomainsByCategory,
  type Domain
} from '../domains';

// Mock the domainThemes import
jest.mock('@/lib/config/domainThemes', () => ({
  domainThemes: {
    'full-stack': {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA',
      gradientColors: ['#3B82F6', '#1E40AF'],
      backgroundPattern: 'dots',
      category: 'development'
    },
    'cloud': {
      primaryColor: '#06B6D4',
      secondaryColor: '#0891B2',
      accentColor: '#22D3EE',
      gradientColors: ['#06B6D4', '#0891B2'],
      backgroundPattern: 'grid',
      category: 'infrastructure'
    },
    'data': {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      accentColor: '#A78BFA',
      gradientColors: ['#8B5CF6', '#7C3AED'],
      backgroundPattern: 'circuit',
      category: 'analytics'
    },
    'ux-ui': {
      primaryColor: '#EC4899',
      secondaryColor: '#DB2777',
      accentColor: '#F472B6',
      gradientColors: ['#EC4899', '#DB2777'],
      backgroundPattern: 'waves',
      category: 'design'
    },
    'consulting': {
      primaryColor: '#F97316',
      secondaryColor: '#EA580C',
      accentColor: '#FB923C',
      gradientColors: ['#F97316', '#EA580C'],
      backgroundPattern: 'geometric',
      category: 'business'
    }
  }
}));

describe('Domain Constants', () => {
  describe('DOMAINS array', () => {
    it('should contain all expected domains', () => {
      expect(DOMAINS).toEqual([
        'full-stack',
        'cloud',
        'data',
        'ux-ui',
        'consulting'
      ]);
    });

    it('should have exactly 5 domains', () => {
      expect(DOMAINS).toHaveLength(5);
    });
  });

  describe('DOMAIN_CONFIGS', () => {
    it('should have configuration for all domains', () => {
      DOMAINS.forEach(domain => {
        expect(DOMAIN_CONFIGS[domain]).toBeDefined();
        expect(DOMAIN_CONFIGS[domain].id).toBe(domain);
        expect(DOMAIN_CONFIGS[domain].name).toBeTruthy();
        expect(DOMAIN_CONFIGS[domain].path).toMatch(/^\/[a-z-]+/);
        expect(DOMAIN_CONFIGS[domain].color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should have unique paths for each domain', () => {
      const paths = Object.values(DOMAIN_CONFIGS).map(config => config.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should have unique colors for each domain', () => {
      const colors = Object.values(DOMAIN_CONFIGS).map(config => config.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });
  });

  describe('DOMAIN_COLORS', () => {
    it('should have colors for all domains', () => {
      DOMAINS.forEach(domain => {
        expect(DOMAIN_COLORS[domain]).toBeDefined();
        expect(DOMAIN_COLORS[domain]).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should match colors in DOMAIN_CONFIGS', () => {
      DOMAINS.forEach(domain => {
        expect(DOMAIN_COLORS[domain]).toBe(DOMAIN_CONFIGS[domain].color);
      });
    });
  });
});

describe('Domain Utility Functions', () => {
  describe('getDomain', () => {
    it('should return domain configuration for valid domains', () => {
      const config = getDomain('full-stack');
      expect(config).toBeDefined();
      expect(config.primaryColor).toBe('#3B82F6');
      expect(config.gradientColors).toEqual(['#3B82F6', '#1E40AF']);
    });

    it('should throw error for invalid domain', () => {
      expect(() => getDomain('invalid' as Domain)).toThrow();
    });
  });

  describe('getDomainConfig', () => {
    it('should return navigation config for valid domains', () => {
      const config = getDomainConfig('cloud');
      expect(config).toBeDefined();
      expect(config.id).toBe('cloud');
      expect(config.name).toBe('Cloud Engineering');
      expect(config.path).toBe('/cloud-engineering');
    });
  });

  describe('getDomainColor', () => {
    it('should return correct color for valid domains', () => {
      expect(getDomainColor('data')).toBe('#8B5CF6');
      expect(getDomainColor('ux-ui')).toBe('#EC4899');
    });

    it('should return default color for invalid domain', () => {
      expect(getDomainColor('invalid' as Domain)).toBe('#3B82F6');
    });
  });

  describe('getDomainCSSVariables', () => {
    it('should generate CSS variables for a domain', () => {
      const variables = getDomainCSSVariables('consulting');
      
      expect(variables['--domain-primary']).toBe('#F97316');
      expect(variables['--domain-secondary']).toBe('#EA580C');
      expect(variables['--domain-accent']).toBe('#FB923C');
      expect(variables['--domain-gradient-start']).toBe('#F97316');
      expect(variables['--domain-gradient-end']).toBe('#EA580C');
      expect(variables['--domain-gradient']).toContain('linear-gradient');
      expect(variables['--domain-pattern']).toBe('geometric');
    });

    it('should generate valid CSS gradient', () => {
      const variables = getDomainCSSVariables('full-stack');
      const gradient = variables['--domain-gradient'];
      
      expect(gradient).toMatch(/^linear-gradient\(135deg, #[0-9A-F]{6}, #[0-9A-F]{6}\)$/i);
    });
  });

  describe('isValidDomain', () => {
    it('should return true for valid domains', () => {
      DOMAINS.forEach(domain => {
        expect(isValidDomain(domain)).toBe(true);
      });
    });

    it('should return false for invalid domains', () => {
      expect(isValidDomain('invalid')).toBe(false);
      expect(isValidDomain('')).toBe(false);
      expect(isValidDomain('full_stack')).toBe(false);
    });
  });

  describe('getAllDomains', () => {
    it('should return all domain configurations', () => {
      const allDomains = getAllDomains();
      expect(allDomains).toHaveLength(5);
      
      allDomains.forEach(domain => {
        expect(domain.primaryColor).toBeDefined();
        expect(domain.gradientColors).toHaveLength(2);
      });
    });
  });

  describe('getDomainsByCategory', () => {
    it('should return domains filtered by category', () => {
      const developmentDomains = getDomainsByCategory('development');
      expect(developmentDomains).toHaveLength(1);
      expect(developmentDomains[0].primaryColor).toBe('#3B82F6');

      const designDomains = getDomainsByCategory('design');
      expect(designDomains).toHaveLength(1);
      expect(designDomains[0].primaryColor).toBe('#EC4899');
    });

    it('should return empty array for non-existent category', () => {
      const result = getDomainsByCategory('non-existent');
      expect(result).toEqual([]);
    });
  });
});

describe('Domain Integration', () => {
  it('should have consistent domain IDs across all configurations', () => {
    DOMAINS.forEach(domain => {
      expect(DOMAIN_CONFIGS[domain].id).toBe(domain);
    });
  });

  it('should have valid URL paths for all domains', () => {
    Object.values(DOMAIN_CONFIGS).forEach(config => {
      expect(config.path).toMatch(/^\/[a-z-]+$/);
      expect(config.path).not.toContain(' ');
      expect(config.path).not.toContain('_');
    });
  });

  it('should have descriptive names for all domains', () => {
    Object.values(DOMAIN_CONFIGS).forEach(config => {
      expect(config.name.length).toBeGreaterThan(5);
      expect(config.shortName.length).toBeGreaterThan(2);
      expect(config.description.length).toBeGreaterThan(10);
    });
  });
});
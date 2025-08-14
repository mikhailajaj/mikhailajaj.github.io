/**
 * Domain Theme Context Tests
 * 
 * Comprehensive test suite for the domain theming system including
 * context functionality, CSS custom properties, and theme switching.
 * 
 * @fileoverview Domain theme context test suite
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { DomainThemeProvider, useDomainTheme, useDomainStyling } from '../DomainThemeContext';
import { DOMAIN_COLORS, DOMAINS } from '@/lib/constants/domains';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses the domain theme context
const TestComponent: React.FC = () => {
  const { 
    currentDomain, 
    setCurrentDomain, 
    currentDomainColor, 
    currentDomainConfig,
    isDomainActive 
  } = useDomainTheme();
  
  return (
    <div>
      <div data-testid="current-domain">{currentDomain}</div>
      <div data-testid="current-color">{currentDomainColor}</div>
      <div data-testid="current-name">{currentDomainConfig.name}</div>
      <div data-testid="is-full-stack-active">{isDomainActive('full-stack').toString()}</div>
      <button 
        data-testid="switch-to-cloud"
        onClick={() => setCurrentDomain('cloud-engineering')}
      >
        Switch to Cloud
      </button>
    </div>
  );
};

// Test component for styling utilities
const StylingTestComponent: React.FC<{ domain?: any }> = ({ domain }) => {
  const { domainColor, getThemeClasses, getThemeStyles } = useDomainStyling(domain);
  
  return (
    <div>
      <div data-testid="domain-color">{domainColor}</div>
      <div 
        data-testid="themed-element"
        className={getThemeClasses('base-class')}
        style={getThemeStyles({ fontSize: '16px' })}
      >
        Themed Element
      </div>
    </div>
  );
};

describe('DomainThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Mock document.documentElement.style
    Object.defineProperty(document.documentElement, 'style', {
      value: {
        setProperty: jest.fn(),
        removeProperty: jest.fn(),
      },
      writable: true,
    });
    
    // Mock document.body.className
    Object.defineProperty(document.body, 'className', {
      value: '',
      writable: true,
    });
  });

  describe('Provider Setup', () => {
    it('should provide default domain context', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider>{children}</DomainThemeProvider>
        ),
      });

      expect(result.current.currentDomain).toBe('full-stack');
      expect(result.current.currentDomainColor).toBe(DOMAIN_COLORS['full-stack']);
      expect(result.current.currentDomainConfig).toEqual(DOMAINS['full-stack']);
    });

    it('should use initial domain prop', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider initialDomain="cloud-engineering">
            {children}
          </DomainThemeProvider>
        ),
      });

      expect(result.current.currentDomain).toBe('cloud-engineering');
      expect(result.current.currentDomainColor).toBe(DOMAIN_COLORS['cloud-engineering']);
    });

    it('should load persisted domain from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('data-analytics');
      
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider persistSelection>{children}</DomainThemeProvider>
        ),
      });

      expect(result.current.currentDomain).toBe('data-analytics');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('portfolio-current-domain');
    });

    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useDomainTheme());
      }).toThrow('useDomainTheme must be used within a DomainThemeProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Domain Switching', () => {
    it('should switch domains correctly', () => {
      render(
        <DomainThemeProvider>
          <TestComponent />
        </DomainThemeProvider>
      );

      expect(screen.getByTestId('current-domain')).toHaveTextContent('full-stack');
      expect(screen.getByTestId('is-full-stack-active')).toHaveTextContent('true');

      fireEvent.click(screen.getByTestId('switch-to-cloud'));

      expect(screen.getByTestId('current-domain')).toHaveTextContent('cloud-engineering');
      expect(screen.getByTestId('current-color')).toHaveTextContent(DOMAIN_COLORS['cloud-engineering']);
      expect(screen.getByTestId('is-full-stack-active')).toHaveTextContent('false');
    });

    it('should persist domain selection to localStorage', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider persistSelection>{children}</DomainThemeProvider>
        ),
      });

      act(() => {
        result.current.setCurrentDomain('ux-ui-design');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'portfolio-current-domain',
        'ux-ui-design'
      );
    });

    it('should not persist when persistSelection is false', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider persistSelection={false}>{children}</DomainThemeProvider>
        ),
      });

      act(() => {
        result.current.setCurrentDomain('technical-consulting');
      });

      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('CSS Custom Properties', () => {
    it('should generate correct CSS variables', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider>{children}</DomainThemeProvider>
        ),
      });

      const variables = result.current.getDomainCSSVariables('full-stack');

      expect(variables['--domain-primary']).toBe(DOMAIN_COLORS['full-stack']);
      expect(variables['--domain-name']).toBe('"Full-Stack Development"');
      expect(variables['--domain-short-name']).toBe('"Full-Stack"');
      expect(variables['--domain-icon']).toBe('"💻"');
      expect(variables['--domain-primary-rgb']).toBe('30, 64, 175');
    });

    it('should apply theme to document root', async () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider>{children}</DomainThemeProvider>
        ),
      });

      act(() => {
        result.current.applyDomainTheme('data-analytics');
      });

      await waitFor(() => {
        expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
          '--domain-primary',
          DOMAIN_COLORS['data-analytics']
        );
      });

      expect(document.body.className).toContain('domain-data-analytics');
    });
  });

  describe('Domain Configuration', () => {
    it('should return correct domain configuration', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider>{children}</DomainThemeProvider>
        ),
      });

      const config = result.current.getDomainConfig('ux-ui-design');

      expect(config).toEqual(DOMAINS['ux-ui-design']);
      expect(config.name).toBe('UX/UI Design');
      expect(config.color).toBe(DOMAIN_COLORS['ux-ui-design']);
    });

    it('should return correct domain color', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider>{children}</DomainThemeProvider>
        ),
      });

      const color = result.current.getDomainColor('technical-consulting');

      expect(color).toBe(DOMAIN_COLORS['technical-consulting']);
    });

    it('should check domain active state correctly', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider initialDomain="cloud-engineering">
            {children}
          </DomainThemeProvider>
        ),
      });

      expect(result.current.isDomainActive('cloud-engineering')).toBe(true);
      expect(result.current.isDomainActive('full-stack')).toBe(false);
    });
  });
});

describe('useDomainStyling', () => {
  it('should provide styling utilities for current domain', () => {
    render(
      <DomainThemeProvider initialDomain="data-analytics">
        <StylingTestComponent />
      </DomainThemeProvider>
    );

    expect(screen.getByTestId('domain-color')).toHaveTextContent(
      DOMAIN_COLORS['data-analytics']
    );

    const themedElement = screen.getByTestId('themed-element');
    expect(themedElement).toHaveClass('base-class', 'domain-data-analytics');
  });

  it('should provide styling utilities for specific domain', () => {
    render(
      <DomainThemeProvider initialDomain="full-stack">
        <StylingTestComponent domain="ux-ui-design" />
      </DomainThemeProvider>
    );

    expect(screen.getByTestId('domain-color')).toHaveTextContent(
      DOMAIN_COLORS['ux-ui-design']
    );

    const themedElement = screen.getByTestId('themed-element');
    expect(themedElement).toHaveClass('base-class', 'domain-ux-ui-design');
  });

  it('should apply theme styles correctly', () => {
    render(
      <DomainThemeProvider initialDomain="technical-consulting">
        <StylingTestComponent />
      </DomainThemeProvider>
    );

    const themedElement = screen.getByTestId('themed-element');
    const computedStyle = window.getComputedStyle(themedElement);
    
    expect(themedElement.style.getPropertyValue('--domain-color')).toBe(
      DOMAIN_COLORS['technical-consulting']
    );
    expect(themedElement.style.fontSize).toBe('16px');
  });
});

describe('Domain Theme Integration', () => {
  it('should work with all domain types', () => {
    const domains = Object.keys(DOMAINS) as Array<keyof typeof DOMAINS>;

    domains.forEach(domain => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: ({ children }) => (
          <DomainThemeProvider initialDomain={domain}>
            {children}
          </DomainThemeProvider>
        ),
      });

      expect(result.current.currentDomain).toBe(domain);
      expect(result.current.currentDomainColor).toBe(DOMAIN_COLORS[domain]);
      expect(result.current.currentDomainConfig).toEqual(DOMAINS[domain]);
    });
  });

  it('should handle rapid domain switching', () => {
    const { result } = renderHook(() => useDomainTheme(), {
      wrapper: ({ children }) => (
        <DomainThemeProvider>{children}</DomainThemeProvider>
      ),
    });

    const domains = ['full-stack', 'cloud-engineering', 'data-analytics', 'ux-ui-design', 'technical-consulting'] as const;

    domains.forEach(domain => {
      act(() => {
        result.current.setCurrentDomain(domain);
      });

      expect(result.current.currentDomain).toBe(domain);
      expect(result.current.currentDomainColor).toBe(DOMAIN_COLORS[domain]);
    });
  });

  it('should maintain theme consistency across re-renders', () => {
    const { result, rerender } = renderHook(() => useDomainTheme(), {
      wrapper: ({ children }) => (
        <DomainThemeProvider initialDomain="cloud-engineering">
          {children}
        </DomainThemeProvider>
      ),
    });

    const initialDomain = result.current.currentDomain;
    const initialColor = result.current.currentDomainColor;

    rerender();

    expect(result.current.currentDomain).toBe(initialDomain);
    expect(result.current.currentDomainColor).toBe(initialColor);
  });
});
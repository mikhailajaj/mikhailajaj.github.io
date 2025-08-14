/**
 * Tests for Domain Theme Context Migration Adapter
 * 
 * @fileoverview Test suite for migration adapter ensuring backward compatibility
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';

import {
  DomainThemeProvider,
  useDomainTheme,
  useDomainStyling,
  type DomainThemeContextValue
} from '../DomainThemeContextMigration';

import { DOMAINS, type Domain } from '@/lib/constants/domains';

// Mock Next.js router
const mockPush = jest.fn();
const mockPathname = '/full-stack';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Test wrapper component
const TestWrapper: React.FC<{
  children: React.ReactNode;
  initialDomain?: Domain;
  persistSelection?: boolean;
}> = ({ children, ...props }) => (
  <DomainThemeProvider {...props}>
    {children}
  </DomainThemeProvider>
);

describe('DomainThemeContextMigration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    } as any);
    mockUsePathname.mockReturnValue(mockPathname);
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Backward Compatibility', () => {
    it('should provide the same API as original DomainThemeContext', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      // Check that all original properties exist
      expect(result.current).toHaveProperty('currentDomain');
      expect(result.current).toHaveProperty('setCurrentDomain');
      expect(result.current).toHaveProperty('getDomainConfig');
      expect(result.current).toHaveProperty('getDomainColor');
      expect(result.current).toHaveProperty('currentDomainConfig');
      expect(result.current).toHaveProperty('currentDomainColor');
      expect(result.current).toHaveProperty('applyDomainTheme');
      expect(result.current).toHaveProperty('getDomainCSSVariables');
      expect(result.current).toHaveProperty('isDomainActive');

      // Check types
      expect(typeof result.current.currentDomain).toBe('string');
      expect(typeof result.current.setCurrentDomain).toBe('function');
      expect(typeof result.current.getDomainConfig).toBe('function');
      expect(typeof result.current.getDomainColor).toBe('function');
      expect(typeof result.current.currentDomainConfig).toBe('object');
      expect(typeof result.current.currentDomainColor).toBe('string');
      expect(typeof result.current.applyDomainTheme).toBe('function');
      expect(typeof result.current.getDomainCSSVariables).toBe('function');
      expect(typeof result.current.isDomainActive).toBe('function');
    });

    it('should maintain the same behavior for domain operations', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      // Initial state
      expect(result.current.currentDomain).toBe('full-stack');
      expect(result.current.isDomainActive('full-stack')).toBe(true);
      expect(result.current.isDomainActive('cloud')).toBe(false);

      // Domain change
      result.current.setCurrentDomain('cloud');
      expect(result.current.currentDomain).toBe('cloud');
      expect(result.current.isDomainActive('cloud')).toBe(true);
      expect(result.current.isDomainActive('full-stack')).toBe(false);
    });

    it('should provide the same domain configuration access', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      const config = result.current.getDomainConfig('cloud');
      expect(config).toHaveProperty('id', 'cloud');
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('color');

      const currentConfig = result.current.currentDomainConfig;
      expect(currentConfig).toHaveProperty('id', 'full-stack');
    });

    it('should provide the same domain color access', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      const cloudColor = result.current.getDomainColor('cloud');
      expect(typeof cloudColor).toBe('string');
      expect(cloudColor).toMatch(/^#[0-9a-fA-F]{6}$/); // Hex color format

      const currentColor = result.current.currentDomainColor;
      expect(typeof currentColor).toBe('string');
      expect(currentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should provide the same CSS variables access', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      const variables = result.current.getDomainCSSVariables('cloud');
      expect(typeof variables).toBe('object');
      expect(variables).toHaveProperty('--domain-color');
    });
  });

  describe('useDomainStyling Compatibility', () => {
    it('should provide the same styling utilities API', () => {
      const { result } = renderHook(() => useDomainStyling(), {
        wrapper: TestWrapper,
      });

      // Check that all original properties exist
      expect(result.current).toHaveProperty('domain');
      expect(result.current).toHaveProperty('domainColor');
      expect(result.current).toHaveProperty('cssVariables');
      expect(result.current).toHaveProperty('getThemeClasses');
      expect(result.current).toHaveProperty('getThemeStyles');

      // Check types
      expect(typeof result.current.domain).toBe('string');
      expect(typeof result.current.domainColor).toBe('string');
      expect(typeof result.current.cssVariables).toBe('object');
      expect(typeof result.current.getThemeClasses).toBe('function');
      expect(typeof result.current.getThemeStyles).toBe('function');
    });

    it('should generate the same theme classes', () => {
      const { result } = renderHook(() => useDomainStyling(), {
        wrapper: TestWrapper,
      });

      const classes = result.current.getThemeClasses('base-class');
      expect(classes).toBe('base-class domain-full-stack');

      const emptyClasses = result.current.getThemeClasses();
      expect(emptyClasses).toBe('domain-full-stack');
    });

    it('should generate the same theme styles', () => {
      const { result } = renderHook(() => useDomainStyling(), {
        wrapper: TestWrapper,
      });

      const styles = result.current.getThemeStyles({ color: 'red' });
      expect(styles).toHaveProperty('color', 'red');
      expect(styles).toHaveProperty('--domain-color');
      expect(typeof styles['--domain-color']).toBe('string');
    });

    it('should work with specific domain parameter', () => {
      const { result } = renderHook(() => useDomainStyling('cloud'), {
        wrapper: TestWrapper,
      });

      expect(result.current.domain).toBe('cloud');
      
      const classes = result.current.getThemeClasses('test');
      expect(classes).toBe('test domain-cloud');
    });
  });

  describe('Provider Compatibility', () => {
    it('should accept the same props as original provider', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: (props) => (
          <TestWrapper 
            initialDomain="cloud" 
            persistSelection={false}
            {...props} 
          />
        ),
      });

      expect(result.current.currentDomain).toBe('cloud');
    });

    it('should handle persistence the same way', () => {
      mockLocalStorage.getItem.mockReturnValue('data');

      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: (props) => (
          <TestWrapper persistSelection={true} {...props} />
        ),
      });

      expect(result.current.currentDomain).toBe('data');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('portfolio-domain-theme');
    });
  });

  describe('Enhanced Features (Backward Compatible)', () => {
    it('should still work with enhanced optimizations under the hood', () => {
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      // The API should be the same, but performance should be better
      // We can't directly test performance improvements, but we can ensure
      // the functionality still works correctly

      result.current.setCurrentDomain('cloud');
      expect(result.current.currentDomain).toBe('cloud');

      result.current.setCurrentDomain('data');
      expect(result.current.currentDomain).toBe('data');

      // Multiple rapid changes should still work
      result.current.setCurrentDomain('ux-ui');
      result.current.setCurrentDomain('consulting');
      result.current.setCurrentDomain('full-stack');
      
      expect(result.current.currentDomain).toBe('full-stack');
    });
  });

  describe('Error Handling Compatibility', () => {
    it('should throw the same error when used outside provider', () => {
      const { result } = renderHook(() => useDomainTheme());

      expect(result.error).toEqual(
        Error('useOptimizedDomainTheme must be used within an OptimizedDomainThemeProvider')
      );
    });
  });

  describe('Type Compatibility', () => {
    it('should export the same types', () => {
      // This is more of a compile-time test, but we can check runtime behavior
      const { result } = renderHook(() => useDomainTheme(), {
        wrapper: TestWrapper,
      });

      // The context value should satisfy the legacy interface
      const contextValue: DomainThemeContextValue = result.current;
      
      expect(contextValue.currentDomain).toBeDefined();
      expect(contextValue.setCurrentDomain).toBeDefined();
      expect(contextValue.getDomainConfig).toBeDefined();
      expect(contextValue.getDomainColor).toBeDefined();
      expect(contextValue.currentDomainConfig).toBeDefined();
      expect(contextValue.currentDomainColor).toBeDefined();
      expect(contextValue.applyDomainTheme).toBeDefined();
      expect(contextValue.getDomainCSSVariables).toBeDefined();
      expect(contextValue.isDomainActive).toBeDefined();
    });
  });
});
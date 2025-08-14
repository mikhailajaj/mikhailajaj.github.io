/**
 * Tests for Optimized Domain Theme Context
 * 
 * @fileoverview Test suite for optimized domain theme context
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';

import {
  OptimizedDomainThemeProvider,
  useOptimizedDomainTheme,
  useOptimizedDomainThemeSelector,
  useCurrentDomain,
  useDomainOperations,
  useOptimizedDomainStyling,
  useDomainThemePerformance
} from '../OptimizedDomainThemeContext';

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

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
  writable: true,
});

// Test wrapper component
const TestWrapper: React.FC<{
  children: React.ReactNode;
  initialDomain?: Domain;
  persistSelection?: boolean;
  enableSSR?: boolean;
  enablePerformanceTracking?: boolean;
  enableNavigationIntegration?: boolean;
  onDomainChange?: (domain: Domain, previousDomain: Domain | null) => void;
  onError?: (error: Error) => void;
}> = ({ children, ...props }) => (
  <OptimizedDomainThemeProvider {...props}>
    {children}
  </OptimizedDomainThemeProvider>
);

describe('OptimizedDomainThemeContext', () => {
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

  describe('Provider Initialization', () => {
    it('should initialize with default domain', () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: TestWrapper,
      });

      expect(result.current.state.currentDomain).toBe('full-stack');
      expect(result.current.state.previousDomain).toBe(null);
      expect(result.current.state.isTransitioning).toBe(false);
    });

    it('should initialize with custom initial domain', () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: ({ children }) => <TestWrapper initialDomain="cloud">{children}</TestWrapper>,
      });

      expect(result.current.state.currentDomain).toBe('cloud');
    });

    it('should load persisted domain from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('data');

      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: ({ children }) => <TestWrapper persistSelection={true}>{children}</TestWrapper>,
      });

      expect(result.current.state.currentDomain).toBe('data');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('portfolio-domain-theme');
    });

    it('should extract domain from pathname when navigation integration is enabled', () => {
      mockUsePathname.mockReturnValue('/cloud-engineering/services');

      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: ({ children }) => <TestWrapper enableNavigationIntegration={true}>{children}</TestWrapper>,
      });

      expect(result.current.state.currentDomain).toBe('cloud');
    });
  });

  describe('Domain Operations', () => {
    it('should set current domain', async () => {
      const onDomainChange = jest.fn();
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: (props) => <TestWrapper onDomainChange={onDomainChange} {...props} />,
      });

      act(() => {
        result.current.setCurrentDomain('cloud');
      });

      expect(result.current.state.currentDomain).toBe('cloud');
      expect(result.current.state.previousDomain).toBe('full-stack');
      expect(onDomainChange).toHaveBeenCalledWith('cloud', 'full-stack');
    });

    it('should persist domain selection when enabled', async () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: (props) => <TestWrapper persistSelection={true} {...props} />,
      });

      act(() => {
        result.current.setCurrentDomain('cloud');
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('portfolio-domain-theme', 'cloud');
    });

    it('should set domain with transition', async () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: TestWrapper,
      });

      let transitionPromise: Promise<void>;
      act(() => {
        transitionPromise = result.current.setCurrentDomainWithTransition('cloud', 100);
      });

      // Should be transitioning initially
      expect(result.current.state.isTransitioning).toBe(true);

      // Wait for transition to complete
      await act(async () => {
        await transitionPromise!;
      });

      expect(result.current.state.currentDomain).toBe('cloud');
      expect(result.current.state.isTransitioning).toBe(false);
    });

    it('should navigate to domain with router integration', async () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: (props) => <TestWrapper enableNavigationIntegration={true} {...props} />,
      });

      await act(async () => {
        await result.current.navigateToDomain('cloud');
      });

      expect(mockPush).toHaveBeenCalledWith('/cloud-engineering');
      expect(result.current.state.currentDomain).toBe('cloud');
    });
  });

  describe('Selective Re-rendering Hooks', () => {
    it('should use selector for selective re-rendering', () => {
      const selector = jest.fn((context) => context.state.currentDomain);
      
      const { result } = renderHook(() => useOptimizedDomainThemeSelector(selector), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe('full-stack');
      expect(selector).toHaveBeenCalledTimes(1);
    });

    it('should use current domain hook', () => {
      const { result } = renderHook(() => useCurrentDomain(), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe('full-stack');
    });

    it('should use domain operations hook', () => {
      const { result } = renderHook(() => useDomainOperations(), {
        wrapper: TestWrapper,
      });

      expect(typeof result.current.setCurrentDomain).toBe('function');
      expect(typeof result.current.setCurrentDomainWithTransition).toBe('function');
      expect(typeof result.current.navigateToDomain).toBe('function');
      expect(typeof result.current.isDomainActive).toBe('function');
    });
  });

  describe('Domain Styling', () => {
    it('should provide optimized domain styling utilities', () => {
      const { result } = renderHook(() => useOptimizedDomainStyling(), {
        wrapper: TestWrapper,
      });

      expect(result.current.domain).toBe('full-stack');
      expect(typeof result.current.domainColor).toBe('string');
      expect(typeof result.current.cssVariables).toBe('object');
      expect(typeof result.current.getThemeClasses).toBe('function');
      expect(typeof result.current.getThemeStyles).toBe('function');
    });

    it('should generate theme classes correctly', () => {
      const { result } = renderHook(() => useOptimizedDomainStyling(), {
        wrapper: TestWrapper,
      });

      const classes = result.current.getThemeClasses('base-class');
      expect(classes).toBe('base-class domain-full-stack');
    });

    it('should generate theme styles correctly', () => {
      const { result } = renderHook(() => useOptimizedDomainStyling(), {
        wrapper: TestWrapper,
      });

      const styles = result.current.getThemeStyles({ color: 'red' });
      expect(styles).toHaveProperty('color', 'red');
      expect(styles).toHaveProperty('--domain-color');
    });
  });

  describe('Performance Monitoring', () => {
    it('should track performance metrics in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { result } = renderHook(() => useDomainThemePerformance(), {
        wrapper: (props) => <TestWrapper enablePerformanceTracking={true} {...props} />,
      });

      expect(result.current).not.toBe(null);
      expect(result.current?.metrics).toBeDefined();
      expect(typeof result.current?.clearMetrics).toBe('function');

      process.env.NODE_ENV = originalEnv;
    });

    it('should not provide performance monitoring in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { result } = renderHook(() => useDomainThemePerformance(), {
        wrapper: TestWrapper,
      });

      expect(result.current).toBe(null);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      const onError = jest.fn();
      mockPush.mockRejectedValue(new Error('Navigation failed'));

      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: (props) => <TestWrapper onError={onError} enableNavigationIntegration={true} {...props} />,
      });

      await act(async () => {
        await result.current.navigateToDomain('cloud');
      });

      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(result.current.error).toBeInstanceOf(Error);
    });

    it('should clear errors', () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: TestWrapper,
      });

      // Simulate error state
      act(() => {
        (result.current as any).error = new Error('Test error');
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('Theme Caching and Preloading', () => {
    it('should preload domain themes', async () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: TestWrapper,
      });

      await act(async () => {
        await result.current.preloadDomainTheme('cloud');
      });

      // Should not throw and should complete successfully
      expect(true).toBe(true);
    });

    it('should cache CSS variables for performance', () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: TestWrapper,
      });

      const variables1 = result.current.getDomainCSSVariables('cloud');
      const variables2 = result.current.getDomainCSSVariables('cloud');

      // Should return the same object reference (cached)
      expect(variables1).toBe(variables2);
    });
  });

  describe('Navigation Synchronization', () => {
    it('should sync with navigation changes', () => {
      const { result, rerender } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: (props) => <TestWrapper enableNavigationIntegration={true} {...props} />,
      });

      // Change pathname
      mockUsePathname.mockReturnValue('/data-analytics/projects');
      
      act(() => {
        result.current.syncWithNavigation();
      });

      expect(result.current.state.currentDomain).toBe('data');
    });

    it('should get correct domain paths', () => {
      const { result } = renderHook(() => useOptimizedDomainTheme(), {
        wrapper: TestWrapper,
      });

      expect(result.current.getDomainPath('cloud')).toBe('/cloud-engineering');
      expect(result.current.getDomainPath('data')).toBe('/data-analytics');
      expect(result.current.getDomainPath('ux-ui')).toBe('/ux-ui-design');
    });
  });

  describe('Context Error Handling', () => {
    it('should throw error when used outside provider', () => {
      const { result } = renderHook(() => useOptimizedDomainTheme());

      expect(result.error).toEqual(
        Error('useOptimizedDomainTheme must be used within an OptimizedDomainThemeProvider')
      );
    });
  });
});
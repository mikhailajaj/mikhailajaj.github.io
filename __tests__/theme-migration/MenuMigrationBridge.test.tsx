/**
 * Menu Migration Bridge Tests
 * 
 * Tests for the migration bridge between legacy DomainThemeContext
 * and the new Unified Theme System.
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useThemeMigrationBridge, useNavigationThemeMigration, useMigrationStatus } from '@/lib/theme/migration/MenuMigrationBridge';

// Mock the theme systems
jest.mock('@/lib/theme', () => ({
  useUnifiedTheme: jest.fn(),
}));

jest.mock('@/lib/contexts/DomainThemeContext', () => ({
  useDomainTheme: jest.fn(),
  useOptimizedDomainTheme: jest.fn(),
  useCurrentDomain: jest.fn(),
}));

const mockUseUnifiedTheme = require('@/lib/theme').useUnifiedTheme;
const mockUseDomainTheme = require('@/lib/contexts/DomainThemeContext').useDomainTheme;
const mockUseOptimizedDomainTheme = require('@/lib/contexts/DomainThemeContext').useOptimizedDomainTheme;
const mockUseCurrentDomain = require('@/lib/contexts/DomainThemeContext').useCurrentDomain;

// Test component that uses the migration bridge
function TestComponent() {
  const bridge = useThemeMigrationBridge();
  const navigationBridge = useNavigationThemeMigration();
  const migrationStatus = useMigrationStatus();

  return (
    <div>
      <div data-testid="active-system">{bridge.system}</div>
      <div data-testid="current-domain">{bridge.currentDomain}</div>
      <div data-testid="is-loading">{bridge.isLoading.toString()}</div>
      <div data-testid="unified-available">{migrationStatus.unifiedAvailable.toString()}</div>
      <div data-testid="nav-styles">{JSON.stringify(navigationBridge.navigationTheme.getNavBarStyles())}</div>
    </div>
  );
}

describe('MenuMigrationBridge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useThemeMigrationBridge', () => {
    it('should prefer unified theme system when available', () => {
      // Mock unified theme as available and working
      mockUseUnifiedTheme.mockReturnValue({
        theme: {
          domain: 'cloud',
          mode: 'dark',
          colors: {
            domainPrimary: '#0066cc',
            backgroundPrimary: '#1a1a1a',
            textPrimary: '#ffffff',
          },
        },
        isLoading: false,
        error: null,
        setDomain: jest.fn(),
        setMode: jest.fn(),
        toggleMode: jest.fn(),
        setTheme: jest.fn(),
      });

      // Mock legacy systems
      mockUseOptimizedDomainTheme.mockReturnValue({
        theme: { domain: 'full-stack' },
        currentDomain: 'full-stack',
        isLoading: false,
      });
      mockUseCurrentDomain.mockReturnValue('full-stack');
      mockUseDomainTheme.mockReturnValue({});

      render(<TestComponent />);

      expect(screen.getByTestId('active-system')).toHaveTextContent('unified');
      expect(screen.getByTestId('current-domain')).toHaveTextContent('cloud');
      expect(screen.getByTestId('unified-available')).toHaveTextContent('true');
    });

    it('should fallback to optimized domain theme when unified is not available', () => {
      // Mock unified theme as loading/unavailable
      mockUseUnifiedTheme.mockReturnValue({
        theme: null,
        isLoading: true,
        error: null,
        setDomain: jest.fn(),
        setMode: jest.fn(),
        toggleMode: jest.fn(),
        setTheme: jest.fn(),
      });

      // Mock optimized domain theme as available
      mockUseOptimizedDomainTheme.mockReturnValue({
        theme: {
          domain: 'data',
          colors: { domainPrimary: '#ff6600' },
        },
        currentDomain: 'data',
        isLoading: false,
        setDomain: jest.fn(),
      });
      mockUseCurrentDomain.mockReturnValue('data');
      mockUseDomainTheme.mockReturnValue({});

      render(<TestComponent />);

      expect(screen.getByTestId('active-system')).toHaveTextContent('optimized');
      expect(screen.getByTestId('current-domain')).toHaveTextContent('data');
      expect(screen.getByTestId('unified-available')).toHaveTextContent('false');
    });

    it('should fallback to legacy domain theme when others are unavailable', () => {
      // Mock unified theme as unavailable
      mockUseUnifiedTheme.mockReturnValue({
        theme: null,
        isLoading: false,
        error: new Error('Not available'),
        setDomain: jest.fn(),
        setMode: jest.fn(),
        toggleMode: jest.fn(),
        setTheme: jest.fn(),
      });

      // Mock optimized as unavailable
      mockUseOptimizedDomainTheme.mockReturnValue({
        theme: null,
        currentDomain: null,
        isLoading: false,
      });
      mockUseCurrentDomain.mockReturnValue(null);

      // Mock legacy as available
      mockUseDomainTheme.mockReturnValue({
        theme: { domain: 'ux-ui' },
        currentDomain: 'ux-ui',
        isLoading: false,
        setDomain: jest.fn(),
      });

      render(<TestComponent />);

      expect(screen.getByTestId('active-system')).toHaveTextContent('legacy');
      expect(screen.getByTestId('current-domain')).toHaveTextContent('ux-ui');
    });
  });

  describe('useNavigationThemeMigration', () => {
    it('should provide navigation-specific styling utilities', () => {
      mockUseUnifiedTheme.mockReturnValue({
        theme: {
          domain: 'cloud',
          mode: 'dark',
          colors: {
            domainPrimary: '#0066cc',
            backgroundPrimary: '#1a1a1a',
            textPrimary: '#ffffff',
            borderPrimary: '#333333',
          },
        },
        isLoading: false,
        error: null,
        setDomain: jest.fn(),
        setMode: jest.fn(),
        toggleMode: jest.fn(),
        setTheme: jest.fn(),
      });

      mockUseOptimizedDomainTheme.mockReturnValue({});
      mockUseCurrentDomain.mockReturnValue('cloud');
      mockUseDomainTheme.mockReturnValue({});

      render(<TestComponent />);

      const navStyles = JSON.parse(screen.getByTestId('nav-styles').textContent || '{}');
      expect(navStyles.backgroundColor).toBe('#1a1a1a');
      expect(navStyles.color).toBe('#ffffff');
      expect(navStyles['--nav-accent']).toBe('#0066cc');
    });
  });

  describe('Migration utilities', () => {
    it('should provide migration status information', () => {
      mockUseUnifiedTheme.mockReturnValue({
        theme: { domain: 'cloud' },
        isLoading: false,
        error: null,
        setDomain: jest.fn(),
        setMode: jest.fn(),
        toggleMode: jest.fn(),
        setTheme: jest.fn(),
      });

      mockUseOptimizedDomainTheme.mockReturnValue({
        theme: { domain: 'cloud' },
      });
      mockUseCurrentDomain.mockReturnValue('cloud');
      mockUseDomainTheme.mockReturnValue({
        theme: { domain: 'cloud' },
      });

      render(<TestComponent />);

      expect(screen.getByTestId('unified-available')).toHaveTextContent('true');
    });
  });
});
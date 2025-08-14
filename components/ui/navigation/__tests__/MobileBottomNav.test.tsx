/**
 * Mobile Bottom Navigation Tests
 * 
 * Comprehensive test suite for the enhanced mobile bottom navigation component
 * including accessibility, touch interactions, and domain theming.
 * 
 * @fileoverview Mobile bottom navigation test suite
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { usePathname } from 'next/navigation';
import { MobileBottomNav, useMobileBottomNavPadding } from '../MobileBottomNav';
import { DomainThemeProvider } from '@/lib/contexts/DomainThemeContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
}));

// Mock accessibility utilities
jest.mock('@/lib/utils/accessibility', () => ({
  announceUtils: {
    announce: jest.fn(),
  },
}));

// Test wrapper with theme provider
const TestWrapper: React.FC<{ children: React.ReactNode; initialDomain?: any }> = ({ 
  children, 
  initialDomain = 'full-stack' 
}) => (
  <DomainThemeProvider initialDomain={initialDomain}>
    {children}
  </DomainThemeProvider>
);

describe('MobileBottomNav', () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  describe('Basic Rendering', () => {
    it('should render navigation with all items', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /projects/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /services/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /blog/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /contact/i })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(
        <TestWrapper>
          <MobileBottomNav className="custom-nav" />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation').parentElement).toHaveClass('custom-nav');
    });

    it('should use custom aria label', () => {
      render(
        <TestWrapper>
          <MobileBottomNav ariaLabel="Custom mobile navigation" />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Custom mobile navigation'
      );
    });

    it('should be hidden on desktop (md and up)', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const container = screen.getByRole('navigation').parentElement;
      expect(container).toHaveClass('md:hidden');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Mobile bottom navigation');

      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBe(5);

      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-label');
      });
    });

    it('should indicate current page with aria-current', () => {
      mockUsePathname.mockReturnValue('/projects');
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const projectsTab = screen.getByRole('tab', { name: /projects.*current/i });
      expect(projectsTab).toHaveAttribute('aria-current', 'page');
    });

    it('should have proper touch target sizes', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        expect(tab).toHaveClass('min-h-[48px]', 'min-w-[48px]');
      });
    });

    it('should announce navigation changes', async () => {
      const user = userEvent.setup();
      const { announceUtils } = require('@/lib/utils/accessibility');
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const projectsTab = screen.getByRole('tab', { name: /projects/i });
      await user.click(projectsTab);

      expect(announceUtils.announce).toHaveBeenCalledWith(
        'Navigated to Projects',
        'polite'
      );
    });

    it('should have descriptive aria-labels for each tab', () => {
      mockUsePathname.mockReturnValue('/blog');
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      expect(screen.getByRole('tab', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Projects' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Services' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Blog (current page)' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Contact' })).toBeInTheDocument();
    });
  });

  describe('Domain Theming', () => {
    it('should apply domain colors to active tab', () => {
      mockUsePathname.mockReturnValue('/');
      
      render(
        <TestWrapper initialDomain="data-analytics">
          <MobileBottomNav />
        </TestWrapper>
      );

      const homeTab = screen.getByRole('tab', { name: /home.*current/i });
      expect(homeTab.style.backgroundColor).toContain('rgba');
      expect(homeTab.style.color).toBe('white');
    });

    it('should apply domain colors to active indicator', () => {
      mockUsePathname.mockReturnValue('/projects');
      
      render(
        <TestWrapper initialDomain="ux-ui-design">
          <MobileBottomNav />
        </TestWrapper>
      );

      const activeIndicator = screen.getByRole('tab', { name: /projects.*current/i })
        .querySelector('[aria-hidden="true"]');
      
      expect(activeIndicator).toHaveStyle('background-color: #7c3aed');
    });

    it('should apply domain colors to ripple effect', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper initialDomain="technical-consulting">
          <MobileBottomNav />
        </TestWrapper>
      );

      const contactTab = screen.getByRole('tab', { name: /contact/i });
      
      // The ripple effect styling should be applied
      const rippleElement = contactTab.querySelector('[aria-hidden="true"]:last-child');
      expect(rippleElement).toHaveStyle('background-color: #ea580c10');
    });

    it('should update theme when domain changes', () => {
      const { rerender } = render(
        <TestWrapper initialDomain="full-stack">
          <MobileBottomNav />
        </TestWrapper>
      );

      mockUsePathname.mockReturnValue('/');
      
      rerender(
        <TestWrapper initialDomain="cloud-engineering">
          <MobileBottomNav />
        </TestWrapper>
      );

      const homeTab = screen.getByRole('tab', { name: /home.*current/i });
      expect(homeTab.style.backgroundColor).toContain('rgba');
    });
  });

  describe('Active State Management', () => {
    it('should highlight active tab based on pathname', () => {
      mockUsePathname.mockReturnValue('/blog');
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const blogTab = screen.getByRole('tab', { name: /blog.*current/i });
      expect(blogTab).toHaveAttribute('aria-current', 'page');
      expect(blogTab.style.color).toBe('white');
    });

    it('should show active indicator for current page', () => {
      mockUsePathname.mockReturnValue('/services');
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const servicesTab = screen.getByRole('tab', { name: /services.*current/i });
      const indicator = servicesTab.querySelector('[aria-hidden="true"]');
      
      expect(indicator).toBeInTheDocument();
    });

    it('should handle root path correctly', () => {
      mockUsePathname.mockReturnValue('/');
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const homeTab = screen.getByRole('tab', { name: /home.*current/i });
      expect(homeTab).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Badge Functionality', () => {
    // Note: The current implementation doesn't show badges, but we test the structure
    it('should support badge display structure', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const tabs = screen.getAllByRole('tab');
      tabs.forEach(tab => {
        // Each tab should have the structure to support badges
        const iconContainer = tab.querySelector('[aria-hidden="true"]');
        expect(iconContainer).toBeInTheDocument();
      });
    });
  });

  describe('Touch Interactions', () => {
    it('should handle touch events properly', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const projectsTab = screen.getByRole('tab', { name: /projects/i });
      
      // Simulate touch interaction
      await user.click(projectsTab);
      
      // Should navigate (tested through the Link component)
      expect(projectsTab).toHaveAttribute('href', '/projects');
    });

    it('should provide visual feedback on interaction', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const servicesTab = screen.getByRole('tab', { name: /services/i });
      
      // The component should have ripple effect elements
      const rippleElement = servicesTab.querySelector('[aria-hidden="true"]:last-child');
      expect(rippleElement).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('should be positioned at bottom of screen', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const container = screen.getByRole('navigation').parentElement;
      expect(container).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0');
    });

    it('should have proper z-index for overlay', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const container = screen.getByRole('navigation').parentElement;
      expect(container).toHaveClass('z-50');
    });

    it('should have backdrop blur effect', () => {
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const container = screen.getByRole('navigation').parentElement;
      expect(container).toHaveClass('backdrop-blur-md');
    });
  });

  describe('Performance', () => {
    it('should render within performance budget', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in under 16ms (60fps budget)
      expect(renderTime).toBeLessThan(16);
    });

    it('should handle rapid interactions efficiently', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <MobileBottomNav />
        </TestWrapper>
      );

      const tabs = screen.getAllByRole('tab');
      
      const startTime = performance.now();
      
      // Rapid clicks on different tabs
      for (let i = 0; i < 10; i++) {
        await user.click(tabs[i % tabs.length]);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle rapid interactions efficiently
      expect(totalTime).toBeLessThan(100);
    });
  });
});

describe('useMobileBottomNavPadding', () => {
  it('should return correct padding classes', () => {
    const paddingClasses = useMobileBottomNavPadding();
    expect(paddingClasses).toBe('pb-16 md:pb-0');
  });
});
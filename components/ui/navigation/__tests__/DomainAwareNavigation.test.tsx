/**
 * Domain Aware Navigation Tests
 * 
 * Comprehensive test suite for the enhanced domain-aware navigation component
 * including accessibility, keyboard navigation, and domain theming.
 * 
 * @fileoverview Domain aware navigation test suite
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { usePathname } from 'next/navigation';
import { DomainAwareNavigation } from '../DomainAwareNavigation';
import { DomainThemeProvider } from '@/lib/contexts/DomainThemeContext';
import { DOMAINS } from '@/lib/constants/domains';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock accessibility utilities
jest.mock('@/lib/utils/accessibility', () => ({
  announceUtils: {
    announce: jest.fn(),
  },
  focusUtils: {
    trapFocus: jest.fn(),
    getFocusableElements: jest.fn(),
    moveFocus: jest.fn(),
  },
  keyboardUtils: {
    handleArrowNavigation: jest.fn((e, items, currentIndex, options) => {
      // Simple mock implementation
      if (e.key === 'ArrowRight') return Math.min(currentIndex + 1, items.length - 1);
      if (e.key === 'ArrowLeft') return Math.max(currentIndex - 1, 0);
      return currentIndex;
    }),
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

describe('DomainAwareNavigation', () => {
  const mockUsePathname = usePathname as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
    
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  describe('Basic Rendering', () => {
    it('should render navigation with default props', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByText('Mikhail Ajaj')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
    });

    it('should display current domain indicator', () => {
      render(
        <TestWrapper initialDomain="cloud-engineering">
          <DomainAwareNavigation />
        </TestWrapper>
      );

      expect(screen.getByText('Cloud Engineering')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Current domain: Cloud Engineering'
      );
    });

    it('should apply custom className', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation className="custom-nav" />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toHaveClass('custom-nav');
    });

    it('should use custom aria label', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation ariaLabel="Custom navigation" />
        </TestWrapper>
      );

      expect(screen.getByRole('navigation')).toHaveAttribute(
        'aria-label',
        'Custom navigation'
      );
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Main navigation');

      const menubar = screen.getByRole('menubar');
      expect(menubar).toBeInTheDocument();

      const menuItems = screen.getAllByRole('menuitem');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    it('should indicate current page with aria-current', () => {
      mockUsePathname.mockReturnValue('/experience');
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const experienceLink = screen.getByRole('menuitem', { name: /experience/i });
      expect(experienceLink).toHaveAttribute('aria-current', 'page');
    });

    it('should have proper touch target sizes', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const menuItems = screen.getAllByRole('menuitem');
      menuItems.forEach(item => {
        expect(item).toHaveClass('min-h-[44px]');
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const firstMenuItem = screen.getAllByRole('menuitem')[0];
      firstMenuItem.focus();

      await user.keyboard('{ArrowRight}');
      
      // Verify keyboard navigation handler was called
      const { keyboardUtils } = require('@/lib/utils/accessibility');
      expect(keyboardUtils.handleArrowNavigation).toHaveBeenCalled();
    });
  });

  describe('Domain Theming', () => {
    it('should apply domain colors to active links', () => {
      mockUsePathname.mockReturnValue('/');
      
      render(
        <TestWrapper initialDomain="data-analytics">
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const homeLink = screen.getByRole('menuitem', { name: /home/i });
      expect(homeLink.style.backgroundColor).toContain('rgba');
    });

    it('should update theme when domain changes', async () => {
      const handleDomainChange = jest.fn();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation onDomainChange={handleDomainChange} />
        </TestWrapper>
      );

      // Open domain dropdown
      const expertiseButton = screen.getByRole('menuitem', { name: /expertise/i });
      fireEvent.click(expertiseButton);

      // Click on a domain
      const cloudLink = screen.getByRole('menuitem', { name: /cloud engineering/i });
      fireEvent.click(cloudLink);

      expect(handleDomainChange).toHaveBeenCalledWith('cloud-engineering');
    });

    it('should show domain colors in dropdown', async () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      // Open domain dropdown
      const expertiseButton = screen.getByRole('menuitem', { name: /expertise/i });
      fireEvent.click(expertiseButton);

      await waitFor(() => {
        const dropdown = screen.getByRole('menu');
        expect(dropdown).toBeInTheDocument();
      });

      // Check that domain items have proper styling
      const domainItems = screen.getAllByRole('menuitem').filter(item => 
        item.textContent?.includes('Full-Stack') || 
        item.textContent?.includes('Cloud') ||
        item.textContent?.includes('Data') ||
        item.textContent?.includes('UX/UI') ||
        item.textContent?.includes('Consulting')
      );

      expect(domainItems.length).toBeGreaterThan(0);
    });
  });

  describe('Mobile Navigation', () => {
    it('should toggle mobile menu', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const mobileToggle = screen.getByRole('button', { name: /open navigation menu/i });
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');

      await user.click(mobileToggle);

      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu', { name: /mobile/i })).toBeInTheDocument();
    });

    it('should close mobile menu on escape', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      // Open mobile menu
      const mobileToggle = screen.getByRole('button', { name: /open navigation menu/i });
      await user.click(mobileToggle);

      // Press escape
      await user.keyboard('{Escape}');

      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('should announce menu state changes', async () => {
      const user = userEvent.setup();
      const { announceUtils } = require('@/lib/utils/accessibility');
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const mobileToggle = screen.getByRole('button', { name: /open navigation menu/i });
      await user.click(mobileToggle);

      expect(announceUtils.announce).toHaveBeenCalledWith(
        'Navigation menu opened',
        'assertive'
      );
    });

    it('should have larger touch targets on mobile', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      // Open mobile menu
      const mobileToggle = screen.getByRole('button', { name: /open navigation menu/i });
      await user.click(mobileToggle);

      const mobileMenuItems = screen.getAllByRole('menuitem');
      const mobileItems = mobileMenuItems.filter(item => 
        item.className.includes('min-h-[48px]')
      );

      expect(mobileItems.length).toBeGreaterThan(0);
    });
  });

  describe('Dropdown Functionality', () => {
    it('should open and close dropdown on click', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const expertiseButton = screen.getByRole('menuitem', { name: /expertise/i });
      expect(expertiseButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(expertiseButton);

      expect(expertiseButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should close dropdown on escape', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      // Open dropdown
      const expertiseButton = screen.getByRole('menuitem', { name: /expertise/i });
      await user.click(expertiseButton);

      // Press escape
      await user.keyboard('{Escape}');

      expect(expertiseButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show all domain options', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const expertiseButton = screen.getByRole('menuitem', { name: /expertise/i });
      await user.click(expertiseButton);

      // Check that all domains are present
      Object.values(DOMAINS).forEach(domain => {
        expect(screen.getByText(domain.shortName)).toBeInTheDocument();
      });
    });
  });

  describe('Scroll Behavior', () => {
    it('should change appearance on scroll', async () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const nav = screen.getByRole('navigation');
      
      // Initially transparent
      expect(nav).not.toHaveClass('bg-black/90');

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(nav).toHaveClass('bg-black/90');
      });
    });
  });

  describe('Domain Switcher', () => {
    it('should hide domain switcher when showDomainSwitcher is false', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation showDomainSwitcher={false} />
        </TestWrapper>
      );

      expect(screen.queryByRole('menuitem', { name: /expertise/i })).not.toBeInTheDocument();
    });

    it('should show domain switcher by default', () => {
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      expect(screen.getByRole('menuitem', { name: /expertise/i })).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('should render within performance budget', () => {
      const startTime = performance.now();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in under 16ms (60fps budget)
      expect(renderTime).toBeLessThan(16);
    });

    it('should handle rapid domain switching efficiently', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <DomainAwareNavigation />
        </TestWrapper>
      );

      const expertiseButton = screen.getByRole('menuitem', { name: /expertise/i });
      
      const startTime = performance.now();
      
      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        await user.click(expertiseButton);
        await user.click(expertiseButton);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle rapid interactions efficiently
      expect(totalTime).toBeLessThan(100);
    });
  });
});
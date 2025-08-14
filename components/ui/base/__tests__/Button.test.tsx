/**
 * Button Component Tests
 * 
 * Comprehensive test suite for the enhanced Button component including
 * accessibility, domain theming, and interaction testing.
 * 
 * @fileoverview Button component test suite with accessibility focus
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';
import { DOMAIN_COLORS } from '@/lib/constants/domains';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock the accessibility utilities
jest.mock('@/lib/utils/accessibility', () => ({
  announceUtils: {
    announce: jest.fn(),
  },
}));

describe('Button Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('should render with custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });

    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      
      const link = screen.getByRole('link', { name: 'Link Button' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should meet minimum touch target size requirements', () => {
      render(<Button size="sm">Small Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('min-h-[44px]');
    });

    it('should have proper focus indicators', () => {
      render(<Button>Focus Test</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('should support ARIA labels', () => {
      render(
        <Button 
          aria-label="Custom label"
          aria-describedby="description"
        >
          Button
        </Button>
      );
      
      const button = screen.getByRole('button', { name: 'Custom label' });
      expect(button).toHaveAttribute('aria-describedby', 'description');
    });

    it('should handle expanded state for dropdowns', () => {
      render(
        <Button 
          aria-expanded={true}
          aria-haspopup="menu"
        >
          Menu Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('should announce loading state to screen readers', () => {
      render(<Button loading>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-live', 'polite');
      expect(screen.getByText('Loading, please wait')).toHaveClass('sr-only');
    });
  });

  // Keyboard navigation tests
  describe('Keyboard Navigation', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();
      render(<Button>Keyboard Test</Button>);
      
      const button = screen.getByRole('button');
      await user.tab();
      
      expect(button).toHaveFocus();
    });

    it('should activate with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Enter Test</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should activate with Space key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Space Test</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Loading state tests
  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should disable button when loading', () => {
      render(<Button loading>Loading</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should hide icons when loading', () => {
      render(
        <Button 
          loading 
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          Loading
        </Button>
      );
      
      expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
    });
  });

  // Icon support tests
  describe('Icon Support', () => {
    it('should render left icon', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>}>
          With Left Icon
        </Button>
      );
      
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          With Right Icon
        </Button>
      );
      
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should hide icons from screen readers', () => {
      render(
        <Button 
          leftIcon={<span data-testid="left-icon">←</span>}
          rightIcon={<span data-testid="right-icon">→</span>}
        >
          With Icons
        </Button>
      );
      
      const leftIconContainer = screen.getByTestId('left-icon').parentElement;
      const rightIconContainer = screen.getByTestId('right-icon').parentElement;
      
      expect(leftIconContainer).toHaveAttribute('aria-hidden', 'true');
      expect(rightIconContainer).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // Domain theming tests
  describe('Domain Theming', () => {
    it('should apply domain-specific colors', () => {
      render(<Button domain="full-stack">Full Stack Button</Button>);
      
      const button = screen.getByRole('button');
      const computedStyle = window.getComputedStyle(button);
      
      // Check if domain color is applied
      expect(button.style.backgroundColor).toBe(DOMAIN_COLORS['full-stack']);
    });

    it('should work with all domain types', () => {
      const domains = [
        'full-stack',
        'cloud-engineering', 
        'data-analytics',
        'ux-ui-design',
        'technical-consulting'
      ] as const;

      domains.forEach(domain => {
        const { unmount } = render(
          <Button domain={domain} data-testid={`button-${domain}`}>
            {domain} Button
          </Button>
        );
        
        const button = screen.getByTestId(`button-${domain}`);
        expect(button.style.backgroundColor).toBe(DOMAIN_COLORS[domain]);
        
        unmount();
      });
    });

    it('should not apply domain styling when variant is not default', () => {
      render(<Button domain="full-stack" variant="outline">Outline Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button.style.backgroundColor).toBe('');
    });
  });

  // Variant tests
  describe('Variants', () => {
    const variants = [
      'default',
      'destructive', 
      'outline',
      'secondary',
      'ghost',
      'link',
      'gradient',
      'success',
      'warning',
      'info'
    ] as const;

    variants.forEach(variant => {
      it(`should render ${variant} variant correctly`, () => {
        render(<Button variant={variant}>{variant} Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
      });
    });
  });

  // Size tests
  describe('Sizes', () => {
    const sizes = ['sm', 'default', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      it(`should render ${size} size correctly`, () => {
        render(<Button size={size}>{size} Button</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        
        // All sizes should maintain minimum touch target
        if (size === 'sm' || size === 'icon') {
          expect(button).toHaveClass('min-h-[44px]');
        }
      });
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    it('should call onClick handler', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Click Test</Button>);
      
      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onAccessibleClick handler', async () => {
      const user = userEvent.setup();
      const handleAccessibleClick = jest.fn();
      
      render(
        <Button onAccessibleClick={handleAccessibleClick}>
          Accessible Click Test
        </Button>
      );
      
      await user.click(screen.getByRole('button'));
      expect(handleAccessibleClick).toHaveBeenCalledTimes(1);
    });

    it('should announce click message to screen readers', async () => {
      const { announceUtils } = require('@/lib/utils/accessibility');
      const user = userEvent.setup();
      
      render(
        <Button clickAnnouncement="Action completed">
          Announcement Test
        </Button>
      );
      
      await user.click(screen.getByRole('button'));
      expect(announceUtils.announce).toHaveBeenCalledWith('Action completed', 'polite');
    });

    it('should not call handlers when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call handlers when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button loading onClick={handleClick}>Loading Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      
      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // Performance tests
  describe('Performance', () => {
    it('should render within performance budget', () => {
      const startTime = performance.now();
      
      render(<Button>Performance Test</Button>);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render in under 16ms (60fps budget)
      expect(renderTime).toBeLessThan(16);
    });

    it('should handle rapid re-renders efficiently', () => {
      const { rerender } = render(<Button>Initial</Button>);
      
      const startTime = performance.now();
      
      // Simulate rapid re-renders
      for (let i = 0; i < 100; i++) {
        rerender(<Button>Render {i}</Button>);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should handle 100 re-renders in under 100ms
      expect(totalTime).toBeLessThan(100);
    });
  });
});
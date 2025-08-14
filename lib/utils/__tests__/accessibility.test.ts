/**
 * Tests for accessibility utilities
 * 
 * Critical utilities for screen reader support, focus management,
 * and keyboard navigation throughout the application.
 */

import { announceUtils, focusUtils, keyboardUtils } from '../accessibility';

// Mock DOM methods
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockQuerySelectorAll = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockFocus = jest.fn();

// Setup DOM mocks
Object.defineProperty(document, 'body', {
  value: {
    appendChild: mockAppendChild,
    removeChild: mockRemoveChild,
  },
  writable: true,
});

Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    setAttribute: jest.fn(),
    textContent: '',
    className: '',
  })),
  writable: true,
});

describe('Accessibility Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('announceUtils', () => {
    describe('announce', () => {
      it('should create announcement element with polite priority', () => {
        const mockElement = {
          setAttribute: jest.fn(),
          textContent: '',
          className: '',
        };
        
        (document.createElement as jest.Mock).mockReturnValue(mockElement);
        
        announceUtils.announce('Test message');
        
        expect(document.createElement).toHaveBeenCalledWith('div');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
        expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true');
        expect(mockElement.className).toBe('sr-only');
        expect(mockElement.textContent).toBe('Test message');
        expect(mockAppendChild).toHaveBeenCalledWith(mockElement);
      });

      it('should create announcement element with assertive priority', () => {
        const mockElement = {
          setAttribute: jest.fn(),
          textContent: '',
          className: '',
        };
        
        (document.createElement as jest.Mock).mockReturnValue(mockElement);
        
        announceUtils.announce('Urgent message', 'assertive');
        
        expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
      });

      it('should remove announcement element after timeout', () => {
        const mockElement = {
          setAttribute: jest.fn(),
          textContent: '',
          className: '',
        };
        
        (document.createElement as jest.Mock).mockReturnValue(mockElement);
        
        announceUtils.announce('Test message');
        
        // Fast-forward time
        jest.advanceTimersByTime(1000);
        
        expect(mockRemoveChild).toHaveBeenCalledWith(mockElement);
      });

      it('should handle server-side rendering gracefully', () => {
        // Mock window as undefined (SSR)
        const originalWindow = global.window;
        delete (global as any).window;
        
        expect(() => {
          announceUtils.announce('Test message');
        }).not.toThrow();
        
        // Restore window
        global.window = originalWindow;
      });
    });
  });

  describe('focusUtils', () => {
    describe('trapFocus', () => {
      it('should set up focus trap on element', () => {
        const mockElement = {
          querySelectorAll: mockQuerySelectorAll,
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        };
        
        const mockFocusableElements = [
          { focus: mockFocus },
          { focus: mockFocus },
          { focus: mockFocus },
        ];
        
        mockQuerySelectorAll.mockReturnValue(mockFocusableElements);
        
        const cleanup = focusUtils.trapFocus(mockElement as any);
        
        expect(mockQuerySelectorAll).toHaveBeenCalledWith(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
        
        // Test cleanup
        cleanup();
        expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
      });

      it('should handle Tab key navigation forward', () => {
        const mockElement = {
          querySelectorAll: mockQuerySelectorAll,
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        };
        
        const mockFocusableElements = [
          { focus: jest.fn() },
          { focus: jest.fn() },
        ];
        
        mockQuerySelectorAll.mockReturnValue(mockFocusableElements);
        
        // Mock document.activeElement
        Object.defineProperty(document, 'activeElement', {
          value: mockFocusableElements[1],
          writable: true,
        });
        
        focusUtils.trapFocus(mockElement as any);
        
        // Get the event handler
        const eventHandler = mockAddEventListener.mock.calls[0][1];
        
        // Simulate Tab key on last element
        const mockEvent = {
          key: 'Tab',
          shiftKey: false,
          preventDefault: jest.fn(),
        };
        
        eventHandler(mockEvent);
        
        expect(mockFocusableElements[0].focus).toHaveBeenCalled();
        expect(mockEvent.preventDefault).toHaveBeenCalled();
      });

      it('should handle Shift+Tab key navigation backward', () => {
        const mockElement = {
          querySelectorAll: mockQuerySelectorAll,
          addEventListener: mockAddEventListener,
          removeEventListener: mockRemoveEventListener,
        };
        
        const mockFocusableElements = [
          { focus: jest.fn() },
          { focus: jest.fn() },
        ];
        
        mockQuerySelectorAll.mockReturnValue(mockFocusableElements);
        
        // Mock document.activeElement as first element
        Object.defineProperty(document, 'activeElement', {
          value: mockFocusableElements[0],
          writable: true,
        });
        
        focusUtils.trapFocus(mockElement as any);
        
        const eventHandler = mockAddEventListener.mock.calls[0][1];
        
        // Simulate Shift+Tab key on first element
        const mockEvent = {
          key: 'Tab',
          shiftKey: true,
          preventDefault: jest.fn(),
        };
        
        eventHandler(mockEvent);
        
        expect(mockFocusableElements[1].focus).toHaveBeenCalled();
        expect(mockEvent.preventDefault).toHaveBeenCalled();
      });
    });

    describe('restoreFocus', () => {
      it('should restore focus to previous element', () => {
        const mockElement = { focus: mockFocus };
        
        focusUtils.restoreFocus(mockElement as any);
        
        expect(mockFocus).toHaveBeenCalled();
      });

      it('should handle null previous element gracefully', () => {
        expect(() => {
          focusUtils.restoreFocus(null);
        }).not.toThrow();
      });

      it('should handle element without focus method gracefully', () => {
        const mockElement = {};
        
        expect(() => {
          focusUtils.restoreFocus(mockElement as any);
        }).not.toThrow();
      });
    });
  });

  describe('keyboardUtils', () => {
    describe('isNavigationKey', () => {
      it('should identify navigation keys correctly', () => {
        expect(keyboardUtils.isNavigationKey('ArrowUp')).toBe(true);
        expect(keyboardUtils.isNavigationKey('ArrowDown')).toBe(true);
        expect(keyboardUtils.isNavigationKey('ArrowLeft')).toBe(true);
        expect(keyboardUtils.isNavigationKey('ArrowRight')).toBe(true);
        expect(keyboardUtils.isNavigationKey('Home')).toBe(true);
        expect(keyboardUtils.isNavigationKey('End')).toBe(true);
      });

      it('should reject non-navigation keys', () => {
        expect(keyboardUtils.isNavigationKey('Enter')).toBe(false);
        expect(keyboardUtils.isNavigationKey('Space')).toBe(false);
        expect(keyboardUtils.isNavigationKey('Tab')).toBe(false);
        expect(keyboardUtils.isNavigationKey('a')).toBe(false);
      });
    });

    describe('handleArrowNavigation', () => {
      const mockItems = [
        { focus: jest.fn() },
        { focus: jest.fn() },
        { focus: jest.fn() },
      ];

      beforeEach(() => {
        mockItems.forEach(item => item.focus.mockClear());
      });

      it('should handle ArrowDown in vertical orientation', () => {
        const mockEvent = {
          key: 'ArrowDown',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          0,
          'vertical'
        );

        expect(newIndex).toBe(1);
        expect(mockItems[1].focus).toHaveBeenCalled();
        expect(mockEvent.preventDefault).toHaveBeenCalled();
      });

      it('should handle ArrowUp in vertical orientation', () => {
        const mockEvent = {
          key: 'ArrowUp',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          1,
          'vertical'
        );

        expect(newIndex).toBe(0);
        expect(mockItems[0].focus).toHaveBeenCalled();
      });

      it('should wrap around at boundaries', () => {
        const mockEvent = {
          key: 'ArrowDown',
          preventDefault: jest.fn(),
        };

        // Test wrapping from last to first
        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          2,
          'vertical'
        );

        expect(newIndex).toBe(0);
        expect(mockItems[0].focus).toHaveBeenCalled();
      });

      it('should handle Home key', () => {
        const mockEvent = {
          key: 'Home',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          2,
          'vertical'
        );

        expect(newIndex).toBe(0);
        expect(mockItems[0].focus).toHaveBeenCalled();
      });

      it('should handle End key', () => {
        const mockEvent = {
          key: 'End',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          0,
          'vertical'
        );

        expect(newIndex).toBe(2);
        expect(mockItems[2].focus).toHaveBeenCalled();
      });

      it('should handle horizontal orientation', () => {
        const mockEvent = {
          key: 'ArrowRight',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          0,
          'horizontal'
        );

        expect(newIndex).toBe(1);
        expect(mockItems[1].focus).toHaveBeenCalled();
      });

      it('should ignore non-navigation keys', () => {
        const mockEvent = {
          key: 'Enter',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          mockItems as any,
          1,
          'vertical'
        );

        expect(newIndex).toBe(1); // Should remain unchanged
        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      });

      it('should handle empty items array gracefully', () => {
        const mockEvent = {
          key: 'ArrowDown',
          preventDefault: jest.fn(),
        };

        const newIndex = keyboardUtils.handleArrowNavigation(
          mockEvent as any,
          [],
          0,
          'vertical'
        );

        expect(newIndex).toBe(0);
      });
    });
  });
});
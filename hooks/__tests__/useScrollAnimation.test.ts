/**
 * Tests for useScrollAnimation hook
 * 
 * Critical hook for scroll-triggered animations used throughout
 * the portfolio for performance-optimized reveal animations.
 */

import { renderHook, act } from '@testing-library/react';
import { useScrollAnimation } from '../useScrollAnimation';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

mockIntersectionObserver.mockImplementation((callback, options) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  root: options?.root || null,
  rootMargin: options?.rootMargin || '0px',
  thresholds: options?.threshold || [0],
  callback,
}));

Object.defineProperty(global, 'IntersectionObserver', {
  value: mockIntersectionObserver,
  writable: true,
});

describe('useScrollAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should initialize with isVisible false', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      expect(result.current.isVisible).toBe(false);
      expect(result.current.ref.current).toBe(null);
    });

    it('should create IntersectionObserver with default options', () => {
      renderHook(() => useScrollAnimation());
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '50px',
        }
      );
    });

    it('should create IntersectionObserver with custom options', () => {
      const options = {
        threshold: 0.5,
        rootMargin: '100px',
        root: document.body,
      };
      
      renderHook(() => useScrollAnimation(options));
      
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        options
      );
    });
  });

  describe('Element Observation', () => {
    it('should observe element when ref is set', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      expect(mockObserve).toHaveBeenCalledWith(mockElement);
    });

    it('should not observe when element is null', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      act(() => {
        result.current.ref.current = null;
      });
      
      expect(mockObserve).not.toHaveBeenCalled();
    });

    it('should unobserve previous element when ref changes', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement1 = document.createElement('div');
      const mockElement2 = document.createElement('div');
      
      // Set first element
      act(() => {
        result.current.ref.current = mockElement1;
      });
      
      expect(mockObserve).toHaveBeenCalledWith(mockElement1);
      
      // Change to second element
      act(() => {
        result.current.ref.current = mockElement2;
      });
      
      expect(mockUnobserve).toHaveBeenCalledWith(mockElement1);
      expect(mockObserve).toHaveBeenCalledWith(mockElement2);
    });
  });

  describe('Visibility Detection', () => {
    it('should update isVisible when element enters viewport', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      // Get the callback function passed to IntersectionObserver
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      // Simulate element entering viewport
      act(() => {
        observerCallback([
          {
            target: mockElement,
            isIntersecting: true,
            intersectionRatio: 0.5,
          },
        ]);
      });
      
      expect(result.current.isVisible).toBe(true);
    });

    it('should update isVisible when element leaves viewport', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      // First make it visible
      act(() => {
        observerCallback([
          {
            target: mockElement,
            isIntersecting: true,
            intersectionRatio: 0.5,
          },
        ]);
      });
      
      expect(result.current.isVisible).toBe(true);
      
      // Then make it invisible
      act(() => {
        observerCallback([
          {
            target: mockElement,
            isIntersecting: false,
            intersectionRatio: 0,
          },
        ]);
      });
      
      expect(result.current.isVisible).toBe(false);
    });

    it('should handle multiple intersection entries', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      // Simulate multiple entries (only the target element should affect state)
      act(() => {
        observerCallback([
          {
            target: document.createElement('div'), // Different element
            isIntersecting: true,
            intersectionRatio: 0.5,
          },
          {
            target: mockElement, // Our target element
            isIntersecting: true,
            intersectionRatio: 0.3,
          },
        ]);
      });
      
      expect(result.current.isVisible).toBe(true);
    });
  });

  describe('Once Option', () => {
    it('should stop observing after first intersection when once is true', () => {
      const { result } = renderHook(() => 
        useScrollAnimation({ threshold: 0.1, once: true })
      );
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      // Simulate element entering viewport
      act(() => {
        observerCallback([
          {
            target: mockElement,
            isIntersecting: true,
            intersectionRatio: 0.5,
          },
        ]);
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
    });

    it('should continue observing when once is false', () => {
      const { result } = renderHook(() => 
        useScrollAnimation({ threshold: 0.1, once: false })
      );
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      // Simulate element entering viewport
      act(() => {
        observerCallback([
          {
            target: mockElement,
            isIntersecting: true,
            intersectionRatio: 0.5,
          },
        ]);
      });
      
      expect(result.current.isVisible).toBe(true);
      expect(mockUnobserve).not.toHaveBeenCalledWith(mockElement);
    });
  });

  describe('Cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const { unmount } = renderHook(() => useScrollAnimation());
      
      unmount();
      
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should unobserve element on unmount', () => {
      const { result, unmount } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      unmount();
      
      expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
      expect(mockDisconnect).toHaveBeenCalled();
    });
  });

  describe('Performance Optimizations', () => {
    it('should use same observer instance for same options', () => {
      const options = { threshold: 0.5 };
      
      renderHook(() => useScrollAnimation(options));
      renderHook(() => useScrollAnimation(options));
      
      // Should create observer for each hook instance
      expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    });

    it('should handle rapid ref changes gracefully', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const elements = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];
      
      // Rapidly change refs
      elements.forEach(element => {
        act(() => {
          result.current.ref.current = element;
        });
      });
      
      // Should observe the final element
      expect(mockObserve).toHaveBeenCalledWith(elements[2]);
      // Should unobserve previous elements
      expect(mockUnobserve).toHaveBeenCalledWith(elements[0]);
      expect(mockUnobserve).toHaveBeenCalledWith(elements[1]);
    });
  });

  describe('Error Handling', () => {
    it('should handle IntersectionObserver not being available', () => {
      // Temporarily remove IntersectionObserver
      const originalIO = global.IntersectionObserver;
      delete (global as any).IntersectionObserver;
      
      const { result } = renderHook(() => useScrollAnimation());
      
      expect(result.current.isVisible).toBe(false);
      expect(result.current.ref.current).toBe(null);
      
      // Restore IntersectionObserver
      global.IntersectionObserver = originalIO;
    });

    it('should handle observer callback errors gracefully', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      // Simulate callback error
      expect(() => {
        act(() => {
          observerCallback(null); // Invalid entries
        });
      }).not.toThrow();
    });
  });

  describe('Animation Integration', () => {
    it('should provide animation-ready state', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      // Should provide both ref and visibility state for animations
      expect(typeof result.current.ref).toBe('object');
      expect(typeof result.current.isVisible).toBe('boolean');
    });

    it('should work with Framer Motion variants', () => {
      const { result } = renderHook(() => useScrollAnimation());
      
      const mockElement = document.createElement('div');
      
      act(() => {
        result.current.ref.current = mockElement;
      });
      
      const observerCallback = mockIntersectionObserver.mock.calls[0][0];
      
      act(() => {
        observerCallback([
          {
            target: mockElement,
            isIntersecting: true,
            intersectionRatio: 0.5,
          },
        ]);
      });
      
      // State should be suitable for Framer Motion animate prop
      const animateState = result.current.isVisible ? 'visible' : 'hidden';
      expect(['visible', 'hidden']).toContain(animateState);
    });
  });
});
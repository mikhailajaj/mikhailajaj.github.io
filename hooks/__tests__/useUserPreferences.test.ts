/**
 * Tests for useUserPreferences hook
 * 
 * Critical hook for managing user accessibility and theme preferences
 * with localStorage persistence.
 */

import { renderHook, act } from '@testing-library/react';
import { useUserPreferences } from '../useUserPreferences';

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

// Mock matchMedia for system preferences
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useUserPreferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Initialization', () => {
    it('should initialize with default preferences', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      expect(result.current.preferences).toEqual({
        theme: 'system',
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        language: 'en'
      });
    });

    it('should load preferences from localStorage', () => {
      const savedPreferences = {
        theme: 'dark',
        reducedMotion: true,
        highContrast: false,
        fontSize: 'large',
        language: 'en'
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedPreferences));
      
      const { result } = renderHook(() => useUserPreferences());
      
      expect(result.current.preferences).toEqual(savedPreferences);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('user-preferences');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      
      const { result } = renderHook(() => useUserPreferences());
      
      // Should fall back to defaults
      expect(result.current.preferences.theme).toBe('system');
    });
  });

  describe('Theme Preferences', () => {
    it('should update theme preference', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ theme: 'dark' });
      });
      
      expect(result.current.preferences.theme).toBe('dark');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'user-preferences',
        expect.stringContaining('"theme":"dark"')
      );
    });

    it('should detect system theme preference', () => {
      // Mock system dark mode
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useUserPreferences());
      
      expect(result.current.systemPreferences.theme).toBe('dark');
    });
  });

  describe('Accessibility Preferences', () => {
    it('should update reduced motion preference', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ reducedMotion: true });
      });
      
      expect(result.current.preferences.reducedMotion).toBe(true);
    });

    it('should update high contrast preference', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ highContrast: true });
      });
      
      expect(result.current.preferences.highContrast).toBe(true);
    });

    it('should update font size preference', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ fontSize: 'large' });
      });
      
      expect(result.current.preferences.fontSize).toBe('large');
    });

    it('should detect system reduced motion preference', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useUserPreferences());
      
      expect(result.current.systemPreferences.reducedMotion).toBe(true);
    });

    it('should detect system high contrast preference', () => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-contrast: high)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { result } = renderHook(() => useUserPreferences());
      
      expect(result.current.systemPreferences.highContrast).toBe(true);
    });
  });

  describe('Preference Updates', () => {
    it('should merge partial preference updates', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ theme: 'dark' });
      });
      
      act(() => {
        result.current.updatePreferences({ fontSize: 'large' });
      });
      
      expect(result.current.preferences).toEqual({
        theme: 'dark',
        reducedMotion: false,
        highContrast: false,
        fontSize: 'large',
        language: 'en'
      });
    });

    it('should persist preferences to localStorage', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ 
          theme: 'dark',
          reducedMotion: true 
        });
      });
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'user-preferences',
        expect.stringContaining('"theme":"dark"')
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'user-preferences',
        expect.stringContaining('"reducedMotion":true')
      );
    });

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const { result } = renderHook(() => useUserPreferences());
      
      expect(() => {
        act(() => {
          result.current.updatePreferences({ theme: 'dark' });
        });
      }).not.toThrow();
    });
  });

  describe('Reset Functionality', () => {
    it('should reset preferences to defaults', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      // Set some preferences
      act(() => {
        result.current.updatePreferences({ 
          theme: 'dark',
          reducedMotion: true,
          fontSize: 'large'
        });
      });
      
      // Reset
      act(() => {
        result.current.resetPreferences();
      });
      
      expect(result.current.preferences).toEqual({
        theme: 'system',
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
        language: 'en'
      });
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user-preferences');
    });
  });

  describe('Language Preferences', () => {
    it('should update language preference', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ language: 'es' });
      });
      
      expect(result.current.preferences.language).toBe('es');
    });

    it('should detect browser language', () => {
      Object.defineProperty(navigator, 'language', {
        value: 'fr-FR',
        writable: true,
      });
      
      const { result } = renderHook(() => useUserPreferences());
      
      expect(result.current.systemPreferences.language).toBe('fr');
    });
  });

  describe('Preference Validation', () => {
    it('should validate theme values', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ theme: 'invalid' as any });
      });
      
      // Should not update with invalid value
      expect(result.current.preferences.theme).toBe('system');
    });

    it('should validate fontSize values', () => {
      const { result } = renderHook(() => useUserPreferences());
      
      act(() => {
        result.current.updatePreferences({ fontSize: 'invalid' as any });
      });
      
      // Should not update with invalid value
      expect(result.current.preferences.fontSize).toBe('medium');
    });
  });

  describe('System Preference Changes', () => {
    it('should respond to system theme changes', () => {
      const mockAddEventListener = jest.fn();
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      renderHook(() => useUserPreferences());
      
      expect(mockAddEventListener).toHaveBeenCalled();
    });
  });
});
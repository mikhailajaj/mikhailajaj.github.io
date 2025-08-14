/**
 * Tests for cn utility function
 * 
 * The cn function is a critical utility used throughout the application
 * for merging Tailwind CSS classes with proper conflict resolution.
 */

import { cn } from '../cn';

describe('cn utility function', () => {
  it('should merge classes without conflicts', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle conflicting classes correctly', () => {
    const result = cn('text-red-500', 'text-blue-500');
    // Should resolve to the last class (blue)
    expect(result).toContain('text-blue-500');
    expect(result).not.toContain('text-red-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).not.toContain('active-class');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['text-red-500', 'bg-blue-500']);
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'border-gray-300': true
    });
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('bg-blue-500');
    expect(result).toContain('border-gray-300');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn(null)).toBe('');
    expect(cn(undefined)).toBe('');
  });

  it('should handle mixed input types', () => {
    const result = cn(
      'base-class',
      ['array-class'],
      { 'object-class': true },
      'string-class'
    );
    expect(result).toContain('base-class');
    expect(result).toContain('array-class');
    expect(result).toContain('object-class');
    expect(result).toContain('string-class');
  });

  it('should resolve responsive class conflicts', () => {
    const result = cn('text-sm', 'md:text-lg', 'text-base');
    expect(result).toContain('md:text-lg');
    expect(result).toContain('text-base');
    expect(result).not.toContain('text-sm');
  });

  it('should handle padding conflicts correctly', () => {
    const result = cn('p-4', 'px-6');
    // px-6 should override the horizontal padding from p-4
    expect(result).toContain('px-6');
    // Should still contain vertical padding aspects
    expect(result).toMatch(/p[y]?-/);
  });
});
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging CSS class names with Tailwind CSS support
 *
 * Combines clsx for conditional class names with tailwind-merge for
 * intelligent Tailwind CSS class deduplication and conflict resolution.
 *
 * @function cn
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // Result: 'px-4 py-2 bg-blue-500'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', {
 *   'conditional-class': someCondition,
 *   'another-class': anotherCondition
 * })
 *
 * // Tailwind conflict resolution
 * cn('px-4 px-6', 'py-2 py-4')
 * // Result: 'px-6 py-4' (later classes override earlier ones)
 *
 * // Component usage
 * <div className={cn(
 *   'base-styles',
 *   variant === 'primary' && 'primary-styles',
 *   className
 * )} />
 * ```
 *
 * Features:
 * - Merges multiple class name inputs
 * - Handles conditional classes via clsx
 * - Resolves Tailwind CSS conflicts intelligently
 * - Removes duplicate classes
 * - Type-safe with ClassValue types
 *
 * @param {...ClassValue[]} inputs - Class name inputs (strings, objects, arrays, etc.)
 * @returns {string} Merged and deduplicated class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

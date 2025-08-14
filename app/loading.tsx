/**
 * Global Loading UI
 * 
 * Next.js App Router loading component that provides
 * a professional loading experience with domain theming.
 * 
 * @fileoverview Global loading component with animations
 */

"use client";

// 1. React Imports
import React from 'react';

// 2. External Libraries
import { motion } from 'framer-motion';

// 3. Internal Absolute Imports (@/) - Portfolio Structure
import { useDomainTheme } from '@/lib/contexts/DomainThemeContext';

// 4. Internal Relative Imports
// (None in this component)

// 5. Type Imports
// (None in this component)

// 6. Stylesheets
// (None in this component)

/**
 * Loading Spinner Component
 */
const LoadingSpinner: React.FC<{ color: string; size?: number }> = ({ 
  color, 
  size = 40 
}) => (
  <motion.div
    className="relative"
    style={{ width: size, height: size }}
  >
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-transparent"
      style={{ 
        borderTopColor: color,
        borderRightColor: `${color}40`,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </motion.div>
);

/**
 * Loading Dots Component
 */
const LoadingDots: React.FC<{ color: string }> = ({ color }) => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
    ))}
  </div>
);

/**
 * Global Loading Component
 * 
 * Provides a professional loading experience with domain-aware theming
 * and smooth animations. Used by Next.js App Router for route transitions.
 * 
 * @component
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router
 * // Place in app/loading.tsx for global loading UI
 * ```
 * 
 * Features:
 * - Domain-aware color theming
 * - Smooth animations with Framer Motion
 * - Multiple loading indicators
 * - Accessibility compliant
 * - Performance optimized
 * - Responsive design
 * 
 * @returns JSX.Element - Loading UI
 */
export default function Loading() {
  const { currentDomainColor, currentDomainConfig } = useDomainTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        {/* Main Loading Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Portfolio Logo/Icon */}
          <div 
            className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-6"
            style={{ backgroundColor: `${currentDomainColor}20` }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-2xl font-bold"
              style={{ color: currentDomainColor }}
            >
              MA
            </motion.div>
          </div>

          {/* Loading Spinner */}
          <div className="mb-6">
            <LoadingSpinner color={currentDomainColor} size={48} />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading
            {currentDomainConfig && (
              <span style={{ color: currentDomainColor }}>
                {' '}{currentDomainConfig.shortName}
              </span>
            )}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {currentDomainConfig 
              ? `Preparing ${currentDomainConfig.name.toLowerCase()} content...`
              : 'Preparing your experience...'
            }
          </p>

          {/* Loading Dots */}
          <div className="flex justify-center pt-4">
            <LoadingDots color={currentDomainColor} />
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="mt-8 mx-auto max-w-xs"
        >
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: currentDomainColor }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>

        {/* Loading Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Optimizing for the best experience...</p>
        </motion.div>
      </div>
    </div>
  );
}
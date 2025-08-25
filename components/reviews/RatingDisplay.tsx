/**
 * RatingDisplay Component
 * 
 * A reusable star rating visualization component with accessibility support
 * and animation effects. Supports half-star ratings and read-only mode.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { MotionDiv } from '@/lib/motion-utils';
import { motion } from 'framer-motion';

export interface RatingDisplayProps {
  /** Rating value (0-5, supports decimals for half stars) */
  rating: number;
  /** Maximum rating value (default: 5) */
  maxRating?: number;
  /** Size variant for the stars */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the numeric rating alongside stars */
  showNumeric?: boolean;
  /** Whether to animate the stars on mount */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom aria-label for accessibility */
  ariaLabel?: string;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base'
};

/**
 * Star Icon Component
 * Renders a single star with fill percentage for half-star support
 */
interface StarProps {
  filled: number; // 0-1 (0 = empty, 0.5 = half, 1 = full)
  size: 'sm' | 'md' | 'lg';
  index: number;
  animated: boolean;
}

const Star: React.FC<StarProps> = ({ filled, size, index, animated }) => {
  const fillPercentage = Math.max(0, Math.min(1, filled)) * 100;
  
  const starContent = (
    <div className={cn('relative', sizeClasses[size])}>
      {/* Background star (empty) */}
      <svg
        className="absolute inset-0 text-gray-300 dark:text-gray-600"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      
      {/* Filled star (gradient overlay) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fillPercentage}%` }}
      >
        <svg
          className="text-yellow-400 dark:text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  );

  if (animated) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.3, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 300
        }}
        className="inline-block"
      >
        {starContent}
      </motion.span>
    );
  }

  return <span className="inline-block">{starContent}</span>;
};

/**
 * RatingDisplay Component
 * 
 * Displays a star rating with accessibility support and optional animations
 */
export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showNumeric = false,
  animated = false,
  className,
  ariaLabel
}) => {
  // Clamp rating to valid range
  const clampedRating = Math.max(0, Math.min(maxRating, rating));
  
  // Generate stars array
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    let filled = 0;
    
    if (clampedRating >= starValue) {
      filled = 1; // Full star
    } else if (clampedRating > starValue - 1) {
      filled = clampedRating - (starValue - 1); // Partial star
    }
    
    return filled;
  });

  const defaultAriaLabel = `Rating: ${clampedRating} out of ${maxRating} stars`;

  return (
    <MotionDiv
      className={cn(
        'flex items-center gap-1',
        className
      )}
      role="img"
      aria-label={ariaLabel || defaultAriaLabel}
      initial={animated ? { opacity: 0 } : undefined}
      animate={animated ? { opacity: 1 } : undefined}
      transition={animated ? { duration: 0.2 } : undefined}
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {stars.map((filled, index) => (
          <Star
            key={index}
            filled={filled}
            size={size}
            index={index}
            animated={animated}
          />
        ))}
      </div>
      
      {/* Numeric rating */}
      {showNumeric && (
        <span 
          className={cn(
            'ml-2 font-medium text-gray-700 dark:text-gray-300',
            textSizeClasses[size]
          )}
          aria-hidden="true"
        >
          {clampedRating.toFixed(1)}
        </span>
      )}
    </MotionDiv>
  );
};

export default RatingDisplay;
/**
 * Optimized Motion System
 * 
 * High-performance animation system with intelligent performance optimizations,
 * reduced motion support, and efficient animation presets.
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion, AnimatePresence, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

// Performance-optimized animation presets
export const OptimizedAnimationPresets = {
  // Ultra-fast micro-interactions (< 200ms)
  micro: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.15, ease: "easeOut" },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.15, ease: "easeOut" },
    },
  },

  // Standard interactions (200-400ms)
  standard: {
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    slideLeft: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    slideRight: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  },

  // Complex animations (400-600ms)
  complex: {
    bounceIn: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        duration: 0.5, 
        ease: [0.68, -0.55, 0.265, 1.55] 
      },
    },
    elasticIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        type: "spring", 
        damping: 15, 
        stiffness: 300 
      },
    },
  },

  // Stagger animations for lists
  stagger: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    },
  },

  // Hover and interaction states
  interactive: {
    hover: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.15 },
    },
    press: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.15 },
    },
    float: {
      animate: {
        y: [-2, 2, -2],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  },
};

// Motion configuration context
interface MotionConfig {
  enableAnimations: boolean;
  performanceMode: 'high' | 'balanced' | 'low';
  respectReducedMotion: boolean;
}

const MotionConfigContext = createContext<MotionConfig>({
  enableAnimations: true,
  performanceMode: 'balanced',
  respectReducedMotion: true,
});

// Optimized motion provider
export const OptimizedMotionProvider: React.FC<{ 
  children: React.ReactNode;
  config?: Partial<MotionConfig>;
}> = ({ children, config = {} }) => {
  const shouldReduceMotion = useReducedMotion();
  
  const motionConfig: MotionConfig = useMemo(() => ({
    enableAnimations: !shouldReduceMotion,
    performanceMode: 'balanced',
    respectReducedMotion: true,
    ...config,
  }), [shouldReduceMotion, config]);

  return (
    <MotionConfigContext.Provider value={motionConfig}>
      {children}
    </MotionConfigContext.Provider>
  );
};

// Hook to use motion configuration
export const useMotionConfig = () => useContext(MotionConfigContext);

// Optimized motion components
export const OptimizedMotion = {
  // Fast div component
  Div: React.forwardRef<HTMLDivElement, MotionProps & { className?: string }>(
    ({ className, ...props }, ref) => {
      const { enableAnimations } = useMotionConfig();
      
      if (!enableAnimations) {
        return <div ref={ref} className={className} {...(props as any)} />;
      }
      
      return <motion.div ref={ref} className={className} {...props} />;
    }
  ),

  // Fast button component
  Button: React.forwardRef<HTMLButtonElement, MotionProps & { className?: string }>(
    ({ className, ...props }, ref) => {
      const { enableAnimations } = useMotionConfig();
      
      if (!enableAnimations) {
        return <button ref={ref} className={className} {...(props as any)} />;
      }
      
      return <motion.button ref={ref} className={className} {...props} />;
    }
  ),

  // Fast section component
  Section: React.forwardRef<HTMLElement, MotionProps & { className?: string }>(
    ({ className, ...props }, ref) => {
      const { enableAnimations } = useMotionConfig();
      
      if (!enableAnimations) {
        return <section ref={ref} className={className} {...(props as any)} />;
      }
      
      return <motion.section ref={ref} className={className} {...props} />;
    }
  ),
};

// Performance-optimized animation hook
export const useOptimizedAnimation = (preset: string, category: string = 'standard') => {
  const { enableAnimations, performanceMode } = useMotionConfig();
  
  return useMemo(() => {
    if (!enableAnimations) {
      return {};
    }
    
    const presetCategory = OptimizedAnimationPresets[category as keyof typeof OptimizedAnimationPresets];
    const animation = presetCategory?.[preset as keyof typeof presetCategory];
    
    if (!animation) {
      return {};
    }
    
    // Adjust animation based on performance mode
    if (performanceMode === 'low') {
      return {
        ...animation,
        transition: { ...animation.transition, duration: (animation.transition?.duration || 0.3) * 0.5 },
      };
    }
    
    return animation;
  }, [preset, category, enableAnimations, performanceMode]);
};

// Export optimized system
export default {
  Provider: OptimizedMotionProvider,
  Motion: OptimizedMotion,
  Presets: OptimizedAnimationPresets,
  useAnimation: useOptimizedAnimation,
  useConfig: useMotionConfig,
};

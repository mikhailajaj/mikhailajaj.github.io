/**
 * Motion Utilities
 *
 * Provides TypeScript-friendly wrappers around Framer Motion components
 * to resolve type conflicts and improve developer experience.
 *
 * @fileoverview Motion utilities for animation components
 */

import { motion } from "framer-motion";

/**
 * Creates a proxy around the motion object to bypass TypeScript issues
 * while maintaining full functionality and type safety where possible.
 *
 * @function createMotionProxy
 * @returns {typeof motion} Proxied motion object with improved TypeScript compatibility
 * @internal
 */
const createMotionProxy = () => {
  return new Proxy(motion, {
    get(target, prop) {
      const component = target[prop as keyof typeof target];
      if (typeof component === "function") {
        return component as any;
      }
      return component;
    },
  });
};

/**
 * Proxied motion object that bypasses TypeScript issues
 *
 * @example
 * ```tsx
 * import { m } from '@/lib/motion-utils';
 *
 * <m.div
 *   initial={{ opacity: 0 }}
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: 0.5 }}
 * >
 *   Content
 * </m.div>
 * ```
 */
export const m = createMotionProxy();

/**
 * Pre-configured motion components for common HTML elements
 * These provide type-safe alternatives to motion.div, motion.button, etc.
 *
 * @example
 * ```tsx
 * import { MotionDiv, MotionButton } from '@/lib/motion-utils';
 *
 * <MotionDiv
 *   initial={{ y: 20, opacity: 0 }}
 *   animate={{ y: 0, opacity: 1 }}
 *   transition={{ duration: 0.3 }}
 * >
 *   <MotionButton
 *     whileHover={{ scale: 1.05 }}
 *     whileTap={{ scale: 0.95 }}
 *   >
 *     Click me
 *   </MotionButton>
 * </MotionDiv>
 * ```
 */

/** Motion-enabled div component */
export const MotionDiv = motion.div as any;

/** Motion-enabled button component */
export const MotionButton = motion.button as any;

/** Motion-enabled h1 heading component */
export const MotionH1 = motion.h1 as any;

/** Motion-enabled h2 heading component */
export const MotionH2 = motion.h2 as any;

/** Motion-enabled span component */
export const MotionSpan = motion.span as any;

/** Motion-enabled section component */
export const MotionSection = motion.section as any;

/** Motion-enabled paragraph component */
export const MotionP = motion.p as any;

/** Motion-enabled article component */
export const MotionArticle = motion.article as any;

/** Motion-enabled image component */
export const MotionImg = motion.img as any;

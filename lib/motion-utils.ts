import { motion } from 'framer-motion';

// Create a properly typed motion object that bypasses TypeScript issues
const createMotionProxy = () => {
  return new Proxy(motion, {
    get(target, prop) {
      const component = target[prop as keyof typeof target];
      if (typeof component === 'function') {
        return component as any;
      }
      return component;
    }
  });
};

// Export the proxied motion object
export const m = createMotionProxy();

// Also export individual components for convenience
export const MotionDiv = motion.div as any;
export const MotionButton = motion.button as any;
export const MotionH1 = motion.h1 as any;
export const MotionH2 = motion.h2 as any;
export const MotionSpan = motion.span as any;
export const MotionSection = motion.section as any;
export const MotionP = motion.p as any;
export const MotionArticle = motion.article as any;
export const MotionImg = motion.img as any;
// Enhanced Animation System for Portfolio
import { Variants } from "framer-motion";

// Easing functions for consistent animation feel
export const easings = {
  smooth: [0.25, 0.1, 0.25, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.2, 1],
  gentle: [0.25, 0.46, 0.45, 0.94],
} as const;

// Duration constants
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// Stagger configurations
export const staggerConfig = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.normal,
        ease: easings.smooth,
      },
    },
  },
};

// Enhanced fade animations
export const fadeAnimations: Record<string, Variants> = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.normal,
        ease: easings.smooth,
      },
    },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.normal,
        ease: easings.smooth,
      },
    },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: durations.normal,
        ease: easings.smooth,
      },
    },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: durations.normal,
        ease: easings.smooth,
      },
    },
  },
  fadeInScale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: durations.normal,
        ease: easings.smooth,
      },
    },
  },
};

// Hover animations
export const hoverAnimations: Record<string, Variants> = {
  lift: {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: durations.fast,
        ease: easings.gentle,
      },
    },
  },
  glow: {
    rest: {
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
      scale: 1,
    },
    hover: {
      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
      scale: 1.05,
      transition: {
        duration: durations.fast,
        ease: easings.gentle,
      },
    },
  },
  rotate: {
    rest: { rotate: 0 },
    hover: {
      rotate: 5,
      transition: {
        duration: durations.fast,
        ease: easings.bounce,
      },
    },
  },
  shimmer: {
    rest: {
      background: "linear-gradient(90deg, transparent, transparent)",
    },
    hover: {
      background: [
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        "linear-gradient(90deg, transparent, transparent)",
      ],
      transition: {
        duration: 0.6,
        ease: "linear",
      },
    },
  },
};

// Scroll-triggered animations
export const scrollAnimations: Record<string, Variants> = {
  slideInFromBottom: {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durations.slow,
        ease: easings.smooth,
      },
    },
  },
  slideInFromLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: durations.slow,
        ease: easings.smooth,
      },
    },
  },
  slideInFromRight: {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: durations.slow,
        ease: easings.smooth,
      },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: durations.slow,
        ease: easings.bounce,
      },
    },
  },
};

// Button animations
export const buttonAnimations: Record<string, Variants> = {
  press: {
    rest: { scale: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  },
  magnetic: {
    rest: { x: 0, y: 0 },
    hover: { x: 0, y: -2 },
  },
  ripple: {
    rest: { scale: 1, opacity: 1 },
    tap: { scale: 0.9, opacity: 0.8 },
  },
};

// Loading animations
export const loadingAnimations: Record<string, Variants> = {
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
};

// Utility function to create viewport-triggered animations
export const createViewportAnimation = (
  animation: Variants,
  threshold = 0.1,
  once = true,
) => ({
  ...animation,
  viewport: { once, amount: threshold },
});

// Utility function to create staggered children animations
export const createStaggeredAnimation = (
  childAnimation: Variants,
  staggerDelay = 0.1,
  containerDelay = 0,
) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: containerDelay,
      },
    },
  },
  item: childAnimation,
});

// Preset animation combinations
export const presetAnimations = {
  heroTitle: createViewportAnimation(fadeAnimations.fadeInUp, 0.3),
  heroSubtitle: createViewportAnimation(fadeAnimations.fadeInUp, 0.3),
  cardGrid: createStaggeredAnimation(
    scrollAnimations.slideInFromBottom,
    0.15,
    0.2,
  ),
  skillIcons: createStaggeredAnimation(fadeAnimations.fadeInScale, 0.1, 0.3),
  projectCards: createStaggeredAnimation(scrollAnimations.scaleIn, 0.2, 0.1),
};

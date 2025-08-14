/**
 * Type-Safe Motion Components
 *
 * Wrapper components for Framer Motion with proper TypeScript interfaces
 * to resolve build issues while maintaining animation functionality.
 */

"use client";

import React from "react";
import { motion, MotionProps, HTMLMotionProps } from "framer-motion";

// ✅ Base motion component props
interface BaseMotionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// ✅ Motion div with proper typing
export interface MotionDivProps
  extends BaseMotionProps,
    Omit<HTMLMotionProps<"div">, "children"> {}

export const MotionDiv: React.FC<MotionDivProps> = ({
  children,
  className,
  style,
  ...motionProps
}) => {
  return (
    <motion.div className={className} style={style} {...motionProps}>
      {children}
    </motion.div>
  );
};

// ✅ Motion form with proper typing
export interface MotionFormProps
  extends BaseMotionProps,
    Omit<HTMLMotionProps<"form">, "children"> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const MotionForm: React.FC<MotionFormProps> = ({
  children,
  className,
  style,
  onSubmit,
  ...motionProps
}) => {
  return (
    <motion.form
      className={className}
      style={style}
      onSubmit={onSubmit}
      {...motionProps}
    >
      {children}
    </motion.form>
  );
};

// ✅ Motion button with proper typing
export interface MotionButtonProps
  extends BaseMotionProps,
    Omit<HTMLMotionProps<"button">, "children"> {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const MotionButton: React.FC<MotionButtonProps> = ({
  children,
  className,
  style,
  onClick,
  type = "button",
  disabled,
  ...motionProps
}) => {
  return (
    <motion.button
      className={className}
      style={style}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

// ✅ Motion section with proper typing
export interface MotionSectionProps
  extends BaseMotionProps,
    Omit<HTMLMotionProps<"section">, "children"> {}

export const MotionSection: React.FC<MotionSectionProps> = ({
  children,
  className,
  style,
  ...motionProps
}) => {
  return (
    <motion.section className={className} style={style} {...motionProps}>
      {children}
    </motion.section>
  );
};

// ✅ Common animation presets
export const AnimationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },

  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },

  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 },
  },

  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },

  stagger: (index: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: index * 0.1 },
  }),

  hover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
};

// ✅ Fallback components for when motion is disabled
export const FallbackDiv: React.FC<BaseMotionProps> = ({
  children,
  className,
  style,
}) => (
  <div className={className} style={style}>
    {children}
  </div>
);

export const FallbackForm: React.FC<
  BaseMotionProps & { onSubmit?: (e: React.FormEvent) => void }
> = ({ children, className, style, onSubmit }) => (
  <form className={className} style={style} onSubmit={onSubmit}>
    {children}
  </form>
);

export const FallbackButton: React.FC<
  BaseMotionProps & {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }
> = ({ children, className, style, onClick, type = "button", disabled }) => (
  <button
    className={className}
    style={style}
    onClick={onClick}
    type={type}
    disabled={disabled}
  >
    {children}
  </button>
);

// ✅ Motion component with error boundary
export const SafeMotionDiv: React.FC<MotionDivProps> = (props) => {
  try {
    return <MotionDiv {...props} />;
  } catch (error) {
    console.warn("Motion component failed, using fallback:", error);
    return <FallbackDiv {...props} />;
  }
};

export const SafeMotionForm: React.FC<MotionFormProps> = (props) => {
  try {
    return <MotionForm {...props} />;
  } catch (error) {
    console.warn("Motion form failed, using fallback:", error);
    return <FallbackForm {...props} />;
  }
};

export const SafeMotionButton: React.FC<MotionButtonProps> = (props) => {
  try {
    return <MotionButton {...props} />;
  } catch (error) {
    console.warn("Motion button failed, using fallback:", error);
    return <FallbackButton {...props} />;
  }
};

// ✅ Hook for conditional motion
export const useMotion = (enableMotion: boolean = true) => {
  return React.useMemo(
    () => ({
      Div: enableMotion ? MotionDiv : FallbackDiv,
      Form: enableMotion ? MotionForm : FallbackForm,
      Button: enableMotion ? MotionButton : FallbackButton,
      Section: enableMotion ? MotionSection : FallbackDiv,
    }),
    [enableMotion],
  );
};

// ✅ Default exports
const MotionComponents = {
  MotionDiv,
  MotionForm,
  MotionButton,
  MotionSection,
  SafeMotionDiv,
  SafeMotionForm,
  SafeMotionButton,
  AnimationPresets,
  useMotion,
};

export default MotionComponents;

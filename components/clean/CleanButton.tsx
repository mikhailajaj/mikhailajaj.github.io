/**
 * Clean Button Component - Following Clean Code Principles
 * Implements focused, reusable button with clear responsibilities
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useComponentLogger } from "@/lib/logging/LoggingIntegration";
import {
  BaseComponentProps,
  InteractiveComponentProps,
} from "@/lib/components/CleanComponentPatterns";

// Using imported interfaces from CleanComponentPatterns

// ✅ Principle 1: Name Things Like They Matter
interface CleanButtonProps extends InteractiveComponentProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  type?: "button" | "submit" | "reset";
  onHover?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  testId?: string;
}

// ✅ Principle 3: Don't Repeat Decisions — Let the Code Decide
const BUTTON_VARIANTS = {
  primary: {
    base: "bg-blue-600 text-white border-blue-600",
    hover: "hover:bg-blue-700 hover:border-blue-700",
    active: "active:bg-blue-800",
    disabled: "disabled:bg-blue-300 disabled:border-blue-300",
  },
  secondary: {
    base: "bg-card text-white border-border",
    hover: "hover:bg-card hover:border-border",
    active: "active:bg-card",
    disabled: "disabled:bg-muted disabled:border-border",
  },
  outline: {
    base: "bg-transparent text-blue-600 border-blue-600",
    hover: "hover:bg-blue-50 hover:text-blue-700",
    active: "active:bg-blue-100",
    disabled: "disabled:text-blue-300 disabled:border-blue-300",
  },
  ghost: {
    base: "bg-transparent text-foreground border-transparent",
    hover: "hover:bg-muted/30 hover:text-foreground",
    active: "active:bg-muted/50",
    disabled: "disabled:text-muted-foreground",
  },
  danger: {
    base: "bg-red-600 text-white border-red-600",
    hover: "hover:bg-red-700 hover:border-red-700",
    active: "active:bg-red-800",
    disabled: "disabled:bg-red-300 disabled:border-red-300",
  },
} as const;

const BUTTON_SIZES = {
  small: {
    padding: "px-3 py-1.5",
    text: "text-sm",
    height: "h-8",
    iconSize: "w-4 h-4",
  },
  medium: {
    padding: "px-4 py-2",
    text: "text-base",
    height: "h-10",
    iconSize: "w-5 h-5",
  },
  large: {
    padding: "px-6 py-3",
    text: "text-lg",
    height: "h-12",
    iconSize: "w-6 h-6",
  },
} as const;

const BUTTON_ANIMATIONS = {
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
  loading: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" },
  },
} as const;

/**
 * ✅ Clean Button Component - Focused responsibility
 */
const CleanButton: React.FC<CleanButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  type = "button",
  className = "",
  onClick,
  onHover,
  onFocus,
  testId,
  "aria-label": ariaLabel,
  ...props
}) => {
  const { logUserInteraction, logDebug } = useComponentLogger("CleanButton");

  // ✅ Principle 2: Keep Functions Focused
  const handleButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }

      logUserInteraction("click", "button");

      onClick?.();
    },
    [
      disabled,
      loading,
      onClick,
      variant,
      size,
      leftIcon,
      rightIcon,
      children,
      logUserInteraction,
    ],
  );

  const handleButtonHover = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      logDebug("Button hovered", { variant, size });
      onHover?.(event);
    },
    [disabled, onHover, variant, size, logDebug],
  );

  const handleButtonFocus = React.useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      logDebug("Button focused", { variant, size });
      onFocus?.(event);
    },
    [onFocus, variant, size, logDebug],
  );

  // ✅ Data-driven styling
  const buttonClasses = React.useMemo(() => {
    const variantConfig = BUTTON_VARIANTS[variant];
    const sizeConfig = BUTTON_SIZES[size];

    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    const variantClasses = `${variantConfig.base} ${variantConfig.hover} ${variantConfig.active} ${variantConfig.disabled}`;
    const sizeClasses = `${sizeConfig.padding} ${sizeConfig.text} ${sizeConfig.height}`;
    const widthClasses = fullWidth ? "w-full" : "";
    const disabledClasses =
      disabled || loading ? "cursor-not-allowed" : "cursor-pointer";

    return `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${disabledClasses} ${className}`.trim();
  }, [variant, size, fullWidth, disabled, loading, className]);

  // ✅ Loading spinner component
  const LoadingSpinner = React.useMemo(
    () => (
      <div
        className={`${BUTTON_SIZES[size].iconSize} border-2 border-current border-t-transparent rounded-full animate-spin`}
        style={{ display: "inline-block" }}
      />
    ),
    [size],
  );

  // ✅ Icon rendering with proper sizing
  const renderIcon = React.useCallback(
    (icon: React.ReactNode, position: "left" | "right") => {
      if (!icon) return null;

      const iconClasses = `${BUTTON_SIZES[size].iconSize} ${
        position === "left" ? "mr-2" : "ml-2"
      }`;

      return <span className={iconClasses}>{icon}</span>;
    },
    [size],
  );

  // ✅ Button content with loading state
  const buttonContent = React.useMemo(() => {
    if (loading) {
      return (
        <>
          {LoadingSpinner}
          <span className="ml-2">{loadingText}</span>
        </>
      );
    }

    return (
      <>
        {renderIcon(leftIcon, "left")}
        <span>{children}</span>
        {renderIcon(rightIcon, "right")}
      </>
    );
  }, [
    loading,
    LoadingSpinner,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    renderIcon,
  ]);

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleButtonClick}
      onMouseEnter={handleButtonHover}
      onFocus={handleButtonFocus}
      aria-label={
        ariaLabel || (typeof children === "string" ? children : undefined)
      }
      aria-disabled={disabled || loading}
      data-testid={testId}
    >
      {buttonContent}
    </button>
  );
};

// Export the clean button component
export default CleanButton;

// ✅ Specialized button variants for common use cases
export const PrimaryButton: React.FC<Omit<CleanButtonProps, "variant">> = (
  props,
) => <CleanButton variant="primary" {...props} />;

export const SecondaryButton: React.FC<Omit<CleanButtonProps, "variant">> = (
  props,
) => <CleanButton variant="secondary" {...props} />;

export const OutlineButton: React.FC<Omit<CleanButtonProps, "variant">> = (
  props,
) => <CleanButton variant="outline" {...props} />;

export const GhostButton: React.FC<Omit<CleanButtonProps, "variant">> = (
  props,
) => <CleanButton variant="ghost" {...props} />;

export const DangerButton: React.FC<Omit<CleanButtonProps, "variant">> = (
  props,
) => <CleanButton variant="danger" {...props} />;

// ✅ Button group component for related actions
export const CleanButtonGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}> = ({ children, className = "", orientation = "horizontal" }) => {
  const { logDebug } = useComponentLogger("CleanButtonGroup");

  React.useEffect(() => {
    logDebug("Button group rendered", {
      orientation,
      childCount: React.Children.count(children),
    });
  }, [orientation, children, logDebug]);

  const orientationClasses =
    orientation === "horizontal" ? "flex-row space-x-2" : "flex-col space-y-2";

  return (
    <div className={`inline-flex ${orientationClasses} ${className}`}>
      {children}
    </div>
  );
};

// ✅ Export with meaningful naming
export { CleanButton };

// ✅ Usage examples for documentation
export const CleanButtonExamples: React.FC = () => {
  const { logUserInteraction } = useComponentLogger("CleanButtonExamples");

  return (
    <div className="space-y-4">
      <CleanButtonGroup>
        <PrimaryButton
          onClick={() => logUserInteraction("click", "save-button")}
        >
          Save Changes
        </PrimaryButton>
        <SecondaryButton
          onClick={() => logUserInteraction("click", "cancel-button")}
        >
          Cancel
        </SecondaryButton>
      </CleanButtonGroup>

      <CleanButton
        variant="outline"
        size="large"
        leftIcon={<span>📁</span>}
        loading={false}
        onClick={() => logUserInteraction("click", "upload-button")}
      >
        Upload File
      </CleanButton>

      <DangerButton
        size="small"
        rightIcon={<span>🗑️</span>}
        onClick={() => logUserInteraction("click", "delete-button")}
      >
        Delete
      </DangerButton>
    </div>
  );
};

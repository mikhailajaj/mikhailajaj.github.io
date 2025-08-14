/**
 * MobileOptimizedLayout Component
 * 
 * Layout wrapper that provides mobile-specific optimizations including
 * thumb-zone navigation, progressive disclosure, and performance enhancements.
 */

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { SwipeNavigationWrapper } from "./SwipeGestureHandler";
import { useMobileBottomNavPadding } from "../navigation/MobileBottomNav";

interface MobileOptimizedLayoutProps {
  children: React.ReactNode;
  enableSwipeNavigation?: boolean;
  previousPage?: string;
  nextPage?: string;
  className?: string;
  showMobileOptimizations?: boolean;
}

export function MobileOptimizedLayout({
  children,
  enableSwipeNavigation = true,
  previousPage,
  nextPage,
  className,
  showMobileOptimizations = true,
}: MobileOptimizedLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const mobileNavPadding = useMobileBottomNavPadding();

  // Detect mobile device and orientation
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      
      setIsMobile(isMobileDevice);
      setIsLandscape(isLandscapeMode);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  const layoutClasses = cn(
    "min-h-screen w-full",
    // Mobile-specific optimizations
    isMobile && [
      "touch-manipulation", // Optimize touch events
      "overscroll-behavior-y-contain", // Prevent pull-to-refresh
      mobileNavPadding, // Add padding for mobile navigation
    ],
    // Landscape optimizations
    isMobile && isLandscape && [
      "landscape:min-h-screen",
      "landscape:overflow-x-hidden",
    ],
    className
  );

  const content = (
    <motion.div
      className={layoutClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        // Prevent zoom on double tap
        touchAction: "manipulation",
        // Optimize for mobile rendering
        WebkitOverflowScrolling: "touch",
        // Prevent text size adjustment on orientation change
        WebkitTextSizeAdjust: "100%",
      }}
    >
      {/* Mobile-specific viewport meta optimization */}
      {isMobile && showMobileOptimizations && (
        <div className="sr-only">
          <span>Mobile optimized view</span>
        </div>
      )}
      
      {children}
    </motion.div>
  );

  // Wrap with swipe navigation if enabled and on mobile
  if (enableSwipeNavigation && isMobile && (previousPage || nextPage)) {
    return (
      <SwipeNavigationWrapper
        previousPage={previousPage}
        nextPage={nextPage}
        className="w-full"
      >
        {content}
      </SwipeNavigationWrapper>
    );
  }

  return content;
}

/**
 * MobileContentWrapper Component
 * 
 * Wrapper for content sections with mobile-specific spacing and typography.
 */

interface MobileContentWrapperProps {
  children: React.ReactNode;
  spacing?: "tight" | "normal" | "loose";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function MobileContentWrapper({
  children,
  spacing = "normal",
  maxWidth = "lg",
  className,
}: MobileContentWrapperProps) {
  const wrapperClasses = cn(
    "w-full mx-auto",
    // Responsive max widths
    maxWidth === "sm" && "max-w-sm",
    maxWidth === "md" && "max-w-md",
    maxWidth === "lg" && "max-w-4xl",
    maxWidth === "xl" && "max-w-6xl",
    maxWidth === "full" && "max-w-full",
    
    // Mobile-optimized spacing
    spacing === "tight" && "px-4 py-2 md:px-6 md:py-4",
    spacing === "normal" && "px-4 py-4 md:px-6 md:py-8",
    spacing === "loose" && "px-4 py-6 md:px-8 md:py-12",
    
    className
  );

  return (
    <div className={wrapperClasses}>
      {children}
    </div>
  );
}

/**
 * MobileSection Component
 * 
 * Section component optimized for mobile viewing with proper spacing and accessibility.
 */

interface MobileSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  id?: string;
  className?: string;
  background?: "default" | "muted" | "accent";
}

export function MobileSection({
  children,
  title,
  subtitle,
  id,
  className,
  background = "default",
}: MobileSectionProps) {
  const sectionClasses = cn(
    "w-full",
    // Background variants
    background === "default" && "bg-background",
    background === "muted" && "bg-muted/30",
    background === "accent" && "bg-accent/10",
    
    className
  );

  return (
    <section id={id} className={sectionClasses}>
      <MobileContentWrapper>
        {(title || subtitle) && (
          <div className="mb-6 md:mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base md:text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </MobileContentWrapper>
    </section>
  );
}

/**
 * ThumbZoneButton Component
 * 
 * Button positioned in the thumb-friendly zone for one-handed mobile use.
 */

interface ThumbZoneButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  className?: string;
  variant?: "primary" | "secondary" | "floating";
}

export function ThumbZoneButton({
  children,
  onClick,
  position = "bottom-right",
  className,
  variant = "floating",
}: ThumbZoneButtonProps) {
  const buttonClasses = cn(
    "fixed z-50 transition-all duration-200",
    "min-h-[56px] min-w-[56px]", // Large touch target
    "rounded-full shadow-lg",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "active:scale-95 transform-gpu",
    
    // Position variants
    position === "bottom-right" && "bottom-20 right-4 md:bottom-6 md:right-6",
    position === "bottom-left" && "bottom-20 left-4 md:bottom-6 md:left-6",
    position === "bottom-center" && "bottom-20 left-1/2 transform -translate-x-1/2 md:bottom-6",
    
    // Style variants
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    variant === "floating" && "bg-background border border-border text-foreground hover:bg-accent",
    
    // Mobile-specific optimizations
    "touch-manipulation",
    "md:hidden", // Hide on desktop
    
    className
  );

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </motion.button>
  );
}

export default MobileOptimizedLayout;
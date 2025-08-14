/**
 * MobileLazyLoader Component
 * 
 * Mobile-optimized lazy loading with performance enhancements
 * for touch devices and slower network connections.
 */

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface MobileLazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  onLoad?: () => void;
  priority?: "low" | "normal" | "high";
  networkAware?: boolean;
}

export function MobileLazyLoader({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "50px",
  className,
  onLoad,
  priority = "normal",
  networkAware = true,
}: MobileLazyLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<"slow" | "fast">("fast");
  const elementRef = useRef<HTMLDivElement>(null);

  // Network speed detection
  useEffect(() => {
    if (!networkAware) return;

    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateNetworkSpeed = () => {
        const effectiveType = connection.effectiveType;
        setNetworkSpeed(effectiveType === "slow-2g" || effectiveType === "2g" ? "slow" : "fast");
      };

      updateNetworkSpeed();
      connection.addEventListener("change", updateNetworkSpeed);

      return () => {
        connection.removeEventListener("change", updateNetworkSpeed);
      };
    }
  }, [networkAware]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  // Load content based on priority and network conditions
  useEffect(() => {
    if (!isInView) return;

    const shouldLoad = () => {
      if (priority === "high") return true;
      if (priority === "low" && networkSpeed === "slow") return false;
      return true;
    };

    if (shouldLoad()) {
      // Add delay for slow networks to prevent overwhelming
      const delay = networkSpeed === "slow" ? 500 : 0;
      
      setTimeout(() => {
        setIsLoaded(true);
        onLoad?.();
      }, delay);
    }
  }, [isInView, priority, networkSpeed, onLoad]);

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-32 bg-muted rounded"></div>
    </div>
  );

  return (
    <div ref={elementRef} className={cn("min-h-[100px]", className)}>
      <AnimatePresence mode="wait">
        {isLoaded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback || <LoadingSkeleton />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * MobileImageLazyLoader Component
 * 
 * Optimized image lazy loading for mobile devices with WebP support
 * and responsive image loading.
 */

interface MobileImageLazyLoaderProps {
  src: string;
  alt: string;
  webpSrc?: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function MobileImageLazyLoader({
  src,
  alt,
  webpSrc,
  placeholder,
  className,
  width,
  height,
  priority = false,
  onLoad,
  onError,
}: MobileImageLazyLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder || "");
  const imgRef = useRef<HTMLImageElement>(null);

  // WebP support detection
  const supportsWebP = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }, []);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || priority) {
          const finalSrc = webpSrc && supportsWebP() ? webpSrc : src;
          setImageSrc(finalSrc);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, webpSrc, priority, supportsWebP]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setImageSrc(placeholder || "");
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          hasError && "opacity-50"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}

export default MobileLazyLoader;
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpinner, FaCode, FaCloud, FaDatabase, FaPalette, FaCog } from "react-icons/fa";

// Skeleton loader component
export const SkeletonLoader: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}> = ({ width = "100%", height = "20px", className = "", variant = "rectangular" }) => {
  const baseClasses = "bg-muted animate-pulse";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

// Pulsing dot loader
export const PulsingDots: React.FC<{
  size?: "sm" | "md" | "lg";
  color?: string;
  count?: number;
}> = ({ size = "md", color = "bg-primary", count = 3 }) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} ${color} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

// Spinning loader with custom icons
export const SpinningLoader: React.FC<{
  icon?: React.ComponentType<any>;
  size?: string;
  speed?: number;
  color?: string;
}> = ({ icon: Icon = FaSpinner, size = "w-8 h-8", speed = 1, color = "text-primary" }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Icon className={`${size} ${color}`} />
    </motion.div>
  );
};

// Progress circle loader
export const ProgressCircle: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
}> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = "#3b82f6", 
  backgroundColor = "#e5e7eb",
  showPercentage = true 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-foreground">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Wave loader
export const WaveLoader: React.FC<{
  bars?: number;
  color?: string;
  height?: string;
}> = ({ bars = 5, color = "bg-primary", height = "h-8" }) => {
  return (
    <div className="flex items-end space-x-1">
      {Array.from({ length: bars }).map((_, index) => (
        <motion.div
          key={index}
          className={`w-2 ${color} rounded-t`}
          animate={{
            height: ["8px", "32px", "8px"]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
};

// Typewriter loading effect
export const TypewriterLoader: React.FC<{
  text: string;
  speed?: number;
  cursor?: boolean;
}> = ({ text, speed = 100, cursor = true }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className="font-mono">
      {displayText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-1"
        >
          |
        </motion.span>
      )}
    </div>
  );
};

// Domain-specific loading states
export const DomainLoader: React.FC<{
  domain: "full-stack" | "cloud" | "data" | "ux-ui" | "consulting";
  message?: string;
}> = ({ domain, message }) => {
  const domainConfig = {
    "full-stack": {
      icon: FaCode,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      message: message || "Building full-stack solution..."
    },
    "cloud": {
      icon: FaCloud,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      message: message || "Deploying to cloud..."
    },
    "data": {
      icon: FaDatabase,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      message: message || "Processing data..."
    },
    "ux-ui": {
      icon: FaPalette,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      message: message || "Designing interface..."
    },
    "consulting": {
      icon: FaCog,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      message: message || "Analyzing requirements..."
    }
  };

  const config = domainConfig[domain];

  return (
    <div className={`flex flex-col items-center justify-center p-8 rounded-lg ${config.bgColor}`}>
      <SpinningLoader 
        icon={config.icon} 
        size="w-12 h-12" 
        color={config.color}
        speed={2}
      />
      <p className="mt-4 text-muted-foreground text-center">{config.message}</p>
    </div>
  );
};

// Page transition loader
export const PageTransitionLoader: React.FC<{
  isLoading: boolean;
  message?: string;
}> = ({ isLoading, message = "Loading..." }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-card border border-border rounded-lg p-8 shadow-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <SpinningLoader size="w-8 h-8" />
              <p className="text-foreground font-medium">{message}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Content placeholder with skeleton
export const ContentPlaceholder: React.FC<{
  type: "card" | "list" | "profile" | "article";
  count?: number;
}> = ({ type, count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <SkeletonLoader height="24px" width="60%" />
            <SkeletonLoader height="16px" width="100%" />
            <SkeletonLoader height="16px" width="80%" />
            <div className="flex space-x-2">
              <SkeletonLoader height="32px" width="80px" />
              <SkeletonLoader height="32px" width="80px" />
            </div>
          </div>
        );
      
      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <SkeletonLoader variant="circular" width="40px" height="40px" />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader height="16px" width="70%" />
                  <SkeletonLoader height="14px" width="50%" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case "profile":
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <SkeletonLoader variant="circular" width="80px" height="80px" />
              <div className="space-y-2">
                <SkeletonLoader height="20px" width="150px" />
                <SkeletonLoader height="16px" width="100px" />
              </div>
            </div>
            <SkeletonLoader height="16px" width="100%" />
            <SkeletonLoader height="16px" width="90%" className="mt-2" />
          </div>
        );
      
      case "article":
        return (
          <div className="space-y-4">
            <SkeletonLoader height="200px" width="100%" />
            <SkeletonLoader height="32px" width="80%" />
            <SkeletonLoader height="16px" width="100%" />
            <SkeletonLoader height="16px" width="95%" />
            <SkeletonLoader height="16px" width="85%" />
          </div>
        );
      
      default:
        return <SkeletonLoader />;
    }
  };

  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

// Main demo component
const LoadingAnimations: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handlePageLoad = () => {
    setIsPageLoading(true);
    setTimeout(() => setIsPageLoading(false), 3000);
  };

  return (
    <div className="p-8 space-y-12 bg-background">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Loading Animations
        </h2>
        <p className="text-muted-foreground">
          Smooth loading states and skeleton components for better UX
        </p>
      </div>

      {/* Basic Loaders */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Basic Loaders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h4 className="font-medium mb-4">Spinning Loader</h4>
            <SpinningLoader />
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h4 className="font-medium mb-4">Pulsing Dots</h4>
            <PulsingDots />
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h4 className="font-medium mb-4">Wave Loader</h4>
            <WaveLoader />
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <h4 className="font-medium mb-4">Progress Circle</h4>
            <ProgressCircle progress={progress} size={80} />
          </div>
        </div>
      </section>

      {/* Domain-Specific Loaders */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Domain-Specific Loaders</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DomainLoader domain="full-stack" />
          <DomainLoader domain="cloud" />
          <DomainLoader domain="data" />
        </div>
      </section>

      {/* Skeleton Loaders */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Skeleton Loaders</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">Card Skeleton</h4>
            <ContentPlaceholder type="card" />
          </div>
          <div>
            <h4 className="font-medium mb-4">Profile Skeleton</h4>
            <ContentPlaceholder type="profile" />
          </div>
        </div>
      </section>

      {/* Typewriter Effect */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Typewriter Effect</h3>
        <div className="bg-card border border-border rounded-lg p-6">
          <TypewriterLoader 
            text="Building amazing digital experiences with modern technology..." 
            speed={80}
          />
        </div>
      </section>

      {/* Page Transition Demo */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Page Transition</h3>
        <button
          onClick={handlePageLoad}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Trigger Page Loading
        </button>
      </section>

      <PageTransitionLoader 
        isLoading={isPageLoading} 
        message="Loading page content..."
      />
    </div>
  );
};

export default LoadingAnimations;

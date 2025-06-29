'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buttonAnimations, hoverAnimations } from '@/lib/animations';

interface EnhancedMagicButtonProps {
  title: string;
  icon: React.ReactNode;
  position: 'left' | 'right';
  handleClick?: () => void;
  otherClasses?: string;
  variant?: 'default' | 'outline' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

const EnhancedMagicButton: React.FC<EnhancedMagicButtonProps> = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses = '',
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
}) => {
  const [isSafari, setIsSafari] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  // Size configurations
  const sizeClasses = {
    sm: 'h-10 px-6 text-sm',
    md: 'h-12 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
  };

  // Variant configurations
  const variantClasses = {
    default: {
      background: 'bg-gradient-to-r from-primary-600 to-primary-700',
      text: 'text-white',
      border: 'border-transparent',
      glow: 'shadow-lg shadow-primary-500/25',
    },
    outline: {
      background: 'bg-transparent',
      text: 'text-primary-600 dark:text-primary-400',
      border: 'border border-primary-500/50',
      glow: 'shadow-lg shadow-primary-500/10',
    },
    glass: {
      background: 'bg-white/10 dark:bg-neutral-950/10 backdrop-blur-md',
      text: 'text-neutral-900 dark:text-white',
      border: 'border border-white/20 dark:border-neutral-700/50',
      glow: 'shadow-lg shadow-neutral-500/10',
    },
    gradient: {
      background: 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500',
      text: 'text-white',
      border: 'border-transparent',
      glow: 'shadow-lg shadow-secondary-500/25',
    },
  };

  const currentVariant = variantClasses[variant];

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    />
  );

  // Enhanced button for modern browsers
  const ModernButton = () => (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${currentVariant.background}
        ${currentVariant.text}
        ${currentVariant.border}
        ${currentVariant.glow}
        rounded-xl font-medium
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden group
        ${otherClasses}
      `}
      variants={buttonAnimations.press}
      initial="rest"
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated background overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        initial={{ x: '-100%' }}
        animate={isHovered ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 bg-white/30 rounded-xl"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Button content */}
      <span className="relative flex items-center gap-2 z-10">
        {position === 'left' && !loading && (
          <motion.span
            animate={isHovered ? { x: -2 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
        
        {loading && <LoadingSpinner />}
        
        <motion.span
          animate={isHovered ? { x: position === 'right' ? -2 : 2 } : { x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? 'Loading...' : title}
        </motion.span>
        
        {position === 'right' && !loading && (
          <motion.span
            animate={isHovered ? { x: 2 } : { x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.span>
        )}
      </span>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 bg-gradient-to-r from-primary-400 to-secondary-400 blur-xl"
        animate={isHovered ? { opacity: 0.3, scale: 1.1 } : { opacity: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );

  // Fallback button for Safari
  const SafariButton = () => (
    <motion.button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center
        ${sizeClasses[size]}
        ${currentVariant.background}
        ${currentVariant.text}
        ${currentVariant.border}
        rounded-xl font-medium
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${otherClasses}
      `}
      variants={buttonAnimations.press}
      initial="rest"
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
    >
      <span className="flex items-center gap-2">
        {position === 'left' && !loading && icon}
        {loading && <LoadingSpinner />}
        {loading ? 'Loading...' : title}
        {position === 'right' && !loading && icon}
      </span>
    </motion.button>
  );

  if (!mounted) {
    return <ModernButton />; // Default to modern button during SSR
  }

  return isSafari ? <SafariButton /> : <ModernButton />;
};

export default EnhancedMagicButton;
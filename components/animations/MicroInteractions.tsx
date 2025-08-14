"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  FaHeart, 
  FaStar, 
  FaBookmark, 
  FaShare, 
  FaThumbsUp, 
  FaEye,
  FaArrowRight,
  FaDownload,
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp
} from "react-icons/fa";

// Micro-interaction hook for button press effects
export const useButtonPress = () => {
  const [isPressed, setIsPressed] = useState(false);
  
  const pressVariants = {
    pressed: { scale: 0.95, transition: { duration: 0.1 } },
    released: { scale: 1, transition: { duration: 0.1 } }
  };

  const handlePress = () => setIsPressed(true);
  const handleRelease = () => setIsPressed(false);

  return {
    variants: pressVariants,
    animate: isPressed ? "pressed" : "released",
    onMouseDown: handlePress,
    onMouseUp: handleRelease,
    onMouseLeave: handleRelease,
    onTouchStart: handlePress,
    onTouchEnd: handleRelease
  };
};

// Magnetic button effect
export const MagneticButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}> = ({ children, className = "", onClick, strength = 0.3 }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Ripple effect component
export const RippleButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const rippleId = useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: rippleId.current++, x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 25,
              top: ripple.y - 25,
              width: 50,
              height: 50,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};

// Floating action button with micro-interactions
export const FloatingActionButton: React.FC<{
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
}> = ({ icon: Icon, label, onClick, variant = "primary" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const variantStyles = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white"
  };

  return (
    <motion.button
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 ${variantStyles[variant]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: isHovered 
          ? "0 8px 25px rgba(0,0,0,0.3)" 
          : "0 4px 15px rgba(0,0,0,0.2)"
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        animate={{ 
          rotate: isPressed ? 180 : 0,
          scale: isPressed ? 0.8 : 1 
        }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute right-16 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {label}
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black border-t-2 border-b-2 border-t-transparent border-b-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Interactive card with hover effects
export const InteractiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glowEffect?: boolean;
}> = ({ children, className = "", onClick, glowEffect = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative cursor-pointer ${className}`}
      style={{ 
        rotateX: isHovered ? rotateX : 0, 
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        boxShadow: glowEffect 
          ? "0 0 30px rgba(59, 130, 246, 0.3)" 
          : "0 10px 30px rgba(0,0,0,0.2)"
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
      
      {glowEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Animated counter component
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}> = ({ value, duration = 2, prefix = "", suffix = "", className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCounter = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration, isVisible]);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ duration: 0.5 }}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </motion.div>
  );
};

// Progress bar with animation
export const AnimatedProgressBar: React.FC<{
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}> = ({ 
  progress, 
  height = 8, 
  color = "bg-primary", 
  backgroundColor = "bg-muted",
  showLabel = false,
  label,
  className = ""
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
      )}
      <div 
        className={`w-full rounded-full overflow-hidden ${backgroundColor}`}
        style={{ height }}
      >
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${animatedProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Staggered list animation
export const StaggeredList: React.FC<{
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Demo component showcasing all micro-interactions
const MicroInteractions: React.FC = () => {
  const [likeCount, setLikeCount] = useState(42);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="p-8 space-y-12 bg-background">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Advanced Micro-Interactions
        </h2>
        <p className="text-muted-foreground">
          Interactive components with purposeful animations and feedback
        </p>
      </div>

      {/* Magnetic Buttons */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Magnetic Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <MagneticButton 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
            onClick={() => console.log("Magnetic button clicked")}
          >
            Hover me
          </MagneticButton>
          <MagneticButton 
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg"
            strength={0.5}
          >
            Strong magnetism
          </MagneticButton>
        </div>
      </section>

      {/* Ripple Buttons */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Ripple Effects</h3>
        <div className="flex flex-wrap gap-4">
          <RippleButton className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Click for ripple
          </RippleButton>
          <RippleButton className="px-6 py-3 bg-green-500 text-white rounded-lg">
            Another ripple
          </RippleButton>
        </div>
      </section>

      {/* Interactive Cards */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Interactive Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InteractiveCard 
            className="p-6 bg-card border border-border rounded-lg"
            glowEffect
          >
            <h4 className="text-lg font-semibold mb-2">3D Hover Card</h4>
            <p className="text-muted-foreground">
              This card responds to mouse movement with 3D transforms and glow effects.
            </p>
          </InteractiveCard>
          <InteractiveCard className="p-6 bg-card border border-border rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Standard Card</h4>
            <p className="text-muted-foreground">
              This card has subtle hover effects without the glow.
            </p>
          </InteractiveCard>
        </div>
      </section>

      {/* Animated Counters */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Animated Counters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-card border border-border rounded-lg">
            <AnimatedCounter 
              value={1250} 
              className="text-3xl font-bold text-primary"
              suffix="+"
            />
            <p className="text-muted-foreground mt-2">Projects Completed</p>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-lg">
            <AnimatedCounter 
              value={98} 
              className="text-3xl font-bold text-green-500"
              suffix="%"
            />
            <p className="text-muted-foreground mt-2">Client Satisfaction</p>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-lg">
            <AnimatedCounter 
              value={30000000} 
              className="text-3xl font-bold text-purple-500"
              prefix="$"
              suffix="+"
            />
            <p className="text-muted-foreground mt-2">Business Impact</p>
          </div>
        </div>
      </section>

      {/* Progress Bars */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Animated Progress</h3>
        <div className="space-y-4">
          <AnimatedProgressBar 
            progress={85} 
            label="React/Next.js" 
            showLabel 
            color="bg-blue-500"
          />
          <AnimatedProgressBar 
            progress={92} 
            label="TypeScript" 
            showLabel 
            color="bg-green-500"
          />
          <AnimatedProgressBar 
            progress={progress} 
            label="Dynamic Progress" 
            showLabel 
            color="bg-purple-500"
          />
        </div>
      </section>

      {/* Staggered List */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Staggered Animations</h3>
        <StaggeredList className="space-y-3">
          {[
            "First item appears",
            "Second item follows",
            "Third item continues the sequence",
            "Fourth item completes the animation",
            "All items animate in sequence"
          ].map((text, index) => (
            <div key={index} className="p-4 bg-card border border-border rounded-lg">
              {text}
            </div>
          ))}
        </StaggeredList>
      </section>

      {/* Like Button with Animation */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground">Interactive Like Button</h3>
        <motion.button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
            isLiked 
              ? "bg-red-500 text-white border-red-500" 
              : "bg-background text-foreground border-border hover:border-red-500"
          }`}
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ 
              scale: isLiked ? [1, 1.3, 1] : 1,
              rotate: isLiked ? [0, -10, 10, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <FaHeart className={`w-5 h-5 ${isLiked ? "text-white" : "text-red-500"}`} />
          </motion.div>
          <span>{likeCount}</span>
        </motion.button>
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={FaShare}
        label="Share this page"
        onClick={() => console.log("Share clicked")}
        variant="primary"
      />
    </div>
  );
};

export default MicroInteractions;

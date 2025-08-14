/**
 * Refactored Enhanced Hero - Clean Code Implementation
 * Following "The Clean Code Cookbook" principles
 */

"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { FaLocationArrow, FaCode, FaCloud, FaDatabase } from "react-icons/fa";
import InteractiveMagicButton from "./ui/InteractiveMagicButton";
import TypewriterEffect from "./ui/TypewriterEffect";
import ParticleBackground from "./ui/ParticleBackground";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  fadeAnimations,
  staggerConfig,
  createViewportAnimation,
  presetAnimations,
} from "@/lib/animations";
import {
  normalizeMousePosition,
  createFloatingShapeStyle,
  createFloatingShapeAnimation,
  createFloatingShapeTransition,
} from "@/lib/utils/cleanCodeHelpers";

// ✅ Principle 1: Name Things Like They Matter
interface MousePosition {
  x: number;
  y: number;
}

interface SpecializationData {
  icon: React.ComponentType;
  color: string;
  gradient: string;
  label: string;
}

// ✅ Principle 3: Don't Repeat Decisions — Let the Code Decide
const SPECIALIZATION_CONFIG: SpecializationData[] = [
  {
    icon: FaCode,
    color: "blue",
    gradient: "from-blue-500 to-blue-700",
    label: "Full-Stack Development",
  },
  {
    icon: FaCloud,
    color: "teal",
    gradient: "from-teal-500 to-teal-700",
    label: "Cloud Engineering",
  },
  {
    icon: FaDatabase,
    color: "purple",
    gradient: "from-purple-500 to-purple-700",
    label: "Data Analytics",
  },
];

const TYPEWRITER_PHRASES = [
  "scalable web applications",
  "cloud-native solutions",
  "data-driven insights",
  "seamless mobile experiences",
  "innovative digital solutions",
];

const FLOATING_SHAPES_COUNT = 6;

// ✅ Principle 2: Keep Functions Focused - Refactored Component
const CleanCodeHero = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [mounted, setMounted] = useState(false);

  const scrollAnimationData = useScrollAnimationData();

  // ✅ Focused effect: Handle component mounting
  useEffect(() => {
    handleComponentMount(setMounted);
  }, []);

  // ✅ Focused effect: Handle mouse tracking
  useEffect(() => {
    if (!mounted) return;

    return setupMouseTracking(setMousePosition);
  }, [mounted]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />

      {renderBackgroundOverlay()}

      <motion.div
        ref={scrollAnimationData.heroRef}
        variants={staggerConfig.container}
        initial="hidden"
        animate={scrollAnimationData.isVisible ? "visible" : "hidden"}
        style={{ y: scrollAnimationData.textY }}
        className="relative z-20 w-full max-w-7xl mx-auto px-4"
      >
        <div className="flex flex-col items-center justify-center text-center">
          {renderSpecializationIcons(mousePosition)}
          {renderHeroTitle()}
          {renderHeroDescription()}
          {renderCallToActionButtons()}
          {renderScrollIndicator()}
        </div>
      </motion.div>

      {renderFloatingShapes()}
    </div>
  );
};

/**
 * ✅ Focused function: Get scroll animation data
 */
function useScrollAnimationData() {
  const { scrollY } = useScroll();
  const { ref: heroRef, isVisible } = useScrollAnimation();

  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);

  return { heroRef, isVisible, backgroundY, textY };
}

/**
 * ✅ Focused function: Handle component mount
 */
function handleComponentMount(
  setMounted: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  setMounted(true);
}

/**
 * ✅ Focused function: Setup mouse tracking
 */
function setupMouseTracking(
  setMousePosition: React.Dispatch<React.SetStateAction<MousePosition>>,
): () => void {
  const handleMouseMove = (e: MouseEvent) => {
    const normalizedPosition = normalizeMousePosition(
      e.clientX,
      e.clientY,
      window.innerWidth,
      window.innerHeight,
    );
    setMousePosition(normalizedPosition);
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}

/**
 * ✅ Focused function: Render background overlay
 */
function renderBackgroundOverlay(): JSX.Element {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-purple-50/5 to-pink-50/10 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
  );
}

/**
 * ✅ Focused function: Render specialization icons
 */
function renderSpecializationIcons(mousePosition: MousePosition): JSX.Element {
  return (
    <motion.div variants={staggerConfig.item} className="flex gap-6 mb-8">
      {SPECIALIZATION_CONFIG.map((spec, index) => (
        <SpecializationIcon
          key={spec.label}
          specialization={spec}
          mousePosition={mousePosition}
          index={index}
        />
      ))}
    </motion.div>
  );
}

/**
 * ✅ Focused component: Specialization icon
 */
function SpecializationIcon({
  specialization,
  mousePosition,
  index,
}: {
  specialization: SpecializationData;
  mousePosition: MousePosition;
  index: number;
}): JSX.Element {
  const IconComponent = specialization.icon;

  return (
    <motion.div
      className={`relative p-4 rounded-2xl bg-gradient-to-br ${specialization.gradient} bg-opacity-20 backdrop-blur-sm border border-white/20`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      style={{
        transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
      }}
    >
      <IconComponent className={`text-2xl text-${specialization.color}-500`} />
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${specialization.gradient} opacity-0 blur-xl`}
        whileHover={{ opacity: 0.3 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

/**
 * ✅ Focused function: Render hero title
 */
function renderHeroTitle(): JSX.Element {
  return (
    <>
      <motion.h2
        variants={staggerConfig.item}
        className="uppercase tracking-widest text-center mb-6 text-sm md:text-lg font-medium"
      >
        <span className="text-blue-400 dark:text-blue-300 font-semibold">
          Full-Stack
        </span>
        <span className="text-muted-foreground dark:text-muted-foreground mx-2">|</span>
        <span className="text-purple-400 dark:text-purple-300 font-semibold">
          Cloud
        </span>
        <span className="text-muted-foreground dark:text-muted-foreground mx-2">|</span>
        <span className="text-green-400 dark:text-green-300 font-semibold">
          Data
        </span>
      </motion.h2>

      <motion.h1
        variants={staggerConfig.item}
        className="text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-8 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent"
      >
        Mikhail Ajaj
      </motion.h1>
    </>
  );
}

/**
 * ✅ Focused function: Render hero description
 */
function renderHeroDescription(): JSX.Element {
  return (
    <motion.div
      variants={staggerConfig.item}
      className="text-center text-muted-foreground dark:text-muted-foreground mb-10 text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto font-medium leading-relaxed"
    >
      <span className="font-light">I craft </span>
      <TypewriterEffect
        words={TYPEWRITER_PHRASES}
        className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
      />
    </motion.div>
  );
}

/**
 * ✅ Focused function: Render call to action buttons
 */
function renderCallToActionButtons(): JSX.Element {
  return (
    <motion.div
      variants={staggerConfig.item}
      className="flex flex-col sm:flex-row gap-4 mb-16"
    >
      <Link href="/contact">
        <InteractiveMagicButton
          title="Start a Project"
          icon={<FaLocationArrow />}
          position="right"
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        />
      </Link>
      <Link href="/experience">
        <InteractiveMagicButton
          title="View My Work"
          position="right"
          className="border border-white/20 bg-white/10 hover:bg-white/20"
        />
      </Link>
    </motion.div>
  );
}

/**
 * ✅ Focused function: Render scroll indicator
 */
function renderScrollIndicator(): JSX.Element {
  return (
    <motion.div
      variants={staggerConfig.item}
      className="group cursor-pointer flex flex-col items-center gap-2"
    >
      <div className="w-6 h-10 border-2 border-neutral-400 dark:border-neutral-500 rounded-full flex justify-center relative overflow-hidden group-hover:border-primary-500 transition-colors duration-300">
        <motion.div
          className="w-1 h-3 bg-neutral-400 dark:bg-neutral-500 rounded-full mt-2 group-hover:bg-primary-500 transition-colors duration-300"
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <span className="text-xs text-muted-foreground dark:text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Scroll to explore
      </span>
    </motion.div>
  );
}

/**
 * ✅ Focused function: Render floating shapes
 */
function renderFloatingShapes(): JSX.Element {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: FLOATING_SHAPES_COUNT }, (_, index) => (
        <FloatingShape key={index} index={index} />
      ))}
    </div>
  );
}

/**
 * ✅ Focused component: Floating shape
 */
function FloatingShape({ index }: { index: number }): JSX.Element {
  const style = createFloatingShapeStyle(index);
  const animation = createFloatingShapeAnimation(index);
  const transition = createFloatingShapeTransition(index);

  return (
    <motion.div
      className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
      style={style}
      animate={animation}
      transition={transition}
    />
  );
}

export default CleanCodeHero;

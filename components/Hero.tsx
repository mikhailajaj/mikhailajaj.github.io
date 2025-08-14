"use client";
import React from "react";
import { Spotlight } from "./ui/Spotlight";
import Link from "next/link";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow, FaCode, FaCloud, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";
import ParticleBackground from "./ui/ParticleBackground";
import TypewriterEffect from "./ui/TypewriterEffect";

/**
 * Hero Component
 *
 * The main hero section of the portfolio showcasing Mikhail Ajaj's expertise
 * across Full-Stack Development, Cloud Engineering, and Data Analytics.
 *
 * @component
 * @example
 * ```tsx
 * <Hero />
 * ```
 *
 * Features:
 * - Animated particle background for visual appeal
 * - Typewriter effect showcasing different skills
 * - Smooth animations using Framer Motion
 * - Responsive design for all screen sizes
 * - Call-to-action buttons for navigation
 * - Domain expertise indicators (Full-Stack, Cloud, Data)
 * - Scroll indicator for user guidance
 *
 * Animation Timeline:
 * - 0.0s: Domain icons fade in with scale
 * - 0.2s: Main heading slides up
 * - 0.4s: Typewriter effect begins
 * - 0.6s: Action buttons appear
 * - 1.5s: Scroll indicator starts animation loop
 *
 * @returns {JSX.Element} The hero section with animated content
 */
const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 dark:to-black/40 z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="bg-blue-500/20 p-2 rounded-full">
              <FaCode className="text-blue-500 text-xl" />
            </div>
            <div className="bg-teal-500/20 p-2 rounded-full">
              <FaCloud className="text-teal-500 text-xl" />
            </div>
            <div className="bg-purple-500/20 p-2 rounded-full">
              <FaDatabase className="text-purple-500 text-xl" />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="uppercase tracking-widest text-center text-blue-600 dark:text-blue-400 mb-4 text-sm md:text-lg"
          >
            <span className="text-blue-600 dark:text-blue-400">Full-Stack</span>{" "}
            |<span className="text-teal-600 dark:text-teal-400"> Cloud</span> |
            <span className="text-purple-600 dark:text-purple-400"> Data</span>
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-center text-black dark:text-white mb-6"
          >
            Mikhail Ajaj
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center text-foreground dark:text-muted-foreground mb-8 text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto"
          >
            I build{" "}
            <TypewriterEffect
              words={[
                "responsive web applications",
                "cloud infrastructure",
                "data pipelines",
                "mobile experiences",
              ]}
              className="text-blue-600 dark:text-blue-400 font-medium"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link href="#projects">
              <MagicButton
                title="View Projects"
                icon={<FaLocationArrow />}
                position="right"
              />
            </Link>
            <Link href="#contact">
              <MagicButton
                title="Contact Me"
                icon={<FaLocationArrow />}
                position="right"
                variant="outline"
              />
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.5, duration: 1 },
              y: {
                delay: 1.5,
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              },
            }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-border dark:border-border rounded-full flex justify-center">
              <div className="w-1 h-2 bg-muted dark:bg-card rounded-full mt-2"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

"use client";
import React, { useEffect, useState, useRef } from "react";
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

const InteractiveHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const { ref: heroRef, isVisible } = useScrollAnimation();

  // Parallax effects
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse tracking for interactive elements
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

  // Specialization icons data
  const specializations = [
    {
      icon: FaCode,
      color: "blue",
      label: "Full-Stack",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaCloud,
      color: "teal",
      label: "Cloud",
      gradient: "from-teal-500 to-green-500",
    },
    {
      icon: FaDatabase,
      color: "purple",
      label: "Data",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Enhanced Particle Background with parallax */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <ParticleBackground />
      </motion.div>

      {/* Dynamic gradient overlay that responds to mouse */}
      {mounted && (
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, 
              rgba(59, 130, 246, 0.3) 0%, 
              rgba(147, 51, 234, 0.2) 50%, 
              transparent 100%)`,
          }}
        />
      )}

      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-purple-50/5 to-pink-50/10 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />

      {/* Main content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4"
      >
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          variants={staggerConfig.container}
          initial="hidden"
          animate="visible"
        >
          {/* Floating specialization icons */}
          <motion.div
            variants={staggerConfig.item}
            className="flex items-center gap-4 mb-8"
          >
            {specializations.map((spec, index) => (
              <motion.div
                key={spec.label}
                className={`relative p-4 rounded-2xl bg-gradient-to-br ${spec.gradient} bg-opacity-20 backdrop-blur-sm border border-white/20`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: `0 20px 40px rgba(59, 130, 246, 0.3)`,
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  y: {
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 4 + index * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <spec.icon className={`text-2xl text-${spec.color}-500`} />

                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${spec.gradient} opacity-0 blur-xl`}
                  whileHover={{ opacity: 0.4 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Specialization labels */}
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

          {/* Main title with enhanced typography */}
          <motion.h1
            variants={staggerConfig.item}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-8 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-950 dark:from-white dark:via-neutral-100 dark:to-white bg-clip-text text-transparent"
          >
            <motion.span
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
                background:
                  "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Mikhail Ajaj
            </motion.span>
          </motion.h1>

          {/* Enhanced description with typewriter */}
          <motion.div
            variants={staggerConfig.item}
            className="text-center text-muted-foreground dark:text-muted-foreground mb-10 text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto font-medium leading-relaxed"
          >
            <span className="font-light">I craft </span>
            <TypewriterEffect
              words={[
                "responsive web applications",
                "scalable cloud infrastructure",
                "intelligent data pipelines",
                "seamless mobile experiences",
                "innovative digital solutions",
              ]}
              className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            />
          </motion.div>

          {/* Enhanced action buttons */}
          <motion.div
            variants={staggerConfig.item}
            className="flex flex-col sm:flex-row gap-6 mt-8"
          >
            <Link href="#projects">
              <InteractiveMagicButton
                title="View My Work"
                icon={<FaLocationArrow />}
                position="right"
                variant="gradient"
                size="lg"
              />
            </Link>
            <Link href="#contact">
              <InteractiveMagicButton
                title="Let's Connect"
                icon={<FaLocationArrow />}
                position="right"
                variant="glass"
                size="lg"
              />
            </Link>
          </motion.div>

          {/* Enhanced scroll indicator */}
          <motion.div
            variants={staggerConfig.item}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              className="flex flex-col items-center gap-2 cursor-pointer group"
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.1 }}
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
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveHero;

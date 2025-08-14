"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/base/Card";
import { FaArrowRight } from "react-icons/fa";
import {
  DomainTheme,
  getAnimationVariants,
  getHoverVariants,
  getPatternEffects,
  getMicroInteractionVariants,
} from "@/lib/config/domainThemes";

interface DomainCardProps {
  theme: DomainTheme;
  index?: number;
  className?: string;
  showMetrics?: boolean;
  size?: "sm" | "md" | "lg";
}

export const DomainCard: React.FC<DomainCardProps> = ({
  theme,
  index = 0,
  className = "",
  showMetrics = false,
  size = "md",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const animationVariants = getAnimationVariants(theme);
  const hoverVariants = getHoverVariants(theme);
  const patternEffects = getPatternEffects(theme);
  const microInteractions = getMicroInteractionVariants(theme);

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const iconSizes = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-2xl",
  };

  return (
    <motion.div
      variants={animationVariants}
      whileHover={hoverVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`perspective-1000 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        variant="interactive"
        className="h-full bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20 group relative overflow-hidden"
      >
        {/* Enhanced dynamic background pattern */}
        <div
          className="absolute inset-0 opacity-10 transition-opacity duration-500"
          style={patternEffects}
        />

        {/* Animated pattern overlay */}
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: `conic-gradient(from ${isHovered ? "180deg" : "0deg"} at 50% 50%, ${theme.primaryColor}20 0deg, transparent 120deg, ${theme.secondaryColor}10 240deg, transparent 360deg)`,
          }}
          animate={{
            opacity: isHovered ? 0.15 : 0.05,
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: isHovered ? Infinity : 0,
          }}
        />

        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]})`,
            padding: "1px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full bg-black/40 backdrop-blur-sm rounded-lg" />
        </motion.div>

        <Link
          href={theme.href}
          className={`block h-full ${sizeClasses[size]} relative z-10`}
        >
          {/* Enhanced icon with sophisticated micro-interactions */}
          <motion.div
            className={`${iconSizes[size]} rounded-lg flex items-center justify-center mb-4 shadow-lg relative cursor-pointer`}
            style={{
              background: `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]})`,
            }}
            variants={microInteractions.icon}
            whileHover="hover"
            whileTap="tap"
          >
            <theme.primaryIcon className="text-white relative z-10" />

            {/* Enhanced glow effect */}
            <motion.div
              className="absolute inset-0 rounded-lg blur-md"
              style={{
                background: `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]})`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 0.8 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Pulse effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]})`,
              }}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
                opacity: isHovered ? [0.3, 0, 0.3] : 0,
              }}
              transition={{
                duration: 2,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Enhanced secondary icons with micro-interactions */}
          <div className="flex items-center gap-2 mb-4">
            {theme.secondaryIcons.slice(0, 3).map((Icon, iconIndex) => (
              <motion.div
                key={iconIndex}
                className="w-5 h-5 rounded bg-white/10 flex items-center justify-center cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                variants={microInteractions.secondaryIcon}
                whileHover="hover"
                transition={{ delay: 0.1 * iconIndex, duration: 0.3 }}
              >
                <Icon className="text-xs text-muted-foreground transition-colors duration-200" />
              </motion.div>
            ))}
          </div>

          {/* Enhanced title with micro-interactions */}
          <motion.h3
            className="text-white font-semibold text-lg mb-2 cursor-pointer"
            variants={microInteractions.title}
            whileHover="hover"
            style={{
              color: isHovered ? theme.primaryColor : "white",
            }}
          >
            {theme.name}
          </motion.h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3 leading-relaxed">
            {size === "sm" ? theme.shortDescription : theme.description}
          </p>

          {/* Tagline */}
          <div
            className="text-xs font-medium mb-3 transition-colors duration-300"
            style={{
              color: isHovered ? theme.secondaryColor : theme.primaryColor,
            }}
          >
            {theme.tagline}
          </div>

          {/* Enhanced expertise tags with micro-interactions */}
          <div className="flex flex-wrap gap-1 mb-4">
            {theme.expertise.slice(0, 3).map((skill, skillIndex) => (
              <motion.span
                key={skillIndex}
                className="text-xs px-2 py-1 rounded-full bg-white/10 text-muted-foreground border border-white/20 cursor-pointer"
                variants={microInteractions.tag}
                whileHover="hover"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * skillIndex, duration: 0.3 }}
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* Metrics (optional) */}
          {showMetrics && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {theme.keyMetrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="text-center">
                  <div className="text-sm font-bold text-white">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Footer with category and arrow */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">
                {theme.category}
              </span>
              <span className="text-xs text-muted-foreground">
                {theme.keyMetrics[0]?.value} {theme.keyMetrics[0]?.description}
              </span>
            </div>

            <motion.div
              className="flex items-center gap-2"
              variants={microInteractions.arrow}
              whileHover="hover"
            >
              <FaArrowRight
                className="transition-colors duration-200"
                style={{
                  color: isHovered ? theme.primaryColor : "#9CA3AF",
                }}
              />
            </motion.div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default DomainCard;

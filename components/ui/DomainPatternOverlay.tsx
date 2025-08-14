"use client";

import React from "react";
import { motion } from "framer-motion";
import { DomainTheme } from "@/lib/config/domainThemes";

interface DomainPatternOverlayProps {
  theme: DomainTheme;
  isActive?: boolean;
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export const DomainPatternOverlay: React.FC<DomainPatternOverlayProps> = ({
  theme,
  isActive = false,
  intensity = "medium",
  className = "",
}) => {
  const intensityOpacity = {
    low: 0.05,
    medium: 0.1,
    high: 0.2,
  };

  const getPatternSVG = () => {
    switch (theme.patternType) {
      case "grid":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`grid-${theme.id}`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke={theme.primaryColor}
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
              <linearGradient
                id={`grid-gradient-${theme.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={theme.gradientColors[0]}
                  stopOpacity="0.1"
                />
                <stop
                  offset="100%"
                  stopColor={theme.gradientColors[1]}
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${theme.id})`} />
            <rect
              width="100%"
              height="100%"
              fill={`url(#grid-gradient-${theme.id})`}
            />
          </svg>
        );

      case "network":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient
                id={`network-gradient-${theme.id}`}
                cx="50%"
                cy="50%"
                r="50%"
              >
                <stop
                  offset="0%"
                  stopColor={theme.primaryColor}
                  stopOpacity="0.2"
                />
                <stop
                  offset="50%"
                  stopColor={theme.secondaryColor}
                  stopOpacity="0.1"
                />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Network nodes */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180;
              const radius = 30 + (i % 3) * 15;
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;

              return (
                <g key={i}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="2"
                    fill={theme.primaryColor}
                    opacity="0.4"
                  />
                  {i > 0 && (
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${x}%`}
                      y2={`${y}%`}
                      stroke={theme.secondaryColor}
                      strokeWidth="1"
                      opacity="0.2"
                    />
                  )}
                </g>
              );
            })}
            <rect
              width="100%"
              height="100%"
              fill={`url(#network-gradient-${theme.id})`}
            />
          </svg>
        );

      case "flow":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient
                id={`flow-gradient-${theme.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={theme.primaryColor}
                  stopOpacity="0.15"
                />
                <stop
                  offset="50%"
                  stopColor={theme.secondaryColor}
                  stopOpacity="0.08"
                />
                <stop
                  offset="100%"
                  stopColor={theme.primaryColor}
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
            {/* Flow lines */}
            {[...Array(5)].map((_, i) => (
              <path
                key={i}
                d={`M 0 ${20 + i * 15} Q 50 ${10 + i * 20} 100 ${25 + i * 12}`}
                stroke={theme.primaryColor}
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
            ))}
            <rect
              width="100%"
              height="100%"
              fill={`url(#flow-gradient-${theme.id})`}
            />
          </svg>
        );

      case "organic":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient
                id={`organic-gradient-${theme.id}`}
                cx="30%"
                cy="30%"
                r="70%"
              >
                <stop
                  offset="0%"
                  stopColor={theme.primaryColor}
                  stopOpacity="0.15"
                />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
              <radialGradient
                id={`organic-gradient-2-${theme.id}`}
                cx="70%"
                cy="70%"
                r="60%"
              >
                <stop
                  offset="0%"
                  stopColor={theme.secondaryColor}
                  stopOpacity="0.1"
                />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Organic shapes */}
            <ellipse
              cx="30%"
              cy="30%"
              rx="25%"
              ry="35%"
              fill={`url(#organic-gradient-${theme.id})`}
            />
            <ellipse
              cx="70%"
              cy="70%"
              rx="30%"
              ry="25%"
              fill={`url(#organic-gradient-2-${theme.id})`}
            />
          </svg>
        );

      case "geometric":
        return (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`geometric-${theme.id}`}
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="30,5 50,25 30,45 10,25"
                  fill={theme.primaryColor}
                  opacity="0.1"
                />
                <polygon
                  points="30,15 40,25 30,35 20,25"
                  fill={theme.secondaryColor}
                  opacity="0.15"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill={`url(#geometric-${theme.id})`}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive
          ? intensityOpacity[intensity]
          : intensityOpacity[intensity] * 0.5,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {getPatternSVG()}

      {/* Animated overlay for active state */}
      {isActive && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, ${theme.primaryColor}20 0deg, transparent 120deg, ${theme.secondaryColor}15 240deg, transparent 360deg)`,
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

export default DomainPatternOverlay;

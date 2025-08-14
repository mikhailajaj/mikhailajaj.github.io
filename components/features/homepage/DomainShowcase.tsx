"use client";

import React from "react";
import { motion } from "framer-motion";
import { getAllDomainThemes } from "@/lib/config/domainThemes";
import { DomainCard } from "@/components/ui/DomainCard";
import { DomainComparisonMatrix } from "@/components/ui/DomainComparisonMatrix";

interface DomainShowcaseProps {
  showMetrics?: boolean;
  cardSize?: "sm" | "md" | "lg";
  className?: string;
}

export const DomainShowcase: React.FC<DomainShowcaseProps> = ({
  showMetrics = false,
  cardSize = "md",
  className = "",
}) => {
  const domains = getAllDomainThemes();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Specialized Domain Expertise
          </h2>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Five distinct domains of technical excellence, each with unique
            approaches and specialized methodologies to deliver exceptional
            results.
          </p>
        </motion.div>

        {/* Enhanced Domain Cards Grid with Visual Differentiation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative"
        >
          {/* Background connecting lines between domains */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="connection-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                  <stop offset="25%" stopColor="#06B6D4" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.06" />
                  <stop offset="75%" stopColor="#EC4899" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Connecting paths between domain cards */}
              <path
                d="M 10% 50% Q 30% 20% 50% 50% Q 70% 80% 90% 50%"
                stroke="url(#connection-gradient)"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
              />
            </svg>
          </div>

          {domains.map((theme, index) => (
            <motion.div
              key={theme.id}
              variants={itemVariants}
              className="relative"
            >
              {/* Domain-specific background glow */}
              <motion.div
                className="absolute -inset-4 rounded-2xl blur-xl"
                style={{
                  background: `radial-gradient(circle, ${theme.primaryColor}15 0%, transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              />

              <DomainCard
                theme={theme}
                index={index}
                showMetrics={showMetrics}
                size={cardSize}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Domain Comparison Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <DomainComparisonMatrix showMetrics={showMetrics} />
        </motion.div>

        {/* Domain Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16 bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Cross-Domain Integration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">∞</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Seamless Integration
              </h4>
              <p className="text-gray-200 text-sm">
                All domains work together to create comprehensive solutions that
                address every aspect of your technology needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Accelerated Delivery
              </h4>
              <p className="text-gray-200 text-sm">
                Multi-domain expertise eliminates handoffs and communication
                gaps, resulting in faster project completion.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">
                Holistic Solutions
              </h4>
              <p className="text-gray-200 text-sm">
                Every project benefits from insights across all domains,
                ensuring optimal architecture and user experience.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DomainShowcase;

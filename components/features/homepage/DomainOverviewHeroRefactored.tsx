/**
 * Refactored Domain Overview Hero - Data-Driven Implementation
 * Following "The Clean Code Cookbook" principle: "Don't Repeat Decisions — Let the Code Decide"
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import {
  DOMAIN_CONFIG,
  getDomainsByOrder,
  type DomainId,
} from "@/lib/config/dataDrivenConfig";

// ✅ Data-driven statistics configuration
const PORTFOLIO_STATS = [
  { value: "50+", label: "Projects Completed" },
  { value: "25+", label: "Happy Clients" },
  { value: "5+", label: "Years Experience" },
  { value: "99%", label: "Client Satisfaction" },
] as const;

// ✅ Animation configuration - data-driven
const ANIMATION_CONFIG = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  domainCard: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
} as const;

// ✅ Main component - data-driven, no conditionals
export default function RefactoredDomainOverviewHero() {
  const featuredDomains = getDomainsByOrder();

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4">
      {renderBackgroundElements()}

      <motion.div
        variants={ANIMATION_CONFIG.container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto text-center"
      >
        {renderHeroHeader()}
        {renderDomainGrid(featuredDomains)}
        {renderPortfolioStats()}
      </motion.div>
    </section>
  );
}

/**
 * ✅ Focused function: Render background elements
 */
function renderBackgroundElements(): JSX.Element {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-purple-50/5 to-pink-50/10 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-blue-500/5 to-transparent" />
    </>
  );
}

/**
 * ✅ Focused function: Render hero header
 */
function renderHeroHeader(): JSX.Element {
  return (
    <motion.div variants={ANIMATION_CONFIG.item} className="mb-16">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
        Mikhail Ajaj
      </h1>

      <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto font-medium">
        Full-Stack Developer, Cloud Engineer & Technical Consultant
      </p>

      <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
        Specializing in scalable solutions across five technical domains. From
        concept to deployment, I deliver comprehensive technology solutions that
        drive business growth and digital transformation.
      </p>
    </motion.div>
  );
}

/**
 * ✅ Focused function: Render domain grid using data-driven approach
 */
function renderDomainGrid(
  domains: (typeof DOMAIN_CONFIG)[DomainId][],
): JSX.Element {
  return (
    <motion.div
      variants={ANIMATION_CONFIG.item}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
    >
      {domains.map((domain, index) => (
        <DomainCard key={domain.id} domain={domain} index={index} />
      ))}
    </motion.div>
  );
}

/**
 * ✅ Focused component: Domain card using configuration
 */
function DomainCard({
  domain,
  index,
}: {
  domain: (typeof DOMAIN_CONFIG)[DomainId];
  index: number;
}): JSX.Element {
  const IconComponent = domain.icon;

  return (
    <motion.div
      variants={ANIMATION_CONFIG.domainCard}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative"
    >
      <Link href={domain.route}>
        <div
          className={`
          relative p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300
          ${domain.color.bg} ${domain.color.border}
          hover:border-opacity-40 hover:bg-opacity-20
        `}
        >
          {/* Domain Icon */}
          <div
            className={`
            inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
            ${domain.color.bg} ${domain.color.border} border
          `}
          >
            <IconComponent className={`text-xl ${domain.color.text}`} />
          </div>

          {/* Domain Title */}
          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors">
            {domain.title}
          </h3>

          {/* Domain Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
            {domain.description}
          </p>

          {/* Domain Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">
              {domain.projects}
            </span>
            <FaArrowRight className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
          </div>

          {/* Hover Gradient Overlay */}
          <div
            className={`
            absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300
            bg-gradient-to-br ${domain.color.gradient}
          `}
          />
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * ✅ Focused function: Render portfolio stats using data-driven approach
 */
function renderPortfolioStats(): JSX.Element {
  return (
    <motion.div
      variants={ANIMATION_CONFIG.item}
      className="grid grid-cols-2 md:grid-cols-4 gap-8"
    >
      {PORTFOLIO_STATS.map((stat, index) => (
        <PortfolioStat key={stat.label} stat={stat} index={index} />
      ))}
    </motion.div>
  );
}

/**
 * ✅ Focused component: Portfolio stat using configuration
 */
function PortfolioStat({
  stat,
  index,
}: {
  stat: (typeof PORTFOLIO_STATS)[number];
  index: number;
}): JSX.Element {
  return (
    <motion.div variants={ANIMATION_CONFIG.item} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">
        {stat.value}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
    </motion.div>
  );
}

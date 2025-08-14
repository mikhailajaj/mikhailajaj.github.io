"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/base/Button";
import { Card } from "@/components/ui/base/Card";
import {
  FaPaintBrush,
  FaFigma,
  FaMobile,
  FaDesktop,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaUsers,
  FaEye,
  FaHeart,
} from "react-icons/fa";

const achievements = [
  { label: "Design Projects", value: "20+" },
  { label: "User Satisfaction", value: "4.8/5" },
  { label: "Conversion Increase", value: "65%+" },
  { label: "Design Awards", value: "3" },
];

const techStack = [
  {
    name: "Design Tools",
    icon: <FaFigma />,
    description: "Figma, Sketch, Adobe XD, Photoshop",
  },
  {
    name: "Prototyping",
    icon: <FaMobile />,
    description: "Principle, Framer, InVision",
  },
  {
    name: "User Research",
    icon: <FaUsers />,
    description: "Miro, Hotjar, Maze, UserTesting",
  },
  {
    name: "Development",
    icon: <FaDesktop />,
    description: "HTML/CSS, React, Design Systems",
  },
];

const highlights = [
  "User-centered design methodology",
  "Mobile-first responsive design",
  "Accessibility and inclusive design",
  "Design systems and component libraries",
  "User research and usability testing",
  "Conversion rate optimization",
  "Information architecture",
  "Interaction design and prototyping",
];

const designProcess = [
  {
    name: "Research",
    icon: <FaEye />,
    description: "User interviews, competitive analysis, personas",
  },
  {
    name: "Design",
    icon: <FaPaintBrush />,
    description: "Wireframes, prototypes, visual design",
  },
  {
    name: "Test",
    icon: <FaUsers />,
    description: "Usability testing, A/B testing, iteration",
  },
];

const awards = [
  {
    name: "UX Design Excellence Award",
    year: "2024",
    category: "Mobile Banking",
  },
  { name: "Best Healthcare UX", year: "2023", category: "Patient Portal" },
  {
    name: "Conversion Optimization Award",
    year: "2023",
    category: "E-commerce",
  },
];

export function UXUIHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-black/50" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                <FaPaintBrush className="text-white text-xl" />
              </div>
              <span className="text-purple-400 font-medium">UX/UI Design</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              User-Centered
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Design Solutions
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              I create intuitive, accessible, and beautiful digital experiences
              through user research, strategic design thinking, and data-driven
              optimization that delivers measurable business results.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-center space-x-2"
                >
                  <FaCheckCircle className="text-purple-400 text-sm flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{highlight}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#projects">
                <Button
                  size="lg"
                  variant="gradient"
                  className="w-full sm:w-auto"
                >
                  View Design Portfolio
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="https://dribbble.com/mikhailajaj" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border text-muted-foreground hover:bg-card"
                >
                  <FaEye className="mr-2" />
                  Dribbble Portfolio
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Stats & Process */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Achievement Stats */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Design Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.label} className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tech Stack */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Design Tools
              </h3>
              <div className="space-y-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-700 to-purple-800 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 text-lg">
                        {tech.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{tech.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {tech.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Design Process */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Design Process
              </h3>
              <div className="space-y-4">
                {designProcess.map((process, index) => (
                  <motion.div
                    key={process.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-700 to-purple-800 rounded-lg flex items-center justify-center mt-1">
                      <span className="text-purple-400 text-sm">
                        {process.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {process.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {process.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Awards */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Recognition
              </h3>
              <div className="space-y-3">
                {awards.map((award, index) => (
                  <motion.div
                    key={award.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <div>
                      <div className="text-white font-medium text-sm">
                        {award.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {award.category}
                      </div>
                    </div>
                    <span className="text-purple-400 text-xs font-medium">
                      {award.year}
                    </span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

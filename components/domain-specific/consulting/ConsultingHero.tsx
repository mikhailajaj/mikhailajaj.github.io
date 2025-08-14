"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/base/Button";
import { Card } from "@/components/ui/base/Card";
import {
  FaChartLine,
  FaUsers,
  FaCogs,
  FaRocket,
  FaArrowRight,
  FaLinkedin,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaHandshake,
  FaLightbulb,
  FaAward,
} from "react-icons/fa";

const achievements = [
  { label: "Consulting Projects", value: "30+" },
  { label: "Client Satisfaction", value: "98%" },
  { label: "Cost Savings", value: "$15M+" },
  { label: "Teams Transformed", value: "50+" },
];

const expertiseAreas = [
  {
    name: "Digital Transformation",
    icon: <FaRocket />,
    description: "End-to-end modernization strategies",
  },
  {
    name: "Agile Coaching",
    icon: <FaCogs />,
    description: "Scrum, Kanban, and process optimization",
  },
  {
    name: "Technical Strategy",
    icon: <FaChartLine />,
    description: "Architecture and technology roadmaps",
  },
  {
    name: "Team Building",
    icon: <FaUsers />,
    description: "Leadership development and scaling",
  },
];

const highlights = [
  "Digital transformation strategy and execution",
  "Agile and DevOps implementation",
  "Technical team building and mentoring",
  "Enterprise architecture consulting",
  "Process optimization and automation",
  "Change management and training",
  "Stakeholder alignment and communication",
  "Performance improvement initiatives",
];

const methodologies = [
  {
    name: "Agile/Scrum",
    icon: <FaCogs />,
    description: "Certified Scrum Master and Product Owner",
  },
  {
    name: "Lean Startup",
    icon: <FaLightbulb />,
    description: "MVP development and validation",
  },
  {
    name: "Design Thinking",
    icon: <FaUsers />,
    description: "Human-centered problem solving",
  },
];

const certifications = [
  {
    name: "Certified Scrum Master (CSM)",
    issuer: "Scrum Alliance",
    year: "2023",
  },
  {
    name: "AWS Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2024",
  },
  {
    name: "Project Management Professional (PMP)",
    issuer: "PMI",
    year: "2022",
  },
];

const clientTypes = [
  {
    type: "Fortune 500 Enterprises",
    description: "Large-scale digital transformation",
  },
  {
    type: "Fast-Growing Startups",
    description: "Technical strategy and team scaling",
  },
  {
    type: "Healthcare Organizations",
    description: "Compliance-focused agile adoption",
  },
  { type: "Financial Services", description: "Security-first modernization" },
];

export function ConsultingHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-black/50" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
              <span className="text-indigo-400 font-medium">
                Technical Consulting
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Strategic Technical
              <span className="block bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                Leadership
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              I help organizations transform their technical capabilities
              through strategic consulting, agile coaching, and hands-on
              leadership that delivers measurable business results and
              sustainable growth.
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
                  <FaCheckCircle className="text-indigo-400 text-sm flex-shrink-0" />
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
                  View Consulting Projects
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="https://linkedin.com/in/mikhailajaj" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border text-muted-foreground hover:bg-card"
                >
                  <FaLinkedin className="mr-2" />
                  LinkedIn Profile
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Expertise & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Achievement Stats */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Consulting Impact
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

            {/* Expertise Areas */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Core Expertise
              </h3>
              <div className="space-y-4">
                {expertiseAreas.map((area, index) => (
                  <motion.div
                    key={area.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-700 to-indigo-800 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-400 text-lg">
                        {area.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{area.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {area.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Methodologies */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Methodologies
              </h3>
              <div className="space-y-4">
                {methodologies.map((methodology, index) => (
                  <motion.div
                    key={methodology.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-700 to-indigo-800 rounded-lg flex items-center justify-center mt-1">
                      <span className="text-indigo-400 text-sm">
                        {methodology.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {methodology.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {methodology.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Client Types */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Client Experience
              </h3>
              <div className="space-y-3">
                {clientTypes.map((client, index) => (
                  <motion.div
                    key={client.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <div>
                      <div className="text-white font-medium text-sm">
                        {client.type}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {client.description}
                      </div>
                    </div>
                    <FaHandshake className="text-indigo-400" />
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

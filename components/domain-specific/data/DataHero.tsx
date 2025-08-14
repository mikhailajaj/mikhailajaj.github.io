"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/base/Button";
import { Card } from "@/components/ui/base/Card";
import {
  FaChartBar,
  FaPython,
  FaBrain,
  FaDatabase,
  FaArrowRight,
  FaGithub,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaRobot,
  FaChartLine,
  FaEye,
} from "react-icons/fa";

const achievements = [
  { label: "ML Models Deployed", value: "25+" },
  { label: "Data Accuracy", value: "95%+" },
  { label: "Cost Savings", value: "$8M+" },
  { label: "Prediction Accuracy", value: "92%" },
];

const techStack = [
  {
    name: "Python & R",
    icon: <FaPython />,
    description: "Advanced statistical analysis & ML",
  },
  {
    name: "Machine Learning",
    icon: <FaBrain />,
    description: "TensorFlow, Scikit-learn, PyTorch",
  },
  {
    name: "Data Visualization",
    icon: <FaChartBar />,
    description: "Plotly, Tableau, Power BI",
  },
  {
    name: "Big Data & Cloud",
    icon: <FaDatabase />,
    description: "Spark, Hadoop, AWS, Snowflake",
  },
];

const highlights = [
  "Predictive modeling and forecasting",
  "Machine learning and deep learning",
  "Business intelligence and reporting",
  "Data visualization and storytelling",
  "Statistical analysis and hypothesis testing",
  "Big data processing and analytics",
  "Real-time analytics and monitoring",
  "A/B testing and experimentation",
];

const certifications = [
  { name: "AWS Certified Machine Learning", level: "Specialty", year: "2024" },
  {
    name: "Google Cloud Professional Data Engineer",
    level: "Professional",
    year: "2023",
  },
  {
    name: "Microsoft Azure Data Scientist Associate",
    level: "Associate",
    year: "2023",
  },
];

const specializations = [
  {
    name: "Predictive Analytics",
    icon: <FaChartLine />,
    description: "Customer behavior, demand forecasting, risk modeling",
  },
  {
    name: "Machine Learning",
    icon: <FaRobot />,
    description: "Classification, regression, clustering, deep learning",
  },
  {
    name: "Business Intelligence",
    icon: <FaEye />,
    description: "KPI dashboards, executive reporting, data storytelling",
  },
];

export function DataHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 to-black/50" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                <FaChartBar className="text-white text-xl" />
              </div>
              <span className="text-green-400 font-medium">Data Analytics</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Data-Driven
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              I transform raw data into actionable business insights using
              machine learning, statistical analysis, and advanced visualization
              techniques to drive strategic decision-making and measurable
              business outcomes.
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
                  <FaCheckCircle className="text-green-400 text-sm flex-shrink-0" />
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
                  View Analytics Projects
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="https://github.com/mikhailajaj" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-border text-muted-foreground hover:bg-card"
                >
                  <FaGithub className="mr-2" />
                  Data Science Code
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Stats & Specializations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Achievement Stats */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Analytics Impact
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
                Core Technologies
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
                    <div className="w-10 h-10 bg-gradient-to-r from-green-700 to-green-800 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 text-lg">
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

            {/* Specializations */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Specializations
              </h3>
              <div className="space-y-4">
                {specializations.map((spec, index) => (
                  <motion.div
                    key={spec.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-700 to-green-800 rounded-lg flex items-center justify-center mt-1">
                      <span className="text-green-400 text-sm">
                        {spec.icon}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {spec.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {spec.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Quick Links */}
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Featured Work
              </h3>
              <div className="space-y-3">
                <Link
                  href="/case-studies/customer-behavior-analytics"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
                >
                  <span className="text-muted-foreground group-hover:text-white text-sm">
                    Customer Analytics Platform
                  </span>
                  <FaExternalLinkAlt className="text-muted-foreground group-hover:text-green-400" />
                </Link>
                <Link
                  href="#services"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors group"
                >
                  <span className="text-muted-foreground group-hover:text-white text-sm">
                    Analytics Services
                  </span>
                  <FaArrowRight className="text-muted-foreground group-hover:text-green-400" />
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

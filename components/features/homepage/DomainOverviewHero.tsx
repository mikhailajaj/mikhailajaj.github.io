"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";

const domains = [
  {
    id: "full-stack",
    name: "Full-Stack Development",
    description:
      "End-to-end web applications with React, Node.js, and modern databases",
    icon: <FaCode />,
    href: "/full-stack",
    color: "from-slate-600 to-slate-800",
    projects: "15+ Projects",
  },
  {
    id: "cloud",
    name: "Cloud Engineering",
    description:
      "AWS infrastructure, DevOps automation, and scalable cloud solutions",
    icon: <FaCloud />,
    href: "/cloud-engineering",
    color: "from-blue-600 to-blue-800",
    projects: "12+ Projects",
  },
  {
    id: "data",
    name: "Data Analytics",
    description:
      "Machine learning, business intelligence, and data visualization",
    icon: <FaChartBar />,
    href: "/data-analytics",
    color: "from-green-600 to-green-800",
    projects: "8+ Projects",
  },
  {
    id: "ux-ui",
    name: "UX/UI Design",
    description:
      "User experience design, prototyping, and design system creation",
    icon: <FaPalette />,
    href: "/ux-ui-design",
    color: "from-purple-600 to-purple-800",
    projects: "10+ Projects",
  },
  {
    id: "consulting",
    name: "Technical Consulting",
    description: "Strategic technology guidance and digital transformation",
    icon: <FaLightbulb />,
    href: "/technical-consulting",
    color: "from-orange-600 to-orange-800",
    projects: "20+ Clients",
  },
];

export function DomainOverviewHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Mikhail Ajaj
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto font-medium">
            Full-Stack Developer, Cloud Engineer & Technical Consultant
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Specializing in scalable solutions across five technical domains.
            From concept to deployment, I deliver comprehensive technology
            solutions that drive business growth and digital transformation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="gradient">
                Start a Project
                <FaArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/experience">
              <Button size="lg" variant="outline">
                View Experience
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Domain Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card
                variant="interactive"
                className="h-full bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20 group"
              >
                <Link href={domain.href} className="block h-full p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${domain.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <span className="text-white text-xl">{domain.icon}</span>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                    {domain.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                    {domain.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      {domain.projects}
                    </span>
                    <FaArrowRight className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { label: "Projects Completed", value: "50+" },
            { label: "Years Experience", value: "5+" },
            { label: "Technologies Mastered", value: "25+" },
            { label: "Client Satisfaction", value: "98%" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DomainConfig } from "@/lib/constants/domains";

interface Achievement {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DomainHeroProps {
  domain: DomainConfig;
  achievements: Achievement[];
  technologies: string[];
  featuredProjects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  className?: string;
}

export const DomainHero: React.FC<DomainHeroProps> = ({
  domain,
  achievements,
  technologies,
  featuredProjects = [],
  className
}) => {
  // Handle hydration for animations
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use domain color directly from domain config
  const domainColor = domain.color || '#3B82F6';
  
  // Create theme object with domain color
  const theme = {
    colors: {
      primary: domainColor,
      secondary: domainColor,
      accent: domainColor
    }
  };

  // Animation variants that work with SSR
  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      initial={isMounted ? "initial" : false}
      animate={isMounted ? "animate" : false}
      variants={sectionVariants}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-background to-muted",
        className
      )}
      style={{
        '--domain-primary': domainColor,
        '--domain-secondary': domainColor,
        '--domain-accent': domainColor,
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={isMounted ? { scale: 0.8, opacity: 0 } : false}
              animate={isMounted ? { scale: 1, opacity: 1 } : false}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              {domain.icon && <domain.icon className="w-16 h-16 mx-auto mb-4 text-[var(--domain-primary)]" />}
            </motion.div>
            
            <motion.h1
              initial={isMounted ? { y: 20, opacity: 0 } : false}
              animate={isMounted ? { y: 0, opacity: 1 } : false}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {domain.name}
            </motion.h1>
            
            <motion.p
              initial={isMounted ? { y: 20, opacity: 0 } : false}
              animate={isMounted ? { y: 0, opacity: 1 } : false}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              {domain.description}
            </motion.p>
          </div>

          {/* Achievement Metrics */}
          <motion.div
            initial={isMounted ? { y: 40, opacity: 0 } : false}
            animate={isMounted ? { y: 0, opacity: 1 } : false}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center">
                {achievement.icon && (
                  <div className="mb-3 text-[var(--domain-primary)]">
                    {achievement.icon}
                  </div>
                )}
                <div className="text-2xl md:text-3xl font-bold mb-2 text-[var(--domain-primary)]">
                  {achievement.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={isMounted ? { y: 40, opacity: 0 } : false}
            animate={isMounted ? { y: 0, opacity: 1 } : false}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">
              Technology Expertise
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-muted rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <motion.div
              initial={isMounted ? { y: 40, opacity: 0 } : false}
              animate={isMounted ? { y: 0, opacity: 1 } : false}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-center mb-8">
                Featured Projects
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.slice(0, 3).map((project, index) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-muted rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <Link href={project.url}>
                        <Button variant="outline" size="sm">
                          View Project
                        </Button>
                      </Link>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={isMounted ? { y: 40, opacity: 0 } : false}
            animate={isMounted ? { y: 0, opacity: 1 } : false}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/projects">
                <Button size="lg" className="bg-[var(--domain-primary)] hover:bg-[var(--domain-primary)]/90">
                  View All Projects
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Start a Project
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default DomainHero;

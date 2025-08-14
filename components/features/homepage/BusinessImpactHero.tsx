"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FaArrowRight,
  FaRocket,
  FaStar,
  FaUsers,
  FaTrophy,
} from "react-icons/fa";
import { getAllDomainThemes } from "@/lib/config/domainThemes";
import { DomainCard } from "@/components/ui/DomainCard";

const impactMetrics = [
  {
    id: "business-impact",
    label: "Business Impact",
    value: 30,
    suffix: "M+",
    prefix: "$",
    icon: <FaTrophy />,
    description: "Generated revenue",
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "client-satisfaction",
    label: "Client Satisfaction",
    value: 98,
    suffix: "%",
    prefix: "",
    icon: <FaStar />,
    description: "Satisfaction rate",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "projects-completed",
    label: "Projects Completed",
    value: 65,
    suffix: "+",
    prefix: "",
    icon: <FaRocket />,
    description: "Successful deliveries",
    color: "from-blue-400 to-purple-500",
  },
  {
    id: "clients-served",
    label: "Clients Served",
    value: 45,
    suffix: "+",
    prefix: "",
    icon: <FaUsers />,
    description: "Happy clients",
    color: "from-purple-400 to-pink-500",
  },
];

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  prefix = "",
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, isVisible]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className="font-bold">
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

export function EnhancedImpactHero() {
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
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-purple-50/5 to-pink-50/10 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-white/20 p-4 h-full">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center mb-2 mx-auto`}
                  >
                    <span className="text-white text-sm">{metric.icon}</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    <AnimatedCounter
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                      duration={2000 + index * 200}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.description}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mikhail Ajaj
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto font-medium"
          >
            Multi-Domain Technology Expert
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Delivering comprehensive solutions across five specialized domains.
            From concept to deployment, I create technology solutions that drive
            measurable business growth and digital transformation.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/contact">
              <Button size="lg" variant="gradient" className="group">
                Start Your $1M+ Project
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  <FaRocket />
                </span>
              </Button>
            </Link>
            <Link href="/experience">
              <Button size="lg" variant="outline" className="group">
                Explore My Expertise
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                  <FaArrowRight />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16"
        >
          {getAllDomainThemes().map((theme, index) => (
            <motion.div key={theme.id} variants={itemVariants}>
              <DomainCard theme={theme} index={index} size="md" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

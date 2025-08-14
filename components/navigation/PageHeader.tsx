"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundGradient?: string;
  children?: React.ReactNode;
  actions?: {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
  }[];
  stats?: {
    label: string;
    value: string | number;
  }[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  backgroundGradient = "from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800",
  children,
  actions = [],
  stats = [],
}) => {
  return (
    <section
      className={`relative py-16 md:py-20 bg-gradient-to-br ${backgroundGradient}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {subtitle}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground dark:text-white mb-6"
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-foreground/80 dark:text-muted-foreground max-w-3xl mx-auto mb-8"
            >
              {description}
            </motion.p>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              {actions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    action.variant === "secondary"
                      ? "bg-white dark:bg-card text-foreground dark:text-white border border-border dark:border-border hover:bg-muted/20 dark:hover:bg-card"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {action.label}
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </Link>
              ))}
            </motion.div>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 md:gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-foreground/80 dark:text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Custom children */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default PageHeader;

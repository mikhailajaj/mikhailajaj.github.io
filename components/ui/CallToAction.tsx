"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaArrowRight, FaEnvelope, FaPhone, FaCalendar } from 'react-icons/fa';

interface CallToActionProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  variant?: 'default' | 'gradient' | 'minimal';
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  className = ''
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'text-white';
      default:
        return 'text-gray-900 dark:text-white';
    }
  };

  const getDescriptionClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'text-white/90';
      default:
        return 'text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={`py-16 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-2xl p-8 md:p-12 text-center ${getVariantClasses()}`}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className={`text-3xl md:text-4xl font-bold mb-4 ${getTextClasses()}`}
          >
            {title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${getDescriptionClasses()}`}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary Action */}
            <Link
              href={primaryAction.href}
              className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                variant === 'gradient'
                  ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {primaryAction.icon && <span className="mr-2">{primaryAction.icon}</span>}
              {primaryAction.label}
              <FaArrowRight className="ml-2 w-4 h-4" />
            </Link>

            {/* Secondary Action */}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className={`inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  variant === 'gradient'
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {secondaryAction.icon && <span className="mr-2">{secondaryAction.icon}</span>}
                {secondaryAction.label}
              </Link>
            )}
          </motion.div>

          {/* Contact Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className={`text-sm mb-4 ${getDescriptionClasses()}`}>
              Prefer a different way to connect?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a
                href="mailto:mikhailajaj@gmail.com"
                className={`flex items-center hover:text-blue-400 transition-colors ${getDescriptionClasses()}`}
              >
                <FaEnvelope className="mr-2 w-4 h-4" />
                mikhailajaj@gmail.com
              </a>
              <a
                href="tel:+14164745749"
                className={`flex items-center hover:text-blue-400 transition-colors ${getDescriptionClasses()}`}
              >
                <FaPhone className="mr-2 w-4 h-4" />
                +1 (416) 474-5749
              </a>
              <Link
                href="/contact"
                className={`flex items-center hover:text-blue-400 transition-colors ${getDescriptionClasses()}`}
              >
                <FaCalendar className="mr-2 w-4 h-4" />
                Schedule a Call
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CallToAction;
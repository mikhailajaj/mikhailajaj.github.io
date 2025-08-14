"use client";

/**
 * Footer Component
 *
 * Comprehensive footer component for the Mikhail Ajaj Portfolio providing
 * navigation, contact information, and professional branding.
 *
 * @fileoverview Footer with domain expertise links, social media, and contact information
 */

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb,
} from "react-icons/fa";

/**
 * Domain expertise navigation links with icons
 * Represents the five core specialization areas
 */
const domainLinks = [
  { name: "Full-Stack Development", href: "/full-stack", icon: <FaCode /> },
  { name: "Cloud Engineering", href: "/cloud-engineering", icon: <FaCloud /> },
  { name: "Data Analytics", href: "/data-analytics", icon: <FaChartBar /> },
  { name: "UX/UI Design", href: "/ux-ui-design", icon: <FaPalette /> },
  {
    name: "Technical Consulting",
    href: "/technical-consulting",
    icon: <FaLightbulb />,
  },
];

/**
 * Quick navigation links for portfolio sections
 */
const quickLinks = [
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Education", href: "/education" },
  { name: "Achievements", href: "/achievements" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

/**
 * Social media and contact links with icons
 */
const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/mikhailajaj",
    icon: <FaGithub />,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/mikhailajaj",
    icon: <FaLinkedin />,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/mikhailajaj",
    icon: <FaTwitter />,
  },
  { name: "Email", href: "mailto:mikhail@example.com", icon: <FaEnvelope /> },
];

/**
 * Footer Component
 *
 * Comprehensive footer providing navigation, branding, and contact information
 * for the Mikhail Ajaj Portfolio. Features responsive design and smooth animations.
 *
 * @component
 * @example
 * ```tsx
 * <Footer />
 * ```
 *
 * Features:
 * - Responsive grid layout (1-4 columns based on screen size)
 * - Professional branding with logo and description
 * - Domain expertise navigation with icons
 * - Quick links to portfolio sections
 * - Social media links with hover animations
 * - Contact call-to-action
 * - Legal links (Privacy, Terms, Sitemap)
 * - Dynamic copyright year
 *
 * Layout Sections:
 * 1. Brand Section: Logo, description, social links
 * 2. Expertise Areas: Domain-specific navigation
 * 3. Quick Links: Portfolio section navigation
 * 4. Contact Info: Call-to-action and contact button
 *
 * @returns {JSX.Element} The complete footer component
 */
export function Footer() {
  return (
    <footer className="bg-background border-t border-border dark:bg-black dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <span className="text-foreground font-semibold text-lg">
                Mikhail Ajaj
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Full-Stack Developer, Cloud Engineer, and Technical Consultant
              specializing in scalable solutions and digital transformation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Expertise Areas */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Expertise Areas</h3>
            <ul className="space-y-2">
              {domainLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center space-x-2"
                  >
                    <span className="text-xs">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Ready to discuss your next project?</p>
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Start a Conversation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border dark:border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Mikhail Ajaj. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

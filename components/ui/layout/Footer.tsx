'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope,
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb
} from 'react-icons/fa';

const domainLinks = [
  { name: 'Full-Stack Development', href: '/full-stack', icon: <FaCode /> },
  { name: 'Cloud Engineering', href: '/cloud-engineering', icon: <FaCloud /> },
  { name: 'Data Analytics', href: '/data-analytics', icon: <FaChartBar /> },
  { name: 'UX/UI Design', href: '/ux-ui-design', icon: <FaPalette /> },
  { name: 'Technical Consulting', href: '/technical-consulting', icon: <FaLightbulb /> },
];

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Experience', href: '/experience' },
  { name: 'Education', href: '/education' },
  { name: 'Achievements', href: '/achievements' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/mikhailajaj', icon: <FaGithub /> },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/mikhailajaj', icon: <FaLinkedin /> },
  { name: 'Twitter', href: 'https://twitter.com/mikhailajaj', icon: <FaTwitter /> },
  { name: 'Email', href: 'mailto:mikhail@example.com', icon: <FaEnvelope /> },
];

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <span className="text-white font-semibold text-lg">Mikhail Ajaj</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Full-Stack Developer, Cloud Engineer, and Technical Consultant specializing in scalable solutions and digital transformation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
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
            <h3 className="text-white font-semibold mb-4">Expertise Areas</h3>
            <ul className="space-y-2">
              {domainLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2"
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
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-2 text-sm text-gray-400">
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
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Mikhail Ajaj. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
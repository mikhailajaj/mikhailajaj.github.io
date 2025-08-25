/**
 * MegaMenu Component
 * 
 * Provides a comprehensive navigation menu with multiple sections
 * and enhanced user experience.
 */

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb,
  FaRocket,
  FaGraduationCap,
  FaUsers,
  FaTools,
  FaBook,
} from "react-icons/fa";
// import { useNavigationThemeMigration } from "@/lib/theme/migration/MenuMigrationBridge"; // Removed during cleanup

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  icon: React.ReactNode;
  items: {
    title: string;
    href: string;
    description: string;
  }[];
}

const menuSections: MenuSection[] = [
  {
    title: "Services",
    icon: <FaRocket className="w-5 h-5" />,
    items: [
      {
        title: "Full-Stack Development",
        href: "/full-stack",
        description: "End-to-end web application development",
      },
      {
        title: "Cloud Engineering",
        href: "/cloud-engineering",
        description: "Scalable cloud architecture and deployment",
      },
      {
        title: "Data Analytics",
        href: "/data-analytics",
        description: "Data-driven insights and analytics solutions",
      },
      {
        title: "UX/UI Design",
        href: "/ux-ui-design",
        description: "User-centered design and interface development",
      },
    ],
  },
  {
    title: "Portfolio",
    icon: <FaCode className="w-5 h-5" />,
    items: [
      {
        title: "Projects",
        href: "/projects",
        description: "Featured development projects and case studies",
      },
      {
        title: "Experience",
        href: "/experience",
        description: "Professional experience and career journey",
      },
      {
        title: "Education",
        href: "/education",
        description: "Academic background and certifications",
      },
      {
        title: "Achievements",
        href: "/achievements",
        description: "Awards, recognitions, and milestones",
      },
    ],
  },
  {
    title: "Resources",
    icon: <FaBook className="w-5 h-5" />,
    items: [
      {
        title: "Blog",
        href: "/blog",
        description: "Technical articles and development insights",
      },
      {
        title: "Documentation",
        href: "/docs",
        description: "Technical documentation and guides",
      },
      {
        title: "Tools",
        href: "/tools",
        description: "Development tools and utilities",
      },
      {
        title: "Contact",
        href: "/contact",
        description: "Get in touch for collaboration",
      },
    ],
  },
];

/**
 * MegaMenu Component
 * 
 * Renders a comprehensive navigation menu with organized sections,
 * smooth animations, and responsive design.
 * 
 * @param isOpen - Whether the menu is currently open
 * @param onClose - Function to call when menu should be closed
 */
export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  // Use unified theme system for styling
  // const themeBridge = useNavigationThemeMigration(); // Removed during cleanup
  // const navBarStyles = themeBridge.navigationTheme.getNavBarStyles(); // Removed during cleanup
  const navBarStyles = {}; // Fallback to default styles
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 shadow-xl z-50"
            style={{
              backgroundColor: navBarStyles.backgroundColor,
              borderTopColor: navBarStyles.borderColor,
              color: navBarStyles.color,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {menuSections.map((section, index) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    {/* Section Header */}
                    <div className="flex items-center space-x-3 pb-2 border-b"
                         style={{ borderBottomColor: navBarStyles.borderColor }}>
                      <div style={{ color: navBarStyles['--nav-accent'] }}>
                        {section.icon}
                      </div>
                      <h3 className="font-semibold" style={{ color: navBarStyles.color }}>
                        {section.title}
                      </h3>
                    </div>

                    {/* Section Items */}
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className="block p-3 rounded-lg transition-colors group hover:opacity-80"
                          style={{
                            backgroundColor: 'transparent',
                            ':hover': {
                              backgroundColor: `${navBarStyles['--nav-accent']}10`,
                            }
                          }}
                        >
                          <div className="font-medium transition-colors group-hover:opacity-80"
                               style={{ 
                                 color: navBarStyles.color,
                               }}>
                            {item.title}
                          </div>
                          <div className="text-sm mt-1 opacity-70"
                               style={{ color: navBarStyles.color }}>
                            {item.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-8 pt-8 border-t text-center"
                   style={{ borderTopColor: navBarStyles.borderColor }}>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="inline-flex items-center px-6 py-3 rounded-lg transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: navBarStyles['--nav-accent'],
                    color: '#ffffff',
                  }}
                >
                  <FaUsers className="mr-2" />
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MegaMenu;
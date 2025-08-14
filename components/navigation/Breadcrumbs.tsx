"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");

    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Home", href: "/", icon: <FaHome className="w-4 h-4" /> },
    ];

    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Format segment for display
      let label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Special cases for better labels
      const labelMap: Record<string, string> = {
        "full-stack": "Full-Stack Development",
        "ux-ui": "UX/UI Design",
        blog: "Technical Blog",
        services: "Services",
        projects: "Projects",
        about: "About",
        contact: "Contact",
        cloud: "Cloud Architecture",
        data: "Data Analytics",
        consulting: "Technical Consulting",
      };

      if (labelMap[segment]) {
        label = labelMap[segment];
      }

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === "/" || breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-muted/20 dark:bg-card/50 border-b border-border dark:border-border ${className}`}
      aria-label="Breadcrumb"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <FaChevronRight className="w-3 h-3 text-muted-foreground dark:text-foreground/80 mx-2" />
              )}

              {index === breadcrumbItems.length - 1 ? (
                // Current page (not clickable)
                <span className="flex items-center space-x-2 text-foreground dark:text-white font-medium">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              ) : (
                // Clickable breadcrumb
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 text-foreground/80 dark:text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </motion.nav>
  );
};

export default Breadcrumbs;

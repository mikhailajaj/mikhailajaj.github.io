/**
 * Data-Driven Configuration
 * Following "The Clean Code Cookbook" principle: "Don't Repeat Decisions — Let the Code Decide"
 */

import {
  FaCode,
  FaCloud,
  FaDatabase,
  FaPalette,
  FaUsers,
  FaReact,
  FaNodeJs,
  FaAws,
  FaPython,
  FaDocker,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiFigma,
} from "react-icons/si";

// ✅ Principle 3: Don't Repeat Decisions — Let the Code Decide

/**
 * Domain Configuration - Replaces conditional logic
 */
export const DOMAIN_CONFIG = {
  "full-stack": {
    id: "full-stack",
    title: "Full-Stack Development",
    shortTitle: "Full-Stack",
    description:
      "End-to-end web applications with modern frameworks and scalable architectures",
    icon: FaCode,
    color: {
      primary: "blue",
      secondary: "indigo",
      gradient: "from-blue-500 to-indigo-600",
      text: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    route: "/full-stack",
    projects: "12+ Projects",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    stats: {
      experience: "5+ Years",
      projects: 12,
      clients: 8,
      satisfaction: 98,
    },
    featured: true,
    order: 1,
  },
  cloud: {
    id: "cloud",
    title: "Cloud Engineering",
    shortTitle: "Cloud",
    description:
      "Scalable cloud infrastructure, DevOps automation, and serverless architectures",
    icon: FaCloud,
    color: {
      primary: "purple",
      secondary: "violet",
      gradient: "from-purple-500 to-violet-600",
      text: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    route: "/cloud-engineering",
    projects: "8+ Projects",
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
    stats: {
      experience: "3+ Years",
      projects: 8,
      clients: 6,
      satisfaction: 96,
    },
    featured: true,
    order: 2,
  },
  data: {
    id: "data",
    title: "Data Analytics",
    shortTitle: "Data",
    description:
      "Data pipelines, machine learning insights, and business intelligence solutions",
    icon: FaDatabase,
    color: {
      primary: "green",
      secondary: "emerald",
      gradient: "from-green-500 to-emerald-600",
      text: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    route: "/data-analytics",
    projects: "6+ Projects",
    technologies: ["Python", "TensorFlow", "PostgreSQL", "D3.js", "Pandas"],
    stats: {
      experience: "3+ Years",
      projects: 6,
      clients: 4,
      satisfaction: 94,
    },
    featured: true,
    order: 3,
  },
  "ux-ui": {
    id: "ux-ui",
    title: "UX/UI Design",
    shortTitle: "Design",
    description:
      "User-centered design, design systems, and intuitive digital experiences",
    icon: FaPalette,
    color: {
      primary: "pink",
      secondary: "rose",
      gradient: "from-pink-500 to-rose-600",
      text: "text-pink-400",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
    },
    route: "/ux-ui-design",
    projects: "10+ Projects",
    technologies: ["Figma", "Adobe XD", "Sketch", "Principle", "InVision"],
    stats: {
      experience: "4+ Years",
      projects: 10,
      clients: 7,
      satisfaction: 97,
    },
    featured: true,
    order: 4,
  },
  consulting: {
    id: "consulting",
    title: "Technical Consulting",
    shortTitle: "Consulting",
    description:
      "Strategic technology guidance, architecture reviews, and digital transformation",
    icon: FaUsers,
    color: {
      primary: "orange",
      secondary: "amber",
      gradient: "from-orange-500 to-amber-600",
      text: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
    },
    route: "/technical-consulting",
    projects: "15+ Projects",
    technologies: [
      "Strategy",
      "Architecture",
      "Leadership",
      "Process",
      "Innovation",
    ],
    stats: {
      experience: "6+ Years",
      projects: 15,
      clients: 12,
      satisfaction: 99,
    },
    featured: true,
    order: 5,
  },
} as const;

/**
 * Utility functions for data-driven logic
 */

// ✅ Get domain configuration by ID
export function getDomainConfig(domainId: string) {
  return DOMAIN_CONFIG[domainId as keyof typeof DOMAIN_CONFIG];
}

// ✅ Get all featured domains
export function getFeaturedDomains() {
  return Object.values(DOMAIN_CONFIG).filter((domain) => domain.featured);
}

// ✅ Get domains sorted by order
export function getDomainsByOrder() {
  return Object.values(DOMAIN_CONFIG).sort((a, b) => a.order - b.order);
}

// ✅ Type exports for TypeScript
export type DomainId = keyof typeof DOMAIN_CONFIG;

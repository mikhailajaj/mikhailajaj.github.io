/**
 * Domain Theme Configuration System
 *
 * Centralized configuration for domain-specific visual themes, colors, and patterns
 * to create clear visual differentiation between the five specialized domains.
 */

import {
  FaCode,
  FaCloud,
  FaChartBar,
  FaPalette,
  FaLightbulb,
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaPython,
  FaDatabase,
  FaFigma,
  FaSketch,
  FaLaptopCode,
  FaRocket,
} from "react-icons/fa";
import {
  SiTypescript,
  SiNextdotjs,
  SiKubernetes,
  SiTensorflow,
  SiTableau,
  SiAdobexd,
} from "react-icons/si";

export interface DomainTheme {
  id: string;
  name: string;
  description: string;
  shortDescription: string;

  // Visual Identity
  primaryColor: string;
  secondaryColor: string;
  gradientColors: [string, string];
  accentColor: string;

  // Icons and Symbols
  primaryIcon: React.ComponentType<any>;
  secondaryIcons: React.ComponentType<any>[];

  // Visual Patterns
  patternType: "grid" | "network" | "flow" | "organic" | "geometric";
  backgroundPattern: string;

  // Animation Properties
  animationType: "slide" | "fade" | "scale" | "rotate" | "bounce";
  hoverEffect: "lift" | "glow" | "rotate" | "scale" | "tilt";

  // Content
  tagline: string;
  expertise: string[];
  keyMetrics: {
    label: string;
    value: string;
    description: string;
  }[];

  // Navigation
  href: string;
  category: string;
}

export const domainThemes: Record<string, DomainTheme> = {
  "full-stack": {
    id: "full-stack",
    name: "Full-Stack Development",
    description:
      "End-to-end web applications with React, Node.js, and modern databases",
    shortDescription: "Complete web solutions from frontend to backend",

    // Blue theme - representing code and technology
    primaryColor: "#3B82F6", // blue-500
    secondaryColor: "#06B6D4", // cyan-500
    gradientColors: ["#3B82F6", "#06B6D4"], // blue to cyan
    accentColor: "#1E40AF", // blue-700

    primaryIcon: FaCode,
    secondaryIcons: [FaReact, FaNodeJs, SiTypescript, SiNextdotjs],

    patternType: "grid",
    backgroundPattern:
      "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.05) 10px, rgba(59, 130, 246, 0.05) 20px)",

    animationType: "slide",
    hoverEffect: "lift",

    tagline: "Building the Future, One Line at a Time",
    expertise: [
      "React & Next.js",
      "Node.js & Express",
      "TypeScript",
      "Database Design",
      "API Development",
    ],
    keyMetrics: [
      {
        label: "Projects",
        value: "15+",
        description: "Full-stack applications",
      },
      { label: "Performance", value: "98%", description: "Lighthouse scores" },
      {
        label: "Uptime",
        value: "99.9%",
        description: "Application reliability",
      },
    ],

    href: "/full-stack",
    category: "Development",
  },

  cloud: {
    id: "cloud",
    name: "Cloud Engineering",
    description:
      "AWS infrastructure, DevOps automation, and scalable cloud solutions",
    shortDescription: "Scalable cloud infrastructure and DevOps automation",

    // Cyan theme - representing cloud and sky
    primaryColor: "#06B6D4", // cyan-500
    secondaryColor: "#3B82F6", // blue-500
    gradientColors: ["#06B6D4", "#0EA5E9"], // cyan to sky
    accentColor: "#0891B2", // cyan-600

    primaryIcon: FaCloud,
    secondaryIcons: [FaAws, FaDocker, SiKubernetes, FaRocket],

    patternType: "network",
    backgroundPattern:
      "radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)",

    animationType: "fade",
    hoverEffect: "glow",

    tagline: "Scaling Dreams to Cloud Reality",
    expertise: [
      "AWS Architecture",
      "DevOps & CI/CD",
      "Kubernetes",
      "Infrastructure as Code",
      "Monitoring & Logging",
    ],
    keyMetrics: [
      { label: "Deployments", value: "12+", description: "Cloud projects" },
      { label: "Cost Savings", value: "40%", description: "Average reduction" },
      { label: "Scalability", value: "10x", description: "Traffic handling" },
    ],

    href: "/cloud-engineering",
    category: "Infrastructure",
  },

  data: {
    id: "data",
    name: "Data Analytics",
    description:
      "Machine learning, business intelligence, and data visualization",
    shortDescription: "Transforming data into actionable business insights",

    // Purple theme - representing intelligence and analysis
    primaryColor: "#8B5CF6", // violet-500
    secondaryColor: "#EC4899", // pink-500
    gradientColors: ["#8B5CF6", "#EC4899"], // violet to pink
    accentColor: "#7C3AED", // violet-600

    primaryIcon: FaChartBar,
    secondaryIcons: [FaPython, FaDatabase, SiTensorflow, SiTableau],

    patternType: "flow",
    backgroundPattern:
      "linear-gradient(45deg, rgba(139, 92, 246, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(139, 92, 246, 0.1) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(236, 72, 153, 0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(236, 72, 153, 0.05) 75%)",

    animationType: "scale",
    hoverEffect: "rotate",

    tagline: "Turning Data into Strategic Advantage",
    expertise: [
      "Machine Learning",
      "Data Visualization",
      "Business Intelligence",
      "Predictive Analytics",
      "Big Data Processing",
    ],
    keyMetrics: [
      { label: "Models", value: "8+", description: "ML implementations" },
      {
        label: "Accuracy",
        value: "94%",
        description: "Average model performance",
      },
      {
        label: "Insights",
        value: "100+",
        description: "Business recommendations",
      },
    ],

    href: "/data-analytics",
    category: "Analytics",
  },

  "ux-ui": {
    id: "ux-ui",
    name: "UX/UI Design",
    description:
      "User experience design, prototyping, and design system creation",
    shortDescription: "Crafting intuitive and beautiful user experiences",

    // Pink theme - representing creativity and design
    primaryColor: "#EC4899", // pink-500
    secondaryColor: "#F97316", // orange-500
    gradientColors: ["#EC4899", "#F97316"], // pink to orange
    accentColor: "#DB2777", // pink-600

    primaryIcon: FaPalette,
    secondaryIcons: [FaFigma, FaSketch, SiAdobexd, FaLaptopCode],

    patternType: "organic",
    backgroundPattern:
      "radial-gradient(ellipse at top left, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(249, 115, 22, 0.05) 0%, transparent 50%)",

    animationType: "bounce",
    hoverEffect: "tilt",

    tagline: "Where Function Meets Beautiful Form",
    expertise: [
      "User Research",
      "Wireframing & Prototyping",
      "Design Systems",
      "Usability Testing",
      "Interaction Design",
    ],
    keyMetrics: [
      { label: "Designs", value: "10+", description: "UI/UX projects" },
      {
        label: "User Satisfaction",
        value: "96%",
        description: "Average rating",
      },
      { label: "Conversion", value: "35%", description: "Average improvement" },
    ],

    href: "/ux-ui-design",
    category: "Design",
  },

  consulting: {
    id: "consulting",
    name: "Technical Consulting",
    description: "Strategic technology guidance and digital transformation",
    shortDescription: "Strategic technology leadership and transformation",

    // Orange theme - representing energy and transformation
    primaryColor: "#F97316", // orange-500
    secondaryColor: "#EF4444", // red-500
    gradientColors: ["#F97316", "#EF4444"], // orange to red
    accentColor: "#EA580C", // orange-600

    primaryIcon: FaLightbulb,
    secondaryIcons: [FaRocket, FaLaptopCode, FaDatabase, FaCloud],

    patternType: "geometric",
    backgroundPattern:
      "repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(249, 115, 22, 0.05) 60deg, transparent 120deg)",

    animationType: "rotate",
    hoverEffect: "scale",

    tagline: "Transforming Vision into Digital Reality",
    expertise: [
      "Technology Strategy",
      "Digital Transformation",
      "Team Leadership",
      "Architecture Review",
      "Process Optimization",
    ],
    keyMetrics: [
      { label: "Clients", value: "20+", description: "Successful engagements" },
      { label: "ROI", value: "300%", description: "Average improvement" },
      {
        label: "Efficiency",
        value: "50%",
        description: "Process optimization",
      },
    ],

    href: "/technical-consulting",
    category: "Strategy",
  },
};

// Helper functions for theme usage
export const getDomainTheme = (domainId: string): DomainTheme | null => {
  return domainThemes[domainId] || null;
};

export const getAllDomainThemes = (): DomainTheme[] => {
  return Object.values(domainThemes);
};

export const getDomainsByCategory = (category: string): DomainTheme[] => {
  return Object.values(domainThemes).filter(
    (theme) => theme.category === category,
  );
};

// CSS custom properties generator for dynamic theming
export const generateThemeCSS = (theme: DomainTheme): string => {
  return `
    --domain-primary: ${theme.primaryColor};
    --domain-secondary: ${theme.secondaryColor};
    --domain-accent: ${theme.accentColor};
    --domain-gradient: linear-gradient(135deg, ${theme.gradientColors[0]}, ${theme.gradientColors[1]});
    --domain-pattern: ${theme.backgroundPattern};
  `;
};

// Enhanced animation variants with domain-specific characteristics
export const getAnimationVariants = (theme: DomainTheme) => {
  const baseVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  switch (theme.animationType) {
    case "slide":
      return {
        ...baseVariants,
        hidden: { opacity: 0, x: -30, rotateY: -15 },
        visible: {
          opacity: 1,
          x: 0,
          rotateY: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      };
    case "scale":
      return {
        ...baseVariants,
        hidden: { opacity: 0, scale: 0.7, rotate: -5 },
        visible: {
          opacity: 1,
          scale: 1,
          rotate: 0,
          transition: {
            duration: 0.5,
            ease: "backOut",
            scale: { type: "spring", stiffness: 300, damping: 20 },
          },
        },
      };
    case "rotate":
      return {
        ...baseVariants,
        hidden: { opacity: 0, rotate: -20, scale: 0.8 },
        visible: {
          opacity: 1,
          rotate: 0,
          scale: 1,
          transition: {
            duration: 0.7,
            ease: "easeOut",
            rotate: { type: "spring", stiffness: 200 },
          },
        },
      };
    case "bounce":
      return {
        ...baseVariants,
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            bounce: 0.6,
            duration: 0.8,
            staggerChildren: 0.1,
          },
        },
      };
    default:
      return {
        ...baseVariants,
        transition: { duration: 0.5, ease: "easeOut" },
      };
  }
};

// Enhanced hover effect variants with domain-specific micro-interactions
export const getHoverVariants = (theme: DomainTheme) => {
  const baseTransition = { duration: 0.3, ease: "easeOut" };

  switch (theme.hoverEffect) {
    case "lift":
      return {
        y: -12,
        scale: 1.03,
        rotateX: 5,
        boxShadow: `0 20px 40px ${theme.primaryColor}20, 0 0 0 1px ${theme.primaryColor}30`,
        transition: {
          ...baseTransition,
          type: "spring",
          stiffness: 400,
          damping: 25,
        },
      };
    case "glow":
      return {
        scale: 1.02,
        boxShadow: `
          0 0 30px ${theme.primaryColor}60,
          0 0 60px ${theme.primaryColor}30,
          0 10px 30px ${theme.primaryColor}20,
          inset 0 1px 0 ${theme.primaryColor}40
        `,
        borderColor: theme.primaryColor,
        transition: { ...baseTransition, boxShadow: { duration: 0.4 } },
      };
    case "rotate":
      return {
        rotate: 8,
        scale: 1.06,
        rotateY: 15,
        boxShadow: `0 15px 35px ${theme.primaryColor}25`,
        transition: {
          ...baseTransition,
          rotate: { type: "spring", stiffness: 300, damping: 20 },
        },
      };
    case "scale":
      return {
        scale: 1.1,
        rotateZ: 2,
        boxShadow: `0 25px 50px ${theme.primaryColor}30`,
        transition: {
          ...baseTransition,
          scale: { type: "spring", stiffness: 400, damping: 15 },
        },
      };
    case "tilt":
      return {
        rotateY: 15,
        rotateX: 5,
        scale: 1.03,
        boxShadow: `
          0 20px 40px ${theme.primaryColor}25,
          0 0 0 1px ${theme.primaryColor}20
        `,
        transition: {
          ...baseTransition,
          rotateY: { type: "spring", stiffness: 200, damping: 20 },
        },
      };
    default:
      return {
        scale: 1.05,
        y: -4,
        boxShadow: `0 10px 25px ${theme.primaryColor}20`,
        transition: baseTransition,
      };
  }
};

// Pattern-specific visual effects
export const getPatternEffects = (theme: DomainTheme) => {
  switch (theme.patternType) {
    case "grid":
      return {
        backgroundImage: `
          ${theme.backgroundPattern},
          linear-gradient(90deg, ${theme.primaryColor}05 1px, transparent 1px),
          linear-gradient(${theme.primaryColor}05 1px, transparent 1px)
        `,
        backgroundSize: "auto, 20px 20px, 20px 20px",
      };
    case "network":
      return {
        backgroundImage: `
          ${theme.backgroundPattern},
          radial-gradient(circle at 20% 80%, ${theme.primaryColor}10 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, ${theme.secondaryColor}08 0%, transparent 50%)
        `,
      };
    case "flow":
      return {
        backgroundImage: `
          ${theme.backgroundPattern},
          linear-gradient(45deg, ${theme.primaryColor}08 0%, transparent 25%, ${theme.secondaryColor}05 50%, transparent 75%)
        `,
      };
    case "organic":
      return {
        backgroundImage: `
          ${theme.backgroundPattern},
          radial-gradient(ellipse 200% 100% at 50% 0%, ${theme.primaryColor}08 0%, transparent 50%),
          radial-gradient(ellipse 200% 100% at 50% 100%, ${theme.secondaryColor}05 0%, transparent 50%)
        `,
      };
    case "geometric":
      return {
        backgroundImage: `
          ${theme.backgroundPattern},
          conic-gradient(from 0deg at 50% 50%, ${theme.primaryColor}10 0deg, transparent 60deg, ${theme.secondaryColor}08 120deg, transparent 180deg)
        `,
      };
    default:
      return {
        backgroundImage: theme.backgroundPattern,
      };
  }
};

// Micro-interaction variants for different elements
export const getMicroInteractionVariants = (theme: DomainTheme) => {
  return {
    icon: {
      hover: {
        scale: 1.15,
        rotate: theme.animationType === "rotate" ? 15 : 5,
        filter: `drop-shadow(0 0 10px ${theme.primaryColor}60)`,
        transition: { type: "spring", stiffness: 400, damping: 15 },
      },
      tap: { scale: 0.95 },
    },
    secondaryIcon: {
      hover: {
        scale: 1.2,
        backgroundColor: `${theme.primaryColor}20`,
        transition: { duration: 0.2 },
      },
    },
    title: {
      hover: {
        color: theme.primaryColor,
        textShadow: `0 0 8px ${theme.primaryColor}40`,
        transition: { duration: 0.2 },
      },
    },
    arrow: {
      hover: {
        x: 8,
        scale: 1.1,
        color: theme.primaryColor,
        transition: { type: "spring", stiffness: 400, damping: 20 },
      },
    },
    tag: {
      hover: {
        backgroundColor: `${theme.primaryColor}20`,
        borderColor: `${theme.primaryColor}60`,
        color: theme.primaryColor,
        scale: 1.05,
        transition: { duration: 0.2 },
      },
    },
  };
};

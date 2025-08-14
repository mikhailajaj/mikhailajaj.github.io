// Unified Navigation Data - Philosophical Approach
// Eliminates duplication between service and domain pages

import { 
  FaHome, FaUser, FaCode, FaCloud, FaChartBar, 
  FaPalette, FaLightbulb, FaGraduationCap, FaTrophy,
  FaBlog, FaEnvelope, FaTools
} from "react-icons/fa";

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType;
  description?: string;
  children?: NavigationItem[];
}

// Main navigation - unified approach
export const mainNavigationItems: NavigationItem[] = [
  {
    name: "Home",
    href: "/",
    icon: FaHome,
    description: "Portfolio homepage"
  },
  {
    name: "About",
    href: "/about", 
    icon: FaUser,
    description: "About Mikhail Ajaj"
  },
  {
    name: "Domains",
    href: "/domains",
    icon: FaCode,
    description: "Technical expertise domains",
    children: [
      {
        name: "Full-Stack Development",
        href: "/full-stack",
        icon: FaCode,
        description: "React, Next.js, Node.js expertise"
      },
      {
        name: "Cloud Engineering", 
        href: "/cloud-engineering",
        icon: FaCloud,
        description: "AWS, DevOps, Infrastructure"
      },
      {
        name: "Data Analytics",
        href: "/data-analytics", 
        icon: FaChartBar,
        description: "Machine Learning, BI, Analytics"
      },
      {
        name: "UX/UI Design",
        href: "/ux-ui-design",
        icon: FaPalette,
        description: "User Experience & Interface Design"
      },
      {
        name: "Technical Consulting",
        href: "/technical-consulting",
        icon: FaLightbulb,
        description: "Strategy, Architecture, Leadership"
      }
    ]
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FaTools,
    description: "Portfolio projects and case studies"
  },
  {
    name: "Experience",
    href: "/experience",
    icon: FaTrophy,
    description: "Professional experience"
  },
  {
    name: "Blog",
    href: "/blog",
    icon: FaBlog,
    description: "Technical articles and insights"
  },
  {
    name: "Contact",
    href: "/contact",
    icon: FaEnvelope,
    description: "Get in touch"
  }
];

// Mobile navigation - simplified
export const mobileNavigationItems: NavigationItem[] = [
  { name: "Home", href: "/", icon: FaHome },
  { name: "Domains", href: "/domains", icon: FaCode },
  { name: "Projects", href: "/projects", icon: FaTools },
  { name: "Contact", href: "/contact", icon: FaEnvelope }
];

// Domain icons mapping
export const domainIcons = {
  'full-stack': FaCode,
  'cloud-engineering': FaCloud,
  'data-analytics': FaChartBar,
  'ux-ui-design': FaPalette,
  'technical-consulting': FaLightbulb
};

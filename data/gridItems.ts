import {
  FaReact,
  FaPython,
  FaLaptopCode,
  FaDatabase,
  FaChartBar,
  FaRegChartBar,
  FaRProject,
  FaPencilRuler,
  FaUserFriends,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaNodeJs,
  FaGitAlt,
  FaCloud,
  FaServer,
  FaProjectDiagram,
  FaCheckSquare,
  FaRobot,
  FaMicrochip,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";

// Individual imports to avoid Next.js barrel optimization conflicts
import { SiTensorflow } from "react-icons/si";
import { SiAmazonwebservices } from "react-icons/si";
import { SiTableau } from "react-icons/si";
import { SiMysql } from "react-icons/si";
import { SiApachekafka } from "react-icons/si";
import { SiJupyter } from "react-icons/si";
import { SiFigma } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { SiDjango } from "react-icons/si";
import { SiMongodb } from "react-icons/si";
import { SiGraphql } from "react-icons/si";
import { SiDocker } from "react-icons/si";
import { SiNextdotjs } from "react-icons/si";
import { SiSwift } from "react-icons/si";
import { SiKotlin } from "react-icons/si";
import { SiDotnet } from "react-icons/si";
import { SiKubernetes } from "react-icons/si";
import { SiTerraform } from "react-icons/si";
import { SiCloudflare } from "react-icons/si";
import { SiCodeclimate } from "react-icons/si";
import { SiSonarqube } from "react-icons/si";
import { SiGit } from "react-icons/si";
import { SiNvidia } from "react-icons/si";
import { SiArduino } from "react-icons/si";
import { SiRaspberrypi } from "react-icons/si";

import {
  MdComputer,
  MdQueryStats,
  MdTouchApp,
  MdOutlineDesignServices,
  MdLocationOn,
} from "react-icons/md";

import { DiCode, DiMysql, DiJava } from "react-icons/di";

import { AiOutlineMobile, AiOutlineMail } from "react-icons/ai";

import {
  BiAnalyse,
  BiPalette,
  BiAccessibility,
  BiCodeBlock,
} from "react-icons/bi";

import Contact from "@/components/ui/Contact";

export const gridItems = [
  {
    id: 1,
    title: "Foundations of Computer Science",
    description:
      "Dive into the origins and core principles of computer science that have paved the way for modern technology and innovation.",
    image: {
      src: "/G2.png",
      alt: "Computer Science Foundations Image",
    },
    // Focused more on core CS concepts
    icons: [
      DiCode, // Represents programming fundamentals
      FaLaptopCode, // General computing
      BiCodeBlock, // Algorithm representation
      MdComputer, // Hardware aspects
      FaProjectDiagram, // Data structures
      FaGitAlt, // Version control - fundamental modern CS skill
    ],
    className: "",
  },
  {
    id: 2,
    title: "Data Analytics and Business Intelligence",
    description:
      "Explore how data is transforming decision-making in businesses and discover the powerful tools and techniques used to derive insights from data.",
    image: {
      src: "/G1.png",
      alt: "Data Analytics Image",
    },
    // Reorganized to show progression: data storage → analysis → visualization
    icons: [
      FaDatabase, // Data storage
      DiMysql, // SQL databases
      SiMysql, // Enterprise databases
      SiApachekafka, // Data streaming
      MdQueryStats, // Data analysis
      BiAnalyse, // Advanced analytics
      FaChartBar, // Data visualization
      SiTableau, // BI tools
      FaPython, // Data analysis language
      FaRProject, // Statistical computing
      SiJupyter, // Data science notebooks
    ],
    className: "",
  },
  {
    id: 3,
    title: "UI/UX and Human-Computer Interaction (HCI)",
    description:
      "Discover the impact of design on user experiences and the essential principles of creating intuitive, user-friendly interfaces.",
    image: {
      src: "/G3.png",
      alt: "UI/UX Design Image",
    },
    // Reorganized to show design process flow
    icons: [
      MdOutlineDesignServices, // Design services
      FaPencilRuler, // Design fundamentals
      BiPalette, // Visual design
      SiFigma, // Design tools
      FaUserFriends, // User research
      BiAccessibility, // Accessibility
      AiOutlineMobile, // Mobile design
      MdTouchApp, // Interaction design
    ],
    className: "",
  },
  {
    id: 4,
    title: "Software and Web Development",
    description:
      "Experience the thrill of building applications from scratch, bringing ideas to life through coding in web and software development.",
    image: {
      src: "/G10.png",
      alt: "Software Development Image",
    },
    // Grouped by technology domains
    icons: [
      // Frontend
      FaHtml5,
      FaCss3Alt,
      FaJs,
      FaReact,
      SiTypescript,
      SiNextdotjs,
      // Backend
      FaNodeJs,
      SiDjango,
      DiJava,
      SiDotnet,
      // Mobile
      SiSwift,
      SiKotlin,
      // Database
      SiMongodb,
      // Tools & Infrastructure
      SiDocker,
      FaGitAlt,
      // API
      SiGraphql,
    ],
    className: "md:col-span-2",
  },
  {
    id: 5,
    title: "Cloud Computing (AWS & Azure)",
    description:
      "Understand the fundamentals of cloud computing, including deployment, management, and scalability on platforms like AWS and Azure.",
    image: {
      src: "/G6.png",
      alt: "Cloud Computing Image",
    },
    // Organized by cloud concepts and providers
    icons: [
      FaCloud, // Cloud concept
      SiAmazonwebservices, // AWS
      FaServer, // Infrastructure
      SiDocker, // Containerization
      SiKubernetes, // Container orchestration
      SiTerraform, // Infrastructure as code
      SiCloudflare, // Cloud security/CDN
    ],
    className: "",
  },
  {
    id: 6,
    title: "Software Design Patterns and Best Practices",
    description:
      "Learn the importance of effective software design patterns that enhance code readability, reusability, and maintainability",
    image: {
      src: "/G5.png",
      alt: "Software Design Image",
    },
    // Focused on software architecture and quality
    icons: [
      FaProjectDiagram, // Architecture
      BiCodeBlock, // Design patterns
      SiCodeclimate, // Code quality
      SiSonarqube, // Code analysis
      SiGit, // Version control
      FaCheckSquare, // Testing
    ],
    className: "md:col-span-1",
  },
  {
    id: 7,
    title: "Exploring Emerging Technologies",
    description:
      "Embark on a journey through emerging fields like artificial intelligence, machine learning, and the Internet of Things that are shaping the future.",
    image: {
      src: "/G9.png",
      alt: "Emerging Tech Image",
    },
    // Grouped by emerging tech domains
    icons: [
      FaRobot, // AI/Robotics
      SiTensorflow, // Machine Learning
      FaMicrochip, // Hardware
      SiNvidia, // GPU/AI Hardware
      SiArduino, // IoT
      SiRaspberrypi, // Edge Computing
    ],
    className: "md:col-span-1",
  },
  {
    id: 8,
    title: "Contact",
    description: Contact,
    className: "md:col-span-1",
    image: {
      src: "/contact.svg",
      alt: "Emerging Tech Image",
      className: "w-full h-full object-cover",
    },
    // Organized by contact method type
    icons: [
      AiOutlineMail, // Email (primary)
      FaPhone, // Phone
      FaLinkedin, // Professional network
      FaGithub, // Code portfolio
      FaTwitter, // Social media
      MdLocationOn, // Location
    ],
  },
];

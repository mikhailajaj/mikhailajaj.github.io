import { Project, Technology } from "@/data/schemas/project";

// Full-Stack Technologies
const technologies: Record<string, Technology> = {
  // Frontend
  react: {
    name: "React",
    category: "frontend",
    proficiency: "expert",
    icon: "⚛️",
  },
  nextjs: {
    name: "Next.js",
    category: "frontend",
    proficiency: "expert",
    icon: "▲",
  },
  typescript: {
    name: "TypeScript",
    category: "frontend",
    proficiency: "expert",
    icon: "🔷",
  },
  tailwind: {
    name: "Tailwind CSS",
    category: "frontend",
    proficiency: "expert",
    icon: "🎨",
  },

  // Backend
  nodejs: {
    name: "Node.js",
    category: "backend",
    proficiency: "expert",
    icon: "🟢",
  },
  express: {
    name: "Express.js",
    category: "backend",
    proficiency: "expert",
    icon: "🚂",
  },
  nestjs: {
    name: "NestJS",
    category: "backend",
    proficiency: "advanced",
    icon: "🐱",
  },

  // Databases
  mongodb: {
    name: "MongoDB",
    category: "database",
    proficiency: "expert",
    icon: "🍃",
  },
  postgresql: {
    name: "PostgreSQL",
    category: "database",
    proficiency: "advanced",
    icon: "🐘",
  },
  redis: {
    name: "Redis",
    category: "database",
    proficiency: "advanced",
    icon: "🔴",
  },

  // DevOps
  docker: {
    name: "Docker",
    category: "devops",
    proficiency: "advanced",
    icon: "🐳",
  },
  github: {
    name: "GitHub Actions",
    category: "devops",
    proficiency: "advanced",
    icon: "⚡",
  },
};

export const fullStackProjects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "Enterprise E-Commerce Platform",
    domain: "full-stack",
    description:
      "A comprehensive e-commerce solution built with Next.js, featuring real-time inventory management, payment processing, and advanced analytics dashboard.",
    problem:
      "A growing retail company needed a scalable e-commerce platform to replace their legacy system that couldn't handle increasing traffic and lacked modern features like real-time inventory tracking.",
    solution:
      "Developed a full-stack e-commerce platform using Next.js for the frontend, Node.js/Express for the API, MongoDB for data storage, and integrated Stripe for payments. Implemented real-time features using WebSockets and deployed on Vercel with CDN optimization.",
    impact: {
      metrics: [
        "300% increase in page load speed",
        "45% reduction in cart abandonment",
        "150% increase in mobile conversions",
        "99.9% uptime achieved",
      ],
      roi: "$2.3M additional revenue in first year",
      performance: "Page load time reduced from 8s to 2.1s",
      businessValue: "Enabled expansion to 3 new markets",
    },
    techStack: [
      technologies.nextjs,
      technologies.typescript,
      technologies.tailwind,
      technologies.nodejs,
      technologies.express,
      technologies.mongodb,
      technologies.redis,
      technologies.docker,
    ],
    timeline: "4 months",
    status: "completed",
    client: {
      name: "RetailMax Inc.",
      industry: "E-Commerce",
      size: "medium",
      testimonial:
        "Mikhail delivered an exceptional e-commerce platform that exceeded our expectations. The performance improvements and new features have significantly boosted our sales.",
      logo: "/clients/retailmax-logo.png",
    },
    gallery: [
      {
        src: "/projects/ecommerce/homepage.jpg",
        alt: "E-commerce platform homepage",
        caption: "Modern, responsive homepage with product showcase",
      },
      {
        src: "/projects/ecommerce/dashboard.jpg",
        alt: "Admin dashboard",
        caption: "Real-time analytics and inventory management dashboard",
      },
      {
        src: "/projects/ecommerce/mobile.jpg",
        alt: "Mobile interface",
        caption: "Optimized mobile shopping experience",
      },
    ],
    liveDemo: "https://ecommerce-demo.mikhailajaj.com",
    codeRepo: "https://github.com/mikhailajaj/ecommerce-platform",
    caseStudyUrl: "/case-studies/ecommerce-platform",
    featured: true,
    tags: [
      "E-Commerce",
      "Real-time",
      "Payment Integration",
      "Analytics",
      "Mobile-First",
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-20"),
  },

  {
    id: "task-management-saas",
    title: "AI-Powered Task Management SaaS",
    domain: "full-stack",
    description:
      "A modern task management application with AI-powered project insights, real-time collaboration, and advanced reporting features.",
    problem:
      "Small to medium businesses struggled with project coordination and lacked insights into team productivity and project bottlenecks.",
    solution:
      "Built a comprehensive SaaS platform with React frontend, NestJS backend, PostgreSQL database, and integrated OpenAI for intelligent task prioritization and project insights.",
    impact: {
      metrics: [
        "40% improvement in team productivity",
        "60% reduction in project delays",
        "25% increase in client satisfaction",
        "500+ active users within 6 months",
      ],
      roi: "$150K ARR achieved in first year",
      performance: "Real-time updates with <100ms latency",
      businessValue: "Enabled remote team coordination for 50+ companies",
    },
    techStack: [
      technologies.react,
      technologies.typescript,
      technologies.tailwind,
      technologies.nestjs,
      technologies.postgresql,
      technologies.redis,
      technologies.docker,
      technologies.github,
    ],
    timeline: "6 months",
    status: "completed",
    client: {
      name: "ProductivityPro",
      industry: "SaaS",
      size: "startup",
      testimonial:
        "The AI-powered insights have transformed how our clients manage their projects. Mikhail's technical expertise and attention to detail were exceptional.",
      logo: "/clients/productivitypro-logo.png",
    },
    gallery: [
      {
        src: "/projects/task-management/dashboard.jpg",
        alt: "Task management dashboard",
        caption: "AI-powered project dashboard with insights",
      },
      {
        src: "/projects/task-management/kanban.jpg",
        alt: "Kanban board interface",
        caption: "Real-time collaborative Kanban boards",
      },
      {
        src: "/projects/task-management/analytics.jpg",
        alt: "Analytics and reporting",
        caption: "Advanced analytics and productivity reports",
      },
    ],
    liveDemo: "https://taskmanager-demo.mikhailajaj.com",
    codeRepo: "https://github.com/mikhailajaj/task-management-saas",
    caseStudyUrl: "/case-studies/task-management-saas",
    featured: true,
    tags: [
      "SaaS",
      "AI Integration",
      "Real-time Collaboration",
      "Analytics",
      "Team Productivity",
    ],
    createdAt: new Date("2023-08-10"),
    updatedAt: new Date("2024-02-15"),
  },

  {
    id: "healthcare-portal",
    title: "Patient Management Portal",
    domain: "full-stack",
    description:
      "A secure healthcare portal for patient management, appointment scheduling, and telemedicine consultations with HIPAA compliance.",
    problem:
      "A healthcare clinic needed a digital solution to manage patient records, schedule appointments, and conduct virtual consultations while maintaining strict security and compliance standards.",
    solution:
      "Developed a HIPAA-compliant web application using Next.js, Node.js, and PostgreSQL with end-to-end encryption, role-based access control, and integrated video calling capabilities.",
    impact: {
      metrics: [
        "70% reduction in appointment scheduling time",
        "50% increase in patient satisfaction",
        "30% reduction in no-shows",
        "100% HIPAA compliance maintained",
      ],
      roi: "$500K cost savings in first year",
      performance: "Sub-second response times for all operations",
      businessValue: "Enabled telemedicine services during COVID-19",
    },
    techStack: [
      technologies.nextjs,
      technologies.typescript,
      technologies.nodejs,
      technologies.postgresql,
      technologies.redis,
      technologies.docker,
    ],
    timeline: "5 months",
    status: "completed",
    client: {
      name: "HealthCare Plus",
      industry: "Healthcare",
      size: "medium",
      testimonial:
        "Mikhail delivered a secure, compliant solution that has revolutionized our patient management process. The telemedicine features were crucial during the pandemic.",
      logo: "/clients/healthcare-plus-logo.png",
    },
    gallery: [
      {
        src: "/projects/healthcare/patient-dashboard.jpg",
        alt: "Patient dashboard",
        caption: "Secure patient portal with medical records access",
      },
      {
        src: "/projects/healthcare/appointment-scheduling.jpg",
        alt: "Appointment scheduling",
        caption: "Intuitive appointment scheduling system",
      },
      {
        src: "/projects/healthcare/telemedicine.jpg",
        alt: "Telemedicine interface",
        caption: "Integrated video consultation platform",
      },
    ],
    liveDemo: "https://healthcare-demo.mikhailajaj.com",
    caseStudyUrl: "/case-studies/healthcare-portal",
    featured: false,
    tags: [
      "Healthcare",
      "HIPAA Compliance",
      "Telemedicine",
      "Security",
      "Patient Management",
    ],
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2023-08-30"),
  },

  {
    id: "real-estate-platform",
    title: "Real Estate Investment Platform",
    domain: "full-stack",
    description:
      "A comprehensive platform for real estate investment analysis, property management, and investor relations with advanced financial modeling.",
    problem:
      "Real estate investors lacked a centralized platform to analyze properties, manage investments, and communicate with stakeholders effectively.",
    solution:
      "Created a full-stack platform with React frontend, Express.js backend, and MongoDB database, featuring property analysis tools, financial modeling, document management, and investor portals.",
    impact: {
      metrics: [
        "$50M+ in properties analyzed",
        "200+ active investors",
        "80% faster investment analysis",
        "90% improvement in investor communication",
      ],
      roi: "$1.2M in platform fees generated",
      performance: "Complex financial calculations in <2 seconds",
      businessValue: "Enabled expansion to 5 new markets",
    },
    techStack: [
      technologies.react,
      technologies.typescript,
      technologies.nodejs,
      technologies.express,
      technologies.mongodb,
      technologies.redis,
    ],
    timeline: "7 months",
    status: "completed",
    client: {
      name: "InvestSmart Realty",
      industry: "Real Estate",
      size: "large",
      testimonial:
        "The platform has transformed our investment process. The financial modeling tools and investor portal have significantly improved our efficiency and client relationships.",
      logo: "/clients/investsmart-logo.png",
    },
    gallery: [
      {
        src: "/projects/real-estate/property-analysis.jpg",
        alt: "Property analysis dashboard",
        caption: "Advanced property analysis and financial modeling",
      },
      {
        src: "/projects/real-estate/investor-portal.jpg",
        alt: "Investor portal",
        caption: "Comprehensive investor relations portal",
      },
      {
        src: "/projects/real-estate/portfolio-management.jpg",
        alt: "Portfolio management",
        caption: "Real-time portfolio tracking and reporting",
      },
    ],
    liveDemo: "https://realestate-demo.mikhailajaj.com",
    caseStudyUrl: "/case-studies/real-estate-platform",
    featured: false,
    tags: [
      "Real Estate",
      "Financial Modeling",
      "Investment Analysis",
      "Portfolio Management",
    ],
    createdAt: new Date("2022-11-05"),
    updatedAt: new Date("2023-06-15"),
  },
];

// Helper functions
export const getFeaturedFullStackProjects = () =>
  fullStackProjects.filter((project) => project.featured);

export const getFullStackProjectById = (id: string) =>
  fullStackProjects.find((project) => project.id === id);

export const getFullStackProjectsByTag = (tag: string) =>
  fullStackProjects.filter((project) => project.tags.includes(tag));

export const getFullStackTechnologies = () => Object.values(technologies);

import { Project, Technology } from "@/data/schemas/project";

// Technical Consulting Technologies
const technologies: Record<string, Technology> = {
  // Project Management
  agile: {
    name: "Agile/Scrum",
    category: "methodology",
    proficiency: "expert",
    icon: "🔄",
  },
  kanban: {
    name: "Kanban",
    category: "methodology",
    proficiency: "expert",
    icon: "📋",
  },
  lean: {
    name: "Lean",
    category: "methodology",
    proficiency: "advanced",
    icon: "⚡",
  },

  // Tools & Platforms
  jira: {
    name: "Jira",
    category: "tools",
    proficiency: "expert",
    icon: "🎯",
  },
  confluence: {
    name: "Confluence",
    category: "tools",
    proficiency: "expert",
    icon: "📚",
  },
  slack: {
    name: "Slack",
    category: "tools",
    proficiency: "expert",
    icon: "💬",
  },
  notion: {
    name: "Notion",
    category: "tools",
    proficiency: "advanced",
    icon: "📝",
  },

  // Architecture & Strategy
  microservices: {
    name: "Microservices",
    category: "architecture",
    proficiency: "expert",
    icon: "🏗️",
  },
  devops: {
    name: "DevOps",
    category: "architecture",
    proficiency: "expert",
    icon: "🔧",
  },
  cloudstrategy: {
    name: "Cloud Strategy",
    category: "architecture",
    proficiency: "expert",
    icon: "☁️",
  },

  // Leadership & Training
  mentoring: {
    name: "Team Mentoring",
    category: "leadership",
    proficiency: "expert",
    icon: "👥",
  },
  training: {
    name: "Technical Training",
    category: "leadership",
    proficiency: "expert",
    icon: "🎓",
  },
  stakeholder: {
    name: "Stakeholder Management",
    category: "leadership",
    proficiency: "advanced",
    icon: "🤝",
  },
};

export const technicalConsultingProjects: Project[] = [
  {
    id: "enterprise-digital-transformation",
    title: "Enterprise Digital Transformation Strategy",
    domain: "technical-consulting",
    description:
      "Led comprehensive digital transformation initiative for a Fortune 500 manufacturing company, modernizing legacy systems, implementing cloud infrastructure, and establishing DevOps practices.",
    problem:
      "A large manufacturing company was struggling with outdated legacy systems, slow time-to-market, and inability to scale operations. They needed a comprehensive digital transformation strategy.",
    solution:
      "Developed and executed a 18-month digital transformation roadmap including cloud migration, microservices architecture, DevOps implementation, and team upskilling. Established agile practices and modern development workflows.",
    impact: {
      metrics: [
        "60% reduction in deployment time",
        "40% increase in development velocity",
        "$5.2M annual cost savings",
        "99.9% system uptime achieved",
      ],
      businessValue:
        "Transformed the company's technical capabilities, enabling faster innovation, reduced operational costs, and improved market competitiveness.",
      testimonial: {
        quote:
          "The transformation strategy was comprehensive and expertly executed. We now have modern, scalable systems that support our growth objectives.",
        author: "Robert Chen",
        position: "CTO",
        company: "GlobalManufacturing Corp",
      },
    },
    technologies: ["agile", "devops", "cloudstrategy", "microservices"],
    featured: true,
    status: "completed",
    duration: "18 months",
    teamSize: 12,
    role: "Lead Technical Consultant",
    challenges: [
      "Complex legacy system dependencies",
      "Resistance to change from existing teams",
      "Tight integration with manufacturing processes",
      "Regulatory compliance requirements",
    ],
    solutions: [
      "Phased migration approach with minimal disruption",
      "Comprehensive change management and training program",
      "Custom integration solutions for manufacturing systems",
      "Compliance-first architecture design",
    ],
    results: [
      "Successfully migrated 15 legacy applications to cloud",
      "Established CI/CD pipelines for 25+ development teams",
      "Reduced system downtime from 2% to 0.1%",
      "Trained 150+ employees on new technologies and processes",
    ],
    tags: [
      "Digital Transformation",
      "Enterprise Architecture",
      "Change Management",
      "Cloud Migration",
    ],
    images: [
      "/images/projects/digital-transformation-roadmap.jpg",
      "/images/projects/enterprise-architecture-diagram.jpg",
    ],
    caseStudyUrl: "/case-studies/enterprise-digital-transformation",
  },
  {
    id: "startup-technical-strategy",
    title: "Startup Technical Strategy & Team Building",
    domain: "technical-consulting",
    description:
      "Provided strategic technical guidance and team building support for a fast-growing fintech startup, establishing scalable architecture and development practices.",
    problem:
      "A rapidly growing fintech startup needed to scale their technical team and infrastructure to support 10x user growth while maintaining security and compliance standards.",
    solution:
      "Developed comprehensive technical strategy including architecture redesign, team structure optimization, hiring roadmap, and implementation of security-first development practices.",
    impact: {
      metrics: [
        "10x user growth supported",
        "50% faster feature delivery",
        "90% reduction in security incidents",
        "25-person technical team built",
      ],
      businessValue:
        "Enabled successful scaling from 50K to 500K users while maintaining system reliability and achieving SOC 2 compliance.",
      testimonial: {
        quote:
          "The strategic guidance was invaluable during our rapid growth phase. We built a world-class technical team and infrastructure.",
        author: "Sarah Martinez",
        position: "CEO",
        company: "FinTech Innovations",
      },
    },
    technologies: ["agile", "microservices", "mentoring", "stakeholder"],
    featured: true,
    status: "completed",
    duration: "12 months",
    teamSize: 8,
    role: "Technical Strategy Consultant",
    challenges: [
      "Rapid scaling requirements",
      "Limited technical leadership experience",
      "Tight regulatory compliance needs",
      "Competitive hiring market",
    ],
    solutions: [
      "Scalable microservices architecture design",
      "Mentoring program for emerging technical leaders",
      "Compliance-by-design development framework",
      "Competitive compensation and culture strategy",
    ],
    results: [
      "Built technical team from 5 to 25 engineers",
      "Achieved SOC 2 Type II compliance",
      "Reduced system response time by 75%",
      "Established technical leadership pipeline",
    ],
    tags: ["Startup Strategy", "Team Building", "FinTech", "Compliance"],
    images: [
      "/images/projects/startup-technical-strategy.jpg",
      "/images/projects/team-building-framework.jpg",
    ],
    caseStudyUrl: "/case-studies/startup-technical-strategy",
  },
  {
    id: "agile-transformation-healthcare",
    title: "Agile Transformation for Healthcare Organization",
    domain: "technical-consulting",
    description:
      "Led agile transformation initiative for a large healthcare organization, implementing Scrum practices, improving delivery velocity, and enhancing cross-team collaboration.",
    problem:
      "A healthcare organization with 200+ IT professionals was struggling with slow delivery cycles, poor cross-team communication, and inability to respond quickly to changing requirements.",
    solution:
      "Implemented comprehensive agile transformation including Scrum training, process redesign, tool implementation, and cultural change management across 15 development teams.",
    impact: {
      metrics: [
        "70% improvement in delivery velocity",
        "85% increase in team satisfaction",
        "50% reduction in defect rates",
        "90% on-time project delivery",
      ],
      businessValue:
        "Transformed development culture and practices, enabling faster response to healthcare needs and improved patient care systems.",
      testimonial: {
        quote:
          "The agile transformation revolutionized how we work. Our teams are more collaborative, productive, and responsive to patient needs.",
        author: "Dr. Michael Thompson",
        position: "Chief Information Officer",
        company: "Regional Healthcare Network",
      },
    },
    technologies: ["agile", "kanban", "jira", "training"],
    featured: false,
    status: "completed",
    duration: "8 months",
    teamSize: 6,
    role: "Agile Transformation Lead",
    challenges: [
      "Large-scale organizational change",
      "Regulatory compliance constraints",
      "Distributed team coordination",
      "Legacy process dependencies",
    ],
    solutions: [
      "Phased transformation with pilot teams",
      "Compliance-integrated agile frameworks",
      "Virtual collaboration tools and practices",
      "Gradual process evolution approach",
    ],
    results: [
      "Trained 200+ professionals in agile practices",
      "Established 15 high-performing Scrum teams",
      "Reduced average project delivery time by 40%",
      "Achieved 90% sprint goal completion rate",
    ],
    tags: [
      "Agile Transformation",
      "Healthcare",
      "Process Improvement",
      "Training",
    ],
    images: [
      "/images/projects/agile-transformation-process.jpg",
      "/images/projects/healthcare-scrum-framework.jpg",
    ],
    caseStudyUrl: "/case-studies/agile-transformation-healthcare",
  },
  {
    id: "technical-audit-optimization",
    title: "Technical Audit & Performance Optimization",
    domain: "technical-consulting",
    description:
      "Conducted comprehensive technical audit for an e-commerce platform experiencing performance issues, providing optimization recommendations and implementation guidance.",
    problem:
      "An e-commerce platform was experiencing severe performance degradation, frequent outages, and scalability issues that were impacting customer experience and revenue.",
    solution:
      "Performed detailed technical audit covering architecture, code quality, infrastructure, and processes. Developed optimization roadmap and led implementation of critical improvements.",
    impact: {
      metrics: [
        "80% improvement in page load times",
        "95% reduction in system outages",
        "300% increase in concurrent user capacity",
        "$2.1M prevented revenue loss",
      ],
      businessValue:
        "Restored system reliability and performance, enabling business growth and preventing significant revenue loss during peak seasons.",
      testimonial: {
        quote:
          "The technical audit identified critical issues we hadn't seen. The optimization recommendations transformed our platform performance.",
        author: "Jennifer Park",
        position: "VP of Engineering",
        company: "E-Commerce Solutions Inc.",
      },
    },
    technologies: ["devops", "microservices", "cloudstrategy", "jira"],
    featured: false,
    status: "completed",
    duration: "4 months",
    teamSize: 4,
    role: "Senior Technical Consultant",
    challenges: [
      "Complex monolithic architecture",
      "Performance bottlenecks across multiple layers",
      "Limited monitoring and observability",
      "High-traffic seasonal demands",
    ],
    solutions: [
      "Microservices migration strategy",
      "Database optimization and caching implementation",
      "Comprehensive monitoring and alerting setup",
      "Auto-scaling infrastructure design",
    ],
    results: [
      "Identified and resolved 25+ critical performance issues",
      "Implemented monitoring for 100+ system metrics",
      "Reduced database query time by 85%",
      "Established performance testing framework",
    ],
    tags: [
      "Technical Audit",
      "Performance Optimization",
      "E-commerce",
      "Infrastructure",
    ],
    images: [
      "/images/projects/technical-audit-findings.jpg",
      "/images/projects/performance-optimization-results.jpg",
    ],
    caseStudyUrl: "/case-studies/technical-audit-optimization",
  },
];

export const getFeaturedTechnicalConsultingProjects = () =>
  technicalConsultingProjects.filter((project) => project.featured);

export const getTechnicalConsultingProjectsByTag = (tag: string) =>
  technicalConsultingProjects.filter((project) => project.tags.includes(tag));

export const getTechnicalConsultingProjectById = (id: string) =>
  technicalConsultingProjects.find((project) => project.id === id);

export const getTechnicalConsultingTechnologies = () =>
  Object.values(technologies);

export const getTechnicalConsultingStats = () => ({
  totalProjects: technicalConsultingProjects.length,
  featuredProjects: getFeaturedTechnicalConsultingProjects().length,
  technologies: Object.keys(technologies).length,
  domains: [
    "Digital Transformation",
    "Agile Coaching",
    "Technical Strategy",
    "Team Building",
  ],
});

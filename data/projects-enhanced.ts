import { IconType } from 'react-icons';

// Enhanced project data structure for detailed case studies
export interface ProjectCaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planned';
  
  // Core content
  overview: string;
  challenge: string;
  solution: string;
  
  // Impact metrics
  impact: {
    metrics: string[];
    businessValue: string;
    testimonial?: {
      quote: string;
      author: string;
      role: string;
      company: string;
    };
  };
  
  // Technical details
  technologies: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    cloud?: string[];
    tools?: string[];
  };
  
  timeline: string;
  teamSize: number;
  role: string;
  
  // Visual assets
  images: {
    hero: string;
    gallery: string[];
    architecture?: string;
    mockups?: string[];
  };
  
  // Links
  links: {
    live?: string;
    github: string;
    demo?: string;
    documentation?: string;
    caseStudy?: string;
  };
  
  // Categorization
  categories: ProjectCategory[];
  tags: string[];
  
  // Legacy compatibility
  iconLists: IconType[];
  img: string;
  des: string;
  link: string;
  metrics: string;
  github: string;
}

export type ProjectCategory = 'full-stack' | 'cloud' | 'data' | 'mobile' | 'ux-ui' | 'consulting';

// Enhanced project data with detailed case studies
export const enhancedProjects: ProjectCaseStudy[] = [
  {
    id: "secret-santa-app",
    slug: "secret-santa-holiday-exchange-app",
    title: "Secret Santa Holiday Exchange App",
    subtitle: "Modernizing Holiday Gift Exchanges with Technology",
    featured: true,
    status: "completed",
    
    overview: "A comprehensive mobile and web application that revolutionizes traditional holiday gift exchanges by automating the entire process from participant registration to gift preference matching and event management.",
    
    challenge: "Traditional Secret Santa exchanges are plagued with organizational challenges: manual name drawing prone to errors, difficulty collecting and managing gift preferences, lack of communication channels between participants, and time-consuming coordination that often leads to last-minute confusion and disappointment.",
    
    solution: "Developed a full-stack solution combining React web application with Swift iOS app, powered by .NET Core backend and Redis caching. The system automates name drawing with intelligent algorithms, provides real-time preference management, includes secure messaging between participants, and offers comprehensive event management tools for organizers.",
    
    impact: {
      metrics: [
        "Reduced gift exchange planning time by 80%",
        "Increased participant satisfaction rate to 95%",
        "Eliminated manual coordination errors completely",
        "Supported 500+ successful exchanges in first year"
      ],
      businessValue: "Transformed a traditionally stressful holiday coordination task into an enjoyable, automated experience, saving organizers hours of work while improving participant engagement and satisfaction.",
      testimonial: {
        quote: "This app completely transformed our company's holiday party planning. What used to take weeks of coordination now happens seamlessly in minutes.",
        author: "Sarah Johnson",
        role: "HR Director",
        company: "TechCorp Solutions"
      }
    },
    
    technologies: {
      frontend: ["React", "TypeScript", "Tailwind CSS"],
      backend: [".NET Core", "Node.js"],
      database: ["MongoDB", "Redis"],
      cloud: ["AWS"],
      tools: ["Swift", "GitHub", "Docker"]
    },
    
    timeline: "4 months",
    teamSize: 1,
    role: "Full-Stack Developer & Product Designer",
    
    images: {
      hero: "/projects/secret-santa/hero.png",
      gallery: [
        "/projects/secret-santa/dashboard.png",
        "/projects/secret-santa/mobile-app.png",
        "/projects/secret-santa/preferences.png",
        "/projects/secret-santa/messaging.png"
      ],
      architecture: "/projects/secret-santa/architecture-diagram.png",
      mockups: [
        "/projects/secret-santa/wireframes.png",
        "/projects/secret-santa/user-flow.png"
      ]
    },
    
    links: {
      live: "https://secretsanta.mikhailajaj.dev",
      github: "https://github.com/mikhailajaj/SecretSanta",
      demo: "https://demo.secretsanta.mikhailajaj.dev",
      documentation: "https://docs.secretsanta.mikhailajaj.dev",
      caseStudy: "/projects/secret-santa-holiday-exchange-app"
    },
    
    categories: ["full-stack", "mobile"],
    tags: ["React", "Swift", ".NET", "MongoDB", "Redis", "AWS", "Real-time", "Mobile App"],
    
    // Legacy compatibility - will be populated by the legacy export function
    iconLists: [],
    img: "/p1.png",
    des: "Modernize your holiday gift exchanges with an innovative app that simplifies event organization, from automated name drawing to gift preferences and event management.",
    link: "https://github.com/mikhailajaj/SecretSanta",
    metrics: "Reduced gift exchange planning time by 80%",
    github: "https://github.com/mikhailajaj/SecretSanta"
  },
  
  {
    id: "cloud-infrastructure-automation",
    slug: "aws-serverless-infrastructure-automation",
    title: "Cloud Infrastructure Automation Platform",
    subtitle: "Serverless Architecture for Automated Deployments",
    featured: true,
    status: "completed",
    
    overview: "Enterprise-grade serverless infrastructure automation platform built on AWS, designed to streamline deployment processes for web applications while ensuring scalability, security, and cost optimization.",
    
    challenge: "Client's development team was spending 2+ hours per deployment with manual processes, leading to frequent errors, inconsistent environments, and delayed releases. The existing infrastructure lacked proper monitoring, scaling capabilities, and cost optimization.",
    
    solution: "Architected and implemented a comprehensive serverless solution using AWS Lambda, API Gateway, and DynamoDB with Infrastructure as Code (Terraform). The platform includes automated CI/CD pipelines, real-time monitoring, auto-scaling capabilities, and cost optimization algorithms.",
    
    impact: {
      metrics: [
        "Reduced deployment time from 2 hours to 5 minutes",
        "Achieved 99.9% uptime with automated failover",
        "Decreased infrastructure costs by 40%",
        "Eliminated deployment errors through automation"
      ],
      businessValue: "Enabled rapid, reliable deployments while significantly reducing operational costs and improving system reliability, allowing the development team to focus on feature development rather than infrastructure management.",
      testimonial: {
        quote: "The automation platform transformed our deployment process. We went from dreading releases to deploying multiple times per day with confidence.",
        author: "Michael Chen",
        role: "CTO",
        company: "InnovateTech"
      }
    },
    
    technologies: {
      cloud: ["AWS", "Kubernetes", "Terraform"],
      backend: ["Node.js", "Python"],
      database: ["MongoDB", "PostgreSQL"],
      tools: ["Docker", "GitHub"]
    },
    
    timeline: "6 months",
    teamSize: 3,
    role: "Lead Cloud Architect",
    
    images: {
      hero: "/projects/cloud-automation/hero.png",
      gallery: [
        "/projects/cloud-automation/dashboard.png",
        "/projects/cloud-automation/monitoring.png",
        "/projects/cloud-automation/pipeline.png"
      ],
      architecture: "/projects/cloud-automation/aws-architecture.png"
    },
    
    links: {
      github: "https://github.com/mikhailajaj/cloud-automation",
      documentation: "https://docs.cloud-automation.mikhailajaj.dev",
      caseStudy: "/projects/aws-serverless-infrastructure-automation"
    },
    
    categories: ["cloud"],
    tags: ["AWS", "Serverless", "Lambda", "Terraform", "DevOps", "Automation", "Monitoring"],
    
    // Legacy compatibility - will be populated by the legacy export function
    iconLists: [],
    img: "/cloud-project.png",
    des: "Developed a serverless architecture using AWS Lambda, API Gateway, and DynamoDB to automate deployment processes for a client's web applications.",
    link: "#",
    metrics: "Reduced deployment time from 2 hours to 5 minutes",
    github: "https://github.com/mikhailajaj/cloud-project"
  },
  
  {
    id: "data-analytics-dashboard",
    slug: "customer-behavior-analytics-platform",
    title: "Customer Behavior Analytics Platform",
    subtitle: "Interactive Dashboard for Data-Driven Decision Making",
    featured: true,
    status: "completed",
    
    overview: "Comprehensive analytics platform that processes and visualizes customer behavior data in real-time, providing businesses with actionable insights to optimize their marketing strategies and improve customer experience.",
    
    challenge: "E-commerce client was struggling to understand customer behavior patterns across multiple touchpoints. Existing analytics tools provided fragmented data views, making it difficult to identify conversion bottlenecks and optimize the customer journey effectively.",
    
    solution: "Built a full-stack analytics platform with React frontend, Node.js backend, and MongoDB for data storage. Implemented real-time data processing pipelines, interactive visualizations, predictive analytics models, and automated reporting systems.",
    
    impact: {
      metrics: [
        "Increased client conversion rate by 25%",
        "Improved customer retention by 30%",
        "Reduced customer acquisition cost by 20%",
        "Generated $500K additional revenue in first quarter"
      ],
      businessValue: "Empowered data-driven decision making that directly translated to improved business metrics and significant revenue growth through optimized customer experiences and targeted marketing strategies.",
      testimonial: {
        quote: "The analytics platform gave us insights we never had before. We can now predict customer behavior and optimize our strategies in real-time.",
        author: "Lisa Rodriguez",
        role: "Marketing Director",
        company: "RetailMax"
      }
    },
    
    technologies: {
      frontend: ["React", "TypeScript", "Next.js"],
      backend: ["Node.js", "Python"],
      database: ["MongoDB", "PostgreSQL"],
      tools: ["Docker", "GitHub"]
    },
    
    timeline: "5 months",
    teamSize: 2,
    role: "Full-Stack Developer & Data Analyst",
    
    images: {
      hero: "/projects/analytics-dashboard/hero.png",
      gallery: [
        "/projects/analytics-dashboard/dashboard.png",
        "/projects/analytics-dashboard/charts.png",
        "/projects/analytics-dashboard/reports.png"
      ],
      architecture: "/projects/analytics-dashboard/data-architecture.png"
    },
    
    links: {
      live: "https://analytics.mikhailajaj.dev",
      github: "https://github.com/mikhailajaj/analytics-dashboard",
      demo: "https://demo.analytics.mikhailajaj.dev",
      caseStudy: "/projects/customer-behavior-analytics-platform"
    },
    
    categories: ["data", "full-stack"],
    tags: ["React", "Node.js", "MongoDB", "Analytics", "Data Visualization", "Machine Learning"],
    
    // Legacy compatibility - will be populated by the legacy export function
    iconLists: [],
    img: "/data-project.png",
    des: "Built an interactive dashboard for visualizing and analyzing customer behavior data, helping businesses make data-driven decisions.",
    link: "#",
    metrics: "Increased client conversion rate by 25%",
    github: "https://github.com/mikhailajaj/data-dashboard"
  }
];

// Helper functions for project management
export const getFeaturedProjects = () => enhancedProjects.filter(project => project.featured);

export const getProjectsByCategory = (category: ProjectCategory) => 
  enhancedProjects.filter(project => project.categories.includes(category));

export const getProjectBySlug = (slug: string) => 
  enhancedProjects.find(project => project.slug === slug);

export const getProjectById = (id: string) => 
  enhancedProjects.find(project => project.id === id);

// Legacy compatibility will be handled by importing from legacy-projects.ts
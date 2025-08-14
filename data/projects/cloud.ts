import { Project, Technology } from "@/data/schemas/project";

// Cloud Engineering Technologies
const technologies: Record<string, Technology> = {
  // Cloud Platforms
  aws: {
    name: "AWS",
    category: "cloud",
    proficiency: "expert",
    icon: "☁️",
  },
  lambda: {
    name: "AWS Lambda",
    category: "cloud",
    proficiency: "expert",
    icon: "λ",
  },
  ec2: {
    name: "AWS EC2",
    category: "cloud",
    proficiency: "expert",
    icon: "🖥️",
  },
  s3: {
    name: "AWS S3",
    category: "cloud",
    proficiency: "expert",
    icon: "🗄️",
  },
  rds: {
    name: "AWS RDS",
    category: "cloud",
    proficiency: "advanced",
    icon: "🗃️",
  },

  // DevOps Tools
  docker: {
    name: "Docker",
    category: "devops",
    proficiency: "expert",
    icon: "🐳",
  },
  kubernetes: {
    name: "Kubernetes",
    category: "devops",
    proficiency: "advanced",
    icon: "⚙️",
  },
  terraform: {
    name: "Terraform",
    category: "devops",
    proficiency: "expert",
    icon: "🏗️",
  },
  jenkins: {
    name: "Jenkins",
    category: "devops",
    proficiency: "advanced",
    icon: "🔧",
  },
  githubActions: {
    name: "GitHub Actions",
    category: "devops",
    proficiency: "expert",
    icon: "⚡",
  },

  // Monitoring & Security
  cloudwatch: {
    name: "CloudWatch",
    category: "devops",
    proficiency: "advanced",
    icon: "📊",
  },
  prometheus: {
    name: "Prometheus",
    category: "devops",
    proficiency: "intermediate",
    icon: "📈",
  },
  grafana: {
    name: "Grafana",
    category: "devops",
    proficiency: "intermediate",
    icon: "📉",
  },
};

export const cloudProjects: Project[] = [
  {
    id: "serverless-microservices-platform",
    title: "Serverless Microservices Platform",
    domain: "cloud",
    description:
      "Built a scalable serverless architecture using AWS Lambda, API Gateway, and DynamoDB for a fintech startup, handling 1M+ transactions daily.",
    problem:
      "A fintech startup needed a highly scalable, cost-effective platform to handle payment processing with unpredictable traffic patterns and strict security requirements.",
    solution:
      "Designed and implemented a serverless microservices architecture using AWS Lambda functions, API Gateway for routing, DynamoDB for data storage, and SQS for async processing. Implemented Infrastructure as Code using Terraform.",
    impact: {
      metrics: [
        "99.99% uptime achieved",
        "80% reduction in infrastructure costs",
        "10x improvement in deployment speed",
        "1M+ daily transactions processed",
      ],
      roi: "$500K annual cost savings",
      performance: "Sub-100ms response times for 95% of requests",
      businessValue: "Enabled rapid scaling from 10K to 1M+ users",
    },
    techStack: [
      technologies.aws,
      technologies.lambda,
      technologies.s3,
      technologies.terraform,
      technologies.docker,
      technologies.githubActions,
      technologies.cloudwatch,
    ],
    timeline: "3 months",
    status: "completed",
    client: {
      name: "PayFlow Technologies",
      industry: "Fintech",
      size: "startup",
      testimonial:
        "Mikhail's serverless architecture transformed our business. We went from struggling with server costs to processing millions of transactions seamlessly.",
      logo: "/clients/payflow-logo.png",
    },
    gallery: [
      {
        src: "/projects/serverless/architecture-diagram.jpg",
        alt: "Serverless microservices architecture diagram",
        caption: "Complete serverless architecture with AWS services",
      },
      {
        src: "/projects/serverless/monitoring-dashboard.jpg",
        alt: "CloudWatch monitoring dashboard",
        caption: "Real-time monitoring and alerting system",
      },
      {
        src: "/projects/serverless/cost-optimization.jpg",
        alt: "Cost optimization results",
        caption: "80% cost reduction through serverless optimization",
      },
    ],
    liveDemo: "https://serverless-demo.mikhailajaj.com",
    codeRepo: "https://github.com/mikhailajaj/serverless-microservices",
    caseStudyUrl: "/case-studies/serverless-microservices-platform",
    featured: true,
    tags: [
      "Serverless",
      "AWS Lambda",
      "Microservices",
      "Fintech",
      "Cost Optimization",
    ],
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-07-15"),
  },

  {
    id: "kubernetes-container-orchestration",
    title: "Enterprise Kubernetes Platform",
    domain: "cloud",
    description:
      "Migrated a monolithic e-commerce platform to Kubernetes, implementing auto-scaling, service mesh, and comprehensive monitoring for improved reliability.",
    problem:
      "An enterprise e-commerce company faced scalability issues with their monolithic application, experiencing frequent downtime during peak traffic and difficulty deploying updates.",
    solution:
      "Containerized the application using Docker, implemented Kubernetes orchestration with auto-scaling, set up Istio service mesh for traffic management, and established comprehensive monitoring with Prometheus and Grafana.",
    impact: {
      metrics: [
        "99.9% uptime during Black Friday",
        "5x faster deployment cycles",
        "60% reduction in resource waste",
        "50% improvement in response times",
      ],
      roi: "$1.2M prevented revenue loss",
      performance: "Handles 10x traffic spikes automatically",
      businessValue: "Zero-downtime deployments enabled",
    },
    techStack: [
      technologies.kubernetes,
      technologies.docker,
      technologies.aws,
      technologies.terraform,
      technologies.prometheus,
      technologies.grafana,
      technologies.jenkins,
    ],
    timeline: "6 months",
    status: "completed",
    client: {
      name: "MegaCommerce Corp",
      industry: "E-Commerce",
      size: "large",
      testimonial:
        "The Kubernetes migration was flawless. We now handle Black Friday traffic without breaking a sweat, and deployments that used to take hours now take minutes.",
      logo: "/clients/megacommerce-logo.png",
    },
    gallery: [
      {
        src: "/projects/kubernetes/cluster-architecture.jpg",
        alt: "Kubernetes cluster architecture",
        caption: "Multi-zone Kubernetes cluster with auto-scaling",
      },
      {
        src: "/projects/kubernetes/monitoring-stack.jpg",
        alt: "Prometheus and Grafana monitoring",
        caption: "Comprehensive monitoring and alerting system",
      },
      {
        src: "/projects/kubernetes/deployment-pipeline.jpg",
        alt: "CI/CD deployment pipeline",
        caption: "Automated deployment pipeline with zero downtime",
      },
    ],
    liveDemo: "https://k8s-demo.mikhailajaj.com",
    codeRepo: "https://github.com/mikhailajaj/kubernetes-platform",
    caseStudyUrl: "/case-studies/kubernetes-container-orchestration",
    featured: true,
    tags: [
      "Kubernetes",
      "Container Orchestration",
      "DevOps",
      "Auto-scaling",
      "Monitoring",
    ],
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2024-03-20"),
  },

  {
    id: "infrastructure-as-code-automation",
    title: "Infrastructure as Code Automation",
    domain: "cloud",
    description:
      "Implemented comprehensive Infrastructure as Code using Terraform and AWS, automating the provisioning and management of cloud resources for a SaaS platform.",
    problem:
      "A growing SaaS company was manually managing cloud infrastructure, leading to inconsistencies, security vulnerabilities, and slow environment provisioning.",
    solution:
      "Designed and implemented Infrastructure as Code using Terraform modules, automated environment provisioning with GitHub Actions, established security best practices, and created disaster recovery procedures.",
    impact: {
      metrics: [
        "95% reduction in provisioning time",
        "100% infrastructure consistency",
        "90% fewer security incidents",
        "75% faster disaster recovery",
      ],
      roi: "$300K operational cost savings",
      performance: "Environment provisioning in under 15 minutes",
      businessValue: "Enabled rapid expansion to 5 new regions",
    },
    techStack: [
      technologies.terraform,
      technologies.aws,
      technologies.githubActions,
      technologies.docker,
      technologies.cloudwatch,
      technologies.s3,
    ],
    timeline: "4 months",
    status: "completed",
    client: {
      name: "CloudScale SaaS",
      industry: "SaaS",
      size: "medium",
      testimonial:
        "Mikhail's Infrastructure as Code implementation revolutionized our operations. We can now spin up new environments in minutes instead of days.",
      logo: "/clients/cloudscale-logo.png",
    },
    gallery: [
      {
        src: "/projects/iac/terraform-modules.jpg",
        alt: "Terraform module structure",
        caption: "Modular Terraform infrastructure code",
      },
      {
        src: "/projects/iac/automation-pipeline.jpg",
        alt: "Infrastructure automation pipeline",
        caption: "Automated infrastructure provisioning workflow",
      },
      {
        src: "/projects/iac/security-compliance.jpg",
        alt: "Security and compliance dashboard",
        caption: "Security scanning and compliance monitoring",
      },
    ],
    codeRepo: "https://github.com/mikhailajaj/infrastructure-as-code",
    caseStudyUrl: "/case-studies/infrastructure-as-code-automation",
    featured: false,
    tags: [
      "Infrastructure as Code",
      "Terraform",
      "Automation",
      "Security",
      "DevOps",
    ],
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-09-30"),
  },

  {
    id: "cloud-migration-optimization",
    title: "Legacy to Cloud Migration",
    domain: "cloud",
    description:
      "Led the migration of a legacy on-premises system to AWS cloud, implementing modern architecture patterns and achieving significant cost and performance improvements.",
    problem:
      "A traditional manufacturing company was running expensive on-premises infrastructure with poor scalability, high maintenance costs, and limited disaster recovery capabilities.",
    solution:
      "Executed a phased cloud migration strategy, re-architected applications for cloud-native patterns, implemented auto-scaling and load balancing, and established comprehensive backup and disaster recovery procedures.",
    impact: {
      metrics: [
        "65% reduction in infrastructure costs",
        "99.95% uptime improvement",
        "3x faster application performance",
        "24/7 global availability achieved",
      ],
      roi: "$800K annual savings",
      performance: "Response times improved from 5s to 1.2s",
      businessValue: "Enabled global expansion and remote work",
    },
    techStack: [
      technologies.aws,
      technologies.ec2,
      technologies.rds,
      technologies.s3,
      technologies.terraform,
      technologies.docker,
      technologies.cloudwatch,
    ],
    timeline: "8 months",
    status: "completed",
    client: {
      name: "Industrial Solutions Ltd",
      industry: "Manufacturing",
      size: "large",
      testimonial:
        "The cloud migration exceeded all our expectations. We're now more agile, cost-effective, and can serve customers globally with confidence.",
      logo: "/clients/industrial-solutions-logo.png",
    },
    gallery: [
      {
        src: "/projects/migration/before-after.jpg",
        alt: "Before and after architecture comparison",
        caption: "Legacy vs cloud-native architecture comparison",
      },
      {
        src: "/projects/migration/cost-analysis.jpg",
        alt: "Cost optimization analysis",
        caption: "65% cost reduction through cloud optimization",
      },
      {
        src: "/projects/migration/performance-metrics.jpg",
        alt: "Performance improvement metrics",
        caption: "Significant performance improvements post-migration",
      },
    ],
    caseStudyUrl: "/case-studies/cloud-migration-optimization",
    featured: false,
    tags: [
      "Cloud Migration",
      "AWS",
      "Legacy Modernization",
      "Cost Optimization",
      "Performance",
    ],
    createdAt: new Date("2022-10-05"),
    updatedAt: new Date("2023-06-15"),
  },
];

// Helper functions
export const getFeaturedCloudProjects = () =>
  cloudProjects.filter((project) => project.featured);

export const getCloudProjectById = (id: string) =>
  cloudProjects.find((project) => project.id === id);

export const getCloudProjectsByTag = (tag: string) =>
  cloudProjects.filter((project) => project.tags.includes(tag));

export const getCloudTechnologies = () => Object.values(technologies);

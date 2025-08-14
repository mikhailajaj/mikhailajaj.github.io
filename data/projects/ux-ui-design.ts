import { Project, Technology } from "@/data/schemas/project";

// UX/UI Design Technologies
const technologies: Record<string, Technology> = {
  // Design Tools
  figma: {
    name: "Figma",
    category: "design",
    proficiency: "expert",
    icon: "🎨",
  },
  sketch: {
    name: "Sketch",
    category: "design",
    proficiency: "advanced",
    icon: "✏️",
  },
  adobexd: {
    name: "Adobe XD",
    category: "design",
    proficiency: "advanced",
    icon: "🔷",
  },
  photoshop: {
    name: "Photoshop",
    category: "design",
    proficiency: "advanced",
    icon: "🖼️",
  },
  illustrator: {
    name: "Illustrator",
    category: "design",
    proficiency: "intermediate",
    icon: "🎯",
  },

  // Prototyping
  principle: {
    name: "Principle",
    category: "prototyping",
    proficiency: "advanced",
    icon: "⚡",
  },
  framer: {
    name: "Framer",
    category: "prototyping",
    proficiency: "advanced",
    icon: "🔧",
  },
  invision: {
    name: "InVision",
    category: "prototyping",
    proficiency: "intermediate",
    icon: "👁️",
  },

  // Research & Testing
  miro: {
    name: "Miro",
    category: "research",
    proficiency: "expert",
    icon: "🧠",
  },
  hotjar: {
    name: "Hotjar",
    category: "research",
    proficiency: "advanced",
    icon: "🔥",
  },
  maze: {
    name: "Maze",
    category: "research",
    proficiency: "intermediate",
    icon: "🗺️",
  },

  // Development Integration
  zeplin: {
    name: "Zeplin",
    category: "handoff",
    proficiency: "advanced",
    icon: "🔗",
  },
  storybook: {
    name: "Storybook",
    category: "handoff",
    proficiency: "intermediate",
    icon: "📚",
  },
};

export const uxuiProjects: Project[] = [
  {
    id: "fintech-mobile-banking-app",
    title: "FinTech Mobile Banking App Redesign",
    domain: "ux-ui-design",
    description:
      "Complete UX/UI redesign of a mobile banking application, focusing on user experience optimization, accessibility, and modern design patterns to increase user engagement and transaction completion rates.",
    problem:
      "A regional bank's mobile app had poor user engagement, high abandonment rates during transactions, and accessibility issues that prevented many users from completing basic banking tasks.",
    solution:
      "Conducted comprehensive user research, created user personas and journey maps, redesigned the entire app with a focus on accessibility and usability. Implemented a design system and conducted extensive usability testing.",
    impact: {
      metrics: [
        "65% increase in user engagement",
        "40% reduction in transaction abandonment",
        "85% improvement in accessibility score",
        "4.8/5 user satisfaction rating",
      ],
      businessValue:
        "Increased digital banking adoption by 45% and reduced customer service calls by 30%, saving the bank $2.1M annually in operational costs.",
      testimonial: {
        quote:
          "The redesign transformed our mobile banking experience. User satisfaction scores increased dramatically and we saw immediate business impact.",
        author: "Lisa Chen",
        position: "VP of Digital Experience",
        company: "Regional Trust Bank",
      },
    },
    technologies: ["figma", "miro", "hotjar", "principle"],
    featured: true,
    status: "completed",
    duration: "4 months",
    teamSize: 4,
    role: "Lead UX/UI Designer",
    challenges: [
      "Complex financial workflows and regulations",
      "Diverse user base with varying tech literacy",
      "Strict security and compliance requirements",
      "Legacy system integration constraints",
    ],
    solutions: [
      "Conducted extensive user research and persona development",
      "Created progressive disclosure patterns for complex features",
      "Implemented WCAG 2.1 AA accessibility standards",
      "Designed flexible component system for future updates",
    ],
    results: [
      "Increased user task completion rate from 45% to 78%",
      "Reduced average task completion time by 35%",
      "Achieved 4.8/5 user satisfaction rating",
      "Won UX Design Excellence Award 2024",
    ],
    tags: ["Mobile Design", "FinTech", "Accessibility", "User Research"],
    images: [
      "/images/projects/banking-app-before-after.jpg",
      "/images/projects/banking-app-user-journey.jpg",
    ],
    liveUrl: "https://banking-app-demo.mikhailajaj.com",
    caseStudyUrl: "/case-studies/fintech-mobile-banking-redesign",
  },
  {
    id: "healthcare-patient-portal",
    title: "Healthcare Patient Portal Design System",
    domain: "ux-ui-design",
    description:
      "Designed a comprehensive patient portal and design system for a healthcare network, enabling patients to manage appointments, view medical records, and communicate with providers.",
    problem:
      "A healthcare network needed a unified digital experience across multiple touchpoints, but lacked design consistency and had poor patient engagement with existing digital tools.",
    solution:
      "Created a comprehensive design system, redesigned the patient portal with focus on health literacy and accessibility, and established design guidelines for all digital touchpoints.",
    impact: {
      metrics: [
        "70% increase in portal adoption",
        "50% reduction in support calls",
        "90% patient satisfaction score",
        "35% faster appointment scheduling",
      ],
      businessValue:
        "Improved patient engagement and reduced administrative overhead, resulting in $1.8M annual cost savings and improved patient outcomes.",
      testimonial: {
        quote:
          "The new patient portal has revolutionized how our patients interact with our services. The design system ensures consistency across all our digital properties.",
        author: "Dr. Michael Rodriguez",
        position: "Chief Medical Officer",
        company: "Regional Health Network",
      },
    },
    technologies: ["figma", "miro", "storybook", "maze"],
    featured: true,
    status: "completed",
    duration: "6 months",
    teamSize: 5,
    role: "Senior UX Designer",
    challenges: [
      "Complex medical information hierarchy",
      "HIPAA compliance and security requirements",
      "Multi-generational user base",
      "Integration with existing EMR systems",
    ],
    solutions: [
      "Developed health literacy-focused information architecture",
      "Implemented privacy-first design patterns",
      "Created adaptive interfaces for different user capabilities",
      "Designed flexible API integration patterns",
    ],
    results: [
      "Deployed across 12 healthcare facilities",
      "Achieved 90% patient satisfaction score",
      "Reduced patient onboarding time by 60%",
      "Established reusable design system for future projects",
    ],
    tags: [
      "Healthcare",
      "Design System",
      "Accessibility",
      "Patient Experience",
    ],
    images: [
      "/images/projects/healthcare-portal-dashboard.jpg",
      "/images/projects/healthcare-design-system.jpg",
    ],
    caseStudyUrl: "/case-studies/healthcare-patient-portal",
  },
  {
    id: "ecommerce-checkout-optimization",
    title: "E-commerce Checkout Flow Optimization",
    domain: "ux-ui-design",
    description:
      "Redesigned the checkout experience for a major e-commerce platform, focusing on conversion optimization, mobile experience, and reducing cart abandonment through UX improvements.",
    problem:
      "An e-commerce platform was experiencing 68% cart abandonment rate and poor mobile conversion, losing significant revenue due to checkout friction and usability issues.",
    solution:
      "Conducted user testing and analytics review, redesigned the entire checkout flow with progressive disclosure, guest checkout options, and mobile-first approach. Implemented A/B testing for optimization.",
    impact: {
      metrics: [
        "45% reduction in cart abandonment",
        "25% increase in mobile conversions",
        "30% faster checkout completion",
        "$3.2M additional annual revenue",
      ],
      businessValue:
        "Conversion rate optimization resulted in $3.2M additional annual revenue and improved customer satisfaction scores.",
      testimonial: {
        quote:
          "The checkout redesign had immediate impact on our bottom line. Cart abandonment dropped significantly and mobile sales increased dramatically.",
        author: "Sarah Johnson",
        position: "Head of E-commerce",
        company: "RetailMax Inc.",
      },
    },
    technologies: ["figma", "hotjar", "maze", "principle"],
    featured: false,
    status: "completed",
    duration: "3 months",
    teamSize: 3,
    role: "UX Designer",
    challenges: [
      "High cart abandonment rates across devices",
      "Complex payment and shipping options",
      "International checkout requirements",
      "Legacy system constraints",
    ],
    solutions: [
      "Implemented progressive disclosure for complex options",
      "Created mobile-first responsive design",
      "Designed flexible localization framework",
      "Established A/B testing methodology",
    ],
    results: [
      "Reduced checkout steps from 7 to 4",
      "Achieved 25% increase in mobile conversions",
      "Implemented across 15 international markets",
      "Generated $3.2M additional annual revenue",
    ],
    tags: [
      "E-commerce",
      "Conversion Optimization",
      "Mobile Design",
      "A/B Testing",
    ],
    images: [
      "/images/projects/checkout-flow-optimization.jpg",
      "/images/projects/mobile-checkout-design.jpg",
    ],
    liveUrl: "https://checkout-demo.mikhailajaj.com",
    caseStudyUrl: "/case-studies/ecommerce-checkout-optimization",
  },
  {
    id: "saas-dashboard-redesign",
    title: "SaaS Analytics Dashboard Redesign",
    domain: "ux-ui-design",
    description:
      "Redesigned a complex analytics dashboard for a SaaS platform, focusing on data visualization, user workflow optimization, and creating an intuitive interface for non-technical users.",
    problem:
      "A SaaS analytics platform had a complex, overwhelming interface that prevented users from effectively analyzing their data, leading to low user engagement and high churn rates.",
    solution:
      "Conducted user interviews and workflow analysis, redesigned the dashboard with progressive disclosure, improved data visualization, and created customizable views for different user types.",
    impact: {
      metrics: [
        "60% increase in daily active users",
        "40% reduction in user churn",
        "75% improvement in task completion",
        "4.6/5 user experience rating",
      ],
      businessValue:
        "Improved user retention and engagement led to 35% increase in subscription renewals and $1.5M additional ARR.",
      testimonial: {
        quote:
          "The dashboard redesign made our complex analytics accessible to all our users. We saw immediate improvements in engagement and retention.",
        author: "David Park",
        position: "Product Manager",
        company: "DataInsights Pro",
      },
    },
    technologies: ["figma", "miro", "principle", "hotjar"],
    featured: false,
    status: "completed",
    duration: "5 months",
    teamSize: 4,
    role: "Lead UX Designer",
    challenges: [
      "Complex data visualization requirements",
      "Diverse user skill levels and needs",
      "Real-time data display constraints",
      "Customization vs. simplicity balance",
    ],
    solutions: [
      "Created progressive disclosure patterns for complexity",
      "Designed role-based dashboard configurations",
      "Implemented efficient data loading strategies",
      "Established modular component architecture",
    ],
    results: [
      "Increased user session duration by 85%",
      "Reduced support tickets by 45%",
      "Achieved 4.6/5 user experience rating",
      "Improved subscription renewal rate by 35%",
    ],
    tags: ["SaaS", "Data Visualization", "Dashboard Design", "User Research"],
    images: [
      "/images/projects/saas-dashboard-before-after.jpg",
      "/images/projects/data-visualization-components.jpg",
    ],
    liveUrl: "https://dashboard-demo.mikhailajaj.com",
    caseStudyUrl: "/case-studies/saas-dashboard-redesign",
  },
];

export const getFeaturedUXUIProjects = () =>
  uxuiProjects.filter((project) => project.featured);

export const getUXUIProjectsByTag = (tag: string) =>
  uxuiProjects.filter((project) => project.tags.includes(tag));

export const getUXUIProjectById = (id: string) =>
  uxuiProjects.find((project) => project.id === id);

export const getUXUITechnologies = () => Object.values(technologies);

export const getUXUIStats = () => ({
  totalProjects: uxuiProjects.length,
  featuredProjects: getFeaturedUXUIProjects().length,
  technologies: Object.keys(technologies).length,
  domains: [
    "Mobile Design",
    "Web Applications",
    "Design Systems",
    "User Research",
  ],
});

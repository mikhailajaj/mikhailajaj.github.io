import { Project, Technology } from "@/data/schemas/project";

// PulseShare Technologies
const technologies: Record<string, Technology> = {
  // Mobile Frontend
  swift: {
    name: "Swift",
    category: "frontend",
    proficiency: "expert",
    icon: "🦅",
  },
  swiftui: {
    name: "SwiftUI",
    category: "frontend",
    proficiency: "expert",
    icon: "📱",
  },
  
  // Web Frontend
  nextjs: {
    name: "Next.js",
    category: "frontend",
    proficiency: "expert",
    icon: "▲",
  },
  react: {
    name: "React",
    category: "frontend",
    proficiency: "expert",
    icon: "⚛️",
  },
  typescript: {
    name: "TypeScript",
    category: "frontend",
    proficiency: "expert",
    icon: "🔷",
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
  
  // Database & Cloud
  postgresql: {
    name: "PostgreSQL",
    category: "database",
    proficiency: "expert",
    icon: "🐘",
  },
  supabase: {
    name: "Supabase",
    category: "database",
    proficiency: "advanced",
    icon: "⚡",
  },
  redshift: {
    name: "Amazon Redshift",
    category: "cloud",
    proficiency: "advanced",
    icon: "📊",
  },
  
  // Cloud & Infrastructure
  aws: {
    name: "AWS",
    category: "cloud",
    proficiency: "expert",
    icon: "☁️",
  },
  vercel: {
    name: "Vercel",
    category: "devops",
    proficiency: "expert",
    icon: "▲",
  },
  
  // AI/ML
  chatgpt: {
    name: "ChatGPT API",
    category: "backend",
    proficiency: "advanced",
    icon: "🤖",
  },
};

export const pulseShareProject: Project = {
  id: "pulseshare",
  title: "PulseShare - Blood Donation Management Platform",
  shortTitle: "PulseShare",
  domain: "full-stack",
  description:
    "A mobile and web application designed to revolutionize blood donation management, connecting donors with healthcare facilities while providing personalized insights and streamlined appointment booking.",
  problem:
    "Canadian Blood Services requires 100,000 new donors annually, yet only 4% of Canadians donate blood. Organizations struggle to engage, retain, and inform donors effectively, creating a critical gap in maintaining a stable blood supply.",
  solution:
    "Developed a comprehensive dual-platform solution: an iOS mobile app for donors and a Next.js web application for healthcare staff. The system features appointment booking, real-time donor management, analytics dashboards powered by Amazon Redshift, and an AI-powered virtual assistant for donor support.",
  
  impact: {
    metrics: [
      "Streamlined appointment booking for 100,000+ potential annual donors",
      "68.5% appointment completion rate through automated reminders",
      "Real-time analytics dashboard for blood supply management",
      "AI-powered virtual assistant providing 24/7 donor support",
      "Personalized donor impact reports to improve retention",
    ],
    businessValue:
      "Addresses Canada's critical blood shortage by improving donor engagement and retention, supporting the national need for 100,000 new donors annually.",
  },
  
  technologies: [
    technologies.swift,
    technologies.swiftui,
    technologies.nextjs,
    technologies.react,
    technologies.typescript,
    technologies.nodejs,
    technologies.express,
    technologies.postgresql,
    technologies.supabase,
    technologies.redshift,
    technologies.aws,
    technologies.vercel,
    technologies.chatgpt,
  ],
  
  highlights: [
    "iOS mobile application with SwiftUI for seamless donor experience",
    "Next.js web dashboard for healthcare staff management",
    "Amazon Redshift data warehouse for advanced analytics",
    "AI-powered virtual assistant using ChatGPT API",
    "Real-time appointment booking with calendar integration",
    "Geolocation-based blood donation center finder",
    "Personalized donor journey tracking and impact reporting",
    "Multi-user role management (Donors, Staff, Admin)",
  ],
  
  features: [
    {
      title: "Mobile Donor App (iOS)",
      items: [
        "User authentication with email/password and social login",
        "Interactive appointment booking with calendar selection",
        "Real-time location-based donation center discovery",
        "Personalized donor profile with blood type and history",
        "Push notifications for appointment reminders",
        "News feed with educational articles about blood donation",
        "Donation impact tracking and statistics",
        "AI-powered virtual assistant chatbot",
      ],
    },
    {
      title: "Web Admin Dashboard",
      items: [
        "Comprehensive donor management system",
        "Appointment scheduling and tracking",
        "Blood donation center location management with map integration",
        "Notification and update broadcasting",
        "News article content management system",
        "Multi-dimensional analytics dashboards",
        "Real-time blood supply monitoring",
        "Donor lifecycle and engagement analytics",
      ],
    },
    {
      title: "Advanced Analytics",
      items: [
        "Amazon Redshift data warehouse integration",
        "Demographic analytics (blood type, age, gender, location)",
        "Donor lifecycle stage tracking",
        "Appointment completion rate analysis",
        "Blood supply overview and forecasting",
        "Campaign effectiveness metrics",
        "Location-based donation trends",
        "Performance dashboards with real-time updates",
      ],
    },
    {
      title: "AI Virtual Assistant",
      items: [
        "Natural language processing for donor queries",
        "Contextual information about blood donation",
        "Personalized responses based on donor profile",
        "24/7 availability for donor support",
        "Integration with donor database for accurate information",
      ],
    },
  ],
  
  technicalDetails: {
    architecture: "Layered architecture with presentation, application, domain, persistence, and database layers",
    highlights: [
      "iOS native app built with Swift 5+ and SwiftUI framework",
      "Next.js 14+ with App Router for server-side rendering",
      "RESTful API built with Node.js and Express",
      "PostgreSQL database with Supabase for real-time features",
      "Amazon Redshift for data warehousing and analytics",
      "Vercel deployment with CDN optimization",
      "AWS cloud infrastructure (storage, authentication)",
      "MapKit integration for geolocation services",
      "Push notification system for iOS",
      "Responsive web design with mobile-first approach",
    ],
    performance: [
      "Real-time data synchronization between mobile and web",
      "Optimized database queries with indexing",
      "CDN-based asset delivery for fast loading",
      "Efficient data aggregation using Redshift",
      "Progressive web app capabilities",
    ],
  },
  
  tags: [
    "iOS Development",
    "Swift",
    "SwiftUI",
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Supabase",
    "Amazon Redshift",
    "Data Analytics",
    "Healthcare",
    "Mobile Development",
    "Web Development",
    "AI Integration",
    "ChatGPT",
    "Geolocation",
    "Real-time",
    "Cloud Computing",
    "AWS",
  ],
  
  featured: true,
  status: "completed",
  year: "2025",
  client: "Capstone Project",
  role: "Full-Stack Developer & Technical Lead",
  teamSize: 4,
  duration: "8 months",
  
  images: [
    {
      src: "/pulse-share/architecture.webp",
      alt: "PulseShare system architecture — layered diagram spanning the iOS app, Next.js dashboard, Node API, PostgreSQL and Redshift",
      width: 1200,
      height: 1367,
    },
  ],
};

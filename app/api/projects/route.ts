import { NextResponse } from "next/server";

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Demo project data
const demoProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description:
      "Full-stack e-commerce solution with React, Node.js, and PostgreSQL",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
    featured: true,
    category: "full-stack",
    image: "/projects/ecommerce.jpg",
    liveUrl: "https://demo-ecommerce.com",
    githubUrl: "https://github.com/mikhailajaj/ecommerce",
    status: "completed",
    startDate: "2024-01-15",
    endDate: "2024-03-20",
    lastUpdated: Date.now(),
  },
  {
    id: "2",
    title: "Cloud Infrastructure Automation",
    description:
      "AWS infrastructure automation using Terraform and CI/CD pipelines",
    technologies: ["AWS", "Terraform", "Docker", "Jenkins", "Kubernetes"],
    featured: true,
    category: "cloud",
    image: "/projects/cloud-infra.jpg",
    liveUrl: "https://cloud-demo.com",
    githubUrl: "https://github.com/mikhailajaj/cloud-automation",
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-04-15",
    lastUpdated: Date.now(),
  },
  {
    id: "3",
    title: "Data Analytics Dashboard",
    description: "Real-time analytics dashboard with machine learning insights",
    technologies: ["Python", "React", "TensorFlow", "PostgreSQL", "D3.js"],
    featured: true,
    category: "data",
    image: "/projects/analytics.jpg",
    liveUrl: "https://analytics-demo.com",
    githubUrl: "https://github.com/mikhailajaj/analytics-dashboard",
    status: "completed",
    startDate: "2024-03-01",
    endDate: "2024-05-30",
    lastUpdated: Date.now(),
  },
  {
    id: "4",
    title: "UX Design System",
    description:
      "Comprehensive design system with component library and documentation",
    technologies: ["Figma", "React", "Storybook", "TypeScript", "Tailwind CSS"],
    featured: false,
    category: "ux-ui",
    image: "/projects/design-system.jpg",
    liveUrl: "https://design-system-demo.com",
    githubUrl: "https://github.com/mikhailajaj/design-system",
    status: "completed",
    startDate: "2024-04-01",
    endDate: "2024-06-15",
    lastUpdated: Date.now(),
  },
  {
    id: "5",
    title: "Mobile Banking App",
    description:
      "Secure mobile banking application with biometric authentication",
    technologies: ["React Native", "Node.js", "MongoDB", "Firebase", "Stripe"],
    featured: false,
    category: "full-stack",
    image: "/projects/mobile-banking.jpg",
    liveUrl: "https://mobile-banking-demo.com",
    githubUrl: "https://github.com/mikhailajaj/mobile-banking",
    status: "in-progress",
    startDate: "2024-05-01",
    endDate: null,
    lastUpdated: Date.now(),
  },
  {
    id: "6",
    title: "AI-Powered Chatbot",
    description:
      "Intelligent customer service chatbot with natural language processing",
    technologies: ["Python", "OpenAI", "FastAPI", "React", "WebSocket"],
    featured: true,
    category: "consulting",
    image: "/projects/ai-chatbot.jpg",
    liveUrl: "https://ai-chatbot-demo.com",
    githubUrl: "https://github.com/mikhailajaj/ai-chatbot",
    status: "completed",
    startDate: "2024-06-01",
    endDate: "2024-08-15",
    lastUpdated: Date.now(),
  },
];

export async function GET() {
  try {
    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      data: demoProjects,
      status: "success",
      timestamp: Date.now(),
      total: demoProjects.length,
    });
  } catch (error) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      {
        data: [],
        status: "error",
        message: "Failed to fetch projects",
        timestamp: Date.now(),
      },
      { status: 500 },
    );
  }
}

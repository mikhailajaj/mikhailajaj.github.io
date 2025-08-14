import { NextResponse } from "next/server";

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Demo technology data
const demoTechnologies = [
  {
    id: "1",
    name: "React",
    category: "Frontend",
    proficiency: 95,
    yearsExperience: 5,
    description:
      "Advanced React development with hooks, context, and performance optimization",
    icon: "/icons/react.svg",
    color: "#61DAFB",
    featured: true,
    projects: ["1", "3", "4", "5"],
    lastUsed: "2024-12-01",
    lastUpdated: Date.now(),
  },
  {
    id: "2",
    name: "Node.js",
    category: "Backend",
    proficiency: 90,
    yearsExperience: 4,
    description:
      "Server-side JavaScript with Express, API development, and microservices",
    icon: "/icons/nodejs.svg",
    color: "#339933",
    featured: true,
    projects: ["1", "2", "5"],
    lastUsed: "2024-11-28",
    lastUpdated: Date.now(),
  },
  {
    id: "3",
    name: "AWS",
    category: "Cloud",
    proficiency: 88,
    yearsExperience: 3,
    description:
      "Cloud infrastructure, serverless, containers, and DevOps automation",
    icon: "/icons/aws.svg",
    color: "#FF9900",
    featured: true,
    projects: ["1", "2"],
    lastUsed: "2024-12-05",
    lastUpdated: Date.now(),
  },
  {
    id: "4",
    name: "TypeScript",
    category: "Language",
    proficiency: 92,
    yearsExperience: 4,
    description: "Type-safe JavaScript development with advanced type systems",
    icon: "/icons/typescript.svg",
    color: "#3178C6",
    featured: true,
    projects: ["1", "3", "4", "5"],
    lastUsed: "2024-12-10",
    lastUpdated: Date.now(),
  },
  {
    id: "5",
    name: "Python",
    category: "Language",
    proficiency: 85,
    yearsExperience: 3,
    description: "Data science, machine learning, and backend API development",
    icon: "/icons/python.svg",
    color: "#3776AB",
    featured: true,
    projects: ["3", "6"],
    lastUsed: "2024-11-15",
    lastUpdated: Date.now(),
  },
  {
    id: "6",
    name: "PostgreSQL",
    category: "Database",
    proficiency: 82,
    yearsExperience: 4,
    description: "Advanced SQL, database design, and performance optimization",
    icon: "/icons/postgresql.svg",
    color: "#336791",
    featured: false,
    projects: ["1", "3"],
    lastUsed: "2024-10-20",
    lastUpdated: Date.now(),
  },
  {
    id: "7",
    name: "Docker",
    category: "DevOps",
    proficiency: 80,
    yearsExperience: 3,
    description: "Containerization, orchestration, and deployment automation",
    icon: "/icons/docker.svg",
    color: "#2496ED",
    featured: false,
    projects: ["2"],
    lastUsed: "2024-11-30",
    lastUpdated: Date.now(),
  },
  {
    id: "8",
    name: "Figma",
    category: "Design",
    proficiency: 78,
    yearsExperience: 2,
    description: "UI/UX design, prototyping, and design system creation",
    icon: "/icons/figma.svg",
    color: "#F24E1E",
    featured: false,
    projects: ["4"],
    lastUsed: "2024-09-15",
    lastUpdated: Date.now(),
  },
];

export async function GET() {
  try {
    // Simulate API delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 120));

    return NextResponse.json({
      data: demoTechnologies,
      status: "success",
      timestamp: Date.now(),
      total: demoTechnologies.length,
    });
  } catch (error) {
    console.error("Technologies API error:", error);
    return NextResponse.json(
      {
        data: [],
        status: "error",
        message: "Failed to fetch technologies",
        timestamp: Date.now(),
      },
      { status: 500 },
    );
  }
}

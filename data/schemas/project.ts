export type Domain = "full-stack" | "cloud" | "data" | "ux-ui" | "consulting";

export interface Technology {
  name: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "devops"
    | "analytics"
    | "design"
    | "other";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  icon?: string;
}

export interface ProjectImpact {
  metrics: string[];
  roi?: string;
  performance?: string;
  userSatisfaction?: string;
  businessValue?: string;
}

export interface ClientInfo {
  name: string;
  industry: string;
  size: "startup" | "small" | "medium" | "large" | "enterprise";
  testimonial?: string;
  logo?: string;
  website?: string;
}

export interface Image {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface Project {
  id: string;
  title: string;
  domain: Domain;
  description: string;
  problem: string;
  solution: string;
  impact: ProjectImpact;
  techStack: Technology[];
  timeline: string;
  status: "completed" | "in-progress" | "planned";
  client?: ClientInfo;
  gallery: Image[];
  liveDemo?: string;
  codeRepo?: string;
  caseStudyUrl?: string;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProjectFilter {
  domain?: Domain;
  technology?: string;
  status?: Project["status"];
  featured?: boolean;
  tags?: string[];
}

export interface ProjectSortOptions {
  field: "createdAt" | "updatedAt" | "title" | "timeline";
  direction: "asc" | "desc";
}

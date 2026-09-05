export type Domain =
  | "full-stack"
  | "cloud"
  | "data"
  | "ux-ui"
  | "consulting";

export interface Technology {
  name: string;
  category:
    | "frontend"
    | "backend"
    | "database"
    | "cloud"
    | "devops"
    | "design"
    | "other";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  icon?: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  position: string;
  company: string;
}

export interface ProjectImpact {
  metrics: string[];
  roi?: string;
  businessValue?: string;
  testimonial?: ProjectTestimonial;
}

/** Screenshots carry intrinsic dimensions so the browser can reserve space. */
export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProjectFeatureGroup {
  title: string;
  items: string[];
}

export interface ProjectTechnicalDetails {
  architecture?: string;
  highlights?: string[];
  performance?: string[];
}

export interface Project {
  id: string;
  title: string;
  /** Short title for cards and nav, where the full title is too long. */
  shortTitle?: string;
  domain: Domain;
  description: string;
  problem: string;
  solution: string;
  impact: ProjectImpact;
  technologies: Technology[];
  tags: string[];

  status: "completed" | "in-progress" | "planned";
  featured: boolean;
  /** Calendar year the work landed, e.g. "2025". */
  year?: string;
  /** How long the work took, e.g. "8 months". */
  duration?: string;
  role?: string;
  teamSize?: number;
  client?: string;

  links?: { github?: string; demo?: string };
  images?: ProjectImage[];

  highlights?: string[];
  features?: ProjectFeatureGroup[];
  technicalDetails?: ProjectTechnicalDetails;
}

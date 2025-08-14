/**
 * Production-Ready Context Types
 * Clean, well-defined TypeScript interfaces
 */

import { Project, Testimonial } from "@/data/types";

// ✅ Project Context Types
export interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (forceRefresh?: boolean) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
  getFeaturedProjects: () => Project[];
  getProjectsByTechnology: (tech: string) => Project[];
}

// ✅ Testimonial Context Types
export interface TestimonialContextType {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  fetchTestimonials: (forceRefresh?: boolean) => Promise<void>;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  getTestimonialById: (id: string) => Testimonial | undefined;
  getFeaturedTestimonials: () => Testimonial[];
  getTestimonialsByRating: (minRating: number) => Testimonial[];
}

// ✅ Performance Monitoring Types
export interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderDuration: number;
  contextSubscriptions: string[];
}

export interface CacheStats {
  size: number;
  keys: string[];
}

export interface OverallPerformanceStats {
  totalComponents: number;
  slowComponents: number;
  averageRenderTime: number;
  totalRenders: number;
}

export interface ContextHealthStatus {
  projectContext: "healthy" | "error" | "unknown";
  testimonialContext: "healthy" | "error" | "unknown";
  overallHealth: "healthy" | "error" | "unknown";
}

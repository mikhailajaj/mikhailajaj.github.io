/**
 * Project Type Definitions
 * 
 * TypeScript interfaces and types for project-related data structures.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planned';
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFilters {
  category: string;
  technology: string;
  status: string;
  search: string;
}

export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
  featured: number;
  categories: Record<string, number>;
}

export type ProjectStatus = Project['status'];
export type ProjectCategory = string;

// Domain types for project categorization
export type Domain = 
  | 'fullstack'
  | 'cloud'
  | 'data'
  | 'ux'
  | 'ai'
  | 'blockchain'
  | 'iot'
  | 'mobile'
  | 'consulting';

export interface DomainTheme {
  id: Domain;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  technologies: string[];
}
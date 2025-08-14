/**
 * Production-Ready Project Context
 * Clean, optimized context with centralized data service
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Project } from "@/data/types";
import { projectService } from "@/lib/services/DataService";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (forceRefresh?: boolean) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
  getFeaturedProjects: () => Project[];
  getProjectsByTechnology: (tech: string) => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const projectData = await projectService.fetchAll(forceRefresh);
      setProjects(projectData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(errorMessage);
      console.error("Project fetch error:", errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === id
          ? { ...project, ...updates, lastUpdated: Date.now() }
          : project,
      ),
    );
  }, []);

  const getProjectById = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id);
    },
    [projects],
  );

  const getFeaturedProjects = useCallback(() => {
    return projects.filter((project) => project.featured);
  }, [projects]);

  const getProjectsByTechnology = useCallback(
    (tech: string) => {
      return projects.filter((project) =>
        project.technologies?.some((technology) =>
          technology.toLowerCase().includes(tech.toLowerCase()),
        ),
      );
    },
    [projects],
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const contextValue = useMemo(
    () => ({
      projects,
      loading,
      error,
      fetchProjects,
      updateProject,
      getProjectById,
      getFeaturedProjects,
      getProjectsByTechnology,
    }),
    [
      projects,
      loading,
      error,
      fetchProjects,
      updateProject,
      getProjectById,
      getFeaturedProjects,
      getProjectsByTechnology,
    ],
  );

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectData(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectData must be used within a ProjectProvider");
  }
  return context;
}

export function useProjectSelector<T>(
  selector: (context: ProjectContextType) => T,
): T {
  const context = useProjectData();
  return useMemo(() => selector(context), [context, selector]);
}

export function useProjects() {
  return useProjectSelector((context) => context.projects);
}

export function useFeaturedProjects() {
  return useProjectSelector((context) => context.getFeaturedProjects());
}

export function useProjectLoading() {
  return useProjectSelector((context) => context.loading);
}

export function useProjectError() {
  return useProjectSelector((context) => context.error);
}

export function useProjectById(id: string) {
  return useProjectSelector((context) => context.getProjectById(id));
}

export function useProjectsByTechnology(tech: string) {
  return useProjectSelector((context) => context.getProjectsByTechnology(tech));
}

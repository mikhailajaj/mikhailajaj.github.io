/**
 * Refactored Project Context - Clean Code Implementation
 * Following "The Clean Code Cookbook" principles
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
import {
  createErrorMessage,
  logErrorWithContext,
  createLoadingState,
  createErrorState,
  createSuccessState,
  filterFeaturedProjects,
  filterProjectsByTechnology,
  findProjectById,
  updateProjectWithTimestamp,
} from "@/lib/utils/cleanCodeHelpers";

// ✅ Principle 1: Name Things Like They Matter
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

// ✅ Principle 2: Keep Functions Focused - Refactored Provider
export function RefactoredProjectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ Focused function: Fetch projects with clean error handling
   */
  const fetchProjects = useCallback(async (forceRefresh = false) => {
    const loadingState = createLoadingState();
    setLoading(loadingState.loading);
    setError(loadingState.error);

    try {
      const projectData = await fetchProjectsFromService(forceRefresh);
      handleSuccessfulProjectFetch(
        projectData,
        setProjects,
        setLoading,
        setError,
      );
    } catch (err) {
      handleProjectFetchError(err, setError, setLoading);
    }
  }, []);

  /**
   * ✅ Focused function: Update project with immutable pattern
   */
  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prevProjects) =>
      updateProjectInList(prevProjects, id, updates),
    );
  }, []);

  /**
   * ✅ Focused function: Get project by ID
   */
  const getProjectById = useCallback(
    (id: string) => {
      return findProjectById(projects, id);
    },
    [projects],
  );

  /**
   * ✅ Focused function: Get featured projects
   */
  const getFeaturedProjects = useCallback(() => {
    return filterFeaturedProjects(projects);
  }, [projects]);

  /**
   * ✅ Focused function: Get projects by technology
   */
  const getProjectsByTechnology = useCallback(
    (tech: string) => {
      return filterProjectsByTechnology(projects, tech);
    },
    [projects],
  );

  // ✅ Auto-fetch on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ✅ Memoized context value
  const contextValue = useMemo(
    () =>
      createProjectContextValue({
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

/**
 * ✅ Focused function: Fetch projects from service
 */
async function fetchProjectsFromService(
  forceRefresh: boolean,
): Promise<Project[]> {
  return await projectService.fetchAll(forceRefresh);
}

/**
 * ✅ Focused function: Handle successful project fetch
 */
function handleSuccessfulProjectFetch(
  projectData: Project[],
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
): void {
  const successState = createSuccessState();
  setProjects(projectData);
  setLoading(successState.loading);
  setError(successState.error);
}

/**
 * ✅ Focused function: Handle project fetch error
 */
function handleProjectFetchError(
  error: unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  const errorMessage = createErrorMessage(error, "Failed to fetch projects");
  const errorState = createErrorState(errorMessage);

  logErrorWithContext("ProjectContext", error, { operation: "fetchProjects" });

  setError(errorState.error);
  setLoading(errorState.loading);
}

/**
 * ✅ Focused function: Update project in list
 */
function updateProjectInList(
  projects: Project[],
  projectId: string,
  updates: Partial<Project>,
): Project[] {
  return projects.map((project) =>
    project.id === projectId
      ? updateProjectWithTimestamp(project, updates)
      : project,
  );
}

/**
 * ✅ Focused function: Create context value
 */
function createProjectContextValue(params: {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: (forceRefresh?: boolean) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => void;
  getProjectById: (id: string) => Project | undefined;
  getFeaturedProjects: () => Project[];
  getProjectsByTechnology: (tech: string) => Project[];
}): ProjectContextType {
  return {
    projects: params.projects,
    loading: params.loading,
    error: params.error,
    fetchProjects: params.fetchProjects,
    updateProject: params.updateProject,
    getProjectById: params.getProjectById,
    getFeaturedProjects: params.getFeaturedProjects,
    getProjectsByTechnology: params.getProjectsByTechnology,
  };
}

/**
 * ✅ Focused function: Custom hook with error handling
 */
export function useRefactoredProjectData(): ProjectContextType {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error(
      "useRefactoredProjectData must be used within a RefactoredProjectProvider",
    );
  }

  return context;
}

/**
 * ✅ Focused function: Context selector hook
 */
export function useRefactoredProjectSelector<T>(
  selector: (context: ProjectContextType) => T,
): T {
  const context = useRefactoredProjectData();
  return useMemo(() => selector(context), [context, selector]);
}

/**
 * ✅ Specialized hooks - single responsibility
 */
export function useRefactoredProjects() {
  return useRefactoredProjectSelector((context) => context.projects);
}

export function useRefactoredFeaturedProjects() {
  return useRefactoredProjectSelector((context) =>
    context.getFeaturedProjects(),
  );
}

export function useRefactoredProjectLoading() {
  return useRefactoredProjectSelector((context) => context.loading);
}

export function useRefactoredProjectError() {
  return useRefactoredProjectSelector((context) => context.error);
}

export function useRefactoredProjectById(id: string) {
  return useRefactoredProjectSelector((context) => context.getProjectById(id));
}

export function useRefactoredProjectsByTechnology(tech: string) {
  return useRefactoredProjectSelector((context) =>
    context.getProjectsByTechnology(tech),
  );
}

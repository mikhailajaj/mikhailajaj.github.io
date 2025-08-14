/**
 * Clean Code Helper Functions
 * Following "The Clean Code Cookbook" principles
 */

// ✅ Principle 1: Name Things Like They Matter
// ✅ Principle 2: Keep Functions Focused (Single Responsibility)

/**
 * Error handling utilities - focused functions
 */
export function createErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

export function logErrorWithContext(
  context: string,
  error: unknown,
  additionalData?: Record<string, any>,
): void {
  const errorMessage = createErrorMessage(error, "Unknown error occurred");
  console.error(`[${context}] ${errorMessage}`, {
    error,
    timestamp: new Date().toISOString(),
    context,
    ...additionalData,
  });
}

/**
 * Cache validation utilities - pure functions
 */
export function isCacheEntryValid(
  timestamp: number,
  ttl: number,
  currentTime: number = Date.now(),
): boolean {
  return currentTime - timestamp < ttl;
}

export function createCacheKey(prefix: string, identifier: string): string {
  return `${prefix}_${identifier}`;
}

/**
 * Retry logic utilities - focused functions
 */
export function calculateExponentialBackoffDelay(
  attempt: number,
  baseDelay: number = 1000,
): number {
  return Math.pow(2, attempt) * baseDelay;
}

export function shouldRetryRequest(
  attempt: number,
  maxRetries: number,
): boolean {
  return attempt < maxRetries;
}

/**
 * Array filtering utilities - pure functions
 */
export function filterProjectsByStatus(
  projects: Project[],
  status: string,
): Project[] {
  return projects.filter((project) => project.status === status);
}

export function filterProjectsByTechnology(
  projects: Project[],
  technology: string,
): Project[] {
  return projects.filter((project) =>
    project.technologies?.some((tech) =>
      tech.toLowerCase().includes(technology.toLowerCase()),
    ),
  );
}

export function filterFeaturedProjects(projects: Project[]): Project[] {
  return projects.filter((project) => project.featured === true);
}

/**
 * Project transformation utilities - pure functions
 */
export function updateProjectWithTimestamp(
  project: Project,
  updates: Partial<Project>,
): Project {
  return {
    ...project,
    ...updates,
    lastUpdated: Date.now(),
  };
}

export function findProjectById(
  projects: Project[],
  projectId: string,
): Project | undefined {
  return projects.find((project) => project.id === projectId);
}

/**
 * State management utilities - focused functions
 */
export function createLoadingState(): {
  loading: boolean;
  error: string | null;
} {
  return { loading: true, error: null };
}

export function createErrorState(errorMessage: string): {
  loading: boolean;
  error: string;
} {
  return { loading: false, error: errorMessage };
}

export function createSuccessState(): {
  loading: boolean;
  error: string | null;
} {
  return { loading: false, error: null };
}

/**
 * Mouse position utilities - pure functions
 */
export function normalizeMousePosition(
  clientX: number,
  clientY: number,
  windowWidth: number,
  windowHeight: number,
): { x: number; y: number } {
  return {
    x: (clientX / windowWidth) * 2 - 1,
    y: (clientY / windowHeight) * 2 - 1,
  };
}

/**
 * Animation utilities - focused functions
 */
export function createFloatingShapeStyle(index: number): {
  left: string;
  top: string;
} {
  return {
    left: `${20 + index * 15}%`,
    top: `${30 + index * 10}%`,
  };
}

export function createFloatingShapeAnimation(index: number) {
  return {
    y: [0, -20, 0],
    opacity: [0.2, 0.8, 0.2],
    scale: [1, 1.2, 1],
  };
}

export function createFloatingShapeTransition(index: number) {
  return {
    duration: 3 + index * 0.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay: index * 0.2,
  };
}

/**
 * Type definitions for clean code
 */
interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  featured?: boolean;
  status?: string;
  lastUpdated?: number;
}

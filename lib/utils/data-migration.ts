/**
 * Data Migration Utilities
 * Handles migration from legacy data structures to new type-safe architecture
 */

import {
  Project,
  Service,
  BlogPost,
  Testimonial,
  Technology,
  ClientInfo,
  ProjectImpact,
} from "@/data/types";
import {
  Result,
  isValidTechnicalDomain,
  isValidProjectStatus,
  isValidDate,
  isNonEmptyString,
  safeJsonParse,
  deepClone,
} from "@/lib/utils/base-types";

// ============================================================================
// LEGACY TYPE DEFINITIONS
// ============================================================================

/**
 * Legacy project interface (for migration)
 */
interface LegacyProject {
  id: string;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  [key: string]: any;
}

/**
 * Legacy testimonial interface (for migration)
 */
interface LegacyTestimonial {
  quote: string;
  name: string;
  title: string;
  [key: string]: any;
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

/**
 * Migrate legacy project to new Project type
 */
export const migrateLegacyProject = (
  legacy: LegacyProject,
): Result<Project> => {
  try {
    // Validate required fields
    if (!isNonEmptyString(legacy.id)) {
      return { success: false, error: new Error("Invalid project ID") };
    }

    if (!isNonEmptyString(legacy.title)) {
      return { success: false, error: new Error("Invalid project title") };
    }

    // Create new project structure
    const project: Project = {
      id: legacy.id,
      title: legacy.title,
      description: legacy.des || "",
      slug: legacy.id.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      domain: "full-stack", // Default domain, should be updated manually
      problem: legacy.problem || "Problem statement to be added",
      solution: legacy.solution || "Solution description to be added",
      impact: {
        metrics: legacy.metrics || [],
        roi: legacy.roi,
        performance: legacy.performance,
        userSatisfaction: legacy.userSatisfaction,
        businessValue: legacy.businessValue,
      },
      techStack: (legacy.iconLists || []).map(
        (tech: string, index: number) => ({
          id: `tech-${legacy.id}-${index}`,
          name: tech,
          category: "other" as const,
          proficiency: "advanced" as const,
          icon: tech.toLowerCase(),
        }),
      ),
      timeline: {
        startDate: new Date(),
        estimatedDuration: legacy.timeline || "3 months",
        milestones: [],
      },
      status: "completed" as const,
      gallery: legacy.img
        ? [
            {
              id: `img-${legacy.id}`,
              src: legacy.img,
              alt: `${legacy.title} screenshot`,
              format: "jpg" as const,
            },
          ]
        : [],
      liveDemo: legacy.link,
      featured: legacy.featured || false,
      tags: legacy.tags || [],
      complexity: "medium" as const,
      createdAt: new Date(),
      metadata: {
        source: "legacy-migration",
        status: "active",
      },
    };

    return { success: true, data: project };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Migration failed"),
    };
  }
};

/**
 * Migrate legacy testimonial to new Testimonial type
 */
export const migrateLegacyTestimonial = (
  legacy: LegacyTestimonial,
  index: number,
): Result<Testimonial> => {
  try {
    if (!isNonEmptyString(legacy.quote)) {
      return { success: false, error: new Error("Invalid testimonial quote") };
    }

    if (!isNonEmptyString(legacy.name)) {
      return { success: false, error: new Error("Invalid testimonial name") };
    }

    const testimonial: Testimonial = {
      id: `testimonial-legacy-${index}`,
      client: legacy.name,
      role: legacy.title || "Client",
      company: legacy.company || "Company Name",
      testimonial: legacy.quote,
      project: legacy.project || "Legacy Project",
      rating: legacy.rating || 5,
      date: new Date(),
      featured: legacy.featured || false,
      category: "full-stack", // Default category
      verified: false,
      source: "direct",
      permissions: {
        useFullName: true,
        useCompanyName: true,
        useImage: false,
        useForMarketing: true,
      },
      createdAt: new Date(),
      metadata: {
        source: "legacy-migration",
        status: "active",
      },
    };

    return { success: true, data: testimonial };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error
          : new Error("Testimonial migration failed"),
    };
  }
};

/**
 * Validate migrated data structure
 */
export const validateMigratedProject = (project: Project): Result<Project> => {
  const errors: string[] = [];

  // Validate required fields
  if (!isNonEmptyString(project.id)) {
    errors.push("Invalid project ID");
  }

  if (!isNonEmptyString(project.title)) {
    errors.push("Invalid project title");
  }

  if (!isValidTechnicalDomain(project.domain)) {
    errors.push("Invalid technical domain");
  }

  if (!isValidProjectStatus(project.status)) {
    errors.push("Invalid project status");
  }

  if (!isValidDate(project.createdAt)) {
    errors.push("Invalid creation date");
  }

  // Validate tech stack
  if (!Array.isArray(project.techStack)) {
    errors.push("Tech stack must be an array");
  }

  // Validate timeline
  if (!project.timeline || !isValidDate(project.timeline.startDate)) {
    errors.push("Invalid timeline structure");
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: new Error(`Validation failed: ${errors.join(", ")}`),
    };
  }

  return { success: true, data: project };
};

/**
 * Batch migrate legacy projects
 */
export const batchMigrateLegacyProjects = (
  legacyProjects: LegacyProject[],
): Result<Project[]> => {
  const migratedProjects: Project[] = [];
  const errors: string[] = [];

  for (const [index, legacyProject] of legacyProjects.entries()) {
    const migrationResult = migrateLegacyProject(legacyProject);

    if (migrationResult.success) {
      const validationResult = validateMigratedProject(migrationResult.data);

      if (validationResult.success) {
        migratedProjects.push(validationResult.data);
      } else {
        errors.push(`Project ${index}: ${validationResult.error.message}`);
      }
    } else {
      errors.push(`Project ${index}: ${migrationResult.error.message}`);
    }
  }

  if (errors.length > 0) {
    console.warn("Migration warnings:", errors);
  }

  return { success: true, data: migratedProjects };
};

/**
 * Batch migrate legacy testimonials
 */
export const batchMigrateLegacyTestimonials = (
  legacyTestimonials: LegacyTestimonial[],
): Result<Testimonial[]> => {
  const migratedTestimonials: Testimonial[] = [];
  const errors: string[] = [];

  for (const [index, legacyTestimonial] of legacyTestimonials.entries()) {
    const migrationResult = migrateLegacyTestimonial(legacyTestimonial, index);

    if (migrationResult.success) {
      migratedTestimonials.push(migrationResult.data);
    } else {
      errors.push(`Testimonial ${index}: ${migrationResult.error.message}`);
    }
  }

  if (errors.length > 0) {
    console.warn("Testimonial migration warnings:", errors);
  }

  return { success: true, data: migratedTestimonials };
};

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Transform string array to Technology array
 */
export const transformTechnologies = (
  techNames: string[],
  domain: string = "other",
): Technology[] => {
  return techNames.map((name, index) => ({
    id: `tech-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${index}`,
    name,
    category: "other" as const,
    proficiency: "advanced" as const,
    description: `${name} technology used in projects`,
    metadata: {
      source: "auto-generated",
      status: "active",
    },
  }));
};

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

/**
 * Extract domain from project data
 */
export const extractDomain = (project: any): string => {
  // Logic to determine domain based on technologies, description, etc.
  const techStack = project.techStack || project.iconLists || [];

  if (
    techStack.some(
      (tech: string) =>
        tech.toLowerCase().includes("aws") ||
        tech.toLowerCase().includes("cloud"),
    )
  ) {
    return "cloud-engineering";
  }

  if (
    techStack.some(
      (tech: string) =>
        tech.toLowerCase().includes("data") ||
        tech.toLowerCase().includes("analytics"),
    )
  ) {
    return "data-analytics";
  }

  if (
    techStack.some(
      (tech: string) =>
        tech.toLowerCase().includes("figma") ||
        tech.toLowerCase().includes("design"),
    )
  ) {
    return "ux-ui-design";
  }

  if (
    project.description?.toLowerCase().includes("consulting") ||
    project.title?.toLowerCase().includes("consulting")
  ) {
    return "technical-consulting";
  }

  return "full-stack"; // Default
};

/**
 * Clean and normalize data
 */
export const cleanData = <T>(data: T): T => {
  const cleaned = deepClone(data);

  // Remove null/undefined values
  const removeEmpty = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj
        .map(removeEmpty)
        .filter((item) => item !== null && item !== undefined);
    }

    if (obj && typeof obj === "object") {
      const cleanedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined && value !== "") {
          cleanedObj[key] = removeEmpty(value);
        }
      }
      return cleanedObj;
    }

    return obj;
  };

  return removeEmpty(cleaned);
};

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export const migrationUtils = {
  migrateLegacyProject,
  migrateLegacyTestimonial,
  validateMigratedProject,
  batchMigrateLegacyProjects,
  batchMigrateLegacyTestimonials,
  transformTechnologies,
  generateSlug,
  extractDomain,
  cleanData,
};

export default migrationUtils;

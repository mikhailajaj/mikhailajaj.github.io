/**
 * Data Validation Utilities
 * Comprehensive validation for all portfolio data types
 */

import {
  Project,
  Service,
  BlogPost,
  Testimonial,
  Technology,
  ClientInfo,
  ServiceInquiry,
  ContactSubmission,
} from "@/data/types";
import {
  Result,
  isValidTechnicalDomain,
  isValidTechnologyCategory,
  isValidProficiencyLevel,
  isValidProjectStatus,
  isValidDate,
  isNonEmptyString,
  isNonEmptyArray,
  isValidEmail,
  isValidUrl,
  TECHNICAL_DOMAINS,
  TECHNOLOGY_CATEGORIES,
  PROFICIENCY_LEVELS,
  PROJECT_STATUSES,
} from "@/lib/utils/base-types";

// ============================================================================
// VALIDATION ERROR TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Create validation error
 */
const createError = (
  field: string,
  message: string,
  code: string,
  value?: any,
): ValidationError => ({
  field,
  message,
  code,
  value,
});

/**
 * Create validation warning
 */
const createWarning = (
  field: string,
  message: string,
  code: string,
  value?: any,
): ValidationError => ({
  field,
  message,
  code,
  value,
});

/**
 * Validate required string field
 */
const validateRequiredString = (
  value: any,
  fieldName: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isNonEmptyString(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} is required and must be a non-empty string`,
        "REQUIRED_STRING",
        value,
      ),
    );
  }

  return errors;
};

/**
 * Validate optional string field
 */
const validateOptionalString = (
  value: any,
  fieldName: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (value !== undefined && value !== null && !isNonEmptyString(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} must be a non-empty string if provided`,
        "INVALID_STRING",
        value,
      ),
    );
  }

  return errors;
};

/**
 * Validate required date field
 */
const validateRequiredDate = (
  value: any,
  fieldName: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!isValidDate(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} is required and must be a valid date`,
        "REQUIRED_DATE",
        value,
      ),
    );
  }

  return errors;
};

/**
 * Validate optional date field
 */
const validateOptionalDate = (
  value: any,
  fieldName: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (value !== undefined && value !== null && !isValidDate(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} must be a valid date if provided`,
        "INVALID_DATE",
        value,
      ),
    );
  }

  return errors;
};

/**
 * Validate email field
 */
const validateEmail = (
  value: any,
  fieldName: string,
  required: boolean = true,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (required && !value) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} is required`,
        "REQUIRED_EMAIL",
        value,
      ),
    );
  } else if (value && !isValidEmail(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} must be a valid email address`,
        "INVALID_EMAIL",
        value,
      ),
    );
  }

  return errors;
};

/**
 * Validate URL field
 */
const validateUrl = (
  value: any,
  fieldName: string,
  required: boolean = false,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (required && !value) {
    errors.push(
      createError(fieldName, `${fieldName} is required`, "REQUIRED_URL", value),
    );
  } else if (value && !isValidUrl(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} must be a valid URL`,
        "INVALID_URL",
        value,
      ),
    );
  }

  return errors;
};

/**
 * Validate array field
 */
const validateArray = (
  value: any,
  fieldName: string,
  required: boolean = false,
  minLength: number = 0,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (required && (!value || !Array.isArray(value))) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} is required and must be an array`,
        "REQUIRED_ARRAY",
        value,
      ),
    );
  } else if (value && !Array.isArray(value)) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} must be an array`,
        "INVALID_ARRAY",
        value,
      ),
    );
  } else if (value && Array.isArray(value) && value.length < minLength) {
    errors.push(
      createError(
        fieldName,
        `${fieldName} must have at least ${minLength} items`,
        "ARRAY_MIN_LENGTH",
        value,
      ),
    );
  }

  return errors;
};

// ============================================================================
// TECHNOLOGY VALIDATION
// ============================================================================

/**
 * Validate Technology object
 */
export const validateTechnology = (
  technology: any,
): ValidationResult<Technology> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate required fields
  errors.push(...validateRequiredString(technology?.id, "id"));
  errors.push(...validateRequiredString(technology?.name, "name"));

  // Validate category
  if (!isValidTechnologyCategory(technology?.category)) {
    errors.push(
      createError(
        "category",
        `Category must be one of: ${TECHNOLOGY_CATEGORIES.join(", ")}`,
        "INVALID_CATEGORY",
        technology?.category,
      ),
    );
  }

  // Validate proficiency
  if (!isValidProficiencyLevel(technology?.proficiency)) {
    errors.push(
      createError(
        "proficiency",
        `Proficiency must be one of: ${PROFICIENCY_LEVELS.join(", ")}`,
        "INVALID_PROFICIENCY",
        technology?.proficiency,
      ),
    );
  }

  // Validate optional fields
  errors.push(
    ...validateOptionalString(technology?.description, "description"),
  );
  errors.push(...validateOptionalString(technology?.icon, "icon"));
  errors.push(...validateOptionalDate(technology?.lastUsed, "lastUsed"));

  // Validate years of experience
  if (
    technology?.yearsOfExperience !== undefined &&
    (typeof technology.yearsOfExperience !== "number" ||
      technology.yearsOfExperience < 0)
  ) {
    errors.push(
      createError(
        "yearsOfExperience",
        "Years of experience must be a non-negative number",
        "INVALID_YEARS",
        technology?.yearsOfExperience,
      ),
    );
  }

  // Validate arrays
  errors.push(...validateArray(technology?.certifications, "certifications"));
  errors.push(
    ...validateArray(technology?.relatedTechnologies, "relatedTechnologies"),
  );

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? (technology as Technology) : undefined,
    errors,
    warnings,
  };
};

// ============================================================================
// PROJECT VALIDATION
// ============================================================================

/**
 * Validate Project object
 */
export const validateProject = (project: any): ValidationResult<Project> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate base entity fields
  errors.push(...validateRequiredString(project?.id, "id"));
  errors.push(...validateRequiredDate(project?.createdAt, "createdAt"));
  errors.push(...validateOptionalDate(project?.updatedAt, "updatedAt"));

  // Validate content fields
  errors.push(...validateRequiredString(project?.title, "title"));
  errors.push(...validateRequiredString(project?.description, "description"));
  errors.push(...validateOptionalString(project?.slug, "slug"));

  // Validate domain
  if (!isValidTechnicalDomain(project?.domain)) {
    errors.push(
      createError(
        "domain",
        `Domain must be one of: ${TECHNICAL_DOMAINS.join(", ")}`,
        "INVALID_DOMAIN",
        project?.domain,
      ),
    );
  }

  // Validate project-specific fields
  errors.push(...validateRequiredString(project?.problem, "problem"));
  errors.push(...validateRequiredString(project?.solution, "solution"));

  // Validate status
  if (!isValidProjectStatus(project?.status)) {
    errors.push(
      createError(
        "status",
        `Status must be one of: ${PROJECT_STATUSES.join(", ")}`,
        "INVALID_STATUS",
        project?.status,
      ),
    );
  }

  // Validate tech stack
  errors.push(...validateArray(project?.techStack, "techStack", true, 1));
  if (project?.techStack && Array.isArray(project.techStack)) {
    project.techStack.forEach((tech: any, index: number) => {
      const techValidation = validateTechnology(tech);
      if (!techValidation.isValid) {
        techValidation.errors.forEach((error) => {
          errors.push(
            createError(
              `techStack[${index}].${error.field}`,
              error.message,
              error.code,
              error.value,
            ),
          );
        });
      }
    });
  }

  // Validate timeline
  if (!project?.timeline) {
    errors.push(
      createError("timeline", "Timeline is required", "REQUIRED_TIMELINE"),
    );
  } else {
    errors.push(
      ...validateRequiredDate(project.timeline.startDate, "timeline.startDate"),
    );
    errors.push(
      ...validateOptionalDate(project.timeline.endDate, "timeline.endDate"),
    );
    errors.push(
      ...validateRequiredString(
        project.timeline.estimatedDuration,
        "timeline.estimatedDuration",
      ),
    );
  }

  // Validate impact
  if (!project?.impact) {
    errors.push(createError("impact", "Impact is required", "REQUIRED_IMPACT"));
  } else {
    errors.push(
      ...validateArray(project.impact.metrics, "impact.metrics", true, 1),
    );
  }

  // Validate optional URLs
  errors.push(...validateUrl(project?.liveDemo, "liveDemo"));
  errors.push(...validateUrl(project?.codeRepo, "codeRepo"));
  errors.push(...validateUrl(project?.caseStudyUrl, "caseStudyUrl"));

  // Validate arrays
  errors.push(...validateArray(project?.gallery, "gallery"));
  errors.push(...validateArray(project?.tags, "tags"));

  // Validate complexity
  const validComplexities = ["low", "medium", "high", "enterprise"];
  if (project?.complexity && !validComplexities.includes(project.complexity)) {
    errors.push(
      createError(
        "complexity",
        `Complexity must be one of: ${validComplexities.join(", ")}`,
        "INVALID_COMPLEXITY",
        project?.complexity,
      ),
    );
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? (project as Project) : undefined,
    errors,
    warnings,
  };
};

// ============================================================================
// SERVICE VALIDATION
// ============================================================================

/**
 * Validate Service object
 */
export const validateService = (service: any): ValidationResult<Service> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate base fields
  errors.push(...validateRequiredString(service?.id, "id"));
  errors.push(...validateRequiredString(service?.title, "title"));
  errors.push(...validateRequiredString(service?.description, "description"));
  errors.push(
    ...validateRequiredString(service?.shortDescription, "shortDescription"),
  );

  // Validate domain
  if (!isValidTechnicalDomain(service?.domain)) {
    errors.push(
      createError(
        "domain",
        `Domain must be one of: ${TECHNICAL_DOMAINS.join(", ")}`,
        "INVALID_DOMAIN",
        service?.domain,
      ),
    );
  }

  // Validate arrays
  errors.push(...validateArray(service?.capabilities, "capabilities", true, 1));
  errors.push(...validateArray(service?.deliverables, "deliverables", true, 1));
  errors.push(...validateArray(service?.technologies, "technologies", true, 1));
  errors.push(...validateArray(service?.benefits, "benefits", true, 1));
  errors.push(...validateArray(service?.process, "process", true, 1));

  // Validate URLs
  errors.push(...validateUrl(service?.ctaUrl, "ctaUrl", true));

  // Validate boolean fields
  if (typeof service?.featured !== "boolean") {
    errors.push(
      createError(
        "featured",
        "Featured must be a boolean",
        "INVALID_BOOLEAN",
        service?.featured,
      ),
    );
  }

  if (typeof service?.available !== "boolean") {
    errors.push(
      createError(
        "available",
        "Available must be a boolean",
        "INVALID_BOOLEAN",
        service?.available,
      ),
    );
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? (service as Service) : undefined,
    errors,
    warnings,
  };
};

// ============================================================================
// TESTIMONIAL VALIDATION
// ============================================================================

/**
 * Validate Testimonial object
 */
export const validateTestimonial = (
  testimonial: any,
): ValidationResult<Testimonial> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate required fields
  errors.push(...validateRequiredString(testimonial?.id, "id"));
  errors.push(...validateRequiredString(testimonial?.client, "client"));
  errors.push(...validateRequiredString(testimonial?.role, "role"));
  errors.push(...validateRequiredString(testimonial?.company, "company"));
  errors.push(
    ...validateRequiredString(testimonial?.testimonial, "testimonial"),
  );
  errors.push(...validateRequiredString(testimonial?.project, "project"));
  errors.push(...validateRequiredDate(testimonial?.date, "date"));

  // Validate domain
  if (!isValidTechnicalDomain(testimonial?.category)) {
    errors.push(
      createError(
        "category",
        `Category must be one of: ${TECHNICAL_DOMAINS.join(", ")}`,
        "INVALID_CATEGORY",
        testimonial?.category,
      ),
    );
  }

  // Validate rating
  if (
    typeof testimonial?.rating !== "number" ||
    testimonial.rating < 1 ||
    testimonial.rating > 5
  ) {
    errors.push(
      createError(
        "rating",
        "Rating must be a number between 1 and 5",
        "INVALID_RATING",
        testimonial?.rating,
      ),
    );
  }

  // Validate boolean fields
  const booleanFields = ["featured", "verified"];
  booleanFields.forEach((field) => {
    if (typeof testimonial?.[field] !== "boolean") {
      errors.push(
        createError(
          field,
          `${field} must be a boolean`,
          "INVALID_BOOLEAN",
          testimonial?.[field],
        ),
      );
    }
  });

  // Validate source
  const validSources = ["direct", "linkedin", "email", "survey", "interview"];
  if (testimonial?.source && !validSources.includes(testimonial.source)) {
    errors.push(
      createError(
        "source",
        `Source must be one of: ${validSources.join(", ")}`,
        "INVALID_SOURCE",
        testimonial?.source,
      ),
    );
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? (testimonial as Testimonial) : undefined,
    errors,
    warnings,
  };
};

// ============================================================================
// CONTACT VALIDATION
// ============================================================================

/**
 * Validate Contact Submission
 */
export const validateContactSubmission = (
  submission: any,
): ValidationResult<ContactSubmission> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Validate required fields
  errors.push(...validateRequiredString(submission?.name, "name"));
  errors.push(...validateEmail(submission?.email, "email", true));
  errors.push(...validateRequiredString(submission?.subject, "subject"));
  errors.push(...validateRequiredString(submission?.message, "message"));

  // Validate optional fields
  errors.push(...validateOptionalString(submission?.phone, "phone"));
  errors.push(...validateOptionalString(submission?.company, "company"));

  // Validate urgency
  const validUrgencies = ["low", "medium", "high", "urgent"];
  if (submission?.urgency && !validUrgencies.includes(submission.urgency)) {
    errors.push(
      createError(
        "urgency",
        `Urgency must be one of: ${validUrgencies.join(", ")}`,
        "INVALID_URGENCY",
        submission?.urgency,
      ),
    );
  }

  // Validate contact method
  const validMethods = ["email", "phone", "video", "in-person"];
  if (
    submission?.preferredContact &&
    !validMethods.includes(submission.preferredContact)
  ) {
    errors.push(
      createError(
        "preferredContact",
        `Preferred contact must be one of: ${validMethods.join(", ")}`,
        "INVALID_CONTACT_METHOD",
        submission?.preferredContact,
      ),
    );
  }

  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? (submission as ContactSubmission) : undefined,
    errors,
    warnings,
  };
};

// ============================================================================
// BATCH VALIDATION
// ============================================================================

/**
 * Validate array of projects
 */
export const validateProjects = (
  projects: any[],
): ValidationResult<Project[]> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validProjects: Project[] = [];

  if (!Array.isArray(projects)) {
    errors.push(
      createError(
        "projects",
        "Projects must be an array",
        "INVALID_ARRAY",
        projects,
      ),
    );
    return { isValid: false, errors, warnings };
  }

  projects.forEach((project, index) => {
    const validation = validateProject(project);

    if (validation.isValid && validation.data) {
      validProjects.push(validation.data);
    }

    validation.errors.forEach((error) => {
      errors.push(
        createError(
          `projects[${index}].${error.field}`,
          error.message,
          error.code,
          error.value,
        ),
      );
    });

    validation.warnings.forEach((warning) => {
      warnings.push(
        createWarning(
          `projects[${index}].${warning.field}`,
          warning.message,
          warning.code,
          warning.value,
        ),
      );
    });
  });

  return {
    isValid: errors.length === 0,
    data: validProjects,
    errors,
    warnings,
  };
};

/**
 * Validate array of testimonials
 */
export const validateTestimonials = (
  testimonials: any[],
): ValidationResult<Testimonial[]> => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const validTestimonials: Testimonial[] = [];

  if (!Array.isArray(testimonials)) {
    errors.push(
      createError(
        "testimonials",
        "Testimonials must be an array",
        "INVALID_ARRAY",
        testimonials,
      ),
    );
    return { isValid: false, errors, warnings };
  }

  testimonials.forEach((testimonial, index) => {
    const validation = validateTestimonial(testimonial);

    if (validation.isValid && validation.data) {
      validTestimonials.push(validation.data);
    }

    validation.errors.forEach((error) => {
      errors.push(
        createError(
          `testimonials[${index}].${error.field}`,
          error.message,
          error.code,
          error.value,
        ),
      );
    });
  });

  return {
    isValid: errors.length === 0,
    data: validTestimonials,
    errors,
    warnings,
  };
};

// ============================================================================
// EXPORT VALIDATION UTILITIES
// ============================================================================

export const validationUtils = {
  validateTechnology,
  validateProject,
  validateService,
  validateTestimonial,
  validateContactSubmission,
  validateProjects,
  validateTestimonials,
  createError,
  createWarning,
};

export default validationUtils;

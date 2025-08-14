/**
 * Base Data Types and Type Safety Utilities
 * Comprehensive type system for portfolio data architecture
 */

// ============================================================================
// CORE BASE TYPES
// ============================================================================

/**
 * Base entity interface that all data entities should extend
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  version?: number;
}

/**
 * Metadata interface for enhanced data tracking
 */
export interface EntityMetadata {
  source?: string;
  tags?: string[];
  featured?: boolean;
  status?: "active" | "inactive" | "draft" | "archived";
  priority?: "low" | "medium" | "high" | "critical";
}

/**
 * Base content interface for content-based entities
 */
export interface BaseContent extends BaseEntity {
  title: string;
  description: string;
  slug?: string;
  metadata?: EntityMetadata;
}

// ============================================================================
// DOMAIN TYPES
// ============================================================================

/**
 * Technical domains supported in the portfolio
 */
export type TechnicalDomain =
  | "full-stack"
  | "cloud-engineering"
  | "data-analytics"
  | "ux-ui-design"
  | "technical-consulting";

/**
 * Technology categories for classification
 */
export type TechnologyCategory =
  | "frontend"
  | "backend"
  | "database"
  | "cloud"
  | "devops"
  | "analytics"
  | "design"
  | "mobile"
  | "ai-ml"
  | "blockchain"
  | "other";

/**
 * Proficiency levels for skills and technologies
 */
export type ProficiencyLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

/**
 * Project status types
 */
export type ProjectStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "on-hold"
  | "cancelled";

/**
 * Client company sizes
 */
export type CompanySize =
  | "startup"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

// ============================================================================
// BUSINESS TYPES
// ============================================================================

/**
 * Currency types supported
 */
export type Currency = "USD" | "CAD" | "EUR" | "GBP";

/**
 * Pricing models
 */
export type PricingType =
  | "fixed"
  | "hourly"
  | "project"
  | "retainer"
  | "value-based";

/**
 * Contact methods
 */
export type ContactMethod = "email" | "phone" | "video" | "in-person";

/**
 * Urgency levels
 */
export type UrgencyLevel = "low" | "medium" | "high" | "urgent";

// ============================================================================
// CONTENT TYPES
// ============================================================================

/**
 * Blog categories
 */
export type BlogCategory =
  | "technical"
  | "insights"
  | "tutorials"
  | "case-studies"
  | "industry-news";

/**
 * Content formats
 */
export type ContentFormat =
  | "article"
  | "tutorial"
  | "case-study"
  | "whitepaper"
  | "video"
  | "podcast";

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Result type for operations that can fail
 */
export type Result<T, E = Error> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

/**
 * Optional type helper
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Required type helper
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Maybe type helper
 */
export type Maybe<T> = T | undefined;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * String literal union helper
 */
export type StringLiteral<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;

// ============================================================================
// FILTER AND SORT TYPES
// ============================================================================

/**
 * Generic filter interface
 */
export interface BaseFilter<T = any> {
  field: keyof T;
  operator:
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "nin"
    | "contains"
    | "startsWith"
    | "endsWith";
  value: any;
}

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Generic sort interface
 */
export interface BaseSort<T = any> {
  field: keyof T;
  direction: SortDirection;
}

/**
 * Pagination interface
 */
export interface Pagination {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

/**
 * Query interface combining filter, sort, and pagination
 */
export interface BaseQuery<T = any> {
  filters?: BaseFilter<T>[];
  sort?: BaseSort<T>[];
  pagination?: Pagination;
  search?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    version?: string;
  };
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: Required<Pagination>;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Type guard for checking if value is defined
 */
export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

/**
 * Type guard for checking if value is a non-empty string
 */
export const isNonEmptyString = (value: any): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

/**
 * Type guard for checking if value is a non-empty array
 */
export const isNonEmptyArray = <T>(value: any): value is NonEmptyArray<T> => {
  return Array.isArray(value) && value.length > 0;
};

/**
 * Type guard for checking if value is a valid email
 */
export const isValidEmail = (value: any): value is string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isNonEmptyString(value) && emailRegex.test(value);
};

/**
 * Type guard for checking if value is a valid URL
 */
export const isValidUrl = (value: any): value is string => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Type guard for checking if value is a valid date
 */
export const isValidDate = (value: any): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

// ============================================================================
// TRANSFORMATION HELPERS
// ============================================================================

/**
 * Safe JSON parse with type checking
 */
export const safeJsonParse = <T = any>(json: string): Result<T> => {
  try {
    const data = JSON.parse(json);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("JSON parse failed"),
    };
  }
};

/**
 * Safe property access
 */
export const safeGet = <T, K extends keyof T>(
  obj: T,
  key: K,
): T[K] | undefined => {
  try {
    return obj?.[key];
  } catch {
    return undefined;
  }
};

/**
 * Deep clone utility
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (typeof obj === "object") {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
};

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Technical domains array for validation
 */
export const TECHNICAL_DOMAINS: readonly TechnicalDomain[] = [
  "full-stack",
  "cloud-engineering",
  "data-analytics",
  "ux-ui-design",
  "technical-consulting",
] as const;

/**
 * Technology categories array for validation
 */
export const TECHNOLOGY_CATEGORIES: readonly TechnologyCategory[] = [
  "frontend",
  "backend",
  "database",
  "cloud",
  "devops",
  "analytics",
  "design",
  "mobile",
  "ai-ml",
  "blockchain",
  "other",
] as const;

/**
 * Proficiency levels array for validation
 */
export const PROFICIENCY_LEVELS: readonly ProficiencyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;

/**
 * Project statuses array for validation
 */
export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "planned",
  "in-progress",
  "completed",
  "on-hold",
  "cancelled",
] as const;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate technical domain
 */
export const isValidTechnicalDomain = (
  value: any,
): value is TechnicalDomain => {
  return TECHNICAL_DOMAINS.includes(value);
};

/**
 * Validate technology category
 */
export const isValidTechnologyCategory = (
  value: any,
): value is TechnologyCategory => {
  return TECHNOLOGY_CATEGORIES.includes(value);
};

/**
 * Validate proficiency level
 */
export const isValidProficiencyLevel = (
  value: any,
): value is ProficiencyLevel => {
  return PROFICIENCY_LEVELS.includes(value);
};

/**
 * Validate project status
 */
export const isValidProjectStatus = (value: any): value is ProjectStatus => {
  return PROJECT_STATUSES.includes(value);
};

/**
 * Validate base entity structure
 */
export const isValidBaseEntity = (value: any): value is BaseEntity => {
  return (
    typeof value === "object" &&
    value !== null &&
    isNonEmptyString(value.id) &&
    isValidDate(value.createdAt) &&
    (value.updatedAt === undefined || isValidDate(value.updatedAt)) &&
    (value.version === undefined || typeof value.version === "number")
  );
};

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  BaseEntity,
  EntityMetadata,
  BaseContent,
  BaseFilter,
  BaseSort,
  BaseQuery,
  ApiResponse,
  PaginatedResponse,
};

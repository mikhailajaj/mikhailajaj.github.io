/**
 * Production-Ready Context Exports
 * Clean, organized exports for all optimized contexts
 */

// ✅ Project Context - Focused project data management
export {
  ProjectProvider,
  useProjectData,
  useProjectSelector,
  useProjects,
  useFeaturedProjects,
  useProjectLoading,
  useProjectError,
  useProjectById,
  useProjectsByTechnology,
  useProjectPerformance,
  projectFetcher,
} from "./ProjectContext";

// ✅ Testimonial Context - Dedicated testimonial management
export {
  TestimonialProvider,
  useTestimonialData,
  useTestimonialSelector,
  useTestimonials,
  useFeaturedTestimonials,
  useTestimonialLoading,
  useTestimonialError,
  useTestimonialById,
  useHighRatedTestimonials,
  useTestimonialPerformance,
  testimonialFetcher,
} from "./TestimonialContext";

// ✅ Education Context - Academic history and credentials
export { EducationProvider, useEducation } from "./EducationContext";

// ✅ Unified Timeline Context - Education + Work dual-track
export { TimelineProvider, useTimeline } from "./TimelineContext";

// ✅ Optimized Providers - Complete provider architecture
export {
  OptimizedDataProviders,
  PerformanceDashboard,
  performanceMonitor,
  usePerformanceTracking,
  useOverallPerformance,
  useContextHealth,
} from "./OptimizedProviders";

// ✅ Type exports for external usage
export type {
  ProjectContextType,
  TestimonialContextType,
  PerformanceMetrics,
} from "./types";

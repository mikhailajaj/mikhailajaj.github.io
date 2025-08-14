// Dynamic exports for better tree shaking and code splitting
export {
  DynamicCalculator as ROICalculator,
  DynamicCostEstimator as CostEstimator,
  DynamicTechStackBuilder as TechStackBuilder,
  DynamicPerformanceBenchmark as PerformanceBenchmark,
  DynamicProjectDemo as ProjectDemo,
  DynamicCodePlayground as CodePlayground,
  DynamicApiExplorer as ApiExplorer,
  DynamicDatabaseDemo as DatabaseDemo,
} from "@/components/ui/DynamicLoader";

// Direct exports for components that don't need dynamic loading
export { default as EnhancedContactForm } from "./EnhancedContactForm";
export { default as NewsletterSignup } from "./NewsletterSignup";
export { default as SocialSharing } from "./SocialSharing";
export { default as CommentSystem } from "./CommentSystem";

// Utility exports
export { createDynamicComponent } from "@/components/ui/DynamicLoader";
export { useProgressiveLoading } from "@/hooks/useProgressiveLoading";

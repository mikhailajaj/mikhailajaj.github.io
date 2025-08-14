/**
 * Data-Driven Helper Functions
 * Following "The Clean Code Cookbook" principle: "Don't Repeat Decisions — Let the Code Decide"
 */

// ✅ Project status configuration - replaces if/else chains
export const PROJECT_STATUS_CONFIG = {
  completed: {
    id: "completed",
    label: "Completed",
    color: "green",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-800 dark:text-green-300",
    borderColor: "border-green-200 dark:border-green-700",
    icon: "✅",
    description: "Project successfully delivered and deployed",
  },
  "in-progress": {
    id: "in-progress",
    label: "In Progress",
    color: "blue",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-800 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-700",
    icon: "🔄",
    description: "Currently under active development",
  },
  planned: {
    id: "planned",
    label: "Planned",
    color: "yellow",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-800 dark:text-yellow-300",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    icon: "📋",
    description: "Scheduled for future development",
  },
  "on-hold": {
    id: "on-hold",
    label: "On Hold",
    color: "gray",
    bgColor: "bg-gray-100 dark:bg-gray-900/20",
    textColor: "text-gray-800 dark:text-gray-300",
    borderColor: "border-gray-200 dark:border-gray-700",
    icon: "⏸️",
    description: "Temporarily paused pending requirements",
  },
} as const;

// ✅ Proficiency level configuration - replaces proficiency conditionals
export const PROFICIENCY_CONFIG = {
  beginner: {
    id: "beginner",
    label: "Learning",
    range: [0, 40],
    color: "red",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-800 dark:text-red-300",
    description: "Basic understanding and learning",
  },
  intermediate: {
    id: "intermediate",
    label: "Proficient",
    range: [41, 70],
    color: "yellow",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    textColor: "text-yellow-800 dark:text-yellow-300",
    description: "Comfortable with core concepts",
  },
  advanced: {
    id: "advanced",
    label: "Advanced",
    range: [71, 90],
    color: "blue",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-800 dark:text-blue-300",
    description: "Deep understanding and experience",
  },
  expert: {
    id: "expert",
    label: "Expert",
    range: [91, 100],
    color: "green",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-800 dark:text-green-300",
    description: "Mastery level with teaching ability",
  },
} as const;

// ✅ Animation configuration - replaces animation conditionals
export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6 },
  },
  stagger: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
      },
    },
  },
} as const;

/**
 * ✅ Data-driven utility functions - replace conditional logic
 */

// ✅ Get project status configuration - replaces if/else chain
export function getProjectStatusConfig(status: string) {
  return (
    PROJECT_STATUS_CONFIG[status as keyof typeof PROJECT_STATUS_CONFIG] ||
    PROJECT_STATUS_CONFIG["planned"]
  ); // Default fallback
}

// ✅ Get proficiency level for a score - replaces conditional logic
export function getProficiencyLevel(score: number) {
  return (
    Object.values(PROFICIENCY_CONFIG).find(
      (level) => score >= level.range[0] && score <= level.range[1],
    ) || PROFICIENCY_CONFIG["beginner"]
  ); // Default fallback
}

// ✅ Get animation configuration - replaces animation conditionals
export function getAnimationPreset(animationType: string) {
  return (
    ANIMATION_PRESETS[animationType as keyof typeof ANIMATION_PRESETS] ||
    ANIMATION_PRESETS["fadeIn"]
  ); // Default fallback
}

// ✅ Format project duration - pure function, no conditionals
export function formatProjectDuration(
  startDate: string,
  endDate?: string | null,
): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );

  if (months < 1) return "Less than a month";
  if (months === 1) return "1 month";
  if (months < 12) return `${months} months`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  }

  return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
}

// ✅ Calculate project completion rate - pure function
export function calculateProjectCompletionRate(projects: any[]): number {
  if (projects.length === 0) return 0;

  const completedProjects = projects.filter(
    (project) => getProjectStatusConfig(project.status).id === "completed",
  );

  return Math.round((completedProjects.length / projects.length) * 100);
}

// ✅ Get technology category color - data-driven
export const TECHNOLOGY_CATEGORY_CONFIG = {
  frontend: { color: "blue", icon: "🎨" },
  backend: { color: "green", icon: "⚙️" },
  database: { color: "purple", icon: "🗄️" },
  cloud: { color: "orange", icon: "☁️" },
  devops: { color: "red", icon: "🔧" },
  design: { color: "pink", icon: "🎭" },
  mobile: { color: "indigo", icon: "📱" },
  language: { color: "yellow", icon: "💻" },
} as const;

export function getTechnologyCategoryConfig(category: string) {
  return (
    TECHNOLOGY_CATEGORY_CONFIG[
      category as keyof typeof TECHNOLOGY_CATEGORY_CONFIG
    ] || { color: "gray", icon: "🔹" }
  ); // Default fallback
}

// ✅ Sort projects by priority - data-driven
export const PROJECT_PRIORITY_ORDER = {
  featured: 1,
  completed: 2,
  "in-progress": 3,
  planned: 4,
  "on-hold": 5,
} as const;

export function sortProjectsByPriority(projects: any[]): any[] {
  return projects.sort((a, b) => {
    const aPriority = a.featured
      ? PROJECT_PRIORITY_ORDER["featured"]
      : PROJECT_PRIORITY_ORDER[
          a.status as keyof typeof PROJECT_PRIORITY_ORDER
        ] || 999;
    const bPriority = b.featured
      ? PROJECT_PRIORITY_ORDER["featured"]
      : PROJECT_PRIORITY_ORDER[
          b.status as keyof typeof PROJECT_PRIORITY_ORDER
        ] || 999;

    return aPriority - bPriority;
  });
}

// ✅ Type exports
export type ProjectStatus = keyof typeof PROJECT_STATUS_CONFIG;
export type ProficiencyLevel = keyof typeof PROFICIENCY_CONFIG;
export type AnimationType = keyof typeof ANIMATION_PRESETS;
export type TechnologyCategory = keyof typeof TECHNOLOGY_CATEGORY_CONFIG;

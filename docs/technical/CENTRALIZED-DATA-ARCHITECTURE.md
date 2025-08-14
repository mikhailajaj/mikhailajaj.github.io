# Centralized Data Architecture Documentation

## Overview

The Centralized Data Architecture provides a unified, type-safe, and performant interface for all portfolio data operations. This enterprise-grade system implements a 5-layer architecture with intelligent caching, React integration, and comprehensive business logic.

## Architecture Layers

### 1. Data Manager Layer (`lib/data/DataManager.ts`)

**Low-level data operations with intelligent caching**

```typescript
import { dataManager } from "@/lib/data";

// Get all projects with caching
const projectsResult = await dataManager.getAllProjects();

// Get project by ID
const project = await dataManager.getProjectById("project-id");

// Filter projects
const filteredProjects = await dataManager.filterProjects({
  domain: "full-stack",
  featured: true,
});

// Search projects
const searchResults = await dataManager.searchProjects("React");
```

**Key Features:**

- Intelligent caching with 5-minute TTL
- CRUD operations for all data types
- Advanced filtering and sorting
- Performance optimization
- Error handling with Result types
- Aggregation functions for statistics

### 2. Business Logic Layer (`lib/data/DataService.ts`)

**High-level API with business rules and standardized responses**

```typescript
import { dataService } from "@/lib/data";

// Get projects with query options
const response = await dataService.getProjects({
  filters: { domain: "cloud-engineering" },
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, limit: 10 },
});

// Get portfolio statistics
const stats = await dataService.getPortfolioStats();

// Get business impact metrics
const metrics = await dataService.getBusinessImpactMetrics();

// Health check
const health = await dataService.healthCheck();
```

**Key Features:**

- Standardized ApiResponse wrapper
- Query optimization with pagination
- Domain-specific operations
- Analytics and metrics calculation
- Health monitoring and diagnostics
- Business rule enforcement

### 3. React Integration Layer (`lib/data/DataHooks.ts`)

**Specialized React hooks for different data needs**

```typescript
import {
  useProjects,
  useFeaturedProjects,
  useProjectsByDomain,
  useProjectSearch,
  usePortfolioStats
} from '@/lib/data';

function ProjectsPage() {
  // Get all projects with options
  const { data: projects, loading, error, refetch } = useProjects({
    filters: { featured: true },
    sort: { field: 'createdAt', direction: 'desc' }
  });

  // Get featured projects
  const { data: featured } = useFeaturedProjects(6);

  // Get projects by domain
  const { data: fullStackProjects } = useProjectsByDomain('full-stack');

  // Search with debouncing
  const { data: searchResults } = useProjectSearch(searchQuery, 300);

  // Portfolio statistics
  const { data: stats } = usePortfolioStats();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div>
      {projects?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Available Hooks:**

- `useProjects(options, hookOptions)` - Get projects with filtering/sorting
- `useProject(id)` - Get single project by ID
- `useFeaturedProjects(limit)` - Get featured projects
- `useProjectsByDomain(domain)` - Get projects by technical domain
- `useTestimonials(options)` - Get testimonials with filtering
- `useFeaturedTestimonials(limit)` - Get featured testimonials
- `useTechnologies()` - Get all technologies
- `useTechnologiesByDomain(domain)` - Get technologies by domain
- `useProjectSearch(query, debounceMs)` - Search projects with debouncing
- `usePortfolioStats()` - Get portfolio statistics
- `useDomainStats(domain)` - Get domain-specific statistics
- `useDataServiceHealth()` - Health check monitoring

**Hook Features:**

- Automatic caching and stale data management
- Loading states and error handling
- Real-time updates and refetch capabilities
- Performance optimization with useMemo/useCallback
- Configurable options (enabled, refetchOnMount, cacheTime, staleTime)

### 4. Global State Layer (`lib/data/DataProvider.tsx`)

**React Context for global data state management**

```typescript
import { DataProvider, useDataContext, useProjects } from '@/lib/data';

// App-level setup
function App() {
  return (
    <DataProvider autoInitialize={true}>
      <Portfolio />
    </DataProvider>
  );
}

// Component usage
function Portfolio() {
  const { state, actions } = useDataContext();

  // Or use convenience hooks
  const {
    projects,
    featured,
    loading,
    loadProjects,
    loadProjectsByDomain
  } = useProjects();

  useEffect(() => {
    loadProjectsByDomain('full-stack');
  }, []);

  return (
    <div>
      {featured.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Global State Features:**

- Centralized state management with useReducer
- Auto-initialization on app startup
- Cross-component data sharing
- Optimistic updates and cache invalidation
- Convenience hooks for common operations

**Available Context Hooks:**

- `useDataContext()` - Full context access
- `useProjects()` - Projects state and actions
- `useTestimonials()` - Testimonials state and actions
- `useTechnologies()` - Technologies state and actions
- `useAnalytics()` - Analytics state and actions

### 5. Unified API Layer (`lib/data/index.ts`)

**Single entry point with convenience functions**

```typescript
import dataAPI, {
  initializeDataSystem,
  getDomainData,
  globalSearch,
  getPortfolioOverview,
  refreshPortfolioData,
  validatePortfolioData,
} from "@/lib/data";

// Initialize the data system
const initResult = await initializeDataSystem();

// Get all data for a domain
const domainData = await getDomainData("full-stack");

// Global search across all data types
const searchResults = await globalSearch("React");

// Get portfolio overview
const overview = await getPortfolioOverview();

// Refresh all data
const refreshResult = await refreshPortfolioData();

// Validate all data
const validation = await validatePortfolioData();

// Access core services
const projects = await dataAPI.service.getProjects();
const health = await dataAPI.service.healthCheck();
```

**Convenience Functions:**

- `initializeDataSystem()` - Initialize and health check
- `getDomainData(domain)` - Get all data for a technical domain
- `globalSearch(query)` - Search across all data types
- `getPortfolioOverview()` - Get featured content and stats
- `refreshPortfolioData()` - Clear cache and refresh all data
- `validatePortfolioData()` - Validate all data integrity

## Data Types and Validation

### Enhanced Data Types (`data/types/index.ts`)

```typescript
import {
  Project,
  Testimonial,
  Technology,
  Service,
  BlogPost,
  ProjectFilter,
  TestimonialFilter,
} from "@/data/types";

// Project with full type safety
const project: Project = {
  id: "project-1",
  title: "Amazing App",
  domain: "full-stack",
  description: "A comprehensive web application",
  problem: "Client needed a scalable solution",
  solution: "Built with React and Node.js",
  impact: {
    metrics: ["50% performance improvement", "$2M cost savings"],
    roi: "500%",
    businessValue: "$2.3M revenue increase",
  },
  techStack: [
    {
      id: "react",
      name: "React",
      category: "frontend",
      proficiency: "expert",
    },
  ],
  timeline: {
    startDate: new Date("2024-01-01"),
    estimatedDuration: "6 months",
    milestones: [],
  },
  status: "completed",
  featured: true,
  complexity: "high",
  tags: ["react", "nodejs", "typescript"],
  createdAt: new Date(),
};
```

### Validation System

```typescript
import {
  validateProject,
  validateTestimonial,
  validateProjects,
} from "@/lib/data";

// Validate single project
const validation = validateProject(project);
if (validation.isValid) {
  console.log("Valid project:", validation.data);
} else {
  console.error("Validation errors:", validation.errors);
}

// Validate array of projects
const projectsValidation = validateProjects(projectArray);
console.log(
  `Valid: ${projectsValidation.data?.length}, Errors: ${projectsValidation.errors.length}`,
);
```

## Performance Optimization

### Caching Strategy

```typescript
// Cache configuration
const DATA_CONFIG = {
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  STALE_TIME: 1 * 60 * 1000, // 1 minute
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  BATCH_SIZE: 50,
  MAX_SEARCH_RESULTS: 100,
};

// Cache management
await dataService.clearCache(); // Clear all cache
await dataManager.clearCacheForType("projects"); // Clear specific type
const stats = dataManager.getCacheStats(); // Get cache statistics
```

### Hook Optimization

```typescript
// Configure hook behavior
const { data, loading } = useProjects(
  {
    filters: { domain: "full-stack" },
    sort: { field: "createdAt", direction: "desc" },
  },
  {
    enabled: true,
    refetchOnMount: true,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
  },
);
```

## Error Handling

### Result Types

```typescript
import { Result } from "@/lib/utils/base-types";

// All operations return Result<T> for consistent error handling
const result: Result<Project[]> = await dataManager.getAllProjects();

if (result.success) {
  console.log("Projects:", result.data);
} else {
  console.error("Error:", result.error.message);
}
```

### API Response Format

```typescript
import { ApiResponse } from "@/lib/utils/base-types";

// Standardized API responses
const response: ApiResponse<Project[]> = await dataService.getProjects();

if (response.success) {
  console.log("Data:", response.data);
  console.log("Meta:", response.meta);
} else {
  console.error("Error:", response.error);
}
```

### Validation Errors

```typescript
import { ValidationResult, ValidationError } from "@/lib/data";

const validation: ValidationResult<Project> = validateProject(projectData);

if (!validation.isValid) {
  validation.errors.forEach((error: ValidationError) => {
    console.error(`${error.field}: ${error.message} (${error.code})`);
  });
}
```

## Migration from Legacy Data

### Migration Utilities

```typescript
import {
  migrateLegacyProject,
  batchMigrateLegacyProjects,
  transformTechnologies,
} from "@/lib/data";

// Migrate single legacy project
const migrationResult = migrateLegacyProject(legacyProject);
if (migrationResult.success) {
  const newProject = migrationResult.data;
}

// Batch migrate legacy projects
const batchResult = batchMigrateLegacyProjects(legacyProjects);
console.log(`Migrated: ${batchResult.data.length} projects`);

// Transform technology arrays
const technologies = transformTechnologies(["React", "Node.js"], "full-stack");
```

### Data Cleaning

```typescript
import { cleanData, generateSlug, extractDomain } from "@/lib/data";

// Clean and normalize data
const cleanedData = cleanData(rawData);

// Generate URL-safe slugs
const slug = generateSlug("My Amazing Project"); // 'my-amazing-project'

// Extract domain from project data
const domain = extractDomain(projectData); // 'full-stack'
```

## Integration Examples

### Basic Component Integration

```typescript
import { useFeaturedProjects, useFeaturedTestimonials } from '@/lib/data';

function HomePage() {
  const { data: projects, loading: projectsLoading } = useFeaturedProjects(6);
  const { data: testimonials, loading: testimonialsLoading } = useFeaturedTestimonials(3);

  if (projectsLoading || testimonialsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <section>
        <h2>Featured Projects</h2>
        {projects?.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>

      <section>
        <h2>Client Testimonials</h2>
        {testimonials?.map(testimonial => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </section>
    </div>
  );
}
```

### Domain-Specific Page

```typescript
import { useProjectsByDomain, useTechnologiesByDomain, useDomainStats } from '@/lib/data';

function FullStackPage() {
  const { data: projects, loading } = useProjectsByDomain('full-stack');
  const { data: technologies } = useTechnologiesByDomain('full-stack');
  const { data: stats } = useDomainStats('full-stack');

  return (
    <div>
      <DomainHero domain="full-stack" stats={stats} />
      <TechnologiesSection technologies={technologies} />
      <ProjectsGrid projects={projects} loading={loading} />
    </div>
  );
}
```

### Search Implementation

```typescript
import { useProjectSearch } from '@/lib/data';
import { useState } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, loading } = useProjectSearch(query, 300); // 300ms debounce

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search projects..."
      />

      {loading && <SearchLoading />}

      <SearchResults results={results} />
    </div>
  );
}
```

### Analytics Dashboard

```typescript
import { usePortfolioStats, useAnalytics } from '@/lib/data';

function AnalyticsDashboard() {
  const { portfolioStats, businessMetrics, loading } = useAnalytics();

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <StatsOverview stats={portfolioStats} />
      <BusinessMetrics metrics={businessMetrics} />
      <DomainBreakdown stats={portfolioStats} />
    </div>
  );
}
```

## Best Practices

### 1. Use Appropriate Hooks

```typescript
// ✅ Good: Use specific hooks for specific needs
const { data: featured } = useFeaturedProjects(6);
const { data: fullStack } = useProjectsByDomain("full-stack");

// ❌ Avoid: Using general hooks when specific ones exist
const { data: all } = useProjects();
const featured = all?.filter((p) => p.featured).slice(0, 6);
```

### 2. Handle Loading and Error States

```typescript
// ✅ Good: Always handle loading and error states
const { data, loading, error, refetch } = useProjects();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={refetch} />;
if (!data?.length) return <EmptyState />;

return <ProjectsList projects={data} />;
```

### 3. Use Context for Global State

```typescript
// ✅ Good: Use context hooks for cross-component state
function App() {
  return (
    <DataProvider autoInitialize={true}>
      <Header />
      <Main />
      <Footer />
    </DataProvider>
  );
}

function Header() {
  const { projects } = useProjects(); // Access global state
  return <nav>Projects: {projects.length}</nav>;
}
```

### 4. Optimize Performance

```typescript
// ✅ Good: Configure hooks for optimal performance
const { data } = useProjects(
  { filters: { featured: true } },
  {
    enabled: isVisible, // Only fetch when needed
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
);
```

### 5. Validate Data

```typescript
// ✅ Good: Validate data before using
const validation = validateProject(projectData);
if (validation.isValid) {
  await dataService.createProject(validation.data);
} else {
  showValidationErrors(validation.errors);
}
```

## Configuration

### Environment Variables

```bash
# Optional: Configure data system behavior
NEXT_PUBLIC_DATA_CACHE_TTL=300000  # 5 minutes
NEXT_PUBLIC_DATA_STALE_TIME=60000  # 1 minute
NEXT_PUBLIC_DATA_RETRY_ATTEMPTS=3
NEXT_PUBLIC_DATA_BATCH_SIZE=50
```

### Runtime Configuration

```typescript
import { DATA_CONFIG } from "@/lib/data";

// Access configuration
console.log("Cache TTL:", DATA_CONFIG.CACHE_TTL);
console.log("Stale Time:", DATA_CONFIG.STALE_TIME);
console.log("Batch Size:", DATA_CONFIG.BATCH_SIZE);
```

## Troubleshooting

### Common Issues

1. **Hook not updating**: Ensure component is wrapped in DataProvider
2. **Cache not working**: Check if cache TTL has expired
3. **Validation errors**: Check data structure matches type definitions
4. **Performance issues**: Use specific hooks instead of general ones
5. **Memory leaks**: Ensure proper cleanup in useEffect

### Debug Tools

```typescript
// Health check
const health = await dataService.healthCheck();
console.log("Data system health:", health);

// Cache statistics
const cacheStats = dataManager.getCacheStats();
console.log("Cache stats:", cacheStats);

// Validate all data
const validation = await validatePortfolioData();
console.log("Data validation:", validation);
```

## API Reference

### Core Services

- `dataManager` - Low-level data operations
- `dataService` - Business logic layer
- `DataProvider` - React context provider

### React Hooks

- Project hooks: `useProjects`, `useProject`, `useFeaturedProjects`, `useProjectsByDomain`
- Testimonial hooks: `useTestimonials`, `useFeaturedTestimonials`
- Technology hooks: `useTechnologies`, `useTechnologiesByDomain`
- Search hooks: `useProjectSearch`
- Analytics hooks: `usePortfolioStats`, `useDomainStats`
- Utility hooks: `useDataServiceHealth`

### Convenience Functions

- `initializeDataSystem()` - System initialization
- `getDomainData(domain)` - Domain data aggregation
- `globalSearch(query)` - Cross-type search
- `getPortfolioOverview()` - Portfolio summary
- `refreshPortfolioData()` - Cache refresh
- `validatePortfolioData()` - Data validation

### Types and Validation

- Data types: `Project`, `Testimonial`, `Technology`, `Service`, `BlogPost`
- Filter types: `ProjectFilter`, `TestimonialFilter`, `BlogFilter`
- Validation: `validateProject`, `validateTestimonial`, `validateProjects`
- Migration: `migrateLegacyProject`, `batchMigrateLegacyProjects`

## Conclusion

The Centralized Data Architecture provides a robust, type-safe, and performant foundation for all portfolio data operations. It implements enterprise-grade patterns including intelligent caching, comprehensive error handling, and React integration while maintaining excellent developer experience and code maintainability.

For additional support or questions, refer to the implementation files in `lib/data/` or the type definitions in `data/types/`.

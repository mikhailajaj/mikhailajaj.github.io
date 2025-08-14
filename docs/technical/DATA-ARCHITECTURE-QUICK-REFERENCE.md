# Data Architecture Quick Reference

## 🚀 Quick Start

### 1. Basic Setup

```typescript
// Add to app/layout.tsx or app/provider.tsx
import { DataProvider } from '@/lib/data';

export default function RootLayout({ children }) {
  return (
    <DataProvider autoInitialize={true}>
      {children}
    </DataProvider>
  );
}
```

### 2. Simple Component Usage

```typescript
import { useFeaturedProjects, useFeaturedTestimonials } from '@/lib/data';

function HomePage() {
  const { data: projects, loading } = useFeaturedProjects(6);
  const { data: testimonials } = useFeaturedTestimonials(3);

  if (loading) return <Loading />;

  return (
    <div>
      {projects?.map(project => <ProjectCard key={project.id} project={project} />)}
      {testimonials?.map(testimonial => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
    </div>
  );
}
```

## 📚 Common Hooks

### Projects

```typescript
// Get all projects
const { data, loading, error } = useProjects();

// Get featured projects
const { data: featured } = useFeaturedProjects(6);

// Get projects by domain
const { data: fullStack } = useProjectsByDomain("full-stack");

// Get single project
const { data: project } = useProject("project-id");

// Search projects
const { data: results } = useProjectSearch(query, 300);
```

### Testimonials

```typescript
// Get all testimonials
const { data: testimonials } = useTestimonials();

// Get featured testimonials
const { data: featured } = useFeaturedTestimonials(3);

// Get testimonials by domain
const { data: cloudTestimonials } =
  useTestimonialsByDomain("cloud-engineering");
```

### Technologies

```typescript
// Get all technologies
const { data: technologies } = useTechnologies();

// Get technologies by domain
const { data: techStack } = useTechnologiesByDomain("data-analytics");
```

### Analytics

```typescript
// Get portfolio statistics
const { data: stats } = usePortfolioStats();

// Get domain statistics
const { data: domainStats } = useDomainStats("ux-ui-design");
```

## 🎯 Direct Service Usage

### Basic Operations

```typescript
import { dataService } from "@/lib/data";

// Get projects with options
const response = await dataService.getProjects({
  filters: { domain: "full-stack", featured: true },
  sort: { field: "createdAt", direction: "desc" },
  pagination: { page: 1, limit: 10 },
});

// Get single project
const project = await dataService.getProject("project-id");

// Search projects
const searchResults = await dataService.searchProjects("React");
```

### Analytics

```typescript
// Portfolio statistics
const stats = await dataService.getPortfolioStats();

// Business metrics
const metrics = await dataService.getBusinessImpactMetrics();

// Health check
const health = await dataService.healthCheck();
```

## 🔧 Convenience Functions

```typescript
import {
  getDomainData,
  globalSearch,
  getPortfolioOverview,
  refreshPortfolioData,
} from "@/lib/data";

// Get all data for a domain
const domainData = await getDomainData("cloud-engineering");

// Search across all data types
const searchResults = await globalSearch("AWS");

// Get portfolio overview
const overview = await getPortfolioOverview();

// Refresh all data
await refreshPortfolioData();
```

## 🏗️ Context Usage

```typescript
import { useDataContext, useProjects } from '@/lib/data';

function MyComponent() {
  // Full context access
  const { state, actions } = useDataContext();

  // Or use convenience hooks
  const {
    projects,
    featured,
    loading,
    loadProjects,
    loadProjectsByDomain
  } = useProjects();

  // Load data on demand
  useEffect(() => {
    loadProjectsByDomain('technical-consulting');
  }, []);

  return <div>{/* Component content */}</div>;
}
```

## ✅ Validation

```typescript
import { validateProject, validateProjects } from "@/lib/data";

// Validate single project
const validation = validateProject(projectData);
if (validation.isValid) {
  console.log("Valid project:", validation.data);
} else {
  console.error("Errors:", validation.errors);
}

// Validate multiple projects
const projectsValidation = validateProjects(projectArray);
```

## 🔄 Migration

```typescript
import { migrateLegacyProject, batchMigrateLegacyProjects } from "@/lib/data";

// Migrate single project
const result = migrateLegacyProject(legacyProject);

// Batch migrate
const batchResult = batchMigrateLegacyProjects(legacyProjects);
```

## 🎨 Hook Options

```typescript
// Configure hook behavior
const { data, loading } = useProjects(
  // Query options
  {
    filters: { domain: "full-stack" },
    sort: { field: "createdAt", direction: "desc" },
  },
  // Hook options
  {
    enabled: true,
    refetchOnMount: true,
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000, // 1 minute
  },
);
```

## 🚨 Error Handling

```typescript
// Hook error handling
const { data, loading, error, refetch } = useProjects();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} onRetry={refetch} />;
if (!data?.length) return <EmptyState />;

return <ProjectsList projects={data} />;
```

```typescript
// Service error handling
const response = await dataService.getProjects();

if (response.success) {
  console.log("Data:", response.data);
} else {
  console.error("Error:", response.error);
}
```

## 📊 Performance Tips

### 1. Use Specific Hooks

```typescript
// ✅ Good
const { data: featured } = useFeaturedProjects(6);

// ❌ Avoid
const { data: all } = useProjects();
const featured = all?.filter((p) => p.featured).slice(0, 6);
```

### 2. Configure Caching

```typescript
// Optimize for your use case
const { data } = useProjects(filters, {
  staleTime: 5 * 60 * 1000, // Don't refetch for 5 minutes
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
});
```

### 3. Conditional Fetching

```typescript
// Only fetch when needed
const { data } = useProjects(filters, { enabled: isVisible && shouldFetch });
```

## 🔍 Debug Tools

```typescript
// Health check
const health = await dataService.healthCheck();

// Cache statistics
import { dataManager } from "@/lib/data";
const stats = dataManager.getCacheStats();

// Validate all data
import { validatePortfolioData } from "@/lib/data";
const validation = await validatePortfolioData();
```

## 📝 Type Definitions

```typescript
import type {
  Project,
  Testimonial,
  Technology,
  ProjectFilter,
  TestimonialFilter,
  TechnicalDomain,
  ApiResponse,
  ValidationResult,
} from "@/lib/data";
```

## 🎯 Common Patterns

### Domain Page

```typescript
function DomainPage({ domain }: { domain: TechnicalDomain }) {
  const { data: projects } = useProjectsByDomain(domain);
  const { data: testimonials } = useTestimonialsByDomain(domain);
  const { data: technologies } = useTechnologiesByDomain(domain);
  const { data: stats } = useDomainStats(domain);

  return (
    <div>
      <DomainHero domain={domain} stats={stats} />
      <ProjectsSection projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
      <TechnologiesSection technologies={technologies} />
    </div>
  );
}
```

### Search Page

```typescript
function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, loading } = useProjectSearch(query, 300);

  return (
    <div>
      <SearchInput value={query} onChange={setQuery} />
      {loading ? <SearchLoading /> : <SearchResults results={results} />}
    </div>
  );
}
```

### Analytics Dashboard

```typescript
function Dashboard() {
  const { portfolioStats, businessMetrics, loading } = useAnalytics();

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <StatsOverview stats={portfolioStats} />
      <BusinessMetrics metrics={businessMetrics} />
    </div>
  );
}
```

## 🔧 Configuration

```typescript
import { DATA_CONFIG } from "@/lib/data";

// Available configuration
console.log({
  CACHE_TTL: DATA_CONFIG.CACHE_TTL, // 5 minutes
  STALE_TIME: DATA_CONFIG.STALE_TIME, // 1 minute
  RETRY_ATTEMPTS: DATA_CONFIG.RETRY_ATTEMPTS, // 3
  BATCH_SIZE: DATA_CONFIG.BATCH_SIZE, // 50
  MAX_SEARCH_RESULTS: DATA_CONFIG.MAX_SEARCH_RESULTS, // 100
});
```

## 📚 Full Documentation

For complete documentation, see:

- [Centralized Data Architecture](./CENTRALIZED-DATA-ARCHITECTURE.md)
- [Type System Documentation](../DATA-TYPES-DOCUMENTATION.md)
- [Migration Guide](../LEGACY-DATA-MIGRATION.md)

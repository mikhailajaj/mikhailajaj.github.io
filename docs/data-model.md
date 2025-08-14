# Data Model Documentation

**Last Updated:** December 19, 2024  
**Version:** 1.0.0

## Overview

This document describes the data structures, schemas, and content management system used throughout the Mikhail Ajaj Portfolio application. The data architecture follows a domain-driven approach with TypeScript interfaces ensuring type safety across the application.

## Data Architecture

### Static Data Sources

#### Project Case Studies
**Location:** `data/project-case-studies.ts`  
**Schema:** `data/schemas/project.ts`

```typescript
interface ProjectCaseStudy {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  domain: Domain;
  featured: boolean;
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudy: {
    challenge: string;
    solution: string;
    results: string[];
    impact: {
      metric: string;
      value: string;
      description: string;
    }[];
  };
  timeline: {
    start: string;
    end?: string;
    duration: string;
  };
}
```

**Usage:**
- Homepage featured projects display
- Domain-specific project filtering
- Project detail pages
- Case study showcases

#### Domain Configuration
**Location:** `lib/constants/domains.ts`

```typescript
interface DomainConfig {
  id: string;
  name: string;
  route: string;
  color: string;
  description: string;
  technologies: string[];
  icon: React.ComponentType;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
```

**Domains:**
1. **Full-Stack Development** - Blue theme (#3B82F6)
2. **Cloud Engineering** - Teal theme (#06B6D4)
3. **Data Analytics** - Purple theme (#8B5CF6)
4. **UX/UI Design** - Pink theme (#EC4899)
5. **Technical Consulting** - Green theme (#10B981)

#### Testimonials
**Location:** `data/testimonials.ts`  
**Schema:** `data/schemas/testimonial.ts`

```typescript
interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
  videoUrl?: string;
  domain?: Domain;
  featured: boolean;
  date: string;
  projectId?: string;
}
```

**Features:**
- Video testimonial support
- Rating system (1-5 stars)
- Domain-specific filtering
- Project association
- Featured testimonial highlighting

### Dynamic Data Sources

#### Blog Content
**Location:** `content/blog/`  
**Format:** MDX files with frontmatter

```typescript
interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  category: string;
  featured: boolean;
  readingTime: number;
  image?: string;
  content: string;
}
```

**Blog Posts:**
- `advanced-react-patterns.mdx`
- `building-scalable-nextjs-applications.mdx`
- `cloud-architecture-aws-best-practices.mdx`
- `modern-data-engineering-pipelines.mdx`
- `typescript-best-practices.mdx`
- `ux-design-principles-for-developers.mdx`

#### Contact Form Data
**Schema:** Contact form submissions

```typescript
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  domain?: Domain;
  budget?: string;
  timeline?: string;
  projectType?: string;
  timestamp: string;
}
```

### Configuration Data

#### Navigation Structure
**Location:** `data/navigation.tsx`

```typescript
interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType;
  description?: string;
  children?: NavigationItem[];
  domain?: Domain;
}
```

#### Theme Configuration
**Location:** `lib/config/domainThemes.ts`

```typescript
interface ThemeConfig {
  domain: Domain;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  gradients: {
    primary: string;
    secondary: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
}
```

## Data Flow Patterns

### Static Data Flow
1. **Build Time**: Data processed and validated during build
2. **Static Generation**: Pre-rendered pages with static data
3. **Client Hydration**: Interactive features added on client

### Dynamic Data Flow
1. **API Routes**: Server-side data processing
2. **Client Requests**: Form submissions and interactions
3. **State Management**: React Context for application state

### Error Tracking Data
**Location:** `lib/monitoring/ErrorTracking.ts`

```typescript
interface ErrorReport {
  id: string;
  timestamp: string;
  type: 'javascript-error' | 'network-error' | 'performance-issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId: string;
  context: {
    component?: string;
    domain?: string;
    route?: string;
    additionalData?: Record<string, any>;
  };
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}
```

## Data Validation

### Runtime Validation
**Library:** Zod schemas for runtime type checking

```typescript
// Example: Project validation schema
import { z } from 'zod';

const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(10),
  technologies: z.array(z.string()),
  domain: z.enum(['full-stack', 'cloud-engineering', 'data-analytics', 'ux-ui-design', 'technical-consulting']),
  featured: z.boolean(),
});
```

### Build-Time Validation
- TypeScript strict mode for compile-time checking
- ESLint rules for data structure consistency
- Jest tests for data integrity

## Content Management

### Static Content Updates
1. **Project Data**: Update `data/project-case-studies.ts`
2. **Testimonials**: Update `data/testimonials.ts`
3. **Blog Posts**: Add new MDX files to `content/blog/`
4. **Domain Config**: Modify `lib/constants/domains.ts`

### Dynamic Content
- **Contact Forms**: Processed via `/api/contact`
- **Error Reports**: Collected via `/api/error-report`
- **Analytics**: Tracked via performance monitoring

## Performance Considerations

### Data Optimization
- **Static Generation**: Pre-render data-heavy pages
- **Code Splitting**: Lazy load domain-specific data
- **Caching**: Browser and CDN caching for static assets
- **Compression**: Gzip compression for JSON data

### Bundle Size Management
- **Tree Shaking**: Remove unused data exports
- **Dynamic Imports**: Load data only when needed
- **Image Optimization**: Next.js Image component for assets

## Security Considerations

### Data Protection
- **Input Validation**: Zod schemas for all user inputs
- **Sanitization**: XSS prevention for user-generated content
- **Rate Limiting**: API endpoint protection
- **HTTPS**: Secure data transmission

### Privacy Compliance
- **No PII Storage**: Minimal personal data collection
- **Analytics**: Privacy-focused tracking
- **Consent**: Clear data usage policies

## Migration and Versioning

### Schema Evolution
1. **Backward Compatibility**: Maintain old schema support
2. **Migration Scripts**: Automated data transformation
3. **Version Control**: Track schema changes in git
4. **Testing**: Validate migrations with test data

### Data Backup
- **Git History**: Version control for static data
- **Export Scripts**: Backup dynamic data
- **Recovery Procedures**: Data restoration processes

## Troubleshooting

### Common Data Issues

**Missing Project Data**
```bash
# Check data file exists
ls -la data/project-case-studies.ts

# Validate TypeScript compilation
npm run type-check
```

**Invalid Schema**
```bash
# Run data validation tests
npm run test -- --testPathPattern=data

# Check Zod schema validation
npm run validate-data
```

**Build Errors**
```bash
# Check for data import errors
npm run build 2>&1 | grep -i "data"

# Validate JSON structure
jq '.' data/*.json
```

## References

- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **Zod Documentation**: [https://zod.dev/](https://zod.dev/)
- **Next.js Data Fetching**: [https://nextjs.org/docs/app/building-your-application/data-fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- **MDX Documentation**: [https://mdxjs.com/](https://mdxjs.com/)
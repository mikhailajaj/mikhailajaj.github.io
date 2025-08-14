# API Documentation

This document provides comprehensive documentation for all API endpoints and interactive components in the Mikhail Ajaj Portfolio.

## 📋 Table of Contents

- [Overview](#overview)
- [API Routes](#api-routes)
- [Interactive Components API](#interactive-components-api)
- [Data Services](#data-services)
- [Analytics API](#analytics-api)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Security](#security)

## 🎯 Overview

The portfolio uses Next.js API routes for server-side functionality and provides various interactive components with programmatic APIs. All APIs follow RESTful principles and return JSON responses.

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mikhailajaj.github.io/api`

### Response Format

All API responses follow a consistent format:

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}
```

## 🛠️ API Routes

### Contact API

#### POST `/api/contact`

Submit a contact form message.

**Request Body:**

```typescript
interface ContactRequest {
  name: string; // Required, 2-100 characters
  email: string; // Required, valid email format
  subject: string; // Required, 5-200 characters
  message: string; // Required, 10-2000 characters
  domain?: string; // Optional, domain of interest
  budget?: string; // Optional, project budget range
  timeline?: string; // Optional, project timeline
  company?: string; // Optional, company name
}
```

**Response:**

```typescript
interface ContactResponse {
  success: boolean;
  messageId: string;
  estimatedResponse: string; // e.g., "within 24 hours"
}
```

**Example:**

```javascript
const response = await fetch("/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    subject: "Cloud Architecture Consultation",
    message: "I need help with AWS infrastructure optimization.",
    domain: "cloud-engineering",
    budget: "$25k-$50k",
    timeline: "3-6 months",
  }),
});

const result = await response.json();
```

**Error Codes:**

- `VALIDATION_ERROR`: Invalid input data
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

### Projects API

#### GET `/api/projects`

Retrieve all projects with optional filtering.

**Query Parameters:**

```typescript
interface ProjectsQuery {
  domain?: "full-stack" | "cloud" | "data" | "ux-ui" | "consulting";
  featured?: boolean;
  limit?: number; // Default: 10, Max: 50
  offset?: number; // Default: 0
  sort?: "date" | "impact" | "title";
  order?: "asc" | "desc"; // Default: 'desc'
}
```

**Response:**

```typescript
interface ProjectsResponse {
  projects: Project[];
  total: number;
  hasMore: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  impact: {
    revenue?: number;
    savings?: number;
    improvement?: string;
  };
  timeline: string;
  featured: boolean;
  images: string[];
  caseStudyUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
}
```

**Example:**

```javascript
// Get featured cloud engineering projects
const response = await fetch(
  "/api/projects?domain=cloud&featured=true&limit=5",
);
const { projects, total, hasMore } = await response.json();
```

### Technologies API

#### GET `/api/technologies`

Retrieve technology stack information.

**Query Parameters:**

```typescript
interface TechnologiesQuery {
  category?: "frontend" | "backend" | "cloud" | "data" | "design" | "tools";
  proficiency?: "beginner" | "intermediate" | "advanced" | "expert";
}
```

**Response:**

```typescript
interface Technology {
  name: string;
  category: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  yearsExperience: number;
  projects: number;
  certifications?: string[];
  description: string;
  icon: string;
}
```

### Testimonials API

#### GET `/api/testimonials`

Retrieve client testimonials.

**Query Parameters:**

```typescript
interface TestimonialsQuery {
  domain?: string;
  featured?: boolean;
  limit?: number;
}
```

**Response:**

```typescript
interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  company: string;
  domain: string;
  testimonial: string;
  rating: number;
  projectValue?: number;
  date: string;
  featured: boolean;
  avatar?: string;
}
```

## 🎮 Interactive Components API

### ROI Calculator

The ROI Calculator component provides programmatic access to ROI calculations.

```typescript
interface ROICalculatorAPI {
  calculate(params: ROIParams): ROIResult;
  getRecommendations(result: ROIResult): Recommendation[];
  exportReport(result: ROIResult): string; // PDF/CSV export
}

interface ROIParams {
  investment: number;
  timeframe: number; // months
  domain: "full-stack" | "cloud" | "data" | "ux-ui" | "consulting";
  projectType: string;
  teamSize?: number;
  complexity?: "low" | "medium" | "high";
}

interface ROIResult {
  roi: number; // ROI percentage
  netValue: number; // Net value in dollars
  paybackPeriod: number; // Months to break even
  riskLevel: "low" | "medium" | "high";
  confidence: number; // Confidence percentage
  breakdown: {
    development: number;
    infrastructure: number;
    maintenance: number;
    training: number;
  };
}
```

**Usage:**

```javascript
import { ROICalculator } from "@/components/interactive/ROICalculator";

const calculator = new ROICalculator();
const result = calculator.calculate({
  investment: 100000,
  timeframe: 12,
  domain: "cloud",
  projectType: "infrastructure-optimization",
  complexity: "medium",
});

console.log(`ROI: ${result.roi}%`);
console.log(`Payback Period: ${result.paybackPeriod} months`);
```

### 3D Visualization API

The 3D visualization components provide programmatic control over scenes and animations.

```typescript
interface Scene3DAPI {
  loadScene(config: SceneConfig): Promise<void>;
  updateData(data: any): void;
  startAnimation(): void;
  stopAnimation(): void;
  exportImage(format: "png" | "jpg"): string;
  getPerformanceMetrics(): PerformanceMetrics;
}

interface SceneConfig {
  type: "cloud-architecture" | "data-flow" | "network-topology";
  data: any;
  theme: "light" | "dark";
  quality: "low" | "medium" | "high";
  animations: boolean;
}
```

### Analytics API

Track user interactions and component performance.

```typescript
interface AnalyticsAPI {
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(page: string): void;
  trackConversion(conversion: ConversionEvent): void;
  getMetrics(): Promise<AnalyticsMetrics>;
}

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}
```

## 🗄️ Data Services

### Project Data Service

```typescript
class ProjectDataService {
  static async getProjects(filters?: ProjectFilters): Promise<Project[]>;
  static async getProjectById(id: string): Promise<Project | null>;
  static async getFeaturedProjects(domain?: string): Promise<Project[]>;
  static async searchProjects(query: string): Promise<Project[]>;
}
```

### Technology Data Service

```typescript
class TechnologyDataService {
  static async getTechnologies(category?: string): Promise<Technology[]>;
  static async getTechnologyByName(name: string): Promise<Technology | null>;
  static async getSkillMatrix(): Promise<SkillMatrix>;
}
```

### Testimonial Data Service

```typescript
class TestimonialDataService {
  static async getTestimonials(
    filters?: TestimonialFilters,
  ): Promise<Testimonial[]>;
  static async getFeaturedTestimonials(): Promise<Testimonial[]>;
  static async getTestimonialsByDomain(domain: string): Promise<Testimonial[]>;
}
```

## 📊 Analytics API

### Event Tracking

Track user interactions across the portfolio:

```typescript
// Track component interactions
analytics.trackEvent({
  category: "Interactive Component",
  action: "ROI Calculator Used",
  label: "Cloud Engineering",
  value: 150000, // Investment amount
  customData: {
    domain: "cloud",
    timeframe: 12,
    complexity: "medium",
  },
});

// Track page engagement
analytics.trackEvent({
  category: "Page Engagement",
  action: "Time on Page",
  label: "Full Stack Services",
  value: 120, // seconds
});
```

### Conversion Tracking

Track business-relevant actions:

```typescript
// Track contact form submissions
analytics.trackConversion({
  type: "contact_form",
  value: "cloud-consultation",
  revenue: 50000, // Estimated project value
  source: "organic",
  campaign: "portfolio",
});

// Track project inquiries
analytics.trackConversion({
  type: "project_inquiry",
  value: "full-stack-development",
  revenue: 75000,
  source: "referral",
});
```

## ⚠️ Error Handling

### Error Response Format

```typescript
interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
  };
}
```

### Common Error Codes

| Code               | Description             | HTTP Status |
| ------------------ | ----------------------- | ----------- |
| `VALIDATION_ERROR` | Invalid input data      | 400         |
| `NOT_FOUND`        | Resource not found      | 404         |
| `RATE_LIMITED`     | Too many requests       | 429         |
| `SERVER_ERROR`     | Internal server error   | 500         |
| `UNAUTHORIZED`     | Authentication required | 401         |
| `FORBIDDEN`        | Access denied           | 403         |

### Error Handling Example

```javascript
try {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });

  const result = await response.json();

  if (!result.success) {
    switch (result.error.code) {
      case "VALIDATION_ERROR":
        handleValidationError(result.error.details);
        break;
      case "RATE_LIMITED":
        showRateLimitMessage();
        break;
      default:
        showGenericError(result.error.message);
    }
    return;
  }

  // Handle success
  showSuccessMessage(result.data);
} catch (error) {
  console.error("API request failed:", error);
  showNetworkError();
}
```

## 🔒 Rate Limiting

### Limits

| Endpoint            | Limit        | Window |
| ------------------- | ------------ | ------ |
| `/api/contact`      | 5 requests   | 1 hour |
| `/api/projects`     | 100 requests | 1 hour |
| `/api/technologies` | 100 requests | 1 hour |
| `/api/testimonials` | 100 requests | 1 hour |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔐 Security

### Input Validation

All API endpoints implement comprehensive input validation:

- **Sanitization**: HTML and script injection prevention
- **Type Checking**: Strict TypeScript validation
- **Length Limits**: Prevent oversized payloads
- **Format Validation**: Email, URL, and data format checks

### Security Headers

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### CORS Policy

```javascript
// Allowed origins for API requests
const allowedOrigins = [
  "https://mikhailajaj.github.io",
  "http://localhost:3000", // Development only
];
```

## 📚 SDK and Libraries

### JavaScript/TypeScript SDK

```bash
npm install @mikhailajaj/portfolio-sdk
```

```typescript
import { PortfolioAPI } from "@mikhailajaj/portfolio-sdk";

const api = new PortfolioAPI({
  baseURL: "https://mikhailajaj.github.io/api",
  apiKey: "your-api-key", // If required
});

// Get projects
const projects = await api.projects.getAll({ domain: "cloud" });

// Calculate ROI
const roi = await api.calculator.calculateROI({
  investment: 100000,
  domain: "full-stack",
  timeframe: 12,
});
```

## 🧪 Testing

### API Testing

```javascript
// Example API test
describe("Contact API", () => {
  it("should submit contact form successfully", async () => {
    const response = await request(app)
      .post("/api/contact")
      .send({
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "Test message content",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.messageId).toBeDefined();
  });
});
```

## 📈 Performance

### Response Times

- **Contact API**: < 200ms
- **Projects API**: < 100ms
- **Technologies API**: < 50ms
- **Testimonials API**: < 100ms

### Caching Strategy

- **Static Data**: 1 hour cache
- **Dynamic Data**: 5 minutes cache
- **User-specific Data**: No cache

---

This API documentation provides comprehensive information for integrating with and extending the Mikhail Ajaj Portfolio. For additional support or questions, please refer to the [Contributing Guidelines](../CONTRIBUTING.md) or open an issue on GitHub.

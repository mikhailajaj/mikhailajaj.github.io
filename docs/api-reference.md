# API Reference Documentation

**Last Updated:** December 19, 2024  
**Version:** 1.0.0

## Overview

This document provides comprehensive documentation for all API routes in the Mikhail Ajaj Portfolio application. The API follows RESTful conventions and is built using Next.js App Router API routes.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://mikhailajaj.github.io/api`

## Authentication

Currently, the API does not require authentication for public endpoints. Future versions may include API key authentication for administrative functions.

## API Endpoints

### Contact API

#### Submit Contact Form
**Endpoint:** `POST /api/contact`  
**File:** `app/api/contact/page.tsx`

Submit a contact form with user inquiry details.

**Request Body:**
```typescript
{
  name: string;           // Required: Full name
  email: string;          // Required: Valid email address
  company?: string;       // Optional: Company name
  subject: string;        // Required: Message subject
  message: string;        // Required: Message content (min 10 chars)
  domain?: string;        // Optional: Relevant expertise domain
  budget?: string;        // Optional: Project budget range
  timeline?: string;      // Optional: Project timeline
  projectType?: string;   // Optional: Type of project
}
```

**Response:**
```typescript
// Success (200)
{
  success: true;
  message: "Contact form submitted successfully";
  id: string;             // Submission ID
  timestamp: string;      // ISO timestamp
}

// Error (400)
{
  success: false;
  error: string;          // Error description
  details?: object;       // Validation details
}

// Server Error (500)
{
  success: false;
  error: "Internal server error";
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a full-stack development project.",
    "domain": "full-stack",
    "budget": "$10k-$25k",
    "timeline": "3-6 months"
  }'
```

**Validation Rules:**
- `name`: 2-100 characters, letters and spaces only
- `email`: Valid email format
- `subject`: 5-200 characters
- `message`: 10-2000 characters
- `domain`: Must be valid domain ID if provided

### Error Reporting API

#### Submit Error Report
**Endpoint:** `POST /api/error-report`  
**File:** `app/api/error-report/route.ts`

Submit error reports for tracking and analytics.

**Request Body:**
```typescript
{
  type: 'javascript-error' | 'network-error' | 'performance-issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;        // Error message
  stack?: string;         // Stack trace
  url: string;           // Page URL where error occurred
  userAgent: string;     // Browser user agent
  context?: {
    component?: string;   // Component where error occurred
    domain?: string;      // Domain context
    route?: string;       // Current route
    additionalData?: object; // Additional context
  };
}
```

**Response:**
```typescript
// Success (200)
{
  success: true;
  errorId: string;       // Unique error ID
  timestamp: string;     // ISO timestamp
}

// Error (400)
{
  success: false;
  error: string;
}
```

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/error-report \
  -H "Content-Type: application/json" \
  -d '{
    "type": "javascript-error",
    "severity": "medium",
    "message": "Cannot read property of undefined",
    "stack": "Error: Cannot read property...",
    "url": "/full-stack",
    "userAgent": "Mozilla/5.0...",
    "context": {
      "component": "FullStackHero",
      "domain": "full-stack"
    }
  }'
```

### Projects API

#### Get All Projects
**Endpoint:** `GET /api/projects`  
**File:** `app/api/projects/route.ts`

Retrieve all project case studies with optional filtering.

**Query Parameters:**
```typescript
{
  domain?: string;        // Filter by domain
  featured?: boolean;     // Filter featured projects
  limit?: number;         // Limit results (default: 50)
  offset?: number;        // Pagination offset (default: 0)
  search?: string;        // Search in title/description
}
```

**Response:**
```typescript
{
  success: true;
  projects: ProjectCaseStudy[];
  total: number;          // Total count
  page: number;           // Current page
  hasMore: boolean;       // More results available
}
```

**Example Request:**
```bash
# Get all featured full-stack projects
curl "http://localhost:3000/api/projects?domain=full-stack&featured=true"

# Search projects
curl "http://localhost:3000/api/projects?search=react&limit=10"
```

#### Get Project by ID
**Endpoint:** `GET /api/projects/[id]`

Retrieve a specific project by its ID.

**Response:**
```typescript
// Success (200)
{
  success: true;
  project: ProjectCaseStudy;
}

// Not Found (404)
{
  success: false;
  error: "Project not found";
}
```

### Testimonials API

#### Get All Testimonials
**Endpoint:** `GET /api/testimonials`  
**File:** `app/api/testimonials/route.ts`

Retrieve testimonials with optional filtering.

**Query Parameters:**
```typescript
{
  domain?: string;        // Filter by domain
  featured?: boolean;     // Filter featured testimonials
  rating?: number;        // Minimum rating filter
  limit?: number;         // Limit results
  hasVideo?: boolean;     // Filter video testimonials
}
```

**Response:**
```typescript
{
  success: true;
  testimonials: Testimonial[];
  total: number;
  averageRating: number;
}
```

**Example Request:**
```bash
# Get featured testimonials with videos
curl "http://localhost:3000/api/testimonials?featured=true&hasVideo=true"
```

### Technologies API

#### Get Technology Stack
**Endpoint:** `GET /api/technologies`  
**File:** `app/api/technologies/route.ts`

Retrieve the complete technology stack organized by category.

**Response:**
```typescript
{
  success: true;
  technologies: {
    [category: string]: {
      name: string;
      description: string;
      technologies: string[];
      icon?: string;
    }
  };
  domains: {
    [domain: string]: string[];  // Technologies by domain
  };
}
```

## Error Handling

### Standard Error Response
All API endpoints follow a consistent error response format:

```typescript
{
  success: false;
  error: string;           // Human-readable error message
  code?: string;           // Error code for programmatic handling
  details?: object;        // Additional error details
  timestamp: string;       // ISO timestamp
}
```

### HTTP Status Codes

- **200 OK**: Successful request
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

### Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `INTERNAL_ERROR`: Unexpected server error

## Rate Limiting

### Current Limits
- **Contact API**: 5 requests per minute per IP
- **Error Reporting**: 100 requests per minute per IP
- **Data APIs**: 60 requests per minute per IP

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## Request/Response Examples

### Successful Contact Submission
```bash
# Request
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@company.com",
    "subject": "Cloud Architecture Consultation",
    "message": "We need help designing a scalable cloud infrastructure for our e-commerce platform.",
    "domain": "cloud-engineering",
    "budget": "$25k-$50k",
    "timeline": "2-4 months",
    "company": "TechCorp Inc"
  }'

# Response
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "contact_2024_001",
  "timestamp": "2024-12-19T10:30:00.000Z"
}
```

### Project Search
```bash
# Request
curl "http://localhost:3000/api/projects?search=e-commerce&domain=full-stack&limit=5"

# Response
{
  "success": true,
  "projects": [
    {
      "id": "ecommerce-platform",
      "title": "E-commerce Platform Redesign",
      "description": "Complete redesign of legacy e-commerce platform",
      "technologies": ["React", "Node.js", "PostgreSQL"],
      "domain": "full-stack",
      "featured": true,
      "caseStudy": {
        "challenge": "Legacy system performance issues",
        "solution": "Modern React architecture with optimized backend",
        "results": ["50% performance improvement", "30% increase in conversions"],
        "impact": [
          {
            "metric": "Page Load Time",
            "value": "2.1s → 0.8s",
            "description": "62% improvement in page load speed"
          }
        ]
      }
    }
  ],
  "total": 1,
  "page": 1,
  "hasMore": false
}
```

## SDK and Client Libraries

### JavaScript/TypeScript Client
```typescript
// Example client usage
import { PortfolioAPI } from '@/lib/api/client';

const api = new PortfolioAPI();

// Submit contact form
const result = await api.contact.submit({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'Looking for full-stack development help'
});

// Get projects
const projects = await api.projects.getAll({
  domain: 'full-stack',
  featured: true
});
```

## Testing

### API Testing
```bash
# Run API tests
npm run test:api

# Test specific endpoint
npm run test -- --testPathPattern=api/contact

# Integration tests
npm run test:integration
```

### Manual Testing
Use the provided Postman collection or curl commands for manual API testing.

## Monitoring and Analytics

### Performance Metrics
- Response time tracking
- Error rate monitoring
- Request volume analytics
- User behavior tracking

### Admin Dashboard
Access API analytics at `/admin/api-analytics` (when available).

## Future Enhancements

### Planned Features
- **Authentication**: API key-based authentication
- **Webhooks**: Real-time notifications
- **GraphQL**: Alternative query interface
- **Caching**: Redis-based response caching
- **Versioning**: API version management

### Breaking Changes
Future API changes will be documented with migration guides and deprecation notices.

## Support

For API support and questions:
- **Documentation**: This reference guide
- **Issues**: GitHub repository issues
- **Contact**: Through the contact API or admin dashboard
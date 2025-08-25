# Review System Tech Stack & Architecture

## 🏗️ Architecture Overview

### System Design Pattern
**File-Based + API-Driven Architecture**
```
Frontend (React/Next.js) ↔ API Routes ↔ File System Storage
                         ↕
                    Email Service (Resend)
```

### Data Flow
```
1. User submits review → API validation → File storage (pending)
2. Email verification → Token validation → Move to verified
3. Admin approval → Human review → Move to approved
4. Display system → Read approved reviews → Render components
```

---

## 🛠️ Technology Stack

### Core Framework (Existing)
```typescript
// Already in your stack - no additional cost
✓ Next.js 15.0.2          // App Router, API Routes, SSG
✓ React 18.3.1            // Component library
✓ TypeScript 5.x          // Type safety
✓ Tailwind CSS 3.4.1     // Styling system
```

### UI Components (Existing)
```typescript
// Leveraging your current UI stack
✓ Radix UI                // Accessible components
  - @radix-ui/react-dialog
  - @radix-ui/react-label
  - @radix-ui/react-separator
✓ Lucide React           // Icons
✓ Framer Motion          // Animations
✓ class-variance-authority // Component variants
```

### Form & Validation (Existing)
```typescript
// Your current form handling
✓ React Hook Form 7.59.0  // Form management
✓ Zod 3.25.67            // Schema validation
✓ @hookform/resolvers     // Form validation integration
```

### New Dependencies (Minimal Cost)
```json
{
  "resend": "^3.2.0",                    // $0 (3k emails/month free)
  "dompurify": "^3.0.8",               // $0 (open source)
  "rate-limiter-flexible": "^5.0.3",   // $0 (open source)
  "jose": "^5.2.0"                     // $0 (JWT library)
}
```

**Total Additional Cost: $0/month**

---

## 📁 File System Architecture

### Storage Structure
```
data/
├── reviews/
│   ├── pending/              # Awaiting email verification
│   │   ├── {token}.json     # Temporary submissions
│   │   └── metadata.json    # Submission tracking
│   ├── verified/             # Email verified, awaiting approval
│   │   ├── {id}.json        # Verified submissions
│   │   └── index.json       # Quick lookup
│   ├── approved/             # Published reviews
│   │   ├── {id}.json        # Approved reviews
│   │   ├── featured.json    # Featured reviews list
│   │   └── stats.json       # Aggregate statistics
│   ├── rejected/             # Rejected submissions
│   │   └── {id}.json        # Audit trail
│   └── archive/              # Old/expired reviews
│       └── {year}/          # Yearly archives
├── verification/
│   ├── tokens/              # Email verification tokens
│   │   ├── {token}.json     # Token metadata
│   │   └── cleanup.json     # Cleanup schedule
│   └── domains/             # Trusted domain list
│       └── whitelist.json   # Approved domains
└── audit/
    ├── submissions.log      # All submission attempts
    ├── approvals.log        # Admin actions
    └── security.log         # Security events
```

### Data Models
```typescript
// Core review interface
interface Review {
  id: string;
  status: 'pending' | 'verified' | 'approved' | 'rejected';
  
  // Reviewer information
  reviewer: {
    name: string;
    email: string;
    title?: string;
    organization?: string;
    relationship: 'professor' | 'colleague' | 'supervisor' | 'collaborator';
    linkedinUrl?: string;
    verified: boolean;
  };
  
  // Review content
  content: {
    rating: number; // 1-5
    testimonial: string;
    projectAssociation?: string;
    skills?: string[];
    recommendation: boolean;
  };
  
  // Metadata
  metadata: {
    submittedAt: string;
    verifiedAt?: string;
    approvedAt?: string;
    ipAddress: string;
    userAgent: string;
    source: 'direct' | 'linkedin' | 'email';
  };
  
  // Admin fields
  admin: {
    notes?: string;
    featured: boolean;
    displayOrder?: number;
    moderatedBy?: string;
    moderatedAt?: string;
  };
}
```

---

## 🔐 Security Architecture

### Multi-Layer Security Model
```
Layer 1: Input Validation (Zod schemas)
Layer 2: Rate Limiting (IP + Email based)
Layer 3: Email Verification (Token-based)
Layer 4: Domain Validation (Whitelist)
Layer 5: Content Sanitization (DOMPurify)
Layer 6: Human Review (Manual approval)
Layer 7: Audit Logging (All actions tracked)
```

### Security Components
```typescript
// Rate limiting configuration
const rateLimits = {
  submission: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 1, // 1 submission per email per day
    skipSuccessfulRequests: false
  },
  verification: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 verification attempts per hour
    skipSuccessfulRequests: true
  }
};

// Domain whitelist
const trustedDomains = [
  // Educational institutions
  '.edu', '.ac.uk', '.edu.au',
  // Major corporations (configurable)
  'microsoft.com', 'google.com', 'amazon.com',
  // Custom additions
  ...customDomains
];
```

---

## 📧 Email Service Integration

### Resend Configuration
```typescript
// Email service setup
const emailConfig = {
  provider: 'resend',
  apiKey: process.env.RESEND_API_KEY,
  fromEmail: 'reviews@mikhailajaj.com',
  templates: {
    verification: 'review-verification',
    approval: 'review-approved',
    rejection: 'review-rejected'
  },
  limits: {
    daily: 100,    // Conservative limit
    monthly: 3000  // Free tier limit
  }
};
```

### Email Templates
```html
<!-- Verification email template -->
<div class="email-template">
  <h2>Verify Your Review Submission</h2>
  <p>Thank you for submitting a review for Mikhail Ajaj.</p>
  <p>Please click the link below to verify your email:</p>
  <a href="{{verificationUrl}}" class="verify-button">
    Verify Email
  </a>
  <p>This link expires in 24 hours.</p>
</div>
```

---

## 🎨 Component Architecture

### Component Hierarchy
```
ReviewSystem/
├── ReviewForm/              # Submission interface
│   ├── PersonalInfo         # Name, email, title
│   ├── ReviewContent        # Rating, testimonial
│   ├── Verification         # Email verification
│   └── SuccessMessage       # Confirmation
├── ReviewDisplay/           # Public showcase
│   ├── TestimonialGrid      # Multiple reviews
│   ├── ReviewCard           # Individual review
│   ├── ReviewStats          # Aggregate data
│   └── FeaturedReviews      # Homepage highlights
├── AdminInterface/          # Management tools
│   ├── PendingReviews       # Approval queue
│   ├── ReviewManager        # CRUD operations
│   ├── Analytics            # Usage statistics
│   └── SecurityMonitor     # Audit logs
└── Shared/                  # Common components
    ├── RatingDisplay        # Star ratings
    ├── ReviewerProfile      # Reviewer info
    ├── StatusBadge          # Review status
    └── LoadingStates        # Loading indicators
```

### Integration with Existing Components
```typescript
// Leveraging your current UI system
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// Using your theme system
import { useTheme } from '@/lib/contexts/DomainThemeContext';

// Following your component patterns
export const ReviewCard = ({ review }: ReviewCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "review-card",
      theme.components.card.base,
      theme.components.card.variants.elevated
    )}>
      {/* Review content */}
    </div>
  );
};
```

---

## 🚀 Performance Optimization

### Optimization Strategy
```typescript
// Static generation for approved reviews
export async function generateStaticParams() {
  const approvedReviews = await getApprovedReviews();
  return approvedReviews.map(review => ({ id: review.id }));
}

// Incremental Static Regeneration
export const revalidate = 3600; // 1 hour

// Image optimization for reviewer avatars
const optimizedAvatar = {
  src: `/api/images/avatar/${reviewerId}`,
  width: 64,
  height: 64,
  quality: 85,
  format: 'webp'
};
```

### Caching Strategy
```typescript
// API response caching
const cacheConfig = {
  approved: 3600,    // 1 hour for approved reviews
  stats: 1800,       // 30 minutes for statistics
  featured: 7200,    // 2 hours for featured reviews
  admin: 0           // No caching for admin data
};
```

---

## 📊 Monitoring & Analytics

### Performance Monitoring
```typescript
// Web Vitals tracking
const performanceMetrics = {
  LCP: 'Largest Contentful Paint',
  FID: 'First Input Delay',
  CLS: 'Cumulative Layout Shift',
  TTFB: 'Time to First Byte'
};

// Custom metrics
const reviewMetrics = {
  submissionRate: 'Reviews per day',
  approvalRate: 'Approval percentage',
  verificationRate: 'Email verification success',
  displayPerformance: 'Review rendering time'
};
```

### Security Monitoring
```typescript
// Security event tracking
const securityEvents = {
  rateLimitHit: 'Rate limit exceeded',
  invalidToken: 'Invalid verification token',
  suspiciousContent: 'Potential spam detected',
  domainRejection: 'Untrusted domain blocked'
};
```

---

## 🔧 Development Workflow

### Local Development Setup
```bash
# Environment variables
RESEND_API_KEY=your_resend_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVIEW_ADMIN_EMAIL=your_admin_email

# Development commands
npm run dev              # Start development server
npm run test:reviews     # Run review system tests
npm run lint:security    # Security linting
npm run build:production # Production build
```

### Testing Strategy
```typescript
// Test categories
const testSuite = {
  unit: [
    'validation schemas',
    'utility functions',
    'security helpers',
    'email templates'
  ],
  integration: [
    'submission workflow',
    'verification process',
    'approval workflow',
    'display rendering'
  ],
  security: [
    'input sanitization',
    'rate limiting',
    'token validation',
    'domain checking'
  ],
  performance: [
    'API response times',
    'component rendering',
    'image optimization',
    'bundle analysis'
  ]
};
```

This architecture provides a robust, secure, and cost-effective review system that integrates seamlessly with your existing Next.js portfolio while maintaining zero operational costs.
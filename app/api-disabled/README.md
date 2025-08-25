# API Routes - Disabled for Static Export

These API routes have been moved here because Next.js static export (`output: 'export'`) doesn't support API routes.

## Why API Routes Are Disabled

GitHub Pages only serves static files and cannot execute server-side code. API routes require a Node.js server to run.

## Alternative Solutions

If you need dynamic functionality, consider:

1. **Client-side data fetching** from external APIs
2. **Static data generation** at build time
3. **Serverless functions** on platforms like Vercel, Netlify, or AWS Lambda
4. **Third-party services** for forms, comments, etc.

## Re-enabling API Routes

To re-enable these routes for local development or server deployment:

1. Move the contents back to `app/api/`
2. Change `output: 'export'` to `output: 'standalone'` in `next.config.mjs`
3. Deploy to a platform that supports Node.js

## Current API Routes (Disabled)

- `/api/admin/` - Admin functionality
- `/api/contact/` - Contact form handling
- `/api/error-report/` - Error reporting
- `/api/projects/` - Project data
- `/api/reviews/` - Review system
- `/api/technologies/` - Technology data
- `/api/testimonials/` - Testimonial data
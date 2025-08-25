# Reviews Display API Documentation

## Overview

The Reviews Display API provides public access to approved testimonials and reviews. It supports filtering, sorting, pagination, and caching for optimal performance.

## Endpoints

### GET /api/reviews/display

Retrieves approved reviews for public display.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 12 | Maximum number of reviews to return (max: 50) |
| `offset` | number | 0 | Number of reviews to skip for pagination |
| `sortBy` | string | 'approvedAt' | Sort field: 'approvedAt', 'rating', 'name', 'organization' |
| `sortOrder` | string | 'desc' | Sort order: 'asc' or 'desc' |
| `featured` | boolean | false | Return only featured reviews when 'true' |
| `minRating` | number | - | Filter by minimum rating (1-5) |
| `relationship` | string | - | Filter by reviewer relationship type |
| `search` | string | - | Search in testimonial content, reviewer name, or organization |

#### Example Requests

```bash
# Get first 10 reviews
GET /api/reviews/display?limit=10&offset=0

# Get featured reviews only
GET /api/reviews/display?featured=true

# Get reviews with minimum 4-star rating
GET /api/reviews/display?minRating=4

# Search for reviews mentioning "React"
GET /api/reviews/display?search=React

# Get reviews from professors, sorted by rating
GET /api/reviews/display?relationship=professor&sortBy=rating&sortOrder=desc
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review-123",
        "reviewer": {
          "name": "Dr. Sarah Johnson",
          "title": "Professor of Computer Science",
          "organization": "Tech University",
          "relationship": "professor",
          "verified": true
        },
        "content": {
          "rating": 5,
          "testimonial": "Excellent work on the project...",
          "projectAssociation": "Research Project",
          "skills": ["React", "Node.js"],
          "recommendation": true,
          "highlights": ["Technical Excellence"]
        },
        "metadata": {
          "approvedAt": "2024-01-16T09:15:00Z",
          "source": "direct"
        }
      }
    ],
    "featured": [
      // Featured reviews (when offset=0 or featured=true)
    ],
    "pagination": {
      "total": 25,
      "limit": 12,
      "offset": 0,
      "hasMore": true,
      "totalPages": 3,
      "currentPage": 1
    },
    "filters": {
      "sortBy": "approvedAt",
      "sortOrder": "desc",
      "featured": false,
      "minRating": null,
      "relationship": null,
      "search": null
    }
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "INVALID_SORT_FIELD",
  "message": "Invalid sort field specified."
}
```

## Data Privacy

The API automatically removes sensitive information from reviews:

- **Removed**: Email addresses, IP addresses, user agents, internal admin notes
- **Included**: Public reviewer information, testimonial content, ratings, approval dates

## Caching

The API includes performance optimizations:

- **Cache-Control**: `public, max-age=3600, s-maxage=7200` (1 hour browser, 2 hours CDN)
- **ETag**: Generated based on request URL and current hour
- **Static Fallback**: Falls back to static data in production builds

## Security Headers

All responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Static Build Support

For static deployments (GitHub Pages, Netlify, etc.), the system provides:

1. **Static Data Module**: `lib/data/reviews.ts` with the same filtering/sorting capabilities
2. **Universal Fetcher**: `fetchReviews()` function that works in both static and dynamic environments
3. **Build-time Generation**: Reviews can be pre-generated at build time

### Using Static Data

```typescript
import { getReviews, getFeaturedReviews } from '@/lib/data/reviews';

// Get reviews with filtering
const result = getReviews({
  limit: 10,
  minRating: 4,
  sortBy: 'rating',
  sortOrder: 'desc'
});

// Get featured reviews
const featured = getFeaturedReviews(4);
```

### Universal Usage

```typescript
import { fetchReviews } from '@/lib/data/reviews';

// Works in both static and dynamic environments
const result = await fetchReviews({
  limit: 10,
  search: 'React'
});
```

## Error Handling

The API handles various error scenarios:

- **Invalid Parameters**: Returns 400 with specific error message
- **File System Errors**: Gracefully handles missing directories/files
- **Rate Limiting**: Applies standard rate limiting (inherited from admin API)
- **Fallback**: Falls back to static data when API is unavailable

## Performance Considerations

- **Pagination**: Use appropriate `limit` values (default: 12, max: 50)
- **Caching**: Leverage browser and CDN caching with provided headers
- **Filtering**: Apply filters server-side rather than client-side for better performance
- **Search**: Use specific search terms for better performance

## Integration Examples

### React Component

```typescript
import { useState, useEffect } from 'react';
import { fetchReviews } from '@/lib/data/reviews';

function ReviewsList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const result = await fetchReviews({ limit: 6 });
        setReviews(result.reviews);
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {reviews.map(review => (
        <div key={review.id}>
          <h3>{review.reviewer.name}</h3>
          <p>{review.content.testimonial}</p>
          <div>Rating: {review.content.rating}/5</div>
        </div>
      ))}
    </div>
  );
}
```

### Next.js Page

```typescript
import { GetStaticProps } from 'next';
import { getReviews } from '@/lib/data/reviews';

export default function TestimonialsPage({ reviews, pagination }) {
  return (
    <div>
      <h1>Testimonials</h1>
      {reviews.map(review => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const result = getReviews({ limit: 12 });
  
  return {
    props: {
      reviews: result.reviews,
      pagination: result.pagination
    },
    revalidate: 3600 // Revalidate every hour
  };
};
```

## Testing

The API includes comprehensive tests:

- **Unit Tests**: Core functionality and edge cases
- **Integration Tests**: End-to-end workflows
- **Static Data Tests**: Filtering, sorting, and pagination logic

Run tests with:

```bash
npm test -- __tests__/api/reviews/display
npm test -- __tests__/lib/data/reviews
```
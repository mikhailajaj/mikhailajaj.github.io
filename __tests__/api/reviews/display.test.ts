/**
 * Tests for Review Display API
 */

import { GET } from '@/app/api/reviews/display/route';
import { promises as fs } from 'fs';
import path from 'path';

// Mock the file system
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
  }
}));

// Mock NextRequest
const createMockRequest = (url: string) => ({
  url,
  headers: new Map([
    ['x-forwarded-for', '127.0.0.1'],
    ['user-agent', 'test-agent']
  ])
});

const mockFs = fs as jest.Mocked<typeof fs>;

describe('/api/reviews/display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockReview = {
    id: 'test-review-1',
    status: 'approved',
    reviewer: {
      name: 'John Doe',
      email: 'john@example.com',
      title: 'Senior Developer',
      organization: 'Tech Corp',
      relationship: 'colleague',
      verified: true
    },
    content: {
      rating: 5,
      testimonial: 'Excellent work on the project. Highly recommended for future collaborations.',
      recommendation: true
    },
    metadata: {
      submittedAt: '2024-01-01T00:00:00Z',
      approvedAt: '2024-01-02T00:00:00Z',
      source: 'direct',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
      language: 'en',
      timezone: 'UTC'
    },
    admin: {
      featured: false,
      moderatedAt: '2024-01-02T00:00:00Z'
    }
  };

  it('should return approved reviews successfully', async () => {
    // Mock file system responses
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue(['test-review-1.json', 'index.json'] as any);
    mockFs.readFile.mockResolvedValue(JSON.stringify(mockReview));

    const request = createMockRequest('http://localhost:3000/api/reviews/display') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.reviews).toHaveLength(1);
    expect(data.data.reviews[0].id).toBe('test-review-1');
    expect(data.data.reviews[0].reviewer.email).toBeUndefined(); // Email should be removed
    expect(data.data.reviews[0].reviewer.name).toBe('John Doe');
  });

  it('should handle pagination correctly', async () => {
    // Mock multiple reviews
    const reviews = Array.from({ length: 15 }, (_, i) => ({
      ...mockReview,
      id: `test-review-${i + 1}`,
      reviewer: { ...mockReview.reviewer, name: `User ${i + 1}` }
    }));

    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue(reviews.map((_, i) => `test-review-${i + 1}.json`) as any);
    mockFs.readFile.mockImplementation((filePath) => {
      const filename = path.basename(filePath as string);
      const index = parseInt(filename.split('-')[2].split('.')[0]) - 1;
      return Promise.resolve(JSON.stringify(reviews[index]));
    });

    const request = createMockRequest('http://localhost:3000/api/reviews/display?limit=10&offset=0') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.reviews).toHaveLength(10);
    expect(data.data.pagination.total).toBe(15);
    expect(data.data.pagination.hasMore).toBe(true);
    expect(data.data.pagination.currentPage).toBe(1);
  });

  it('should filter by minimum rating', async () => {
    const lowRatingReview = { ...mockReview, id: 'low-rating', content: { ...mockReview.content, rating: 3 } };
    const highRatingReview = { ...mockReview, id: 'high-rating', content: { ...mockReview.content, rating: 5 } };

    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue(['low-rating.json', 'high-rating.json'] as any);
    mockFs.readFile.mockImplementation((filePath) => {
      const filename = path.basename(filePath as string);
      if (filename === 'low-rating.json') {
        return Promise.resolve(JSON.stringify(lowRatingReview));
      }
      return Promise.resolve(JSON.stringify(highRatingReview));
    });

    const request = createMockRequest('http://localhost:3000/api/reviews/display?minRating=4') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.reviews).toHaveLength(1);
    expect(data.data.reviews[0].id).toBe('high-rating');
  });

  it('should filter by featured status', async () => {
    const featuredReview = { ...mockReview, id: 'featured', admin: { ...mockReview.admin, featured: true } };
    const regularReview = { ...mockReview, id: 'regular', admin: { ...mockReview.admin, featured: false } };

    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue(['featured.json', 'regular.json'] as any);
    mockFs.readFile.mockImplementation((filePath) => {
      const filename = path.basename(filePath as string);
      if (filename === 'featured.json') {
        return Promise.resolve(JSON.stringify(featuredReview));
      }
      return Promise.resolve(JSON.stringify(regularReview));
    });

    const request = createMockRequest('http://localhost:3000/api/reviews/display?featured=true') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.reviews).toHaveLength(1);
    expect(data.data.reviews[0].id).toBe('featured');
  });

  it('should handle search functionality', async () => {
    const matchingReview = { 
      ...mockReview, 
      id: 'matching', 
      content: { ...mockReview.content, testimonial: 'Great collaboration on the React project' }
    };
    const nonMatchingReview = { 
      ...mockReview, 
      id: 'non-matching', 
      content: { ...mockReview.content, testimonial: 'Excellent work on backend systems' }
    };

    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue(['matching.json', 'non-matching.json'] as any);
    mockFs.readFile.mockImplementation((filePath) => {
      const filename = path.basename(filePath as string);
      if (filename === 'matching.json') {
        return Promise.resolve(JSON.stringify(matchingReview));
      }
      return Promise.resolve(JSON.stringify(nonMatchingReview));
    });

    const request = createMockRequest('http://localhost:3000/api/reviews/display?search=React') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.reviews).toHaveLength(1);
    expect(data.data.reviews[0].id).toBe('matching');
  });

  it('should handle empty results gracefully', async () => {
    // Mock directory doesn't exist
    mockFs.access.mockRejectedValue(new Error('Directory not found'));

    const request = createMockRequest('http://localhost:3000/api/reviews/display') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.reviews).toHaveLength(0);
    expect(data.data.pagination.total).toBe(0);
  });

  it('should validate sort parameters', async () => {
    const request = createMockRequest('http://localhost:3000/api/reviews/display?sortBy=invalid') as any;
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('INVALID_SORT_FIELD');
  });

  it('should include proper caching headers', async () => {
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue(['test-review-1.json'] as any);
    mockFs.readFile.mockResolvedValue(JSON.stringify(mockReview));

    const request = createMockRequest('http://localhost:3000/api/reviews/display') as any;
    const response = await GET(request);

    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=7200');
    expect(response.headers.get('ETag')).toBeDefined();
  });

  it('should include security headers', async () => {
    mockFs.access.mockResolvedValue(undefined);
    mockFs.readdir.mockResolvedValue([]);

    const request = createMockRequest('http://localhost:3000/api/reviews/display') as any;
    const response = await GET(request);

    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
  });
});
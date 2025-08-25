import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configure for static export
export const dynamic = 'force-static';
export const revalidate = false;

// Types (minimal to avoid importing server-only modules)
interface ReviewFile {
  id: string;
  status?: string;
  reviewer: {
    name: string;
    email?: string;
    title?: string;
    organization?: string;
    relationship?: string;
    verified?: boolean;
    linkedinUrl?: string;
    website?: string;
    avatar?: string;
  };
  content: {
    rating: number;
    testimonial: string;
    projectAssociation?: string;
    skills?: string[];
    recommendation?: boolean;
    highlights?: string[];
    workPeriod?: { start?: string; end?: string };
  };
  metadata: {
    submittedAt?: string;
    verifiedAt?: string | null;
    approvedAt?: string | null;
    source?: string;
    language?: string;
    timezone?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  admin?: {
    notes?: string;
    featured?: boolean;
    displayOrder?: number;
    moderatedBy?: string;
    moderatedAt?: string | null;
    tags?: string[];
    internalRating?: number;
  };
}

const APPROVED_DIR = path.join(process.cwd(), 'data', 'reviews', 'approved');
const MAX_LIMIT = 50;

function sanitizeReview(r: ReviewFile) {
  const { reviewer, metadata, ...rest } = r;
  return {
    ...rest,
    reviewer: {
      name: reviewer?.name,
      title: reviewer?.title || '',
      organization: reviewer?.organization || '',
      relationship: reviewer?.relationship || '',
      linkedinUrl: reviewer?.linkedinUrl,
      verified: reviewer?.verified ?? false,
    },
    content: r.content,
    metadata: {
      approvedAt: r.metadata?.approvedAt || undefined,
      source: r.metadata?.source || 'direct',
    },
    admin: {
      featured: r.admin?.featured ?? false,
      moderatedAt: r.admin?.moderatedAt || r.metadata?.approvedAt || null,
      notes: r.admin?.notes || '',
    },
  };
}

function buildHeaders(payloadForEtag: string) {
  const etag = crypto.createHash('md5').update(payloadForEtag).digest('hex');
  return {
    'Cache-Control': 'public, max-age=3600, s-maxage=7200',
    ETag: etag,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  } as Record<string, string>;
}

function createResponse(body: any, init: { status?: number; headers?: Record<string, string> } = {}) {
  const hasWebResponse = typeof (globalThis as any).Response !== 'undefined';
  if (hasWebResponse) {
    return new Response(JSON.stringify(body), init);
  }
  const hdrMap = new Map<string, string>();
  for (const [k, v] of Object.entries(init.headers || {})) hdrMap.set(k, v);
  return {
    status: init.status ?? 200,
    headers: { get: (name: string) => hdrMap.get(name) ?? null },
    json: async () => body,
  } as any;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value == null) return undefined;
  return value.toLowerCase() === 'true' ? true : value.toLowerCase() === 'false' ? false : undefined;
}

const ALLOWED_SORT_FIELDS = new Set(['approvedAt', 'rating', 'name', 'organization']);

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;

    // Parse query params
    const limitParam = Math.min(parseInt(params.get('limit') || '12', 10), MAX_LIMIT);
    const limit = isNaN(limitParam) || limitParam <= 0 ? 12 : limitParam;

    const offsetParam = parseInt(params.get('offset') || '0', 10);
    const offset = isNaN(offsetParam) || offsetParam < 0 ? 0 : offsetParam;

    const sortBy = (params.get('sortBy') || 'approvedAt').trim();
    const sortOrder = (params.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

    if (!ALLOWED_SORT_FIELDS.has(sortBy)) {
      return createResponse({
          success: false,
          error: 'INVALID_SORT_FIELD',
          message: `Invalid sort field: ${sortBy}`,
        }, { status: 400 });
    }

    const featuredOnly = parseBoolean(params.get('featured'));
    const minRating = params.get('minRating') ? parseInt(params.get('minRating')!, 10) : undefined;
    const relationship = params.get('relationship') || undefined;
    const search = params.get('search') || undefined;

    // Load approved reviews directory
    let fileNames: string[] = [];
    try {
      await fs.access(APPROVED_DIR);
      const entries = await fs.readdir(APPROVED_DIR);
      fileNames = entries.filter((f) => f.endsWith('.json') && f !== 'index.json' && !f.startsWith('.'));
    } catch {
      // Directory not found or inaccessible -> return empty result
      const emptyPayload = {
        reviews: [],
        featured: [],
        pagination: {
          total: 0,
          limit,
          offset,
          hasMore: false,
          totalPages: 0,
          currentPage: 1,
        },
        filters: { sortBy, sortOrder, featured: featuredOnly, minRating, relationship, search },
      };
      return createResponse({ success: true, data: emptyPayload }, { status: 200, headers: buildHeaders(JSON.stringify(emptyPayload)) });
    }

    // Read and parse files
    const reviews: ReviewFile[] = [];
    for (const file of fileNames) {
      try {
        const content = await fs.readFile(path.join(APPROVED_DIR, file), 'utf-8');
        const json = JSON.parse(content) as ReviewFile | { featuredIds?: string[] };
        if (!json) continue;
        // Skip index files that list IDs only
        if ('featuredIds' in json) {
          // we'll handle featured aggregation separately
          continue;
        }
        if ((json as any).status && (json as any).status !== 'approved') continue;
        reviews.push(json as ReviewFile);
      } catch (e) {
        // skip malformed file
      }
    }

    // Filtering
    let filtered = reviews.slice();

    if (typeof featuredOnly === 'boolean') {
      filtered = filtered.filter((r) => (r.admin?.featured ?? false) === featuredOnly);
    }

    if (typeof minRating === 'number' && !isNaN(minRating)) {
      filtered = filtered.filter((r) => (r.content?.rating ?? 0) >= minRating);
    }

    if (relationship) {
      filtered = filtered.filter((r) => (r.reviewer?.relationship || '').toLowerCase() === relationship.toLowerCase());
    }

    if (search && search.trim().length > 0) {
      const term = search.toLowerCase();
      filtered = filtered.filter((r) => {
        const testimonial = r.content?.testimonial?.toLowerCase() || '';
        const name = r.reviewer?.name?.toLowerCase() || '';
        const org = r.reviewer?.organization?.toLowerCase() || '';
        return testimonial.includes(term) || name.includes(term) || org.includes(term);
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let av: any = 0;
      let bv: any = 0;
      switch (sortBy) {
        case 'approvedAt':
          av = new Date(a.metadata?.approvedAt || 0).getTime();
          bv = new Date(b.metadata?.approvedAt || 0).getTime();
          break;
        case 'rating':
          av = a.content?.rating ?? 0;
          bv = b.content?.rating ?? 0;
          break;
        case 'name':
          av = (a.reviewer?.name || '').toLowerCase();
          bv = (b.reviewer?.name || '').toLowerCase();
          break;
        case 'organization':
          av = (a.reviewer?.organization || '').toLowerCase();
          bv = (b.reviewer?.organization || '').toLowerCase();
          break;
        default:
          av = new Date(a.metadata?.approvedAt || 0).getTime();
          bv = new Date(b.metadata?.approvedAt || 0).getTime();
      }
      if (sortOrder === 'asc') {
        return av > bv ? 1 : av < bv ? -1 : 0;
      }
      return av < bv ? 1 : av > bv ? -1 : 0;
    });

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    const sanitizedReviews = paginated.map(sanitizeReview);
    const featuredList = reviews.filter((r) => r.admin?.featured).map(sanitizeReview);

    const payload = {
      reviews: sanitizedReviews,
      featured: featuredList,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
        totalPages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit) + 1,
      },
      filters: { sortBy, sortOrder, featured: featuredOnly, minRating, relationship, search },
    };

    return createResponse({ success: true, data: payload }, { status: 200, headers: buildHeaders(JSON.stringify(payload)) });
  } catch (error) {
    console.error('Error in /api/reviews/display:', error);
    return createResponse({ success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch reviews' }, { status: 500 });
  }
}

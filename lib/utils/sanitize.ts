/**
 * Input Sanitization Utilities
 * 
 * Security utilities for sanitizing user input and preventing XSS attacks
 */

// Note: Using simple sanitization without DOMPurify for now
// In production, consider adding isomorphic-dompurify for more robust sanitization

/**
 * Sanitization Configuration
 */
const SANITIZE_CONFIG = {
  // Allowed HTML tags for rich text (very restrictive for reviews)
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
  
  // Allowed attributes (minimal for security)
  ALLOWED_ATTR: [],
  
  // Remove all scripts and dangerous elements
  FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
  
  // Remove all event handlers
  FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus']
};

/**
 * Sanitize HTML content
 * 
 * @param input - Raw HTML string
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Simple HTML sanitization - remove script tags and dangerous attributes
  let sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
  
  return sanitized;
}

/**
 * Sanitize plain text (remove all HTML)
 * 
 * @param input - Raw text string
 * @returns Plain text string
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove all HTML tags
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitize email address
 * 
 * @param email - Raw email string
 * @returns Sanitized email string
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  // Convert to lowercase and trim
  const cleaned = email.toLowerCase().trim();
  
  // Remove HTML tags and keep only valid email characters
  return cleaned.replace(/<[^>]*>/g, '').replace(/[^\w@.-]/g, '');
}

/**
 * Sanitize URL
 * 
 * @param url - Raw URL string
 * @returns Sanitized URL string or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  try {
    // Remove HTML and trim
    const cleaned = url.trim().replace(/<[^>]*>/g, '');
    
    // Validate URL format
    const urlObj = new URL(cleaned);
    
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    
    return urlObj.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize name (person/organization names)
 * 
 * @param name - Raw name string
 * @returns Sanitized name string
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  // Remove HTML and trim
  const cleaned = name.trim().replace(/<[^>]*>/g, '');
  
  // Allow only letters, spaces, hyphens, apostrophes, and periods
  return cleaned.replace(/[^a-zA-Z\s\-'\.]/g, '').trim();
}

/**
 * Sanitize testimonial content
 * 
 * @param content - Raw testimonial string
 * @returns Sanitized testimonial with basic formatting preserved
 */
export function sanitizeTestimonial(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }
  
  // Allow basic formatting but remove dangerous content
  let sanitized = content.trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
  
  // Convert line breaks to <br> tags for display
  return sanitized.replace(/\n/g, '<br>');
}

/**
 * Remove potentially dangerous patterns
 * 
 * @param input - Raw input string
 * @returns Cleaned string
 */
export function removeDangerousPatterns(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  let cleaned = input;
  
  // Remove common XSS patterns
  const dangerousPatterns = [
    /javascript:/gi,
    /vbscript:/gi,
    /data:/gi,
    /on\w+\s*=/gi,
    /<script/gi,
    /<\/script>/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<form/gi,
    /<input/gi
  ];
  
  dangerousPatterns.forEach(pattern => {
    cleaned = cleaned.replace(pattern, '');
  });
  
  return cleaned;
}

/**
 * Validate and sanitize file names
 * 
 * @param filename - Raw filename string
 * @returns Safe filename string
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  
  // Remove path traversal attempts and dangerous characters
  return filename
    .replace(/[\/\\:*?"<>|]/g, '')
    .replace(/\.\./g, '')
    .replace(/^\./, '')
    .trim()
    .substring(0, 255); // Limit length
}

/**
 * Sanitize JSON data recursively
 * 
 * @param data - Raw data object
 * @returns Sanitized data object
 */
export function sanitizeJsonData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'string') {
    return sanitizeText(data);
  }
  
  if (typeof data === 'number' || typeof data === 'boolean') {
    return data;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJsonData(item));
  }
  
  if (typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeText(key);
      sanitized[sanitizedKey] = sanitizeJsonData(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Content Security Policy helpers
 */
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

/**
 * Security headers for API responses
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  ...CSP_HEADERS
};

/**
 * Sanitization middleware for API routes
 */
export function sanitizeRequestBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  return sanitizeJsonData(body);
}

/**
 * Rate limiting helpers
 */
export function getClientIdentifier(request: Request): string {
  // Get IP address from various headers (for different hosting environments)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // Sanitize IP address
  return sanitizeText(ip);
}

/**
 * Honeypot validation
 */
export function validateHoneypot(honeypotValue: string | undefined): boolean {
  // Honeypot field should be empty (filled by bots)
  return !honeypotValue || honeypotValue.trim() === '';
}

/**
 * Timestamp validation (prevent replay attacks)
 */
export function validateTimestamp(
  timestamp: number | undefined,
  maxAgeMs: number = 5 * 60 * 1000 // 5 minutes
): boolean {
  if (!timestamp) return false;
  
  const now = Date.now();
  const age = now - timestamp;
  
  // Check if timestamp is within acceptable range
  return age >= 0 && age <= maxAgeMs;
}
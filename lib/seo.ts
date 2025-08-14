// SEO optimization utilities for Phase 3

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterSite?: string;
  twitterCreator?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface StructuredData {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

// Generate structured data for different content types
export const generateStructuredData = {
  // Person/Author structured data
  person: (data: {
    name: string;
    jobTitle: string;
    url: string;
    image?: string;
    email?: string;
    sameAs?: string[];
  }): StructuredData => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.name,
    jobTitle: data.jobTitle,
    url: data.url,
    image: data.image,
    email: data.email,
    sameAs: data.sameAs || [],
  }),

  // Article structured data
  article: (data: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
    wordCount?: number;
    keywords?: string[];
  }): StructuredData => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.headline,
    description: data.description,
    author: {
      "@type": "Person",
      name: data.author,
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    image: data.image,
    url: data.url,
    wordCount: data.wordCount,
    keywords: data.keywords?.join(", "),
  }),

  // Blog structured data
  blog: (data: {
    name: string;
    description: string;
    url: string;
    author: string;
    posts: Array<{
      title: string;
      url: string;
      datePublished: string;
      description: string;
    }>;
  }): StructuredData => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: data.name,
    description: data.description,
    url: data.url,
    author: {
      "@type": "Person",
      name: data.author,
    },
    blogPost: data.posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: post.url,
      datePublished: post.datePublished,
      description: post.description,
      author: {
        "@type": "Person",
        name: data.author,
      },
    })),
  }),

  // Portfolio/Creative Work structured data
  portfolio: (data: {
    name: string;
    description: string;
    url: string;
    author: string;
    projects: Array<{
      name: string;
      description: string;
      url?: string;
      image?: string;
      dateCreated: string;
      technologies: string[];
    }>;
  }): StructuredData => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: data.name,
    description: data.description,
    url: data.url,
    author: {
      "@type": "Person",
      name: data.author,
    },
    hasPart: data.projects.map((project) => ({
      "@type": "SoftwareApplication",
      name: project.name,
      description: project.description,
      url: project.url,
      image: project.image,
      dateCreated: project.dateCreated,
      applicationCategory: "WebApplication",
      programmingLanguage: project.technologies,
    })),
  }),

  // Organization structured data
  organization: (data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    email?: string;
    telephone?: string;
    address?: {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
    sameAs?: string[];
  }): StructuredData => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    email: data.email,
    telephone: data.telephone,
    address: data.address
      ? {
          "@type": "PostalAddress",
          ...data.address,
        }
      : undefined,
    sameAs: data.sameAs || [],
  }),

  // Website structured data
  website: (data: {
    name: string;
    url: string;
    description: string;
    author: string;
    potentialAction?: {
      target: string;
      queryInput: string;
    };
  }): StructuredData => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: data.name,
    url: data.url,
    description: data.description,
    author: {
      "@type": "Person",
      name: data.author,
    },
    potentialAction: data.potentialAction
      ? {
          "@type": "SearchAction",
          target: data.potentialAction.target,
          "query-input": data.potentialAction.queryInput,
        }
      : undefined,
  }),
};

// Generate sitemap data
export const generateSitemap = (
  pages: Array<{
    url: string;
    lastModified?: string;
    changeFrequency?:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    priority?: number;
  }>,
) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified}</lastmod>` : ""}
    ${page.changeFrequency ? `<changefreq>${page.changeFrequency}</changefreq>` : ""}
    ${page.priority ? `<priority>${page.priority}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return sitemap;
};

// Generate robots.txt
export const generateRobotsTxt = (config: {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
  sitemap?: string;
  crawlDelay?: number;
}) => {
  const {
    userAgent = "*",
    allow = [],
    disallow = [],
    sitemap,
    crawlDelay,
  } = config;

  let robotsTxt = `User-agent: ${userAgent}\n`;

  allow.forEach((path) => {
    robotsTxt += `Allow: ${path}\n`;
  });

  disallow.forEach((path) => {
    robotsTxt += `Disallow: ${path}\n`;
  });

  if (crawlDelay) {
    robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
  }

  if (sitemap) {
    robotsTxt += `\nSitemap: ${sitemap}\n`;
  }

  return robotsTxt;
};

// SEO analysis utilities
export const analyzeSEO = (content: {
  title: string;
  description: string;
  content: string;
  headings: string[];
  images: Array<{ src: string; alt: string }>;
  links: Array<{ href: string; text: string }>;
}) => {
  const analysis = {
    title: {
      length: content.title.length,
      optimal: content.title.length >= 30 && content.title.length <= 60,
      issues: [] as string[],
    },
    description: {
      length: content.description.length,
      optimal:
        content.description.length >= 120 && content.description.length <= 160,
      issues: [] as string[],
    },
    headings: {
      h1Count: content.headings.filter((h) => h.startsWith("h1")).length,
      structure: analyzeHeadingStructure(content.headings),
      issues: [] as string[],
    },
    images: {
      total: content.images.length,
      withoutAlt: content.images.filter((img) => !img.alt).length,
      issues: [] as string[],
    },
    content: {
      wordCount: content.content.split(/\s+/).length,
      readabilityScore: calculateReadabilityScore(content.content),
      issues: [] as string[],
    },
    links: {
      internal: content.links.filter((link) => !link.href.startsWith("http"))
        .length,
      external: content.links.filter((link) => link.href.startsWith("http"))
        .length,
      issues: [] as string[],
    },
    score: 0,
  };

  // Title analysis
  if (analysis.title.length < 30) {
    analysis.title.issues.push(
      "Title is too short (recommended: 30-60 characters)",
    );
  }
  if (analysis.title.length > 60) {
    analysis.title.issues.push(
      "Title is too long (recommended: 30-60 characters)",
    );
  }

  // Description analysis
  if (analysis.description.length < 120) {
    analysis.description.issues.push(
      "Description is too short (recommended: 120-160 characters)",
    );
  }
  if (analysis.description.length > 160) {
    analysis.description.issues.push(
      "Description is too long (recommended: 120-160 characters)",
    );
  }

  // Heading analysis
  if (analysis.headings.h1Count === 0) {
    analysis.headings.issues.push("No H1 heading found");
  }
  if (analysis.headings.h1Count > 1) {
    analysis.headings.issues.push(
      "Multiple H1 headings found (should be only one)",
    );
  }

  // Image analysis
  if (analysis.images.withoutAlt > 0) {
    analysis.images.issues.push(
      `${analysis.images.withoutAlt} images missing alt text`,
    );
  }

  // Content analysis
  if (analysis.content.wordCount < 300) {
    analysis.content.issues.push(
      "Content is too short (recommended: 300+ words)",
    );
  }

  // Calculate overall score
  let score = 100;
  const totalIssues = [
    ...analysis.title.issues,
    ...analysis.description.issues,
    ...analysis.headings.issues,
    ...analysis.images.issues,
    ...analysis.content.issues,
    ...analysis.links.issues,
  ].length;

  score = Math.max(0, score - totalIssues * 10);
  analysis.score = score;

  return analysis;
};

// Helper function to analyze heading structure
const analyzeHeadingStructure = (headings: string[]) => {
  const structure = headings
    .map((heading) => {
      const match = heading.match(/^h([1-6])/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter((level) => level > 0);

  const issues = [];

  for (let i = 1; i < structure.length; i++) {
    const current = structure[i];
    const previous = structure[i - 1];

    if (current > previous + 1) {
      issues.push(`Heading level skipped: h${previous} to h${current}`);
    }
  }

  return {
    levels: structure,
    issues,
  };
};

// Simple readability score calculation (Flesch Reading Ease approximation)
const calculateReadabilityScore = (text: string): number => {
  const sentences = text.split(/[.!?]+/).length - 1;
  const words = text.split(/\s+/).length;
  const syllables = text.split(/[aeiouAEIOU]/).length - 1;

  if (sentences === 0 || words === 0) return 0;

  const avgSentenceLength = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  // Simplified Flesch Reading Ease formula
  const score =
    206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

  return Math.max(0, Math.min(100, score));
};

// Generate meta tags for a page
export const generateMetaTags = (metadata: SEOMetadata) => {
  const tags = [
    { name: "description", content: metadata.description },
    { name: "author", content: metadata.author || "Mikhail Ajaj" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },

    // Open Graph tags
    { property: "og:title", content: metadata.ogTitle || metadata.title },
    {
      property: "og:description",
      content: metadata.ogDescription || metadata.description,
    },
    { property: "og:type", content: metadata.ogType || "website" },
    { property: "og:url", content: metadata.canonical },
    { property: "og:image", content: metadata.ogImage },

    // Twitter Card tags
    {
      name: "twitter:card",
      content: metadata.twitterCard || "summary_large_image",
    },
    { name: "twitter:site", content: metadata.twitterSite },
    { name: "twitter:creator", content: metadata.twitterCreator },
    { name: "twitter:title", content: metadata.ogTitle || metadata.title },
    {
      name: "twitter:description",
      content: metadata.ogDescription || metadata.description,
    },
    { name: "twitter:image", content: metadata.ogImage },

    // Article specific tags
    { property: "article:published_time", content: metadata.publishedTime },
    { property: "article:modified_time", content: metadata.modifiedTime },
    { property: "article:section", content: metadata.section },
  ];

  // Add keywords
  if (metadata.keywords && metadata.keywords.length > 0) {
    tags.push({ name: "keywords", content: metadata.keywords.join(", ") });
  }

  // Add article tags
  if (metadata.tags && metadata.tags.length > 0) {
    metadata.tags.forEach((tag) => {
      tags.push({ property: "article:tag", content: tag });
    });
  }

  // Filter out undefined values
  return tags.filter((tag) => tag.content);
};

const seoUtils = {
  generateStructuredData,
  generateSitemap,
  generateRobotsTxt,
  analyzeSEO,
  generateMetaTags,
};

export default seoUtils;

import { Domain } from "./project";

export type BlogCategory =
  | "technical"
  | "insights"
  | "tutorials"
  | "case-studies";

export interface BlogAuthor {
  name: string;
  bio: string;
  avatar: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  domains: Domain[];
  tags: string[];
  author: BlogAuthor;
  publishedAt: Date;
  updatedAt?: Date;
  readingTime: number;
  featured: boolean;
  draft: boolean;
  seo: BlogSEO;
  coverImage?: {
    src: string;
    alt: string;
    caption?: string;
  };
  tableOfContents?: {
    id: string;
    title: string;
    level: number;
  }[];
}

export interface BlogFilter {
  category?: BlogCategory;
  domain?: Domain;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
}

export interface BlogSortOptions {
  field: "publishedAt" | "updatedAt" | "title" | "readingTime";
  direction: "asc" | "desc";
}

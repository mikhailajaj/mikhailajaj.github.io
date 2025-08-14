import React from "react";
import { notFound } from "next/navigation";
// Temporary mock data for blog posts
const mockBlogPosts = [
  {
    slug: "building-scalable-nextjs-applications",
    title: "Building Scalable Next.js Applications",
    description:
      "Learn how to build scalable Next.js applications with proper architecture.",
    content:
      "This is a sample blog post about building scalable Next.js applications...",
    date: "2024-01-15",
    author: "Mikhail Ajaj",
    tags: ["Next.js", "React", "Performance"],
    category: "Development",
    featured: true,
    readingTime: "8 min read",
    image: "/blog/nextjs-scalability.svg",
    excerpt:
      "Learn how to build scalable Next.js applications with proper architecture and best practices.",
  },
  {
    slug: "advanced-react-patterns",
    title: "Advanced React Patterns",
    description:
      "Explore advanced React patterns for building maintainable applications.",
    content: "This is a sample blog post about advanced React patterns...",
    date: "2024-01-10",
    author: "Mikhail Ajaj",
    tags: ["React", "Patterns", "JavaScript"],
    category: "Development",
    featured: false,
    readingTime: "12 min read",
    image: "/blog/react-patterns.svg",
    excerpt:
      "Explore advanced React patterns for building maintainable applications.",
  },
  {
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices",
    description: "Best practices for writing maintainable TypeScript code.",
    content: "This is a sample blog post about TypeScript best practices...",
    date: "2024-01-05",
    author: "Mikhail Ajaj",
    tags: ["TypeScript", "Best Practices", "Development"],
    category: "Development",
    featured: false,
    readingTime: "10 min read",
    image: "/blog/typescript.svg",
    excerpt: "Best practices for writing maintainable TypeScript code.",
  },
  {
    slug: "cloud-architecture-aws-best-practices",
    title: "Cloud Architecture AWS Best Practices",
    description:
      "Best practices for designing scalable cloud architecture on AWS.",
    content: "This is a sample blog post about AWS cloud architecture...",
    date: "2024-01-01",
    author: "Mikhail Ajaj",
    tags: ["AWS", "Cloud", "Architecture"],
    category: "Cloud",
    featured: true,
    readingTime: "15 min read",
    image: "/blog/aws-architecture.svg",
    excerpt: "Best practices for designing scalable cloud architecture on AWS.",
  },
  {
    slug: "modern-data-engineering-pipelines",
    title: "Modern Data Engineering Pipelines",
    description:
      "Building modern data engineering pipelines for scalable analytics.",
    content: "This is a sample blog post about data engineering pipelines...",
    date: "2023-12-28",
    author: "Mikhail Ajaj",
    tags: ["Data Engineering", "Analytics", "Pipelines"],
    category: "Data",
    featured: false,
    readingTime: "14 min read",
    image: "/blog/data-pipeline.svg",
    excerpt:
      "Building modern data engineering pipelines for scalable analytics.",
  },
  {
    slug: "ux-design-principles-for-developers",
    title: "UX Design Principles for Developers",
    description: "Essential UX design principles every developer should know.",
    content: "This is a sample blog post about UX design principles...",
    date: "2023-12-25",
    author: "Mikhail Ajaj",
    tags: ["UX Design", "Development", "User Experience"],
    category: "Design",
    featured: false,
    readingTime: "9 min read",
    image: "/blog/ux-principles.svg",
    excerpt: "Essential UX design principles every developer should know.",
  },
];

const getAllBlogPosts = async () => mockBlogPosts;
const getBlogPostBySlug = async (slug: string) =>
  mockBlogPosts.find((post) => post.slug === slug);
import BlogPost from "@/components/blog/BlogPost";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get all posts for related posts functionality
  const allPosts = await getAllBlogPosts();

  return (
    <ErrorBoundary>
      <BlogPost post={post} allPosts={allPosts} />
    </ErrorBoundary>
  );
}

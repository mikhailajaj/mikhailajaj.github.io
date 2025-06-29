import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/blog';
import BlogPost from '@/components/blog/BlogPost';
import EnhancedLayout from '@/components/layouts/EnhancedLayout';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Mikhail Ajaj',
    };
  }

  return {
    title: `${post.title} | Mikhail Ajaj Blog`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // For now, disable MDX rendering to fix build issues
  // TODO: Fix MDX rendering for production
  const mdxSource = null;

  return (
    <EnhancedLayout>
      <ErrorBoundary>
        <BlogPost post={post} mdxSource={mdxSource} />
      </ErrorBoundary>
    </EnhancedLayout>
  );
}
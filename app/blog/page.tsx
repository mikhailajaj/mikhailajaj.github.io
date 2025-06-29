import React from 'react';
import { Metadata } from 'next';
import { getAllBlogPosts, getAllCategories, getAllTags } from '@/lib/blog';
import BlogGrid from '@/components/blog/BlogGrid';
import EnhancedLayout from '@/components/layouts/EnhancedLayout';
import PageHeader from '@/components/navigation/PageHeader';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Technical Blog | Mikhail Ajaj - Full-Stack Development Insights',
  description: 'Technical articles, tutorials, and insights on full-stack development, cloud architecture, data engineering, and modern web technologies.',
  keywords: ['Technical Blog', 'Full-Stack Development', 'Cloud Architecture', 'React', 'Next.js', 'TypeScript', 'AWS', 'Data Engineering'],
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <EnhancedLayout>
      <PageHeader
        title="Technical Blog"
        subtitle="Latest Insights"
        description="Insights, tutorials, and deep dives into full-stack development, cloud architecture, and modern web technologies. Learn from real-world projects and industry best practices."
        stats={[
          { label: "Articles", value: posts.length },
          { label: "Categories", value: categories.length },
          { label: "Topics", value: tags.length }
        ]}
        actions={[
          {
            label: "Subscribe to Updates",
            href: "/contact",
            variant: "primary"
          },
          {
            label: "View All Categories",
            href: "#categories",
            variant: "secondary"
          }
        ]}
      />

      {/* Blog Grid */}
      <ErrorBoundary>
        <BlogGrid posts={posts} categories={categories} tags={tags} />
      </ErrorBoundary>
    </EnhancedLayout>
  );
}
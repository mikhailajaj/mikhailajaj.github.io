/**
 * Blog Layout Component
 * 
 * Provides blog-specific layout with breadcrumb navigation, SEO enhancements,
 * and integration with existing domain theming and accessibility systems.
 */

import React from "react";
import { Metadata } from "next";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import { ErrorBoundary } from "@/lib/error/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    template: "%s | Technical Blog - Mikhail Ajaj",
    default: "Technical Blog | Mikhail Ajaj - Full-Stack Development Insights",
  },
  description:
    "Technical articles, tutorials, and insights on full-stack development, cloud architecture, data engineering, and modern web technologies.",
  keywords: [
    "Technical Blog",
    "Full-Stack Development",
    "Cloud Architecture",
    "React",
    "Next.js",
    "TypeScript",
    "AWS",
    "Data Engineering",
    "Web Development",
    "Software Engineering",
    "Programming Tutorials",
  ],
  openGraph: {
    type: "website",
    siteName: "Mikhail Ajaj Technical Blog",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourtwitterhandle", // Replace with actual Twitter handle
  },
  alternates: {
    types: {
      "application/rss+xml": [
        {
          url: "/blog/rss.xml",
          title: "Mikhail Ajaj Technical Blog RSS Feed",
        },
      ],
    },
  },
};

interface BlogLayoutProps {
  children: React.ReactNode;
}

/**
 * BlogLayout Component
 * 
 * Provides consistent layout structure for all blog pages including:
 * - Breadcrumb navigation for better UX
 * - Blog-specific SEO optimizations
 * - Error boundary for graceful error handling
 * - Integration with existing accessibility and theming systems
 * 
 * @param children - The page content to render within the layout
 */
export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs className="sticky top-16 z-30" />
        
        {/* Blog Content Container */}
        <div className="relative">
          {/* Blog-specific background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-100/30 dark:from-gray-900/30 dark:to-gray-800/30 pointer-events-none" />
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
        
        {/* Blog-specific structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Mikhail Ajaj Technical Blog",
              "description": "Technical articles, tutorials, and insights on full-stack development, cloud architecture, data engineering, and modern web technologies.",
              "url": "https://mikhailajaj.github.io/blog",
              "author": {
                "@type": "Person",
                "name": "Mikhail Ajaj",
                "url": "https://mikhailajaj.github.io",
              },
              "publisher": {
                "@type": "Person",
                "name": "Mikhail Ajaj",
                "url": "https://mikhailajaj.github.io",
              },
            }),
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import {
  FaArrowLeft,
  FaCalendar,
  FaClock,
  FaUser,
  FaTag,
  FaShare,
} from "react-icons/fa";
import { BlogPost as BlogPostType, getAllBlogPosts } from "@/lib/blog";
import { UniversalButton } from "@/components/ui/UniversalButton";
import BlogTableOfContents from "./BlogTableOfContents";
import BlogSocialShare from "./BlogSocialShare";
import BlogRelatedPosts from "./BlogRelatedPosts";

interface BlogPostProps {
  post: BlogPostType;
  mdxSource?: any;
  allPosts?: BlogPostType[];
}

const BlogHeader: React.FC<{ post: BlogPostType }> = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    style={{}}
  >
    <header className="mb-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        Back to Blog
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <FaCalendar className="mr-2" />
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2" />
            {post.readingTime}
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2" />
            {post.author}
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            >
              <FaTag className="mr-1 text-xs" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {post.image && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
    </header>
  </motion.div>
);

const BlogContent: React.FC<{ content: string; mdxSource?: any }> = ({
  content,
  mdxSource,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    style={{}}
  >
    <div className="prose prose-lg dark:prose-invert max-w-none mb-12 whitespace-pre-wrap">
      {content}
    </div>
  </motion.div>
);

const BlogFooter: React.FC<{ post: BlogPostType }> = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    style={{}}
  >
    <footer className="border-t border-gray-200 dark:border-gray-700 pt-8 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
            MA
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.author}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Full-Stack Developer & Cloud Architect
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Share this post:
          </span>
          <UniversalButton
            variant="outline"
            size="sm"
            leftIcon={<FaShare />}
            ariaLabel="Share this post"
            onClick={async () => {
              const url = typeof window !== "undefined" ? window.location.href : "";
              if (navigator.share) {
                try {
                  await navigator.share({ title: post.title, text: post.description, url });
                } catch {}
              } else {
                try {
                  await navigator.clipboard.writeText(url);
                } catch {}
              }
            }}
          >
            Share
          </UniversalButton>
        </div>
      </div>
    </footer>
  </motion.div>
);

const BlogNavigation: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
    style={{}}
  >
    <nav className="flex justify-between items-center py-8 border-t border-gray-200 dark:border-gray-700">
      <Link
        href="/blog"
        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        <FaArrowLeft className="mr-2" />
        All Posts
      </Link>

      <Link
        href="/contact"
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
      >
        Get In Touch
      </Link>
    </nav>
  </motion.div>
);

const BlogPost: React.FC<BlogPostProps> = ({
  post,
  mdxSource,
  allPosts = [],
}) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3">
          <BlogHeader post={post} />
          <BlogContent content={post.content} mdxSource={mdxSource} />
          <BlogFooter post={post} />

          {/* Social Share */}
          <div className="mb-8">
            <BlogSocialShare
              title={post.title}
              url={currentUrl}
              description={post.description}
            />
          </div>

          <BlogNavigation />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          {/* Table of Contents */}
          <BlogTableOfContents content={post.content} />

          {/* Related Posts */}
          {allPosts.length > 0 && (
            <BlogRelatedPosts currentPost={post} allPosts={allPosts} />
          )}
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;

"use client";
import React from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import { MotionDiv } from "@/lib/motion-utils";

interface BlogRelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

const BlogRelatedPosts: React.FC<BlogRelatedPostsProps> = ({
  currentPost,
  allPosts,
}) => {
  // Find related posts based on tags and category
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      let score = 0;

      // Same category gets higher score
      if (post.category === currentPost.category) {
        score += 3;
      }

      // Shared tags get points
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag),
      );
      score += sharedTags.length * 2;

      return { post, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post);

  if (relatedPosts.length === 0) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Related Articles
      </h3>

      <div className="space-y-4">
        {relatedPosts.map((post, index) => (
          <MotionDiv
            key={post.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200">
                {post.image && (
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h4>

                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{post.readingTime}</span>
                    <span className="mx-2">•</span>
                    <span>{post.category}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </MotionDiv>
        ))}
      </div>
    </MotionDiv>
  );
};

export default BlogRelatedPosts;

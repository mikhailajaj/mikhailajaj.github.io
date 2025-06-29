"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaClock, FaArrowRight, FaTag } from 'react-icons/fa';
import { BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index = 0, featured = false }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1 
      }
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5 }}
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative">
          {post.image ? (
            <div className={`relative w-full ${featured ? 'h-64 md:h-80' : 'h-48'} overflow-hidden`}>
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className={`relative w-full ${featured ? 'h-64 md:h-80' : 'h-48'} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
              <div className="text-white text-center">
                <div className="text-4xl font-bold mb-2">
                  {post.title.charAt(0)}
                </div>
                <div className="text-sm opacity-80">
                  {post.category}
                </div>
              </div>
            </div>
          )}
          
          {post.featured && (
            <div className="absolute top-4 left-4">
              <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </span>
            </div>
          )}
          
          <div className="absolute top-4 right-4">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {post.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center">
              <FaCalendar className="mr-1" />
              {new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1" />
              {post.readingTime}
            </div>
          </div>
          
          <h3 className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>
          
          <p className={`text-gray-600 dark:text-gray-300 mb-4 ${
            featured ? 'text-base' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <FaTag className="mr-1 text-xs" />
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              By {post.author}
            </span>
            <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              <span className="text-sm font-medium mr-2">Read More</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
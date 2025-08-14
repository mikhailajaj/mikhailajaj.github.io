"use client";
import React from "react";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaLink,
  FaReddit,
} from "react-icons/fa";
import { MotionDiv } from "@/lib/motion-utils";

interface BlogSocialShareProps {
  title: string;
  url: string;
  description?: string;
}

const BlogSocialShare: React.FC<BlogSocialShareProps> = ({
  title,
  url,
  description,
}) => {
  const shareLinks = [
    {
      name: "Twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: "hover:text-blue-600",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "hover:text-blue-500",
    },
    {
      name: "Reddit",
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: "hover:text-orange-500",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
      console.log("URL copied to clipboard");
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Share this article
      </h3>

      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 transition-colors duration-200 ${link.color}`}
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}

        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          aria-label="Copy link"
        >
          <FaLink className="w-4 h-4" />
        </button>
      </div>
    </MotionDiv>
  );
};

export default BlogSocialShare;

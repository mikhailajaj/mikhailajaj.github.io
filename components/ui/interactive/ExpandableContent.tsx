"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ExpandableContentProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  variant?: "default" | "card" | "minimal";
  icon?: React.ReactNode;
  className?: string;
}

const variants = {
  default: {
    container:
      "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden",
    header: "bg-gray-50 dark:bg-gray-800",
    content: "bg-white dark:bg-gray-900",
  },
  card: {
    container:
      "bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden",
    header:
      "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800",
    content: "bg-white dark:bg-gray-800",
  },
  minimal: {
    container: "border-b border-gray-200 dark:border-gray-700",
    header: "bg-transparent",
    content: "bg-transparent",
  },
};

export function ExpandableContent({
  title,
  children,
  defaultExpanded = false,
  variant = "default",
  icon,
  className,
}: ExpandableContentProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const variantStyles = variants[variant];

  return (
    <div className={cn(variantStyles.container, className)}>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex justify-between items-center p-4 text-left transition-colors duration-200",
          "hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset",
          variantStyles.header,
        )}
        whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex-shrink-0 text-primary-600 dark:text-primary-400">
              {icon}
            </span>
          )}
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-gray-500 dark:text-gray-400"
        >
          <FaChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98],
            }}
            className={cn("overflow-hidden", variantStyles.content)}
          >
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="p-4 border-t border-gray-200 dark:border-gray-700"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Accordion wrapper for multiple expandable items
interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  children,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      setExpandedItems(newExpanded);
    } else {
      setExpandedItems(expandedItems.has(index) ? new Set() : new Set([index]));
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            defaultExpanded: expandedItems.has(index),
            onClick: () => handleToggle(index),
          });
        }
        return child;
      })}
    </div>
  );
}

/**
 * ProgressiveDisclosure Component
 * 
 * Mobile-optimized component for revealing complex information progressively
 * to prevent information overload on small screens.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaInfoCircle } from "react-icons/fa";
import { cn } from "@/lib/utils/cn";

interface ProgressiveDisclosureProps {
  title: string;
  preview?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  variant?: "card" | "inline" | "accordion";
  level?: "primary" | "secondary" | "tertiary";
  className?: string;
  onToggle?: (isExpanded: boolean) => void;
}

export function ProgressiveDisclosure({
  title,
  preview,
  children,
  defaultExpanded = false,
  variant = "card",
  level = "primary",
  className,
  onToggle,
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const baseClasses = cn(
    "w-full transition-all duration-200",
    variant === "card" && "bg-card rounded-lg border shadow-sm",
    variant === "inline" && "border-l-2 border-accent pl-4",
    variant === "accordion" && "border-b border-border",
    className
  );

  const headerClasses = cn(
    "flex items-center justify-between w-full text-left",
    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
    "transition-colors duration-200",
    // Enhanced touch targets for mobile
    "min-h-[44px] touch-manipulation",
    variant === "card" && "p-4 hover:bg-accent/5",
    variant === "inline" && "py-2 hover:bg-accent/5 rounded",
    variant === "accordion" && "py-3 hover:bg-accent/5",
    level === "primary" && "text-lg font-semibold",
    level === "secondary" && "text-base font-medium",
    level === "tertiary" && "text-sm font-medium"
  );

  return (
    <div className={baseClasses}>
      <button
        className={headerClasses}
        onClick={handleToggle}
        aria-expanded={isExpanded}
        aria-controls={`disclosure-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
        style={{
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-foreground">{title}</span>
            {level === "primary" && (
              <FaInfoCircle className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          {preview && !isExpanded && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {preview}
            </p>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2 flex-shrink-0"
        >
          <FaChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`disclosure-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            ref={contentRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={cn(
              "text-foreground",
              variant === "card" && "px-4 pb-4",
              variant === "inline" && "py-2",
              variant === "accordion" && "pb-3"
            )}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ProgressiveDisclosureGroup Component
 * 
 * Groups multiple progressive disclosure items with accordion-like behavior.
 */

interface ProgressiveDisclosureGroupProps {
  children: React.ReactElement<ProgressiveDisclosureProps>[];
  allowMultiple?: boolean;
  className?: string;
}

export function ProgressiveDisclosureGroup({
  children,
  allowMultiple = false,
  className,
}: ProgressiveDisclosureGroupProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const handleToggle = (index: number, isExpanded: boolean) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      
      if (isExpanded) {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      
      return newSet;
    });
  };

  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child, {
          defaultExpanded: expandedItems.has(index),
          onToggle: (isExpanded: boolean) => {
            handleToggle(index, isExpanded);
            child.props.onToggle?.(isExpanded);
          },
        });
      })}
    </div>
  );
}

/**
 * MobileContentSummary Component
 * 
 * Provides a condensed summary view for complex content on mobile devices.
 */

interface MobileContentSummaryProps {
  title: string;
  summary: string;
  keyPoints: string[];
  fullContent: React.ReactNode;
  className?: string;
}

export function MobileContentSummary({
  title,
  summary,
  keyPoints,
  fullContent,
  className,
}: MobileContentSummaryProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary Card */}
      <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{summary}</p>
        
        {/* Key Points */}
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-foreground uppercase tracking-wide">
            Key Points
          </h4>
          <ul className="space-y-1">
            {keyPoints.map((point, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Content */}
      <ProgressiveDisclosure
        title="View Full Details"
        preview="Tap to see complete information and additional details"
        variant="card"
      >
        {fullContent}
      </ProgressiveDisclosure>
    </div>
  );
}

export default ProgressiveDisclosure;
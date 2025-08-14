"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Skip Link Component
 * Provides keyboard users a way to skip to main content
 */
interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({
  href = "#main-content",
  children = "Skip to main content",
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
        "bg-blue-600 text-white px-4 py-2 rounded-lg z-50",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/50",
        "font-medium text-sm",
      )}
    >
      {children}
    </a>
  );
}
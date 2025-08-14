"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import type { AccessibleFieldProps } from "../types";

/**
 * Accessible Form Field Component
 * WCAG 2.1 AA compliant form field with proper labeling and error handling
 */
export function AccessibleField({
  label,
  children,
  error,
  hint,
  required,
  id,
}: AccessibleFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium",
          "text-gray-900 dark:text-gray-100",
          required && "after:content-['*'] after:text-red-500 after:ml-1",
        )}
      >
        {label}
      </label>

      {hint && (
        <p id={hintId} className="text-sm text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      )}

      <div>
        {React.cloneElement(children as React.ReactElement, {
          id,
          "aria-describedby": describedBy,
          "aria-invalid": error ? "true" : "false",
          "aria-required": required,
        })}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
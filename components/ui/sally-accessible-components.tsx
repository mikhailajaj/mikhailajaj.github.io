"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { SALLY_TIMING } from "@/components/ui/animation/SallyAnimationSystem";
import {
  SallyAccessibleButton,
  SallyAccessibleField,
  useSallyAccessibility,
} from "@/components/accessibility";

/**
 * Sally's Accessible UI Components
 * Phase 2: Enhanced components with full WCAG 2.1 AA compliance
 */

// Sally's Accessible Navigation
interface SallyAccessibleNavProps {
  items: Array<{
    href: string;
    label: string;
    current?: boolean;
    children?: Array<{ href: string; label: string }>;
  }>;
  ariaLabel?: string;
}

export function SallyAccessibleNav({
  items,
  ariaLabel = "Main navigation",
}: SallyAccessibleNavProps) {
  const { keyboardNavigation, announce } = useSallyAccessibility();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleSubmenuToggle = (index: number) => {
    const newActiveSubmenu = activeSubmenu === index ? null : index;
    setActiveSubmenu(newActiveSubmenu);

    const item = items[index];
    announce(
      newActiveSubmenu !== null
        ? `${item.label} submenu opened`
        : `${item.label} submenu closed`,
    );
  };

  return (
    <nav
      role="navigation"
      aria-label={ariaLabel}
      className={cn(
        "sally-accessible-nav",
        keyboardNavigation && "keyboard-navigation-active",
      )}
    >
      <ul className="flex space-x-1" role="menubar">
        {items.map((item, index) => (
          <li key={item.href} role="none">
            {item.children ? (
              // Dropdown menu item
              <div className="relative">
                <button
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={activeSubmenu === index}
                  aria-controls={`submenu-${index}`}
                  onClick={() => handleSubmenuToggle(index)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    item.current &&
                      "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "ml-1 transition-transform",
                      activeSubmenu === index && "rotate-180",
                    )}
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                </button>

                {/* Submenu */}
                {activeSubmenu === index && (
                  <motion.ul
                    id={`submenu-${index}`}
                    role="menu"
                    aria-labelledby={`menuitem-${index}`}
                    className={cn(
                      "absolute top-full left-0 mt-1 min-w-[200px]",
                      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                      "rounded-lg shadow-lg py-2 z-50",
                    )}
                    initial={
                      !prefersReducedMotion ? { opacity: 0, y: -10 } : {}
                    }
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: SALLY_TIMING.quick }}
                  >
                    {item.children.map((child) => (
                      <li key={child.href} role="none">
                        <a
                          href={child.href}
                          role="menuitem"
                          className={cn(
                            "block px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                            "hover:bg-gray-100 dark:hover:bg-gray-700",
                            "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700",
                          )}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            ) : (
              // Regular menu item
              <a
                href={item.href}
                role="menuitem"
                aria-current={item.current ? "page" : undefined}
                className={cn(
                  "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  item.current &&
                    "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100",
                )}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Sally's Accessible Card Component
interface SallyAccessibleCardProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  image?: {
    src: string;
    alt: string;
  };
  className?: string;
  priority?: "low" | "medium" | "high";
}

export function SallyAccessibleCard({
  title,
  description,
  action,
  image,
  className,
  priority = "medium",
}: SallyAccessibleCardProps) {
  const { announce } = useSallyAccessibility();
  const cardId = `card-${title.replace(/\s+/g, "-").toLowerCase()}`;
  const prefersReducedMotion = useReducedMotion();

  const handleActionClick = () => {
    if (action?.onClick) {
      action.onClick();
      announce(`${title} action activated`);
    }
  };

  return (
    <motion.article
      className={cn(
        "sally-accessible-card bg-white dark:bg-gray-800",
        "border border-gray-200 dark:border-gray-700 rounded-lg",
        "shadow-sm hover:shadow-md transition-shadow",
        "focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2",
        className,
      )}
      initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: SALLY_TIMING.standard,
        delay: priority === "high" ? 0 : priority === "medium" ? 0.1 : 0.2,
      }}
      role="article"
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-description`}
    >
      {image && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            loading={priority === "high" ? "eager" : "lazy"}
          />
        </div>
      )}

      <div className="p-6">
        <h3
          id={`${cardId}-title`}
          className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          {title}
        </h3>

        <p
          id={`${cardId}-description`}
          className="text-gray-600 dark:text-gray-400 mb-4"
        >
          {description}
        </p>

        {action && (
          <div className="mt-4">
            {action.href ? (
              <a
                href={action.href}
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-medium",
                  "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  "rounded-lg transition-colors",
                )}
                aria-describedby={`${cardId}-description`}
              >
                {action.label}
                <span className="ml-1" aria-hidden="true">
                  →
                </span>
              </a>
            ) : (
              <SallyAccessibleButton
                variant="outline"
                size="sm"
                onClick={handleActionClick}
                ariaDescribedBy={`${cardId}-description`}
              >
                {action.label}
              </SallyAccessibleButton>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

// Sally's Accessible Modal
interface SallyAccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function SallyAccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: SallyAccessibleModalProps) {
  const { announce } = useSallyAccessibility();
  const prefersReducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  useEffect(() => {
    if (isOpen) {
      announce(`${title} dialog opened`);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      announce(`${title} dialog closed`);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, title, announce]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50"
        initial={!prefersReducedMotion ? { opacity: 0 } : {}}
        animate={{ opacity: 1 }}
        transition={{ duration: SALLY_TIMING.quick }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          ref={modalRef}
          className={cn(
            "relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl",
            "focus:outline-none",
            sizeClasses[size],
          )}
          initial={
            !prefersReducedMotion ? { opacity: 0, scale: 0.95, y: 20 } : {}
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: SALLY_TIMING.standard }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {title}
            </h2>

            <SallyAccessibleButton
              variant="ghost"
              size="sm"
              onClick={onClose}
              ariaLabel={`Close ${title} dialog`}
              announceOnClick={`${title} dialog closed`}
            >
              ✕
            </SallyAccessibleButton>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

// Sally's Accessible Form
interface SallyAccessibleFormProps {
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function SallyAccessibleForm({
  onSubmit,
  children,
  title,
  description,
  submitLabel = "Submit",
  isSubmitting = false,
}: SallyAccessibleFormProps) {
  const { announce } = useSallyAccessibility();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      // Clear previous errors
      setErrors({});

      // Announce form submission
      announce("Form submitted. Processing...");

      await onSubmit(formData);

      // Success announcement
      announce("Form submitted successfully!");
    } catch (error) {
      // Error handling
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      announce(`Form submission failed: ${errorMessage}`);

      // Focus first error field if available
      const firstErrorField = formRef.current?.querySelector(
        '[aria-invalid="true"]',
      ) as HTMLElement;
      firstErrorField?.focus();
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="sally-accessible-form space-y-6"
    >
      {/* Form Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      {/* Error Summary */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
            Please correct the following errors:
          </h3>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">{children}</div>

      {/* Submit Button */}
      <div className="pt-4">
        <SallyAccessibleButton
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={isSubmitting}
          announceOnClick={
            isSubmitting ? "Submitting form..." : "Form submitted"
          }
          className="w-full"
        >
          {submitLabel}
        </SallyAccessibleButton>
      </div>

      {/* Form Status for Screen Readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {isSubmitting
          ? "Form is being submitted..."
          : "Form is ready for submission"}
      </div>
    </form>
  );
}

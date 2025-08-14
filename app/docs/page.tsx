"use client";

import React from "react";
import Link from "next/link";
import { DocumentationLayout } from "@/components/layouts/DocumentationLayout";
import {
  BookOpen,
  FileText,
  BarChart,
  Code,
  Layers,
  CheckCircle,
  Clock,
  FileSearch,
  Settings,
  Lightbulb,
} from "lucide-react";

export default function DocumentationIndexPage() {
  const docCategories = [
    {
      title: "Getting Started",
      description: "Introduction and quick start guides",
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      items: [
        {
          title: "Quick Start Implementation",
          href: "/docs/QUICK-START-IMPLEMENTATION",
        },
      ],
    },
    {
      title: "Project Status",
      description: "Current project status and reports",
      icon: <BarChart className="h-6 w-6 text-green-500" />,
      items: [
        { title: "Project Status Report", href: "/docs/PROJECT-STATUS-REPORT" },
        {
          title: "Business Impact Report",
          href: "/docs/BUSINESS-IMPACT-REPORT",
        },
        {
          title: "Phase 2 Complete Success",
          href: "/docs/PHASE-2-COMPLETE-SUCCESS",
        },
        {
          title: "Phase 3 Complete Success",
          href: "/docs/PHASE-3-COMPLETE-SUCCESS",
        },
        {
          title: "Phase 4 Progress Update",
          href: "/docs/PHASE-4-PROGRESS-UPDATE",
        },
      ],
    },
    {
      title: "Technical Documentation",
      description: "Technical details and architecture",
      icon: <Code className="h-6 w-6 text-purple-500" />,
      items: [
        {
          title: "Technical Documentation Report",
          href: "/docs/TECHNICAL-DOCUMENTATION-REPORT",
        },
        {
          title: "Portfolio Optimization Plan",
          href: "/docs/PORTFOLIO-OPTIMIZATION-PLAN",
        },
        {
          title: "Phase 4 Technical Architecture",
          href: "/docs/PHASE-4-TECHNICAL-ARCHITECTURE",
        },
      ],
    },
    {
      title: "Implementation Reports",
      description: "Phase implementation details",
      icon: <CheckCircle className="h-6 w-6 text-amber-500" />,
      items: [
        {
          title: "Phase 2 UX/UI Completion",
          href: "/docs/PHASE-2-UXUI-COMPLETION",
        },
        {
          title: "Phase 2 Data Analytics Completion",
          href: "/docs/PHASE-2-DATA-ANALYTICS-COMPLETION",
        },
        {
          title: "Phase 3 Implementation Report",
          href: "/docs/PHASE-3-IMPLEMENTATION-REPORT",
        },
        {
          title: "Phase 3 Content Strategy",
          href: "/docs/PHASE-3-CONTENT-STRATEGY",
        },
        {
          title: "Phase 3 Performance Report",
          href: "/docs/PHASE-3-PERFORMANCE-REPORT",
        },
      ],
    },
    {
      title: "Plans & Strategies",
      description: "Future plans and strategic direction",
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      items: [
        {
          title: "BMAD Portfolio Enhancement Plan",
          href: "/docs/BMAD-PORTFOLIO-ENHANCEMENT-PLAN",
        },
        {
          title: "Portfolio Research Analysis",
          href: "/docs/PORTFOLIO-RESEARCH-ANALYSIS",
        },
        {
          title: "Phase 4 Implementation Plan",
          href: "/docs/PHASE-4-IMPLEMENTATION-PLAN",
        },
        {
          title: "UI/UX Improvement Plan",
          href: "/docs/UI-UX-IMPROVEMENT-PLAN",
        },
      ],
    },
  ];

  return (
    <DocumentationLayout
      title="Documentation"
      description="Browse technical documentation, project reports, and implementation guides"
    >
      <div className="space-y-12">
        {/* Recently Updated */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recently Updated
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/docs/UI-UX-IMPROVEMENT-PLAN"
              className="block p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-blue-700 dark:text-blue-400">
                  UI/UX Improvement Plan
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Comprehensive plan for enhancing the documentation UI/UX
              </p>
            </Link>
            <Link
              href="/docs/PHASE-4-PROGRESS-UPDATE"
              className="block p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-green-500" />
                <h3 className="font-medium text-green-700 dark:text-green-400">
                  Phase 4 Progress Update
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Latest progress update on Phase 4 implementation
              </p>
            </Link>
          </div>
        </section>

        {/* Documentation Categories */}
        {docCategories.map((category) => (
          <section key={category.title}>
            <div className="flex items-center gap-2 mb-4">
              {category.icon}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {category.title}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {category.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </DocumentationLayout>
  );
}

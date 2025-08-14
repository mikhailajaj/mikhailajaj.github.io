"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { SiTailwindcss, SiNextdotjs } from "react-icons/si";
import { FaRobot } from "react-icons/fa";

export function SelfEducation() {
  return (
    <section
      id="self-education"
      aria-labelledby="self-education-heading"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <Card className="p-5 sm:p-8 bg-card/80 backdrop-blur-md border border-border">
          {/* Header */}
          <div className="text-center mx-auto max-w-3xl text-foreground">
            <h2
              id="self-education-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-2"
            >
              Self‑Education
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Focused learning tracks I actively maintain to stay current and deliver high‑impact results.
            </p>
          </div>

          {/* Tracks */}
          <div role="list" className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
            {/* Tailwind CSS */}
            <article
              role="listitem"
              className="rounded-lg border border-border bg-background/50 p-4 sm:p-5 hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary"
                >
                  <SiTailwindcss className="w-5 h-5" />
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Tailwind CSS</h3>
              </div>
              <ul className="mt-3 list-disc pl-5 text-xs sm:text-sm text-foreground/90 space-y-1">
                <li>Design tokens via CSS variables and domain theming</li>
                <li>Accessible components (WCAG 2.1 AA focus/contrast)</li>
                <li>Performance: class pruning, atomic utilities, tree‑shaking</li>
                <li>Integration with shadcn/ui and animation systems</li>
              </ul>
            </article>

            {/* Next.js */}
            <article
              role="listitem"
              className="rounded-lg border border-border bg-background/50 p-4 sm:p-5 hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary"
                >
                  <SiNextdotjs className="w-5 h-5" />
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Next.js</h3>
              </div>
              <ul className="mt-3 list-disc pl-5 text-xs sm:text-sm text-foreground/90 space-y-1">
                <li>App Router, RSC boundaries, and streaming UIs</li>
                <li>Route‑level caching, ISR, and edge/SSR trade‑offs</li>
                <li>Core Web Vitals optimization and bundle control</li>
                <li>PWA, error boundaries, and observability integration</li>
              </ul>
            </article>

            {/* AI Assistance Strategies (Context Engineering) */}
            <article
              role="listitem"
              className="rounded-lg border border-border bg-background/50 p-4 sm:p-5 hover:bg-background/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary"
                >
                  <FaRobot className="w-5 h-5" />
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-foreground">AI Assistance Strategies (Context Engineering)</h3>
              </div>
              <ul className="mt-3 list-disc pl-5 text-xs sm:text-sm text-foreground/90 space-y-1">
                <li>Structured prompts, role/task decomposition, and constraints</li>
                <li>Context packing: repos, specs, and tests for reproducible outputs</li>
                <li>Evaluation loops and guardrails for safe automation</li>
                <li>Docs‑driven workflows to capture decisions and diffs</li>
              </ul>
            </article>

            {/* Resources section */}
            <div className="md:col-span-3 mt-4 sm:mt-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-background/30 p-4">
                  <h4 className="font-semibold text-sm text-foreground">Tailwind CSS — Resources</h4>
                  <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                    <li><a className="text-primary hover:underline" href="https://tailwindcss.com/docs" target="_blank" rel="noreferrer">Official Docs</a></li>
                    <li><a className="text-primary hover:underline" href="https://ui.shadcn.com" target="_blank" rel="noreferrer">shadcn/ui</a></li>
                    <li><a className="text-primary hover:underline" href="https://github.com/dcastil/tailwind-merge" target="_blank" rel="noreferrer">tailwind-merge</a></li>
                    <li><a className="text-primary hover:underline" href="https://github.com/jamiebuilds/tailwindcss-animate" target="_blank" rel="noreferrer">tailwindcss-animate</a></li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-background/30 p-4">
                  <h4 className="font-semibold text-sm text-foreground">Next.js — Resources</h4>
                  <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                    <li><a className="text-primary hover:underline" href="https://nextjs.org/docs/app" target="_blank" rel="noreferrer">App Router Docs</a></li>
                    <li><a className="text-primary hover:underline" href="https://nextjs.org/docs/app/building-your-application/caching" target="_blank" rel="noreferrer">Caching & ISR</a></li>
                    <li><a className="text-primary hover:underline" href="https://nextjs.org/docs/app/building-your-application/optimizing" target="_blank" rel="noreferrer">Optimizing</a></li>
                    <li><a className="text-primary hover:underline" href="https://vercel.com/docs/observability/quickstart" target="_blank" rel="noreferrer">Observability</a></li>
                  </ul>
                </div>
                <div className="rounded-lg border border-border bg-background/30 p-4">
                  <h4 className="font-semibold text-sm text-foreground">AI Assistance — Resources</h4>
                  <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                    <li><a className="text-primary hover:underline" href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noreferrer">Prompt Engineering</a></li>
                    <li><a className="text-primary hover:underline" href="https://www.promptingguide.ai/" target="_blank" rel="noreferrer">Prompting Guide</a></li>
                    <li><a className="text-primary hover:underline" href="https://martinfowler.com/articles/2024-genai-patterns.html" target="_blank" rel="noreferrer">GenAI Patterns</a></li>
                    <li><a className="text-primary hover:underline" href="https://github.com/openai/openai-cookbook" target="_blank" rel="noreferrer">OpenAI Cookbook</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

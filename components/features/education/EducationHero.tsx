"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { FaGraduationCap } from "react-icons/fa";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEducation } from "@/lib/contexts";

export default function EducationHero() {
  const prefersReducedMotion = useReducedMotion();
  // Tiny parallax effect for large screens only
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, prefersReducedMotion ? 0 : -12]);
  const opacity = useTransform(scrollY, [0, 300], [1, prefersReducedMotion ? 1 : 0.9]);
  const { items } = useEducation();
  const main = items[0];

  if (!main) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle background gradient/pattern for depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{ y, opacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.1),transparent_60%)]" />
      </motion.div>
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-md border-border">
          <div className="grid gap-4">
            {/* Header block centered with icon */}
            <div className="text-center">
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3"
                aria-hidden
              >
                <FaGraduationCap className="w-6 h-6" />
              </motion.div>
              <motion.h1
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                className="text-2xl sm:text-3xl font-bold text-foreground"
              >
                {main.title}
              </motion.h1>
              <div className="text-sm text-muted-foreground mt-1">
                {main.institution}{main.location ? ` • ${main.location}` : ""}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {main.start ? `${main.start} – ` : ""}{main.end || (main.ongoing ? "Present" : "")}
              </div>
            </div>

            {main.description && (
              <motion.p
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
                className="text-sm text-foreground/90 text-center max-w-3xl mx-auto"
              >
                {main.description}
              </motion.p>
            )}

            {main.highlights && main.highlights.length > 0 && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
                className="flex flex-wrap items-center justify-center gap-2"
              >
                {main.highlights.map((h, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded border border-border text-foreground/90">
                    {h}
                  </span>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center gap-3 mt-2"
            >
              {main.link && (
                <a
                  href={main.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm px-3 py-1 rounded border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Program page
                </a>
              )}
              <a
                href="/docs/Education/Official-Transcript.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-sm px-3 py-1 rounded border border-border hover:bg-accent/30 transition-colors"
              >
                Official Transcript (PDF)
              </a>
              <a
                href="#courses"
                className="text-sm px-3 py-1 rounded border border-border hover:bg-accent/30 transition-colors"
              >
                Explore Courses
              </a>
              <a
                href="#self-education"
                className="text-sm px-3 py-1 rounded border border-border hover:bg-accent/30 transition-colors"
              >
                Self‑Education
              </a>
            </motion.div>
          </div>
        </Card>
      </div>
    </section>
  );
}


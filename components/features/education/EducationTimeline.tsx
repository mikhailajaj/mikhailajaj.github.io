"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEducation } from "@/lib/contexts";
import { FaGraduationCap, FaUniversity, FaSchool, FaGlobeAmericas } from "react-icons/fa";

export function EducationTimeline() {
  const formatDate = (raw?: string) => {
    if (!raw) return "";
    const s = String(raw);
    // Extract season + year like "Fall 2026" or "2026 (Fall)"
    const m1 = s.match(/\b(Fall|Winter|Spring|Summer)\b[^\d]*(\d{4})/i);
    const m2 = s.match(/(\d{4})[^A-Za-z]*(Fall|Winter|Spring|Summer)/i);
    const m3 = s.match(/(\d{4})[-\/]?(0[1-9]|1[0-2])/);
    const m4 = s.match(/\b(\d{4})\b/);
    const seasonToMonth: Record<string, string> = {
      winter: "Jan",
      spring: "Apr",
      summer: "Jul",
      fall: "Sep",
    };
    

    if (m1) {
      const season = m1[1].toLowerCase();
      const year = m1[2];
      return `${seasonToMonth[season]} ${year}`;
    }
    if (m2) {
      const year = m2[1];
      const season = m2[2].toLowerCase();
      return `${seasonToMonth[season]} ${year}`;
    }
    if (m3) {
      const year = m3[1];
      const monthNum = parseInt(m3[2], 10);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[monthNum - 1]} ${year}`;
    }
    if (m4) return m4[1];
    return s;
  };

  const { items } = useEducation();
  const variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const iconForLevel = (level: string) => {
    switch (level) {
      case "university":
        return <FaUniversity className="text-blue-600 dark:text-blue-400" />;
      case "highschool":
      case "secondary":
        return <FaSchool className="text-green-600 dark:text-green-400" />;
      case "primary":
        return <FaGlobeAmericas className="text-purple-600 dark:text-purple-400" />;
      default:
        return <FaGraduationCap className="text-gray-600 dark:text-gray-300" />;
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          {/* Removed title/description per request */}
        </div>

        <div className="relative">
          {/* Center vertical line */}
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border/80" aria-hidden />

          <ol className="space-y-20">
            {items.map((item, index) => (
              <li key={item.id} className="relative pt-12 pb-10">
                {/* Date label above the card, centered on the timeline */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 flex flex-col items-center z-10">
                  <div className="text-[10px] text-muted-foreground mb-1" aria-label="timeline-date">
                    {(item.start || item.end || item.ongoing) ? formatDate(item.end || (item.ongoing ? "Present" : item.start)) : ""}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-primary/15 border-2 border-primary shadow flex items-center justify-center">
                    <span className="block w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                </div>

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  variants={variants}
                  className="relative"
                >
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-6 h-6 w-px bg-border/60" aria-hidden />
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6 h-6 w-px bg-border/60" aria-hidden />
                  <Card className="w-full p-6 sm:p-7 bg-card/80 backdrop-blur-md border-border">
                    <div className="mx-auto max-w-3xl text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background border border-border">
                        {iconForLevel(item.level)}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {item.institution}{item.location ? ` • ${item.location}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {item.start ? `${item.start} – ` : ""}{item.end || (item.ongoing ? "Present" : "")}
                    </div>
                    {item.description && (
                      <p className="text-sm text-foreground/90 mb-3">{item.description}</p>
                    )}
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="list-none space-y-1 text-sm text-foreground/90 text-center">
                        {item.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex flex-wrap gap-3">
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Program page
                        </a>
                      )}
                      {item.attachments?.map((a) => (
                        <a
                          key={a.href}
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-foreground/80 hover:underline"
                        >
                          {a.label}
                        </a>
                      ))}
                    </div>
                    </div>
                  </Card>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}


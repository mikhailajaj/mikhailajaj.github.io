"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { ParsedCourse } from "@/lib/services/TranscriptParser";
import type { CourseMeta } from "@/data/courseMeta";

interface Props {
  selection: { code?: string; year?: number; season?: string };
  groupedByYear: Map<number, Map<string, ParsedCourse[]>>;
  courseMeta: Record<string, CourseMeta>;
}

export default function CourseDetailPanel({ selection, groupedByYear, courseMeta }: Props) {
  const { selectedCourse, termCourses } = useMemo(() => {
    let selectedCourse: ParsedCourse | undefined;
    let termCourses: ParsedCourse[] = [];
    if (selection.year && selection.season) {
      termCourses = groupedByYear.get(selection.year)?.get(selection.season) || [];
      if (selection.code) selectedCourse = termCourses.find((c) => c.code === selection.code);
    }
    return { selectedCourse, termCourses };
  }, [selection, groupedByYear]);

  // Build a case-insensitive title index for fallback lookups when codes differ
  const titleIndex = useMemo(() => {
    const idx = new Map<string, CourseMeta>();
    for (const m of Object.values(courseMeta)) {
      if (m.title) idx.set(m.title.trim().toLowerCase(), m);
    }
    return idx;
  }, [courseMeta]);

  const normalized = (s?: string) => (s ? s.trim().toLowerCase() : "");

  // Prefer code match; fall back to title match if codes differ but names are the same
  const meta = useMemo(() => {
    if (selectedCourse?.code && courseMeta[selectedCourse.code]) return courseMeta[selectedCourse.code];
    const key = normalized(selectedCourse?.name);
    return key ? titleIndex.get(key) : undefined;
  }, [selectedCourse, courseMeta, titleIndex]);

  const showSummary = !selectedCourse || !meta;

  if (showSummary) {
    // Aggregate a simple term summary from available metadata
    const stacks = new Set<string>();
    const highlightedAssignments: { title: string; course: string }[] = [];
    for (const c of termCourses) {
      const m = c.code ? courseMeta[c.code] || titleIndex.get(normalized(c.name)) : undefined;
      if (!m) continue;
      m.techStack?.forEach((t) => stacks.add(t));
      if (m.assignments && highlightedAssignments.length < 3) {
        highlightedAssignments.push({ title: m.assignments[0]?.title || "Assignment", course: c.code || c.name || "" });
      }
    }

    return (
      <Card className="p-5 bg-card/80 backdrop-blur-md border-border">
        <h4 className="text-lg font-semibold text-foreground mb-2">Term Summary</h4>
        {selection.year && selection.season && (
          <div className="text-sm text-muted-foreground mb-4">
            {selection.season} {selection.year}
          </div>
        )}
        <div className="mb-3">
          <div className="text-sm font-medium mb-1">Tech Stack (aggregated)</div>
          <div className="flex flex-wrap gap-2">
            {Array.from(stacks).map((s) => (
              <span key={s} className="text-xs px-2 py-1 rounded border border-border text-foreground/90">
                {s}
              </span>
            ))}
            {stacks.size === 0 && <span className="text-sm text-muted-foreground">No stack info yet</span>}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Highlighted Assignments</div>
          <ul className="list-disc pl-5 text-sm text-foreground/90">
            {highlightedAssignments.length > 0 ? (
              highlightedAssignments.map((a, i) => <li key={i}>{a.title} <span className="text-muted-foreground">({a.course})</span></li>)
            ) : (
              <li className="text-muted-foreground">Add course metadata to show assignments</li>
            )}
          </ul>
        </div>
      </Card>
    );
  }

  // Selected course details show transcript term at top (season + year)
  return (
    <Card className="p-5 bg-card/80 backdrop-blur-md border-border">
      <h4 className="text-lg font-semibold text-foreground mb-1">{meta.title || selectedCourse?.name || selectedCourse?.code}</h4>
      <div className="text-xs text-muted-foreground mb-3">
        {selection.season} {selection.year} • {selectedCourse?.code || selectedCourse?.name}
      </div>
      {meta.description && <p className="text-sm text-foreground/90 mb-3">{meta.description}</p>}
      {meta.techStack && meta.techStack.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1">Tech Stack</div>
          <div className="flex flex-wrap gap-2">
            {meta.techStack.map((s) => (
              <span key={s} className="text-xs px-2 py-1 rounded border border-border text-foreground/90">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {meta.assignments && meta.assignments.length > 0 && (
        <div className="mb-2">
          <div className="text-sm font-medium mb-1">Assignments</div>
          <ul className="list-disc pl-5 text-sm text-foreground/90">
            {meta.assignments.map((a, i) => (
              <li key={i}>
                {a.link ? (
                  <a className="hover:underline" href={a.link} target="_blank" rel="noreferrer">{a.title}</a>
                ) : (
                  <>{a.title}</>
                )}
                {a.brief ? <span className="text-muted-foreground"> — {a.brief}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
      {meta.resources && meta.resources.length > 0 && (
        <div className="mt-3">
          <div className="text-sm font-medium mb-1">Resources</div>
          <div className="flex flex-wrap gap-3">
            {meta.resources.map((r) => (
              <a key={r.href} href={r.href} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {r.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}


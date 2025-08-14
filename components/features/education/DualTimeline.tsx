"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useTimeline } from "@/lib/contexts";
import { FaUniversity } from "react-icons/fa";
import { parseTranscript, type ParsedCourse } from "@/lib/services/TranscriptParser";
import DetailPanel from "./CourseDetailPanel";
import { courseMeta } from "@/data/courseMeta";

// Helper to normalize and order terms
const TERM_ORDER = ["Fall", "Winter", "Summer", "Spring"]; // per request: fall-winter-summer (include spring if present)
const normalizeTerm = (t?: string): { season?: string; year?: number } => {
  if (!t) return {};
  const m = t.match(/\b(Fall|Winter|Spring|Summer)\s+(\d{4})\b/i);
  if (!m) return {};
  const season = m[1][0].toUpperCase() + m[1].slice(1).toLowerCase();
  const year = parseInt(m[2], 10);
  return { season, year };
};

// GPA helpers (simple average across numeric grades in a set of courses)
function safeAverage(grades: number[]): number | undefined {
  const valid = grades.filter((g) => Number.isFinite(g) && g >= 0 && g <= 100);
  if (valid.length === 0) return undefined;
  const sum = valid.reduce((a, b) => a + b, 0);
  return sum / valid.length;
}

export default function DualTimeline() {
  const { leftItems, setHoverSide } = useTimeline();

  const onHoverLeft = () => setHoverSide("left");
  const onHoverRight = () => setHoverSide("right");
  const onHoverCenter = () => setHoverSide("both");
  const onHoverLeave = () => setHoverSide(null);

  // Drag sync (mobile or center grip)
  const dragX = useMotionValue(0);
  const leftParallax = useTransform(dragX, [-200, 200], [20, -20]);
  const rightParallax = useTransform(dragX, [-200, 200], [-20, 20]);

  // Courses by year/term (from public transcript)
  const [courses, setCourses] = useState<ParsedCourse[] | null>(null);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);

  // Filters / density
  const [subjectFilter, setSubjectFilter] = useState<string>("All");
  const [minGrade, setMinGrade] = useState<number>(0);
  const [density, setDensity] = useState<"compact" | "detailed">("detailed");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingCourses(true);
        const res = await fetch("/docs/Education/official-transcript.txt");
        if (!res.ok) throw new Error(`Failed to fetch transcript: ${res.status}`);
        const text = await res.text();
        const parsed = parseTranscript(text);
        if (!cancelled) {
          setCourses(parsed);
        }
      } catch (e: any) {
        if (!cancelled) setErrorCourses(e?.message || "Unable to load transcript");
      } finally {
        if (!cancelled) setLoadingCourses(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);



  const groupedByYear = useMemo(() => {
    const map = new Map<number, Map<string, ParsedCourse[]>>();
    if (!courses) return map;
    for (const c of courses) {
      const { season, year } = normalizeTerm(c.term);
      if (!season || !year) continue;
      if (!map.has(year)) map.set(year, new Map());
      const byTerm = map.get(year)!;
      if (!byTerm.has(season)) byTerm.set(season, []);
      byTerm.get(season)!.push(c);
    }
    // sort courses within terms by code then name
    for (const [, terms] of map) {
      for (const [, list] of terms) {
        list.sort((a, b) => (a.code || "").localeCompare(b.code || "") || (a.name || "").localeCompare(b.name || ""));
      }
    }
    return map;
  }, [courses]);

  const sortedYears = useMemo(() => Array.from(groupedByYear.keys()).sort((a, b) => b - a), [groupedByYear]);

  // Selection state for right-side details
  const [selection, setSelection] = useState<{ code?: string; year?: number; season?: string }>({});

  // Tabs: Summary | Selected Course
  const [tab, setTab] = useState<"summary" | "course">("summary");

  // Preselect newest term (first year in sortedYears, first term by TERM_ORDER)
  const didPreselect = useRef(false);
  useEffect(() => {
    if (didPreselect.current) return;
    if (sortedYears.length === 0) return;
    const newestYear = sortedYears[0];
    const terms = groupedByYear.get(newestYear);
    if (!terms) return;
    const termKeys = Array.from(terms.keys()).sort((a, b) => TERM_ORDER.indexOf(a) - TERM_ORDER.indexOf(b));
    if (termKeys.length === 0) return;
    setSelection({ year: newestYear, season: termKeys[0] });
    setTab("summary");
    didPreselect.current = true;
  }, [sortedYears, groupedByYear]);

  // Auto-update term summary while scrolling when no course is selected
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Don't override if a specific course is selected
    if (selection.code) return;

    const termNodes = Array.from(document.querySelectorAll('[data-year][data-term]')) as HTMLElement[];
    if (termNodes.length === 0) return;

    let raf: number | null = null;

    const updateFromEntry = (entry: IntersectionObserverEntry) => {
      const el = entry.target as HTMLElement;
      const y = parseInt(el.dataset.year || '', 10);
      const s = el.dataset.term || undefined;
      if (!y || !s) return;
      // Avoid excessive state churn
      setSelection((prev) => (prev.code ? prev : (prev.year === y && prev.season === s ? prev : { year: y, season: s })));
    };

    const observer = new IntersectionObserver((entries) => {
      // Pick the entry with highest intersection ratio that is intersecting
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length === 0) return;
      const best = visible.reduce((a, b) => (a.intersectionRatio >= b.intersectionRatio ? a : b));
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => updateFromEntry(best));
    }, {
      root: null,
      // Encourage mid-viewport detection
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0.15, 0.35, 0.55, 0.75]
    });

    termNodes.forEach((n) => observer.observe(n));

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [selection.code, groupedByYear, sortedYears]);

  // Subject and grade filters; density
  const subjects = useMemo(() => {
    const s = new Set<string>();
    for (const [, terms] of groupedByYear) {
      for (const [, list] of terms) list.forEach((c) => c.subject && s.add(c.subject));
    }
    return ["All", ...Array.from(s).sort()];
  }, [groupedByYear]);

  const applyFilters = (list: ParsedCourse[]) =>
    list.filter((c) => (subjectFilter === "All" || c.subject === subjectFilter) && (typeof c.numericGrade !== "number" || c.numericGrade >= minGrade));

  return (
    <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3 text-foreground">Education Timeline</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Courses grouped by term on the left; select a course to view details on the right.
          </p>
        </div>


        <div
          className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[400px]"
          onMouseLeave={onHoverLeave}
        >
          {/* Left hover region */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/2" onMouseEnter={onHoverLeft} aria-hidden />
          {/* Right hover region */}
          <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2" onMouseEnter={onHoverRight} aria-hidden />
          {/* Center hover region */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-16" onMouseEnter={onHoverCenter} aria-hidden />

          {/* Left vertical lines */}
          <div className="hidden lg:block absolute left-[calc(50%-1rem)] top-0 bottom-0 w-px bg-border" aria-hidden />
          {/* Right vertical line */}
          <div className="hidden lg:block absolute left-[calc(50%+1rem)] top-0 bottom-0 w-px bg-border" aria-hidden />
          {/* Single line on mobile */}
          <div className="lg:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-border" aria-hidden />

          {/* Center drag handle */}
          <motion.div
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-4 z-10 w-10 h-10 rounded-full border border-border bg-background items-center justify-center shadow cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: -60, right: 60 }}
            style={{ x: dragX }}
          >
            <div className="w-1 h-5 bg-muted-foreground/60 rounded" />
          </motion.div>

          {/* Mobile default detail view above the list */}
          <div className="lg:hidden">
            <div className="mb-6">
              <DetailPanel selection={selection} groupedByYear={groupedByYear} courseMeta={courseMeta} />
            </div>
          </div>

          {/* Left column (Education) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaUniversity /> Education</h3>
              <motion.ol style={{ y: leftParallax }} className="space-y-6">
                {sortedYears.map((year) => {
                  const terms = groupedByYear.get(year)!;
                  const termKeys = Array.from(terms.keys()).sort((a, b) => TERM_ORDER.indexOf(a) - TERM_ORDER.indexOf(b));
                  // Compute simple average across all numeric grades in the year
                  const allGrades: number[] = [];
                  for (const key of termKeys) {
                    for (const c of terms.get(key) || []) {
                      if (typeof c.numericGrade === "number") allGrades.push(c.numericGrade);
                    }
                  }
                  const yearAvg = safeAverage(allGrades);
                  return (
                    <li key={year}>
                      <Card className="p-5 bg-card/80 backdrop-blur-md border-border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-base font-semibold text-foreground">{year}</div>
                          <div className="text-xs text-muted-foreground">
                            {typeof yearAvg === "number" && <span>Avg: {yearAvg.toFixed(1)}</span>}
                          </div>
                        </div>
                        <div className="space-y-3">
                          {termKeys.map((t) => (
                            <div key={t} data-year={year} data-term={t}>
                              <div className="text-sm font-semibold text-foreground/90 mb-1">{t}</div>
                              <ul className={`${density === "compact" ? "pl-4" : "list-disc pl-5"} text-sm text-foreground/90`}>
                                {applyFilters(terms.get(t)!).map((c, idx) => (
                                  <li key={`${c.code || c.name}-${idx}`}>
                                    <button
                                      type="button"
                                      className="hover:underline"
                                      onClick={() => { setTab("course"); setSelection({ code: c.code, year, season: t }); }}
                                    >
                                      <span className="font-medium">{c.code}</span>
                                      {c.code ? ": " : ""}
                                      {density === "compact" ? (c.name?.split(" ").slice(0, 3).join(" ") + (c.name && c.name.split(" ").length > 3 ? "…" : "")) : c.name}
                                    </button>
                                    {density === "detailed" && typeof c.numericGrade === "number" && (
                                      <span className="ml-2 text-xs text-muted-foreground">({c.numericGrade})</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </motion.ol>
            </div>
          </div>

          {/* Center spacer */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Right column (Course Details) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <DetailPanel selection={selection} groupedByYear={groupedByYear} courseMeta={courseMeta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

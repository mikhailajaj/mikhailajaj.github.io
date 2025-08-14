"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { FaCode, FaDatabase, FaNetworkWired, FaMicrochip, FaSquareRootAlt, FaFlask, FaBook } from "react-icons/fa";
import { parseTranscript, ParsedCourse } from "@/lib/services/TranscriptParser";

interface Props {
  transcriptUrl: string; // URL to the public .txt file
  title?: string;
  embedded?: boolean; // render without outer section/card container
  showFilters?: boolean; // show filter controls
}

export default function TranscriptCourses({ transcriptUrl, title = "Courses", embedded = false, showFilters = true }: Props) {
  const [courses, setCourses] = useState<ParsedCourse[] | null>(null);
  const [announce, setAnnounce] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setAnnounce("Loading courses");
        const res = await fetch(transcriptUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch transcript: ${res.status}`);
        const text = await res.text();
        const parsed = parseTranscript(text);
        if (active) {
          setCourses(parsed);
          setAnnounce(`Loaded ${parsed.length} courses`);
        }
      } catch (e: any) {
        if (active) {
          setError(e?.message || "Failed to parse transcript");
          setAnnounce("Failed to load courses");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [transcriptUrl]);

  // Letter grade mapping from numeric grade
  const mapNumericToLetter = (n?: number): string | undefined => {
    if (typeof n !== 'number') return undefined;
    if (n >= 90) return 'A+';
    if (n >= 85) return 'A';
    if (n >= 80) return 'A-';
    if (n >= 75) return 'B+';
    if (n >= 70) return 'B';
    if (n >= 65) return 'C+';
    if (n >= 60) return 'C';
    if (n >= 55) return 'C-';
    if (n >= 50) return 'D';
    return 'F';
  };

  // Subject -> icon + color
  const subjectBadge = (subject?: string) => {
    const s = (subject || '').toUpperCase();
    const map: Record<string, { label: string; color: string }> = {
      PROG: { label: 'Programming', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
      INFO: { label: 'Information Systems', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
      DBAS: { label: 'Databases', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
      MATH: { label: 'Mathematics', color: 'bg-green-500/15 text-green-600 dark:text-green-400' },
      SYST: { label: 'Systems', color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
      TELE: { label: 'Networking', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' },
      PHYS: { label: 'Physics', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
      PSYC: { label: 'Psychology', color: 'bg-pink-500/15 text-pink-600 dark:text-pink-400' },
      CULT: { label: 'Culture', color: 'bg-lime-500/15 text-lime-600 dark:text-lime-400' },
      HIST: { label: 'History', color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
      SCIE: { label: 'Science', color: 'bg-teal-500/15 text-teal-600 dark:text-teal-400' },
      COWT: { label: 'Co-op/Work Term', color: 'bg-gray-500/15 text-foreground' },
      ENGL: { label: 'English', color: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400' },
      PHIL: { label: 'Philosophy', color: 'bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400' },
    };
    const v = map[s] || { label: s || 'Course', color: 'bg-muted text-foreground' };
    const iconMap: Record<string, JSX.Element> = {
      PROG: <FaCode />, INFO: <FaCode />, DBAS: <FaDatabase />, TELE: <FaNetworkWired />, SYST: <FaMicrochip />, MATH: <FaSquareRootAlt />, PHYS: <FaFlask />, SCIE: <FaFlask />, ENGL: <FaBook />, HIST: <FaBook />, CULT: <FaBook />, PSYC: <FaBook />
    };
    return <span className={`text-[10px] px-2 py-0.5 rounded inline-flex items-center gap-1 ${v.color}`}>{iconMap[s] || <FaBook />}{v.label}</span>;
  };

  // Filters
  const [subject, setSubject] = useState<string>("ALL");
  const [term, setTerm] = useState<string>("ALL");
  const [gradeRange, setGradeRange] = useState<string>("ALL");

  const subjects = useMemo(() => Array.from(new Set((courses || []).map(c => (c.subject || 'OTHER').toUpperCase()))), [courses]);
  const terms = useMemo(() => Array.from(new Set((courses || []).map(c => c.term).filter(Boolean) as string[])), [courses]);

  const inGradeRange = (n?: number) => {
    if (gradeRange === 'ALL' || typeof n !== 'number') return true;
    const ranges: Record<string, [number, number]> = {
      // Grouped shortcuts
      "A's (A-, A, A+)": [80, 100],
      "B's (70-79)": [70, 79],
      "C's (C, C+)": [55, 69],
      // Individual bands
      'A+ (90-100)': [90, 100],
      'A (85-89)': [85, 89],
      'A- (80-84)': [80, 84],
      'B+ (75-79)': [75, 79],
      'B (70-74)': [70, 74],
      'C+ (65-69)': [65, 69],
      'C (60-64)': [60, 64],
      'C- (55-59)': [55, 59],
      'D (50-54)': [50, 54],
      'F (&lt;50)': [0, 49],
    };
    const r = ranges[gradeRange];
    return r ? (n >= r[0] && n <= r[1]) : true;
  };

  const filtered = useMemo(() => (courses || []).filter(c =>
    (subject === 'ALL' || (c.subject || 'OTHER').toUpperCase() === subject) &&
    (term === 'ALL' || c.term === term) &&
    inGradeRange(c.numericGrade)
  ), [courses, subject, term, gradeRange]);

  const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    embedded ? <>{children}</> : (
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-card/80 backdrop-blur-md border-border">{children}</Card>
        </div>
      </section>
    )
  );

  // Sorting
  type SortKey = 'term' | 'subject' | 'grade' | 'code' | 'name';
  const [sortBy, setSortBy] = useState<SortKey>('grade');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const cmp = (a: ParsedCourse, b: ParsedCourse) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'grade':
          return ((a.numericGrade ?? -1) - (b.numericGrade ?? -1)) * dir;
        case 'term':
          return String(a.term || '').localeCompare(String(b.term || '')) * dir;
        case 'subject':
          return String(a.subject || '').localeCompare(String(b.subject || '')) * dir;
        case 'code':
          return String(a.code || '').localeCompare(String(b.code || '')) * dir;
        case 'name':
          return String(a.name || a.raw).localeCompare(String(b.name || b.raw)) * dir;
        default:
          return 0;
      }
    };
    arr.sort(cmp);
    return arr;
  }, [filtered, sortBy, sortDir]);

  // Summary stats
  const summary = useMemo(() => {
    const count = sorted.length;
    const avg = count > 0 ? Math.round(sorted.reduce((acc, c) => acc + (c.numericGrade ?? 0), 0) / count) : 0;
    const aRange = sorted.filter(c => (c.numericGrade ?? 0) >= 80).length;
    return { count, avg, aRange };
  }, [sorted]);

  // CSV export
  const toCsv = useCallback((rows: ParsedCourse[]) => {
    const header = ['term','subject','code','name','numericGrade','grade'];
    const body = rows.map(r => [r.term ?? '', r.subject ?? '', r.code ?? '', r.name ?? r.raw, String(r.numericGrade ?? ''), r.grade ?? '']);
    const esc = (s: string) => '"' + s.replace(/"/g, '""') + '"';
    return [header, ...body].map(cols => cols.map(esc).join(',')).join('\n');
  }, []);

  const handleExportCsv = useCallback(() => {
    const csv = toCsv(sorted);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courses.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [sorted, toCsv]);

  return (
    <Container>
      <h3 className="text-xl font-semibold mb-4 text-foreground">{title}</h3>
      {error && (
        <p className="text-sm text-destructive">
          {error}. Ensure the transcript .txt is placed under <code>public/docs/Education/</code> and is publicly accessible.
        </p>
      )}
      {!error && !courses && <p className="text-sm text-muted-foreground">Loading courses…</p>}
      {courses && courses.length === 0 && (
        <p className="text-sm text-muted-foreground">No courses detected in the transcript.</p>
      )}

      {/* Status announcer for screen readers */}
      <span aria-live="polite" className="sr-only">{announce}</span>

      {showFilters && courses !== null && (
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <label className="flex items-center gap-2">
            Subject
            <select className="bg-background border border-border rounded px-2 py-1" value={subject} onChange={e => setSubject(e.target.value)}>
              <option value="ALL">All</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Term
            <select className="bg-background border border-border rounded px-2 py-1" value={term} onChange={e => setTerm(e.target.value)}>
              <option value="ALL">All</option>
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            Grade
            <select className="bg-background border border-border rounded px-2 py-1" value={gradeRange} onChange={e => setGradeRange(e.target.value)}>
              <option>ALL</option>
              <option>A&apos;s (A-, A, A+)</option>
              <option>A+ (90-100)</option>
              <option>A (85-89)</option>
              <option>A- (80-84)</option>
              <option>B&apos;s (70-79)</option>
              <option>B+ (75-79)</option>
              <option>B (70-74)</option>
              <option>C&apos;s (C, C+)</option>
              <option>C+ (65-69)</option>
              <option>C (60-64)</option>
              <option>C- (55-59)</option>
              <option>D (50-54)</option>
              <option>F (&lt;50)</option>
            </select>
          </label>
        </div>
      )}

      {/* Sort and actions */}
      {courses && courses.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
          <label className="flex items-center gap-2">
            Sort by
            <select aria-label="Sort courses by" className="bg-background border border-border rounded px-2 py-1" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
              <option value="grade">Grade</option>
              <option value="term">Term</option>
              <option value="subject">Subject</option>
              <option value="code">Code</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            Direction
            <select aria-label="Sort direction" className="bg-background border border-border rounded px-2 py-1" value={sortDir} onChange={e => setSortDir(e.target.value as 'asc' | 'desc')}>
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </label>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs text-muted-foreground" aria-live="polite">
              {summary.count} courses • Avg {summary.avg} • A-range {summary.aRange}
            </div>
            <button type="button" onClick={handleExportCsv} className="px-2 py-1 rounded border border-border hover:bg-accent text-xs" aria-label="Export courses to CSV">Export CSV</button>
          </div>
        </div>
      )}

      {courses && courses.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((c, idx) => {
            const letter = mapNumericToLetter(c.numericGrade) || c.grade;
            return (
              <li key={idx} className="text-sm">
                <div className="text-foreground font-medium flex items-center gap-2">
                  {subjectBadge(c.subject)}
                  <span>{c.code ? `${c.code} — ` : ""}{c.name || c.raw}</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 mt-1">
                  {letter && <span className="inline-block text-xs px-2 py-0.5 rounded bg-muted">{c.numericGrade ?? ''} {letter}</span>}
                  {c.term && <span className="text-xs">{c.term}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}

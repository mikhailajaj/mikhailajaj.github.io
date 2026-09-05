'use client'

import { useMemo, useState } from 'react'
import { displayTerms, gradeStyle, type Course } from '@/data/transcript'

/* Terms render current → previous */
const newestFirst = [...displayTerms].reverse()

export default function TranscriptRecord() {
  const [subject, setSubject] = useState<string>('all')

  const subjects = useMemo(() => {
    const counts = new Map<string, number>()
    for (const term of displayTerms) {
      for (const course of term.courses) {
        counts.set(course.subject, (counts.get(course.subject) ?? 0) + 1)
      }
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [])

  const totalCourses = displayTerms.reduce((n, t) => n + t.courses.length, 0)

  const filteredTerms = newestFirst
    .map((term) => ({
      ...term,
      courses:
        subject === 'all'
          ? term.courses
          : term.courses.filter((c) => c.subject === subject),
    }))
    .filter((term) => term.courses.length > 0)

  const shownCourses = filteredTerms.reduce((n, t) => n + t.courses.length, 0)

  return (
    <>
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <FilterChip
          label="All"
          count={totalCourses}
          active={subject === 'all'}
          onClick={() => setSubject('all')}
        />
        {subjects.map(([subj, count]) => (
          <FilterChip
            key={subj}
            label={subj}
            count={count}
            active={subject === subj}
            onClick={() => setSubject(subj)}
          />
        ))}
      </div>

      <p className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-5">
        {shownCourses} {shownCourses === 1 ? 'course' : 'courses'} · {filteredTerms.length}{' '}
        {filteredTerms.length === 1 ? 'term' : 'terms'} · newest first
      </p>

      {/* ── Terms ── */}
      <div className="space-y-5">
        {filteredTerms.map((term) => (
          <div key={term.id} id={term.id}
               className="rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)] overflow-hidden">

            {/* Term header */}
            <div className="flex items-center justify-between px-5 py-3
                            border-b border-[rgb(var(--text-muted-rgb)/0.12)] bg-[rgb(var(--surface-rgb)/0.24)]">
              <h3 className="text-sm font-semibold text-[rgb(var(--text-rgb))] tracking-wide">
                {term.label}
              </h3>
            </div>

            {/* Course table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgb(var(--text-muted-rgb)/0.1)]">
                    <th className="text-left text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase
                                   tracking-widest px-5 py-2.5 w-16">Subj</th>
                    <th className="text-left text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase
                                   tracking-widest px-3 py-2.5 w-24">Code</th>
                    <th className="text-left text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase
                                   tracking-widest px-3 py-2.5">Course Name</th>
                    <th className="text-center text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase
                                   tracking-widest px-3 py-2.5 w-20">Grade</th>
                    <th className="text-right text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase
                                   tracking-widest px-5 py-2.5 w-20">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {term.courses.map((course, i) => (
                    <CourseRow key={`${course.subject}-${course.code}-${i}`} course={course} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Term footer: credit subtotal */}
            <TermSummary courses={term.courses} />
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium
                  tracking-wide transition-all duration-200 border ${
        active
          ? 'bg-[rgb(var(--accent-cool-rgb)/0.15)] border-[rgb(var(--accent-cool-rgb)/0.3)] text-[rgb(var(--accent-warm-rgb))]'
          : 'bg-[rgb(var(--surface-rgb)/0.34)] border-[rgb(var(--text-muted-rgb)/0.14)] text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-soft-rgb))] hover:border-[rgb(var(--text-muted-rgb)/0.28)]'
      }`}
    >
      {label}
      <span className={active ? 'text-[rgb(var(--accent-cool-rgb)/0.7)]' : 'text-[rgb(var(--text-muted-rgb)/0.5)]'}>{count}</span>
    </button>
  )
}

function CourseRow({ course }: { course: Course }) {
  const gs = gradeStyle(course.grade)
  const isNoGrade = course.grade === '' && course.credits === 0

  return (
    <>
      <tr className={`border-b border-[rgb(var(--text-muted-rgb)/0.08)] hover:bg-[rgb(var(--surface-rgb)/0.24)] transition-colors
                      ${isNoGrade ? 'opacity-40' : ''}`}>
        <td className="px-5 py-3 font-mono text-xs text-[rgb(var(--text-muted-rgb))] font-semibold tracking-wide">
          {course.subject}
        </td>
        <td className="px-3 py-3 font-mono text-xs text-[rgb(var(--text-muted-rgb)/0.75)]">
          {course.code}
        </td>
        <td className="px-3 py-3 text-[rgb(var(--text-soft-rgb))] text-sm">
          {course.name}
        </td>
        <td className="px-3 py-3 text-center">
          {course.grade ? (
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold
                              ${gs.text} ${gs.bg}`}>
              {gs.label}
            </span>
          ) : (
            <span className="text-[rgb(var(--text-muted-rgb)/0.5)] text-xs font-mono">—</span>
          )}
        </td>
        <td className="px-5 py-3 text-right font-mono text-xs text-[rgb(var(--text-muted-rgb))]">
          {course.credits > 0 ? course.credits.toFixed(3) : '—'}
        </td>
      </tr>
      {course.note && (
        <tr className="border-b border-[rgb(var(--text-muted-rgb)/0.08)]">
          <td colSpan={5} className="px-5 pb-2 pt-0">
            <span className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] italic">
              ↳ {course.note}
            </span>
          </td>
        </tr>
      )}
    </>
  )
}

function TermSummary({ courses }: { courses: Course[] }) {
  const earned = courses
    .filter(c => !isNaN(parseInt(c.grade)) || c.grade === 'S')
    .reduce((sum, c) => sum + c.credits, 0)

  const attempted = courses
    .filter(c => c.credits > 0)
    .reduce((sum, c) => sum + c.credits, 0)

  return (
    <div className="flex items-center justify-end gap-6 px-5 py-2.5 bg-[rgb(var(--surface-rgb)/0.16)] border-t border-[rgb(var(--text-muted-rgb)/0.1)]">
      <span className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)]">
        Attempted: <span className="text-[rgb(var(--text-muted-rgb))]">{attempted.toFixed(1)} cr</span>
      </span>
      <span className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)]">
        Earned: <span className="text-[rgb(var(--text-muted-rgb))] font-semibold">{earned.toFixed(1)} cr</span>
      </span>
    </div>
  )
}

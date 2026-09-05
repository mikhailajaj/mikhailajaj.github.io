import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import ChartsWrapper from '@/components/charts/ChartsWrapper'
import TranscriptRecord from '@/components/TranscriptRecord'
import { displayTerms, studentInfo, computeStats, gradeStyle } from '@/data/transcript'

export const metadata: Metadata = {
  title: 'Academic Transcript · Mikhail Ajaj',
  description:
    'Unofficial academic transcript — Honours Bachelor of Computer Science (Mobile Computing), Sheridan College.',
}

const stats = computeStats(displayTerms)

export default function EducationPage() {
  return (
    <PageShell eyebrow="Unofficial Transcript" action={<DownloadTranscript />}>

        {/* ── Document Header ── */}
        <div className="mb-8 p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-[rgb(var(--accent-cool-rgb)/0.7)] tracking-[0.2em] uppercase mb-2">
                Grade Report
              </p>
              <h1 className="text-xl font-bold text-[rgb(var(--text-rgb))] mb-0.5">
                {studentInfo.institution}
              </h1>
              <p className="text-sm text-[rgb(var(--text-muted-rgb))]">{studentInfo.address}</p>
              <p className="text-sm text-[rgb(var(--text-muted-rgb))]">{studentInfo.phone}</p>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full
                               bg-[rgb(var(--accent-warm-rgb)/0.1)] border border-[rgb(var(--accent-warm-rgb)/0.25)] text-[rgb(var(--accent-warm-rgb))]
                               tracking-wide uppercase">
                Unofficial Transcript
              </span>
              <p className="text-xs text-[rgb(var(--text-muted-rgb)/0.75)] mt-2 font-mono">
                Printed: {studentInfo.printDate}
              </p>
            </div>
          </div>
        </div>

        {/* ── Student Info ── */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-3">Student</p>
            <p className="text-lg font-bold text-[rgb(var(--text-rgb))] mb-1">{studentInfo.name}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-3">Program</p>
            <p className="text-sm font-semibold text-[rgb(var(--text-rgb))] leading-snug mb-1.5">
              {studentInfo.programFull}
            </p>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 shrink-0 bg-[rgb(var(--accent-ok-rgb))]" />
              <p className="text-xs text-[rgb(var(--accent-ok-rgb))]">
                {studentInfo.status} · {studentInfo.activeDate} – {studentInfo.graduationDate}
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats Summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { label: 'Terms',            value: stats.terms             },
            { label: 'Courses Done',     value: stats.completedCourses  },
            { label: 'Credits Earned',   value: stats.totalCredits      },
            { label: 'Grade Average',    value: `${stats.average}%`     },
          ].map(({ label, value }) => (
            <div key={label}
                 className="p-4 rounded-xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.12)] text-center">
              <p className="text-2xl font-bold text-[rgb(var(--text-rgb))] leading-none mb-1">{value}</p>
              <p className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Charts ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <p className="section-label" style={{ marginBottom: 0 }}>Performance Overview</p>
          </div>
          <ChartsWrapper />
        </div>

        {/* ── Grade Legend ── */}
        <div className="flex flex-wrap items-center gap-2 mb-10 px-1">
          <span className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mr-1">Grade key:</span>
          {[
            { range: '90–100', style: gradeStyle('95') },
            { range: '80–89',  style: gradeStyle('85') },
            { range: '70–79',  style: gradeStyle('75') },
            { range: '60–69',  style: gradeStyle('65') },
            { range: '50–59',  style: gradeStyle('55') },
            { range: 'S',      style: gradeStyle('S')  },
          ].map(({ range, style }) => (
            <span key={range}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${style.text} ${style.bg} border border-[rgb(var(--text-muted-rgb)/0.12)]`}>
              {range}
            </span>
          ))}
        </div>

        {/* ── Academic Record ── */}
        <div className="mb-6">
          <p className="section-label">Academic Record</p>
          <h2 className="section-heading">Course History</h2>
        </div>

        <TranscriptRecord />

        {/* ── End of Record ── */}
        <div className="mt-10 py-6 text-center border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
          <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] tracking-widest uppercase">
            End of Unofficial Transcript
          </p>
          <p className="text-xs text-[rgb(var(--text-muted-rgb)/0.5)] mt-1 font-mono">
            {studentInfo.institution} · Printed {studentInfo.printDate}
          </p>
        </div>

    </PageShell>
  )
}


function DownloadTranscript() {
  return (
    <a
      href="/docs/Education/SSR_TSRPT.pdf"
      download
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                 bg-[rgb(var(--accent-cool-rgb)/0.1)] border border-[rgb(var(--accent-cool-rgb)/0.2)]
                 text-[rgb(var(--accent-cool-rgb))]
                 hover:bg-[rgb(var(--accent-cool-rgb)/0.2)] hover:border-[rgb(var(--accent-cool-rgb)/0.4)]
                 transition-all"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
      Download PDF
    </a>
  )
}

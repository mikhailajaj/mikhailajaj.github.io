import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import {
  resumeCompetencies,
  resumeContacts,
  resumeEducation,
  resumeExperience,
  resumeFile,
  resumeHeader,
  resumeProjects,
  resumeSkills,
  resumeSoftSkills,
  resumeSummary,
} from '@/data/resume'

export const metadata: Metadata = {
  title: 'Resume · Mikhail Ajaj',
  description:
    'Software Developer resume — Data Analyst at Tandia Financial, Honours BCS (Mobile Computing) from Sheridan College, with experience across full-stack, data and cloud work.',
}

export default function ResumePage() {
  return (
    <PageShell eyebrow="Resume" action={<DownloadResume />}>
      {/* ── Header ── */}
      <header className="mb-10 pb-8 border-b border-[rgb(var(--text-muted-rgb)/0.14)]">
        <p className="section-label">Resume</p>
        <h1 className="section-heading mb-1">{resumeHeader.name}</h1>
        <p className="text-[rgb(var(--accent-rgb))] font-mono text-sm tracking-[0.2em] uppercase mb-6">
          {resumeHeader.title}
        </p>

        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {resumeContacts.map(({ label, value, href }) => (
            <li key={label}>
              <p className="text-[0.65rem] font-mono uppercase tracking-widest text-[rgb(var(--text-muted-rgb)/0.75)] mb-0.5">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm text-[rgb(var(--text-soft-rgb))]">{value}</p>
              )}
            </li>
          ))}
        </ul>
      </header>

      {/* ── Summary ── */}
      <Section title="Summary">
        <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed max-w-3xl">
          {resumeSummary}
        </p>
      </Section>

      {/* ── Skills ── */}
      <Section title="Technical Skills">
        <div className="grid sm:grid-cols-2 gap-4">
          {resumeSkills.map(({ heading, items }) => (
            <div
              key={heading}
              className="p-5 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]"
            >
              <h3 className="text-sm font-semibold text-[rgb(var(--text-rgb))] mb-3">{heading}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-0.5 text-[0.7rem] rounded-md tracking-wide font-medium
                               bg-[rgb(var(--bg-elevated-rgb)/0.42)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                               text-[rgb(var(--text-muted-rgb))]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Core competencies ── */}
      <Section title="Core Competencies">
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-5">
          {resumeCompetencies.map((c) => (
            <li key={c} className="flex gap-2.5 text-sm text-[rgb(var(--text-soft-rgb))] leading-snug">
              <span className="text-[rgb(var(--accent-cool-rgb))] shrink-0 mt-px">▸</span>
              {c}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[rgb(var(--text-muted-rgb))]">
          <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[rgb(var(--text-muted-rgb)/0.75)] mr-2">
            Soft skills
          </span>
          {resumeSoftSkills.join(' · ')}
        </p>
      </Section>

      {/* ── Experience ── */}
      <Section title="Experience">
        <div className="space-y-4">
          {resumeExperience.map((role) => (
            <article
              key={`${role.title}-${role.period}`}
              className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                <h3 className="text-base font-semibold text-[rgb(var(--text-rgb))]">{role.title}</h3>
                <span className="text-[0.7rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] shrink-0">
                  {role.period}
                </span>
              </div>
              <p className="text-xs font-medium text-[rgb(var(--accent-warm-rgb)/0.9)] mb-3">
                {role.company} · {role.mode}
              </p>

              {role.about && (
                <p className="text-xs italic text-[rgb(var(--text-muted-rgb)/0.75)] leading-relaxed mb-3">
                  {role.about}
                </p>
              )}
              {role.intro && (
                <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed mb-3">
                  {role.intro}
                </p>
              )}

              <ul className="space-y-2">
                {role.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm text-[rgb(var(--text-muted-rgb))] leading-snug">
                    <span className="text-[rgb(var(--accent-rgb)/0.8)] shrink-0 mt-px">–</span>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Education ── */}
      <Section title="Education">
        <div className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
            <h3 className="text-base font-semibold text-[rgb(var(--text-rgb))]">
              {resumeEducation.degree}
            </h3>
            <span className="text-[0.7rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] shrink-0">
              {resumeEducation.period}
            </span>
          </div>
          <p className="text-xs font-medium text-[rgb(var(--accent-warm-rgb)/0.9)] mb-3">
            {resumeEducation.institution} · {resumeEducation.location}
          </p>
          <Link
            href={resumeEducation.href}
            className="text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
          >
            View full transcript →
          </Link>
        </div>
      </Section>

      {/* ── Projects ── */}
      <Section title="Projects">
        <div className="space-y-4">
          {resumeProjects.map((project) => (
            <article
              key={project.subtitle}
              className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                <h3 className="text-base font-semibold text-[rgb(var(--text-rgb))]">{project.title}</h3>
                <span className="text-[0.7rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] shrink-0">
                  {project.period}
                </span>
              </div>
              <p className="text-xs font-medium text-[rgb(var(--accent-warm-rgb)/0.9)] mb-4">
                {project.subtitle}
              </p>

              {project.blocks.map((block, i) => (
                <div key={block.heading ?? i} className={i > 0 ? 'mt-4' : undefined}>
                  {block.heading && (
                    <p className="text-[0.7rem] font-mono uppercase tracking-widest text-[rgb(var(--text-muted-rgb)/0.75)] mb-2">
                      {block.heading}
                    </p>
                  )}
                  <ul className="space-y-2">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm text-[rgb(var(--text-muted-rgb))] leading-snug"
                      >
                        <span className="text-[rgb(var(--accent-rgb)/0.8)] shrink-0 mt-px">–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
                {project.caseStudyId && (
                  <Link
                    href={`/projects/${project.caseStudyId}/`}
                    className="text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
                  >
                    Read the case study →
                  </Link>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))] transition-colors"
                  >
                    View source ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Footer ── */}
      <div className="pt-6 border-t border-[rgb(var(--text-muted-rgb)/0.12)] flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
        >
          ← Back to portfolio
        </Link>
        <a
          href={resumeFile}
          download
          className="text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))] transition-colors"
        >
          Download as PDF ↓
        </a>
      </div>
    </PageShell>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-mono uppercase tracking-widest text-[rgb(var(--text-muted-rgb)/0.75)] mb-4">
        {title}
      </h2>
      {children}
    </section>
  )
}

function DownloadResume() {
  return (
    <a
      href={resumeFile}
      download
      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all
                 bg-[rgb(var(--accent-rgb)/0.12)] border border-[rgb(var(--accent-rgb)/0.24)]
                 text-[rgb(var(--accent-rgb))]
                 hover:bg-[rgb(var(--accent-rgb)/0.2)] hover:border-[rgb(var(--accent-warm-rgb)/0.4)]"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
      </svg>
      Download PDF
    </a>
  )
}

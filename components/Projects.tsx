import Link from 'next/link'
import {
  featuredProjects,
  cardTitle,
  domainLabels,
  techNames,
} from '@/data/projects'
import type { Project } from '@/data/schemas/project'

export default function Projects() {
  return (
    <section id="projects" className="py-28 md:py-36 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="section-label">Projects</p>
            <h2 className="section-heading">Things I&apos;ve built</h2>
          </div>
          <div className="flex items-center gap-5 shrink-0 self-end md:self-auto">
            <Link
              href="/projects/"
              className="flex items-center gap-1.5 text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))]
                         transition-colors duration-200"
            >
              All case studies
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/mikhailajaj"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--accent-cool-rgb))]
                         transition-colors duration-200"
            >
              More on GitHub
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const title = cardTitle(project)
  const tech = techNames(project).slice(0, 7)
  const repo = project.links?.github
  const demo = project.links?.demo

  return (
    <article className="group relative flex flex-col p-6 rounded-2xl
                        bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]
                        hover:border-[rgb(var(--accent-cool-rgb)/0.26)] hover:bg-[rgb(var(--surface-rgb)/0.48)]
                        transition-all duration-300">

      {/* Whole-card link to the case study; footer links sit above it */}
      <Link
        href={`/projects/${project.id}/`}
        className="absolute inset-0 rounded-2xl"
        aria-label={`${title} — view case study`}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-[0.7rem] font-mono text-[rgb(var(--accent-warm-rgb)/0.8)] tracking-wide uppercase">
          {domainLabels[project.domain]}
        </span>
        <span className="text-[0.7rem] text-[rgb(var(--text-muted-rgb))] font-mono shrink-0">{project.duration}</span>
      </div>

      <h3 className="text-lg font-semibold text-[rgb(var(--text-rgb))] mb-3
                     group-hover:text-[rgb(var(--accent-cool-rgb))] transition-colors duration-200 leading-snug">
        {title}
      </h3>

      <p className="text-[rgb(var(--text-muted-rgb))] text-sm leading-relaxed mb-5 flex-1">
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {tech.map((name) => (
          <span
            key={name}
            className="px-2 py-0.5 text-[0.7rem] rounded-md
                       bg-[rgb(var(--bg-elevated-rgb)/0.42)] border border-[rgb(var(--text-muted-rgb)/0.12)] text-[rgb(var(--text-muted-rgb))]
                       font-medium tracking-wide"
          >
            {name}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
        {repo ? (
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-1.5 text-xs text-[rgb(var(--text-soft-rgb))] hover:text-[rgb(var(--text-rgb))] transition-colors"
          >
            <GithubIcon /> Source
          </a>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted-rgb))] select-none">
            <LockIcon /> Private
          </span>
        )}
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-1.5 text-xs text-[rgb(var(--accent-cool-rgb))]
                       hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
          >
            Live Demo
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        )}
        <span className="flex items-center gap-1.5 text-xs text-[rgb(var(--text-muted-rgb))]
                         group-hover:text-[rgb(var(--accent-cool-rgb))] transition-colors ml-auto select-none">
          Case study
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </article>
  )
}

function GithubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

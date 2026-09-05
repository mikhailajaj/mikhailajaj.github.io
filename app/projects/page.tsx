import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import {
  allProjects,
  cardTitle,
  domainLabels,
  techNames,
} from '@/data/projects'
import type { Project } from '@/data/schemas/project'

export const metadata: Metadata = {
  title: 'Projects · Mikhail Ajaj',
  description:
    'Project case studies — the problem each one solved, the approach taken, and the measurable impact delivered.',
}

export default function ProjectsPage() {
  return (
    <PageShell eyebrow="Project Case Studies">

        <div className="mb-10">
          <p className="section-label">Projects</p>
          <h1 className="section-heading mb-3">Case studies &amp; work</h1>
          <p className="text-[rgb(var(--text-muted-rgb))] max-w-2xl">
            Selected projects — each with the problem it solved, the approach
            taken, and the measurable impact delivered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {allProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

    </PageShell>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const tech = techNames(project).slice(0, 6)

  return (
    <Link
      href={`/projects/${project.id}/`}
      className="group flex flex-col p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]
                 hover:border-[rgb(var(--accent-cool-rgb)/0.3)] hover:bg-[rgb(var(--surface-rgb)/0.48)] transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[0.7rem] font-mono text-[rgb(var(--accent-warm-rgb)/0.8)] tracking-wide uppercase">
          {domainLabels[project.domain]}
        </span>
        {project.duration && (
          <span className="text-[0.7rem] text-[rgb(var(--text-muted-rgb)/0.75)] font-mono shrink-0">{project.duration}</span>
        )}
      </div>

      <h2 className="text-lg font-semibold text-[rgb(var(--text-rgb))] leading-snug mb-2
                     group-hover:text-[rgb(var(--accent-warm-rgb))] transition-colors">
        {cardTitle(project)}
      </h2>

      <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      {project.impact.metrics[0] && (
        <p className="text-xs text-[rgb(var(--accent-ok-rgb)/0.9)] mb-4">
          ▸ {project.impact.metrics[0]}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
        {tech.map((name) => (
          <span
            key={name}
            className="px-2 py-0.5 text-[0.7rem] rounded-md bg-[rgb(var(--bg-elevated-rgb)/0.42)]
                       border border-[rgb(var(--text-muted-rgb)/0.16)] text-[rgb(var(--text-muted-rgb))] font-medium tracking-wide"
          >
            {name}
          </span>
        ))}
      </div>
    </Link>
  )
}

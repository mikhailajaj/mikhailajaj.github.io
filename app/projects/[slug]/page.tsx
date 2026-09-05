import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { notFound } from 'next/navigation'
import {
  allProjects,
  getProjectById,
  domainLabels,
  techNames,
} from '@/data/projects'

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectById(slug)
  if (!project) return {}
  return {
    title: `${project.title} · Mikhail Ajaj`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectById(slug)
  if (!project) notFound()

  const tech = techNames(project)
  const repo = project.links?.github
  const demo = project.links?.demo
  const testimonial = project.impact.testimonial

  const meta = [
    project.duration && { label: 'Timeline', value: project.duration },
    project.role && { label: 'Role', value: project.role },
    project.teamSize && { label: 'Team', value: `${project.teamSize} ${project.teamSize === 1 ? 'person' : 'people'}` },
    project.client && { label: 'Client', value: project.client },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <PageShell
      eyebrow="Case Study"
      backHref="/projects/"
      backLabel="All Projects"
    >

        {/* ── Header ── */}
        <header className="mb-10">
          <p className="section-label">{domainLabels[project.domain]}</p>
          <h1 className="section-heading mb-4">{project.title}</h1>
          <p className="text-[rgb(var(--text-muted-rgb))] max-w-3xl leading-relaxed mb-6">
            {project.description}
          </p>

          {meta.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {meta.map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.12)]">
                  <p className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-sm text-[rgb(var(--text-rgb))] font-medium leading-snug">{value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {demo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[rgb(var(--accent-cool-rgb)/0.15)] border border-[rgb(var(--accent-cool-rgb)/0.25)] text-[rgb(var(--accent-warm-rgb))]
                           text-sm font-semibold hover:bg-[rgb(var(--accent-cool-rgb)/0.25)] hover:border-[rgb(var(--accent-cool-rgb)/0.4)] transition-all"
              >
                Live Demo ↗
              </a>
            )}
            {repo && (
              <a
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[rgb(var(--bg-elevated-rgb)/0.42)] border border-[rgb(var(--text-muted-rgb)/0.2)] text-[rgb(var(--text-soft-rgb))]
                           text-sm font-semibold hover:bg-[rgb(var(--surface-rgb)/0.62)] hover:text-[rgb(var(--text-rgb))] transition-all"
              >
                View Source ↗
              </a>
            )}
          </div>
        </header>

        {/* ── Problem / Solution ── */}
        <section className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
            <p className="text-xs font-mono text-[rgb(var(--accent-alert-rgb)/0.8)] uppercase tracking-widest mb-3">The Problem</p>
            <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed">{project.problem}</p>
          </div>
          <div className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
            <p className="text-xs font-mono text-[rgb(var(--accent-ok-rgb)/0.8)] uppercase tracking-widest mb-3">The Solution</p>
            <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed">{project.solution}</p>
          </div>
        </section>

        {/* ── Impact ── */}
        <section className="mb-10 p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
          <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-4">Impact</p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-4">
            {project.impact.metrics.map((m) => (
              <li key={m} className="flex gap-2.5 text-sm text-[rgb(var(--text-soft-rgb))] leading-snug">
                <span className="text-[rgb(var(--accent-ok-rgb))] shrink-0 mt-px">▸</span>
                {m}
              </li>
            ))}
          </ul>
          {(project.impact.roi || project.impact.businessValue) && (
            <div className="pt-4 border-t border-[rgb(var(--text-muted-rgb)/0.12)] space-y-1.5">
              {project.impact.roi && (
                <p className="text-sm text-[rgb(var(--accent-warm-rgb))]/90">
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[rgb(var(--text-muted-rgb)/0.75)] mr-2">ROI</span>
                  {project.impact.roi}
                </p>
              )}
              {project.impact.businessValue && (
                <p className="text-sm text-[rgb(var(--text-muted-rgb))]">
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[rgb(var(--text-muted-rgb)/0.75)] mr-2">Value</span>
                  {project.impact.businessValue}
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── Screenshots (real assets only) ── */}
        {project.images && project.images.length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-4">Screenshots</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {project.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  className="rounded-xl border border-[rgb(var(--text-muted-rgb)/0.16)] w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Highlights ── */}
        {project.highlights && project.highlights.length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-4">Highlights</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-[rgb(var(--text-muted-rgb))] leading-snug">
                  <span className="text-[rgb(var(--accent-cool-rgb))] shrink-0 mt-px">▸</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Feature groups ── */}
        {project.features && project.features.length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-4">Features</p>
            <div className="grid md:grid-cols-2 gap-4">
              {project.features.map((group) => (
                <div key={group.title} className="p-5 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
                  <h3 className="text-sm font-semibold text-[rgb(var(--text-rgb))] mb-3">{group.title}</h3>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[0.8rem] text-[rgb(var(--text-muted-rgb))] leading-snug">
                        <span className="text-[rgb(var(--text-muted-rgb)/0.5)] shrink-0">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Technical details ── */}
        {project.technicalDetails && (
          <section className="mb-10 p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-4">Technical Details</p>
            {project.technicalDetails.architecture && (
              <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed mb-4">
                <span className="text-[rgb(var(--text-rgb))] font-medium">Architecture: </span>
                {project.technicalDetails.architecture}
              </p>
            )}
            {project.technicalDetails.highlights && (
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                {project.technicalDetails.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-[0.8rem] text-[rgb(var(--text-muted-rgb))] leading-snug">
                    <span className="text-[rgb(var(--text-muted-rgb)/0.5)] shrink-0">·</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {project.technicalDetails.performance && (
              <div className="pt-4 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
                <p className="text-[0.7rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-2">Performance</p>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {project.technicalDetails.performance.map((p) => (
                    <li key={p} className="flex gap-2 text-[0.8rem] text-[rgb(var(--text-muted-rgb))] leading-snug">
                      <span className="text-[rgb(var(--accent-ok-rgb)/0.7)] shrink-0">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* ── Testimonial ── */}
        {testimonial && (
          <section className="mb-10 p-6 rounded-2xl bg-[rgb(var(--accent-cool-rgb)/0.06)] border border-[rgb(var(--accent-cool-rgb)/0.15)]">
            <p className="text-sm text-[rgb(var(--text-soft-rgb))] leading-relaxed italic mb-2">&ldquo;{testimonial.quote}&rdquo;</p>
            <p className="text-xs text-[rgb(var(--text-muted-rgb))] font-mono">
              — {testimonial.author}, {testimonial.position} · {testimonial.company}
            </p>
          </section>
        )}

        {/* ── Tech stack ── */}
        {tech.length > 0 && (
          <section className="mb-10">
            <p className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-4">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {tech.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 text-xs rounded-lg bg-[rgb(var(--bg-elevated-rgb)/0.42)] border border-[rgb(var(--text-muted-rgb)/0.16)]
                             text-[rgb(var(--text-muted-rgb))] font-medium tracking-wide"
                >
                  {name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer nav ── */}
        <div className="pt-6 border-t border-[rgb(var(--text-muted-rgb)/0.12)]">
          <Link
            href="/projects/"
            className="text-sm text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
          >
            ← Back to all projects
          </Link>
        </div>

    </PageShell>
  )
}

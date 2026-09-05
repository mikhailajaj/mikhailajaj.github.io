import type { Metadata } from 'next'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { allProjects, cardTitle } from '@/data/projects'
import type { Domain } from '@/data/schemas/project'

export const metadata: Metadata = {
  title: 'Expertise · Mikhail Ajaj',
  description:
    'Five domains of expertise: full-stack development, cloud engineering, data analytics, UX/UI design, and technical consulting.',
}

interface DomainSection {
  domain: Domain
  title: string
  tagline: string
  description: string
  skills: string[]
}

const domains: DomainSection[] = [
  {
    domain: 'full-stack',
    title: 'Full-Stack Development',
    tagline: 'From database schema to pixel-perfect UI',
    description:
      'End-to-end web and mobile application development — React/Next.js frontends, Node.js APIs, native iOS with SwiftUI, and the data layers underneath. I build products that ship, scale, and stay maintainable.',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Swift / SwiftUI', 'React Native', 'PostgreSQL', 'MongoDB'],
  },
  {
    domain: 'cloud',
    title: 'Cloud Engineering',
    tagline: 'Infrastructure that scales itself',
    description:
      'Designing and operating cloud-native systems on AWS — serverless architectures, Kubernetes orchestration, and Infrastructure as Code. FinOps-certified, so cost efficiency is part of the architecture, not an afterthought.',
    skills: ['AWS', 'Lambda / Serverless', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'CloudWatch', 'FinOps'],
  },
  {
    domain: 'data',
    title: 'Data Analytics',
    tagline: 'Turning raw data into decisions',
    description:
      'Building data pipelines, warehouses, and analytics dashboards that surface the metrics businesses actually act on — from Amazon Redshift warehousing to real-time visualization.',
    skills: ['SQL', 'Python', 'Amazon Redshift', 'ETL Pipelines', 'Data Visualization', 'Business Intelligence'],
  },
  {
    domain: 'ux-ui',
    title: 'UX/UI Design',
    tagline: 'Interfaces people actually enjoy using',
    description:
      'Research-driven product design — user journeys, accessible component systems, and high-fidelity prototypes. I apply HCI principles to reduce cognitive load and design for WCAG accessibility from the start.',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility (WCAG)', 'Interaction Design'],
  },
  {
    domain: 'consulting',
    title: 'Technical Consulting',
    tagline: 'Clarity for hard technical decisions',
    description:
      'Helping teams untangle technical debt, choose architectures, and level up engineering practice — systematic code reviews, migration strategies, and pragmatic roadmaps grounded in business goals.',
    skills: ['Architecture Review', 'Code Audits', 'Technical Strategy', 'Team Mentoring', 'Agile Delivery'],
  },
]

export default function ExpertisePage() {
  return (
    <PageShell eyebrow="Expertise">

        <div className="mb-12">
          <p className="section-label">Expertise</p>
          <h1 className="section-heading mb-3">Five domains, one engineer</h1>
          <p className="text-[rgb(var(--text-muted-rgb))] max-w-2xl">
            Specialized depth across the full product lifecycle — grounded in
            hands-on project work, coursework, and certifications.
          </p>
        </div>

        <div className="space-y-12">
          {domains.map((section, i) => (
            <DomainBlock key={section.domain} section={section} index={i} />
          ))}
        </div>

    </PageShell>
  )
}

function DomainBlock({ section, index }: { section: DomainSection; index: number }) {
  const caseStudies = allProjects.filter((p) => p.domain === section.domain)

  return (
    <section className="rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)] overflow-hidden">

      <div className="p-6 md:p-8">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs font-mono text-[rgb(var(--text-muted-rgb)/0.5)]">0{index + 1}</span>
          <h2 className="text-xl font-bold text-[rgb(var(--text-rgb))]">{section.title}</h2>
        </div>
        <p className="text-sm font-mono text-[rgb(var(--accent-warm-rgb))]/70 tracking-wide mb-4 ml-8">
          {section.tagline}
        </p>
        <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed max-w-3xl mb-5 ml-8">
          {section.description}
        </p>

        <div className="flex flex-wrap gap-1.5 ml-8">
          {section.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs rounded-lg bg-[rgb(var(--bg-elevated-rgb)/0.42)] border border-[rgb(var(--text-muted-rgb)/0.16)]
                         text-[rgb(var(--text-muted-rgb))] font-medium tracking-wide"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {caseStudies.length > 0 && (
        <div className="border-t border-[rgb(var(--text-muted-rgb)/0.12)] bg-[rgb(var(--surface-rgb)/0.16)] px-6 md:px-8 py-5">
          <p className="text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)] uppercase tracking-widest mb-3">
            Case Studies
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {caseStudies.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}/`}
                className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                           bg-[rgb(var(--surface-rgb)/0.24)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                           hover:border-[rgb(var(--accent-cool-rgb)/0.3)] hover:bg-[rgb(var(--surface-rgb)/0.48)] transition-all"
              >
                <div className="min-w-0">
                  <p className="text-sm text-[rgb(var(--text-soft-rgb))] font-medium leading-snug truncate
                                group-hover:text-[rgb(var(--accent-warm-rgb))] transition-colors">
                    {cardTitle(p)}
                  </p>
                  {p.impact.metrics[0] && (
                    <p className="text-xs text-[rgb(var(--text-muted-rgb)/0.75)] truncate mt-0.5">{p.impact.metrics[0]}</p>
                  )}
                </div>
                <span className="flex items-center gap-1.5 shrink-0 text-[0.65rem] font-mono text-[rgb(var(--text-muted-rgb)/0.75)]">
                  {p.duration}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                       className="text-[rgb(var(--text-muted-rgb)/0.75)] group-hover:text-[rgb(var(--accent-cool-rgb))] transition-colors">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

    </section>
  )
}

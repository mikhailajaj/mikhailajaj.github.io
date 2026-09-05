interface ExperienceCard {
  title: string
  company: string
  period?: string
  description: string
  icon: string
}

const experience: ExperienceCard[] = [
  {
    title: 'Data Analyst',
    company: 'Tandia',
    period: 'From Aug 2026',
    description:
      'Joining Tandia full-time as a Data Analyst after graduation, following a successful co-op term.',
    icon: '/exp1.svg',
  },
  {
    title: 'Co-op Student',
    company: 'Tandia',
    period: 'May 2026 — Aug 2026',
    description:
      'Second co-op term of the Honours BCS program. The placement led to a full-time Data Analyst offer.',
    icon: '/exp2.svg',
  },
  {
    title: 'Software Developer Intern',
    company: 'Linkify',
    period: 'Jan 2026 — Apr 2026',
    description:
      'First co-op term. Built and shipped features for Linkify apps as a software developer.',
    icon: '/exp3.svg',
  },
  {
    title: 'Freelance App Development',
    company: 'Independent',
    description:
      'Delivered end-to-end client projects, covering both frontend and backend development through to deployment.',
    icon: '/exp4.svg',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-28 md:py-36 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <p className="section-label">Experience</p>
          <h2 className="section-heading">Where I&apos;ve worked</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {experience.map((item) => (
            <article
              key={`${item.title}-${item.company}`}
              className="group flex items-start gap-5 p-6 rounded-2xl
                         bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.14)]
                         hover:border-[rgb(var(--accent-rgb)/0.26)] hover:bg-[rgb(var(--surface-rgb)/0.48)]
                         transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.icon}
                alt=""
                aria-hidden="true"
                width={56}
                height={56}
                className="w-14 h-14 shrink-0 mt-1"
              />
              <div>
                <h3 className="text-base font-semibold text-[rgb(var(--text-rgb))]
                               group-hover:text-[rgb(var(--accent-cool-rgb))] transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-xs text-[rgb(var(--text-muted-rgb))] font-medium mb-1.5">
                  {item.company}
                  {item.period && (
                    <span className="text-[rgb(var(--text-muted-rgb)/0.7)]"> · {item.period}</span>
                  )}
                </p>
                <p className="text-sm text-[rgb(var(--text-muted-rgb))] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

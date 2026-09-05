import { certifications } from '@/data/certifications'
import { domainLabels } from '@/data/projects'
import { timelineData } from '@/data/timeline'
import { computeStats, displayTerms } from '@/data/transcript'

/* Every figure is derived from the data files rather than typed by hand, so a
   stat can never drift away from what the rest of the site says. */
const earnedCertifications = certifications.filter((c) => c.status === 'earned').length
const roles = timelineData.items.filter((i) => i.type === 'work').length
const { completedCourses } = computeStats(displayTerms)

const stats = [
  { value: String(roles),              label: 'Roles'          },
  { value: String(Object.keys(domainLabels).length), label: 'Domains' },
  { value: String(completedCourses),   label: 'Courses Done'   },
  {
    value: String(earnedCertifications),
    label: earnedCertifications === 1 ? 'Certification' : 'Certifications',
  },
]

export default function About() {
  return (
    <section id="about" className="section-alt py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Text */}
          <div>
            <p className="section-label">About</p>
            <h2 className="section-heading mb-6">
              Turning complexity into{' '}
              <span className="bg-gradient-to-r from-[rgb(var(--accent-rgb))] to-[rgb(var(--accent-cool-rgb))] bg-clip-text text-transparent">
                elegant solutions
              </span>
            </h2>

            <div className="space-y-4 text-[rgb(var(--text-muted-rgb))] leading-relaxed">
              <p>
                I&apos;m a full-stack developer with a passion for turning complex challenges into
                elegant, scalable solutions. My journey in technology is driven by a fascination
                for how systems work and a commitment to building products that make a real difference.
              </p>
              <p>
                I specialize in full-stack development, cloud architecture, data analytics, and
                UX/UI design — constantly learning and growing to deliver exceptional results.
                I believe in writing clean, maintainable code and fostering collaborative teams.
              </p>
              <p>
                Based in <span className="text-[rgb(var(--text-soft-rgb))] font-medium">Toronto, Canada</span>
                {' '}— open to remote and hybrid opportunities worldwide.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-8">
              <a
                href="https://github.com/mikhailajaj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))]
                           border border-[rgb(var(--text-muted-rgb)/0.16)] hover:border-[rgb(var(--accent-cool-rgb)/0.28)]
                           px-4 py-2 rounded-lg transition-all duration-200
                           bg-[rgb(var(--surface-rgb)/0.34)] hover:bg-[rgb(var(--surface-rgb)/0.54)]"
              >
                GitHub <Arrow />
              </a>
              <a
                href="https://www.linkedin.com/in/mikhail-ajaj/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--text-rgb))]
                           border border-[rgb(var(--text-muted-rgb)/0.16)] hover:border-[rgb(var(--accent-cool-rgb)/0.28)]
                           px-4 py-2 rounded-lg transition-all duration-200
                           bg-[rgb(var(--surface-rgb)/0.34)] hover:bg-[rgb(var(--surface-rgb)/0.54)]"
              >
                LinkedIn <Arrow />
              </a>
              <a
                href="mailto:mikhailajaj@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-[rgb(var(--accent-rgb))] hover:text-[rgb(var(--accent-warm-rgb))]
                           border border-[rgb(var(--accent-rgb)/0.2)] hover:border-[rgb(var(--accent-warm-rgb)/0.3)]
                           px-4 py-2 rounded-lg transition-all duration-200
                           bg-[rgb(var(--accent-rgb)/0.06)] hover:bg-[rgb(var(--accent-rgb)/0.1)]"
              >
                Say Hello →
              </a>
            </div>
          </div>

          {/* Stats — no emojis, numbers carry themselves */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                           hover:border-[rgb(var(--accent-cool-rgb)/0.24)] hover:bg-[rgb(var(--surface-rgb)/0.5)]
                           transition-all duration-300 group"
              >
                <p className="text-[2.25rem] font-bold tracking-tight text-[rgb(var(--text-rgb))]
                              transition-colors leading-none mb-2">
                  {value}
                </p>
                <p className="text-xs text-[rgb(var(--text-muted-rgb))] uppercase tracking-widest font-medium
                              group-hover:text-[rgb(var(--text-soft-rgb))] transition-colors">
                  {label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17L17 7M7 7h10v10" />
    </svg>
  )
}

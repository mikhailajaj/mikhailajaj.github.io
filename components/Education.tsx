interface Degree {
  degree: string
  field: string
  school: string
  location: string
  period: string
  status: 'completed' | 'in-progress'
  highlights?: string[]
}

import { certifications } from '@/data/certifications'

const education: Degree[] = [
  {
    degree: 'Honours Bachelor of Computer Science',
    field: 'Mobile Computing',
    school: 'Sheridan College',
    location: 'Oakville, ON, Canada',
    period: '2017 – 2026',
    status: 'completed',
    highlights: [
      'Specialization in Mobile Computing',
      'Focus on full-stack development and cloud architecture',
      'Capstone: PulseShare — blood donation management platform',
    ],
  },
  {
    degree: 'Ontario Secondary School Diploma',
    field: '',
    school: 'Port Credit Secondary School',
    location: 'Mississauga, ON, Canada',
    period: '2017',
    status: 'completed',
  },
]

export default function Education() {
  return (
    <section id="education" className="py-28 md:py-36 section-alt">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="section-label">Education</p>
            <h2 className="section-heading mt-1">Academic background</h2>
          </div>
          <a
            href="/education/"
            className="flex items-center gap-1.5 text-sm text-[rgb(var(--text-muted-rgb))] hover:text-[rgb(var(--accent-cool-rgb))]
                       transition-colors duration-200 shrink-0 self-start sm:self-auto"
          >
            View Full Transcript
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Degrees */}
          <div>
            <p className="text-[0.7rem] font-mono text-[rgb(var(--text-muted-rgb))] uppercase tracking-[0.2em] mb-5">
              Degrees
            </p>
            <div className="space-y-4">
              {education.map((edu) => (
                <div
                  key={edu.school}
                  className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                             hover:border-[rgb(var(--accent-rgb)/0.26)] hover:bg-[rgb(var(--surface-rgb)/0.52)]
                             transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-[rgb(var(--text-rgb))] font-semibold text-sm leading-snug">
                        {edu.degree}
                        {edu.field && (
                          <span className="text-[rgb(var(--accent-cool-rgb)/0.85)]"> · {edu.field}</span>
                        )}
                      </h4>
                      <p className="text-[rgb(var(--text-soft-rgb))] text-sm mt-1">{edu.school}</p>
                      <p className="text-[rgb(var(--text-muted-rgb))] text-xs mt-0.5">{edu.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs text-[rgb(var(--text-muted-rgb))] font-mono">{edu.period}</span>
                      {edu.status === 'in-progress' ? (
                        <span className="flex items-center gap-1.5 text-[0.65rem] font-medium
                                         text-[rgb(var(--accent-warm-rgb))] bg-[rgb(var(--accent-warm-rgb)/0.1)] border border-[rgb(var(--accent-warm-rgb)/0.22)]
                                         px-2 py-0.5 rounded-full tracking-wide uppercase">
                          <span className="w-1 h-1 bg-[rgb(var(--accent-warm-rgb))] rounded-full animate-pulse" />
                          In Progress
                        </span>
                      ) : (
                        <span className="text-[0.65rem] font-medium text-[rgb(var(--text-muted-rgb))]
                                         bg-[rgb(var(--bg-elevated-rgb)/0.55)] border border-[rgb(var(--text-muted-rgb)/0.14)]
                                         px-2 py-0.5 rounded-full tracking-wide uppercase">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {edu.highlights && (
                    <ul className="mt-3 pt-3 border-t border-[rgb(var(--text-muted-rgb)/0.12)] space-y-1.5">
                      {edu.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-[rgb(var(--text-muted-rgb))]">
                          <span className="text-[rgb(var(--accent-rgb)/0.8)] mt-0.5 shrink-0">▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <p className="text-[0.7rem] font-mono text-[rgb(var(--text-muted-rgb))] uppercase tracking-[0.2em] mb-5">
              Certifications
            </p>
            <div className="space-y-2.5">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between gap-4 px-5 py-4
                             rounded-xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                             hover:border-[rgb(var(--accent-cool-rgb)/0.24)] transition-all duration-200"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-[rgb(var(--text-rgb))] font-medium leading-snug truncate">
                      {cert.title}
                    </p>
                    <p className="text-xs text-[rgb(var(--text-muted-rgb))] mt-0.5">{cert.provider}</p>
                    {cert.status === 'earned' && (cert.verifyUrl || cert.certificatePdfUrl) && (
                      <div className="flex items-center gap-3 mt-1.5">
                        {cert.verifyUrl && (
                          <a
                            href={cert.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[0.7rem] text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
                          >
                            Verify ↗
                          </a>
                        )}
                        {cert.certificatePdfUrl && (
                          <a
                            href={cert.certificatePdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[0.7rem] text-[rgb(var(--accent-cool-rgb))] hover:text-[rgb(var(--accent-warm-rgb))] transition-colors"
                          >
                            Certificate PDF ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {cert.status === 'earned' ? (
                    <span className="flex items-center gap-1.5 shrink-0
                                     text-[0.65rem] font-semibold tracking-wide uppercase
                                     text-[rgb(var(--accent-cool-rgb))] bg-[rgb(var(--accent-cool-rgb)/0.12)] border border-[rgb(var(--accent-cool-rgb)/0.24)]
                                     px-2.5 py-1 rounded-full">
                      <CheckIcon /> Earned
                    </span>
                  ) : (
                    <span className="shrink-0 text-[0.65rem] font-medium tracking-wide uppercase
                                     text-[rgb(var(--text-muted-rgb))] bg-[rgb(var(--bg-elevated-rgb)/0.55)] border border-[rgb(var(--text-muted-rgb)/0.14)]
                                     px-2.5 py-1 rounded-full">
                      {cert.status === 'in-progress' ? 'In Progress' : 'Pursuing'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

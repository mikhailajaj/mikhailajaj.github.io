interface SkillGroup {
  category: string
  skills: string[]
}

const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vue', 'React Native', 'HTML5 / CSS3'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'NestJS', 'Python', 'Django', 'Java', '.NET', 'REST / GraphQL'],
  },
  {
    category: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Cloudflare', 'CI/CD'],
  },
  {
    category: 'Data & Databases',
    skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Amazon Redshift', 'TensorFlow', 'Apache Kafka'],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="section-alt py-28 md:py-36">
      <div className="max-w-6xl mx-auto px-6">

        <p className="section-label">Skills</p>
        <h2 className="section-heading mb-12">Tools of the trade</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {skillGroups.map(({ category, skills }) => (
            <div
              key={category}
              className="p-6 rounded-2xl bg-[rgb(var(--surface-rgb)/0.34)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                         hover:border-[rgb(var(--text-muted-rgb)/0.18)] transition-all duration-300"
            >
              <h3 className="text-xs font-mono font-semibold text-[rgb(var(--text-muted-rgb))]
                             uppercase tracking-[0.18em] mb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm rounded-lg font-medium
                               bg-[rgb(var(--bg-elevated-rgb)/0.46)] border border-[rgb(var(--text-muted-rgb)/0.12)]
                               text-[rgb(var(--text-soft-rgb))]
                               hover:bg-[rgb(var(--accent-cool-rgb)/0.1)] hover:border-[rgb(var(--accent-cool-rgb)/0.22)]
                               hover:text-[rgb(var(--text-rgb))] transition-all duration-150 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[rgb(var(--text-muted-rgb))] text-xs font-mono tracking-wider mt-10 uppercase">
          Always learning · Web3 · AI/ML · Edge Computing
        </p>

      </div>
    </section>
  )
}

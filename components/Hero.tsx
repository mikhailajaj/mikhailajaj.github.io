export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg)]">
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dots" />

      {/* Atmosphere — visible orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[rgb(var(--accent-rgb)/0.12)] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 -left-32 w-[500px] h-[500px] bg-[rgb(var(--accent-deep-rgb)/0.18)] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 -right-32 w-[400px] h-[400px] bg-[rgb(var(--accent-cool-rgb)/0.14)] rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">

        {/* Availability badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full
                        bg-[rgb(var(--surface-rgb)/0.38)] border border-[rgb(var(--accent-cool-rgb)/0.18)] text-[rgb(var(--text-soft-rgb))]
                        text-xs font-medium tracking-wide mb-10">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[rgb(var(--accent-cool-rgb))] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[rgb(var(--accent-cool-rgb))]" />
          </span>
          Available for opportunities
        </div>

        {/* Name */}
        <h1 className="hero-name mb-5">
          <span className="text-[rgb(var(--text-rgb))]">Mikhail </span>
          <span className="bg-gradient-to-br from-[rgb(var(--accent-warm-rgb))] via-[rgb(var(--accent-rgb))] to-[rgb(var(--accent-rgb))] bg-clip-text text-transparent">
            Ajaj
          </span>
        </h1>

        {/* Role */}
        <p className="text-xl text-[rgb(var(--text-soft-rgb))] font-normal tracking-wide mb-5">
          Full-Stack Developer
        </p>

        {/* Tagline */}
        <p className="max-w-md mx-auto text-[rgb(var(--text-muted-rgb))] leading-relaxed mb-12">
          Building scalable, user-centric solutions that drive real business impact.
          Based in Toronto — working globally.
        </p>

        {/* CTAs — 2 only */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#projects"
            className="px-7 py-3 rounded-xl bg-[rgb(var(--accent-rgb))] hover:bg-[rgb(var(--accent-warm-rgb))]
                       text-[rgb(var(--bg-rgb))] text-sm font-semibold tracking-wide
                       transition-all duration-200 shadow-lg shadow-[rgb(var(--accent-rgb)/0.16)]
                       hover:shadow-2xl hover:shadow-[rgb(var(--accent-rgb)/0.25)] hover:-translate-y-px"
          >
            View Projects
          </a>
          <a
            href="mailto:mikhailajaj@gmail.com"
            className="px-7 py-3 rounded-xl
                       bg-[rgb(var(--surface-rgb)/0.36)] hover:bg-[rgb(var(--surface-rgb)/0.58)]
                       text-[rgb(var(--text-soft-rgb))] hover:text-[rgb(var(--text-rgb))]
                       text-sm font-semibold tracking-wide
                       border border-[rgb(var(--text-muted-rgb)/0.16)] hover:border-[rgb(var(--accent-cool-rgb)/0.3)]
                       transition-all duration-200 hover:-translate-y-px"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />
    </section>
  )
}

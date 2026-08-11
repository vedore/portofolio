function HeroTitleCard({
  chamberTheme,
  cvHref,
  githubHref,
  linkedInHref,
  isMobile,
  onNavigateToSection,
  onToggleTheme,
}) {
  return (
    <section
      className="relative isolate w-full max-w-5xl overflow-y-auto rounded-[1.75rem] border border-white/20 bg-[#020806]/90 shadow-[0_24px_80px_rgba(2,8,6,0.38)] sm:rounded-[2.5rem]"
      data-testid="hero-title-card"
      aria-labelledby="portfolio-title"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-card-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7fffd4" stopOpacity="0.5" />
            <stop offset="0.45" stopColor="#1e8d71" stopOpacity="0.06" />
            <stop offset="1" stopColor="#7fffd4" stopOpacity="0.3" />
          </linearGradient>
          <mask id="hero-card-wordmark-mask">
            <rect width="1200" height="720" fill="white" />
            <text
              x="600"
              y="285"
              textAnchor="middle"
              fill="black"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="230"
              fontWeight="900"
              letterSpacing="-12"
            >
              JOÃO
            </text>
            <text
              x="600"
              y="500"
              textAnchor="middle"
              fill="black"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="230"
              fontWeight="900"
              letterSpacing="-12"
            >
              VEDOR
            </text>
          </mask>
        </defs>
        <rect width="1200" height="720" fill="#020806" mask="url(#hero-card-wordmark-mask)" />
        <rect x="18" y="18" width="1164" height="684" rx="34" fill="none" stroke="url(#hero-card-edge)" strokeWidth="2" />
        <path d="M52 64H250M950 656H1148" stroke="#a7f3d0" strokeOpacity="0.38" strokeWidth="2" />
        <circle cx="116" cy="64" r="4" fill="#a7f3d0" fillOpacity="0.8" />
        <circle cx="1084" cy="656" r="4" fill="#a7f3d0" fillOpacity="0.8" />
      </svg>

      <div className="relative z-10 flex min-h-[31rem] flex-col justify-end px-5 py-5 sm:min-h-[34rem] sm:px-9 sm:py-8 lg:px-12 lg:py-10">
        <div className="sr-only">
          <h1 id="portfolio-title">João Vedor, Bioinformatics and Biomedical NLP Developer</h1>
          <p>I build software, data systems, and biomedical NLP tooling.</p>
        </div>

        <div className="max-w-2xl border-t border-white/20 pt-4 sm:pt-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-200 sm:text-xs">
            Bioinformatics / Biomedical NLP / Software Systems
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
            I build software, data systems, and biomedical NLP tooling that turn complex
            information into useful, maintainable products.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2.5" aria-label="Portfolio actions">
          <button
            type="button"
            onClick={() => onNavigateToSection('projects')}
            className="rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-bold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            View selected work
          </button>
          {cvHref ? (
            <a
              href={cvHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              Download CV <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {githubHref ? (
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/35 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              GitHub <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/20 pt-4">
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-emerald-100" aria-label="Portfolio sections">
            <button type="button" onClick={() => onNavigateToSection('about')} className="underline decoration-emerald-100/30 underline-offset-4 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">
              About
            </button>
            <button type="button" onClick={() => onNavigateToSection('projects')} className="underline decoration-emerald-100/30 underline-offset-4 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">
              Projects
            </button>
            <button type="button" onClick={() => onNavigateToSection('skills')} className="underline decoration-emerald-100/30 underline-offset-4 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">
              Skills
            </button>
            <button type="button" onClick={() => onNavigateToSection('contact')} className="underline decoration-emerald-100/30 underline-offset-4 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200">
              Contact
            </button>
            {linkedInHref ? (
              <a
                href={linkedInHref}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-emerald-100/30 underline-offset-4 transition hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </nav>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to the ${chamberTheme === 'warm' ? 'cool' : 'warm'} scene`}
            aria-pressed={chamberTheme === 'warm'}
            className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100 transition hover:border-emerald-200 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Scene: {chamberTheme === 'warm' ? 'Warm' : 'Cool'}
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          {isMobile
            ? 'Swipe up to enter the microscope, then use the arrows to browse.'
            : 'Scroll to enter the microscope, or use the arrow keys to navigate.'}
        </p>
      </div>
    </section>
  );
}

export default HeroTitleCard;

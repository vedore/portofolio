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
      className="relative flex min-h-[var(--app-height)] w-full flex-col overflow-hidden bg-black text-white"
      data-testid="hero-title-card"
      aria-labelledby="portfolio-title"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask id="hero-title-cutout">
            <rect width="1600" height="900" fill="white" />
            <text
              x="800"
              y="610"
              textAnchor="middle"
              textLength="1460"
              lengthAdjust="spacingAndGlyphs"
              fill="black"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="610"
              fontWeight="900"
            >
              JOÃO VEDOR
            </text>
          </mask>
        </defs>
        <rect width="1600" height="900" fill="black" mask="url(#hero-title-cutout)" />
        <text
          x="800"
          y="610"
          textAnchor="middle"
          textLength="1460"
          lengthAdjust="spacingAndGlyphs"
          fill="transparent"
          stroke="white"
          strokeOpacity="0.45"
          strokeWidth="3"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="610"
          fontWeight="900"
        >
          JOÃO VEDOR
        </text>
      </svg>

      <div className="relative z-10 flex min-h-[var(--app-height)] flex-col px-5 sm:px-8 lg:px-12">
        <header className="grid grid-cols-[1fr_auto] items-center gap-4 pt-5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white sm:pt-6 sm:text-xs">
          <span>João Vedor / Portfolio</span>
          <span>2026</span>
        </header>

        <p className="mt-[7vh] text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-xs">
          Selected work / 01—04
        </p>

        <div className="flex-1" aria-hidden="true" />

        <h1 id="portfolio-title" className="sr-only">
          João Vedor, Bioinformatics and Biomedical NLP Developer
        </h1>

        <div className="border-y border-white/35">
          <div className="grid gap-4 py-3 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/80 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:text-xs">
            <span>Portfolio navigation</span>
            <span className="hidden sm:block">Scroll to enter</span>
            <span className="text-left sm:text-right">Lisbon, Portugal</span>
          </div>

          <div className="grid gap-5 border-t border-white/35 py-5 sm:py-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)_minmax(0,0.85fr)] lg:items-center lg:gap-8">
            <p className="max-w-sm text-sm leading-6 text-white/85">
              I build software, data systems, and biomedical NLP tooling that turn complex
              information into useful, maintainable products.
            </p>

            <nav
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-semibold text-white sm:gap-x-7"
              aria-label="Portfolio shortcuts"
            >
              <button
                type="button"
                onClick={() => onNavigateToSection('about')}
                className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => onNavigateToSection('projects')}
                className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => onNavigateToSection('skills')}
                className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Skills
              </button>
              <button
                type="button"
                onClick={() => onNavigateToSection('contact')}
                className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Contact
              </button>
              {cvHref ? (
                <a
                  href={cvHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  CV <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {githubHref ? (
                <a
                  href={githubHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {linkedInHref ? (
                <a
                  href={linkedInHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </nav>

            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <p className="text-xs leading-5 text-white/75">
                {isMobile ? 'Swipe up to explore.' : 'Use scroll or arrow keys.'}
              </p>
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={`Switch to the ${chamberTheme === 'warm' ? 'cool' : 'warm'} scene`}
                aria-pressed={chamberTheme === 'warm'}
                className="shrink-0 border border-white/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {chamberTheme === 'warm' ? 'Warm' : 'Cool'}
              </button>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-4 py-4 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white/65 sm:py-5 sm:text-[0.65rem]">
          <span>Software / Data / Research</span>
          <span>© João Vedor</span>
        </footer>
      </div>
    </section>
  );
}

export default HeroTitleCard;
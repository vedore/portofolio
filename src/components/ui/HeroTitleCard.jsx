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
      className="relative flex min-h-[var(--app-height)] w-full flex-col overflow-hidden text-white"
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
              y="875"
              textAnchor="middle"
              textLength="1540"
              lengthAdjust="spacingAndGlyphs"
              fill="black"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="1120"
              fontWeight="900"
            >
              JOÃO VEDOR
            </text>
          </mask>
        </defs>
        <rect width="1600" height="900" fill="black" fillOpacity="0.94" mask="url(#hero-title-cutout)" />
        <text
          x="800"
          y="875"
          textAnchor="middle"
          textLength="1540"
          lengthAdjust="spacingAndGlyphs"
          fill="transparent"
          stroke="white"
          strokeOpacity="0.58"
          strokeWidth="3"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="1120"
          fontWeight="900"
        >
          JOÃO VEDOR
        </text>
      </svg>

      <div className="relative z-10 flex min-h-[var(--app-height)] flex-col justify-between px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-12 lg:pt-10">
        <div className="flex items-center justify-between gap-4 bg-black/75 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white sm:text-xs">
          <span>João Vedor / Portfolio</span>
          <span>01 / 01</span>
        </div>

        <div className="max-w-xl bg-black/80 p-4 backdrop-blur-sm sm:p-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white sm:text-xs">
            Bioinformatics / Biomedical NLP / Software Systems
          </p>
          <h1 id="portfolio-title" className="sr-only">
            João Vedor, Bioinformatics and Biomedical NLP Developer
          </h1>
          <p className="mt-3 text-sm leading-6 text-white sm:text-base sm:leading-7">
            I build software, data systems, and biomedical NLP tooling that turn complex
            information into useful, maintainable products.
          </p>
        </div>

        <div className="max-w-3xl border border-white/45 bg-black/85 p-4 text-white backdrop-blur-sm sm:p-5">
          <div className="flex flex-wrap gap-2.5" aria-label="Portfolio actions">
            <button
              type="button"
              onClick={() => onNavigateToSection('projects')}
              className="border border-white bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View selected work
            </button>
            {cvHref ? (
              <a
                href={cvHref}
                target="_blank"
                rel="noreferrer"
                className="border border-white/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Download CV <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {githubHref ? (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                className="border border-white/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/30 pt-4">
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-white" aria-label="Portfolio sections">
              <button type="button" onClick={() => onNavigateToSection('about')} className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                About
              </button>
              <button type="button" onClick={() => onNavigateToSection('projects')} className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Projects
              </button>
              <button type="button" onClick={() => onNavigateToSection('skills')} className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Skills
              </button>
              <button type="button" onClick={() => onNavigateToSection('contact')} className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Contact
              </button>
              {linkedInHref ? (
                <a
                  href={linkedInHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/50 underline-offset-4 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
              className="border border-white/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Scene: {chamberTheme === 'warm' ? 'Warm' : 'Cool'}
            </button>
          </div>

          <p className="mt-4 text-xs leading-5 text-white">
            {isMobile
              ? 'Swipe up to enter the microscope, then use the arrows to browse.'
              : 'Scroll to enter the microscope, or use the arrow keys to navigate.'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroTitleCard;

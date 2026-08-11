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
      <div className="pointer-events-none absolute inset-0 border border-white/15" aria-hidden="true" />
      <div className="pointer-events-none absolute left-0 top-1/2 h-px w-full bg-white/15" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[var(--app-height)] flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
        <div className="flex items-center justify-between gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/55 sm:text-xs">
          <span>João Vedor / Portfolio</span>
          <span>01 / 01</span>
        </div>

        <div className="py-8 sm:py-12">
          <p className="mb-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/55 sm:text-xs">
            Bioinformatics / Biomedical NLP / Software Systems
          </p>
          <h1
            id="portfolio-title"
            className="whitespace-nowrap font-black leading-[0.82] tracking-[-0.085em] text-white/75 [font-family:Arial_Black,Impact,sans-serif] text-[clamp(3rem,11.5vw,11rem)]"
          >
            JOÃO VEDOR
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
            I build software, data systems, and biomedical NLP tooling that turn complex
            information into useful, maintainable products.
          </p>
        </div>

        <div className="border-t border-white/20 pt-4 sm:pt-5">
          <div className="flex flex-wrap gap-2.5" aria-label="Portfolio actions">
            <button
              type="button"
              onClick={() => onNavigateToSection('projects')}
              className="rounded-none border border-white bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View selected work
            </button>
            {cvHref ? (
              <a
                href={cvHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-none border border-white/45 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Download CV <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {githubHref ? (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-none border border-white/45 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-white/15 pt-4">
            <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-white/80" aria-label="Portfolio sections">
              <button type="button" onClick={() => onNavigateToSection('about')} className="underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                About
              </button>
              <button type="button" onClick={() => onNavigateToSection('projects')} className="underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Projects
              </button>
              <button type="button" onClick={() => onNavigateToSection('skills')} className="underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Skills
              </button>
              <button type="button" onClick={() => onNavigateToSection('contact')} className="underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Contact
              </button>
              {linkedInHref ? (
                <a
                  href={linkedInHref}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/30 underline-offset-4 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
              className="rounded-none border border-white/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Scene: {chamberTheme === 'warm' ? 'Warm' : 'Cool'}
            </button>
          </div>

          <p className="mt-3 text-xs leading-5 text-white/50">
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

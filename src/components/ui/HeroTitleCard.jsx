import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

function useSceneLoaded() {
  const { active, progress } = useProgress();
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);

  useEffect(() => {
    if (active) {
      setIsSceneLoaded(false);
      return;
    }

    if (progress >= 100) {
      setIsSceneLoaded(true);
    }
  }, [active, progress]);

  return isSceneLoaded;
}

function HeroTitleCard({
  chamberTheme,
  cvHref,
  githubHref,
  hasStartedNavigating,
  linkedInHref,
  isMobile,
  onNavigateToSection,
  onToggleTheme,
}) {
  const isSceneLoaded = useSceneLoaded();
  const showShortcuts = isSceneLoaded && hasStartedNavigating;

  return (
    <section
      className="relative flex min-h-[var(--app-height)] w-full flex-col overflow-hidden bg-black text-white"
      data-testid="hero-title-card"
      aria-busy={!isSceneLoaded}
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
              y="650"
              textAnchor="middle"
              textLength="1480"
              lengthAdjust="spacingAndGlyphs"
              fill="black"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="720"
              fontWeight="900"
            >
              JOÃO VEDOR
            </text>
          </mask>
        </defs>
        <rect width="1600" height="900" fill="black" mask="url(#hero-title-cutout)" />
        <text
          x="800"
          y="650"
          textAnchor="middle"
          textLength="1480"
          lengthAdjust="spacingAndGlyphs"
          fill="transparent"
          stroke="white"
          strokeOpacity="0.38"
          strokeWidth="3"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="720"
          fontWeight="900"
        >
          JOÃO VEDOR
        </text>
      </svg>

      <div className="relative z-10 flex min-h-[var(--app-height)] flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/35 bg-black px-5 py-4 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white sm:px-8 sm:text-xs lg:px-12">
          <span>João Vedor / Portfolio</span>
          <span>01 / 01</span>
        </header>

        <div className="flex-1" aria-hidden="true" />

        <h1 id="portfolio-title" className="sr-only">
          João Vedor, Bioinformatics and Biomedical NLP Developer
        </h1>

        {showShortcuts ? (
          <footer className="border-t border-white/35 bg-black px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
            <div className="mx-auto grid max-w-[96rem] gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)_minmax(0,0.8fr)] lg:items-center lg:gap-8">
              <p className="max-w-md text-sm leading-6 text-white/85 lg:text-left">
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
                  {isMobile
                    ? 'Swipe up to enter the microscope.'
                    : 'Scroll to enter the microscope.'}
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
          </footer>
        ) : null}
      </div>

      <p className="sr-only" aria-live="polite">
        {isSceneLoaded ? 'Portfolio scene ready.' : 'Loading portfolio scene.'}
      </p>
    </section>
  );
}

export default HeroTitleCard;
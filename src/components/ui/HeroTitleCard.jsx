import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';

const MIN_LOADING_TIME = 1500;

function useSceneReady() {
  const { active, progress } = useProgress();
  const mountedAtRef = useRef(Date.now());
  const [isSceneReady, setIsSceneReady] = useState(false);
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  useEffect(() => {
    if (active) {
      setIsSceneReady(false);
      mountedAtRef.current = Date.now();
      return undefined;
    }

    if (roundedProgress < 100) {
      return undefined;
    }

    const holdFor = Math.max(MIN_LOADING_TIME - (Date.now() - mountedAtRef.current), 0);
    const timeoutId = window.setTimeout(() => {
      setIsSceneReady(true);
    }, holdFor);

    return () => window.clearTimeout(timeoutId);
  }, [active, roundedProgress]);

  return isSceneReady;
}

function HeroTitleCard({
  chamberTheme,
  cvHref,
  githubHref,
  linkedInHref,
  isMobile,
  onNavigateToSection,
  onToggleTheme,
}) {
  const isSceneReady = useSceneReady();

  return (
    <section
      className="relative flex min-h-[var(--app-height)] w-full flex-col overflow-hidden bg-black text-white"
      data-testid="hero-title-card"
      aria-busy={!isSceneReady}
      aria-labelledby="portfolio-title"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full transition-[filter,opacity] duration-1000 ease-out"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          filter: isSceneReady ? 'blur(0)' : 'blur(14px)',
          opacity: isSceneReady ? 1 : 0.82,
        }}
      >
        <defs>
          <mask id="hero-title-cutout">
            <rect width="1600" height="900" fill="white" />
            <text
              x="800"
              y="660"
              textAnchor="middle"
              textLength="1480"
              lengthAdjust="spacingAndGlyphs"
              fill="black"
              fontFamily="Arial Black, Impact, sans-serif"
              fontSize="760"
              fontWeight="900"
            >
              JOÃO VEDOR
            </text>
          </mask>
        </defs>
        <rect width="1600" height="900" fill="black" fillOpacity="0.94" mask="url(#hero-title-cutout)" />
        <text
          x="800"
          y="660"
          textAnchor="middle"
          textLength="1480"
          lengthAdjust="spacingAndGlyphs"
          fill="transparent"
          stroke="white"
          strokeOpacity="0.58"
          strokeWidth="3"
          fontFamily="Arial Black, Impact, sans-serif"
          fontSize="760"
          fontWeight="900"
        >
          JOÃO VEDOR
        </text>
      </svg>

      <h1 id="portfolio-title" className="sr-only">
        João Vedor, Bioinformatics and Biomedical NLP Developer
      </h1>

      <div
        className={`relative z-10 mt-auto w-full border-t border-white/25 bg-black/85 px-5 py-5 backdrop-blur-md transition-[opacity,transform] duration-700 ease-out sm:px-8 lg:px-12 ${
          isSceneReady ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        <nav
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-semibold text-white sm:gap-x-7"
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
            Selected work
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
              Download CV <span aria-hidden="true">↗</span>
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
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to the ${chamberTheme === 'warm' ? 'cool' : 'warm'} scene`}
            aria-pressed={chamberTheme === 'warm'}
            className="border border-white/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Scene: {chamberTheme === 'warm' ? 'Warm' : 'Cool'}
          </button>
        </nav>
      </div>

      <p className="sr-only" aria-live="polite">
        {isSceneReady ? 'Portfolio scene ready.' : 'Loading portfolio scene.'}
      </p>

      {isSceneReady ? (
        <p className="sr-only">
          {isMobile
            ? 'Swipe up to enter the microscope, then use the arrows to browse.'
            : 'Scroll to enter the microscope, or use the arrow keys to navigate.'}
        </p>
      ) : null}
    </section>
  );
}

export default HeroTitleCard;
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Scene from './components/scene/Scene';
import LensTransition from './components/ui/LensTransition';
import ScopeView from './components/ui/ScopeView';
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollMeter from './components/ui/ScrollMeter';
import { Analytics } from '@vercel/analytics/react';
import sections from './data/ScopeViewSections.data.js';
import {
  HERO_ANIMATION_END,
  HERO_ANIMATION_START,
  HERO_SCROLL_HEIGHT,
  SCOPE_ACTIVATION_START,
  SECTION_PAGE_TRANSITION_MS,
} from './config/scopeTiming.js';
import { useScopeProgress } from './hooks/useScopeProgress';
import { useScrollNavigation } from './hooks/useScrollNavigation';
import { useScrollProgress } from './hooks/useScrollProgress';
import { getInteractiveElement } from './utils/dom.js';

const SectionPage = lazy(() => import('./components/ui/SectionPage'));

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';
const aboutSection = sections.find((section) => section.id === 'about');
const contactSection = sections.find((section) => section.id === 'contact');
const linkedInContact = contactSection?.contactMethods?.find((method) => method.label === 'LinkedIn');

function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [chamberTheme, setChamberTheme] = useState('cold');
  const [isSectionPageOpen, setIsSectionPageOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const scrollAnimationRef = useRef(0);
  const scrollContainerRef = useRef(null);

  const { progress, heroProgress, isMobile } = useScrollProgress({
    heroHeightVh: HERO_SCROLL_HEIGHT,
    animationStartVh: HERO_ANIMATION_START,
    animationEndVh: HERO_ANIMATION_END,
    scrollContainerRef,
  });

  const {
    currentPhaseIndex,
    heroCardOpacity,
    meterPosition,
    phaseTargets,
    scopeEndVh,
    scopeProgress,
    scopeStartVh,
  } = useScopeProgress({ heroProgress, sections });

  const {
    navigateToPhase,
    navigateToSpecimen,
    scrollToStart,
    scrubToMeterPosition,
  } = useScrollNavigation({
    animateRef: scrollAnimationRef,
    phaseTargets,
    scopeEndVh,
    scopeStartVh,
    scrollContainerRef,
    sections,
  });

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }

      if (scrollAnimationRef.current) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const setAppViewportSize = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width || window.innerWidth || document.documentElement.clientWidth;
      const height = viewport?.height || window.innerHeight || document.documentElement.clientHeight;

      document.documentElement.style.setProperty('--app-width', `${width}px`);
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    setAppViewportSize();
    const resizeTarget = window.visualViewport ?? window;

    window.addEventListener('resize', setAppViewportSize);
    if (resizeTarget !== window) {
      resizeTarget.addEventListener('resize', setAppViewportSize);
    }

    return () => {
      window.removeEventListener('resize', setAppViewportSize);
      if (resizeTarget !== window) {
        resizeTarget.removeEventListener('resize', setAppViewportSize);
      }
    };
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  const openSectionPage = useCallback((section) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = 0;
    }

    setActiveSection(section);
    window.requestAnimationFrame(() => {
      setIsSectionPageOpen(true);
    });
  }, []);

  const closeSectionPage = useCallback(() => {
    setIsSectionPageOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveSection(null);
      closeTimerRef.current = null;
    }, SECTION_PAGE_TRANSITION_MS);
  }, []);

  const navigateToSection = useCallback((sectionId) => {
    const phaseIndex = phaseTargets.findIndex((phase) => phase.id === sectionId);

    if (phaseIndex >= 0) {
      navigateToPhase(phaseIndex);
    }
  }, [navigateToPhase, phaseTargets]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isSectionPageOpen || getInteractiveElement(event.target)) {
        return;
      }

      if (event.code === 'Space' || event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        navigateToPhase(currentPhaseIndex + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        navigateToPhase(currentPhaseIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPhaseIndex, isSectionPageOpen, navigateToPhase]);

  return (
    <div
      ref={scrollContainerRef}
      className="relative overflow-x-hidden overflow-y-auto bg-slate-50 text-slate-900 overscroll-y-contain"
      style={{ height: 'var(--app-height)' }}
    >
      <Scene
        progress={progress}
        isMobile={isMobile}
        scopeProgress={scopeProgress}
        chamberTheme={chamberTheme}
      />
      <LensTransition progress={progress} scopeProgress={scopeProgress} isMobile={isMobile} />
      <ScopeView
        scopeProgress={scopeProgress}
        isMobile={isMobile}
        onOpenSection={openSectionPage}
        onNavigateSpecimen={navigateToSpecimen}
      />
      <Suspense fallback={null}>
        <SectionPage
          section={activeSection}
          isOpen={isSectionPageOpen}
          onClose={closeSectionPage}
          transitionMs={SECTION_PAGE_TRANSITION_MS}
        />
      </Suspense>
      <LoadingScreen />
      <ScrollMeter
        activeIndex={currentPhaseIndex}
        meterPosition={meterPosition}
        phases={phaseTargets}
        onScrub={scrubToMeterPosition}
        onSelectPhase={navigateToPhase}
      />
      <div className="fixed right-5 top-5 z-40 hidden gap-2 md:right-8 md:top-8 md:flex">
        {scopeProgress < SCOPE_ACTIVATION_START ? (
          <button
            type="button"
            onClick={() => setChamberTheme((theme) => (theme === 'warm' ? 'cold' : 'warm'))}
            aria-label={`Switch to the ${chamberTheme === 'warm' ? 'cool' : 'warm'} scene`}
            aria-pressed={chamberTheme === 'warm'}
            className="rounded-full border border-white/60 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:text-black"
          >
            Theme: {chamberTheme === 'warm' ? 'Warm' : 'Cool'}
          </button>
        ) : null}
        <button
          type="button"
          onClick={scrollToStart}
          className="rounded-full border border-white/60 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:text-black"
        >
          Return to Start
        </button>
      </div>

      <main className={`relative z-20 ${ENABLE_DEV_CONTROLS ? 'pointer-events-none' : ''}`}>
        <section
          className="relative overflow-hidden px-4 sm:px-6"
          style={{ height: `calc(var(--app-height) * ${HERO_SCROLL_HEIGHT / 100})` }}
        >
          <div className="sticky top-0 w-full" style={{ minHeight: 'var(--app-height)' }}>
            <div
              className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-4 py-4 sm:py-6 lg:py-10"
              style={{ minHeight: 'var(--app-height)' }}
            >
              <div
                className="max-h-[calc(var(--app-height)-2rem)] max-w-md overflow-y-auto rounded-2xl border border-white/50 bg-white/55 p-4 shadow-md shadow-sky-100/35 transition-opacity duration-300 sm:max-w-xl sm:rounded-3xl sm:p-6 lg:p-8"
                style={{ opacity: heroCardOpacity }}
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-lab-deep/70 sm:mb-3 sm:text-sm">
                    João Vedor
                  </p>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-6xl">
                    Biomedical NLP Developer.
                  </h1>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-700 sm:mt-3 sm:text-base sm:leading-7">
                    I build reliable software for biomedical data.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-5" aria-label="Portfolio actions">
                    <button
                      type="button"
                      onClick={() => navigateToSection('projects')}
                      className="inline-flex min-h-11 items-center justify-center rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                    >
                      View projects
                    </button>
                    {aboutSection?.cvHref ? (
                      <a
                        href={aboutSection.cvHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                      >
                        Download CV <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>

                  <nav className="mt-5 hidden flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-emerald-900 sm:flex" aria-label="Portfolio sections">
                    <button type="button" onClick={() => navigateToSection('about')} className="inline-flex min-h-11 items-center underline decoration-emerald-900/30 underline-offset-4 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                      About
                    </button>
                    <button type="button" onClick={() => navigateToSection('projects')} className="inline-flex min-h-11 items-center underline decoration-emerald-900/30 underline-offset-4 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                      Projects
                    </button>
                    <button type="button" onClick={() => navigateToSection('skills')} className="inline-flex min-h-11 items-center underline decoration-emerald-900/30 underline-offset-4 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                      Skills
                    </button>
                    <button type="button" onClick={() => navigateToSection('contact')} className="inline-flex min-h-11 items-center underline decoration-emerald-900/30 underline-offset-4 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800">
                      Contact
                    </button>
                    {linkedInContact ? (
                      <a
                        href={linkedInContact.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center underline decoration-emerald-900/30 underline-offset-4 transition hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                      >
                        LinkedIn <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </nav>

                  <div className="mt-5 hidden items-center gap-3 border-t border-slate-900/10 pt-4 sm:flex">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-lg text-white"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                      How to explore
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {isMobile
                        ? 'Swipe up to enter the lens, then use the arrows to browse specimens.'
                        : 'Scroll, or use the arrow keys for a smoother experience.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Analytics />
    </div>
  );
}

export default App;

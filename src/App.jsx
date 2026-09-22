import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import LensTransition from './components/ui/LensTransition';
import ScopeView from './components/ui/ScopeView';
import ScrollMeter from './components/ui/ScrollMeter';
import { Analytics } from '@vercel/analytics/react';
import sections from './data/ScopeViewSections.data.js';
import {
  HERO_ANIMATION_END,
  HERO_ANIMATION_START,
  HERO_SCROLL_HEIGHT,
  SECTION_PAGE_TRANSITION_MS,
} from './config/scopeTiming.js';
import { useScopeProgress } from './hooks/useScopeProgress';
import { useScrollNavigation } from './hooks/useScrollNavigation';
import { useScrollProgress } from './hooks/useScrollProgress';
import { getInteractiveElement } from './utils/dom.js';

const Scene = lazy(() => import('./components/scene/Scene'));
const SectionPage = lazy(() => import('./components/ui/SectionPage'));

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';
const aboutSection = sections.find((section) => section.id === 'about');
const contactSection = sections.find((section) => section.id === 'contact');
const linkedInContact = contactSection?.contactMethods?.find((method) => method.label === 'LinkedIn');

function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [isSectionPageOpen, setIsSectionPageOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const scrollAnimationRef = useRef(0);
  const scrollContainerRef = useRef(null);

  const { progress, heroProgress, isMobile, reducedMotion } = useScrollProgress({
    heroHeightVh: HERO_SCROLL_HEIGHT,
    animationStartVh: HERO_ANIMATION_START,
    animationEndVh: HERO_ANIMATION_END,
    scrollContainerRef,
  });

  const {
    currentPhaseIndex,
    heroCardOpacity,
    heroDetailsOpacity,
    heroBackdropOpacity,
    lensEntry,
    meterPosition,
    phaseTargets,
    scopeEndVh,
    scopeProgress,
    scopeStartVh,
  } = useScopeProgress({ heroProgress, sections, reducedMotion });

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
      <Suspense fallback={null}>
        <Scene
          progress={progress}
          isMobile={isMobile}
          lensEntry={lensEntry}
          reducedMotion={reducedMotion}
        />
      </Suspense>
      <LensTransition lensEntry={lensEntry} />
      <ScopeView
        scopeProgress={scopeProgress}
        lensEntry={lensEntry}
        reducedMotion={reducedMotion}
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
      <ScrollMeter
        activeIndex={currentPhaseIndex}
        meterPosition={meterPosition}
        phases={phaseTargets}
        onScrub={scrubToMeterPosition}
        onSelectPhase={navigateToPhase}
      />
      <div className="fixed right-5 top-5 z-40 hidden gap-2 md:right-8 md:top-8 md:flex">
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
          className="relative"
          aria-labelledby="hero-title"
          style={{ height: `calc(var(--app-height) * ${HERO_SCROLL_HEIGHT / 100})` }}
        >
          <div
            className="sticky top-0 flex w-full flex-col"
            style={{ minHeight: 'var(--app-height)', opacity: heroCardOpacity }}
            inert={heroCardOpacity === 0}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent md:via-slate-50/60"
              style={{ opacity: heroBackdropOpacity }}
            />
            <div
              className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-24 pt-5 sm:px-8 md:pt-8 lg:px-12"
              style={{ minHeight: 'var(--app-height)' }}
            >
              <nav
                className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-emerald-950 md:pr-48"
                aria-label="Portfolio sections"
                style={{ opacity: heroDetailsOpacity }}
                inert={heroDetailsOpacity === 0}
              >
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

              <div className="flex flex-1 flex-col justify-center py-10 sm:py-16">
                <h1 id="hero-title" className="max-w-2xl text-6xl font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950 sm:text-8xl lg:text-9xl">
                  {aboutSection.name}
                </h1>
                <p className="mt-6 max-w-lg text-xl font-medium tracking-tight text-emerald-950 sm:text-2xl lg:text-3xl">
                  Biomedical NLP Developer.
                </p>
                <div style={{ opacity: heroDetailsOpacity }} inert={heroDetailsOpacity === 0}>
                  <p className="mt-4 max-w-sm text-base leading-7 text-slate-700 sm:text-lg">
                    I build reliable software for biomedical data.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" aria-label="Portfolio actions">
                    <button
                      type="button"
                      onClick={() => navigateToSection('projects')}
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-emerald-800 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
                    >
                      View projects <span aria-hidden="true">↗</span>
                    </button>
                    {aboutSection?.cvHref ? (
                      <a
                        href={aboutSection.cvHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-950 underline decoration-emerald-900/30 underline-offset-4 transition hover:decoration-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
                      >
                        Download CV <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>

              <p
                className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-emerald-950"
                style={{ opacity: heroDetailsOpacity }}
                aria-hidden={heroDetailsOpacity === 0}
              >
                <span aria-hidden="true">↓</span>
                {isMobile ? 'Swipe up to explore' : 'Scroll or use arrow keys to explore'}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Analytics />
    </div>
  );
}

export default App;

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
  HERO_STICKY_START_OFFSET,
  SECTION_PAGE_TRANSITION_MS,
} from './config/scopeTiming.js';
import { useScopeProgress } from './hooks/useScopeProgress';
import { useScrollNavigation } from './hooks/useScrollNavigation';
import { useScrollProgress } from './hooks/useScrollProgress';
import { getInteractiveElement } from './utils/dom.js';

const SectionPage = lazy(() => import('./components/ui/SectionPage'));

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';

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

  const toggleChamberTheme = useCallback(() => {
    setChamberTheme((theme) => (theme === 'warm' ? 'cold' : 'warm'));
  }, []);

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
      <div className="fixed right-5 top-5 z-40 flex gap-2 md:right-8 md:top-8">
        <button
          type="button"
          onClick={toggleChamberTheme}
          className="rounded-full border border-white/60 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:text-black"
        >
          {chamberTheme === 'warm' ? 'Cold' : 'Warm'}
        </button>
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
          className="relative overflow-hidden px-6"
          style={{ height: `calc(var(--app-height) * ${HERO_SCROLL_HEIGHT / 100})` }}
        >
          <div style={{ height: `calc(var(--app-height) * ${HERO_STICKY_START_OFFSET / 100})` }} />
          <div className="sticky top-0 w-full" style={{ minHeight: 'var(--app-height)' }}>
            <div
              className="mx-auto flex w-full max-w-6xl flex-col justify-start gap-6 py-16"
              style={{ minHeight: 'var(--app-height)' }}
            >
              <div
                className="max-w-xl rounded-3xl border border-white/50 bg-white/55 p-8 shadow-md shadow-sky-100/35 transition-opacity duration-300"
                style={{ opacity: heroCardOpacity }}
              >
                <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-lab-deep/70">
                  Scroll-Driven Microscope Portfolio
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                  A closer look at my work.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-slate-700 md:text-lg">
                  Enter the lens and move through a layered portfolio built around experiments,
                  projects, design, code, and the details that shape my work.
                </p>
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

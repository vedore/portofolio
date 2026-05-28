import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Scene from './components/scene/Scene';
import LensTransition from './components/ui/LensTransition';
import ScopeView from './components/ui/ScopeView';
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollMeter from './components/ui/ScrollMeter';
import { Analytics } from '@vercel/analytics/react';
import sections from './data/ScopeViewSections.data.js';
import { useScrollProgress } from './hooks/useScrollProgress';

const HERO_SCROLL_HEIGHT = 900;
const HERO_STICKY_START_OFFSET = 50;
const HERO_ANIMATION_START = 0;
const HERO_ANIMATION_END = 220;
const HERO_SCOPE_START = 220;
const HERO_SCOPE_END = 860;
const SECTION_PAGE_TRANSITION_MS = 1000; // 520
const SECTION_HOLD_START = 0.38;
const CAMERA_MID_PROGRESS = 0.5;
const CAMERA_END_PROGRESS = 0.87;
const CAMERA_SCOPE_ENTRY_PROGRESS = 1;
const SectionPage = lazy(() => import('./components/ui/SectionPage'));

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const getMeasuredViewportHeight = (container) =>
  container?.clientHeight || window.visualViewport?.height || window.innerHeight || 1;
const getInteractiveElement = (element) => element?.closest?.('input, textarea, select, button, a');
const easeInOutCubic = (value) =>
  value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2;
const inverseSmoothstep = (value) => {
  let low = 0;
  let high = 1;

  for (let index = 0; index < 18; index += 1) {
    const mid = (low + high) / 2;
    const estimate = mid * mid * (3 - 2 * mid);

    if (estimate < value) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
};

function App() {
  const [activeSection, setActiveSection] = useState(null);
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

  const heroScrollRangeVh = HERO_SCROLL_HEIGHT - 100;
  const scopeStartVh = clamp(HERO_SCOPE_START, 0, heroScrollRangeVh);
  const scopeEndVh = clamp(HERO_SCOPE_END, scopeStartVh, heroScrollRangeVh);
  const currentHeroVh = heroProgress * heroScrollRangeVh;
  const scopeProgress = clamp((currentHeroVh - scopeStartVh) / Math.max(scopeEndVh - scopeStartVh, 0.001));
  const heroCardOpacity = 1 - clamp((scopeProgress - 0.04) / 0.18);

  const getSpecimenHeroProgress = useCallback((targetIndex) => {
    const stepCount = Math.max(sections.length - 1, 1);
    const rawPosition =
      targetIndex >= sections.length - 1
        ? stepCount
        : targetIndex + SECTION_HOLD_START * 0.5;
    const contentProgress = clamp(rawPosition / stepCount);
    const scopeContentInput = inverseSmoothstep(contentProgress);
    const targetScopeProgress = 0.16 + scopeContentInput * 0.9;
    const targetHeroVh = scopeStartVh + targetScopeProgress * (scopeEndVh - scopeStartVh);

    return clamp(targetHeroVh / heroScrollRangeVh);
  }, [heroScrollRangeVh, scopeEndVh, scopeStartVh]);

  const getCameraHeroProgress = useCallback((cameraProgress) => {
    const animationVh =
      HERO_ANIMATION_START + cameraProgress * (HERO_ANIMATION_END - HERO_ANIMATION_START);

    return clamp(animationVh / heroScrollRangeVh);
  }, [heroScrollRangeVh]);

  const phaseTargets = useMemo(() => [
    { id: 'start', label: 'Welcome!', progress: 0 },
    { id: 'middle', label: 'View', progress: getCameraHeroProgress(CAMERA_MID_PROGRESS) },
    { id: 'end', label: 'Scope', progress: getCameraHeroProgress(CAMERA_END_PROGRESS) },
    ...sections.map((section, index) => ({
      id: section.id,
      label: section.title,
      progress: getSpecimenHeroProgress(index),
    })),
  ], [getCameraHeroProgress, getSpecimenHeroProgress]);

  const currentPhaseIndex = phaseTargets.reduce((closestIndex, phase, index) => {
    const closestDistance = Math.abs(heroProgress - phaseTargets[closestIndex].progress);
    const distance = Math.abs(heroProgress - phase.progress);

    return distance < closestDistance ? index : closestIndex;
  }, 0);

  const meterPosition = phaseTargets.reduce((position, phase, index) => {
    const nextPhase = phaseTargets[index + 1];

    if (!nextPhase || heroProgress < phase.progress || heroProgress > nextPhase.progress) {
      return position;
    }

    const phaseProgress = clamp(
      (heroProgress - phase.progress) / Math.max(nextPhase.progress - phase.progress, 0.001),
    );

    return index + phaseProgress;
  }, heroProgress >= phaseTargets.at(-1).progress ? phaseTargets.length - 1 : 0);

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

  const animateScrollTo = useCallback((targetScrollY) => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    if (scrollAnimationRef.current) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
    }

    const startScrollY = container.scrollTop;
    const distance = targetScrollY - startScrollY;
    const duration = clamp(Math.abs(distance) * 0.75, 900, 2200);
    const startTime = performance.now();

    const tick = (time) => {
      const elapsed = time - startTime;
      const progress = clamp(elapsed / duration);

      container.scrollTop = startScrollY + distance * easeInOutCubic(progress);

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(tick);
      } else {
        scrollAnimationRef.current = 0;
      }
    };

    scrollAnimationRef.current = window.requestAnimationFrame(tick);
  }, []);

  const navigateToSpecimen = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= sections.length) {
      return;
    }

    const stepCount = Math.max(sections.length - 1, 1);
    const rawPosition =
      targetIndex >= sections.length - 1
        ? stepCount
        : targetIndex + SECTION_HOLD_START * 0.5;
    const contentProgress = clamp(rawPosition / stepCount);
    const scopeContentInput = inverseSmoothstep(contentProgress);
    const targetScopeProgress = 0.16 + scopeContentInput * 0.9;
    const targetHeroVh = scopeStartVh + targetScopeProgress * (scopeEndVh - scopeStartVh);
    const viewportHeight = getMeasuredViewportHeight(scrollContainerRef.current);
    const targetScrollY = (targetHeroVh / 100) * viewportHeight;

    animateScrollTo(targetScrollY);
  }, [animateScrollTo, scopeEndVh, scopeStartVh]);

  const scrollToStart = useCallback(() => {
    animateScrollTo(0);
  }, [animateScrollTo]);

  const scrollToHeroProgress = useCallback((targetProgress) => {
    const viewportHeight = getMeasuredViewportHeight(scrollContainerRef.current);
    const scrollableHero = Math.max((HERO_SCROLL_HEIGHT / 100) * viewportHeight - viewportHeight, 1);

    animateScrollTo(targetProgress * scrollableHero);
  }, [animateScrollTo]);

  const scrubToMeterPosition = useCallback((targetPosition) => {
    const lowerIndex = Math.floor(clamp(targetPosition, 0, phaseTargets.length - 1));
    const upperIndex = Math.min(lowerIndex + 1, phaseTargets.length - 1);
    const localProgress = clamp(targetPosition - lowerIndex);
    const lowerPhase = phaseTargets[lowerIndex];
    const upperPhase = phaseTargets[upperIndex];
    const targetProgress =
      lowerPhase.progress + (upperPhase.progress - lowerPhase.progress) * localProgress;

    scrollToHeroProgress(targetProgress);
  }, [phaseTargets, scrollToHeroProgress]);

  const navigateToPhase = useCallback((targetIndex) => {
    const phaseIndex = Math.round(clamp(targetIndex, 0, phaseTargets.length - 1));
    const phase = phaseTargets[phaseIndex];

    scrollToHeroProgress(phase.progress);
  }, [phaseTargets, scrollToHeroProgress]);

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
      <Scene progress={progress} isMobile={isMobile} scopeProgress={scopeProgress} />
      <LensTransition progress={progress} isMobile={isMobile} />
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
      <button
        type="button"
        onClick={scrollToStart}
        className="fixed right-5 top-5 z-40 rounded-full border border-white/60 bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:text-black md:right-8 md:top-8"
      >
        Return to Start
      </button>

      <main className={`relative z-20 ${ENABLE_DEV_CONTROLS ? 'pointer-events-none' : ''}`}>
        <section
          className="relative overflow-hidden px-6"
          style={{ height: `calc(var(--app-height) * ${HERO_SCROLL_HEIGHT / 100})` }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent" />
          <div style={{ height: `calc(var(--app-height) * ${HERO_STICKY_START_OFFSET / 100})` }} />
          <div className="sticky top-0 w-full" style={{ minHeight: 'var(--app-height)' }}>
            <div
              className="mx-auto flex w-full max-w-6xl flex-col justify-start gap-6 py-16"
              style={{ minHeight: 'var(--app-height)' }}
            >
              <div
                className="max-w-xl rounded-3xl border border-white/50 bg-white/45 p-8 shadow-xl shadow-sky-100/50 backdrop-blur-sm transition-opacity duration-300 md:backdrop-blur-md"
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

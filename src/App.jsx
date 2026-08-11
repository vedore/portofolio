import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Scene from './components/scene/Scene';
import LensTransition from './components/ui/LensTransition';
import ScopeView from './components/ui/ScopeView';
import LoadingScreen from './components/ui/LoadingScreen';
import ScrollMeter from './components/ui/ScrollMeter';
import HeroTitleCard from './components/ui/HeroTitleCard';
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
const githubContact = contactSection?.contactMethods?.find((method) => method.label === 'GitHub');
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
      {heroProgress > 0.01 ? (
        <div className="fixed right-5 top-5 z-40 flex gap-2 md:right-8 md:top-8">
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
      ) : null}

      <main className={`relative z-20 ${ENABLE_DEV_CONTROLS ? 'pointer-events-none' : ''}`}>
        <section
          className="relative overflow-hidden"
          style={{ height: `calc(var(--app-height) * ${HERO_SCROLL_HEIGHT / 100})` }}
        >
          <div className="sticky top-0 w-full" style={{ minHeight: 'var(--app-height)' }}>
            <div
              className="flex w-full flex-col justify-center"
              style={{ minHeight: 'var(--app-height)' }}
            >
              <div style={{ opacity: heroCardOpacity }}>
                <HeroTitleCard
                  chamberTheme={chamberTheme}
                  cvHref={aboutSection?.cvHref}
                  githubHref={githubContact?.href}
                  linkedInHref={linkedInContact?.href}
                  isMobile={isMobile}
                  onNavigateToSection={navigateToSection}
                  onToggleTheme={() => setChamberTheme((theme) => (theme === 'warm' ? 'cold' : 'warm'))}
                />
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

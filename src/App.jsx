import { useEffect, useRef, useState } from 'react';
import Scene from './components/scene/Scene';
import LensTransition from './components/ui/LensTransition';
import ScopeView from './components/ui/ScopeView';
import SectionPage from './components/ui/SectionPage';
import LoadingScreen from './components/ui/LoadingScreen';
import sections from './data/ScopeViewSections.data.js';
import { useScrollProgress } from './hooks/useScrollProgress';

import { Analytics } from "@vercel/analytics/next"

const HERO_SCROLL_HEIGHT = 900;
const HERO_STICKY_START_OFFSET = 50;
const HERO_ANIMATION_START = 0;
const HERO_ANIMATION_END = 220;
const HERO_SCOPE_START = 220;
const HERO_SCOPE_END = 860;
const SECTION_PAGE_TRANSITION_MS = 1000; // 520
const SECTION_HOLD_START = 0.38;

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
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
  const { progress, heroProgress, isMobile } = useScrollProgress({
    heroHeightVh: HERO_SCROLL_HEIGHT,
    animationStartVh: HERO_ANIMATION_START,
    animationEndVh: HERO_ANIMATION_END,
  });
  const heroScrollRangeVh = HERO_SCROLL_HEIGHT - 100;
  const scopeStartVh = clamp(HERO_SCOPE_START, 0, heroScrollRangeVh);
  const scopeEndVh = clamp(HERO_SCOPE_END, scopeStartVh, heroScrollRangeVh);
  const currentHeroVh = heroProgress * heroScrollRangeVh;
  const scopeProgress = clamp((currentHeroVh - scopeStartVh) / Math.max(scopeEndVh - scopeStartVh, 0.001));
  const heroCardOpacity = 1 - clamp((scopeProgress - 0.04) / 0.18);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!activeSection) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeSection]);

  const openSectionPage = (section) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setActiveSection(section);
    window.requestAnimationFrame(() => {
      setIsSectionPageOpen(true);
    });
  };

  const closeSectionPage = () => {
    setIsSectionPageOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveSection(null);
      closeTimerRef.current = null;
    }, SECTION_PAGE_TRANSITION_MS);
  };

  const navigateToSpecimen = (targetIndex) => {
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
    const viewportHeight = window.innerHeight || 1;
    const targetScrollY = (targetHeroVh / 100) * viewportHeight;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const scrollToStart = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <Scene progress={progress} isMobile={isMobile} scopeProgress={scopeProgress} />
      <LensTransition progress={progress} isMobile={isMobile} />
      <ScopeView
        scopeProgress={scopeProgress}
        isMobile={isMobile}
        onOpenSection={openSectionPage}
        onNavigateSpecimen={navigateToSpecimen}
      />
      <SectionPage
        section={activeSection}
        isOpen={isSectionPageOpen}
        onClose={closeSectionPage}
        transitionMs={SECTION_PAGE_TRANSITION_MS}
      />
      <LoadingScreen />
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
          style={{ height: `${HERO_SCROLL_HEIGHT}vh` }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent" />
          <div style={{ height: `${HERO_STICKY_START_OFFSET}vh` }} />
          <div className="sticky top-0 min-h-screen w-full">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start gap-6 py-16">
              <div
                className="max-w-xl rounded-3xl border border-white/50 bg-white/45 p-8 shadow-xl shadow-sky-100/50 backdrop-blur-md transition-opacity duration-300"
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

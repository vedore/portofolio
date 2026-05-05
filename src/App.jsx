import Scene from './components/scene/Scene';
import LensTransition from './components/ui/LensTransition';
import PortfolioSections from './components/ui/PortfolioSections';
import LoadingScreen from './components/ui/LoadingScreen';
import { useScrollProgress } from './hooks/useScrollProgress';

const HERO_SCROLL_HEIGHT = 320;

const HERO_STICKY_START_OFFSET = 50;

const HERO_ANIMATION_START = 0;
const HERO_ANIMATION_END = 220;

const ENABLE_DEV_CONTROLS = import.meta.env.VITE_ENABLE_ORBIT === 'true';

function App() {
  const { progress, isMobile } = useScrollProgress({
    heroHeightVh: HERO_SCROLL_HEIGHT,
    animationStartVh: HERO_ANIMATION_START,
    animationEndVh: HERO_ANIMATION_END,
  });

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <Scene progress={progress} isMobile={isMobile} />
      <LensTransition progress={progress} isMobile={isMobile} />
      <LoadingScreen />

      <main className={`relative z-20 ${ENABLE_DEV_CONTROLS ? 'pointer-events-none' : ''}`}>
        <section
          className="relative overflow-hidden px-6"
          style={{ height: `${HERO_SCROLL_HEIGHT}vh` }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-transparent" />
          <div style={{ height: `${HERO_STICKY_START_OFFSET}vh` }} />
          <div className="sticky top-0 min-h-screen w-full">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-start gap-6 py-16">
              <div className="max-w-xl rounded-3xl border border-white/50 bg-white/45 p-8 shadow-xl shadow-sky-100/50 backdrop-blur-md">
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

        <PortfolioSections />
      </main>
    </div>
  );
}

export default App;

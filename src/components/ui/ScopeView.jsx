import { memo, useRef } from 'react';
import sections from '../../data/ScopeViewSections.data.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (t) => t * t * (3 - 2 * t);
const SECTION_HOLD_START = 0.38;
const SECTION_HOLD_END = 0.68;
const NEXT_FADE_DELAY = 0.35;

const getScopeState = (scopeProgress, scrollDirection = 1) => {
  const activation = clamp((scopeProgress - 0.04) / 0.08);
  const contentProgress = smoothstep(clamp((scopeProgress - 0.16) / 0.9));
  const stepCount = Math.max(sections.length - 1, 1);
  const rawPosition = contentProgress * stepCount;
  const baseIndex = Math.min(Math.floor(rawPosition), sections.length - 1);
  const baseSectionProgress =
    baseIndex >= sections.length - 1 ? 0 : rawPosition - baseIndex;
  const transitionRange = SECTION_HOLD_END - SECTION_HOLD_START;

  let currentIndex = baseIndex;
  let nextIndex = Math.min(baseIndex + 1, sections.length - 1);
  let shiftProgress = 0;

  if (baseSectionProgress > SECTION_HOLD_START && baseSectionProgress < SECTION_HOLD_END) {
    const forwardShiftProgress = smoothstep(
      (baseSectionProgress - SECTION_HOLD_START) / transitionRange,
    );

    if (scrollDirection < 0) {
      currentIndex = Math.min(baseIndex + 1, sections.length - 1);
      nextIndex = baseIndex;
      shiftProgress = 1 - forwardShiftProgress;
    } else {
      shiftProgress = forwardShiftProgress;
    }
  } else if (baseSectionProgress >= SECTION_HOLD_END) {
    currentIndex = Math.min(baseIndex + 1, sections.length - 1);
    nextIndex = Math.min(currentIndex + 1, sections.length - 1);
  }

  const nextOpacity = smoothstep(
    clamp((shiftProgress - NEXT_FADE_DELAY) / (1 - NEXT_FADE_DELAY)),
  );

  return {
    activation,
    contentProgress,
    currentIndex,
    nextIndex,
    nextOpacity,
    shiftProgress,
  };
};

const ScopeCard = memo(function ScopeCard({
  section,
  isInteractive,
  tone = 'current',
  style,
  onOpenSection,
}) {
  return (
    <section
      className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 text-center md:px-14"
      style={style}
    >
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-slate-500">
        {section.label}
      </p>

      <h2 className="mt-5 max-w-full">
        <button
          type="button"
          onClick={() => {
            if (isInteractive) {
              onOpenSection?.(section);
            }
          }}
          disabled={!isInteractive}
          className="pointer-events-auto inline-flex max-w-full 
          items-center gap-3 rounded-full border border-black/10 
          bg-emerald-800 px-5 py-3 text-3xl font-semibold
          tracking-[0.04em] text-slate-200 shadow-[0_10px_26px_rgba(15,23,42,0.08)] 
          transition-colors duration-200 hover:border-black/25 hover:bg-emerald-600 disabled:cursor-default
          md:text-5xl">
          <span className="truncate">{section.title}</span>
          <span
            className={`text-sm font-semibold uppercase tracking-[0.18em] md:text-base ${
              tone === 'current' ? 'text-emerald-400' : 'text-slate-500'
            }`}
          >
            Open
          </span>
        </button>
      </h2>

      <p className="mt-5 max-w-md text-sm leading-7 text-slate-700 md:text-base">
        {section.text}
      </p>
    </section>
  );
});

function ScopeView({
  scopeProgress,
  isMobile,
  onOpenSection,
  onNavigateSpecimen,
}) {
  const previousScopeProgressRef = useRef(scopeProgress);
  const scrollDirectionRef = useRef(1);
  const progressDelta = scopeProgress - previousScopeProgressRef.current;

  if (Math.abs(progressDelta) > 0.001) {
    scrollDirectionRef.current = progressDelta < 0 ? -1 : 1;
    previousScopeProgressRef.current = scopeProgress;
  }

  const {
    activation,
    contentProgress,
    currentIndex,
    nextIndex,
    nextOpacity,
    shiftProgress,
  } = getScopeState(scopeProgress, scrollDirectionRef.current);

  const isLensInteractive = activation >= 0.98;
  const currentSection = sections[currentIndex];
  const nextSection = sections[nextIndex];
  const direction = nextIndex >= currentIndex ? 1 : -1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < sections.length - 1;
  const isTransitioning = currentIndex !== nextIndex && shiftProgress > 0.001;

  const lensSize = isMobile ? 'min(86vw, 28rem)' : 'min(56vw, 31rem)';
  const arrowInset = isMobile ? 'clamp(0.55rem, 2vw, 0.9rem)' : 'clamp(0.85rem, 1.8vw, 1.35rem)';

  const currentStyle = {
    opacity: 1 - nextOpacity * 0.82,
    transform: `translate3d(${direction * -shiftProgress * 34}%, 0, 0) scale(${1 - shiftProgress * 0.035})`,
    willChange: isTransitioning ? 'transform, opacity' : 'auto',
  };

  const nextStyle = {
    opacity: nextOpacity,
    transform: `translate3d(${direction * (1 - shiftProgress) * 38}%, 0, 0) scale(${0.965 + shiftProgress * 0.035})`,
    willChange: isTransitioning ? 'transform, opacity' : 'auto',
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black"
      style={{
        opacity: activation,
        transform: `translate3d(0, 0, 0) scale(${0.985 + activation * 0.025})`,
        willChange: activation < 1 ? 'opacity, transform' : 'auto',
      }}
    >
      <div
        className="relative"
        style={{
          width: lensSize,
          height: lensSize,
        }}
      >
        <button
          type="button"
          onClick={() => onNavigateSpecimen?.(currentIndex - 1)}
          disabled={!isLensInteractive || !canGoPrevious}
          className="pointer-events-auto absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/15 text-2xl font-light text-emerald-500 transition-colors duration-200 hover:bg-black/30 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-20 md:h-12 md:w-12 md:text-4xl"
          style={{ left: arrowInset }}
          aria-label="Previous specimen"
        >
          ←
        </button>

        <button
          type="button"
          onClick={() => onNavigateSpecimen?.(currentIndex + 1)}
          disabled={!isLensInteractive || !canGoNext}
          className="pointer-events-auto absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/15 text-2xl font-light text-emerald-500 transition-colors duration-200 hover:bg-black/50 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-20 md:h-12 md:w-12 md:text-4xl"
          style={{ right: arrowInset }}
          aria-label="Next specimen"
        >
          →
        </button>

        <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-white shadow-[0_0_48px_rgba(0,0,0,0.42)] [contain:layout_paint_style]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#f5f7f7_56%,_#d9dddd_100%)]" />
          <div className="pointer-events-none absolute inset-x-[12%] top-[13%] h-[1px] bg-black/8" />
          <div className="pointer-events-none absolute inset-x-[12%] bottom-[13%] h-[1px] bg-black/8" />

          <div className="absolute inset-0 overflow-hidden">
            <ScopeCard
              key={currentSection.id}
              section={currentSection}
              isInteractive={isLensInteractive}
              style={currentStyle}
              onOpenSection={onOpenSection}
            />

            {isTransitioning ? (
              <ScopeCard
                key={nextSection.id}
                section={nextSection}
                isInteractive={isLensInteractive}
                tone="next"
                style={nextStyle}
                onOpenSection={onOpenSection}
              />
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-full border border-black/10" />
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_0_34px_rgba(0,0,0,0.16)]" />
        </div>

        <div className="pointer-events-none absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {sections.map((section, index) => {
            const distance = Math.abs(contentProgress * Math.max(sections.length - 1, 1) - index);
            const isActive = distance < 0.5;

            return (
              <span
                key={section.id}
                className={`h-1.5 rounded-full transition-[width,background-color,opacity] duration-200 ${
                  isActive ? 'w-6 bg-emerald-600 opacity-100' : 'w-1.5 bg-white/35 opacity-70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const areScopePropsEqual = (previousProps, nextProps) => {
  if (
    previousProps.isMobile !== nextProps.isMobile ||
    previousProps.onOpenSection !== nextProps.onOpenSection ||
    previousProps.onNavigateSpecimen !== nextProps.onNavigateSpecimen
  ) {
    return false;
  }

  return (
    Math.round(previousProps.scopeProgress * 1000) ===
    Math.round(nextProps.scopeProgress * 1000)
  );
};

export default memo(ScopeView, areScopePropsEqual);

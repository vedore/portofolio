import { memo, useRef } from 'react';
import {
  NEXT_FADE_DELAY,
  SCOPE_ACTIVATION_RANGE,
  SCOPE_ACTIVATION_START,
  SCOPE_CONTENT_RANGE,
  SCOPE_CONTENT_START,
  SECTION_HOLD_END,
  SECTION_HOLD_START,
} from '../../config/scopeTiming.js';
import sections from '../../data/ScopeViewSections.data.js';
import { clamp, smoothstep } from '../../utils/progress.js';

const STEP_COUNT = Math.max(sections.length - 1, 1);

const getScopeState = (scopeProgress, scrollDirection = 1) => {
  const activation = clamp((scopeProgress - SCOPE_ACTIVATION_START) / SCOPE_ACTIVATION_RANGE);
  const contentProgress = smoothstep(
    clamp((scopeProgress - SCOPE_CONTENT_START) / SCOPE_CONTENT_RANGE),
  );
  const rawPosition = contentProgress * STEP_COUNT;
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

const getCardStyle = ({ direction, isEntering, nextOpacity, shiftProgress, isTransitioning }) => {
  const progress = isEntering ? 1 - shiftProgress : -shiftProgress;
  const distance = isEntering ? 38 : 34;
  const opacity = isEntering ? nextOpacity : 1 - nextOpacity * 0.82;
  const scale = isEntering ? 0.965 + shiftProgress * 0.035 : 1 - shiftProgress * 0.035;

  return {
    opacity,
    transform: `translate3d(${direction * progress * distance}%, 0, 0) scale(${scale})`,
    willChange: isTransitioning ? 'transform, opacity' : undefined,
  };
};

const ScopeNavButton = memo(function ScopeNavButton({
  direction,
  inset,
  disabled,
  onClick,
}) {
  const isPrevious = direction < 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="pointer-events-auto absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/15 text-2xl font-light text-emerald-500 transition-colors duration-200 hover:bg-black/30 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-20 md:h-12 md:w-12 md:text-4xl"
      style={isPrevious ? { left: inset } : { right: inset }}
      aria-label={`${isPrevious ? 'Previous' : 'Next'} specimen`}
    >
      {isPrevious ? '←' : '→'}
    </button>
  );
});

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
          onClick={() => onOpenSection?.(section)}
          disabled={!isInteractive}
          className="pointer-events-auto inline-flex max-w-full 
          items-center gap-3 rounded-full border border-black/10 
          bg-emerald-800 px-5 py-3 text-3xl font-semibold
          tracking-[0.04em] text-slate-200 shadow-[0_6px_18px_rgba(15,23,42,0.07)] 
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
  const isShifting = currentIndex !== nextIndex && shiftProgress > 0.001;
  const showNextCard = currentIndex !== nextIndex && nextOpacity > 0.001;

  const lensSize = isMobile ? 'min(86vw, 28rem)' : 'min(56vw, 31rem)';
  const arrowInset = isMobile ? 'clamp(0.55rem, 2vw, 0.9rem)' : 'clamp(0.85rem, 1.8vw, 1.35rem)';

  const cardStyleProps = { direction, nextOpacity, shiftProgress, isTransitioning: isShifting };
  const dotPosition = contentProgress * STEP_COUNT;

  if (activation <= 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black"
      style={{
        opacity: activation,
        willChange: activation < 1 ? 'opacity' : undefined,
      }}
    >
      <div
        className="relative"
        style={{
          width: lensSize,
          height: lensSize,
          transform: `translate3d(0, 0, 0) scale(${0.985 + activation * 0.025})`,
          willChange: activation < 1 ? 'transform' : undefined,
        }}
      >
        <ScopeNavButton
          direction={-1}
          inset={arrowInset}
          disabled={!isLensInteractive || !canGoPrevious}
          onClick={() => onNavigateSpecimen?.(currentIndex - 1)}
        />

        <ScopeNavButton
          direction={1}
          inset={arrowInset}
          disabled={!isLensInteractive || !canGoNext}
          onClick={() => onNavigateSpecimen?.(currentIndex + 1)}
        />

        <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-white [contain:layout_paint_style]">
          <div className="pointer-events-none absolute inset-x-[12%] top-[13%] h-[1px] bg-black/8" />
          <div className="pointer-events-none absolute inset-x-[12%] bottom-[13%] h-[1px] bg-black/8" />

          <div className="absolute inset-0 overflow-hidden">
            <ScopeCard
              key={currentSection.id}
              section={currentSection}
              isInteractive={isLensInteractive}
              style={getCardStyle(cardStyleProps)}
              onOpenSection={onOpenSection}
            />

            {showNextCard ? (
              <ScopeCard
                key={nextSection.id}
                section={nextSection}
                isInteractive={false}
                tone="next"
                style={getCardStyle({ ...cardStyleProps, isEntering: true })}
                onOpenSection={onOpenSection}
              />
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-full border border-black/10" />
        </div>

        <div className="pointer-events-none absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {sections.map((section, index) => {
            const distance = Math.abs(dotPosition - index);
            const isActive = distance < 0.5;

            return (
              <span
                key={section.id}
                className="h-1.5 w-6 origin-center rounded-full bg-emerald-600 transition-[transform,opacity] duration-200"
                style={{
                  opacity: isActive ? 1 : 0.45,
                  transform: `scaleX(${isActive ? 1 : 0.25})`,
                }}
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
    Math.round(previousProps.scopeProgress * 250) ===
    Math.round(nextProps.scopeProgress * 250)
  );
};

export default memo(ScopeView, areScopePropsEqual);

import { memo } from 'react';
import sections from '../../data/ScopeViewSections.data.js';
import { getScopeState, quantizeScopeProgress } from '../../utils/scopeProgress.js';

const getCardStyle = ({ isEntering, shiftProgress, isTransitioning }) => {
  const progress = isEntering ? 1 - shiftProgress : -shiftProgress;
  const distance = isEntering ? 38 : 34;
  const opacity = isEntering ? shiftProgress : 1 - shiftProgress;
  const scale = isEntering ? 0.965 + shiftProgress * 0.035 : 1 - shiftProgress * 0.035;

  return {
    opacity,
    transform: `translate3d(${progress * distance}%, 0, 0) scale(${scale})`,
    willChange: isTransitioning ? 'transform, opacity' : undefined,
  };
};

const ScopeNavButton = memo(function ScopeNavButton({
  direction,
  inset,
  disabled,
  opacity,
  onClick,
}) {
  const isPrevious = direction < 0;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="pointer-events-auto absolute top-[90%] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/15 text-2xl font-light text-emerald-500 transition-colors duration-200 hover:bg-black/30 hover:text-emerald-400 disabled:cursor-not-allowed md:top-1/2 md:h-12 md:w-12 md:text-4xl"
      style={{ ...(isPrevious ? { left: inset } : { right: inset }), opacity }}
      aria-label={`${isPrevious ? 'Previous' : 'Next'} specimen`}
    >
      {isPrevious ? '←' : '→'}
    </button>
  );
});

const ScopeCard = memo(function ScopeCard({
  section,
  isInteractive,
  style,
  isMobile,
  onOpenSection,
}) {
  const summary = isMobile ? section.scopeText ?? section.text : section.text;

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
          transition-colors duration-200 hover:border-black/25 hover:bg-emerald-600 disabled:pointer-events-none disabled:cursor-default
          md:text-5xl">
          <span className="truncate">{section.title}</span>
          <span
            className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400 md:text-base"
          >
            Open
          </span>
        </button>
      </h2>

      <p className="mt-4 max-w-md text-sm leading-6 text-slate-700 md:mt-5 md:text-base md:leading-7">
        {summary}
      </p>
    </section>
  );
});

function ScopeView({
  scopeProgress,
  lensEntry,
  reducedMotion,
  isMobile,
  onOpenSection,
  onNavigateSpecimen,
}) {
  const {
    currentIndex,
    nextIndex,
    shiftProgress,
  } = getScopeState(quantizeScopeProgress(scopeProgress), sections.length);

  const { field, content, controls, isInteractive: isLensInteractive } = lensEntry;
  const currentSection = sections[currentIndex];
  const nextSection = sections[nextIndex];
  const activeIndex = shiftProgress < 0.5 ? currentIndex : nextIndex;
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < sections.length - 1;
  const isShifting = shiftProgress > 0 && shiftProgress < 1;
  const showNextCard = currentIndex !== nextIndex && shiftProgress > 0;

  const lensSize = isMobile ? 'min(86vw, 28rem)' : 'min(56vw, 31rem)';
  const arrowInset = isMobile ? 'clamp(0.55rem, 2vw, 0.9rem)' : 'clamp(0.85rem, 1.8vw, 1.35rem)';

  const cardStyleProps = { shiftProgress, isTransitioning: isShifting };

  if (field <= 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-black"
      inert={!isLensInteractive}
      style={{
        opacity: field,
        willChange: field < 1 ? 'opacity' : undefined,
      }}
    >
      <div
        className="relative"
        style={{
          width: lensSize,
          height: lensSize,
          transform: reducedMotion ? undefined : `scale(${0.92 + field * 0.08})`,
          willChange: field < 1 && !reducedMotion ? 'transform' : undefined,
        }}
      >
        <ScopeNavButton
          direction={-1}
          inset={arrowInset}
          disabled={!isLensInteractive || !canGoPrevious}
          opacity={controls * (canGoPrevious ? 1 : 0.2)}
          onClick={() => onNavigateSpecimen?.(activeIndex - 1)}
        />

        <ScopeNavButton
          direction={1}
          inset={arrowInset}
          disabled={!isLensInteractive || !canGoNext}
          opacity={controls * (canGoNext ? 1 : 0.2)}
          onClick={() => onNavigateSpecimen?.(activeIndex + 1)}
        />

        <div
          className="relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-white [contain:layout_paint_style]"
          style={{ filter: field < 1 && !reducedMotion ? `blur(${(1 - field) * 6}px)` : undefined }}
        >
          <div className="pointer-events-none absolute inset-x-[12%] top-[13%] h-[1px] bg-black/8" />
          <div className="pointer-events-none absolute inset-x-[12%] bottom-[13%] h-[1px] bg-black/8" />

          <div className="absolute inset-0 overflow-hidden" style={{ opacity: content }}>
            <ScopeCard
              key={currentSection.id}
              section={currentSection}
              isInteractive={isLensInteractive && activeIndex === currentIndex}
              style={getCardStyle(cardStyleProps)}
              isMobile={isMobile}
              onOpenSection={onOpenSection}
            />

            {showNextCard ? (
              <ScopeCard
                key={nextSection.id}
                section={nextSection}
                isInteractive={isLensInteractive && activeIndex === nextIndex}
                style={getCardStyle({ ...cardStyleProps, isEntering: true })}
                isMobile={isMobile}
                onOpenSection={onOpenSection}
              />
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-full border border-black/10" />
        </div>

        <div className="pointer-events-none absolute -bottom-8 left-1/2 flex -translate-x-1/2 gap-2" style={{ opacity: controls }}>
          {sections.map((section, index) => {
            const isActive = activeIndex === index;

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
    previousProps.reducedMotion !== nextProps.reducedMotion ||
    previousProps.lensEntry.progress !== nextProps.lensEntry.progress ||
    previousProps.onOpenSection !== nextProps.onOpenSection ||
    previousProps.onNavigateSpecimen !== nextProps.onNavigateSpecimen
  ) {
    return false;
  }

  return (
    quantizeScopeProgress(previousProps.scopeProgress) ===
    quantizeScopeProgress(nextProps.scopeProgress)
  );
};

export default memo(ScopeView, areScopePropsEqual);

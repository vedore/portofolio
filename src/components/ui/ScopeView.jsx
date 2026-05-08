import sections from '../../data/ScopeViewSections.data.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (t) => t * t * (3 - 2 * t);
const SECTION_HOLD_START = 0.38;
const SECTION_HOLD_END = 0.68;
const NEXT_FADE_DELAY = 0.35;

function ScopeView({
  scopeProgress,
  isMobile,
  onOpenSection,
  onNavigateSpecimen,
}) {
  const activation = clamp((scopeProgress - 0.04) / 0.08);
  const isLensInteractive = activation >= 0.98;

  const contentProgress = smoothstep(clamp((scopeProgress - 0.16) / 0.9));

  const lensSize = isMobile ? 'min(84vw, 28rem)' : 'min(58vw, 30rem)';

  const stepCount = Math.max(sections.length - 1, 1);

  const rawPosition = contentProgress * stepCount;
  const baseIndex = Math.min(Math.floor(rawPosition), sections.length - 1);
  const baseSectionProgress =
    baseIndex >= sections.length - 1 ? 0 : rawPosition - baseIndex;
  const transitionRange = SECTION_HOLD_END - SECTION_HOLD_START;

  let currentIndex = baseIndex;
  let nextIndex = Math.min(baseIndex + 1, sections.length - 1);
  let revolverProgress = 0;

  if (baseSectionProgress <= SECTION_HOLD_START) {
    revolverProgress = 0;
  } else if (baseSectionProgress >= SECTION_HOLD_END) {
    currentIndex = Math.min(baseIndex + 1, sections.length - 1);
    nextIndex = Math.min(currentIndex + 1, sections.length - 1);
    revolverProgress = 0;
  } else {
    revolverProgress = smoothstep((baseSectionProgress - SECTION_HOLD_START) / transitionRange);
  }

  const nextOpacityProgress = smoothstep(
    clamp((revolverProgress - NEXT_FADE_DELAY) / (1 - NEXT_FADE_DELAY)),
  );

  const currentSection = sections[currentIndex];
  const nextSection = sections[nextIndex];
  const direction = nextIndex >= currentIndex ? 1 : -1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < sections.length - 1;

  const currentStyle = {
    opacity: 1 - nextOpacityProgress * 0.9,
    transform: `translateX(${direction * -revolverProgress * 52}%) rotate(${direction * -revolverProgress * 9}deg) scale(${1 - revolverProgress * 0.1})`,
  };
  const nextStyle = {
    opacity: currentIndex === nextIndex ? 0 : nextOpacityProgress,
    transform: `translateX(${direction * (1 - revolverProgress) * 62}%) rotate(${direction * (1 - revolverProgress) * 12}deg) scale(${0.9 + revolverProgress * 0.1})`,
  };

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-30 bg-black"
        style={{ opacity: activation }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
        style={{
          opacity: activation,
          transform: `scale(${0.97 + activation * 0.06})`,
        }}
      >
        <button
          type="button"
          onClick={() => onNavigateSpecimen?.(currentIndex - 1)}
          disabled={!isLensInteractive || !canGoPrevious}
          className="pointer-events-auto absolute left-[calc(50%-min(29vw,15rem)-6.4rem)] top-1/2 z-10 flex h-10 w-10 
          -translate-y-1/2 items-center justify-center text-2xl font-light text-white 
          transition disabled:cursor-not-allowed disabled:opacity-20 hover:-translate-y-1/2 
          hover:scale-110 hover:text-white/70 md:left-[calc(50%-min(30vw,15rem)-5rem)] md:h-12 md:w-12 md:text-4xl"
          aria-label="Previous specimen"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => onNavigateSpecimen?.(currentIndex + 1)}
          disabled={!isLensInteractive || !canGoNext}
          className="pointer-events-auto absolute right-[calc(50%-min(29vw,15rem)-6.4rem)] top-1/2 z-10 flex h-10 w-10 
          -translate-y-1/2 items-center justify-center text-2xl font-light text-white 
          transition disabled:cursor-not-allowed disabled:opacity-20 hover:-translate-y-1/2 
          hover:scale-110 hover:text-white/70 md:right-[calc(50%-min(30vw,15rem)-5rem)] md:h-12 md:w-12 md:text-4xl"
          aria-label="Next specimen"
        >
          →
        </button>
        <div
          className="relative overflow-hidden rounded-full border border-white/10 bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_80px_rgba(0,0,0,0.55)]"
          style={{
            width: lensSize,
            height: lensSize,
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.95)_0%,_rgba(240,240,240,0.96)_56%,_rgba(210,210,210,0.92)_100%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(180deg,rgba(0,0,0,0.12)_0px,rgba(0,0,0,0.12)_1px,transparent_1px,transparent_4px)]" />
          <div className="absolute inset-0 overflow-hidden">
            <section
              key={currentSection.id}
              className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 text-center md:px-14"
              style={currentStyle}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-slate-500">
                {currentSection.label}
              </p>
              <h2 className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (!isLensInteractive) {
                      return;
                    }

                    onOpenSection?.(currentSection);
                  }}
                  disabled={!isLensInteractive}
                  className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/85 px-5 py-3 text-3xl font-semibold tracking-[0.04em] text-black shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-black/25 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:text-5xl"
                >
                  <span>{currentSection.title}</span>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-500 md:text-base">
                    Open
                  </span>
                </button>
              </h2>
              <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-slate-400">
                Click title to inspect specimen
              </p>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-700 md:text-base">
                {currentSection.text}
              </p>
            </section>

            {currentIndex !== nextIndex ? (
              <section
                key={nextSection.id}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 py-10 text-center md:px-14"
                style={nextStyle}
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-slate-500">
                  {nextSection.label}
                </p>
                <h2 className="mt-5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLensInteractive) {
                        return;
                      }

                      onOpenSection?.(nextSection);
                    }}
                    disabled={!isLensInteractive}
                    className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/85 px-5 py-3 text-3xl font-semibold tracking-[0.04em] text-black shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:border-black/25 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] md:text-5xl"
                  >
                    <span>{nextSection.title}</span>
                    <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 md:text-base">
                      Open
                    </span>
                  </button>
                </h2>
                <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-slate-400">
                  Click title to inspect specimen
                </p>
                <p className="mt-5 max-w-md text-sm leading-7 text-slate-700 md:text-base">
                  {nextSection.text}
                </p>
              </section>
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-full border border-black/10" />
          <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_0_28px_rgba(0,0,0,0.14),inset_0_0_72px_rgba(0,0,0,0.22)]" />
        </div>
      </div>
    </>
  );
}

export default ScopeView;

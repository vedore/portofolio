import sections from '../../data/ScopeViewSections.data.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (t) => t * t * (3 - 2 * t);
const SECTION_HOLD_START = 0.38;
const SECTION_HOLD_END = 0.68;
const NEXT_FADE_DELAY = 0.35;

function ScopeView({ scopeProgress, isMobile, onOpenSection }) {
  const activation = clamp((scopeProgress - 0.04) / 0.08);

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

  const currentStyle = {
    opacity: 1 - nextOpacityProgress * 0.9,
    transform: `translateX(${-revolverProgress * 52}%) rotate(${-revolverProgress * 9}deg) scale(${1 - revolverProgress * 0.1})`,
  };
  const nextStyle = {
    opacity: currentIndex === nextIndex ? 0 : nextOpacityProgress,
    transform: `translateX(${(1 - revolverProgress) * 62}%) rotate(${(1 - revolverProgress) * 12}deg) scale(${0.9 + revolverProgress * 0.1})`,
  };

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
      style={{
        opacity: activation,
        transform: `scale(${0.97 + activation * 0.06})`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(20,20,20,0.04)_0%,_rgba(0,0,0,0.74)_60%,_rgba(0,0,0,0.96)_100%)]" />

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
                onClick={() => onOpenSection?.(currentSection)}
                className="pointer-events-auto text-3xl font-semibold tracking-[0.04em] text-black transition-opacity hover:opacity-65 md:text-5xl"
              >
                {currentSection.title}
              </button>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-700 md:text-base">
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
                  onClick={() => onOpenSection?.(nextSection)}
                  className="pointer-events-auto text-3xl font-semibold tracking-[0.04em] text-black transition-opacity hover:opacity-65 md:text-5xl"
                >
                  {nextSection.title}
                </button>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-slate-700 md:text-base">
                {nextSection.text}
              </p>
            </section>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-full border border-black/10" />
        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_0_28px_rgba(0,0,0,0.14),inset_0_0_72px_rgba(0,0,0,0.22)]" />
      </div>
    </div>
  );
}

export default ScopeView;

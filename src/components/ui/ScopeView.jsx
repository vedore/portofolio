import sections from '../../data/ScopeViewSections.data.js';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smoothstep = (t) => t * t * (3 - 2 * t);

function ScopeView({ scopeProgress, isMobile }) {
  const activation = clamp((scopeProgress - 0.04) / 0.16);

  const contentProgress = smoothstep(clamp((scopeProgress - 0.16) / 0.78));

  const lensSize = isMobile ? 'min(84vw, 28rem)' : 'min(58vw, 30rem)';

  const stepCount = Math.max(sections.length - 1, 1);

  const rawPosition = contentProgress * stepCount;

  const currentIndex = Math.min(Math.floor(rawPosition), sections.length - 1);

  const nextIndex = Math.min(currentIndex + 1, sections.length - 1);

  const sectionProgress = currentIndex === nextIndex ? 0 : rawPosition - currentIndex;

  const revolverProgress = smoothstep(sectionProgress);

  const currentSection = sections[currentIndex];

  const nextSection = sections[nextIndex];

  const currentStyle = {
    opacity: 1 - revolverProgress * 3,
    transform: `translateX(${-revolverProgress * 34}%) rotate(${-revolverProgress * 7}deg) scale(${1 - revolverProgress * 0.08})`,
  };
  const nextStyle = {
    opacity: currentIndex === nextIndex ? 0 : revolverProgress,
    transform: `translateX(${(1 - revolverProgress) * 42}%) rotate(${(1 - revolverProgress) * 9}deg) scale(${0.92 + revolverProgress * 0.08})`,
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
            <h2 className="mt-5 text-3xl font-semibold tracking-[0.04em] text-black md:text-5xl">
              {currentSection.title}
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
              <h2 className="mt-5 text-3xl font-semibold tracking-[0.04em] text-black md:text-5xl">
                {nextSection.title}
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

function SectionPage({ section, isOpen, onClose, transitionMs = 520 }) {
  if (!section) {
    return null;
  }

  const whiteWashDuration = Math.round(transitionMs * 1.2);
  const contentDelay = Math.round(transitionMs * 0.4);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-white"
        style={{
          opacity: isOpen ? 1 : 0,
          transition: `opacity ${whiteWashDuration}ms ease`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div
          className="aspect-square rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1)_0%,_rgba(255,255,255,0.98)_58%,_rgba(255,255,255,0.94)_74%,_rgba(255,255,255,0.16)_100%)]"
          style={{
            width: 'min(58vw, 30rem)',
            transform: `scale(${isOpen ? 7.5 : 1})`,
            opacity: isOpen ? 1 : 0,
            transition: `transform ${whiteWashDuration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${Math.round(whiteWashDuration * 0.42)}ms ease`,
          }}
        />
      </div>

      <div
        className="relative z-10 h-full overflow-y-auto"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: `translateY(${isOpen ? '0px' : '24px'})`,
          transition: `opacity ${Math.round(transitionMs * 0.42)}ms ease ${isOpen ? contentDelay : 0}ms, transform ${Math.round(transitionMs * 0.42)}ms cubic-bezier(0.22, 1, 0.36, 1) ${isOpen ? contentDelay : 0}ms`,
        }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 py-8 md:px-10 md:py-10">
          <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
                {section.label}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black md:text-6xl">
                {section.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {section.detailIntro ?? section.text}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium tracking-[0.08em] text-slate-700 transition-colors hover:border-slate-900 hover:text-black"
            >
              Close
            </button>
          </div>

          <div className="grid gap-6 py-8 md:grid-cols-2">
            {(section.detailBlocks ?? []).map((block) => (
              <article
                key={block.heading}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  {block.heading}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                  {block.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionPage;

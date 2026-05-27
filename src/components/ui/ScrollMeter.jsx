function ScrollMeter({ activeIndex, meterPosition, phases = [], onScrub, onSelectPhase }) {
  const maxIndex = Math.max(phases.length - 1, 0);
  const activePhase = phases[activeIndex] ?? phases[0];

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-5 md:bottom-6">
      <div className="flex w-full max-w-4xl items-center gap-3 rounded-full border border-white/60 bg-white/75 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-md">
        <span className="w-20 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-600">
          {activePhase?.label ?? 'Start'}
        </span>
        <input
          type="range"
          min="0"
          max={maxIndex}
          step="0.001"
          value={meterPosition}
          onChange={(event) => onScrub?.(Number(event.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-slate-400 accent-emerald-500"
          aria-label="Page phase"
        />
        <div className="flex gap-1.5">
          {phases.map((phase, index) => (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectPhase?.(index)}
              className={`h-2 rounded-full transition-[width,background-color] duration-200 ${
                index === activeIndex ? 'w-6 bg-emerald-500' : 'w-2 bg-slate-400'
              }`}
              aria-label={`Go to ${phase.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScrollMeter;

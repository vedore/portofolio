import { useCallback, useRef } from 'react';

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function ScrollMeter({ activeIndex, meterPosition, phases = [], onScrub, onSelectPhase }) {
  const trackRef = useRef(null);
  const maxIndex = Math.max(phases.length - 1, 0);
  const activePhase = phases[activeIndex] ?? phases[0];
  const positionRatio = maxIndex > 0 ? clamp(meterPosition / maxIndex) : 0;
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < maxIndex;

  const scrubFromPointer = useCallback((clientX) => {
    const track = trackRef.current;

    if (!track || maxIndex <= 0) {
      return;
    }

    const bounds = track.getBoundingClientRect();
    const ratio = clamp((clientX - bounds.left) / Math.max(bounds.width, 1));

    onScrub?.(ratio * maxIndex);
  }, [maxIndex, onScrub]);

  const handlePointerDown = useCallback((event) => {
    event.preventDefault();
    scrubFromPointer(event.clientX);

    const handlePointerMove = (moveEvent) => {
      scrubFromPointer(moveEvent.clientX);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  }, [scrubFromPointer]);

  const handleKeyDown = useCallback((event) => {
    const step = event.shiftKey ? 1 : 0.25;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onScrub?.(clamp(meterPosition + step, 0, maxIndex));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onScrub?.(clamp(meterPosition - step, 0, maxIndex));
    } else if (event.key === 'Home') {
      event.preventDefault();
      onScrub?.(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      onScrub?.(maxIndex);
    }
  }, [maxIndex, meterPosition, onScrub]);

  return (
    <div
      className="fixed inset-x-0 z-40 flex justify-center px-5"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex w-full max-w-sm items-center gap-3 rounded-full border border-white/60 bg-white/75 px-3 py-2.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm md:max-w-4xl md:px-4 md:py-3 md:backdrop-blur-md">
        <button
          type="button"
          onClick={() => onSelectPhase?.(activeIndex - 1)}
          disabled={!canGoPrevious}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/75 text-lg font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-35 md:hidden"
          aria-label="Previous phase"
        >
          ←
        </button>
        <span className="w-20 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-slate-600">
          {activePhase?.label ?? 'Start'}
        </span>
        <button
          ref={trackRef}
          type="button"
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          className="relative hidden h-6 flex-1 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 md:block"
          role="slider"
          aria-label="Page phase"
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={Number(meterPosition.toFixed(3))}
          aria-valuetext={activePhase?.label ?? 'Start'}
        >
          <span className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-400" />
          <span
            className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-500"
            style={{ width: `${positionRatio * 100}%` }}
          />
          <span
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-emerald-500 shadow-[0_2px_8px_rgba(15,23,42,0.24)]"
            style={{ left: `${positionRatio * 100}%` }}
          />
        </button>
        <button
          type="button"
          onClick={() => onSelectPhase?.(activeIndex + 1)}
          disabled={!canGoNext}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/75 text-lg font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-35 md:hidden"
          aria-label="Next phase"
        >
          →
        </button>
        <div className="hidden gap-1.5 md:flex">
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

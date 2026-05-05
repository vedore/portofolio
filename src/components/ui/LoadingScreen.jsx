import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';

const MIN_LOADING_TIME = 2000;
const FADE_DURATION = 950;

function LoadingScreen() {
  const { active, progress } = useProgress();
  const mountedAtRef = useRef(Date.now());
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const particles = useMemo(
    () => [
      { left: '16%', top: '24%', size: 6, delay: '0s', duration: '8.2s' },
      { left: '29%', top: '66%', size: 4, delay: '0.8s', duration: '9.4s' },
      { left: '47%', top: '32%', size: 5, delay: '1.6s', duration: '8.7s' },
      { left: '63%', top: '74%', size: 3, delay: '0.5s', duration: '10.2s' },
      { left: '78%', top: '42%', size: 5, delay: '1.1s', duration: '9.1s' },
      { left: '86%', top: '20%', size: 4, delay: '2s', duration: '8.5s' },
    ],
    [],
  );

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setIsFadingOut(false);
      mountedAtRef.current = Date.now();
      return undefined;
    }

    if (roundedProgress < 100) {
      return undefined;
    }

    const elapsed = Date.now() - mountedAtRef.current;
    const holdFor = Math.max(MIN_LOADING_TIME - elapsed, 0);

    const fadeTimeoutId = window.setTimeout(() => {
      setIsFadingOut(true);
    }, holdFor);

    const hideTimeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, holdFor + FADE_DURATION);

    return () => {
      window.clearTimeout(fadeTimeoutId);
      window.clearTimeout(hideTimeoutId);
    };
  }, [active, roundedProgress]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[var(--loader-bg)] px-6 transition-opacity ${
        isFadingOut ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_DURATION}ms` }}
    >
      <div className="loader-fx absolute inset-0">
        <div className="loader-wave" />
        <div className={`loader-scan-band ${isFadingOut ? 'loader-scan-band--exit' : ''}`} />

        <div className="loader-particles">
          {particles.map((particle, index) => (
            <span
              key={index}
              className="loader-particle"
              style={{
                left: particle.left,
                top: particle.top,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-[2rem] border border-white/80 bg-white/[0.72] px-7 py-8 shadow-[0_20px_70px_rgba(125,170,196,0.16)] backdrop-blur-md">
        <p className="text-center text-sm font-medium uppercase tracking-[0.24em] text-slate-600">
          Focusing the lens...
        </p>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full border border-sky-100/80 bg-slate-200/90">
          <div
            className="h-full rounded-full bg-gradient-to-r from-black via-gray-300 to-black transition-[width] duration-200 ease-out"
            style={{ width: `${roundedProgress}%` }}
          />
        </div>

        <p className="mt-3 text-center text-sm font-medium tabular-nums text-slate-500">
          {roundedProgress}%
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;

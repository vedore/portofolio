import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, className = '', delay = 0 }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!element || prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -48px', threshold: 0.12 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`detail-reveal ${isVisible ? 'detail-reveal--visible' : ''} ${className}`}
      style={{ '--detail-reveal-delay': `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function DetailHero({ kicker, title, description, aside }) {
  return (
    <Reveal>
      <section className="relative mt-8 grid gap-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white md:grid-cols-[1.25fr_0.75fr] md:items-end md:px-9 md:py-14">
        <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-emerald-500/10" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            {kicker}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            {description}
          </p>
        </div>

        {aside ? (
          <aside className="relative border-l-2 border-emerald-400 pl-5 md:pl-7">
            {aside}
          </aside>
        ) : null}
      </section>
    </Reveal>
  );
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="grid gap-4 border-b border-slate-300 pb-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          {title}
        </h2>
      </div>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-slate-700 md:justify-self-end">
          {description}
        </p>
      ) : null}
    </div>
  );
}

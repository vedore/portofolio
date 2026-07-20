import { useEffect, useState } from 'react';
import AboutPage from './section-pages/AboutPage';
import ProjectsPage from './section-pages/ProjectsPage'
import SkillsPage from './section-pages/SkillsPage';
import ContactPage from './section-pages/ContactPage';
import DefaultSectionPage from './section-pages/DefaultSectionPage';

function renderSectionLayout(section, onNavigateByAction, isNavigating) {
  switch (section.layout) {
    case 'about':
      return (
        <AboutPage
          section={section}
        />
      );
    case 'projects':
      return (
        <ProjectsPage
          section={section}
        />
      );
    case 'skills':
      return (
        <SkillsPage
          section={section}
        />
      );
    case 'contact':
      return (
        <ContactPage
          section={section}
        />
      );
    default:
      return <DefaultSectionPage section={section} />;
  }
}

function SectionPage({
  section,
  isOpen,
  onClose,
  onNavigateByAction,
  isNavigating = false,
  transitionMs = 520,
}) {
  const whiteWashDuration = Math.round(transitionMs * 1.2);
  const contentDelay = Math.round(transitionMs * 0.4);
  const contentTransitionDuration = Math.round(transitionMs * 0.42);
  const [isWhiteWashVisible, setIsWhiteWashVisible] = useState(true);

  useEffect(() => {
    if (!section) {
      setIsWhiteWashVisible(true);
      return undefined;
    }

    setIsWhiteWashVisible(true);

    const washTimerId = window.setTimeout(() => {
      setIsWhiteWashVisible(false);
    }, whiteWashDuration);

    return () => {
      window.clearTimeout(washTimerId);
    };
  }, [isOpen, section, whiteWashDuration]);

  if (!section) {
    return null;
  }

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

      {isWhiteWashVisible && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className="aspect-square rounded-full bg-white"
            style={{
              width: 'min(58vw, 30rem)',
              transform: `scale(${isOpen ? 7.5 : 1})`,
              opacity: isOpen ? 1 : 0,
              transition: `transform ${whiteWashDuration}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${Math.round(whiteWashDuration * 0.42)}ms ease`,
              willChange: 'transform, opacity',
            }}
          />
        </div>
      )}

      <div
        className="relative z-10 h-full overflow-y-auto bg-[#f1f4f0]"
        style={{
          contentVisibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0,
          transition: `opacity ${contentTransitionDuration}ms ease ${isOpen ? contentDelay : 0}ms`,
        }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-6 md:px-10">
          <div className="sticky top-0 z-20 -mx-6 flex items-center justify-between gap-6 border-b border-slate-300 bg-white px-6 py-4 md:-mx-10 md:px-10">
            <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <span className="text-emerald-700">{section.label}</span>
              <span className="mx-3 text-slate-300" aria-hidden="true">/</span>
              <span>{section.title}</span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium tracking-[0.06em] text-slate-700 transition-colors hover:border-slate-900 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Close
            </button>
          </div>

          {renderSectionLayout(section, onNavigateByAction, isNavigating)}
        </div>
      </div>
    </div>
  );
}

export default SectionPage;

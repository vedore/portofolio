const sections = [
  {
    id: 'intro',
    title: 'Hero / Intro',
    text: 'Replace this with your headline, positioning, and short narrative once the scene timing is locked in.',
  },
  {
    id: 'about',
    title: 'About',
    text: 'Use this area for your academic background, lab interests, design approach, or research identity.',
  },
  {
    id: 'projects',
    title: 'Projects',
    text: 'Later, this can evolve into specimen-like project cards or scroll slides without changing the scene foundation.',
  },
  {
    id: 'skills',
    title: 'Skills',
    text: 'Keep this section modular for tooling, methods, software, prototyping, or technical competencies.',
  },
  {
    id: 'research',
    title: 'Research',
    text: 'Reserve this for papers, experiments, publications, notebooks, or ongoing investigations.',
  },
  {
    id: 'contact',
    title: 'Contact',
    text: 'Add your final CTA, email, links, form, or collaboration note here.',
  },
];

function PortfolioSections() {
  return (
    <div className="relative bg-white">
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="border-t border-slate-200/80 px-6 py-24 md:px-10 md:py-32"
        >
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-lab-deep/60">
                Section {String(index + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                {section.title}
              </h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-8 shadow-sm">
              <p className="max-w-2xl text-base leading-8 text-slate-700 md:text-lg">
                {section.text}
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default PortfolioSections;

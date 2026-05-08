function AboutPage({ section }) {
  const name = section.name ?? "João Vedor";
  const role = section.role ?? "Software Developer · Bioinformatics Enthusiast";
  const photo = section.photo ?? "/images/1766444787358.jpeg";

  const heading =
    section.heading ?? "A developer shaped by curiosity, systems, and scientific thinking.";

  const intro = section.detailIntro ?? section.text;

  const highlights = section.highlights ?? [
    "Software Development",
    "Bioinformatics",
    "Database Infrastructure",
    "Full Stack Applications",
    "Research-Driven Thinking",
  ];

  const quickFacts = section.quickFacts ?? [
    {
      label: "Origin",
      value: "Computer Engineering · FCUL",
    },
    {
      label: "Direction",
      value: "Software Systems · Bioinformatics",
    },
  ];

  const focusSteps = section.focusSteps ?? [
    {
      title: "Understand",
      text: "I start by understanding the system, the data, and the problem behind the application.",
    },
    {
      title: "Build",
      text: "I turn ideas into full stack solutions with attention to structure, usability, and maintainability.",
    },
    {
      title: "Refine",
      text: "I improve the details through testing, iteration, and a constant interest in learning better ways to solve problems.",
    },
  ];

  const detailBlocks = section.detailBlocks ?? [];

  const textHighlight =
    "box-decoration-clone rounded-xl bg-emerald-100/80 px-2 py-1 text-black shadow-[inset_0_-0.45em_0_rgba(110,231,183,0.45)]";

  return (
    <div className="grid gap-8 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
      <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(167,243,208,0.35),transparent_34%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)] px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            <img
              src={photo}
              alt={`${name} portrait`}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Specimen 01
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">
              <span className={textHighlight}>{name}</span>
            </h2>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
              {role}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-black md:text-3xl">
            {heading}
          </h3>

          {intro && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-700 md:text-base">
              {intro}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                {fact.label}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {fact.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(209,250,229,0.7),transparent_35%),#ffffff] px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Focus
        </p>

        <div className="mt-5 space-y-3">
          {focusSteps.map((step, index) => (
            <div
              key={step.title}
              className="group rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-5 py-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-900 shadow-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-900">
                    {step.title}
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {step.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {detailBlocks.length > 0 && (
        <div className="grid gap-6 md:col-span-2 md:grid-cols-3">
          {detailBlocks.map((block) => (
            <article
              key={block.heading}
              className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Field Note
              </p>

              <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {block.heading}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                {block.text}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AboutPage;

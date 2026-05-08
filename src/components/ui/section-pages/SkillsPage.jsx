function SkillsPage({ section }) {
  const label = section.label ?? "Specimen 03";
  const title = section.title ?? "Skills";

  const intro =
    section.detailIntro ??
    section.text ??
    "Tooling, prototyping, software, and craft distilled into a focused technical inventory.";

  const skillGroups = section.skillGroups ?? [
    {
      heading: "Frontend Systems",
      note: "Interfaces, component structure, styling, and interaction.",
      skills: [
        "React",
        "Vue",
        "Vite",
        "Tailwind CSS",
        "SCSS",
        "JavaScript",
        "TypeScript",
        "Responsive UI",
      ],
    },
    {
      heading: "Backend and Infrastructure",
      note: "APIs, authentication, databases, and deployment logic.",
      skills: [
        "Node.js",
        "Cloudflare Workers",
        "REST APIs",
        "Authentication",
        "Turnstile",
        "JWT Sessions",
        "Docker",
        "Linux",
      ],
    },
    {
      heading: "Data and Databases",
      note: "Structured data, querying, persistence, and system organization.",
      skills: [
        "SQL",
        "Oracle",
        "Database Design",
        "Data Modeling",
        "Query Optimization",
        "Bioinformatics Data",
      ],
    },
    {
      heading: "Creative Development",
      note: "Visual systems, motion, spatial interfaces, and prototypes.",
      skills: [
        "Three.js",
        "Blender",
        "Motion Design",
        "Interactive Prototypes",
        "Visual Systems",
        "Portfolio Experiments",
      ],
    },
  ];

  const workflow = section.workflow ?? [
    {
      title: "Prototype",
      text: "I test ideas early through layouts, small interactions, and technical experiments.",
    },
    {
      title: "Structure",
      text: "I organize components, data, and interfaces so the project can grow without becoming fragile.",
    },
    {
      title: "Polish",
      text: "I refine motion, spacing, accessibility, and edge cases until the experience feels stable.",
    },
  ];

  const detailBlocks = section.detailBlocks ?? [];

  const textHighlight =
    "box-decoration-clone rounded-xl bg-emerald-100/80 px-2 py-1 text-black shadow-[inset_0_-0.45em_0_rgba(110,231,183,0.45)]";

  return (
    <div className="grid gap-8 py-8">
      <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(167,243,208,0.35),transparent_34%),linear-gradient(to_bottom,#f8fafc,#f1f5f9)] px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)] md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            {label}
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black md:text-5xl">
            <span className={textHighlight}>{title}</span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-700 md:text-base">
            {intro}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-emerald-100 bg-white/80 px-5 py-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Inventory Status
          </p>

          <p className="mt-3 text-xl font-semibold tracking-tight text-black">
            Tools grouped by how I use them.
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Rather than a plain list, this section organizes skills as
            practical instruments: interface work, systems, data, and creative
            development.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((group, index) => (
          <article
            key={group.heading}
            className="group rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                  Instrument Set {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-black">
                  {group.heading}
                </h3>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-900 shadow-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {group.note && (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {group.note}
              </p>
            )}

            {group.skills?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-emerald-900 transition group-hover:border-emerald-200 group-hover:bg-emerald-50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      {workflow.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(209,250,229,0.7),transparent_35%),#ffffff] px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Workflow
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {workflow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-5 py-4 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-900 shadow-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-900">
                  {step.title}
                </p>

                <p className="mt-2 text-sm leading-7 text-slate-700">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {detailBlocks.length > 0 && (
        <section className="grid gap-6 md:grid-cols-3">
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
        </section>
      )}
    </div>
  );
}

export default SkillsPage;
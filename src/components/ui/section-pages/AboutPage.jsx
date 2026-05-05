function AboutPage({ section }) {
  const name = section.name ?? "João Vedor";
  const role = section.role ?? "Software Developer Inspiring BioInformatic";
  const photo = section.photo ?? "/images/1766444787358.jpeg";

  return (
    <div className="grid gap-8 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-start">
      <section className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
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
              About
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">
              {name}
            </h2>

            <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-slate-500">
              {role}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
            A closer look at the person behind the interface.
          </h3>

          <p className="mt-5 text-sm leading-7 text-slate-700 md:text-base">
            {section.detailIntro ?? section.text}
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {(section.highlights ?? [
            "Interactive interfaces",
            "Frontend systems",
            "3D web experiences",
            "Clean visual structure",
          ]).map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <aside className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Focus
        </p>

        <div className="mt-5 space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Observe
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              I start by understanding the idea, the user, and the purpose behind the interface.
            </p>
          </div>

          <div className="border-b border-slate-200 pb-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Structure
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              I organize layouts, components, and interactions so the experience feels clear and intentional.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Refine
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              I improve the details until the design, motion, and technical behavior feel aligned.
            </p>
          </div>
        </div>
      </aside>

      <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
        {(section.detailBlocks ?? []).map((block) => (
          <article
            key={block.heading}
            className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {block.heading}
            </h3>

            <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
              {block.text}
            </p>
          </article>
        ))}
      </div>

      <div className="md:col-span-2 rounded-[2rem] border border-slate-200 bg-black px-6 py-7 text-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Next
        </p>

        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Want to see how this way of thinking becomes real work? Explore the projects behind the interface.
          </p>

          <a
            href="#projects"
            className="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
          >
            View Projects
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
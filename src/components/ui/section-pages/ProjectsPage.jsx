function ProjectsPage({ section }) {
    const label = section.label ?? "Specimen 02";
    const title = section.title ?? "Projects";

    const intro =
        section.detailIntro ??
        section.text ??
        "Selected builds, experiments, and case studies.";

    const projects = section.projects ?? [];

    const detailBlocks = section.detailBlocks ?? [];

    const textHighlight =
        "box-decoration-clone rounded-xl bg-emerald-100/80 px-2 py-1 text-black shadow-[inset_0_-0.45em_0_rgba(110,231,183,0.45)]";

    const accessKindClasses = {
        document:
            "border-emerald-200 bg-emerald-50/90 text-emerald-950 hover:border-emerald-300 hover:bg-emerald-100/80",
        github:
            "border-slate-200 bg-slate-50/90 text-slate-900 hover:border-slate-300 hover:bg-slate-100/90",
    };

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
                        Observation Mode
                    </p>

                    <p className="mt-3 text-xl font-semibold tracking-tight text-black">
                        Builds, experiments, and systems under the lens.
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        Each project is treated like a focused sample: what it is, what it
                        explores, and what technologies shaped it.
                    </p>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-3">
                {projects.map((project, index) => (
                    <article
                        key={project.title}
                        className="group flex min-h-[22rem] flex-col rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                                    Case File {String(index + 1).padStart(2, "0")}
                                </p>

                                <h3 className="mt-4 text-xl font-semibold tracking-tight text-black">
                                    {project.title}
                                </h3>
                            </div>

                            {project.year && (
                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                                    {project.year}
                                </span>
                            )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.type && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    {project.type}
                                </span>
                            )}

                            {project.status && (
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-emerald-900">
                                    {project.status}
                                </span>
                            )}
                        </div>

                        <p className="mt-5 flex-1 text-sm leading-7 text-slate-700">
                            {project.summary}
                        </p>

                        {project.tags?.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-500"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {project.links?.length > 0 && (
                            <div className="mt-7 border-t border-slate-200 pt-5">
                                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                                    Specimen Access
                                </p>

                                <div className="mt-4 grid gap-3">
                                    {project.links.map((link) => {
                                        const kindClasses =
                                            accessKindClasses[link.kind] ??
                                            accessKindClasses.github;

                                        return (
                                            <a
                                                key={`${project.title}-${link.label}`}
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={`flex items-start justify-between gap-4 rounded-[1.25rem] border px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 ${kindClasses}`}
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold tracking-tight">
                                                        {link.label}
                                                    </p>
                                                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-current/70">
                                                        {link.description}
                                                    </p>
                                                </div>

                                                <span
                                                    aria-hidden="true"
                                                    className="mt-0.5 text-base font-medium text-current/75"
                                                >
                                                    ↗
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </article>
                ))}
            </section>

            {detailBlocks.length > 0 && (
                <section className="grid gap-6 md:grid-cols-2">
                    {detailBlocks.map((block) => (
                        <article
                            key={block.heading}
                            className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(209,250,229,0.7),transparent_35%),#ffffff] px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]"
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

export default ProjectsPage;

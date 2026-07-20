import { DetailHero, Reveal, SectionHeading } from './DetailPageElements.jsx';

function ProjectLinks({ project, inverted = false }) {
  if (!project.links?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {project.links.map((link) => (
        <a
          key={`${project.title}-${link.label}`}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
            inverted
              ? 'border-white/25 text-white hover:border-emerald-300 hover:text-emerald-300'
              : 'border-slate-300 text-slate-800 hover:border-emerald-500 hover:text-emerald-800'
          }`}
        >
          {link.label}
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}

function ProjectsPage({ section }) {
  const intro = section.detailIntro ?? section.text ?? 'Selected builds and case studies.';
  const projects = section.projects ?? [];
  const [featuredProject, ...otherProjects] = projects;

  return (
    <div className="space-y-16 pb-16">
      <DetailHero
        kicker="Selected work / Case files"
        title="Interfaces, systems, and research under the lens."
        description={intro}
        aside={(
          <dl className="grid grid-cols-2 gap-5">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Case files
              </dt>
              <dd className="mt-2 text-3xl font-semibold text-white">{projects.length}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Focus
              </dt>
              <dd className="mt-2 text-base font-semibold leading-6 text-white">
                Product and research
              </dd>
            </div>
          </dl>
        )}
      />

      {featuredProject ? (
        <Reveal>
          <section>
            <SectionHeading
              eyebrow="Featured specimen"
              title="A closer look at the work"
            />

            <article className="mt-8 grid gap-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white md:grid-cols-[1.25fr_0.75fr] md:px-9 md:py-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <span>Case File 01</span>
                  {featuredProject.year ? <span>{featuredProject.year}</span> : null}
                </div>
                <h3 className="mt-5 text-3xl font-semibold tracking-tight md:text-4xl">
                  {featuredProject.title}
                </h3>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  {featuredProject.summary}
                </p>
                <div className="mt-7">
                  <ProjectLinks project={featuredProject} inverted />
                </div>
              </div>

              <div className="border-t border-white/15 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <dl className="grid gap-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Type
                    </dt>
                    <dd className="mt-2 text-base font-medium text-white">
                      {featuredProject.type}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Status
                    </dt>
                    <dd className="mt-2 text-base font-medium text-white">
                      {featuredProject.status}
                    </dd>
                  </div>
                </dl>

                {featuredProject.tags?.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {featuredProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          </section>
        </Reveal>
      ) : null}

      {otherProjects.length > 0 ? (
        <Reveal>
          <section className="rounded-3xl bg-white px-6 py-8 md:px-8 md:py-10">
            <SectionHeading
              eyebrow="More observations"
              title="Additional case files"
            />

            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {otherProjects.map((project, index) => (
                <article key={project.title} className="flex flex-col border-t-2 border-emerald-500 pt-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Case File {String(index + 2).padStart(2, '0')}
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                        {project.title}
                      </h3>
                    </div>
                    {project.year ? (
                      <span className="text-sm font-semibold tabular-nums text-slate-500">
                        {project.year}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-4 flex-1 text-base leading-7 text-slate-600">
                    {project.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[project.type, project.status, ...(project.tags ?? [])]
                      .filter(Boolean)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <ProjectLinks project={project} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </div>
  );
}

export default ProjectsPage;

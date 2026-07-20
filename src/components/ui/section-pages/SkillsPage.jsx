import { DetailHero, Reveal, SectionHeading } from './DetailPageElements.jsx';

function SkillsPage({ section }) {
  const intro =
    section.detailIntro ??
    section.text ??
    'Tools and practices used to build readable, stable software.';
  const skillGroups = section.skillGroups ?? [];
  const workflow = section.workflow ?? [];
  const skillCount = skillGroups.reduce((total, group) => total + (group.skills?.length ?? 0), 0);

  return (
    <div className="space-y-16 pb-16">
      <DetailHero
        kicker="Technical inventory / Capabilities"
        title="Tools organized around the work they enable."
        description={intro}
        aside={(
          <dl className="grid grid-cols-2 gap-5">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Capability areas
              </dt>
              <dd className="mt-2 text-3xl font-semibold text-white">
                {skillGroups.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Instruments
              </dt>
              <dd className="mt-2 text-3xl font-semibold text-white">{skillCount}</dd>
            </div>
          </dl>
        )}
      />

      <Reveal>
        <section className="rounded-3xl bg-white px-6 py-8 md:px-8 md:py-10">
          <SectionHeading
            eyebrow="Capability map"
            title="From interface to infrastructure"
          />

          <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {skillGroups.map((group, index) => (
              <article key={group.heading} className="border-t-2 border-emerald-500 pt-5">
                <div className="flex items-start justify-between gap-5">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                    {group.heading}
                  </h3>
                  <span className="text-sm font-semibold tabular-nums text-emerald-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {group.note ? (
                  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                    {group.note}
                  </p>
                ) : null}

                {group.skills?.length ? (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${group.heading} skills`}>
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {workflow.length > 0 ? (
        <Reveal>
          <section className="overflow-hidden rounded-3xl bg-emerald-950 px-6 py-9 text-white md:px-9 md:py-11">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Working method
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
              A simple process for turning uncertain ideas into stable work.
            </h2>

            <ol className="mt-9 grid gap-7 border-t border-white/15 pt-7 md:grid-cols-3">
              {workflow.map((step, index) => (
                <li key={step.title} className="md:border-l md:border-white/15 md:pl-6 md:first:border-l-0 md:first:pl-0">
                  <span className="text-sm font-semibold tabular-nums text-emerald-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-emerald-50/75">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      ) : null}
    </div>
  );
}

export default SkillsPage;

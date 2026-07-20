import { DetailHero, Reveal, SectionHeading } from './DetailPageElements.jsx';

function AboutPage({ section }) {
  const name = section.name ?? 'João Vedor';
  const role = section.role ?? 'Software Developer · Bioinformatics Enthusiast';
  const photo = section.photo ?? '/images/1766444787358.jpeg';
  const heading =
    section.heading ?? 'A developer shaped by curiosity, systems, and scientific thinking.';
  const intro = section.detailIntro ?? section.text;
  const highlights = section.highlights ?? [];
  const quickFacts = section.quickFacts ?? [];
  const experience = section.experience ?? [];
  const education = section.education ?? [];

  return (
    <div className="space-y-16 pb-16">
      <DetailHero
        kicker={`Profile / ${section.detailHeader ?? 'Made in Portugal'}`}
        title={heading}
        description={intro}
        aside={(
          <div>
            <div className="flex items-center gap-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <img
                  src={photo}
                  alt={`${name} portrait`}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-white">{name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{role}</p>
              </div>
            </div>

            {quickFacts.length > 0 ? (
              <dl className="mt-6 grid gap-4 border-t border-white/15 pt-5 sm:grid-cols-2 md:grid-cols-1">
                {quickFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium leading-6 text-slate-200">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {section.cvHref ? (
              <a
                href={section.cvHref}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-emerald-300 hover:text-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                Download CV <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        )}
      />

      <Reveal>
        <section className="rounded-3xl bg-white px-6 py-8 md:px-8 md:py-10">
          <SectionHeading
            eyebrow="Experience"
            title="Applied work"
          />

          <div className="mt-8 grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold text-slate-950">Core areas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-950"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <ol className="border-y border-slate-300">
              {experience.map((item, index) => (
                <li
                  key={`${item.role}-${item.organization}`}
                  className="grid gap-3 border-b border-slate-300 py-6 last:border-b-0 sm:grid-cols-[3rem_1fr]"
                >
                  <span className="text-sm font-semibold tabular-nums text-emerald-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                      {item.role}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-emerald-800">
                      {item.organization}
                    </p>
                    <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
                      {item.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      {education.length > 0 ? (
        <Reveal>
          <section className="rounded-3xl bg-emerald-950 px-6 py-9 text-white md:px-8 md:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              Education
            </p>
            <div className="mt-7 grid gap-8 border-t border-white/15 pt-7 md:grid-cols-2">
              {education.map((item) => (
                <article key={item.degree}>
                  <h2 className="text-xl font-semibold tracking-tight">{item.degree}</h2>
                  <p className="mt-2 text-sm font-medium text-emerald-200">{item.institution}</p>
                  {item.detail ? (
                    <p className="mt-3 text-base text-emerald-50/80">{item.detail}</p>
                  ) : null}
                  {item.thesis ? (
                    <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50/65">
                      Thesis: {item.thesis}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </div>
  );
}

export default AboutPage;

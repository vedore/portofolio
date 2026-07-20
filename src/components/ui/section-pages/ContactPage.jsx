import { DetailHero, Reveal, SectionHeading } from './DetailPageElements.jsx';

function ContactPage({ section }) {
  const intro =
    section.detailIntro ??
    section.text ??
    'A direct route for project inquiries, collaborations, and technical conversations.';
  const contactMethods = section.contactMethods ?? [];
  const primaryMethod = contactMethods.find((method) => method.kind === 'primary');
  const secondaryMethods = contactMethods.filter((method) => method !== primaryMethod);

  return (
    <div className="space-y-16 pb-16">
      <DetailHero
        kicker="Open channel / Contact"
        title="Let’s build something thoughtful."
        description={intro}
        aside={(
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Signal status
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Open to conversations
            </p>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Software, data, research systems, and carefully built digital experiences.
            </p>
          </div>
        )}
      />

      {primaryMethod ? (
        <Reveal>
          <section>
            <SectionHeading
              eyebrow="Preferred contact"
              title="Start with an email"
            />

            <a
              href={primaryMethod.href}
              className="group mt-8 grid gap-6 rounded-3xl bg-emerald-950 px-6 py-8 text-white transition-colors hover:bg-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600 md:grid-cols-[1fr_auto] md:items-end md:px-9 md:py-10"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  {primaryMethod.label}
                </p>
                <p className="mt-4 break-all text-2xl font-semibold tracking-tight md:text-4xl">
                  {primaryMethod.value}
                </p>
                {primaryMethod.description ? (
                  <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/75">
                    {primaryMethod.description}
                  </p>
                ) : null}
              </div>
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-xl transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          </section>
        </Reveal>
      ) : null}

      {secondaryMethods.length > 0 ? (
        <Reveal>
          <section className="rounded-3xl bg-white px-6 py-8 md:px-8 md:py-10">
            <SectionHeading
              eyebrow="Professional channels"
              title="Code and background"
            />

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {secondaryMethods.map((method, index) => (
                <a
                  key={method.href}
                  href={method.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group border-t-2 border-slate-300 pt-5 transition-colors hover:border-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Channel {String(index + 2).padStart(2, '0')}
                      </p>
                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                        {method.label}
                      </h3>
                    </div>
                    <span className="text-xl text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-700" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <p className="mt-2 break-all text-base font-medium text-slate-700">
                    {method.value}
                  </p>
                  {method.description ? (
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                      {method.description}
                    </p>
                  ) : null}
                </a>
              ))}
            </div>
          </section>
        </Reveal>
      ) : null}
    </div>
  );
}

export default ContactPage;

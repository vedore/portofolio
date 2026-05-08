function ContactPage({ section }) {
  const label = section.label ?? "Specimen 04";
  const title = section.title ?? "Contact";

  const intro =
    section.detailIntro ??
    section.text ??
    "Email, links, and collaboration details revealed as the final field of view inside the lens.";

  const contactMethods = section.contactMethods ?? [];

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
            Signal Status
          </p>

          <p className="mt-3 text-xl font-semibold tracking-tight text-black">
            Open channel for new conversations.
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Whether it is about a project, collaboration, research direction, or
            technical idea, this is the cleanest point of contact.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(209,250,229,0.7),transparent_35%),#ffffff] px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Final Field
          </p>

          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-black">
            Let’s continue the observation outside the lens.
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-700">
            I am open to conversations around software, data, research-driven
            systems, visual interfaces, and projects that need thoughtful
            technical execution.
          </p>

          <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 px-5 py-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Preferred Contact
            </p>

            <p className="mt-2 text-sm leading-7 text-emerald-950">
              Email is usually the best way to reach me for serious project
              inquiries, academic conversations, or collaboration ideas.
            </p>
          </div>
        </aside>

        <div className="grid gap-4">
          {contactMethods.map((method, index) => (
            <a
              key={method.href}
              href={method.href}
              target={method.href?.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                method.href?.startsWith("mailto:") ? undefined : "noreferrer"
              }
              className={
                method.kind === "primary"
                  ? "group rounded-[2rem] border border-emerald-200 bg-emerald-50/80 px-6 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-100"
                  : "group rounded-[2rem] border border-slate-200 bg-white px-6 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-slate-900 hover:bg-slate-950"
              }
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p
                    className={
                      method.kind === "primary"
                        ? "text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-emerald-700"
                        : "text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-slate-400 transition group-hover:text-slate-300"
                    }
                  >
                    Channel {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3
                    className={
                      method.kind === "primary"
                        ? "mt-3 text-xl font-semibold tracking-tight text-emerald-950"
                        : "mt-3 text-xl font-semibold tracking-tight text-black transition group-hover:text-white"
                    }
                  >
                    {method.label}
                  </h3>

                  <p
                    className={
                      method.kind === "primary"
                        ? "mt-1 text-sm font-medium text-emerald-900"
                        : "mt-1 text-sm font-medium text-slate-500 transition group-hover:text-slate-300"
                    }
                  >
                    {method.value}
                  </p>
                </div>

                <span
                  className={
                    method.kind === "primary"
                      ? "text-sm font-semibold text-emerald-900 transition group-hover:translate-x-0.5"
                      : "text-sm font-semibold text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white"
                  }
                >
                  ↗
                </span>
              </div>

              {method.description && (
                <p
                  className={
                    method.kind === "primary"
                      ? "mt-4 text-sm leading-7 text-emerald-950/75"
                      : "mt-4 text-sm leading-7 text-slate-600 transition group-hover:text-slate-300"
                  }
                >
                  {method.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>

      {detailBlocks.length > 0 && (
        <section className="grid gap-6 md:grid-cols-2">
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

export default ContactPage;
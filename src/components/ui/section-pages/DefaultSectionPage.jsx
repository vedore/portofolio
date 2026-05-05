function DefaultSectionPage({ section }) {
  return (
    <div className="grid gap-6 py-8 md:grid-cols-2">
      {(section.detailBlocks ?? []).map((block) => (
        <article
          key={block.heading}
          className="rounded-[2rem] border border-slate-200 bg-slate-50 px-6 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {block.heading}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">{block.text}</p>
        </article>
      ))}
    </div>
  );
}

export default DefaultSectionPage;

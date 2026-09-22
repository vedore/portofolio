function LensTransition({ lensEntry }) {
  const { darkness, field } = lensEntry;

  if (darkness === 0 || field === 1) return null;

  return (
    <div
      className="lens-vignette pointer-events-none fixed inset-0 z-10"
      aria-hidden="true"
      style={{ opacity: darkness }}
    />
  );
}

export default LensTransition;

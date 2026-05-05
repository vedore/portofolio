const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function LensTransition({ progress, isMobile }) {
  const activation = clamp((progress - 0.72) / 0.23);
  const overlayOpacity = activation;
  const irisScale = 1 + activation * (isMobile ? 10 : 14);
  const blurAmount = activation * (isMobile ? 10 : 16);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: overlayOpacity }}
    >
      <div
        className="lens-vignette absolute inset-0 transition-opacity duration-200"
        style={{ backdropFilter: `blur(${blurAmount}px)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full border border-cyan-100/30 bg-[radial-gradient(circle_at_center,_rgba(84,181,255,0.30)_0%,_rgba(10,25,38,0.68)_55%,_rgba(0,0,0,0.96)_100%)] shadow-lens"
          style={{
            width: '18rem',
            height: '18rem',
            transform: `scale(${irisScale})`,
            opacity: 0.78 + activation * 0.22,
          }}
        />
      </div>
    </div>
  );
}

export default LensTransition;

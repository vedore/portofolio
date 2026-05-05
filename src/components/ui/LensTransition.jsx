const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function LensTransition({ progress, isMobile }) {

  const approach = clamp((progress - 0.8) / 0.026);

  const redEntry = clamp((progress - 0.922) / 0.02);

  const scopeReveal = clamp((progress - 0.92) / 0.038);

  const overlayOpacity = clamp((progress - 0.9) / 0.058);

  const blurAmount = approach * (isMobile ? 2 : 4);

  const redGlowOpacity = (0.18 + approach * 0.3) * Math.pow(1 - scopeReveal, 0);

  const redFillOpacity = redEntry * (1 - scopeReveal) * Math.pow(1 - scopeReveal, 0.01);

  const redCoreScale = 0.7 + approach * 0.4 + redEntry * 1.6;

  const blackIrisScale = 0.45 + scopeReveal * (isMobile ? 4.4 : 6.2);

  const blackIrisOpacity = scopeReveal;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      aria-hidden="true"
      style={{ opacity: overlayOpacity }}
    >
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: scopeReveal }}
        />

      <div
        className="lens-vignette absolute inset-0 transition-opacity duration-200"
        style={{ backdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none' }}
      />

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,90,90,0.44)_0%,_rgba(150,0,0,0.24)_38%,_rgba(35,0,0,0.06)_72%,_transparent_100%)]"
        style={{ opacity: redGlowOpacity }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full border border-red-900/35 bg-[radial-gradient(circle_at_center,_rgba(255,120,120,0.92)_0%,_rgba(180,20,20,0.9)_34%,_rgba(70,0,0,0.86)_64%,_rgba(12,0,0,0.94)_100%)] shadow-[0_0_80px_rgba(120,0,0,0.35)]"
          style={{
            width: '18rem',
            height: '18rem',
            transform: `scale(${redCoreScale})`,
            opacity: redFillOpacity,
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full border border-black/40 bg-[radial-gradient(circle_at_center,_rgba(24,24,24,0.2)_0%,_rgba(8,8,8,0.82)_56%,_rgba(0,0,0,1)_100%)] shadow-[0_0_80px_rgba(0,0,0,0.48)]"
          style={{
            width: '18rem',
            height: '18rem',
            transform: `scale(${blackIrisScale})`,
            opacity: blackIrisOpacity,
          }}
        />
      </div>
    </div>
  );
}

export default LensTransition;

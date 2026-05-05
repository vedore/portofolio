import { useProgress } from '@react-three/drei';

function LoadingScreen() {
  const { active, progress } = useProgress();

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex min-h-screen items-center justify-center bg-slate-50/75 backdrop-blur-sm">
      <div className="rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 shadow-lg">
        <p className="text-sm uppercase tracking-[0.24em] text-lab-deep/65">Loading scene</p>
        <p className="mt-2 text-lg font-medium text-slate-900">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default LoadingScreen;

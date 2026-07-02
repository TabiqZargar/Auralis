import { usePlayerStore } from "@/store";
import { useMemo } from "react";

export function DynamicBackground() {
  const coverUrl = usePlayerStore((s) => s.currentTrack?.coverUrl);

  const styles = useMemo(() => {
    if (!coverUrl) {
      return {
        "--bg": "linear-gradient(135deg, #0a0a0a, #1a1a2e)",
      } as React.CSSProperties;
    }
    return {
      "--bg": `
        radial-gradient(ellipse 80% 60% at 50% 0%, var(--dynamic-glow, rgba(29,185,84,0.08)) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 30% 100%, var(--dynamic-glow, rgba(29,185,84,0.05)) 0%, transparent 50%),
        linear-gradient(180deg, var(--dynamic-bg-from, #0f0f0f), var(--dynamic-bg-to, #050505))
      `,
    } as React.CSSProperties;
  }, [coverUrl]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 transition-all duration-700 ease-in-out"
      style={styles}
      aria-hidden="true"
    >
      {coverUrl && (
        <div
          className="absolute inset-0 opacity-[0.04] transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(60px) saturate(1.5)",
          }}
        />
      )}
    </div>
  );
}

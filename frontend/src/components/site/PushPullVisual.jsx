import { useEffect, useRef, useState } from "react";
import { APPROACH } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * PushPullBackground
 *
 * Full-cover cinematic background driven by `mode` (pull | push).
 * Layers (bottom → top):
 *   - Night owl still (Pull)     → visible in "night-still"
 *   - Day owl still (Push)       → visible in "day-still"
 *   - Night→Day transition video → plays in "n2d"
 *   - Day→Night transition video → plays in "d2n"
 *   - Vignette / dark overlay for readable foreground
 *
 * Never instantly swaps stills. Always: transition video → final still.
 * Under prefers-reduced-motion, swaps happen instantly with no video playback.
 */
export default function PushPullBackground({ mode, overlay = true }) {
  const reduced = usePrefersReducedMotion();
  const n2dRef = useRef(null); // night → day
  const d2nRef = useRef(null); // day → night
  const prevModeRef = useRef(mode);
  const [layer, setLayer] = useState(mode === "push" ? "day-still" : "night-still");

  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = mode;
    if (prev === mode) return;

    if (reduced) {
      setLayer(mode === "push" ? "day-still" : "night-still");
      return;
    }

    if (mode === "push") {
      const v = n2dRef.current;
      if (!v) {
        setLayer("day-still");
        return;
      }
      setLayer("n2d");
      try {
        v.currentTime = 0;
        const p = v.play();
        if (p && p.catch) p.catch(() => setLayer("day-still"));
      } catch (e) {
        setLayer("day-still");
      }
    } else {
      const v = d2nRef.current;
      if (!v) {
        setLayer("night-still");
        return;
      }
      setLayer("d2n");
      try {
        v.currentTime = 0;
        const p = v.play();
        if (p && p.catch) p.catch(() => setLayer("night-still"));
      } catch (e) {
        setLayer("night-still");
      }
    }
  }, [mode, reduced]);

  const onN2DEnded = () => setLayer("day-still");
  const onD2NEnded = () => setLayer("night-still");

  useEffect(() => {
    [n2dRef.current, d2nRef.current].forEach((v) => {
      if (!v) return;
      try {
        v.load();
        v.currentTime = 0;
      } catch (e) {
        /* ignore preload seek errors */
      }
    });
  }, []);

  const baseImg =
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-out";
  const baseVid =
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-[500ms] ease-out";

  return (
    <div
      data-testid={APPROACH.visual}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <img
        data-testid={APPROACH.imgNight}
        src="/images/owl-night.jpg"
        alt=""
        className={baseImg}
        style={{ opacity: layer === "night-still" ? 1 : 0 }}
      />
      <img
        data-testid={APPROACH.imgDay}
        src="/images/owl-day.jpg"
        alt=""
        className={baseImg}
        style={{ opacity: layer === "day-still" ? 1 : 0 }}
      />
      <video
        ref={n2dRef}
        data-testid={APPROACH.videoN2D}
        muted
        playsInline
        preload="auto"
        onEnded={onN2DEnded}
        tabIndex={-1}
        className={baseVid}
        style={{ opacity: layer === "n2d" ? 1 : 0 }}
      >
        <source src="/videos/night-to-day.webm" type="video/webm" />
        <source src="/videos/night-to-day.mp4" type="video/mp4" />
      </video>
      <video
        ref={d2nRef}
        data-testid={APPROACH.videoD2N}
        muted
        playsInline
        preload="auto"
        onEnded={onD2NEnded}
        tabIndex={-1}
        className={baseVid}
        style={{ opacity: layer === "d2n" ? 1 : 0 }}
      >
        <source src="/videos/day-to-night.webm" type="video/webm" />
        <source src="/videos/day-to-night.mp4" type="video/mp4" />
      </video>

      {overlay && (
        <>
          {/* Subtle wash to keep foreground readable, tinted by mode */}
          <div
            className="absolute inset-0 transition-colors duration-[700ms] ease-out"
            style={{
              background:
                mode === "push"
                  ? "linear-gradient(180deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0.05) 25%, rgba(10,10,11,0.35) 70%, rgba(10,10,11,0.9) 100%)"
                  : "linear-gradient(180deg, rgba(10,10,11,0.45) 0%, rgba(10,10,11,0.15) 25%, rgba(10,10,11,0.55) 70%, rgba(10,10,11,0.95) 100%)",
            }}
          />
          {/* Left-side text-readability wash (stronger in daylight) */}
          <div
            className="absolute inset-0 transition-opacity duration-[700ms] ease-out"
            style={{
              background:
                mode === "push"
                  ? "linear-gradient(90deg, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.75) 25%, rgba(10,10,11,0.4) 45%, rgba(10,10,11,0.1) 60%, rgba(10,10,11,0) 72%)"
                  : "linear-gradient(90deg, rgba(10,10,11,0.55) 0%, rgba(10,10,11,0.3) 28%, rgba(10,10,11,0.08) 52%, rgba(10,10,11,0) 68%)",
              opacity: 1,
            }}
          />
          <div className="noise-overlay" />
        </>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { APPROACH } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * PushPullVisual
 * Layer stack:
 *  - Night still image (Pull)
 *  - Day still image (Push)
 *  - night→day transition video (plays when going Pull → Push)
 *  - day→night transition video (plays when going Push → Pull)
 *
 * Rules:
 *  - Never instantly swap images
 *  - Play the appropriate transition video, then reveal the final still
 *  - Crossfade edges for cinematic feel
 *  - Reduced motion → instant swap, no video playback
 */
export default function PushPullVisual({ mode }) {
  const reduced = usePrefersReducedMotion();
  const n2dRef = useRef(null); // night → day (plays on push)
  const d2nRef = useRef(null); // day → night (plays on pull)
  const prevModeRef = useRef(mode);
  // Which layer is currently on top
  const [layer, setLayer] = useState(mode === "push" ? "day-still" : "night-still");

  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = mode;
    if (prev === mode) return;

    // Under reduced motion: skip transitions
    if (reduced) {
      setLayer(mode === "push" ? "day-still" : "night-still");
      return;
    }

    if (mode === "push") {
      // going Pull → Push: play night→day
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
      // going Push → Pull: play day→night
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

  // Preload first frames of the transition videos so they render instantly on click
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

  const baseImgClass =
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-[700ms] ease-out";
  const baseVidClass =
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-[500ms] ease-out";

  return (
    <div
      data-testid={APPROACH.visual}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        aspectRatio: "16 / 9",
        background: "#050506",
        border: "1px solid var(--mo-line)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.04), 0 40px 80px -30px rgba(0,0,0,0.7)",
      }}
    >
      {/* Night still (Pull) */}
      <img
        data-testid={APPROACH.imgNight}
        src="/images/owl-night.jpg"
        alt="Owl awake at night — Pull mode: stories that draw people in"
        className={baseImgClass}
        style={{ opacity: layer === "night-still" ? 1 : 0 }}
      />
      {/* Day still (Push) */}
      <img
        data-testid={APPROACH.imgDay}
        src="/images/owl-day.jpg"
        alt="Owl asleep during the day — Push mode: content people scroll past"
        className={baseImgClass}
        style={{ opacity: layer === "day-still" ? 1 : 0 }}
      />

      {/* Night → Day transition video */}
      <video
        ref={n2dRef}
        data-testid={APPROACH.videoN2D}
        muted
        playsInline
        preload="auto"
        onEnded={onN2DEnded}
        aria-hidden="true"
        tabIndex={-1}
        className={baseVidClass}
        style={{ opacity: layer === "n2d" ? 1 : 0 }}
      >
        <source src="/videos/night-to-day.webm" type="video/webm" />
        <source src="/videos/night-to-day.mp4" type="video/mp4" />
      </video>

      {/* Day → Night transition video */}
      <video
        ref={d2nRef}
        data-testid={APPROACH.videoD2N}
        muted
        playsInline
        preload="auto"
        onEnded={onD2NEnded}
        aria-hidden="true"
        tabIndex={-1}
        className={baseVidClass}
        style={{ opacity: layer === "d2n" ? 1 : 0 }}
      >
        <source src="/videos/day-to-night.webm" type="video/webm" />
        <source src="/videos/day-to-night.mp4" type="video/mp4" />
      </video>

      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 80% at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      <div className="noise-overlay" aria-hidden="true" />

      {/* Corner meta label */}
      <div
        aria-live="polite"
        className="absolute left-4 top-4 rounded-full border px-3 py-1.5 text-[10px] tracking-[0.24em] uppercase"
        style={{
          borderColor: "rgba(255,255,255,0.18)",
          background: "rgba(10,10,11,0.55)",
          backdropFilter: "blur(10px)",
          color: "var(--mo-fg)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        <span style={{ color: "var(--mo-accent)" }}>●</span>{" "}
        {mode === "push" ? "Daylight // Pushing" : "Midnight // Pulling"}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { HERO } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * HeroScrubVideo
 * A muted, non-autoplaying background video whose currentTime is driven
 * linearly by horizontal cursor / touch position, with eased interpolation
 * for buttery-smooth scrubbing (Apple-style).
 */
export default function HeroScrubVideo({ src }) {
  const videoRef = useRef(null);
  const targetTimeRef = useRef(0);
  const smoothedTimeRef = useRef(0);
  const durationRef = useRef(0);
  const rafRef = useRef(null);
  const seekingRef = useRef(false);
  const lastSeekRef = useRef(0);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();

  // Initial setup: pause, prepare first frame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    v.pause();

    const handleMeta = () => {
      durationRef.current = v.duration || 0;
      try {
        v.currentTime = 0;
      } catch (e) {
        /* ignore initial seek errors */
      }
    };
    const handleLoaded = () => setReady(true);
    const handleSeeked = () => {
      seekingRef.current = false;
    };

    v.addEventListener("loadedmetadata", handleMeta);
    v.addEventListener("loadeddata", handleLoaded);
    v.addEventListener("seeked", handleSeeked);
    // Some browsers fire canplay before loadedmetadata reliably
    v.addEventListener("canplay", handleLoaded);

    return () => {
      v.removeEventListener("loadedmetadata", handleMeta);
      v.removeEventListener("loadeddata", handleLoaded);
      v.removeEventListener("seeked", handleSeeked);
      v.removeEventListener("canplay", handleLoaded);
    };
  }, []);

  // Interaction + RAF loop
  useEffect(() => {
    if (reduced) return; // no scrubbing under reduced motion

    const updateTarget = (clientX) => {
      const w = window.innerWidth || 1;
      // Map the scrub in reverse so the owl looks toward the cursor
      const p = 1 - Math.max(0, Math.min(1, clientX / w));
      targetTimeRef.current = p * (durationRef.current || 0);
    };

    const onMouse = (e) => updateTarget(e.clientX);
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) updateTarget(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });

    const EASE = 0.14; // 0..1 — lower = smoother/slower, higher = snappier
    const DEADBAND = 0.02; // ~half a frame at 30fps; only seek if beyond this
    const SEEK_INTERVAL = 32; // ms — cap seek frequency to ~30 hz

    const loop = (t) => {
      const v = videoRef.current;
      const d = durationRef.current;

      if (v && d > 0) {
        // ease smoothedTime toward targetTime
        const diff = targetTimeRef.current - smoothedTimeRef.current;
        smoothedTimeRef.current += diff * EASE;

        const cur = v.currentTime;
        const delta = smoothedTimeRef.current - cur;

        if (
          !seekingRef.current &&
          Math.abs(delta) > DEADBAND &&
          t - lastSeekRef.current > SEEK_INTERVAL
        ) {
          seekingRef.current = true;
          lastSeekRef.current = t;
          try {
            // fastSeek gives keyframe-nearest jump on some browsers.
            // We generated all-intra keyframes so precise currentTime is safe too.
            const next = Math.max(0, Math.min(d - 0.033, smoothedTimeRef.current));
            v.currentTime = next;
          } catch (e) {
            seekingRef.current = false;
          }
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchstart", onTouch);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* The scrubbing video — always visible, only seeks, never plays */}
      <video
        ref={videoRef}
        data-testid={HERO.scrubVideo}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          filter: "contrast(1.02) saturate(0.95)",
        }}
      >
        {/* High-quality 1080p H.264 first — every modern browser (Windows
            Chrome/Edge, macOS Safari) decodes + scrubs it smoothly with
            hardware acceleration. The 720p VP9 WebM is only a fallback for
            the rare browser without H.264 support. */}
        <source src={src} type="video/mp4" />
        <source src="/videos/left-right.webm" type="video/webm" />
      </video>
      {/* Soft edge wash — keeps text legible without darkening the owl */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 22% 45%, rgba(10,10,11,0) 0%, rgba(10,10,11,0.15) 55%, rgba(10,10,11,0.55) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0) 18%, rgba(10,10,11,0) 62%, rgba(10,10,11,0.9) 100%)",
        }}
      />
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

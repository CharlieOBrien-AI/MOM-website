import { useEffect, useRef, useState } from "react";
import { HERO } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const DESKTOP_SRC = "/videos/owl-hero.mp4";
const MOBILE_SRC = "/videos/owl-hero-mobile.mp4";
const POSTER_SRC = "/images/owl-hero-poster.jpg";

function useIsCompact() {
  const [compact, setCompact] = useState(
    () => window.matchMedia("(max-width: 1023px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setCompact(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return compact;
}

/**
 * HeroScrubVideo
 * Desktop (lg+): muted, non-autoplaying video whose currentTime is driven by
 * horizontal cursor position with eased interpolation (Apple-style scrubbing).
 * Mobile/tablet: plain autoplaying looped video — no scrubbing.
 */
export default function HeroScrubVideo() {
  const compact = useIsCompact();
  return compact ? <MobileHeroVideo /> : <DesktopScrubVideo />;
}

function MobileHeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        data-testid="hero-mobile-video"
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        poster={POSTER_SRC}
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "contrast(1.02) saturate(0.95)" }}
      >
        <source src={MOBILE_SRC} type="video/mp4" />
        <source src="/videos/owl-hero-mobile.webm" type="video/webm" />
      </video>
      {/* Bottom fade blends the video into the page background below */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,11,0.25) 0%, rgba(10,10,11,0) 20%, rgba(10,10,11,0) 70%, #06060a 100%)",
        }}
      />
      <div className="noise-overlay" aria-hidden="true" />
    </div>
  );
}

function DesktopScrubVideo() {
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
      const p = Math.max(0, Math.min(1, clientX / w));
      targetTimeRef.current = p * (durationRef.current || 0);
    };

    const onMouse = (e) => updateTarget(e.clientX);

    window.addEventListener("mousemove", onMouse, { passive: true });

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
            // All-intra keyframes make precise currentTime seeks cheap.
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* The scrubbing video — always visible, only seeks, never plays.
          1080p all-intra H.264 — hardware-decoded on Windows & macOS. */}
      <video
        ref={videoRef}
        data-testid={HERO.scrubVideo}
        muted
        playsInline
        preload="auto"
        poster={POSTER_SRC}
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
        <source src={DESKTOP_SRC} type="video/mp4" />
        <source src="/videos/owl-hero.webm" type="video/webm" />
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

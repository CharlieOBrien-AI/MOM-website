import { useEffect, useRef, useState } from "react";
import { HERO } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import FrameSequenceCanvas from "./FrameSequenceCanvas";

// ---------------------------------------------------------------------------
// Hero owl — mouse-scrubbed head turn.
//
// DESKTOP: pure image-sequence rendered to a <canvas>. We preload 167
// high-quality WebP stills (1920×1080, q=85, ≈12 MB total) and blit the
// active frame every animation tick. There is NO video element in the
// desktop path → no video decoder, no seek latency, no codec fallbacks:
// scrubbing is perfectly smooth on every device and every pixel is the
// source WebP quality.
//
// MOBILE (viewport ≤ 1023 px): unchanged. Plays the existing
// autoplay-loop `owl-hero-mobile.mp4/.webm` — small file, no scrubbing.
// ---------------------------------------------------------------------------
const HERO_FRAMES_BASE = "/hero-frames/frame_";
const HERO_FRAME_COUNT = 167;
const POSTER_SRC = "/images/owl-hero-poster.jpg";
const MOBILE_SRC = "/videos/owl-hero-mobile.mp4";

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
 * Desktop (lg+): canvas-driven image sequence, currentFrame follows the
 * horizontal cursor position with eased interpolation (Apple-style).
 * Mobile/tablet: plain autoplaying looped video — no scrubbing.
 */
export default function HeroScrubVideo() {
  const compact = useIsCompact();
  return compact ? <MobileHeroVideo /> : <DesktopScrubHero />;
}

function MobileHeroVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Instant poster layer — first frame JPG behind the video */}
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
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
      >
        <source src={MOBILE_SRC} type="video/mp4" />
        <source src="/videos/owl-hero-mobile.webm" type="video/webm" />
      </video>
    </div>
  );
}

function DesktopScrubHero() {
  // Fractional frame index the canvas reads on every rAF tick. We ease
  // `smoothedRef` toward `targetRef` (driven by cursor X) with a fixed
  // easing factor — feels like Apple's scroll-scrub UX.
  const targetRef = useRef(0);
  const smoothedRef = useRef(0);
  const idxRef = useRef(0);
  const rafRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      idxRef.current = 0;
      return;
    }

    const updateTarget = (clientX) => {
      const w = window.innerWidth || 1;
      // Inverted mapping: t=0 owl looks RIGHT, t=end owl looks LEFT —
      // cursor on the right maps to t=0 and the head follows the cursor.
      const p = 1 - Math.max(0, Math.min(1, clientX / w));
      targetRef.current = p * (HERO_FRAME_COUNT - 1);
    };

    const onMouse = (e) => updateTarget(e.clientX);
    const onTouch = (e) => {
      if (e.touches && e.touches[0]) updateTarget(e.touches[0].clientX);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const EASE = 0.14; // 0..1 — lower = smoother/slower, higher = snappier

    const loop = () => {
      const diff = targetRef.current - smoothedRef.current;
      smoothedRef.current += diff * EASE;
      idxRef.current = smoothedRef.current;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        // Fade the entire hero layer's bottom edge into transparency so the
        // site-wide parallax nightscape (position: fixed, z-index: 0) blends
        // through the last strip of the hero instead of ending in a hard cut
        // against the next section. Using a mask (not a colour overlay) so
        // it dissolves the actual pixels rather than tinting them.
        WebkitMaskImage:
          "linear-gradient(180deg, black 0%, black 72%, rgba(0,0,0,0.85) 84%, rgba(0,0,0,0.5) 92%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(180deg, black 0%, black 72%, rgba(0,0,0,0.85) 84%, rgba(0,0,0,0.5) 92%, rgba(0,0,0,0) 100%)",
      }}
    >
      <FrameSequenceCanvas
        frameCount={HERO_FRAME_COUNT}
        framesBase={HERO_FRAMES_BASE}
        posterSrc={POSTER_SRC}
        idxRef={idxRef}
        priorityCount={16}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit: "cover" }}
        testId={HERO.scrubVideo}
      />
    </div>
  );
}

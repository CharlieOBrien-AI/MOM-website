import { useCallback, useEffect, useRef, useState } from "react";
import { HERO } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Progressive quality ladder — the low tier (~few MB) buffers in seconds so
// the owl is scrub-interactive almost instantly; each higher tier streams in
// the background and is swapped in (frame-synced) once fully buffered.
const STAGES = [
  "/videos/owl-hero-low.mp4", // 640×360  — instant interactivity
  "/videos/owl-hero-mid.mp4", // 1280×720 — first upgrade
  "/videos/owl-hero.mp4", // 1920×1080 — final quality
];
const MOBILE_SRC = "/videos/owl-hero-mobile.mp4";
const POSTER_SRC = "/images/owl-hero-poster.jpg";
const VIDEO_FILTER = "contrast(1.02) saturate(0.95)";

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
 * Quality is progressive: 360p first (instantly interactive), then 720p,
 * then 1080p — each swapped in seamlessly once fully buffered.
 * Mobile/tablet: plain autoplaying looped video — no scrubbing.
 */
export default function HeroScrubVideo() {
  const compact = useIsCompact();
  return compact ? <MobileHeroVideo /> : <DesktopScrubVideo />;
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
        style={{ filter: VIDEO_FILTER }}
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
        style={{ filter: VIDEO_FILTER }}
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
  const videoEls = useRef([]);
  const activeRef = useRef(0); // index of the video the RAF loop drives
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const smoothedTimeRef = useRef(0);
  const rafRef = useRef(null);
  const seekingRef = useRef(false);
  const lastSeekRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [stage, setStage] = useState(0); // visible quality tier
  const [loadStage, setLoadStage] = useState(0); // highest tier with src attached
  const reduced = usePrefersReducedMotion();

  const isFullyBuffered = useCallback((v) => {
    if (!v) return false;
    const d = v.duration;
    if (!Number.isFinite(d) || d <= 0) return false;
    const b = v.buffered;
    return b.length > 0 && b.end(b.length - 1) >= d - 0.5;
  }, []);

  // Base tier setup: interactive as soon as the first frames can render.
  useEffect(() => {
    const v = videoEls.current[0];
    if (!v) return;

    v.muted = true;
    v.pause();

    const handleMeta = () => {
      if (activeRef.current === 0) durationRef.current = v.duration || 0;
      try {
        v.currentTime = 0;
      } catch (e) {
        /* ignore initial seek errors */
      }
    };
    const handleLoaded = () => setReady(true);

    v.addEventListener("loadedmetadata", handleMeta);
    v.addEventListener("loadeddata", handleLoaded);
    v.addEventListener("canplay", handleLoaded);

    return () => {
      v.removeEventListener("loadedmetadata", handleMeta);
      v.removeEventListener("loadeddata", handleLoaded);
      v.removeEventListener("canplay", handleLoaded);
    };
  }, []);

  // Clear the seek gate whenever any tier finishes a seek.
  useEffect(() => {
    const els = videoEls.current.filter(Boolean);
    const onSeeked = () => {
      seekingRef.current = false;
    };
    els.forEach((v) => v.addEventListener("seeked", onSeeked));
    return () => els.forEach((v) => v.removeEventListener("seeked", onSeeked));
  }, []);

  // Progressive upgrade chain: when the current tier is fully buffered,
  // start streaming the next; when THAT is fully buffered, frame-sync it to
  // the live scrub time and swap it in (crossfade, identical frame).
  useEffect(() => {
    const v = videoEls.current[loadStage];
    if (!v) return;

    if (loadStage > 0) {
      try {
        if (v.readyState === 0 && v.networkState !== 2) v.load();
      } catch (e) {}
    }

    let interval = null;
    let done = false;

    const tryAdvance = () => {
      if (done || !isFullyBuffered(v)) return;
      done = true;
      if (interval) clearInterval(interval);

      const finish = () => {
        if (loadStage > 0) {
          activeRef.current = loadStage;
          durationRef.current = v.duration || durationRef.current;
          setStage(loadStage);
        }
        if (loadStage + 1 < STAGES.length) setLoadStage(loadStage + 1);
      };

      if (loadStage === 0) {
        finish();
        return;
      }

      const cur = videoEls.current[activeRef.current]?.currentTime || 0;
      const target = Math.max(0, Math.min(cur, (v.duration || cur) - 0.033));
      if (Math.abs(v.currentTime - target) < 0.01) {
        finish();
        return;
      }
      const onSeeked = () => finish();
      v.addEventListener("seeked", onSeeked, { once: true });
      try {
        v.currentTime = target;
      } catch (e) {
        v.removeEventListener("seeked", onSeeked);
        finish();
      }
    };

    v.addEventListener("progress", tryAdvance);
    v.addEventListener("canplaythrough", tryAdvance);
    interval = setInterval(tryAdvance, 800);
    tryAdvance();

    return () => {
      v.removeEventListener("progress", tryAdvance);
      v.removeEventListener("canplaythrough", tryAdvance);
      if (interval) clearInterval(interval);
    };
  }, [loadStage, isFullyBuffered]);

  // Interaction + RAF loop — always drives whichever tier is active.
  useEffect(() => {
    if (reduced) return; // no scrubbing under reduced motion

    const updateTarget = (clientX) => {
      const w = window.innerWidth || 1;
      // Inverted mapping: t=0 owl looks RIGHT, t=end owl looks LEFT —
      // so cursor on the right maps to t=0 and the head follows the cursor.
      const p = 1 - Math.max(0, Math.min(1, clientX / w));
      targetTimeRef.current = p * (durationRef.current || 0);
    };

    const onMouse = (e) => updateTarget(e.clientX);

    window.addEventListener("mousemove", onMouse, { passive: true });

    const EASE = 0.14; // 0..1 — lower = smoother/slower, higher = snappier
    const DEADBAND = 0.02; // ~half a frame at 30fps; only seek if beyond this
    const SEEK_INTERVAL = 32; // ms — cap seek frequency to ~30 hz

    const loop = (t) => {
      const v = videoEls.current[activeRef.current];
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
          const next = Math.max(0, Math.min(d - 0.033, smoothedTimeRef.current));
          // Never seek into an unbuffered region — seeking past the download
          // head stalls the decoder and makes the page feel frozen.
          let allowed = isFullyBuffered(v);
          if (!allowed) {
            const b = v.buffered;
            for (let i = 0; i < b.length; i++) {
              if (next >= b.start(i) && next <= b.end(i) - 0.1) {
                allowed = true;
                break;
              }
            }
          }
          if (allowed) {
            seekingRef.current = true;
            lastSeekRef.current = t;
            try {
              // All-intra keyframes make precise currentTime seeks cheap.
              v.currentTime = next;
            } catch (e) {
              seekingRef.current = false;
            }
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
  }, [reduced, isFullyBuffered]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Instant poster layer — the first video frame as a plain JPG so the
          hero never renders black while the video is still buffering. */}
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: VIDEO_FILTER }}
      />
      {/* Quality tiers, stacked low → high. Only the active tier is visible;
          upgrades crossfade in on an identical, frame-synced image. */}
      {STAGES.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoEls.current[i] = el;
          }}
          data-testid={i === 0 ? HERO.scrubVideo : `hero-scrub-video-q${i}`}
          muted
          playsInline
          preload="auto"
          poster={i === 0 ? POSTER_SRC : undefined}
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          src={i > 0 && i <= loadStage ? src : undefined}
          className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
          style={{
            opacity: ready && i === stage ? 1 : 0,
            transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
            filter: VIDEO_FILTER,
            zIndex: i + 1,
          }}
        >
          {i === 0 ? (
            <>
              <source src={src} type="video/mp4" />
              <source src="/videos/owl-hero-low.webm" type="video/webm" />
            </>
          ) : null}
        </video>
      ))}
      {/* Soft edge wash — keeps text legible without darkening the owl */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          zIndex: 5,
          background:
            "radial-gradient(120% 90% at 22% 45%, rgba(10,10,11,0) 0%, rgba(10,10,11,0.15) 55%, rgba(10,10,11,0.55) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          zIndex: 5,
          background:
            "linear-gradient(180deg, rgba(10,10,11,0.35) 0%, rgba(10,10,11,0) 18%, rgba(10,10,11,0) 62%, rgba(10,10,11,0.9) 100%)",
        }}
      />
      <div className="noise-overlay" aria-hidden="true" style={{ zIndex: 6 }} />
    </div>
  );
}

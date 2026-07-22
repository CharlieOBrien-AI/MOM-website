import { useCallback, useEffect, useRef, useState } from "react";
import { HERO } from "@/constants/testIds";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Two-tier quality: the page starts directly on a GOOD 1080p encode
// (streams fast, scrub-interactive within seconds), then the BEST 1080p
// file is force-downloaded in the background via fetch() (Chrome suspends
// <video> preloading, so fetch->blob guarantees the full file arrives)
// and swapped in frame-synced once complete.
const BASE_MP4 = "/videos/owl-hero-base.mp4"; // 1920×1080 all-intra CRF26
const BASE_WEBM = "/videos/owl-hero-mid.webm"; // fallback for no-H.264 browsers
const FULL_SRC = "/videos/owl-hero.mp4"; // 1920×1080 all-intra QP21 (best)
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
 * No CSS filters or overlay washes — the video renders as-is.
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

function DesktopScrubVideo() {
  const baseRef = useRef(null);
  const hdRef = useRef(null);
  const activeRef = useRef(null); // the <video> the RAF loop drives
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const smoothedTimeRef = useRef(0);
  const rafRef = useRef(null);
  const seekingRef = useRef(false);
  const lastSeekRef = useRef(0);
  const blobUrlRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [hd, setHd] = useState(false);
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
    const v = baseRef.current;
    if (!v) return;

    activeRef.current = v;
    v.muted = true;
    v.pause();

    const handleMeta = () => {
      if (activeRef.current === v) durationRef.current = v.duration || 0;
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

  // Clear the seek gate whenever either tier finishes a seek.
  useEffect(() => {
    const els = [baseRef.current, hdRef.current].filter(Boolean);
    const onSeeked = () => {
      seekingRef.current = false;
    };
    els.forEach((v) => v.addEventListener("seeked", onSeeked));
    return () => els.forEach((v) => v.removeEventListener("seeked", onSeeked));
  }, []);

  // Best-quality upgrade: once the base tier is fully buffered (or after a
  // grace period), force-download the 1080p file with fetch() — immune to
  // the browser suspending <video> preloads — then swap it in frame-synced.
  useEffect(() => {
    const base = baseRef.current;
    const hdVid = hdRef.current;
    if (!base || !hdVid) return;
    // No H.264 support (rare) → stay on the base tier's WebM.
    if (hdVid.canPlayType('video/mp4; codecs="avc1.640028"') === "") return;

    let cancelled = false;
    let started = false;
    let timer = null;
    let interval = null;

    const startFetch = () => {
      if (started || cancelled) return;
      started = true;
      if (interval) clearInterval(interval);
      if (timer) clearTimeout(timer);

      fetch(FULL_SRC)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("bad status"))))
        .then((blob) => {
          if (cancelled) return;
          const url = URL.createObjectURL(blob);
          blobUrlRef.current = url;

          const onReady = () => {
            if (cancelled) return;
            const swap = () => {
              if (cancelled) return;
              activeRef.current = hdVid;
              durationRef.current = hdVid.duration || durationRef.current;
              setHd(true);
            };
            const cur = baseRef.current?.currentTime || 0;
            const target = Math.max(
              0,
              Math.min(cur, (hdVid.duration || cur) - 0.033)
            );
            if (Math.abs(hdVid.currentTime - target) < 0.01) {
              swap();
              return;
            }
            hdVid.addEventListener("seeked", swap, { once: true });
            try {
              hdVid.currentTime = target;
            } catch (e) {
              hdVid.removeEventListener("seeked", swap);
              swap();
            }
          };

          hdVid.addEventListener("loadeddata", onReady, { once: true });
          hdVid.src = url;
          try {
            hdVid.load();
          } catch (e) {}
        })
        .catch(() => {
          /* keep base tier */
        });
    };

    const check = () => {
      if (isFullyBuffered(base)) startFetch();
    };
    base.addEventListener("progress", check);
    base.addEventListener("canplaythrough", check);
    interval = setInterval(check, 800);
    timer = setTimeout(startFetch, 15000); // don't wait forever if the base stalls
    check();

    return () => {
      cancelled = true;
      base.removeEventListener("progress", check);
      base.removeEventListener("canplaythrough", check);
      if (interval) clearInterval(interval);
      if (timer) clearTimeout(timer);
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [isFullyBuffered]);

  // Interaction + RAF loop — drives whichever tier is active.
  useEffect(() => {
    if (reduced) return; // no scrubbing under reduced motion

    // Idle-tracking state: the moment the visitor last moved the cursor,
    // and the "anchor" (last user-driven scrub position) around which the
    // Owl-Wake-Up idle oscillation is centered. When the cursor is idle
    // for > IDLE_MS, we start gently modulating targetTime around that
    // anchor so the owl performs a subtle head-tilt / breathing motion
    // instead of freezing on a single frame.
    let lastMoveT = performance.now();
    // Initialised to null; we resolve it lazily to duration/2 the first
    // time the RAF loop sees a valid duration, so pre-interaction idle
    // sway is centered on the middle of the video (a natural resting
    // pose) rather than the leftmost frame.
    let idleAnchor = null;

    const updateTarget = (clientX) => {
      const w = window.innerWidth || 1;
      // Inverted mapping: t=0 owl looks RIGHT, t=end owl looks LEFT —
      // so cursor on the right maps to t=0 and the head follows the cursor.
      const p = 1 - Math.max(0, Math.min(1, clientX / w));
      targetTimeRef.current = p * (durationRef.current || 0);
      idleAnchor = targetTimeRef.current;
      lastMoveT = performance.now();
    };

    const onMouse = (e) => updateTarget(e.clientX);

    window.addEventListener("mousemove", onMouse, { passive: true });

    const EASE = 0.14; // 0..1 — lower = smoother/slower, higher = snappier
    const DEADBAND = 0.02; // ~half a frame at 30fps; only seek if beyond this
    const SEEK_INTERVAL = 32; // ms — cap seek frequency to ~30 hz

    // Owl Wake-Up parameters — kept intentionally small so the animation
    // reads as "alive" rather than "distracting".
    const IDLE_MS = 1800;          // engage after ~1.8s of no cursor motion
    const IDLE_RAMP_MS = 900;      // fade the oscillation in over ~0.9s
    const IDLE_AMPLITUDE_FRAC = 0.045; // ~4.5% of the video duration per side
    const IDLE_FREQ_HZ = 0.32;     // one full sway every ~3.1s
    const IDLE_TILT_FREQ_HZ = 0.09; // super-slow envelope so no two sways feel identical

    const loop = (t) => {
      const v = activeRef.current;
      const d = durationRef.current;

      if (v && d > 0) {
        // -------- Owl Wake-Up: idle oscillation ------------------------
        // Once the cursor has been still long enough, gently modulate
        // targetTime around the last user-driven anchor. Two sinusoids
        // (fast sway + slow envelope) combine into a natural,
        // non-repetitive head motion. The oscillation ramps in smoothly
        // over IDLE_RAMP_MS so engagement is imperceptible.
        if (idleAnchor === null) idleAnchor = d / 2;
        const idleFor = t - lastMoveT;
        if (idleFor > IDLE_MS) {
          const ramp = Math.min(1, (idleFor - IDLE_MS) / IDLE_RAMP_MS);
          const eased = ramp * ramp * (3 - 2 * ramp); // smoothstep 0→1
          const secs = t / 1000;
          const sway = Math.sin(secs * IDLE_FREQ_HZ * 2 * Math.PI);
          const env  = 0.7 + 0.3 * Math.sin(secs * IDLE_TILT_FREQ_HZ * 2 * Math.PI);
          const amp  = d * IDLE_AMPLITUDE_FRAC * eased * env;
          const oscillated = idleAnchor + sway * amp;
          // Keep well inside the timeline — never clip to the ends.
          targetTimeRef.current = Math.max(
            d * IDLE_AMPLITUDE_FRAC,
            Math.min(d - d * IDLE_AMPLITUDE_FRAC, oscillated)
          );
        }

        // ease smoothedTime toward targetTime
        const diff = targetTimeRef.current - smoothedTimeRef.current;
        smoothedTimeRef.current += diff * EASE;

        const cur = v.currentTime;

        if (
          !seekingRef.current &&
          Math.abs(smoothedTimeRef.current - cur) > DEADBAND &&
          t - lastSeekRef.current > SEEK_INTERVAL
        ) {
          const next = Math.max(0, Math.min(d - 0.033, smoothedTimeRef.current));
          // Seek only inside buffered ranges; if the target is past the
          // download head, ride the buffer edge instead — this keeps the owl
          // tracking AND nudges the browser to keep fetching.
          let seekTo = null;
          if (isFullyBuffered(v)) {
            seekTo = next;
          } else {
            const b = v.buffered;
            for (let i = 0; i < b.length; i++) {
              if (next >= b.start(i) && next <= b.end(i) - 0.1) {
                seekTo = next;
                break;
              }
            }
            if (seekTo === null && b.length > 0 && next > b.end(b.length - 1) - 0.1) {
              seekTo = Math.max(0, b.end(b.length - 1) - 0.15);
            }
          }
          if (seekTo !== null && Math.abs(seekTo - cur) > DEADBAND) {
            seekingRef.current = true;
            lastSeekRef.current = t;
            try {
              // All-intra keyframes make precise currentTime seeks cheap.
              v.currentTime = seekTo;
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
      {/* Instant poster layer — the first video frame as a plain JPG so the
          hero never renders black while the video is still buffering. */}
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Base tier — good quality, streams immediately. */}
      <video
        ref={baseRef}
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
          opacity: ready && !hd ? 1 : 0,
          transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <source src={BASE_MP4} type="video/mp4" />
        <source src={BASE_WEBM} type="video/webm" />
      </video>
      {/* Best tier — 1080p, blob-loaded in the background, fades in on an
          identical frame once fully downloaded. */}
      <video
        ref={hdRef}
        data-testid="hero-scrub-video-hd"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover will-change-[opacity]"
        style={{
          opacity: hd ? 1 : 0,
          transition: "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

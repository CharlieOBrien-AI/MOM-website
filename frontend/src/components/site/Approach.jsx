import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GlassSurface from "@/components/glass/GlassSurface";
import PremiumToggle from "./PremiumToggle";
import Reveal from "./Reveal";
import { APPROACH } from "@/constants/testIds";

// ---------------------------------------------------------------------------
// Midnight Owl workspace video.
// Frame 0  = NIGHT (moon, awake owl, dark room)
// Last frame = DAY (sunshine, sleeping owl, bright room)
// Video is 1920 × 1080 (16:9), all-intra H.264 (CRF 15) encoded from the
// original 121-frame WebP sequence for smooth bidirectional scrubbing.
// Duration ≈ 5s @ 24fps.
//
// Slow-connection strategy: until the video is FULLY buffered, the Push/Pull
// transition is a smooth crossfade between two stills (night/day keyframes).
// Once the whole file is buffered, the real video scrub takes over — so the
// animation is never janky mid-download.
// ---------------------------------------------------------------------------
const WORKSPACE_VIDEO_URL = "/videos/owl-workspace.mp4";
const WORKSPACE_POSTER_URL = "/images/owl-workspace-night.jpg";
const WORKSPACE_DAY_URL = "/images/owl-workspace-day.jpg";

// Natural aspect of the workspace video — the wrapper matches it exactly
// so percentage-anchored overlays map 1:1 onto video pixels (zero crop).
const VIDEO_ASPECT = "1920 / 1080";

// The monitor in the frame is slightly tilted (perspective), so the screen
// is a QUAD, not an axis-aligned rectangle. Corners measured from the video
// frame (as % of frame width/height), inset so the card sits just inside
// the LG monitor bezel. The Examples card is perspective-mapped onto this
// quad with a computed CSS matrix3d — a true "projected on the screen" fit.
const SCREEN_QUAD = {
  tl: [48.0, 29.9],
  tr: [79.4, 30.7],
  br: [79.4, 66.9],
  bl: [48.0, 66.0],
};
// Pre-transform card rectangle (% of wrapper) — proportions close to the
// quad's natural size so content isn't visibly distorted by the mapping.
const CARD_W = 32.6; // %
const CARD_H = 39.5; // %

// Solves the 8-DOF homography that maps rect corners -> quad corners and
// returns it as a CSS matrix3d() string (transform-origin must be 0 0).
function computeHomography(src, dst) {
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i];
    const [X, Y] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]);
    b.push(X);
    A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]);
    b.push(Y);
  }
  for (let i = 0; i < 8; i++) {
    let mx = i;
    for (let r = i + 1; r < 8; r++) {
      if (Math.abs(A[r][i]) > Math.abs(A[mx][i])) mx = r;
    }
    [A[i], A[mx]] = [A[mx], A[i]];
    [b[i], b[mx]] = [b[mx], b[i]];
    const p = A[i][i];
    if (Math.abs(p) < 1e-12) return null;
    for (let r = i + 1; r < 8; r++) {
      const f = A[r][i] / p;
      for (let c = i; c < 8; c++) A[r][c] -= f * A[i][c];
      b[r] -= f * b[i];
    }
  }
  const hc = new Array(8);
  for (let i = 7; i >= 0; i--) {
    let s = b[i];
    for (let c = i + 1; c < 8; c++) s -= A[i][c] * hc[c];
    hc[i] = s / A[i][i];
  }
  const [a, bb, c, d, e, f, g, hh] = hc;
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

// The LG monitor in the frame has near-square corners — the Examples card
// mirrors that (small radius, scales with the projected screen size).
const MONITOR_RADIUS = "clamp(3px, 0.42vw, 8px)";

const TRANSITION_MS = 2600; // duration of the night↔day scrub

// Push-mode example reels — user-supplied ads. Tiles autoplay a muted
// preview; the play button opens the full 720p version WITH sound.
const PUSH_VIDEOS = [
  {
    preview: "/videos/examples/push-1.mp4",
    full: "/videos/examples/push-1-hd.mp4",
  },
  {
    preview: "/videos/examples/push-2.mp4",
    full: "/videos/examples/push-2-hd.mp4",
  },
  {
    preview: "/videos/examples/push-3.mp4",
    full: "/videos/examples/push-3-hd.mp4",
  },
];

// Pull-mode example reels — narrative/story-led work. Same interaction
// contract as PUSH_VIDEOS so the tile grid uses one shared VideoTile.
const PULL_VIDEOS = [
  {
    preview: "/videos/examples/pull-1.mp4",
    full: "/videos/examples/pull-1-hd.mp4",
  },
  {
    preview: "/videos/examples/pull-2.mp4",
    full: "/videos/examples/pull-2-hd.mp4",
  },
  {
    preview: "/videos/examples/pull-3.mp4",
    full: "/videos/examples/pull-3-hd.mp4",
  },
];

/**
 * Approach — Push / Pull section.
 */
export default function Approach() {
  const [mode, setMode] = useState("pull");
  const [lightbox, setLightbox] = useState(null); // src of the full-quality video

  // Perspective mapping of the Examples card onto the (tilted) monitor screen.
  const wrapRef = useRef(null);
  const [cardXf, setCardXf] = useState(null);
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return;
      const w = (CARD_W / 100) * W;
      const h = (CARD_H / 100) * H;
      const src = [
        [0, 0],
        [w, 0],
        [w, h],
        [0, h],
      ];
      const dst = [SCREEN_QUAD.tl, SCREEN_QUAD.tr, SCREEN_QUAD.br, SCREEN_QUAD.bl].map(
        ([px, py]) => [(px / 100) * W, (py / 100) * H]
      );
      setCardXf(computeHomography(src, dst));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const copy = {
    pull: {
      metaphor: "Like a crowd gathering around a great performer.",
      examples: [
        { kicker: "01 · Story", title: "The $40k hiring mistake" },
        { kicker: "02 · Behind", title: "Why we killed our best feature" },
        { kicker: "03 · Lesson", title: "What I wish I knew at year one" },
      ],
    },
    push: {
      metaphor: "Like handing flyers to strangers.",
      examples: [],
    },
  };
  const active = copy[mode];

  // -------------------------------------------------------------------------
  // Video scrub controller — manual rAF-driven currentTime in both directions.
  // -------------------------------------------------------------------------
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const modeRef = useRef(mode);
  const seekReadyRef = useRef(true);

  // videoLive = the file is fully buffered AND parked on the right frame;
  // until then the still-image crossfade handles Push/Pull transitions.
  const [videoLive, setVideoLive] = useState(false);
  const videoLiveRef = useRef(false);

  const scrubTo = useCallback((targetTime, durationMs = TRANSITION_MS) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const video = videoRef.current;
    if (!video) return;
    const total = video.duration;
    if (!Number.isFinite(total) || total <= 0) return;

    try {
      video.pause();
    } catch (_) {}

    const clamped = Math.max(0, Math.min(total, targetTime));
    const startCT = video.currentTime;
    const delta = clamped - startCT;

    if (Math.abs(delta) < 0.005) {
      try {
        video.currentTime = clamped;
      } catch (_) {}
      return;
    }

    const startPerf = performance.now();
    const step = (now) => {
      const t = Math.min((now - startPerf) / durationMs, 1);
      // ease-in-out cubic
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      // Only issue a new seek once the previous one has completed — flooding
      // currentTime every frame overwhelms the decoder and causes the lag
      // seen on Windows. Frames are skipped as needed; wall-clock easing
      // keeps the perceived motion smooth.
      if (seekReadyRef.current || t >= 1) {
        seekReadyRef.current = false;
        try {
          video.currentTime = startCT + delta * e;
        } catch (_) {}
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  // Keep a ref of the current mode so lazy event handlers can read it.
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    videoLiveRef.current = videoLive;
  }, [videoLive]);

  // On mount: defer the network fetch until the section is near the
  // viewport (saves ~19MB on initial page load), then park at frame 0.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const init = () => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch (_) {}
    };
    const onSeeked = () => {
      seekReadyRef.current = true;
    };
    video.addEventListener("seeked", onSeeked);

    // Safety net — if `seeked` never fires (frame not buffered, decoder
    // hiccup, HD-source blob still loading), unblock the seek gate after
    // 220 ms so subsequent `currentTime` writes can still be attempted.
    // Without this the animation can appear "stuck" mid-scrub on slower
    // networks / production CDN latency.
    const seekTimeoutTick = () => {
      if (!seekReadyRef.current) seekReadyRef.current = true;
    };
    const seekTimeoutId = setInterval(seekTimeoutTick, 220);

    video.addEventListener("loadedmetadata", init, { once: true });

    let started = false;
    const startLoad = () => {
      if (started) return;
      started = true;
      try {
        video.preload = "auto";
        video.load();
      } catch (_) {}
    };
    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            startLoad();
            if (io) io.disconnect();
          }
        },
        { rootMargin: "150% 0px 150% 0px" }
      );
      io.observe(video);
    } else {
      startLoad();
    }

    if (video.readyState >= 1) init();

    return () => {
      video.removeEventListener("loadedmetadata", init);
      video.removeEventListener("seeked", onSeeked);
      if (seekTimeoutId) clearInterval(seekTimeoutId);
      if (io) io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Watch buffering: once the file is FULLY buffered, park the video on the
  // frame matching the current mode, then hand the transition over to the
  // real video scrub (stills fade away).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let interval = null;
    let cancelled = false;

    const check = () => {
      if (cancelled || videoLiveRef.current) return;
      const d = video.duration;
      if (!Number.isFinite(d) || d <= 0) return;
      const b = video.buffered;
      if (!(b.length > 0 && b.end(b.length - 1) >= d - 0.3)) return;

      cancelled = true;
      if (interval) clearInterval(interval);

      const target = modeRef.current === "push" ? Math.max(0, d - 0.05) : 0;
      const goLive = () => setVideoLive(true);
      if (Math.abs(video.currentTime - target) < 0.02) {
        goLive();
        return;
      }
      video.addEventListener("seeked", goLive, { once: true });
      try {
        video.currentTime = target;
      } catch (_) {
        video.removeEventListener("seeked", goLive);
        goLive();
      }
    };

    video.addEventListener("progress", check);
    video.addEventListener("canplaythrough", check);
    interval = setInterval(check, 700);
    check();

    return () => {
      cancelled = true;
      video.removeEventListener("progress", check);
      video.removeEventListener("canplaythrough", check);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Whenever the mode changes AND the video is live, scrub toward the end.
  // (Before that, the still-image crossfade below handles the transition.)
  useEffect(() => {
    if (!videoLive) return;
    const video = videoRef.current;
    if (!video) return;
    scrubTo(mode === "push" ? video.duration : 0);
  }, [mode, videoLive, scrubTo]);

  // -------------------------------------------------------------------------
  // Reusable content blocks are hoisted OUT of this component (see the
  // top-level HeadingBlock / ExamplesCardBlock functions defined below the
  // Approach export). Keeping them out means their React "type" is stable
  // across renders — so the video tiles inside ExamplesCardBlock never
  // unmount when `mode` flips, letting our opacity crossfade actually work.
  // -------------------------------------------------------------------------
  const headingProps = { mode, setMode, copy };
  const examplesProps = { mode, setLightbox };

  return (
    <section
      id="approach"
      data-testid={APPROACH.root}
      className="relative overflow-hidden section-px"
      style={{
        background: "transparent",
        paddingTop: "70px",
        paddingBottom: "70px",
      }}
    >
      <Reveal>
      <GlassSurface
        interactive={false}
        className="relative mx-auto w-full overflow-hidden rounded-[28px] mo-glass-strong"
        style={{ maxWidth: "1720px" }}
      >
        {/* Aspect-locked wrapper matches the video's natural aspect exactly. */}
        <div
          ref={wrapRef}
          className="relative w-full"
          style={{ aspectRatio: VIDEO_ASPECT }}
        >
          {/* Video backdrop — natural aspect, no zoom, no crop. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full select-none"
            style={{ objectFit: "cover" }}
            poster={WORKSPACE_POSTER_URL}
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={WORKSPACE_VIDEO_URL} type="video/mp4" />
            <source src="/videos/owl-workspace.webm" type="video/webm" />
          </video>

          {/* Still-image crossfade layers — the smooth fallback transition
              while the video is still streaming in. Night sits above the
              video; day fades in over it in Push mode. Both disappear once
              the fully-buffered video takes over. */}
          <img
            src={WORKSPACE_POSTER_URL}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              objectFit: "cover",
              opacity: videoLive ? 0 : 1,
              transition: "opacity 700ms ease",
            }}
          />
          <img
            src={WORKSPACE_DAY_URL}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{
              objectFit: "cover",
              opacity: !videoLive && mode === "push" ? 1 : 0,
              transition: `opacity ${TRANSITION_MS * 0.7}ms cubic-bezier(0.45, 0, 0.25, 1)`,
            }}
          />

          {/* Left-heavy readability wash (neutral dark, NO purple). */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.60) 22%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.08) 55%, transparent 68%)",
            }}
          />

          {/* Subtle inner border glow. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)",
            }}
          />

          {/* HEADING BLOCK — left side of the glass island. */}
          <div
            className="absolute hidden lg:flex flex-col justify-center"
            style={{
              left: "3.5%",
              top: "6%",
              bottom: "6%",
              width: "42%",
              zIndex: 3,
            }}
          >
            <div className="max-w-full">
              <HeadingBlock compact {...headingProps} />
            </div>
          </div>

          {/* EXAMPLES CARD — perspective-mapped onto the monitor screen quad. */}
          <div
            data-testid={APPROACH.captionCard}
            className="absolute hidden lg:block"
            style={{
              left: cardXf ? 0 : `${SCREEN_QUAD.tl[0]}%`,
              top: cardXf ? 0 : `${SCREEN_QUAD.tr[1]}%`,
              width: `${CARD_W}%`,
              height: `${CARD_H}%`,
              zIndex: 4,
              transform: cardXf || "none",
              transformOrigin: "0 0",
            }}
          >
            <ExamplesCardBlock onMonitor {...examplesProps} />
          </div>
        </div>

        {/* MOBILE STACKED CONTENT — below the video-aspect wrapper.
            Transparent background so the site-wide nightscape shows
            through, matching the glass-UI feel of the Push/Pull toggle
            and card. Previously this used a solid `--mo-bg-elev` slab
            that broke the atmospheric continuity on mobile. */}
        <div
          className="relative flex flex-col gap-8 p-6 pb-8 lg:hidden"
          style={{ background: "transparent" }}
        >
          <HeadingBlock {...headingProps} />
          <div data-testid={APPROACH.captionCard} className="w-full">
            <ExamplesCardBlock {...examplesProps} />
          </div>
        </div>
      </GlassSurface>
      </Reveal>

      {lightbox && (
        <VideoLightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// HeadingBlock — the "Our approach" eyebrow, the H2 headline, the Pull/Push
// toggle, and the italic metaphor caption. Hoisted to a top-level function
// (rather than defined inside <Approach>) so its React type is stable
// across renders — this is what allows the metaphor's dual-mounted
// crossfade below to actually animate instead of remounting.
// ---------------------------------------------------------------------------
function HeadingBlock({ compact = false, mode, setMode, copy }) {
  return (
    <>
      <div className="mono-eyebrow">
        <span style={{ color: "var(--mo-accent)" }}>//</span> Our approach
      </div>

      <h2
        className="mt-6 text-white"
        style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: compact
            ? "clamp(34px, 4vw, 64px)"
            : "clamp(40px, 5.6vw, 84px)",
          lineHeight: 1.02,
          letterSpacing: "-0.015em",
          fontWeight: 400,
        }}
      >
        Most brands{" "}
        <span style={{ color: "var(--mo-mute)", fontStyle: "italic" }}>
          push
        </span>{" "}
        content, ignoring what{" "}
        <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
          pulls
        </span>{" "}
        audiences.
      </h2>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <PremiumToggle value={mode} onChange={setMode} />
      </div>

      <GlassSurface
        interactive={false}
        className="mt-8 rounded-xl px-8 py-9 relative"
      >
        <div
          aria-live="polite"
          className="text-white relative"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: compact
              ? "clamp(18px, 1.7vw, 24px)"
              : "clamp(22px, 2.4vw, 32px)",
            fontStyle: "italic",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            minHeight: "1.3em",
          }}
        >
          {/* Dual-mounted crossfade — both metaphors always render on top
              of each other; only opacity + a small vertical drift change
              on mode swap. Feels like the copy is truly morphing instead
              of remounting. */}
          <span
            aria-hidden={mode !== "pull"}
            style={{
              position: "absolute",
              inset: 0,
              opacity: mode === "pull" ? 1 : 0,
              transform: mode === "pull" ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 620ms var(--ease-out-strong), transform 620ms var(--ease-out-strong)",
            }}
          >
            {copy.pull.metaphor}
          </span>
          <span
            aria-hidden={mode !== "push"}
            style={{
              position: "absolute",
              inset: 0,
              opacity: mode === "push" ? 1 : 0,
              transform: mode === "push" ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 620ms var(--ease-out-strong), transform 620ms var(--ease-out-strong)",
            }}
          >
            {copy.push.metaphor}
          </span>
          {/* Invisible placeholder so the container reserves the taller of
              the two metaphors' natural heights. */}
          <span style={{ visibility: "hidden" }}>
            {copy.pull.metaphor.length >= copy.push.metaphor.length
              ? copy.pull.metaphor
              : copy.push.metaphor}
          </span>
        </div>
      </GlassSurface>
    </>
  );
}

// ---------------------------------------------------------------------------
// ExamplesCardBlock — the "Examples" glass card with the 3-up video grid.
// Both PULL_VIDEOS and PUSH_VIDEOS grids are rendered simultaneously in
// the same slot and crossfaded via opacity + translate. Because this
// component is hoisted out of <Approach>, its identity is stable — so
// the individual <video> elements inside VideoTile do NOT unmount on
// mode swap. That's what removes the "rough / immediate" feel.
// ---------------------------------------------------------------------------
function ExamplesCardBlock({ onMonitor = false, mode, setLightbox }) {
  return (
    <GlassSurface
      interactive={false}
      className={`mo-glass-strong ${
        onMonitor ? "p-3 sm:p-3.5" : "rounded-2xl p-6 sm:p-7"
      }`}
      style={
        onMonitor
          ? {
              height: "100%",
              width: "100%",
              borderRadius: MONITOR_RADIUS,
              overflow: "hidden",
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <div
          className={`${
            onMonitor ? "text-[9px]" : "text-[10px]"
          } tracking-[0.28em] uppercase`}
          style={{
            color: "var(--mo-fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Examples
        </div>
        <div
          className={`${
            onMonitor ? "text-[9px]" : "text-[10px]"
          } tracking-[0.28em] uppercase relative`}
          style={{
            color: "var(--mo-accent)",
            fontFamily: "JetBrains Mono, monospace",
            minWidth: onMonitor ? "80px" : "110px",
            textAlign: "right",
          }}
        >
          {/* Smooth crossfade — both labels stay mounted; only opacity+
              translate change on mode swap. No React remount, no jump. */}
          <span
            aria-hidden={mode !== "pull"}
            style={{
              opacity: mode === "pull" ? 1 : 0,
              transform: mode === "pull" ? "translateY(0)" : "translateY(-4px)",
              transition: "opacity 520ms var(--ease-out-strong), transform 520ms var(--ease-out-strong)",
              display: "inline-block",
            }}
          >
            Made to hold
          </span>
          <span
            aria-hidden={mode !== "push"}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              opacity: mode === "push" ? 1 : 0,
              transform: mode === "push" ? "translateY(0)" : "translateY(4px)",
              transition: "opacity 520ms var(--ease-out-strong), transform 520ms var(--ease-out-strong)",
              display: "inline-block",
            }}
          >
            Made to broadcast
          </span>
        </div>
      </div>

      {/* Dual-mounted grid — both PULL and PUSH grids exist at all times
          in the same slot; we crossfade between them. Videos never
          unload, so there's no black-box flash and no snap on toggle. */}
      <div
        className={`${
          onMonitor ? "mt-2.5" : "mt-5"
        } relative`}
      >
        <div
          data-mode="pull"
          className={`${onMonitor ? "gap-2" : "gap-3"} grid grid-cols-3`}
          style={{
            opacity: mode === "pull" ? 1 : 0,
            transform: mode === "pull" ? "translateY(0) scale(1)" : "translateY(8px) scale(0.985)",
            transition: "opacity 560ms var(--ease-out-strong), transform 560ms var(--ease-out-strong)",
            pointerEvents: mode === "pull" ? "auto" : "none",
          }}
          aria-hidden={mode !== "pull"}
        >
          {PULL_VIDEOS.map((v, i) => (
            <VideoTile
              key={v.preview}
              src={v.preview}
              index={i}
              onPlay={() => setLightbox(v.full)}
            />
          ))}
        </div>
        <div
          data-mode="push"
          className={`${onMonitor ? "gap-2" : "gap-3"} grid grid-cols-3 absolute inset-0`}
          style={{
            opacity: mode === "push" ? 1 : 0,
            transform: mode === "push" ? "translateY(0) scale(1)" : "translateY(8px) scale(0.985)",
            transition: "opacity 560ms var(--ease-out-strong), transform 560ms var(--ease-out-strong)",
            pointerEvents: mode === "push" ? "auto" : "none",
          }}
          aria-hidden={mode !== "push"}
        >
          {PUSH_VIDEOS.map((v, i) => (
            <VideoTile
              key={v.preview}
              src={v.preview}
              index={i}
              onPlay={() => setLightbox(v.full)}
            />
          ))}
        </div>
      </div>

      <div
        className={`${
          onMonitor ? "mt-2.5 pt-2 text-[10px]" : "mt-6 pt-4 text-[11px]"
        } border-t leading-[1.5] relative`}
        style={{
          borderColor: "var(--mo-line)",
          color: "var(--mo-fg-dim)",
          fontFamily: "JetBrains Mono, monospace",
          minHeight: onMonitor ? "1.5em" : "1.7em",
        }}
      >
        {/* Same crossfade pattern for the caption — dual mounted, no remount. */}
        <span
          aria-hidden={mode !== "pull"}
          style={{
            opacity: mode === "pull" ? 1 : 0,
            transform: mode === "pull" ? "translateY(0)" : "translateY(-3px)",
            transition: "opacity 520ms var(--ease-out-strong) 60ms, transform 520ms var(--ease-out-strong) 60ms",
            display: "inline-block",
            position: "absolute",
            left: 0,
            right: 0,
            top: onMonitor ? "0.5rem" : "1rem",
          }}
        >
          Real examples from people who identified the opportunity early!
        </span>
        <span
          aria-hidden={mode !== "push"}
          style={{
            opacity: mode === "push" ? 1 : 0,
            transform: mode === "push" ? "translateY(0)" : "translateY(3px)",
            transition: "opacity 520ms var(--ease-out-strong) 60ms, transform 520ms var(--ease-out-strong) 60ms",
            display: "inline-block",
            position: "absolute",
            left: 0,
            right: 0,
            top: onMonitor ? "0.5rem" : "1rem",
          }}
        >
          Every brand is stuck here
        </span>
        {/* Invisible placeholder to preserve intrinsic caption height. */}
        <span style={{ visibility: "hidden" }}>Real examples from people who identified the opportunity early!</span>
      </div>
    </GlassSurface>
  );
}

// ---------------------------------------------------------------------------
// VideoTile — one autoplaying, muted example reel (Push mode). The play
// button opens the full version with sound in a lightbox.
// ---------------------------------------------------------------------------
function VideoTile({ src, index, onPlay }) {
  return (
    <GlassSurface
      className="relative overflow-hidden rounded-lg"
      contentClassName="absolute inset-0"
      tilt={4}
      style={{ aspectRatio: "9 / 14" }}
    >
      <video
        data-testid={`push-example-video-${index + 1}`}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ borderRadius: "inherit" }}
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace(".mp4", ".webm")} type="video/webm" />
      </video>
      <button
        type="button"
        data-testid={`push-example-play-${index + 1}`}
        aria-label="Play this video with sound"
        onClick={onPlay}
        className="group absolute inset-0 z-[5] grid cursor-pointer place-items-center"
        style={{ background: "transparent", border: "none" }}
      >
        <span
          className="mo-press grid h-9 w-9 place-items-center rounded-full border transition-transform duration-200 ease-out group-hover:scale-105"
          style={{
            borderColor: "rgba(255,255,255,0.45)",
            background: "rgba(8,8,10,0.55)",
            WebkitBackdropFilter: "blur(6px)",
            backdropFilter: "blur(6px)",
          }}
        >
          <span
            aria-hidden="true"
            className="ml-0.5 block h-0 w-0"
            style={{
              borderLeft: "8px solid white",
              borderTop: "5.5px solid transparent",
              borderBottom: "5.5px solid transparent",
            }}
          />
        </span>
      </button>
    </GlassSurface>
  );
}

// ---------------------------------------------------------------------------
// VideoLightbox — fullscreen overlay playing one example WITH sound.
// ---------------------------------------------------------------------------
function VideoLightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      data-testid="push-video-lightbox"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
      style={{
        background: "rgba(4,4,8,0.9)",
        WebkitBackdropFilter: "blur(14px)",
        backdropFilter: "blur(14px)",
      }}
      onClick={onClose}
    >
      <button
        type="button"
        data-testid="lightbox-close-btn"
        aria-label="Close video"
        onClick={onClose}
        className="mo-press absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border text-white transition-transform duration-200 ease-out hover:scale-105"
        style={{
          borderColor: "rgba(255,255,255,0.3)",
          background: "rgba(20,20,26,0.65)",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
      <div
        className="relative h-full max-h-[84vh]"
        style={{ aspectRatio: "9 / 16" }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          data-testid="lightbox-video"
          autoPlay
          controls
          playsInline
          className="h-full w-full rounded-xl object-contain"
          style={{ background: "#000" }}
        >
          <source src={src} type="video/mp4" />
          <source src={src.replace(".mp4", ".webm")} type="video/webm" />
        </video>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// ReelPreview — one video-thumbnail tile inside the Examples card (Pull mode).
// ---------------------------------------------------------------------------
function ReelPreview({ mode, kicker, title, compact = false }) {
  const tileStyle =
    mode === "pull"
      ? {
          background:
            "radial-gradient(80% 50% at 50% 20%, rgba(164,74,255,0.28), transparent 70%)",
          borderRadius: "inherit",
        }
      : {
          background:
            "linear-gradient(180deg, rgba(20,18,26,0.9) 0%, rgba(10,9,14,0.95) 100%)",
          borderRadius: "inherit",
        };

  const playSize = compact ? "h-5 w-5" : "h-6 w-6";
  const kickerSize = compact ? "text-[8px]" : "text-[9px]";
  const titleSize = compact ? "11.5px" : "13px";
  const inset = compact ? "inset-x-1.5 bottom-1.5" : "inset-x-2.5 bottom-2.5";
  const playInset = compact ? "right-1 top-1" : "right-2 top-2";

  return (
    <GlassSurface
      className="relative rounded-lg"
      contentClassName="absolute inset-0"
      tilt={4}
      style={{ aspectRatio: "9 / 14" }}
    >
      <div className="absolute inset-0" style={tileStyle} />
      <div className="noise-overlay" aria-hidden="true" />

      <div
        className={`absolute ${playInset} grid ${playSize} place-items-center rounded-full border`}
        style={{
          borderColor: "rgba(255,255,255,0.28)",
          background: "rgba(10,10,11,0.4)",
          zIndex: 4,
        }}
      >
        <span
          aria-hidden="true"
          className="ml-0.5 block h-0 w-0"
          style={{
            borderLeft: compact ? "4px solid white" : "5px solid white",
            borderTop: compact
              ? "3px solid transparent"
              : "3.5px solid transparent",
            borderBottom: compact
              ? "3px solid transparent"
              : "3.5px solid transparent",
          }}
        />
      </div>

      <div className={`absolute ${inset}`} style={{ zIndex: 4 }}>
        <div
          className={`${kickerSize} tracking-[0.16em] uppercase`}
          style={{
            color:
              mode === "pull" ? "var(--mo-accent)" : "var(--mo-accent-warm)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {kicker}
        </div>
        <div
          className="mt-1 text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: titleSize,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      </div>
    </GlassSurface>
  );
}

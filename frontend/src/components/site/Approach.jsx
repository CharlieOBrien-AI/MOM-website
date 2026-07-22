import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GlassSurface from "@/components/glass/GlassSurface";
import PremiumToggle from "./PremiumToggle";
import Reveal from "./Reveal";
import FrameSequenceCanvas from "./FrameSequenceCanvas";
import { APPROACH } from "@/constants/testIds";

// ---------------------------------------------------------------------------
// Midnight Owl workspace scene — Push / Pull animation.
// Frame 0    = NIGHT (moon, awake owl, dark room)
// Last frame = DAY   (sunshine, sleeping owl, bright room)
//
// Rendered as a true image sequence on a <canvas>: 121 high-quality WebP
// stills (1920×1080, q=85) are preloaded then blitted at the target index
// on every animation frame. There is NO video element and NO video decoder
// in the loop — that eliminates codec seek latency, guarantees perfectly
// smooth bidirectional scrubbing on every device, and preserves every last
// bit of image detail (WebP q=85 is visually indistinguishable from source).
// ---------------------------------------------------------------------------
const WORKSPACE_FRAMES_BASE = "/approach-frames/frame_";
const WORKSPACE_FRAME_COUNT = 121;
const WORKSPACE_POSTER_URL = "/images/owl-workspace-night.jpg";

// Natural aspect of the workspace frames — the wrapper matches it exactly
// so percentage-anchored overlays map 1:1 onto video pixels (zero crop).
const VIDEO_ASPECT = "1920 / 1080";

// The monitor in the frame is slightly tilted (perspective), so the screen
// is a QUAD, not an axis-aligned rectangle. Corners are pixel-measured
// against the actual bezel INNER edge (where the LG monitor's plastic
// frame ends and the black LCD panel begins) in the 1920×1080 source
// frame — so the Examples card, once perspective-mapped onto this quad,
// sits FLUSH with the monitor screen with no visible bezel overlap and
// no black gap on any side.
const SCREEN_QUAD = {
  tl: [47.7, 29.4],
  tr: [79.4, 30.2],
  br: [79.4, 66.5],
  bl: [47.7, 66.0],
};
// Pre-transform card rectangle (% of wrapper). Matched to SCREEN_QUAD's
// average width/height so (a) the axis-aligned fallback still sits INSIDE
// the monitor screen if the homography hasn't computed yet, and (b) the
// pre-transform aspect closely matches the post-transform quad so tiles
// inside aren't visibly stretched by the mapping.
const CARD_W = 31.7; // %  = SCREEN_QUAD width  (79.4 − 47.7)
const CARD_H = 36.4; // %  = avg SCREEN_QUAD height ((66.5−30.2 + 66.0−29.4)/2)

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
    let disposed = false;
    let rafId = null;
    let tries = 0;

    const update = () => {
      if (disposed) return false;
      const W = el.clientWidth;
      const H = el.clientHeight;
      if (!W || !H) return false;
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
      const m = computeHomography(src, dst);
      if (m) setCardXf(m);
      return true;
    };

    // Retry on rAF until the wrapper has non-zero dimensions (handles the
    // edge case where the section is initially inside a display:none / not-
    // yet-laid-out ancestor — otherwise cardXf stays null and the card falls
    // back to an axis-aligned rectangle that overshoots the monitor bezel).
    const attempt = () => {
      if (disposed) return;
      if (update() || tries > 30) return;
      tries += 1;
      rafId = requestAnimationFrame(attempt);
    };
    attempt();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const copy = {
    pull: {
      metaphor:
        "Pull marketing is: Telling stories people care about, then showing how you can help.",
      examples: [
        { kicker: "01 · Story", title: "The $40k hiring mistake" },
        { kicker: "02 · Behind", title: "Why we killed our best feature" },
        { kicker: "03 · Lesson", title: "What I wish I knew at year one" },
      ],
    },
    push: {
      metaphor:
        "Push marketing is: Talking about yourself and hoping people care.",
      examples: [],
    },
  };
  const active = copy[mode];

  // -------------------------------------------------------------------------
  // Frame-sequence scrub controller — pure image blit, no video decoder.
  // Every tick we ease `idxRef.current` toward the target index (0 for pull,
  // last frame for push). FrameSequenceCanvas reads that ref and draws the
  // corresponding preloaded WebP to a <canvas>. Guaranteed smooth on every
  // device because there is no video seek in the loop.
  // -------------------------------------------------------------------------
  const idxRef = useRef(0); // fractional frame index the canvas reads
  const scrubRafRef = useRef(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (scrubRafRef.current) cancelAnimationFrame(scrubRafRef.current);
    const target = mode === "push" ? WORKSPACE_FRAME_COUNT - 1 : 0;
    const startVal = idxRef.current;
    const delta = target - startVal;
    if (Math.abs(delta) < 0.001) {
      idxRef.current = target;
      return;
    }
    const startPerf = performance.now();
    const step = (now) => {
      const t = Math.min((now - startPerf) / TRANSITION_MS, 1);
      // ease-in-out cubic — matches the previous transition feel.
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      idxRef.current = startVal + delta * e;
      if (t < 1) {
        scrubRafRef.current = requestAnimationFrame(step);
      }
    };
    scrubRafRef.current = requestAnimationFrame(step);
    return () => {
      if (scrubRafRef.current) cancelAnimationFrame(scrubRafRef.current);
    };
  }, [mode]);

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
        {/* MOBILE HEADING (above the workspace scene) — headline + toggle
            only. The metaphor + video grid come BELOW the scene so the
            user can see the owl scrubber changing as they hit the toggle. */}
        <div
          className="lg:hidden px-6 pt-6 pb-4"
          style={{ background: "transparent" }}
        >
          <HeadingBlock showMetaphor={false} {...headingProps} />
        </div>

        {/* Aspect-locked wrapper matches the frames' natural aspect exactly. */}
        <div
          ref={wrapRef}
          className="relative w-full"
          style={{ aspectRatio: VIDEO_ASPECT }}
        >
          {/* Frame-sequence backdrop — a <canvas> driven by a preloaded
              WebP image sequence. Zero video decoder in the loop → perfectly
              smooth push/pull scrubbing on every device, and every pixel
              is the original 1080p WebP quality (no video re-compression). */}
          <FrameSequenceCanvas
            frameCount={WORKSPACE_FRAME_COUNT}
            framesBase={WORKSPACE_FRAMES_BASE}
            posterSrc={WORKSPACE_POSTER_URL}
            idxRef={idxRef}
            priorityCount={9}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ objectFit: "cover" }}
            testId="approach-frame-canvas"
          />

          {/* Left-heavy readability wash — desktop only. On mobile the
              heading is stacked ABOVE the scene (not overlaid), so the
              wash isn't needed and only made the scene look muddy. */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
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

        {/* MOBILE STACKED CONTENT — below the workspace scene. Ordered so
            visitors see: heading + toggle (above) → owl scrubber scene →
            small metaphor caption → the three-video grid. No overlaid
            desktop-style overlay here; those live inside the scene wrapper
            above via `hidden lg:block` / `hidden lg:flex`. */}
        <div
          className="relative flex flex-col gap-5 p-6 pt-5 pb-8 lg:hidden"
          style={{ background: "transparent" }}
        >
          <MetaphorCaption {...headingProps} />
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
function HeadingBlock({ compact = false, mode, setMode, copy, showMetaphor = true }) {
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

      {showMetaphor ? (
      <GlassSurface
        interactive={false}
        className="mt-6 rounded-xl px-5 py-4 relative"
      >
        <div
          aria-live="polite"
          className="text-white relative"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: compact
              ? "clamp(14px, 1.15vw, 17px)"
              : "clamp(15px, 1.35vw, 19px)",
            fontStyle: "italic",
            lineHeight: 1.35,
            letterSpacing: "-0.005em",
            minHeight: "2.7em",
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
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// MetaphorCaption — the small italic caption that says "Pull marketing is:
// …" / "Push marketing is: …" with a smooth crossfade on mode swap. Used
// both inside the desktop HeadingBlock overlay and on its own in the
// mobile stack (between the workspace scene and the video grid).
// ---------------------------------------------------------------------------
function MetaphorCaption({ mode, copy, compact = false }) {
  return (
    <GlassSurface
      interactive={false}
      className="rounded-xl px-5 py-4 relative"
    >
      <div
        aria-live="polite"
        className="text-white relative"
        style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: compact
            ? "clamp(14px, 1.15vw, 17px)"
            : "clamp(15px, 1.35vw, 19px)",
          fontStyle: "italic",
          lineHeight: 1.35,
          letterSpacing: "-0.005em",
          minHeight: "2.7em",
        }}
      >
        <span
          aria-hidden={mode !== "pull"}
          style={{
            position: "absolute",
            inset: 0,
            opacity: mode === "pull" ? 1 : 0,
            transform: mode === "pull" ? "translateY(0)" : "translateY(-6px)",
            transition:
              "opacity 620ms var(--ease-out-strong), transform 620ms var(--ease-out-strong)",
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
            transition:
              "opacity 620ms var(--ease-out-strong), transform 620ms var(--ease-out-strong)",
          }}
        >
          {copy.push.metaphor}
        </span>
        <span style={{ visibility: "hidden" }}>
          {copy.pull.metaphor.length >= copy.push.metaphor.length
            ? copy.pull.metaphor
            : copy.push.metaphor}
        </span>
      </div>
    </GlassSurface>
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
        onMonitor ? "p-2 sm:p-2.5" : "rounded-2xl p-6 sm:p-7"
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
          onMonitor ? "mt-1.5 pt-1.5 text-[9px] leading-[1.3]" : "mt-6 pt-4 text-[11px] leading-[1.5]"
        } border-t relative`}
        style={{
          borderColor: "var(--mo-line)",
          color: "var(--mo-fg-dim)",
          fontFamily: "JetBrains Mono, monospace",
          minHeight: onMonitor ? "1.4em" : "1.7em",
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
            top: onMonitor ? "0.35rem" : "1rem",
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
            top: onMonitor ? "0.35rem" : "1rem",
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

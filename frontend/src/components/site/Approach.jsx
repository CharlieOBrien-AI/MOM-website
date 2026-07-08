import { useCallback, useEffect, useRef, useState } from "react";
import GlassSurface from "@/components/glass/GlassSurface";
import PremiumToggle from "./PremiumToggle";
import { APPROACH } from "@/constants/testIds";

// ---------------------------------------------------------------------------
// Midnight Owl workspace video.
// Frame 0  = NIGHT (moon, awake owl, dark room)
// Last frame = DAY (sunshine, sleeping owl, bright room)
// Video is 2560 × 1430 (≈1.79:1), all-intra H.264 for smooth bidirectional
// scrubbing on every platform (Windows Chrome/Edge, macOS Safari).
// Duration ≈ 5s @ 24fps.
//
// The physical monitor screen inside the frame (the display area,
// measured programmatically from the day frame) occupies:
//   x: 47.15% – 79.85%   (width  ≈32.4%)
//   y: 28.70% – 68.20%   (height ≈39.1%)
// We use slightly inset values below to anchor the Examples card so it
// sits exactly ON the monitor screen, with no cropping or overhang.
//
// The video is served from /public/videos so it lives on the same
// origin as the app — no CORS, faster loads. A JPG of the first frame
// (night state) is used as the poster so the section looks correct
// even before the video is buffered.
// ---------------------------------------------------------------------------
const WORKSPACE_VIDEO_URL = "/videos/owl-workspace.mp4";
const WORKSPACE_POSTER_URL = "/images/owl-workspace-night.jpg";

// Natural aspect of the workspace video — the wrapper matches it exactly
// so percentage-anchored overlays map 1:1 onto video pixels (zero crop).
const VIDEO_ASPECT = "2560 / 1430";

// Monitor screen region as fractions of the video frame.
const SCREEN = {
  left: 47.35, // %
  top: 28.9, // %
  width: 32.4, // %
  height: 39.1, // %
};

const TRANSITION_MS = 2600; // duration of the night↔day scrub

/**
 * Approach — Push / Pull section.
 *
 * The Push/Pull toggle scrubs a night↔day video of the same Midnight Owl
 * workspace and (in Push mode) drops the Examples card onto the monitor
 * screen. The whole thing is wrapped in a single "glass island" panel.
 */
export default function Approach() {
  const [mode, setMode] = useState("pull");
  const isPush = mode === "push";

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
      examples: [
        { kicker: "AD · Reach", title: "Check out our new feature." },
        { kicker: "AD · Reach", title: "We're hiring — join the team." },
        { kicker: "AD · Reach", title: "Industry leader in synergy." },
      ],
    },
  };
  const active = copy[mode];

  // -------------------------------------------------------------------------
  // Video scrub controller.
  //
  // HTML5 <video> doesn't reliably support negative playbackRate across
  // browsers, so we drive both directions manually via requestAnimationFrame
  // and video.currentTime. This gives us a smooth night → day AND day →
  // night transition using a single source file.
  // -------------------------------------------------------------------------
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const modeRef = useRef(mode);
  const readyRef = useRef(false);

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
      try {
        video.currentTime = startCT + delta * e;
      } catch (_) {}
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

  // On mount: kick the video load explicitly, then park at frame 0 (NIGHT).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const init = () => {
      readyRef.current = true;
      try {
        video.pause();
        video.currentTime = 0;
      } catch (_) {}
    };
    const onError = () => {
      // Video failed — poster stays visible so the section still reads.
      readyRef.current = false;
    };

    video.addEventListener("loadedmetadata", init, { once: true });
    video.addEventListener("error", onError);
    // Force the browser to actually fetch the resource. Some headless /
    // low-power contexts skip preload without this.
    try {
      video.load();
    } catch (_) {}

    if (video.readyState >= 1) init();

    return () => {
      video.removeEventListener("loadedmetadata", init);
      video.removeEventListener("error", onError);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Whenever the mode changes, scrub the video toward the correct end.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const run = () => {
      const target = modeRef.current === "push" ? video.duration : 0;
      scrubTo(target);
    };

    if (readyRef.current && Number.isFinite(video.duration) && video.duration > 0) {
      run();
    } else {
      const onReady = () => {
        readyRef.current = true;
        run();
      };
      video.addEventListener("loadedmetadata", onReady, { once: true });
      return () => video.removeEventListener("loadedmetadata", onReady);
    }
  }, [mode, scrubTo]);

  // -------------------------------------------------------------------------
  // Reusable content blocks — same markup in every layout.
  // -------------------------------------------------------------------------
  const HeadingBlock = ({ compact = false }) => (
    <>
      <div className="mono-eyebrow">
        <span style={{ color: "var(--mo-accent)" }}>//</span> Why pull wins
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
        className="mt-8 rounded-xl px-8 py-9"
      >
        <div
          aria-live="polite"
          className="text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: compact
              ? "clamp(18px, 1.7vw, 24px)"
              : "clamp(22px, 2.4vw, 32px)",
            fontStyle: "italic",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            transition: "opacity 280ms ease",
          }}
        >
          {active.metaphor}
        </div>
      </GlassSurface>
    </>
  );

  const ExamplesCardBlock = ({ onMonitor = false }) => (
    <GlassSurface
      interactive={false}
      className={`mo-glass-strong rounded-2xl ${
        onMonitor ? "p-3 sm:p-3.5" : "p-6 sm:p-7"
      }`}
      style={onMonitor ? { height: "100%", width: "100%" } : undefined}
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
          } tracking-[0.28em] uppercase`}
          style={{
            color: "var(--mo-accent)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {mode === "pull" ? "Made to hold" : "Made to broadcast"}
        </div>
      </div>

      <div
        className={`${
          onMonitor ? "mt-2.5 gap-2" : "mt-5 gap-3"
        } grid grid-cols-3`}
      >
        {active.examples.map((ex, i) => (
          <ReelPreview
            key={`${mode}-${i}`}
            mode={mode}
            kicker={ex.kicker}
            title={ex.title}
            compact={onMonitor}
          />
        ))}
      </div>

      <div
        className={`${
          onMonitor ? "mt-2.5 pt-2 text-[10px]" : "mt-6 pt-4 text-[11px]"
        } border-t leading-[1.5]`}
        style={{
          borderColor: "var(--mo-line)",
          color: "var(--mo-fg-dim)",
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {mode === "pull"
          ? "People lean in. Retention holds. Trust compounds."
          : "People scroll past. Reach rented. No trust built."}
      </div>
    </GlassSurface>
  );

  return (
    <section
      id="approach"
      data-testid={APPROACH.root}
      className="relative overflow-hidden section-px"
      style={{
        minHeight: "min(120vh, 1080px)",
        background: "transparent",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      {/* =====================================================================
          GLASS ISLAND — the entire section lives inside one large glass box.
          The video is the ambient backdrop of this box; the copy sits on the
          left, and the Examples card is anchored exactly to the monitor
          screen (in Push mode only).
         ===================================================================== */}
      <GlassSurface
        interactive={false}
        className="relative mx-auto w-full overflow-hidden rounded-[28px] mo-glass-strong"
        style={{ maxWidth: "1720px" }}
      >
        {/* Aspect-locked wrapper matches the video's natural aspect exactly.
            Everything is positioned in percentages of this wrapper so that
            the Examples card lands on the monitor screen at every viewport
            size — with zero crop, video pixels map 1:1 to overlay %. */}
        <div
          className="relative w-full"
          style={{ aspectRatio: VIDEO_ASPECT }}
        >
          {/* Video backdrop — natural aspect, no zoom, no crop.
              Local-served MP4 avoids CORS/range-request quirks on some CDNs.
              A JPG poster of the first frame (night) is shown while the
              video is buffering, so the section reads correctly instantly. */}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full select-none"
            style={{ objectFit: "cover" }}
            poster={WORKSPACE_POSTER_URL}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          >
            {/* High-quality H.264 first — decoded natively on Windows
                (Chrome/Edge/Firefox) and macOS (Safari). VP9 WebM is a
                fallback for browsers without H.264 support. */}
            <source src={WORKSPACE_VIDEO_URL} type="video/mp4" />
            <source src="/videos/owl-workspace.webm" type="video/webm" />
          </video>

          {/* Left-heavy readability wash (neutral dark, NO purple). Keeps
              the heading crisp against the busy backdrop. */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.60) 22%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.08) 55%, transparent 68%)",
            }}
          />

          {/* Subtle inner border glow so the island feels like a real
              piece of glass sitting above the page. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            style={{
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.4)",
            }}
          />

          {/* --------------------------------------------------------------
              HEADING BLOCK — left side of the glass island.
              Anchored in percentages so it stays aligned with the video.
             -------------------------------------------------------------- */}
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
              <HeadingBlock compact />
            </div>
          </div>

          {/* --------------------------------------------------------------
              EXAMPLES CARD — pinned to the monitor screen in Push mode.
              Coordinates come straight from the video-frame analysis and
              match the display area exactly (no cropping).
              The card cross-fades in/out with a tiny scale so it feels
              like it's being "turned on" like a screen.
             -------------------------------------------------------------- */}
          <div
            data-testid={APPROACH.captionCard}
            className="absolute hidden lg:block"
            style={{
              left: `${SCREEN.left}%`,
              top: `${SCREEN.top}%`,
              width: `${SCREEN.width}%`,
              height: `${SCREEN.height}%`,
              zIndex: 4,
              opacity: isPush ? 1 : 0,
              transform: isPush ? "scale(1)" : "scale(0.985)",
              transformOrigin: "center center",
              transition:
                "opacity 520ms cubic-bezier(0.4, 0, 0.2, 1) 220ms, transform 520ms cubic-bezier(0.4, 0, 0.2, 1) 220ms",
              pointerEvents: isPush ? "auto" : "none",
            }}
          >
            <ExamplesCardBlock onMonitor />
          </div>

          {/* --------------------------------------------------------------
              MOBILE / SMALL SCREEN FALLBACK — stacked layout inside the
              same glass island. The video still plays at natural aspect
              across the top, and the heading + examples sit below.
             -------------------------------------------------------------- */}
          <div
            className="lg:hidden absolute inset-0 flex flex-col"
            style={{ zIndex: 3 }}
          >
            {/* Push examples fill the monitor on mobile too, so we don't
                render the card overlay separately. Instead we let the
                fallback layout own everything. */}
          </div>
        </div>

        {/* ------------------------------------------------------------------
            MOBILE STACKED CONTENT — sits BELOW the video-aspect wrapper.
            This block is only visible below the lg breakpoint. It gives
            small screens a usable, readable version of the same content.
           ------------------------------------------------------------------ */}
        <div
          className="relative flex flex-col gap-8 p-6 pb-8 lg:hidden"
          style={{ background: "var(--mo-bg-elev)" }}
        >
          <HeadingBlock />
          <div data-testid={APPROACH.captionCard} className="w-full">
            <ExamplesCardBlock />
          </div>
        </div>
      </GlassSurface>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ReelPreview — one video-thumbnail tile inside the Examples card.
// In Push mode the card lives on the monitor so the tiles use a slightly
// more compact scale.
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

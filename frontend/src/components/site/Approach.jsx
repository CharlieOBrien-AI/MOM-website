import { useState } from "react";
import GlassSurface from "@/components/glass/GlassSurface";
import PremiumToggle from "./PremiumToggle";
import { APPROACH } from "@/constants/testIds";

// Midnight Owl workspace illustration — used as the cinematic backdrop
// when the section is in "push" mode. The monitor screen area of this
// same image is also cropped into the example card thumbnails.
const OWL_WORKSPACE_URL =
  "https://customer-assets.emergentagent.com/job_55a0303f-7d8a-4bf8-90a9-d58f4af2ebc8/artifacts/uej03n8m_image.png";

/**
 * Approach
 *
 * The centerpiece.
 * The Push/Pull toggle changes the copy of the entire section.
 * A small "video examples" box in the foreground acts as a passive showcase
 * of what pull vs push content actually looks like.
 */
export default function Approach() {
  const [mode, setMode] = useState("pull");
  const isPush = mode === "push";

  const copy = {
    pull: {
      italic: "pull.",
      label: "Pull · Attention earned",
      title: "Stories that hold attention.",
      caption: "The owl awake. People come to you.",
      chip: "Founder stories · Behind the build · Lessons",
      examples: [
        { kicker: "01 · Story", title: "The $40k hiring mistake" },
        { kicker: "02 · Behind", title: "Why we killed our best feature" },
        { kicker: "03 · Lesson", title: "What I wish I knew at year one" },
      ],
    },
    push: {
      italic: "pull.",
      label: "Push · Attention rented",
      title: "Announcements. Demos. Feature dumps.",
      caption: "The owl asleep. You go to them.",
      chip: "Product launches · Hiring · Corporate updates",
      examples: [
        { kicker: "AD · Reach", title: "Check out our new feature." },
        { kicker: "AD · Reach", title: "We're hiring — join the team." },
        { kicker: "AD · Reach", title: "Industry leader in synergy." },
      ],
    },
  };
  const active = copy[mode];

  // ---------------------------------------------------------------------
  // Reusable content blocks so push + pull share the exact same markup.
  // ---------------------------------------------------------------------
  const HeadingBlock = ({ compact = false }) => (
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
        Most content{" "}
        <span style={{ color: "var(--mo-mute)", fontStyle: "italic" }}>
          pushes.
        </span>{" "}
        The best founders{" "}
        <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
          {active.italic}
        </span>
      </h2>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <PremiumToggle value={mode} onChange={setMode} />
        <div
          aria-live="polite"
          className="text-[11px] tracking-[0.18em] uppercase"
          style={{
            color: "var(--mo-fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          <span style={{ color: "var(--mo-accent-warm)" }}>●</span>{" "}
          {active.caption}
        </div>
      </div>

      <GlassSurface
        interactive={false}
        className="mt-8 rounded-xl px-5 py-4"
      >
        <div
          className="text-[10px] tracking-[0.28em] uppercase"
          style={{
            color: "var(--mo-accent)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {active.label}
        </div>
        <div
          className="mt-3 text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: compact
              ? "clamp(18px, 1.7vw, 24px)"
              : "clamp(22px, 2.4vw, 32px)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            transition: "opacity 280ms ease",
          }}
        >
          {active.title}
        </div>
        <div
          className="mt-3 text-[12px] tracking-[0.14em]"
          style={{
            color: "var(--mo-fg-dim)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {active.chip}
        </div>
      </GlassSurface>
    </>
  );

  const ExamplesCardBlock = ({ compact = false }) => (
    <GlassSurface
      interactive={false}
      className={`mo-glass-strong rounded-2xl ${
        compact ? "p-3 sm:p-3.5" : "p-6 sm:p-7"
      }`}
      style={compact ? { height: "100%" } : undefined}
    >
      <div className="flex items-center justify-between">
        <div
          className={`${
            compact ? "text-[9px]" : "text-[10px]"
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
            compact ? "text-[9px]" : "text-[10px]"
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
        className={`${compact ? "mt-2.5 gap-2" : "mt-5 gap-3"} grid grid-cols-3`}
      >
        {active.examples.map((ex, i) => (
          <ReelPreview
            key={`${mode}-${i}`}
            mode={mode}
            kicker={ex.kicker}
            title={ex.title}
            compact={compact}
          />
        ))}
      </div>

      <div
        className={`${
          compact ? "mt-2.5 pt-2 text-[10px]" : "mt-6 pt-4 text-[11px]"
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
      className="relative overflow-hidden"
      style={{ minHeight: "min(120vh, 1080px)", background: "transparent" }}
    >
      {/* =========================================================
          PUSH MODE — desktop (lg+).
          The Midnight Owl workspace illustration is shown at its
          natural aspect (1672:941) inside a locked-aspect wrapper —
          no zoom, no cropping — and the Examples card is absolutely
          positioned to sit exactly INSIDE the monitor screen area
          (46.5%–78.5% × 29.4%–67% of the image). No purple tint.
         ========================================================= */}
      <div
        aria-hidden={!isPush}
        className="pointer-events-none absolute inset-0 hidden lg:flex items-center justify-center"
        style={{
          opacity: isPush ? 1 : 0,
          transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="relative w-full"
          style={{ maxWidth: "1800px", aspectRatio: "1672 / 941" }}
        >
          {/* Illustration — natural aspect, no zoom */}
          <img
            src={OWL_WORKSPACE_URL}
            alt=""
            className="absolute inset-0 block h-full w-full select-none"
            draggable="false"
            aria-hidden="true"
          />

          {/* Left-heavy readability wash — NEUTRAL DARK ONLY.
              No purple tint, no color mix, no violet glows. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.62) 22%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.06) 55%, transparent 65%)",
            }}
          />

          {/* Very soft top/bottom fades so the illustration edges
              dissolve into neighbouring sections. */}
          <div
            className="absolute inset-x-0 top-0 h-24"
            style={{
              background:
                "linear-gradient(180deg, var(--mo-bg) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-28"
            style={{
              background:
                "linear-gradient(0deg, var(--mo-bg) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* Mobile / small-screen push backdrop — simple centred image,
          natural aspect, no zoom, no purple tint. */}
      <div
        aria-hidden={!isPush}
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          opacity: isPush ? 1 : 0,
          transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <img
          src={OWL_WORKSPACE_URL}
          alt=""
          className="absolute left-0 right-0 top-0 block w-full select-none"
          draggable="false"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.65) 40%, var(--mo-bg) 85%)",
          }}
        />
      </div>

      {/* =========================================================
          DESKTOP PUSH LAYOUT — heading on the left of the
          illustration, Examples card sitting inside the monitor.
         ========================================================= */}
      {isPush && (
        <div
          className="absolute inset-0 hidden lg:flex items-center justify-center"
          style={{ zIndex: 2 }}
        >
          <div
            className="relative w-full"
            style={{ maxWidth: "1800px", aspectRatio: "1672 / 941" }}
          >
            {/* Heading block on the left */}
            <div
              className="absolute flex flex-col justify-center"
              style={{
                left: "4%",
                top: "8%",
                bottom: "8%",
                width: "40%",
              }}
            >
              <div className="max-w-full">
                <HeadingBlock compact />
              </div>
            </div>

            {/* Examples card locked to the monitor screen area.
                Source image screen coords: x 46.5–78.5%, y 29.4–67%.
                A tiny inset (0.6%) keeps the card visually inside
                the bezel rather than flush with it. */}
            <div
              data-testid={APPROACH.captionCard}
              className="absolute"
              style={{
                left: "47.1%",
                top: "30%",
                width: "30.7%",
                height: "36.3%",
              }}
            >
              <ExamplesCardBlock compact />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          FALLBACK LAYOUT — used in PULL mode always, and in PUSH
          mode on tablet/mobile (<lg). Structure unchanged from the
          original design.
         ========================================================= */}
      <div
        className={`relative mx-auto flex max-w-[1240px] flex-col gap-16 section-px pb-[140px] pt-[120px] lg:min-h-[100vh] lg:flex-row lg:items-center lg:gap-20 ${
          isPush ? "lg:hidden" : ""
        }`}
        style={{ zIndex: 1 }}
      >
        <div className="max-w-[560px] lg:flex-1">
          <HeadingBlock />
        </div>

        {/* Passive video-examples box */}
        <div
          data-testid={isPush ? undefined : APPROACH.captionCard}
          className="w-full lg:flex-1"
        >
          <ExamplesCardBlock />
        </div>
      </div>
    </section>
  );
}

function ReelPreview({ mode, kicker, title, compact = false }) {
  const isPush = mode === "push";

  // Pull → the original violet glow.
  // Push → the entire Examples card is already sitting INSIDE the
  //        monitor screen of the illustration, so each thumbnail is
  //        just a simple flat dark tile (no monitor-screen crop, no
  //        tint, no zoom). The tile blends with the surrounding
  //        card so it reads as "content playing on the monitor".
  const tileStyle = isPush
    ? {
        background:
          "linear-gradient(180deg, rgba(20,18,26,0.9) 0%, rgba(10,9,14,0.95) 100%)",
        borderRadius: "inherit",
      }
    : {
        background:
          "radial-gradient(80% 50% at 50% 20%, rgba(164,74,255,0.28), transparent 70%)",
        borderRadius: "inherit",
      };

  const playSize = compact ? "h-5 w-5" : "h-6 w-6";
  const kickerSize = compact ? "text-[8px]" : "text-[9px]";
  const titleSize = compact ? "12px" : "13px";
  const inset = compact ? "inset-x-2 bottom-2" : "inset-x-2.5 bottom-2.5";
  const playInset = compact ? "right-1.5 top-1.5" : "right-2 top-2";

  return (
    <GlassSurface
      className="relative rounded-lg"
      contentClassName="absolute inset-0"
      tilt={4}
      style={{ aspectRatio: "9 / 14" }}
    >
      <div className="absolute inset-0" style={tileStyle} />
      <div className="noise-overlay" aria-hidden="true" />

      {/* play glyph */}
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

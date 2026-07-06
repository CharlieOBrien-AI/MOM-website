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

  return (
    <section
      id="approach"
      data-testid={APPROACH.root}
      className="relative overflow-hidden"
      style={{ minHeight: "min(120vh, 1080px)", background: "transparent" }}
    >
      {/* ============================================================
          Midnight Owl workspace backdrop — visible only in "push" mode.
          Cross-fades cinematically when the toggle flips.
          Layer stack (bottom → top):
            1. The illustration itself, softly blurred so it doesn't
               compete with the foreground text.
            2. A left-heavy purple/black gradient — darker on the left
               where the headline sits, brighter on the right so the
               owl-outside-the-window remains visible.
            3. A vignette + top/bottom fades to make the section feel
               like it lives inside the same room as the rest of the
               page (no hard "pasted image" edges).
         ============================================================ */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isPush ? 1 : 0,
          transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 0,
        }}
      >
        {/* 1. Illustration */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${OWL_WORKSPACE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            filter: "blur(2px) saturate(0.85)",
            transform: "scale(1.04)", // avoid blurred edges peeking in
          }}
        />

        {/* 2a. Purple wash — infuses the illustration with the Midnight
                Owl palette so it feels like part of the brand world. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(58, 30, 92, 0.55) 0%, rgba(24, 14, 44, 0.62) 100%)",
            mixBlendMode: "color",
          }}
        />

        {/* 2b. Left-heavy darkening gradient (70–80% on left, ~35% on right).
                Keeps the heading side deeply readable while letting the owl
                on the right stay visible. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(6, 4, 14, 0.86) 0%, rgba(10, 6, 22, 0.78) 22%, rgba(14, 8, 28, 0.62) 48%, rgba(18, 10, 34, 0.42) 72%, rgba(20, 12, 38, 0.32) 100%)",
          }}
        />

        {/* 2c. Global tint using the site background colour so the section
                still feels like part of Midnight Owl. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10, 10, 11, 0.28) 0%, rgba(10, 10, 11, 0.10) 40%, rgba(10, 10, 11, 0.55) 100%)",
          }}
        />

        {/* 3a. Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 50%, transparent 45%, rgba(6, 4, 14, 0.55) 85%, rgba(6, 4, 14, 0.85) 100%)",
          }}
        />

        {/* 3b. Top + bottom edge fades — dissolve into neighbouring sections */}
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              "linear-gradient(180deg, var(--mo-bg) 0%, rgba(10,10,11,0.6) 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-48"
          style={{
            background:
              "linear-gradient(0deg, var(--mo-bg) 0%, rgba(10,10,11,0.6) 45%, transparent 100%)",
          }}
        />

        {/* 3c. Faint purple accent glow on the left, echoing --mo-accent,
                to anchor the headline visually. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 12% 42%, rgba(164, 74, 255, 0.18) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Foreground content */}
      <div
        className="relative mx-auto flex max-w-[1240px] flex-col gap-16 section-px pb-[140px] pt-[120px] lg:min-h-[100vh] lg:flex-row lg:items-center lg:gap-20"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-[560px] lg:flex-1">
          <div className="mono-eyebrow">
            <span style={{ color: "var(--mo-accent)" }}>//</span> Our approach
          </div>

          <h2
            className="mt-6 text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(40px, 5.6vw, 84px)",
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
                fontSize: "clamp(22px, 2.4vw, 32px)",
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
        </div>

        {/* Passive video-examples box */}
        <div
          data-testid={APPROACH.captionCard}
          className="w-full lg:flex-1"
        >
          <GlassSurface
            interactive={false}
            className="mo-glass-strong rounded-2xl p-6 sm:p-7"
          >
            <div className="flex items-center justify-between">
              <div
                className="text-[10px] tracking-[0.28em] uppercase"
                style={{
                  color: "var(--mo-fg-dim)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                Examples
              </div>
              <div
                className="text-[10px] tracking-[0.28em] uppercase"
                style={{
                  color: "var(--mo-accent)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {mode === "pull" ? "Made to hold" : "Made to broadcast"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {active.examples.map((ex, i) => (
                <ReelPreview key={`${mode}-${i}`} mode={mode} kicker={ex.kicker} title={ex.title} />
              ))}
            </div>

            <div
              className="mt-6 border-t pt-4 text-[11px] leading-[1.6]"
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
        </div>
      </div>
    </section>
  );
}

function ReelPreview({ mode, kicker, title }) {
  const isPush = mode === "push";

  // Pull mode → the original violet glow.
  // Push mode → we swap the flat glow for a tight crop of the monitor
  // display area from the Midnight Owl workspace illustration. The
  // monitor screen sits at roughly (46.5–78.5% × 29.4–67% ) of the
  // source image (centre at 62.5%, 48.2%). Zooming background-size to
  // ~300% of the container height guarantees the black display area
  // fully covers the 9:14 thumbnail — no bezel, no frame, just screen.
  const screenCropStyle = {
    backgroundImage: `url(${OWL_WORKSPACE_URL})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "64% 47%",
    backgroundSize: "auto 300%",
    borderRadius: "inherit",
  };

  const pullGlowStyle = {
    background:
      "radial-gradient(80% 50% at 50% 20%, rgba(164,74,255,0.28), transparent 70%)",
    borderRadius: "inherit",
  };

  return (
    <GlassSurface
      className="relative rounded-lg"
      contentClassName="absolute inset-0"
      tilt={4}
      style={{ aspectRatio: "9 / 14" }}
    >
      {/* Base layer: monitor-screen crop (push) OR violet glow (pull) */}
      <div className="absolute inset-0" style={isPush ? screenCropStyle : pullGlowStyle} />

      {/* Push-only: subtle inner shadow + faint scanline sheen so the
          "monitor screen" feels lit from within, not flat black. */}
      {isPush && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 30%, rgba(164, 74, 255, 0.10) 0%, transparent 55%), radial-gradient(120% 80% at 50% 100%, rgba(212, 162, 86, 0.10) 0%, transparent 60%)",
              borderRadius: "inherit",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 20px 30px -20px rgba(0,0,0,0.75), inset 0 -20px 30px -20px rgba(0,0,0,0.6)",
              borderRadius: "inherit",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      <div className="noise-overlay" aria-hidden="true" />

      {/* play glyph */}
      <div
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border"
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
            borderLeft: "5px solid white",
            borderTop: "3.5px solid transparent",
            borderBottom: "3.5px solid transparent",
          }}
        />
      </div>

      <div className="absolute inset-x-2.5 bottom-2.5" style={{ zIndex: 4 }}>
        <div
          className="text-[9px] tracking-[0.16em] uppercase"
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
            fontSize: "13px",
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>
      </div>
    </GlassSurface>
  );
}

import { useState } from "react";
import GlassSurface from "@/components/glass/GlassSurface";
import PremiumToggle from "./PremiumToggle";
import { APPROACH } from "@/constants/testIds";

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
      {/* Foreground content */}
      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-16 section-px pb-[140px] pt-[120px] lg:min-h-[100vh] lg:flex-row lg:items-center lg:gap-20">
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
  const glow =
    mode === "pull"
      ? "radial-gradient(80% 50% at 50% 20%, rgba(164,74,255,0.28), transparent 70%)"
      : "radial-gradient(80% 50% at 50% 20%, rgba(212,162,86,0.26), transparent 70%)";

  return (
    <GlassSurface
      className="relative rounded-lg"
      contentClassName="absolute inset-0"
      tilt={4}
      style={{ aspectRatio: "9 / 14" }}
    >
      <div className="absolute inset-0" style={{ background: glow, borderRadius: "inherit" }} />
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

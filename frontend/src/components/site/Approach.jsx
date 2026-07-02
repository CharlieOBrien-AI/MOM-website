import { useState } from "react";
import PremiumToggle from "./PremiumToggle";
import PushPullVisual from "./PushPullVisual";
import { APPROACH } from "@/constants/testIds";

export default function Approach() {
  const [mode, setMode] = useState("pull"); // default: Pull (night, owl awake)

  const copy = {
    pull: {
      title: "Stories that hold attention.",
      body:
        "Founder POVs. Behind the build. Real lessons. The camera stays close. People stop scrolling because there's something worth staying for.",
      chips: ["\"The $40k hiring mistake\"", "\"Why we killed our best feature\"", "\"What I wish I knew at year one\""],
      footer: "People lean in.",
    },
    push: {
      title: "Product demos. Announcements. Updates.",
      body:
        "Content designed to broadcast, not to connect. Feature lists dressed up as stories. Corporate language people learned to skip.",
      chips: ["\"Check out our new feature\"", "\"We're hiring\"", "\"Industry leader in...\""],
      footer: "People scroll right past.",
    },
  };

  const active = copy[mode];

  return (
    <section
      id="approach"
      data-testid={APPROACH.root}
      className="mx-auto max-w-[1240px] px-6 pb-[120px] pt-10 sm:px-8"
    >
      <div className="mono-eyebrow mb-4">
        <span style={{ color: "var(--mo-accent)" }}>//</span> Our approach
      </div>

      <h2
        className="max-w-[880px] text-white"
        style={{
          fontFamily: "Instrument Serif, serif",
          fontSize: "clamp(36px, 5vw, 76px)",
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
          pull.
        </span>
      </h2>

      <p
        className="mt-6 max-w-[560px] text-[14px] leading-[1.7]"
        style={{ color: "var(--mo-fg-dim)", fontFamily: "JetBrains Mono, monospace" }}
      >
        Same camera. Same founder. Opposite result. The difference is what you
        point it at — and whether it treats the viewer like a human or a target.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <PremiumToggle value={mode} onChange={setMode} />
        <div
          className="text-[11px] tracking-[0.18em] uppercase"
          style={{ color: "var(--mo-mute)", fontFamily: "JetBrains Mono, monospace" }}
        >
          {mode === "pull" ? "The owl awake. People come to you." : "The owl asleep. You go to them."}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_1fr]">
        <PushPullVisual mode={mode} />

        <div
          data-testid={APPROACH.captionCard}
          className="flex flex-col justify-between rounded-2xl border p-8"
          style={{
            borderColor: "var(--mo-line)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
          }}
        >
          <div>
            <div
              className="text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "var(--mo-accent)", fontFamily: "JetBrains Mono, monospace" }}
            >
              {mode === "pull" ? "Pull · Attention earned" : "Push · Attention rented"}
            </div>
            <h3
              className="mt-4 text-white"
              style={{
                fontFamily: "Instrument Serif, serif",
                fontSize: "clamp(24px, 2.4vw, 34px)",
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                transition: "opacity 280ms ease",
              }}
            >
              {active.title}
            </h3>
            <p
              className="mt-4 text-[14px] leading-[1.7]"
              style={{ color: "var(--mo-fg-dim)", fontFamily: "JetBrains Mono, monospace" }}
            >
              {active.body}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {active.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border px-3 py-1.5 text-[11px]"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    color: "var(--mo-fg-dim)",
                    borderColor: "var(--mo-line-strong)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div
            className="mt-8 border-t pt-6 text-[13px]"
            style={{
              borderColor: "var(--mo-line)",
              color: mode === "pull" ? "var(--mo-fg)" : "var(--mo-mute)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {active.footer}
          </div>
        </div>
      </div>
    </section>
  );
}

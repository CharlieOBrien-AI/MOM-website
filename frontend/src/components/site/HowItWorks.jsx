import GlassSurface from "@/components/glass/GlassSurface";
import { PROCESS } from "@/constants/testIds";

// Each step carries three levels of information:
//   1. Step name (simple)
//   2. One-sentence outcome (why the step exists)
//   3. Small supporting bullets (depth without overwhelm)
const steps = [
  {
    n: "1",
    title: "Audience Research",
    outcome: "Find what people already care about.",
    bullets: ["Competitor research", "Audience psychology", "Topic validation"],
  },
  {
    n: "2",
    title: "Story Development",
    outcome: "Turn those insights into irresistible ideas.",
    bullets: ["Content angles", "Curiosity hooks", "Scripts"],
  },
  {
    n: "3",
    title: "Production",
    outcome: "Capture content that feels authentic.",
    bullets: ["Creative direction", "Filming", "Footage review"],
  },
  {
    n: "4",
    title: "Retention Editing",
    outcome: "Keep people watching.",
    bullets: ["Story pacing", "Motion & subtitles", "Sound design"],
  },
  {
    n: "5",
    title: "Distribution",
    outcome: "Put every video in front of the right people.",
    bullets: ["Multi-platform publishing", "Platform optimization", "Performance tracking"],
  },
  {
    n: "6",
    title: "Trust",
    outcome:
      "Attention compounds into familiarity. Familiarity becomes trust. Trust becomes customers.",
    bullets: ["Retarget warm audiences", "Double down on what works", "Repeat"],
  },
];

export default function HowItWorks() {
  return (
    <section
      data-testid={PROCESS.root}
      style={{ background: "transparent", position: "relative" }}
    >
      <div className="mx-auto max-w-[1240px] section-px py-[120px]">
        <div className="mono-eyebrow mb-4">
          <span style={{ color: "var(--mo-accent)" }}>//</span> How it works
        </div>

        <h2
          className="text-white"
          style={{
            fontFamily: "Instrument Serif, serif",
            fontSize: "clamp(36px, 5vw, 68px)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            maxWidth: "900px",
          }}
        >
          {"How We Create Content That"}{" "}
          <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
            Pulls People In.
          </span>
        </h2>

        {/* Vertical flow — six steps, each with three levels of info:
            step name → one-sentence outcome → small supporting bullets.
            A ↓ connector between cards makes the pipeline read top-down. */}
        <div className="mt-14 flex flex-col">
          {steps.map((s, i) => (
            <div key={s.n}>
              <GlassSurface
                interactive={false}
                data-testid={`process-step-${i}`}
                className="rounded-2xl"
              >
                <div className="grid gap-6 p-7 sm:p-9 md:grid-cols-[104px_1fr] md:gap-8 md:p-10">
                  {/* Level 0 — circled step number */}
                  <div className="flex md:justify-center">
                    <div
                      aria-hidden="true"
                      className="grid h-14 w-14 place-items-center rounded-full border"
                      style={{
                        borderColor: "rgba(164, 74, 255, 0.45)",
                        background: "rgba(164, 74, 255, 0.08)",
                        color: "var(--mo-accent)",
                        fontFamily: "Instrument Serif, serif",
                        fontSize: "26px",
                        lineHeight: 1,
                      }}
                    >
                      {s.n}
                    </div>
                  </div>

                  <div>
                    {/* Level 1 — step name */}
                    <h3
                      className="text-white"
                      style={{
                        fontFamily: "Instrument Serif, serif",
                        fontSize: "clamp(26px, 3vw, 40px)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.1,
                      }}
                    >
                      {s.title}
                    </h3>

                    {/* Level 2 — one-sentence outcome */}
                    <p
                      className="mt-3 max-w-[640px] text-[15px] leading-[1.7]"
                      style={{
                        color: "var(--mo-fg)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {s.outcome}
                    </p>

                    {/* Level 3 — small supporting bullets */}
                    <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2.5">
                      {s.bullets.map((b) => (
                        <div
                          key={b}
                          className="text-[12px] tracking-[0.08em]"
                          style={{
                            color: "var(--mo-fg-dim)",
                            fontFamily: "JetBrains Mono, monospace",
                          }}
                        >
                          <span style={{ color: "var(--mo-accent)" }}>•</span>{" "}
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassSurface>

              {/* ↓ connector between steps */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="flex justify-center py-2.5"
                  style={{
                    color: "var(--mo-accent)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "18px",
                    opacity: 0.7,
                  }}
                >
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

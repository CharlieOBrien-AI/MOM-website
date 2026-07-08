import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [idx, setIdx] = useState(0);
  const trackRef = useRef(null);
  const total = steps.length;

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  // Keyboard support when the section is in view
  useEffect(() => {
    const onKey = (e) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      if (!inView) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section
      data-testid={PROCESS.root}
      style={{ background: "transparent", position: "relative" }}
    >
      <div className="mx-auto max-w-[1240px] section-px py-[120px]">
        <div className="mono-eyebrow mb-4">
          <span style={{ color: "var(--mo-accent)" }}>//</span> How it works
        </div>

        <div className="flex flex-wrap items-end justify-between gap-8">
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

          <div className="flex items-center gap-3">
            <div
              className="text-[11px] tracking-[0.24em] uppercase"
              data-testid="process-step-indicator"
              style={{
                color: "var(--mo-fg-dim)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <span style={{ color: "var(--mo-accent)" }}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(total).padStart(2, "0")}
            </div>
            <button
              type="button"
              onClick={prev}
              data-testid="process-prev"
              aria-label="Previous step"
              className="grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 hover:-translate-x-0.5 hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ChevronLeft size={18} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={next}
              data-testid="process-next"
              aria-label="Next step"
              className="grid h-11 w-11 place-items-center rounded-full border transition-all duration-300 hover:translate-x-0.5 hover:border-[var(--mo-accent)] hover:text-[var(--mo-accent)]"
              style={{
                borderColor: "var(--mo-line-strong)",
                color: "var(--mo-fg-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ChevronRight size={18} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Carousel — full-width single step wrapped in the Glass surface */}
        <div ref={trackRef} className="mt-12">
          <GlassSurface interactive={false} className="rounded-2xl overflow-hidden">
            <div
              className="flex"
              style={{
                width: `${total * 100}%`,
                transform: `translate3d(-${(idx * 100) / total}%, 0, 0)`,
                transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  data-testid={`process-step-${i}`}
                  className="grid items-start gap-10 p-8 sm:p-12 md:grid-cols-[220px_1fr] md:p-16"
                  style={{ width: `${100 / total}%`, flexShrink: 0 }}
                >
                  <div>
                    <div
                      className="text-[68px] leading-none"
                      style={{
                        fontFamily: "Instrument Serif, serif",
                        color: "var(--mo-accent)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div
                      className="mt-3 text-[10px] tracking-[0.28em] uppercase"
                      style={{
                        color: "var(--mo-mute)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      Step {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-white"
                      style={{
                        fontFamily: "Instrument Serif, serif",
                        fontSize: "clamp(32px, 4vw, 56px)",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.05,
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="mt-5 max-w-[600px] text-[15px] leading-[1.75]"
                      style={{
                        color: "var(--mo-fg)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {s.outcome}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5">
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
              ))}
            </div>

            {/* Progress bar */}
            <div
              className="h-[2px] w-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                style={{
                  width: `${((idx + 1) / total) * 100}%`,
                  height: "100%",
                  background: "var(--mo-accent)",
                  transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </GlassSurface>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              data-testid={`process-dot-${i}`}
              aria-label={`Go to step ${i + 1}`}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                height: 6,
                width: i === idx ? 24 : 6,
                background: i === idx ? "var(--mo-accent)" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GlassSurface from "@/components/glass/GlassSurface";
import { PROCESS } from "@/constants/testIds";

const steps = [
  {
    n: "01",
    title: "Discovery",
    body: "We get into your world and find the angles worth filming.",
    detail:
      "A structured intake plus a founder interview. We map your business, audience, and the stories only you can tell.",
  },
  {
    n: "02",
    title: "Angles",
    body: "A backlog of story ideas, ranked by what will land.",
    detail:
      "Every idea is scored on hook strength, on-brand fit, and business impact. You get a living slate — never a random posting calendar.",
  },
  {
    n: "03",
    title: "Scripting",
    body: "Loose enough to sound like you, tight enough to hold a hook.",
    detail:
      "We write beats, not lines. You keep your voice; we handle structure, pacing and the payoff.",
  },
  {
    n: "04",
    title: "Filming",
    body: "One relaxed shoot day a month. We bring the kit and the calm.",
    detail:
      "A single half-day monthly. Professional gear, minimal setup, no crew crowding you. Batch a month of stories in a morning.",
  },
  {
    n: "05",
    title: "Edit",
    body: "Captions, pacing, sound. The work that wins watch time.",
    detail:
      "Native cuts per platform, sound design, motion titles and burned-in captions. Every second earns the next one.",
  },
  {
    n: "06",
    title: "Publish",
    body: "Posted on a rhythm, native to each platform.",
    detail:
      "Scheduled to the beat of each channel. Metadata, thumbnails and community replies handled by us — you just show up.",
  },
];

export default function HowItWorks() {
  const [idx, setIdx] = useState(0);
  const trackRef = useRef(null);
  const total = steps.length;

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  // Keyboard support when the section is focused
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
              lineHeight: 1,
              letterSpacing: "-0.015em",
            }}
          >
            {"So here's how we"}{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              fix it.
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
              <span style={{ color: "var(--mo-accent)" }}>{String(idx + 1).padStart(2, "0")}</span>
              {" / "}
              {String(total).padStart(2, "0")}
            </div>
            <GlassSurface
              as="button"
              type="button"
              onClick={prev}
              data-testid="process-prev"
              aria-label="Previous step"
              tilt={2}
              className="grid h-11 w-11 place-items-center rounded-full"
              style={{ color: "var(--mo-fg-dim)" }}
            >
              <ChevronLeft size={18} strokeWidth={1.6} />
            </GlassSurface>
            <GlassSurface
              as="button"
              type="button"
              onClick={next}
              data-testid="process-next"
              aria-label="Next step"
              tilt={2}
              className="grid h-11 w-11 place-items-center rounded-full"
              style={{ color: "var(--mo-fg-dim)" }}
            >
              <ChevronRight size={18} strokeWidth={1.6} />
            </GlassSurface>
          </div>
        </div>

        {/* Carousel — full-width single step */}
        <GlassSurface
          interactive={false}
          className="relative mt-12 rounded-2xl overflow-hidden"
        >
          <div ref={trackRef}>
            <div
              className="flex"
              style={{
                width: `${total * 100}%`,
                transform: `translate3d(-${(idx * 100) / total}%, 0, 0)`,
                transition: "transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {steps.map((s) => (
                <div
                  key={s.n}
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
                      {s.n}
                    </div>
                    <div
                      className="mt-3 text-[10px] tracking-[0.28em] uppercase"
                      style={{
                        color: "var(--mo-mute)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      Step {s.n}
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
                      className="mt-5 max-w-[560px] text-[15px] leading-[1.75]"
                      style={{
                        color: "var(--mo-fg)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {s.body}
                    </p>
                    <p
                      className="mt-4 max-w-[560px] text-[13px] leading-[1.7]"
                      style={{
                        color: "var(--mo-fg-dim)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div
              className="h-[2px] w-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
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
          </div>
        </GlassSurface>

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

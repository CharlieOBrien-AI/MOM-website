import HeroScrubVideo from "./HeroScrubVideo";
import { HERO } from "@/constants/testIds";

export default function Hero() {
  return (
    <section
      id="top"
      data-testid={HERO.root}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Scrub-controlled background video */}
      <HeroScrubVideo src="/videos/left-right.mp4" />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-[1240px] px-6 pt-24 sm:px-8">
        <div className="max-w-[880px] stagger">
          <div className="mono-eyebrow" data-testid="hero-eyebrow">
            <span style={{ color: "var(--mo-accent)" }}>//</span> Storytelling-first content studio
          </div>

          <h1
            data-testid={HERO.headline}
            className="mt-8 text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(48px, 8.4vw, 132px)",
              lineHeight: 0.96,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            We help you build{" "}
            <span
              className="relative whitespace-nowrap"
              style={{ color: "var(--mo-mute)" }}
            >
              <span style={{ fontStyle: "italic" }}>30 reels a month</span>
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-[54%] block"
                style={{
                  height: "3px",
                  background: "var(--mo-accent)",
                  transform: "rotate(-1.2deg)",
                }}
              />
            </span>{" "}
            <span style={{ color: "var(--mo-accent)", fontStyle: "italic" }}>
              trust.
            </span>
          </h1>

          <p
            data-testid={HERO.copy}
            className="mt-8 max-w-[560px] text-[15px] leading-[1.7]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            We make videos that make people{" "}
            <span style={{ color: "var(--mo-accent)" }}>care</span>. Same camera,
            same founder — the difference is what you point it at.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              data-testid={HERO.ctaPrimary}
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase transition-transform duration-300 hover:translate-y-[-1px]"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                background: "var(--mo-fg)",
                color: "var(--mo-bg)",
                boxShadow:
                  "0 10px 40px -14px rgba(212,162,86,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {"Let's talk"}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            <a
              href="#work"
              data-testid={HERO.ctaSecondary}
              className="group inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors duration-300"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                borderColor: "var(--mo-line-strong)",
                background: "rgba(255,255,255,0.03)",
                color: "var(--mo-fg)",
              }}
            >
              Explore the work
            </a>
          </div>
        </div>
      </div>

      {/* Scrub interaction hint */}
      <div
        data-testid={HERO.scrubHint}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <div
          className="flex items-center gap-3 rounded-full border px-4 py-2 text-[10px] tracking-[0.28em] uppercase"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            borderColor: "var(--mo-line-strong)",
            background: "rgba(10,10,11,0.6)",
            color: "var(--mo-fg-dim)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--mo-accent)" }}
          />
          Move cursor · Scrub the night
          <span aria-hidden="true">← →</span>
        </div>
      </div>
    </section>
  );
}

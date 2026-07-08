import HeroScrubVideo from "./HeroScrubVideo";
import TextRotator from "./TextRotator";
import GlassSurface from "@/components/glass/GlassSurface";
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
      <div className="relative mx-auto w-full max-w-[1240px] section-px pt-24">
        <div className="max-w-[880px] stagger">
          <div className="mono-eyebrow" data-testid="hero-eyebrow">
            <span style={{ color: "var(--mo-accent)" }}>//</span> Storytelling-first content studio
          </div>

          <h1
            data-testid={HERO.headline}
            className="mt-8 text-white"
            style={{
              fontFamily: "Instrument Serif, serif",
              fontSize: "clamp(40px, 6.2vw, 96px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            We help you build{" "}
            <span
              className="relative whitespace-nowrap"
              style={{ color: "var(--mo-mute)" }}
            >
              <span style={{ fontStyle: "italic" }}>30 videos a month</span>
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-[54%] block mo-strike-draw"
                style={{
                  height: "3px",
                  background: "var(--mo-accent-warm)",
                }}
              />
            </span>
            <br />
            <TextRotator
              words={["trust.", "loyalty.", "community."]}
              style={{ color: "var(--mo-accent)", fontStyle: "italic" }}
            />
          </h1>

          <p
            data-testid={HERO.copy}
            className="mt-8 max-w-[560px] text-[14.5px] leading-[1.7]"
            style={{
              color: "var(--mo-fg-dim)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            We make videos that make people{" "}
            <span style={{ color: "var(--mo-accent)" }}>care</span>.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <GlassSurface
              as="a"
              href="#contact"
              data-testid={HERO.ctaPrimary}
              tilt={3}
              className="mo-glass-pill mo-glass-lit group inline-flex items-center gap-2 px-6 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "var(--mo-fg)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06) 60%), linear-gradient(180deg, rgba(24,18,46,0.35), rgba(10,8,22,0.5))",
              }}
            >
              {"Let's talk"}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </GlassSurface>

            <GlassSurface
              as="a"
              href="#work"
              data-testid={HERO.ctaSecondary}
              tilt={3}
              className="mo-glass-pill group inline-flex items-center gap-2 px-6 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "var(--mo-fg)",
              }}
            >
              Explore the work
            </GlassSurface>
          </div>
        </div>
      </div>
    </section>
  );
}

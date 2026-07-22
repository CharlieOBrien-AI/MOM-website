import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroScrubVideo from "./HeroScrubVideo";
import TextRotator from "./TextRotator";
import GlassSurface from "@/components/glass/GlassSurface";
import { HERO } from "@/constants/testIds";

export default function Hero() {
  // Headline choreography: "30 videos a month" starts pure white with no
  // strikethrough and nothing below it; after ~3.5s the strike draws in,
  // the text dims to grey and the rotator line fades up.
  const [struck, setStruck] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStruck(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="top"
      data-testid={HERO.root}
      className="relative flex flex-col overflow-hidden pt-[68px] lg:aspect-video lg:justify-center lg:pt-0"
    >
      {/* Video layer — mobile/tablet: in-flow 16:9 block (full frame, no crop);
          desktop: fills the aspect-locked section so the frame maps 1:1. */}
      <div className="relative isolate aspect-video w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <HeroScrubVideo />
        {/* Grounding shadow — a soft dark vignette at the bottom edge of the
            hero that eases the eye from the owl scene into the site-wide
            nightscape below. Sits on top of the video (which is already
            mask-faded to transparent in its lowest 28 %) so it darkens both
            the fading hero pixels AND the site background peeking through,
            making the whole boundary feel like ONE atmospheric horizon
            rather than a Hero rectangle stacked on top of a separate sky. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "48%",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.92) 100%)",
            zIndex: 5,
          }}
        />
      </div>

      {/* Content — explicit z-index keeps the copy above the video layers */}
      <div className="relative z-10 mx-auto w-full max-w-[1240px] section-px py-12 lg:py-0 lg:pt-24">
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
              style={{
                color: struck ? "var(--mo-mute)" : "#ffffff",
                transition: "color 900ms ease",
              }}
            >
              <span style={{ fontStyle: "italic" }}>30 videos a month</span>
              <span
                aria-hidden="true"
                data-testid="hero-strike"
                className="absolute left-0 top-[54%] block"
                style={{
                  height: "3px",
                  width: struck ? "100%" : "0%",
                  background: "var(--mo-accent-warm)",
                  transition: "width 900ms cubic-bezier(0.65, 0, 0.35, 1)",
                }}
              />
            </span>
            <br />
            <span
              data-testid="hero-rotator-line"
              style={{
                opacity: struck ? 1 : 0,
                transition: "opacity 800ms ease 350ms",
              }}
            >
              <TextRotator
                words={["trust.", "loyalty.", "a community."]}
                active={struck}
                style={{ color: "var(--mo-accent)", fontStyle: "italic" }}
              />
            </span>
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
              as={Link}
              to="/brief"
              data-testid={HERO.ctaPrimary}
              tilt={3}
              className="mo-glass-pill mo-glass-lit mo-press group inline-flex items-center gap-2 px-6 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: "var(--mo-fg)",
              }}
            >
              Schedule a call
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </GlassSurface>

            <GlassSurface
              as="a"
              href="#work"
              data-testid={HERO.ctaSecondary}
              tilt={3}
              className="mo-glass-pill mo-press group inline-flex items-center gap-2 px-6 py-3.5 text-[12px] font-medium tracking-[0.16em] uppercase"
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
